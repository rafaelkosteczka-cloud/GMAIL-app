/**
 * SISTEMA SION - EXPORTADOR DE FILTROS GMAIL (VERSÃO INTEGRAL)
 * Tradução fiel da lógica Python para Google Apps Script.
 */

function gerarEntregaSionIntegral() {
  const ss = getPlanilhaAppGmail_();
  const ui = SpreadsheetApp.getUi();
  
  // 1. EXTRAÇÃO DE DADOS (Equivalente ao extrair_dados do Python)
  const regrasManual = extrairDadosAba_("Regras");
  const regrasAuto = extrairDadosAba_("Regras Auto");
  const regrasTotais = regrasManual.concat(regrasAuto);

  if (regrasTotais.length === 0) {
    ui.alert("⚠️ Nenhuma regra encontrada nas abas 'Regras' ou 'Regras Auto'.");
    return;
  }

  // =========================================================
  // PASSO 1: XML DE ESTRUTURA (CRIAÇÃO DAS PASTAS)
  // =========================================================
  let pastasVistas = new Set();
  let xmlEstrutura = abrirFeedXML_();

  regrasTotais.forEach(regra => {
    let marcador = buscarValor_(regra, "Marcador selecionado");
    if (!marcador || ["0", "falso", "false"].includes(marcador.toLowerCase())) return;

    let partes = marcador.split('/');
    let caminho = "";
    partes.forEach((p, i) => {
      caminho = (i === 0) ? p : caminho + "/" + p;
      if (!pastasVistas.has(caminho)) {
        pastasVistas.add(caminho);
        xmlEstrutura += montarEntryEstrutura_(caminho);
      }
    });
  });
  xmlEstrutura += '</feed>';

  // =========================================================
  // PASSO 2: XML DE FILTROS (AGRUPAMENTO POR "CHAVE" DE AÇÃO)
  // =========================================================
  let agrupamento = {};

  regrasTotais.forEach(regra => {
    let crit1 = buscarValor_(regra, "Critério 1");
    let crit2 = buscarValor_(regra, "Critério 2");
    let marcador = buscarValor_(regra, "Marcador selecionado");
    let tipoCrit = buscarValor_(regra, "Tipo Critério Busca Email").toUpperCase();

    if ((!crit1 && !crit2) || ["", "0", "false"].includes(marcador.toLowerCase())) return;

    // A "Chave" de agrupamento (Se essas ações forem iguais, o script agrupa os e-mails com OR)
    let acoes = [
      marcador, tipoCrit,
      isTrue_(regra, "Ignorar a caixa de entrada"),
      isTrue_(regra, "Marcar como lida"),
      isTrue_(regra, "Marcar com estrela"),
      isTrue_(regra, "Sempre marcar como importante"),
      isTrue_(regra, "Nunca marcar como importante"),
      isTrue_(regra, "Excluir"),
      isTrue_(regra, "Nunca enviar para Spam"),
      buscarValor_(regra, "Escolha um endereço:")
    ];
    let chave = acoes.join('|');

    if (!agrupamento[chave]) agrupamento[chave] = new Set();
    if (crit1 && crit1 !== "0") agrupamento[chave].add(crit1);
    if (crit2 && crit2 !== "0") agrupamento[chave].add(crit2);
  });

  let xmlFiltros = abrirFeedXML_();
  for (let chave in agrupamento) {
    let criterios = Array.from(agrupamento[chave]);
    xmlFiltros += montarEntryFiltro_(chave, criterios);
  }
  xmlFiltros += '</feed>';

  // =========================================================
  // PASSO 3: DOWNLOAD DOS ARQUIVOS
  // =========================================================
  const blobEstrutura = Utilities.newBlob(xmlEstrutura, 'application/xml', '1_ESTRUTURA_SION.xml');
  const blobFiltros = Utilities.newBlob(xmlFiltros, 'application/xml', '2_FILTROS_SION.xml');
  
  oferecerDownload_(blobEstrutura, blobFiltros);
}

// --- FUNÇÕES AUXILIARES DE TRADUÇÃO ---

function extrairDadosAba_(nomeAba) {
  const ss = getPlanilhaAppGmail_();
  const aba = ss.getSheetByName(nomeAba);
  if (!aba || aba.getLastRow() < 3) return [];

  const rows = aba.getDataRange().getValues();
  const header = rows[1]; // Linha 2 é o cabeçalho no seu padrão
  let lista = [];

  for (let i = 2; i < rows.length; i++) {
    let obj = {};
    header.forEach((h, colIdx) => {
      obj[h] = rows[i][colIdx];
    });
    lista.push(obj);
  }
  return lista;
}

