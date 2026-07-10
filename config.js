/*
 * Configuração editável do funil "Consagração a Nossa Senhora".
 * Mexa só aqui para ajustar player, webhook e contadores — sem tocar no app.js.
 */
window.CONFIG = {
  // ---------------------------------------------------------------------------
  // PLAYER DE VÍDEO (VSL) — player nativo com overlay "clique para ouvir" e barra vermelha.
  // Se VSL_EMBED_CODE tiver HTML (Vturb/ConverteAI), ele é usado no lugar do vídeo nativo.
  VSL_EMBED_CODE: "",
  // Vídeo VSL hospedado no próprio site (arquivo em assets/). Troque aqui se mudar o vídeo.
  VSL_VIDEO_URL: "assets/vsl.mp4",
  // Quadro de capa mostrado ANTES do play (evita tela preta). Gerado do próprio vídeo.
  VSL_POSTER_URL: "assets/vsl-poster.jpg",

  // ---------------------------------------------------------------------------
  // CHECKOUT (não alterar sem necessidade — é o link da Hotmart)
  CHECKOUT_URL: "https://pay.hotmart.com/F103323048Y?checkoutMode=10",

  // ---------------------------------------------------------------------------
  // LEADS — para onde enviar nome + telefone + respostas do quiz.
  // Deixe "" para apenas guardar em localStorage. Se preencher com a URL de um
  // webhook (ex.: n8n, Zapier, Supabase Edge Function), o mesmo payload com o
  // telefone é enviado via POST.
  LEAD_WEBHOOK_URL: "",

  // ---------------------------------------------------------------------------
  // CONTADORES REAIS (escassez honesta).
  // Ficam ESCONDIDOS por padrão. Só aparecem se você passar um número real
  // (ex.: vindo de uma API). Enquanto forem null, nada de número inventado.
  LIVE_VIEWERS: null,   // ex.: 320  -> "320 pessoas estão visualizando esta página"
  CANDLES_TODAY: null,  // ex.: 1450 -> "1.450 pessoas acenderam velas hoje"

  // ---------------------------------------------------------------------------
  // TURMA — fuso usado para calcular a segunda-feira de início e o deadline.
  TIMEZONE: "America/Sao_Paulo",
};
