/**
 * Referencia local da marca Sion Energia para consulta futura no projeto.
 * Este arquivo nao altera o painel. Ele existe para servir como fonte de contexto.
 *
 * Quando o PDF oficial estiver disponivel dentro do projeto, este objeto pode
 * ser atualizado com as informacoes finais de paleta, tipografia e regras de uso.
 */
const SION_MANUAL_MARCA = {
  marca: 'Sion Energia',
  logo: {
    formatoPreferencial: 'PNG',
    observacao: 'Manter boa area de respiro e contraste elevado no fundo.'
  },
  paletaBase: {
    fundoPrincipal: '#060606',
    fundoSecundario: '#121212',
    destaque: '#D8C3A1',
    textoPrincipal: '#F5F1E8',
    textoSecundario: '#9F8A6B',
    apoioAzul: '#8EB8FF',
    apoioVerde: '#9AD28F',
    apoioVermelho: '#FF7D7D'
  },
  tipografia: {
    interface: 'Segoe UI',
    consoleTecnico: 'Consolas',
    observacao: 'Tipografia oficial da marca pendente de confirmacao pelo PDF.'
  },
  estilo: {
    direcao: 'Premium, escuro, elegante e minimalista',
    recomendacoes: [
      'Usar fundos escuros com contraste suave.',
      'Aplicar dourado/bege como cor de destaque, evitando excesso.',
      'Manter blocos com bordas discretas e cantos arredondados.'
    ]
  },
  pendencias: [
    'Validar paleta oficial no PDF do manual da marca.',
    'Confirmar tipografia institucional.',
    'Registrar regras de aplicacao do logotipo.'
  ]
};