function buscarValor_(obj, trecho) {
  for (let chave in obj) {
    if (chave.toLowerCase().includes(trecho.toLowerCase())) return String(obj[chave]).trim();
  }
  return "";
}

function isTrue_(regra, trecho) {
  let v = buscarValor_(regra, trecho).toUpperCase();
  return ['X', 'TRUE', 'VERDADEIRO', 'SIM'].includes(v);
}

function abrirFeedXML_() {
  return '<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006">\n  <title>Mail Filters</title>\n';
}

function montarEntryEstrutura_(caminho) {
  let slug = caminho.replace(/\//g, '_');
  return `  <entry>\n    <category term="filter"></category>\n    <title>Mail Filter</title>\n    <apps:property name="subject" value="SISTEMA_CRIAR_PASTA_${slug}"></apps:property>\n    <apps:property name="label" value="${caminho}"></apps:property>\n  </entry>\n`;
}

function montarEntryFiltro_(chaveStr, criterios) {
  let partes = chaveStr.split('|');
  let [marcador, tipo, arch, read, star, imp, n_imp, trash, spam, fwd] = partes;

  // Formata a busca com OR: (item1 OR item2)
  let termos = criterios.map(t => t.includes(' ') ? `"${t}"` : t);
  let busca = termos.length > 1 ? `(${termos.join(' OR ')})` : termos[0];

  let propBusca = "from";
  if (tipo.includes("ASSUNTO")) propBusca = "subject";
  else if (tipo.includes("PARA")) propBusca = "to";
  else if (tipo.includes("CONTÉM") || tipo.includes("GRUPO")) propBusca = "hasTheWord";

  let entry = `  <entry>\n    <category term="filter"></category>\n    <title>Mail Filter</title>\n`;
  entry += `    <apps:property name="${propBusca}" value='${busca}'></apps:property>\n`;
  entry += `    <apps:property name="label" value="${marcador}"></apps:property>\n`;
  
  if (arch === "true") entry += `    <apps:property name="shouldArchive" value="true"></apps:property>\n`;
  if (read === "true") entry += `    <apps:property name="shouldMarkAsRead" value="true"></apps:property>\n`;
  if (star === "true") entry += `    <apps:property name="shouldStar" value="true"></apps:property>\n`;
  if (trash === "true") entry += `    <apps:property name="shouldTrash" value="true"></apps:property>\n`;
  if (spam === "true" || trash !== "true") entry += `    <apps:property name="shouldNeverSpam" value="true"></apps:property>\n`;
  if (fwd && fwd.includes('@')) entry += `    <apps:property name="forwardTo" value="${fwd}"></apps:property>\n`;
  
  entry += `  </entry>\n`;
  return entry;
}

function oferecerDownload_(blob1, blob2) {
  const b64_1 = Utilities.base64Encode(blob1.getBytes());
  const b64_2 = Utilities.base64Encode(blob2.getBytes());
  
  const html = `
    <html>
      <body style="font-family: sans-serif; text-align: center; padding: 20px;">
        <h3 style="color: #1a73e8;">📁 Arquivos Gerados!</h3>
        <p>Clique abaixo para baixar os XMLs e importar no Gmail:</p>
        <a href="data:application/xml;base64,${b64_1}" download="1_ESTRUTURA_SION.xml" style="display: block; margin: 10px; padding: 10px; background: #f1f3f4; text-decoration: none; color: #3c4043; border-radius: 5px; border: 1px solid #dadce0;">1. Baixar Estrutura (Labels)</a>
        <a href="data:application/xml;base64,${b64_2}" download="2_FILTROS_SION.xml" style="display: block; margin: 10px; padding: 10px; background: #1a73e8; color: white; text-decoration: none; border-radius: 5px;">2. Baixar Filtros Inteligentes</a>
        <p style="font-size: 12px; color: #70757a;">Após baixar, vá em Gmail > Configurações > Filtros > Importar.</p>
      </body>
    </html>
  `;
  const output = HtmlService.createHtmlOutput(html).setWidth(400).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(output, "Exportador Sion Energia");
}
