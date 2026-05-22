// ============================================================
// Dashboard / console / home
// ============================================================

function abrirConsole() {
  const html = HtmlService.createHtmlOutputFromFile('Console')
    .setTitle('Gmail Redondo - Painel')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showSidebar(html);
}

function abrirBoasVindas() {
  const html = HtmlService.createHtmlOutputFromFile('Welcome')
    .setWidth(720)
    .setHeight(640);
  SpreadsheetApp.getUi().showModalDialog(html, 'Comecar com o Gmail Redondo');
}

function irParaAba(nomeAba) {
  const ss = getPlanilhaAppGmail_();
  const aba = ss.getSheetByName(nomeAba);
  if (!aba) {
    SpreadsheetApp.getUi().alert(`A aba "${nomeAba}" ainda nao existe nesta planilha.`);
    return false;
  }

  ss.setActiveSheet(aba);
  SpreadsheetApp.flush();
  ss.toast(`Aba aberta: ${nomeAba}`, 'Gmail Redondo', 3);
  return true;
}

function montarMenuInicial() {
  const ss = getPlanilhaAppGmail_();
  const aba = ss.getSheetByName('Menu') || ss.insertSheet('Menu', 0);
  const planilhaUrl = ss.getUrl();

  aba.clear();
  aba.clearFormats();
  aba.setFrozenRows(2);
  aba.setHiddenGridlines(true);

  aba.getRange('A1:E1').merge()
    .setValue('Gmail Redondo - Central de operacao')
    .setBackground('#0f766e')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center');

  aba.getRange('A2:E2').merge()
    .setValue('Use esta pagina para navegar pela planilha, revisar a estrategia de inbox e seguir o fluxo do produto.')
    .setBackground('#ecfdf5')
    .setFontColor('#115e59')
    .setWrap(true);

  aba.getRange('A4:E4').setValues([['Etapa', 'Descricao', 'Abrir', 'Observacao', 'Destino']])
    .setBackground('#e2e8f0')
    .setFontWeight('bold');

  const linhas = [
    ['1', 'Comecar pela revisao guiada', 'Tela de boas-vindas', 'Abre o guia com o fluxo recomendado', 'dialog:Welcome'],
    ['2', 'Verificar padroes da caixa', 'BD Legado', 'Base trazida da varredura inicial', criarLinkAba_(planilhaUrl, ss, 'BD Legado')],
    ['3', 'Aprovar classificacoes', 'Centro de treinamento', 'Onde voce revisa, ajusta e aprova casos', criarLinkAba_(planilhaUrl, ss, 'Centro de treinamento')],
    ['4', 'Ajustar regras finais', 'Regras', 'Confira principalmente a politica de inbox', criarLinkAba_(planilhaUrl, ss, 'Regras')],
    ['5', 'Revisar sugestoes automaticas', 'Regras Auto', 'Bom para validar agrupamentos recorrentes', criarLinkAba_(planilhaUrl, ss, 'Regras Auto')],
    ['6', 'Padronizar etiquetas', 'Marcadores Manuais', 'Defina nomes e hierarquias do produto', criarLinkAba_(planilhaUrl, ss, 'Marcadores Manuais')],
    ['7', 'Consultar memoria do sistema', 'Memoria Sistema', 'Historico que ajuda as proximas classificacoes', criarLinkAba_(planilhaUrl, ss, 'Memória Sistema') || criarLinkAba_(planilhaUrl, ss, 'Memoria Sistema')],
    ['8', 'Acompanhar progresso', 'Painel lateral', 'Use o menu superior para abrir o painel', 'menu:Gmail Redondo > Abrir painel'],
    ['9', 'Exportar filtros', 'Gerar filtros para Gmail', 'No final, baixe os XMLs e importe no Gmail', 'menu:Gmail Redondo > Gerar filtros para Gmail']
  ];

  aba.getRange(5, 1, linhas.length, 5).setValues(linhas);
  aba.getRange(5, 1, linhas.length, 1).setHorizontalAlignment('center').setFontWeight('bold');
  aba.getRange(5, 1, linhas.length, 5).setVerticalAlignment('middle').setWrap(true);
  aba.getRange(5, 1, linhas.length, 5).setBorder(true, true, true, true, false, false, '#cbd5e1', SpreadsheetApp.BorderStyle.SOLID);

  aba.getRange('A16:E16').merge()
    .setValue('Politica de inbox recomendada')
    .setBackground('#fff7ed')
    .setFontWeight('bold')
    .setFontColor('#9a3412');

  const politicas = [
    ['Clientes e conversas humanas', 'Aplique etiqueta, mas nao arquive por padrao.'],
    ['Rotinas automaticas', 'Notas fiscais, boletos, alertas e informativos podem arquivar.'],
    ['Regras por assunto', 'Sao mais sensiveis porque respostas costumam herdar o mesmo assunto.'],
    ['Resposta do cliente', 'Se o filtro nao arquivar, o novo e-mail volta para a inbox normalmente.']
  ];

  aba.getRange(17, 1, politicas.length, 2).setValues(politicas);
  aba.getRange(17, 1, politicas.length, 2).setWrap(true);
  aba.getRange(17, 1, politicas.length, 2).setBorder(true, true, true, true, false, false, '#fed7aa', SpreadsheetApp.BorderStyle.SOLID);

  aba.setColumnWidths(1, 5, 160);
  aba.setColumnWidth(2, 280);
  aba.setColumnWidth(3, 210);
  aba.setColumnWidth(4, 280);
  aba.setColumnWidth(5, 260);

  ss.setActiveSheet(aba);
  ss.toast('Pagina inicial atualizada.', 'Gmail Redondo', 4);
}

