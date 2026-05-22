// ============================================================
// 0️⃣ PASSO 0: VARREDURA E DIAGNOSTICO
// ============================================================
function varreduraLegado() {
  if (!obterTrava()) return;

  try {
    if (USAR_CONSOLE_LATERAL === 1) abrirConsole();

    const ui = SpreadsheetApp.getUi();
    const res = ui.prompt('📊 Passo 0: Varredura', 'Quantos e-mails analisar? (Ex: 1000)', ui.ButtonSet.OK_CANCEL);
    if (res.getSelectedButton() !== ui.Button.OK) return;

    const limiteTotal = parseInt(res.getResponseText(), 10) || 200;
    const ss = getPlanilhaAppGmail_();
    const abaBDL = ss.getSheetByName('BD Legado') || ss.insertSheet('BD Legado');
    const baseAudit = [];

    registrarLog('🚀 Iniciando Varredura em lotes de 200...', 'info');

    for (let i = 0; i < limiteTotal; i += 200) {
      const tamanhoLote = Math.min(200, limiteTotal - i);
      registrarLog(`📥 Buscando lote: ${i} até ${i + tamanhoLote}...`, 'info');

      const threads = GmailApp.search('-label:trash -label:spam', i, tamanhoLote);
      if (threads.length === 0) {
        registrarLog('🏁 Fim dos e-mails encontrados na caixa.', 'info');
        break;
      }

      threads.forEach((thread) => {
        const msg = thread.getMessages()[0];
        baseAudit.push([
          msg.getDate(),
          msg.getFrom(),
          msg.getSubject(),
          limparAssuntoPlanoB(msg.getSubject())
        ]);
      });

      if (threads.length < tamanhoLote) break;
    }

    abaBDL.clear();
    abaBDL.getRange(1, 1, 1, 4).setValues([['Data', 'Remetente', 'Original', 'Tratado']])
      .setBackground('#444444').setFontColor('white').setFontWeight('bold');

    if (baseAudit.length > 0) {
      abaBDL.getRange(2, 1, baseAudit.length, 4).setValues(baseAudit);
    }

    registrarLog(`✅ Varredura de ${baseAudit.length} e-mails concluída!`, 'success');
    cicloCompletoSion();
  } catch (e) {
    registrarLog(`❌ Erro na Varredura: ${e.toString()}`, 'error');
  } finally {
    liberarTrava();
  }
}

