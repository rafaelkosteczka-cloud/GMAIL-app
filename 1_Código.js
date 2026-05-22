/**
 * APP-Gmail / Gmail Redondo
 * Organizador guiado de Gmail com planilha, etiquetas, filtros e IA.
 */

const USAR_CONSOLE_LATERAL = 1;
const LIMITE_IA_POR_VEZ = 40;
const MAX_TENTATIVAS_429 = 3;
const TEMPO_MAX_EXECUCAO_MS = 5 * 60 * 1000;
const PAUSA_ENTRE_LOTES_MS = 10000;
const LIMITE_RPD_SEGURANCA = 400;

/**
 * Menu principal do produto.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menuAvancado = ui.createMenu('Ferramentas avancadas')
    .addItem('Testar conexao com a IA', 'testarConexaoIA')
    .addItem('Listar modelos Gemini', 'listarModelosIAGemini')
    .addSeparator()
    .addItem('Atualizar pagina inicial', 'montarMenuInicial')
    .addItem('Abrir console legado', 'abrirConsoleLegacyV96')
    .addSeparator()
    .addItem('Liberar trava', 'liberarTrava');

  ui.createMenu('Gmail Redondo')
    .addItem('1. Comecar aqui', 'abrirBoasVindas')
    .addItem('2. Abrir painel de progresso', 'abrirConsole')
    .addItem('3. Atualizar pagina inicial', 'montarMenuInicial')
    .addSeparator()
    .addItem('4. Escanear minha caixa', 'varreduraLegado')
    .addItem('5. Aplicar inteligencia local', 'aplicarInteligenciaLocal')
    .addItem('6. Analisar um lote com IA', 'rodarIAPendentes')
    .addItem('7. Analisar tudo com IA', 'rodarTodosLotesIA')
    .addItem('8. Salvar e treinar regras', 'aprovarCentroTreinamento')
    .addSeparator()
    .addItem('9. Atualizar dashboard', 'cicloCompletoSion')
    .addItem('10. Gerar filtros para Gmail', 'gerarEntregaSionIntegral')
    .addSubMenu(menuAvancado)
    .addToUi();
}

function rodarIAPendentes() {
  rodarLotesIA_(false);
}

function rodarTodosLotesIA() {
  rodarLotesIA_(true);
}

// ============================================================
// Seguranca e logs
// ============================================================

function obterTrava() {
  const trava = PropertiesService.getScriptProperties().getProperty('EXEC_SION_LOCK');
  if (trava === 'true') {
    SpreadsheetApp.getUi().alert('Gmail Redondo em operacao.\n\nAguarde o processamento atual terminar.');
    return false;
  }

  PropertiesService.getScriptProperties().setProperty('EXEC_SION_LOCK', 'true');
  return true;
}

function liberarTrava() {
  PropertiesService.getScriptProperties().setProperty('EXEC_SION_LOCK', 'false');
  registrarLog('Trava liberada.', 'success');
}

/**
 * Registra logs para o painel lateral e para o historico do Apps Script.
 */
function registrarLog(msg, type = 'info') {
  const mensagem = String(msg || '');
  console.log(`[${String(type).toUpperCase()}] ${mensagem}`);

  try {
    const cache = CacheService.getScriptCache();
    const logs = JSON.parse(cache.get('sion_logs') || '[]');
    logs.push({
      msg: mensagem.length > 140 ? `${mensagem.substring(0, 140)}...` : mensagem,
      type,
      time: new Date().toISOString()
    });

    const logsRecentes = logs.slice(-10);
    let payload = JSON.stringify(logsRecentes);
    while (payload.length > 3500 && logsRecentes.length > 1) {
      logsRecentes.shift();
      payload = JSON.stringify(logsRecentes);
    }

    cache.put('sion_logs', payload, 60);
  } catch (e) {
    console.log(`[LOG_FALLBACK] ${e}`);
  }
}
