const APP_GMAIL_SPREADSHEET_ID_PADRAO = '1C_NFuRciBI3sfGEZLqqMqui9nvEyqhhoVdiRZnczqOM';

// ============================================================
// Helpers de parse e UI
// ============================================================

function getPlanilhaAppGmail_() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const spreadsheetId = String(
    scriptProperties.getProperty('APP_GMAIL_SPREADSHEET_ID') || APP_GMAIL_SPREADSHEET_ID_PADRAO
  ).trim();

  if (!spreadsheetId) return SpreadsheetApp.getActiveSpreadsheet();
  return SpreadsheetApp.openById(spreadsheetId);
}

function getConfigPlanilhaAppGmail_() {
  const ss = getPlanilhaAppGmail_();
  return {
    id: ss.getId(),
    nome: ss.getName(),
    url: ss.getUrl()
  };
}

/**
 * Extrai o tempo de espera em caso de erro 429.
 */
function extrairRetryAfterMs_(response, json) {
  try {
    const headers = response?.getAllHeaders ? response.getAllHeaders() : {};
    const retryHeader = headers['Retry-After'] || headers['retry-after'];
    if (retryHeader) {
      const segs = Number(retryHeader);
      if (!isNaN(segs)) return Math.ceil(segs * 1000);
    }

    const details = json?.error?.details || [];
    for (const detail of details) {
      if (detail?.retryDelay) {
        const match = String(detail.retryDelay).match(/([\d.]+)s/i);
        if (match) return Math.ceil(Number(match[1]) * 1000);
      }
    }
  } catch (e) {}

  return 15000;
}

/**
 * Garante que o JSON da IA seja lido mesmo com lixo em volta.
 */
function extrairJSONSeguro_(texto) {
  const bruto = String(texto || '').trim();
  const tentativas = [
    bruto,
    bruto.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim()
  ];

  for (const tentativa of tentativas) {
    try {
      return JSON.parse(tentativa);
    } catch (e) {}
  }

  const iniArr = bruto.indexOf('[');
  const fimArr = bruto.lastIndexOf(']');
  if (iniArr !== -1 && fimArr !== -1 && fimArr > iniArr) {
    try {
      return JSON.parse(bruto.substring(iniArr, fimArr + 1));
    } catch (e) {}
  }

  const iniObj = bruto.indexOf('{');
  const fimObj = bruto.lastIndexOf('}');
  if (iniObj !== -1 && fimObj !== -1 && fimObj > iniObj) {
    try {
      return JSON.parse(bruto.substring(iniObj, fimObj + 1));
    } catch (e) {}
  }

  throw new Error(`Falha critica no JSON da IA: ${bruto.substring(0, 100)}`);
}

/**
 * Limpa o assunto do e-mail para criar um padrao de comparacao.
 */
function limparAssuntoPlanoB(texto) {
  if (!texto) return '';

  let t = String(texto).replace(/^(Re:|Res:|Fwd:|Enc:|ENC:|RES:)\s*/i, '');
  t = t.split('-')[0].split('|')[0].trim();
  if (!t.includes('@')) t = t.replace(/\d+/g, 'X');
  return t.replace(/\s+/g, ' ').trim();
}

/**
 * UI legada: mantem o monitor antigo disponivel sem sobrescrever o Console atual.
 */
function abrirConsoleLegacyV96() {
  const html = HtmlService.createHtmlOutput(`
    <html>
      <head><style>body { font-family: Consolas, monospace; background: #121212; color: #00ff41; padding: 15px; font-size: 11px; } .header { color: #fff; border-bottom: 1px solid #00ff41; margin-bottom: 10px; font-weight: bold; } .log-entry { margin-bottom: 5px; border-left: 2px solid #333; padding-left: 8px; } .time { color: #888; } .success { color: #fff; background: #004411; } .error { color: #ff8080; } .info { color: #f4f4f4; }</style></head>
      <body><div class="header">SION IA - MONITOR v96</div><div id="logs">Terminal Ativo...</div><script>function addLog(msg, type) { const div = document.getElementById('logs'); if (div.innerHTML.includes('Terminal Ativo')) div.innerHTML = ''; const now = new Date().toLocaleTimeString(); const entry = document.createElement('div'); entry.className = 'log-entry'; entry.innerHTML = '<span class="time">[' + now + ']</span> <span class="' + type + '">' + msg + '</span>'; div.prepend(entry); } setInterval(function () { google.script.run.withSuccessHandler(function (logs) { if (logs) logs.forEach(function (l) { addLog(l.msg, l.type); }); }).getNovosLogs(); }, 1500);</script></body>
    </html>
  `).setTitle('Sion IA - Monitor').setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Busca os logs acumulados no cache para o terminal.
 */
function getNovosLogs() {
  const cache = CacheService.getScriptCache();
  const logs = cache.get('sion_logs');
  if (logs) {
    cache.remove('sion_logs');
    return JSON.parse(logs);
  }
  return [];
}

/**
 * Utilitario para debug de modelos disponiveis.
 */
function listarModelosIAGemini() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const res = UrlFetchApp.fetch(url);
    const json = JSON.parse(res.getContentText());
    const modelos = json.models
      .filter((model) => model.supportedGenerationMethods.includes('generateContent'))
      .map((model) => model.name.replace('models/', ''))
      .join('\n');
    SpreadsheetApp.getUi().alert('Modelos Disponiveis:\n\n' + modelos);
  } catch (e) {
    SpreadsheetApp.getUi().alert('Erro ao buscar: ' + e.toString());
  }
}