// ============================================================
// 1️⃣ PASSO 1: APLICAR INTELIGENCIA LOCAL
// ============================================================
function aplicarInteligenciaLocal() {
  if (!obterTrava()) return;
  if (USAR_CONSOLE_LATERAL === 1) abrirConsole();

  try {
    registrarLog('🧠 Funil Técnico: Memória > Regras...', 'info');
    const ss = getPlanilhaAppGmail_();
    const abaBDL = ss.getSheetByName('BD Legado');
    const abaMem = ss.getSheetByName('Memória Sistema');
    const abaRegras = ss.getSheetByName('Regras');
    const abaCentro = ss.getSheetByName('Centro de treinamento');
    const totalColunasCentro = 13;
    const cabecalhosCentro = [[
      'Remetente',
      'Assunto Original',
      'Assunto Sugerido',
      'Atividade',
      'Marcador',
      'Status',
      'Tipo de Correspondência',
      'Aprovar',
      'AJUSTE de Assunto Sugerido',
      'AJUSTE de Atividade',
      'AJUSTE de Marcador',
      'AJUSTE de Tipo de Correspondência',
      'Aprovar AJUSTE'
    ]];

    if (!abaBDL || abaBDL.getLastRow() < 2) return registrarLog('⚠️ BD Legado vazia.', 'error');

    const validacaoTipoCorrespondencia = SpreadsheetApp.newDataValidation()
      .requireValueInList(['E-mail', 'Assunto'], true)
      .setAllowInvalid(false)
      .build();
    const validacaoAtividades = obterValidacaoAtividades_(ss);
    const mapaAtividadesMarcadores = construirMapaAtividadesMarcadores_(ss);

    abaCentro.getRange(1, 1, 1, totalColunasCentro).setValues(cabecalhosCentro)
      .setBackground('#444444')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    if (abaCentro.getFilter()) abaCentro.getFilter().remove();

    const memoriaSet = {};
    if (abaMem && abaMem.getLastRow() > 1) {
      const larguraMemoria = Math.max(5, abaMem.getLastColumn() - 1);
      abaMem.getRange(2, 2, abaMem.getLastRow() - 1, larguraMemoria).getValues().forEach(h => {
        const chave = String(h[0] || '').toLowerCase().trim();
        if (!chave) return;
        memoriaSet[chave] = {
          nome: h[1] || '',
          atividade: h[2] || '',
          marcador: h[3] || '',
          tipoCorrespondencia: normalizarTipoCorrespondencia_(h[4])
        };
      });
    }

    const listaRegras = [];
    if (abaRegras && abaRegras.getLastRow() > 1) {
      abaRegras.getRange(3, 1, abaRegras.getLastRow() - 2, abaRegras.getLastColumn()).getValues().forEach(r => {
        const tipoRegra = String(r[1] || '').trim();
        const tipoBuscaEmail = String(r[2] || '').trim();
        const criterio = String(r[3] || '').toLowerCase().trim();
        const atividade = String(r[5] || '').trim();
        const marcador = String(r[12] || '').trim();
        if (!criterio) return;
        listaRegras.push({ tipoRegra, tipoBuscaEmail, criterio, atividade, marcador });
      });
    }

    const dadosLegado = abaBDL.getRange(2, 1, abaBDL.getLastRow() - 1, 4).getValues();
    const mapaRemetentes = montarEstatisticasRemetentes_(dadosLegado);

    const esteiraFinal = dadosLegado.map(linha => {
      const remetenteOriginal = String(linha[1] || '').trim();
      const assuntoOriginalBruto = String(linha[2] || '').trim();
      const assuntoTratado = String(linha[3] || '').trim();
      const remetente = remetenteOriginal.toLowerCase().trim();
      const assuntoOriginal = assuntoOriginalBruto.toLowerCase().trim();

      const matchMemEmail = memoriaSet[remetente];
      if (matchMemEmail) {
        return [remetenteOriginal, assuntoOriginalBruto, matchMemEmail.nome || assuntoTratado, matchMemEmail.atividade || '', matchMemEmail.marcador || 'Pendente', '✅ Memória', matchMemEmail.tipoCorrespondencia || 'E-mail', true, '', '', '', '', false];
      }

      const matchMemAssunto = memoriaSet[assuntoOriginal];
      if (matchMemAssunto) {
        return [remetenteOriginal, assuntoOriginalBruto, matchMemAssunto.nome || assuntoTratado, matchMemAssunto.atividade || '', matchMemAssunto.marcador || 'Pendente', '✅ Memória', matchMemAssunto.tipoCorrespondencia || 'Assunto', true, '', '', '', '', false];
      }

      for (const regra of listaRegras) {
        const tipoBusca = regra.tipoBuscaEmail.toLowerCase();
        const bateEmail = tipoBusca === 'de' && remetente.includes(regra.criterio);
        const bateAssunto = tipoBusca === 'assunto' && assuntoOriginal.includes(regra.criterio);

        if (bateEmail) return [remetenteOriginal, assuntoOriginalBruto, extrairNomeContato_(remetenteOriginal, assuntoTratado), regra.atividade || '', regra.marcador || 'Pendente', '✅ Regra', 'E-mail', true, '', '', '', '', false];
        if (bateAssunto) return [remetenteOriginal, assuntoOriginalBruto, assuntoTratado, regra.atividade || '', regra.marcador || 'Pendente', '✅ Regra', 'Assunto', true, '', '', '', '', false];
      }

      const tipoCorrespondenciaPadrao = inferirTipoCorrespondenciaPadrao_(mapaRemetentes, remetente);
      const assuntoBase = tipoCorrespondenciaPadrao === 'E-mail' ? extrairNomeContato_(remetenteOriginal, assuntoTratado) : assuntoTratado;
      return [remetenteOriginal, assuntoOriginalBruto, assuntoBase, '', 'Pendente', '⏳ Pendente', tipoCorrespondenciaPadrao, false, '', '', '', '', false];
    });

    esteiraFinal.forEach(linha => {
      const remetenteChave = String(linha[0] || '').toLowerCase().trim();
      const assuntoChave = String(linha[1] || '').toLowerCase().trim();
      const matchMemoria = memoriaSet[remetenteChave] || memoriaSet[assuntoChave];
      if (matchMemoria && !String(linha[3] || '').trim()) {
        linha[3] = matchMemoria.atividade || '';
      }
    });

    if (abaCentro.getLastRow() >= 2) {
      abaCentro.getRange(2, 1, abaCentro.getLastRow(), 8).clearContent();
      abaCentro.getRange(2, 4, abaCentro.getMaxRows() - 1, 1).clearDataValidations();
      abaCentro.getRange(2, 6, abaCentro.getMaxRows() - 1, 1).clearDataValidations();
      abaCentro.getRange(2, 7, abaCentro.getMaxRows() - 1, 1).clearDataValidations();
      abaCentro.getRange(2, 10, abaCentro.getMaxRows() - 1, 1).clearDataValidations();
      abaCentro.getRange(2, 11, abaCentro.getMaxRows() - 1, 1).clearDataValidations();
      abaCentro.getRange(2, 12, abaCentro.getMaxRows() - 1, 1).clearDataValidations();
    }

    if (esteiraFinal.length > 0) {
      esteiraFinal.sort((a, b) => String(a[1]).localeCompare(String(b[1])));
      const esteiraBase = esteiraFinal.map(linha => linha.slice(0, 8));
      abaCentro.getRange(2, 1, esteiraBase.length, 8).setValues(esteiraBase);
      abaCentro.getRange(2, 8, esteiraFinal.length, 1).insertCheckboxes();
      abaCentro.getRange(2, 13, esteiraFinal.length, 1).insertCheckboxes();
      abaCentro.getRange(2, 10, esteiraFinal.length, 1).setBackground(null);
      abaCentro.getRange(2, 11, esteiraFinal.length, 1).setBackground('#e0e0e0');
      if (validacaoAtividades) abaCentro.getRange(2, 4, esteiraFinal.length, 1).setDataValidation(validacaoAtividades);
      abaCentro.getRange(2, 7, esteiraFinal.length, 1).setDataValidation(validacaoTipoCorrespondencia);
      if (validacaoAtividades) abaCentro.getRange(2, 10, esteiraFinal.length, 1).setDataValidation(validacaoAtividades);
      abaCentro.getRange(2, 12, esteiraFinal.length, 1).setDataValidation(validacaoTipoCorrespondencia);
      preencherMarcadoresPorAtividadeCentro_(abaCentro, 2, esteiraFinal.length, mapaAtividadesMarcadores);
      if (!abaCentro.getFilter()) {
        abaCentro.getRange(1, 1, esteiraFinal.length + 1, totalColunasCentro).createFilter();
      }
    }

    abaCentro.setFrozenRows(1);
    registrarLog('✅ Passo 1 concluído!', 'success');
    cicloCompletoSion();
  } finally {
    liberarTrava();
  }
}

