// ====================================================================================================================================================
// ARQUIVO: API.gs
// ====================================================================================================================================================

function chamarGeminiAPILote(padroes) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

  if (!apiKey) {
    return { ok: false, status: 0, error: 'Chave API nao encontrada.', retryAfterMs: 0 };
  }

  const ss = getPlanilhaAppGmail_();
  const abaMarc = ss.getSheetByName('Marcadores Manuais');

  let manualTecnico = '';
  if (abaMarc && abaMarc.getLastRow() >= 2) {
    const lista = abaMarc.getRange(2, 4, abaMarc.getLastRow() - 1, 5).getValues();
    manualTecnico = lista
      .filter(l => l[2] !== '')
      .map(l => {
        const atividades = [l[0], l[1]].map(v => String(v || '').trim()).filter(Boolean).join(' / ');
        return `- ATIVIDADES VALIDAS: ${atividades} | MARCADOR: ${l[2]} | DESCRICAO: ${l[3] || ''} | KEYWORDS: ${l[4] || ''}`;
      })
      .join('\n');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;
  const linhas = padroes
    .map((item) => `${item.id} | REMETENTE: ${item.remetente} | ASSUNTO: ${item.assuntoOriginal} | PADRAO: ${item.padrao}`)
    .join('\n');

  const prompt = `
Voce e o especialista em classificacao de e-mails.
Sua meta e encontrar o melhor marcador disponivel e definir se a regra deve ser por "assunto" ou por "email".

### ATIVIDADES E MARCADORES DISPONIVEIS:
${manualTecnico}

### REGRAS GERAIS:
1. Use primeiro o conjunto REMETENTE + ASSUNTO + PADRAO.
2. Prefira "assunto" quando o tema operacional estiver no assunto.
3. Prefira "email" apenas quando o remetente sozinho ja representar bem a regra.
4. O campo "tratado" deve ser curto, claro e reutilizavel.
5. Se for "assunto", remova cliente, data, mes/ano, codigos variaveis e complementos finais.
6. Se for "email", o "tratado" deve representar o contato/remetente.
7. Evite mandar tudo para Clickup. So use esse marcador quando houver evidencia clara.
8. Nao use "Outros" sem necessidade.

### HEURISTICAS IMPORTANTES:
1. Termos como "fatura", "faturas", "cobranca", "vencimento", "boleto", "nota fiscal", "nf", "nfe", "comprovante nao identificado" e "notas em aberto" tendem a indicar faturamento/cobranca, nao apenas informativo.
2. "Comprovante nao identificado" com nota fiscal normalmente deve ser tratado como cobranca ou analise de NF, conforme o marcador mais proximo disponivel.
3. "Encargo Energia Reserva CCEE", "Registro DEVEC", "Solicitacao de NF faltante", "Faturamentos Pendentes", "Garantia Financeira" e similares devem priorizar o nucleo operacional do assunto.
4. Quando houver conflito entre nome amigavel do remetente e o tema do assunto, o marcador pode usar o contexto dos dois, mas o tipo_regra deve refletir o que melhor sustenta a busca futura.
5. Prefira responder o MARCADOR, nao a atividade. A atividade sera derivada depois.

### EXEMPLOS DE TRATADO:
- "Safira Energia - Comprovante nao identificado | CASTILHO MINERACAO LTDA | Nota Fiscal 31515" -> "Comprovante nao identificado"
- "Faturamentos Pendentes - SERENA x ENGOMATEXTIL LTDA [URGENTE]" -> "Faturamentos Pendentes"
- "Lembrete: Encargo Energia Reserva CCEE - Fevereiro/2026 - Cliente X" -> "Encargo Energia Reserva CCEE"
- "Registro - DEVEC - Fevereiro/2026 - Cliente X" -> "Registro DEVEC"

### ENTRADAS (ID | REMETENTE | ASSUNTO | PADRAO):
${linhas}

### FORMATO DE SAIDA (JSON):
{"resultados":[{"id":1,"tratado":"Nome","marcador":"Caminho/Tecnico","tipo_regra":"assunto"}]}
`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const status = response.getResponseCode();
    const body = response.getContentText();

    const tokensEntradaEst = JSON.stringify(payload).length / 4;
    const tokensSaidaEst = body.length / 4;
    registrarTelemetria(tokensEntradaEst, tokensSaidaEst, status === 200 ? 'SUCESSO' : `ERRO ${status}`);

    let json = {};
    try { json = JSON.parse(body); } catch (e) {}

    if (status === 200) {
      const candidato = json.candidates && json.candidates[0];
      const texto = candidato && candidato.content && candidato.content.parts && candidato.content.parts[0]
        ? candidato.content.parts[0].text
        : '{}';

      registrarLog(`Resposta IA: ${texto.substring(0, 100)}...`, 'info');

      const brutoParseado = extrairJSONSeguro_(texto);
      const data = normalizarRespostaLote_(brutoParseado);
      return { ok: true, status: 200, data };
    }

    return {
      ok: false,
      status,
      error: json.error ? json.error.message : `Erro ${status}`,
      retryAfterMs: status === 429 ? 60000 : 0,
    };
  } catch (e) {
    registrarTelemetria(0, 0, 'FALHA CRITICA');
    return { ok: false, status: 0, error: e.toString(), retryAfterMs: 0 };
  }
}

function normalizarRespostaLote_(json) {
  const lista = json.resultados || (Array.isArray(json) ? json : []);

  return lista.map((item) => {
    let marcador = String(item.marcador || '').trim();
    if (marcador.toLowerCase() === 'outros' || marcador === '') {
      marcador = 'Informacoes insuficientes';
    }
    const atividade = String(item.atividade || '').trim();

    return {
      id: Number(item.id),
      tratado: String(item.tratado || '').trim(),
      marcador: marcador,
      atividade: atividade,
      tipoRegra: String(item.tipo_regra || 'assunto').trim().toLowerCase()
    };
  }).filter(Boolean);
}
