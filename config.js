/*
 * Configuração editável do funil "Consagração a Nossa Senhora".
 * Mexa só aqui para ajustar player, webhook e contadores — sem tocar no app.js.
 */
window.CONFIG = {
  // ---------------------------------------------------------------------------
  // PLAYER DE VÍDEO (VSL)
  // TODO: substituir pelo embed do Vturb.
  // Se VSL_EMBED_CODE tiver qualquer HTML (Vturb/ConverteAI), o player nativo é
  // renderizado. Se ficar vazio (""), cai no fallback do YouTube abaixo.
  VSL_EMBED_CODE: "",
  YOUTUBE_EMBED_URL: "https://www.youtube.com/embed/KCUzCsT1cwM",

  // ---------------------------------------------------------------------------
  // CHECKOUT (não alterar sem necessidade — é o link da Hotmart)
  CHECKOUT_URL: "https://pay.hotmart.com/F103323048Y?checkoutMode=10&bid=1765238489038",

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