// ============================================================
// 2️⃣ PASSO 2: IA (LITE)
// ============================================================
function rodarLotesIA_(processarTodos) {
  if (!obterTrava()) return;
  if (USAR_CONSOLE_LATERAL === 1) abrirConsole();
  const inicioExecucao = Date.now();
  let usouIA = false;

  try {
    const ss = getPlanilhaAppGmail_();
    const abaCentro = ss.getSheetByName('Centro de treinamento');
    if (!abaCentro || abaCentro.getLastRow() < 2) return;

    verificarOuCriarDashboard();

    while (true) {
      if (TEMPO_MAX_EXECUCAO_MS - (Date.now() - inicioExecucao) < 30000) break;
      if (obterUsoAtualRPD_() >= LIMITE_RPD_SEGURANCA) break;

      const dadosAtuais = abaCentro.getRange(2, 1, abaCentro.getLastRow() - 1, 13).getValues();
      const listaOrdenada = montarPendentesIA_(dadosAtuais);
      if (listaOrdenada.length === 0) break;

      const sprint = listaOrdenada.slice(0, LIMITE_IA_POR_VEZ).map((item, index) => ({
        id: index + 1,
        padrao: item.padrao,
        volume: item.volume,
        remetente: item.remetente,
        assuntoOriginal: item.assuntoOriginal
      }));

      usouIA = true;
      const resultado = processarSprintIA_(abaCentro, dadosAtuais, sprint);
      if (!resultado.ok || !processarTodos) break;

      Utilities.sleep(PAUSA_ENTRE_LOTES_MS);
    }
  } finally {
    if (usouIA) cicloCompletoSion();
    liberarTrava();
  }
}

function processarSprintIA_(abaCentro, dadosCompletos, sprint) {
  registrarLog(`📨 Enviando ${sprint.length} padrões para a IA...`, 'info');
  const resposta = chamarGeminiAPILote(sprint);
  if (!resposta || !resposta.ok) return { ok: false };
  const mapaAtividades = construirMapaAtividadesMarcadores_(getPlanilhaAppGmail_());
  const mapaMarcadorAtividade = obterMapaMarcadorAtividadeValida_(getPlanilhaAppGmail_());

  const mapaPorPadrao = {};
  sprint.forEach(item => {
    const d = resposta.data.find(r => r.id === item.id);
    if (d) mapaPorPadrao[item.padrao] = d;
  });

  for (let i = 0; i < dadosCompletos.length; i++) {
    const padraoLinha = limparAssuntoPlanoB(dadosCompletos[i][1]);
    if (dadosCompletos[i][5] === '⏳ Pendente' && mapaPorPadrao[padraoLinha]) {
      const respostaIA = mapaPorPadrao[padraoLinha];
      const tipoCorrespondencia = respostaIA.tipoRegra === 'email' ? 'E-mail' : 'Assunto';
      const marcadorIA = String(respostaIA.marcador || '').trim();
      const atividadeIA = normalizarAtividadeExistente_(
        respostaIA.atividade || marcadorIA,
        mapaAtividades
      ) || normalizarAtividadeAPartirDoMarcador_(marcadorIA, mapaMarcadorAtividade);
      dadosCompletos[i][2] = tipoCorrespondencia === 'E-mail'
        ? extrairNomeContato_(dadosCompletos[i][0], respostaIA.tratado)
        : normalizarTratadoAssunto_(respostaIA.tratado, dadosCompletos[i][1]);
      dadosCompletos[i][3] = atividadeIA;
      dadosCompletos[i][4] = atividadeIA
        ? (marcadorIA || buscarMarcadorPorAtividade_(atividadeIA))
        : (marcadorIA || 'Pendente');
      dadosCompletos[i][5] = atividadeIA
        ? '🤖 Sugestão IA'
        : '⚠️ Sem encaixe nas atividades atuais';
      dadosCompletos[i][6] = tipoCorrespondencia;
    }
  }

  const saidaAssuntoAtividade = dadosCompletos.map(linha => [linha[2], linha[3]]);
  const saidaMarcadorStatusTipo = dadosCompletos.map(linha => [linha[4], linha[5], linha[6]]);
  abaCentro.getRange(2, 3, saidaAssuntoAtividade.length, 2).setValues(saidaAssuntoAtividade);
  abaCentro.getRange(2, 5, saidaMarcadorStatusTipo.length, 3).setValues(saidaMarcadorStatusTipo);
  return { ok: true };
}