function criarLinkAba_(planilhaUrl, ss, nomeAba) {
  const aba = ss.getSheetByName(nomeAba);
  if (!aba) return '';
  return `${planilhaUrl}#gid=${aba.getSheetId()}`;
}

function cicloCompletoSion() {
  if (!consoleLateralEstaAtivo_()) abrirConsole();
  registrarLog('Sincronizando dados com o painel lateral...', 'info');
}

function registrarHeartbeatConsole() {
  CacheService.getScriptCache().put('sion_console_heartbeat', String(Date.now()), 30);
}

function consoleLateralEstaAtivo_() {
  return !!CacheService.getScriptCache().get('sion_console_heartbeat');
}

function obterStatsRelatorio() {
  const ss = getPlanilhaAppGmail_();
  const stats = {
    operacao: { total: 0, memoria: 0, ia: 0, pendentes: 0, perc: 0 },
    api: { rpd: 0, rpm: 0, tpm: 0, rpdMax: 500, rpmMax: 15, tpmMax: 250000 }
  };

  const abaCentro = ss.getSheetByName('Centro de treinamento');
  if (abaCentro && abaCentro.getLastRow() >= 2) {
    const dados = abaCentro.getRange(2, 1, abaCentro.getLastRow() - 1, 6).getValues();
    dados.forEach((linha) => {
      if (String(linha[0] || '').trim() === '') return;
      stats.operacao.total++;

      const status = String(linha[5] || '').trim();
      if (status.indexOf('✅') !== -1) stats.operacao.memoria++;
      else if (status.indexOf('🤖') !== -1) stats.operacao.ia++;
      else stats.operacao.pendentes++;
    });

    const resolvidos = stats.operacao.memoria + stats.operacao.ia;
    stats.operacao.perc = stats.operacao.total > 0
      ? Math.round((resolvidos / stats.operacao.total) * 100)
      : 0;
  }

  const abaAPI = ss.getSheetByName('API - Gemini');
  if (abaAPI) {
    stats.api.rpd = abaAPI.getRange('B4').getValue() || 0;
    stats.api.rpm = abaAPI.getRange('B5').getValue() || 0;
    stats.api.tpm = abaAPI.getRange('B6').getValue() || 0;
  }

  return stats;
}

function getSionLogs() {
  const cache = CacheService.getScriptCache();
  const logs = JSON.parse(cache.get('sion_logs') || '[]');
  return logs.map((l) => ({
    msg: l.msg,
    type: l.type,
    time: l.time ? new Date(l.time).toLocaleTimeString() : ''
  })).slice(-40);
}

function verificarOuCriarDashboard() {
  const ss = getPlanilhaAppGmail_();
  if (!ss.getSheetByName('API - Gemini')) criarPainelGemini();
}

function criarPainelGemini() {
  const ss = getPlanilhaAppGmail_();
  const aba = ss.getSheetByName('API - Gemini') || ss.insertSheet('API - Gemini');

  aba.clear();
  aba.setFrozenRows(8);
  aba.getRange('A1:E1').merge().setValue('SION IA - CONSOLE DE OPERACOES (GEMINI 3.1 LITE)')
    .setBackground('#1a73e8')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setFontSize(14);

  const cabecalhosDash = [['METRICA', 'VALOR ATUAL', 'LIMITE SEGURO (80%)', 'STATUS VISUAL', 'COTA TOTAL']];
  aba.getRange('A3:E3').setValues(cabecalhosDash)
    .setBackground('#f8f9fa')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  aba.getRange('A4:E4').setValues([['Requisicoes Hoje (RPD)', '=COUNTIFS(A9:A; ">="&TODAY())', 400, '=SPARKLINE(B4; {"charttype"\\ "bar"; "max"\\ 400; "color1"\\ IF(B4>350; "red"; "green")})', 500]]);
  aba.getRange('A5:E5').setValues([['Velocidade/Min (RPM)', '=COUNTIFS(A9:A; ">="&NOW()-(1/1440))', 12, '=SPARKLINE(B5; {"charttype"\\ "bar"; "max"\\ 15; "color1"\\ IF(B5>12; "orange"; "#4285f4")})', 15]]);
  aba.getRange('A6:E6').setValues([['Volume/Min (TPM)', '=SUMIFS(D9:D; A9:A; ">="&NOW()-(1/1440))', 200000, '=SPARKLINE(B6; {"charttype"\\ "bar"; "max"\\ 250000; "color1"\\ "#7b1fa2"})', '250.000']]);

  aba.getRange('A8:E8').setValues([['DATA/HORA', 'TOKENS IN', 'TOKENS OUT', 'TOTAL TOKENS', 'STATUS API']])
    .setBackground('#444444')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  aba.setColumnWidth(1, 200);
  aba.setColumnWidth(2, 110);
  aba.setColumnWidth(3, 140);
  aba.setColumnWidth(4, 250);
  aba.getRange('B4:C6').setHorizontalAlignment('center').setFontWeight('bold');
  aba.getRange('A9:A1000').setNumberFormat('dd/mm/yyyy HH:mm:ss');
}

function registrarTelemetria(tokensEntrada, tokensSaida) {
  const ss = getPlanilhaAppGmail_();
  const aba = ss.getSheetByName('API - Gemini') || (criarPainelGemini() || ss.getSheetByName('API - Gemini'));
  aba.appendRow([new Date(), Math.round(tokensEntrada), Math.round(tokensSaida), Math.round(tokensEntrada + tokensSaida), 'SUCESSO']);
}