// ============================================================
// ✅ PASSO 2.1: SALVAR E TREINAR
// ============================================================
function aprovarCentroTreinamento() {
  const ss = getPlanilhaAppGmail_();
  const abaCentro = ss.getSheetByName('Centro de treinamento');
  const abaRegras = ss.getSheetByName('Regras');
  const abaMem = ss.getSheetByName('Memória Sistema');
  if (!abaCentro || abaCentro.getLastRow() < 2) return;

  const dados = abaCentro.getRange(2, 1, abaCentro.getLastRow() - 1, 13).getValues();
  const novasRegras = [];
  const novosTreinos = [];
  const criteriosJaProcessados = new Set();
  let houveIntegracao = false;
  let regrasPreparadas = 0;
  let memoriasPreparadas = 0;
  let memoriasExistentes = 0;
  const primeiraLinhaLivreRegras = obterPrimeiraLinhaLivreRegras_(abaRegras);
  const primeiraLinhaLivreMemoria = abaMem ? obterPrimeiraLinhaVaziaTabela_(abaMem, 2, 7) : 0;
  const cabecalhosRegras = abaRegras.getRange(2, 1, 1, abaRegras.getLastColumn()).getValues()[0];
  const memoriaExistente = abaMem ? obterIndicesMemoriaExistentes_(abaMem) : { origemKeys: new Set(), padraoKeys: new Set() };
  const regrasExistentes = obterChavesRegrasExistentes_(abaRegras, cabecalhosRegras);

  const rangeStatus = abaCentro.getRange(2, 6, dados.length, 1);
  const rangeChecks = abaCentro.getRange(2, 8, dados.length, 1);
  const rangeChecksAjuste = abaCentro.getRange(2, 13, dados.length, 1);
  const statusAtuais = rangeStatus.getValues();
  const checksAtuais = rangeChecks.getValues();
  const checksAjusteAtuais = rangeChecksAjuste.getValues();

  dados.forEach((linha, i) => {
    const [rem, orig, assuntoSug, atividade, marc, status, tipo, aprov, ajAssunto, ajAtividade, ajMarc, ajTipo, aprovAjuste] = linha;
    if (aprov !== true && aprovAjuste !== true) return;
    houveIntegracao = true;

    const usarAjuste = aprovAjuste === true;
    const assuntoFinal = usarAjuste && String(ajAssunto).trim() !== '' ? ajAssunto : assuntoSug;
    const atividadeFinal = usarAjuste && String(ajAtividade).trim() !== '' ? String(ajAtividade).trim() : String(atividade || '').trim();
    const marcadorAjustadoValido = usarAjuste && String(ajMarc).trim() !== '' && String(ajMarc).trim() !== 'Não encontrado';
    const marcFinal = marcadorAjustadoValido ? ajMarc : marc;
    const tipoFinal = usarAjuste && String(ajTipo).trim() !== '' ? ajTipo : tipo;
    const tipoCorrespondencia = normalizarTipoCorrespondencia_(tipoFinal);
    const fonte = (usarAjuste && (String(ajAssunto).trim() !== '' || String(ajAtividade).trim() !== '' || String(ajMarc).trim() !== '' || String(ajTipo).trim() !== ''))
      ? '✍️ Manual'
      : '🤖 Lógica';
    const statusFinal = fonte === '✍️ Manual'
      ? '✅ Integrado (Ajuste manual)'
      : '✅ Integrado (IA aprovada)';
    const ehEmail = tipoCorrespondencia === 'E-mail';
    const tipoRegra = ehEmail ? 'E-mail' : 'Critério';
    const tipoBuscaEmail = ehEmail ? 'De' : 'Assunto';
    const valorFiltro = ehEmail ? rem : assuntoFinal;
    const origemMemoria = ehEmail ? rem : orig;
    const chaveRegra = `${tipoRegra}|${tipoBuscaEmail}|${String(valorFiltro).trim().toLowerCase()}`;
    const origemMemoriaNormalizada = String(origemMemoria).trim().toLowerCase();
    const chaveMemoriaOrigem = `${origemMemoriaNormalizada}|${tipoCorrespondencia}`;
    const chaveMemoriaPadrao = ehEmail
      ? chaveMemoriaOrigem
      : `${String(assuntoFinal).trim().toLowerCase()}|${String(atividadeFinal).trim().toLowerCase()}|${String(marcFinal).trim().toLowerCase()}|${tipoCorrespondencia}`;
    const veioDeMemoriaOuRegra = /mem[oó]ria|regra/i.test(String(status || ''));

    if (!criteriosJaProcessados.has(chaveRegra) && !regrasExistentes.has(chaveRegra)) {
      novasRegras.push(construirLinhaRegraPorCabecalho_(
        cabecalhosRegras,
        primeiraLinhaLivreRegras + novasRegras.length,
        { tipoRegra, tipoBuscaEmail, valorFiltro, atividadeFinal, marcadorFinal: marcFinal, fonte }
      ));
      regrasPreparadas++;
      criteriosJaProcessados.add(chaveRegra);
      regrasExistentes.add(chaveRegra);
    }

    if (!veioDeMemoriaOuRegra && !memoriaExistente.origemKeys.has(chaveMemoriaOrigem) && !memoriaExistente.padraoKeys.has(chaveMemoriaPadrao)) {
      novosTreinos.push([
        new Date(),
        origemMemoriaNormalizada,
        assuntoFinal,
        atividadeFinal,
        marcFinal,
        tipoCorrespondencia,
        fonte
      ]);
      memoriaExistente.origemKeys.add(chaveMemoriaOrigem);
      memoriaExistente.padraoKeys.add(chaveMemoriaPadrao);
      memoriasPreparadas++;
    } else {
      memoriasExistentes++;
    }

    statusAtuais[i][0] = statusFinal;
    checksAtuais[i][0] = false;
    checksAjusteAtuais[i][0] = false;
  });

  if (abaMem && abaMem.getLastRow() > 1) {
    const dadosMemoria = abaMem.getRange(2, 1, abaMem.getLastRow() - 1, 7).getValues();
    dadosMemoria.forEach(linha => {
      const origem = String(linha[1] || '').trim();
      const tratado = String(linha[2] || '').trim();
      const atividade = String(linha[3] || '').trim();
      const marcador = String(linha[4] || '').trim();
      const tipoCorrespondencia = normalizarTipoCorrespondencia_(linha[5]);
      const fonte = String(linha[6] || '🤖 Lógica').trim() || '🤖 Lógica';
      const ehEmail = tipoCorrespondencia === 'E-mail';
      const tipoRegra = ehEmail ? 'E-mail' : 'Critério';
      const tipoBuscaEmail = ehEmail ? 'De' : 'Assunto';
      const valorFiltro = ehEmail ? origem : tratado;
      const chaveRegra = `${tipoRegra}|${tipoBuscaEmail}|${String(valorFiltro).trim().toLowerCase()}`;

      if (!valorFiltro || regrasExistentes.has(chaveRegra) || criteriosJaProcessados.has(chaveRegra)) return;

      novasRegras.push(construirLinhaRegraPorCabecalho_(
        cabecalhosRegras,
        primeiraLinhaLivreRegras + novasRegras.length,
        { tipoRegra, tipoBuscaEmail, valorFiltro, atividadeFinal: atividade, marcadorFinal: marcador, fonte }
      ));
      regrasPreparadas++;
      criteriosJaProcessados.add(chaveRegra);
      regrasExistentes.add(chaveRegra);
    });
  }

  if (houveIntegracao || novasRegras.length > 0) {
    if (novasRegras.length > 0) {
      const rangeDestinoRegras = abaRegras.getRange(primeiraLinhaLivreRegras, 1, novasRegras.length, cabecalhosRegras.length);
      const formulasExistentes = rangeDestinoRegras.getFormulas();
      const linhasPreservadas = novasRegras.map((linha, i) =>
        linha.map((valor, j) => formulasExistentes[i][j] ? formulasExistentes[i][j] : valor)
      );
      rangeDestinoRegras.setValues(linhasPreservadas);
    }
    if (abaMem && novosTreinos.length > 0) {
      abaMem.getRange(primeiraLinhaLivreMemoria, 1, novosTreinos.length, 7).setValues(novosTreinos);
    }
    rangeStatus.setValues(statusAtuais);
    rangeChecks.setValues(checksAtuais);
    rangeChecksAjuste.setValues(checksAjusteAtuais);

    registrarLog(
      `Integracao concluida: ${regrasPreparadas} regras novas, ${memoriasPreparadas} memorias novas, ${memoriasExistentes} memorias ja existentes.`,
      'info'
    );
    registrarLog('✅ Sucesso! Sincronizando Console...', 'success');
    cicloCompletoSion();
  }
}

// --- FUNCOES DE APOIO ---
function montarPendentesIA_(dados) {
  const pendentes = {};
  dados.forEach(l => {
    if (l[5] === '⏳ Pendente' && l[7] === false) {
      const p = limparAssuntoPlanoB(l[1]);
      if (!p) return;
      if (!pendentes[p]) {
        pendentes[p] = {
          padrao: p,
          volume: 0,
          remetente: String(l[0] || '').trim(),
          assuntoOriginal: String(l[1] || '').trim()
        };
      }
      pendentes[p].volume++;
    }
  });
  return Object.values(pendentes).sort((a, b) => b.volume - a.volume);
}

function obterUsoAtualRPD_() {
  const aba = getPlanilhaAppGmail_().getSheetByName('API - Gemini');
  return aba ? parseInt(aba.getRange('B4').getValue(), 10) || 0 : 0;
}

function montarEstatisticasRemetentes_(dadosLegado) {
  const mapa = {};
  dadosLegado.forEach(linha => {
    const remetente = String(linha[1] || '').toLowerCase().trim();
    const assuntoNormalizado = limparAssuntoPlanoB(linha[2]);
    if (!remetente) return;
    if (!mapa[remetente]) mapa[remetente] = { total: 0, assuntos: {} };
    mapa[remetente].total++;
    mapa[remetente].assuntos[assuntoNormalizado] = true;
  });
  return mapa;
}

function inferirTipoCorrespondenciaPadrao_(mapaRemetentes, remetente) {
  const info = mapaRemetentes[remetente];
  if (!info) return 'Assunto';
  const assuntosDistintos = Object.keys(info.assuntos).length;
  if (info.total >= 2 && assuntosDistintos >= 2) return 'E-mail';
  return 'Assunto';
}

function extrairNomeContato_(remetente, fallback) {
  const texto = String(remetente || '').trim();
  const emailMatch = texto.match(/<([^>]+)>/);
  if (emailMatch) return emailMatch[1].trim();
  const nome = texto.replace(/<[^>]+>/g, '').replace(/["']/g, '').trim();
  if (nome) return nome;
  return String(fallback || texto || '').trim();
}

function normalizarTratadoAssunto_(tratado, assuntoOriginal) {
  const tratadoLimpo = String(tratado || '').trim();
  const assuntoFallback = extrairNucleoAssunto_(assuntoOriginal);
  const tratadoLower = tratadoLimpo.toLowerCase();

  const genericos = [
    'sion energia',
    'operacao sion',
    'operação sion',
    'administrativo',
    'financeiro',
    'comercial',
    'back office',
    'back tradener',
    'cobranca',
    'cobrança',
    'atendimento',
    'relacionamento'
  ];

  if (!tratadoLimpo) return assuntoFallback;
  if (tratadoLimpo.length <= 4) return assuntoFallback;
  if (genericos.includes(tratadoLower)) return assuntoFallback;

  return tratadoLimpo;
}

function extrairNucleoAssunto_(assuntoOriginal) {
  let assunto = String(assuntoOriginal || '').trim();
  if (!assunto) return '';

  assunto = assunto
    .replace(/^(re|res|fwd|fw|enc)\s*:\s*/i, '')
    .replace(/\|\s*sion energia\s*$/i, '')
    .replace(/\s*-\s*[A-Za-z0-9À-ÿ./& ]+\|\s*sion energia\s*$/i, '')
    .replace(/\s*-\s*(janeiro|fevereiro|mar[cç]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\/?\d{0,4}/i, '')
    .trim();

  const padroes = [
    /encargo energia reserva ccee/i,
    /registro\s*-\s*devec/i,
    /solicita[cç][aã]o de nf faltante/i,
    /faturamentos pendentes/i,
    /notas? em aberto/i,
    /medi[cç][aã]o/i,
    /status de contratos/i,
    /garantia financeira/i,
    /extrato conta corrente/i
  ];

  for (const padrao of padroes) {
    const match = assunto.match(padrao);
    if (match) return formatarTituloTratado_(match[0]);
  }

  const partes = assunto.split(/\s+-\s+/);
  if (partes.length > 0) {
    const primeiraParte = partes[0].trim();
    if (primeiraParte) return primeiraParte;
  }

  return limparAssuntoPlanoB(assunto);
}

function formatarTituloTratado_(texto) {
  return String(texto || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\bdevec\b/i, 'DEVEC')
    .replace(/\bccee\b/ig, 'CCEE')
    .replace(/\bnf\b/ig, 'NF')
    .replace(/\bnfe\b/ig, 'NFe');
}

function normalizarTipoCorrespondencia_(valor) {
  return String(valor).trim() === 'E-mail' ? 'E-mail' : 'Assunto';
}

function obterPrimeiraLinhaVaziaTabela_(aba, linhaInicial, totalColunas) {
  if (!aba) return linhaInicial;
  const ultimaLinhaComConteudo = aba.getLastRow();
  if (ultimaLinhaComConteudo < linhaInicial) return linhaInicial;
  const totalLinhas = Math.max(1, ultimaLinhaComConteudo - linhaInicial + 1);
  const dados = aba.getRange(linhaInicial, 1, totalLinhas, totalColunas).getValues();
  for (let i = 0; i < dados.length; i++) {
    const linhaVazia = dados[i].every(celula => String(celula).trim() === '');
    if (linhaVazia) return linhaInicial + i;
  }
  return ultimaLinhaComConteudo + 1;
}

function obterPrimeiraLinhaLivreRegras_(abaRegras) {
  if (!abaRegras) return 3;
  const linhaInicial = 3;
  const ultimaLinha = Math.max(linhaInicial, abaRegras.getLastRow());
  const totalLinhas = Math.max(1, ultimaLinha - linhaInicial + 1);
  const colB = abaRegras.getRange(linhaInicial, 2, totalLinhas, 1).getValues();
  const colC = abaRegras.getRange(linhaInicial, 3, totalLinhas, 1).getValues();
  const colD = abaRegras.getRange(linhaInicial, 4, totalLinhas, 1).getValues();
  const colF = abaRegras.getRange(linhaInicial, 6, totalLinhas, 1).getValues();
  const colM = abaRegras.getRange(linhaInicial, 13, totalLinhas, 1).getValues();
  for (let i = 0; i < totalLinhas; i++) {
    const ocupada = [colB[i][0], colC[i][0], colD[i][0], colF[i][0], colM[i][0]]
      .some(celula => String(celula).trim() !== '');
    if (!ocupada) return linhaInicial + i;
  }
  return ultimaLinha + 1;
}

function obterIndicesMemoriaExistentes_(abaMem) {
  const origemKeys = new Set();
  const padraoKeys = new Set();
  if (!abaMem || abaMem.getLastRow() < 2) return { origemKeys, padraoKeys };
  const dados = abaMem.getRange(2, 1, abaMem.getLastRow() - 1, 7).getValues();
  dados.forEach(linha => {
    const origem = String(linha[1] || '').trim().toLowerCase();
    const tratado = String(linha[2] || '').trim().toLowerCase();
    const atividade = String(linha[3] || '').trim().toLowerCase();
    const marcador = String(linha[4] || '').trim().toLowerCase();
    const tipoCorrespondencia = normalizarTipoCorrespondencia_(linha[5]);
    if (origem) origemKeys.add(`${origem}|${tipoCorrespondencia}`);
    if (tratado || atividade || marcador) {
      padraoKeys.add(`${tratado}|${atividade}|${marcador}|${tipoCorrespondencia}`);
    }
  });
  return { origemKeys, padraoKeys };
}

function obterChavesRegrasExistentes_(abaRegras, cabecalhos) {
  const chaves = new Set();
  if (!abaRegras || abaRegras.getLastRow() < 3) return chaves;

  const idxTipoEntrada = cabecalhos.findIndex(h => String(h || '').toLowerCase().includes('tipo entrada'));
  const idxTipoBusca = cabecalhos.findIndex(h => {
    const texto = String(h || '').toLowerCase();
    return texto.includes('tipo critério busca email') || texto.includes('tipo criterio busca email');
  });
  const idxCriterio1 = cabecalhos.findIndex(h => {
    const texto = String(h || '').toLowerCase();
    return texto.includes('critério 1') || texto.includes('criterio 1');
  });

  if (idxTipoEntrada === -1 || idxTipoBusca === -1 || idxCriterio1 === -1) return chaves;

  const dados = abaRegras.getRange(3, 1, abaRegras.getLastRow() - 2, cabecalhos.length).getValues();
  dados.forEach(linha => {
    const tipoEntrada = String(linha[idxTipoEntrada] || '').trim();
    const tipoBusca = String(linha[idxTipoBusca] || '').trim();
    const criterio1 = String(linha[idxCriterio1] || '').trim().toLowerCase();
    if (tipoEntrada && tipoBusca && criterio1) {
      chaves.add(`${tipoEntrada}|${tipoBusca}|${criterio1}`);
    }
  });

  return chaves;
}

function construirLinhaRegraPorCabecalho_(cabecalhos, indiceLinha, dados) {
  const linha = new Array(cabecalhos.length).fill('');
  cabecalhos.forEach((cabecalho, idx) => {
    const h = String(cabecalho || '').toLowerCase().trim();
    if (h === 'índice' || h === 'indice') linha[idx] = indiceLinha;
    else if (h.includes('tipo entrada')) linha[idx] = dados.tipoRegra;
    else if (h.includes('tipo critério busca email') || h.includes('tipo criterio busca email')) linha[idx] = dados.tipoBuscaEmail;
    else if (h.includes('critério 1') || h.includes('criterio 1')) linha[idx] = dados.valorFiltro;
    else if (h.includes('atividade')) linha[idx] = dados.atividadeFinal;
    else if (h.includes('ignorar a caixa de entrada')) linha[idx] = true;
    else if (h.includes('aplicar o marcador')) linha[idx] = true;
    else if (h.includes('nunca enviar para spam')) linha[idx] = true;
    else if (h.includes('aplicar filtro a conversas correspondentes')) linha[idx] = true;
    else if (h.includes('marcador selecionado')) linha[idx] = dados.marcadorFinal;
    else if (h.includes('fonte')) linha[idx] = dados.fonte;
  });
  return linha;
}

function obterValidacaoAtividades_(ss) {
  const abaMarcadoresManuais = ss.getSheetByName('Marcadores Manuais');
  if (!abaMarcadoresManuais || abaMarcadoresManuais.getLastRow() < 2) return null;
  const ultimaLinha = Math.max(2, abaMarcadoresManuais.getLastRow());
  const intervalo = abaMarcadoresManuais.getRange(2, 4, ultimaLinha - 1, 2);
  return SpreadsheetApp.newDataValidation()
    .requireValueInRange(intervalo, true)
    .setAllowInvalid(false)
    .build();
}

function obterListaAtividadesValidas_(ss) {
  const lista = [];
  const abaMarcadoresManuais = ss.getSheetByName('Marcadores Manuais');
  if (!abaMarcadoresManuais || abaMarcadoresManuais.getLastRow() < 2) return lista;
  const dados = abaMarcadoresManuais.getRange(2, 4, abaMarcadoresManuais.getLastRow() - 1, 2).getValues();
  dados.forEach(linha => {
    [linha[0], linha[1]].forEach(valor => {
      const atividade = String(valor || '').trim();
      if (atividade && !lista.includes(atividade)) lista.push(atividade);
    });
  });
  return lista;
}

function obterMapaMarcadorAtividadeValida_(ss) {
  const mapa = {};
  const abaMarcadoresManuais = ss.getSheetByName('Marcadores Manuais');
  if (!abaMarcadoresManuais || abaMarcadoresManuais.getLastRow() < 2) return mapa;
  const dados = abaMarcadoresManuais.getRange(2, 4, abaMarcadoresManuais.getLastRow() - 1, 3).getValues();
  dados.forEach(linha => {
    const atividadeD = String(linha[0] || '').trim();
    const atividadeE = String(linha[1] || '').trim();
    const marcadorF = String(linha[2] || '').trim();
    if (!marcadorF) return;
    if (atividadeD && !mapa[marcadorF]) mapa[marcadorF] = atividadeD;
    else if (atividadeE && !mapa[marcadorF]) mapa[marcadorF] = atividadeE;
  });
  return mapa;
}

function normalizarAtividadeAPartirDoMarcador_(marcador, mapaMarcadorAtividade) {
  const marcadorLimpo = String(marcador || '').trim();
  if (!marcadorLimpo) return '';
  const mapa = mapaMarcadorAtividade || obterMapaMarcadorAtividadeValida_(getPlanilhaAppGmail_());
  if (mapa[marcadorLimpo]) return mapa[marcadorLimpo];

  const marcadorLower = marcadorLimpo.toLowerCase();
  const encontrado = Object.keys(mapa).find(chave => String(chave || '').trim().toLowerCase() === marcadorLower);
  return encontrado ? mapa[encontrado] : '';
}

function construirMapaAtividadesMarcadores_(ss) {
  const mapa = {};
  const abaMarcadoresManuais = ss.getSheetByName('Marcadores Manuais');
  if (!abaMarcadoresManuais || abaMarcadoresManuais.getLastRow() < 2) return mapa;

  const dados = abaMarcadoresManuais.getRange(2, 3, abaMarcadoresManuais.getLastRow() - 1, 4).getValues();
  dados.forEach(linha => {
    const marcador = String(linha[3] || '').trim();
    if (!marcador) return;
    [linha[0], linha[1], linha[2]].forEach(atividade => {
      const chave = String(atividade || '').trim();
      if (chave && !mapa[chave]) mapa[chave] = marcador;
    });
  });

  return mapa;
}

function normalizarAtividadeExistente_(atividade, mapaAtividades) {
  const atividadeLimpa = String(atividade || '').trim();
  if (!atividadeLimpa) return '';
  const ss = getPlanilhaAppGmail_();
  const atividadesValidas = obterListaAtividadesValidas_(ss);
  if (atividadesValidas.includes(atividadeLimpa)) return atividadeLimpa;

  const atividadeLower = atividadeLimpa.toLowerCase();
  const encontrada = atividadesValidas.find(chave => String(chave || '').trim().toLowerCase() === atividadeLower);
  if (encontrada) return encontrada;

  const mapaMarcadorAtividade = obterMapaMarcadorAtividadeValida_(ss);
  if (mapaMarcadorAtividade[atividadeLimpa]) return mapaMarcadorAtividade[atividadeLimpa];

  const marcadorEncontrado = Object.keys(mapaMarcadorAtividade)
    .find(chave => String(chave || '').trim().toLowerCase() === atividadeLower);
  return marcadorEncontrado ? mapaMarcadorAtividade[marcadorEncontrado] : '';
}

function preencherMarcadoresPorAtividadeCentro_(abaCentro, linhaInicial, quantidadeLinhas, mapaAtividades) {
  if (quantidadeLinhas <= 0) return;
  const mapa = mapaAtividades || construirMapaAtividadesMarcadores_(getPlanilhaAppGmail_());
  const atividadeAjuste = abaCentro.getRange(linhaInicial, 10, quantidadeLinhas, 1).getValues();
  const saida = atividadeAjuste.map((linha) => {
    const atividade = String(linha[0] || '').trim();
    const atividadeLimpa = String(atividade || '').trim();
    if (!atividadeLimpa) return [''];
    return [mapa[atividadeLimpa] || 'Não encontrado'];
  });
  abaCentro.getRange(linhaInicial, 11, quantidadeLinhas, 1).setValues(saida);
}

function buscarMarcadorPorAtividade_(atividade) {
  const atividadeNormalizada = String(atividade || '').trim();
  if (!atividadeNormalizada) return '';
  const ss = getPlanilhaAppGmail_();
  const abaMarcadoresManuais = ss.getSheetByName('Marcadores Manuais');
  if (!abaMarcadoresManuais || abaMarcadoresManuais.getLastRow() < 2) return 'Não encontrado';
  const dados = abaMarcadoresManuais.getRange(2, 3, abaMarcadoresManuais.getLastRow() - 1, 4).getValues();
  for (const linha of dados) {
    const atividadeC = String(linha[0] || '').trim();
    const atividadeD = String(linha[1] || '').trim();
    const atividadeE = String(linha[2] || '').trim();
    const marcadorF = String(linha[3] || '').trim();
    if ([atividadeC, atividadeD, atividadeE].includes(atividadeNormalizada)) return marcadorF || 'Não encontrado';
  }
  return 'Não encontrado';
}

function onEdit(e) {
  try {
    const range = e && e.range;
    if (!range) return;
    const sheet = range.getSheet();
    if (sheet.getName() !== 'Centro de treinamento') return;
    if (range.getRow() < 2) return;
    if (range.getColumn() === 4 || range.getColumn() === 10) {
      preencherMarcadoresPorAtividadeCentro_(sheet, range.getRow(), range.getNumRows());
    }
  } catch (err) {
    console.log('onEdit erro: ' + err);
  }
}
