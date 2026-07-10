/* =============================================================================
 * Consagração a Nossa Senhora — Funil de quiz (versão estática editável)
 * Reconstruído a partir do build original do Lovable, com o mesmo design system.
 * As 8 alterações pedidas estão marcadas com [MUDANÇA N] ao longo do arquivo.
 * ========================================================================== */
(function () {
  "use strict";

  var CFG = window.CONFIG || {};
  var LOGO = "assets/terco-logo-C1YZp5Eu.png";
  var IMG_NS = "assets/nossa-senhora-bKC9tQbd.png";
  var IMG_PRODUTOS = "assets/produtos-consagracao-CtH9pHKC.jpg";
  var IMG_BONUS1 = "assets/bonus-1-B9lGvJE_.jpg";
  var IMG_BONUS2 = "assets/bonus-2-DqT0E-YA.jpg";

  // --- Estado global do funil ------------------------------------------------
  var state = {
    step: 0,
    userName: "",
    answers: {},   // { [stepIndex]: string | string[] }
    phone: "",     // dígitos crus DDD+número  [MUDANÇA 2]
    intention: "",
    candleLit: false,
    musicMuted: true,
  };

  // --- Ícones (lucide, inline) ----------------------------------------------
  function svg(inner, opts) {
    opts = opts || {};
    var cls = opts.cls || "";
    var fill = opts.fill || "none";
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
      'fill="' + fill + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" class="' + cls + '">' + inner + "</svg>"
    );
  }
  var ICON = {
    check: function (c) { return svg('<path d="M20 6 9 17l-5-5"/>', { cls: c }); },
    sparkles: function (c) {
      return svg(
        '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
        { cls: c }
      );
    },
    play: function (c) { return svg('<polygon points="6 3 20 12 6 21 6 3"/>', { cls: c, fill: "currentColor" }); },
    volume2: function (c) {
      return svg('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>', { cls: c });
    },
    volumeX: function (c) {
      return svg('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>', { cls: c });
    },
    star: function (c) { return svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', { cls: c, fill: "currentColor" }); },
    clock: function (c) { return svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', { cls: c }); },
    users: function (c) { return svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', { cls: c }); },
    shield: function (c) { return svg('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>', { cls: c }); },
  };

  // --- Utilidades ------------------------------------------------------------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  // Realça palavras em CAIXA ALTA (>=3 letras) em <strong>, como no original.
  function ll(text) {
    return text.split(/(\s+)/).map(function (w) {
      var letters = w.replace(/[^A-ZÀ-Ú]/g, "");
      if (letters.length >= 3 && w === w.toUpperCase() && /[A-ZÀ-Ú]/.test(w)) {
        return "<strong>" + esc(w) + "</strong>";
      }
      return esc(w);
    }).join("");
  }
  // Deixa em negrito o trecho antes da 1ª vírgula (como EC/jC do original).
  function fmtOption(text) {
    var i = text.indexOf(",");
    if (i > 0) return "<strong>" + ll(text.slice(0, i)) + "</strong>," + ll(text.slice(i + 1));
    return ll(text);
  }
  function q(sel) { return document.querySelector(sel); }
  function root() { return document.getElementById("root"); }

  // ===========================================================================
  // DADOS DO QUIZ  (copy corrigida: 15 dias, gênero neutro, 5ª opção do milagre)
  // ===========================================================================
  var MILAGRE_OPCOES = [
    "Cura pra uma dor emocional, ou pela falta de quem eu AMO e não tá mais aqui.",
    "Restauração de um relacionamento quebrado, ferido, que me machuca até hoje.",
    "Descobrir MEU PROPÓSITO, algo que me faça ACORDAR todos os dias com VONTADE DE VIVER.",
    "Força pra continuar ACREDITANDO, parece que Deus tá em silêncio.",
    "Saúde e proteção para minha família.", // [MUDANÇA 6] nova 5ª opção
  ];

  var STEPS = [
    { type: "name-input", progress: 10 },
    { type: "confirmation", progress: 20 },
    {
      type: "radio", progress: 30,
      // [MUDANÇA 4] "Seja sincera" -> "Seja sincero(a)"
      question: "🕯️ Seja sincero(a)…\nVOCÊ TÁ PASSANDO POR UMA FASE DIFÍCIL?",
      options: [
        "Sim, carrego uma dor no peito que parece NUNCA ter fim.",
        "Sim, me sinto PERDIDO(A), longe de Deus, longe de mim, sem rumo.",
        "Sim, tô EXAUSTO(A), sem forças, como se a vida tivesse pesado demais.",
        "Não, não tô sofrendo, mas SINTO QUE PRECISO me reconectar com Deus, antes que seja tarde.",
      ],
    },
    {
      type: "radio", progress: 40,
      question: "Você já pediu ajuda a Nossa Senhora em momentos difíceis?",
      options: [
        "Sim, muitas vezes. Ela é meu refúgio quando tudo desaba",
        "Já tentei, mas nunca consegui manter uma constância",
        "Ainda não, mas sinto que preciso aprender a confiar",
        "Tenho dúvidas, mas algo em mim quer tentar dessa vez",
      ],
    },
    {
      type: "checkbox", progress: 50,
      question: "AGORA ME CONTA…\nEM QUAL ÁREA DA SUA VIDA VOCÊ MAIS TÁ CLAMANDO POR UM MILAGRE? 👀🙏",
      options: MILAGRE_OPCOES,
      subtitle: "(Pode escolher mais de uma... porque eu sei que, às vezes, a vida pesa em tudo.)",
    },
    {
      type: "radio", progress: 60,
      question: "Você já viveu uma Consagração entregando tudo de coração?",
      options: [
        "Sim, e foi uma das experiências mais profundas da minha vida",
        "Sim, senti a presença dEla quando mais precisei",
        "Ainda não, mas sinto que agora é o meu momento de confiar",
        "Não, e preciso de ajuda, não sei nem por onde começar",
      ],
    },
    {
      type: "radio", progress: 70,
      question: 'Se você soubesse que essa Consagração pode ser o ponto de virada da sua vida… você teria coragem de dizer "sim" ao chamado?',
      options: [
        "Sim, é exatamente disso que eu preciso agora",
        "Sim, mas preciso de ajuda pra saber por onde começar",
        "Ainda tenho dúvidas, mas quero entender melhor",
        "Não sei se tô pronto(a), mas algo em mim quer tentar", // [MUDANÇA 4]
      ],
    },
    {
      type: "radio", progress: 80,
      // [MUDANÇA 4] "pronta" -> "pronto(a)"
      question: "Você sente que está pronto(a) para entregar seu coração a uma jornada de fé que pode mudar tudo?",
      options: [
        "Sim, algo dentro de mim diz que esse é o meu momento",
        "Estou pronto(a), eu sei que não cheguei até aqui por acaso", // [MUDANÇA 4]
        "Quero muito, mas preciso de ajuda pra saber como começar",
      ],
    },
    { type: "whatsapp", progress: 90 }, // [MUDANÇA 2] captura de WhatsApp (era pergunta de rádio)
    {
      type: "candle", progress: 100,
      question: "Se você pudesse entregar hoje um pedido direto nas mãos de Nossa Senhora… o que sairia do seu coração? 🙏",
    },
  ];

  // ===========================================================================
  // MÚSICA (botão flutuante — cosmético, como no original)
  // ===========================================================================
  function musicButton() {
    return (
      '<button id="music-toggle" class="fixed bottom-4 right-4 z-50 bg-card backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-accent transition-colors duration-200 border border-gold-300" ' +
      'aria-label="' + (state.musicMuted ? "Tocar música" : "Pausar música") + '">' +
      (state.musicMuted ? ICON.volumeX("h-5 w-5 text-charcoal-500") : ICON.volume2("h-5 w-5 text-charcoal-500")) +
      "</button>"
    );
  }
  function bindMusic() {
    var b = q("#music-toggle");
    if (b) b.onclick = function () { state.musicMuted = !state.musicMuted; var el = q("#music-toggle"); if (el) el.outerHTML = musicButton(); bindMusic(); };
  }

  // ===========================================================================
  // BARRA DE PROGRESSO
  // ===========================================================================
  function progressBar(p) {
    return (
      '<div class="w-full mb-6"><div class="flex justify-between text-sm text-charcoal-500 mb-2 font-medium">' +
      "<span>Progresso</span><span>" + p + "% concluído</span></div>" +
      '<div class="w-full h-2 bg-accent rounded-full overflow-hidden">' +
      '<div class="h-full bg-burgundy-700 rounded-full transition-all duration-500 ease-out" style="width:' + p + '%"></div>' +
      "</div></div>"
    );
  }

  // ===========================================================================
  // LANDING
  // ===========================================================================
  function renderLanding() {
    root().innerHTML =
      '<main class="bg-background flex flex-col items-center pt-6 md:pt-10 px-4 pb-24 min-h-screen">' +
      '<div class="w-full flex justify-center mb-5"><img src="' + LOGO + '" alt="Terço Mariano" class="mx-auto h-[60px] w-auto animate-fade-in"></div>' +
      '<div class="w-full max-w-[380px] mx-auto"><div class="text-center">' +
      '<h1 class="text-2xl md:text-3xl font-bold text-burgundy-700 mb-3 opacity-0 animate-fade-in-up stagger-1">ISSO NÃO É POR ACASO...</h1>' +
      '<p class="text-lg md:text-xl font-semibold text-charcoal-700 mb-4 opacity-0 animate-fade-in-up stagger-2">Se você chegou até aqui, é porque <span class="text-burgundy-600">ELA TE CHAMOU</span>. 👀</p>' +
      '<p class="text-lg font-bold text-burgundy-700 mb-4 opacity-0 animate-fade-in-up stagger-2">Mas agora... VOCÊ VAI TER CORAGEM DE DIZER "SIM"?</p>' +
      '<div class="mb-4 bg-card border border-gold-300 rounded-xl p-4 shadow-sm opacity-0 animate-fade-in-up stagger-3">' +
      '<p class="mb-2 text-charcoal-700"><span class="flex items-center justify-center gap-1 text-burgundy-700 font-bold mb-1">🙏 Consagração a Nossa Senhora</span>' +
      '<span class="text-charcoal-700"><span class="font-semibold">👉 Uma jornada de 15 dias</span> que <span class="font-bold text-burgundy-600">TRANSFORMA</span> sua vida, fortalece sua fé e te conecta profundamente com o amor da Mãe que nunca te abandona.</span></p>' +
      '<p class="text-charcoal-700 font-medium"><span class="text-burgundy-600 font-bold">🔥 Se prepare</span> para se curar, se libertar e sentir a presença dela como <span class="font-bold">NUNCA</span> antes!</p>' +
      "</div>" +
      '<div class="mb-8 opacity-0 animate-fade-in-up stagger-4"><img src="' + IMG_NS + '" alt="Consagração à Nossa Senhora - Mãezinha amada rogai por nós" class="mx-auto rounded-xl shadow-burgundy"></div>' +
      "</div></div>" +
      '<button id="start-btn" class="w-full max-w-[380px] mx-auto block py-4 rounded-xl font-bold text-lg bg-burgundy-700 text-white hover:bg-burgundy-800 transition-all shadow-burgundy">INICIAR MINHA JORNADA</button>' +
      musicButton() +
      "</main>";
    q("#start-btn").onclick = function () { state.step = 0; location.hash = "#/quiz"; };
    bindMusic();
  }

  // ===========================================================================
  // QUIZ (dispatcher por passo)
  // ===========================================================================
  function renderQuiz() {
    var s = STEPS[state.step];
    var inner;
    switch (s.type) {
      case "name-input": inner = stepName(); break;
      case "confirmation": inner = stepConfirm(); break;
      case "radio": inner = stepRadio(s); break;
      case "checkbox": inner = stepCheckbox(s); break;
      case "whatsapp": inner = stepWhatsapp(); break;
      case "candle": inner = stepCandle(s); break;
      default: inner = "";
    }
    root().innerHTML =
      '<main class="bg-background flex flex-col items-center pt-6 md:pt-10 px-4 pb-24 min-h-screen">' +
      '<div class="w-full flex justify-center mb-5"><img src="' + LOGO + '" alt="Terço Mariano" class="mx-auto h-[50px] w-auto animate-fade-in"></div>' +
      inner + musicButton() + "</main>";
    bindStep(s);
    bindMusic();
  }

  function nextStep() {
    if (state.step >= STEPS.length - 1) { startLoading(); return; }
    state.step += 1;
    renderQuiz();
  }

  // --- Passo: nome -----------------------------------------------------------
  function stepName() {
    return (
      '<div class="w-full max-w-[380px] mx-auto animate-fade-in">' + progressBar(10) +
      '<div class="text-center mb-6">' +
      '<h2 class="text-2xl md:text-3xl font-bold text-burgundy-700 mb-4">🕯️ DURANTE 15 DIAS...</h2>' +
      '<p class="text-charcoal-700 text-lg mb-2">Milhares de vozes vão se unir em oração. 🙏</p>' +
      '<p class="text-charcoal-700 text-lg mb-4">Intenções serão entregues. Corações serão transformados.</p>' +
      '<p class="text-xl font-bold text-burgundy-700 mb-6">👀 E O SEU NOME… VAI ESTAR LÁ?</p></div>' +
      '<div class="bg-card border border-gold-300 rounded-xl p-5 mb-6">' +
      '<p class="text-charcoal-700 mb-2">⚠️ Não deixa pra depois. Não ignora esse chamado.</p>' +
      '<p class="text-charcoal-700">👉 Escreva seu nome AGORA e coloque sua vida nas mãos dela.</p></div>' +
      '<div class="mb-6"><label class="block text-charcoal-700 font-medium mb-2">Seu nome, com fé 👇</label>' +
      '<input id="name-input" type="text" value="' + esc(state.userName) + '" placeholder="Escreva com fé...." ' +
      'class="w-full p-4 rounded-xl border-2 border-gold-300 bg-card text-charcoal-700 placeholder-charcoal-400 focus:border-burgundy-600 focus:outline-none transition-colors"></div>' +
      '<button id="name-btn" class="w-full py-4 rounded-xl font-bold text-lg transition-all bg-charcoal-300 text-charcoal-500 cursor-not-allowed">QUERO ME CONSAGRAR</button></div>'
    );
  }

  // --- Passo: confirmação ----------------------------------------------------
  function stepConfirm() {
    var n = esc(state.userName.toUpperCase());
    return (
      '<div class="w-full max-w-[380px] mx-auto animate-fade-in">' + progressBar(20) +
      '<div class="text-center mb-6"><h2 class="text-2xl md:text-3xl font-bold text-burgundy-700 mb-4">🔥 SEU NOME AGORA ESTÁ EM ORAÇÃO, ' + n + "!</h2></div>" +
      '<div class="bg-card border border-gold-300 rounded-xl p-5 mb-8">' +
      '<p class="text-charcoal-700 mb-4 text-center">🙏 Ele será <strong class="text-burgundy-700">CLAMADO</strong> com fé, <strong class="text-burgundy-700">APRESENTADO</strong> aos pés da cruz e entregue ao coração de Nossa Senhora.</p>' +
      '<p class="text-charcoal-700 mb-4 text-center">⚠️ Agora, antes de seguirmos... me responde uma coisa:</p>' +
      '<p class="text-burgundy-700 font-bold text-center text-lg mb-4">QUEM É VOCÊ nessa jornada? O que te trouxe até aqui?</p>' +
      '<p class="text-charcoal-700 text-center">👉 Responde aí e vamos entender como <strong class="text-burgundy-700">ELA</strong> pode te transformar.</p></div>' +
      '<button id="confirm-btn" class="w-full py-4 rounded-xl font-bold text-lg bg-burgundy-700 text-white hover:bg-burgundy-800 transition-all">QUERO CONTINUAR COM FÉ</button></div>'
    );
  }

  // --- Passo: rádio (escolha única) ------------------------------------------
  function stepRadio(s) {
    var sel = state.answers[state.step] || "";
    var opts = s.options.map(function (o, i) {
      var on = sel === o;
      return (
        '<button data-opt="' + esc(o) + '" class="w-full text-center p-4 rounded-xl border-2 transition-all duration-300 hover:border-burgundy-600/50 hover:bg-accent/50 font-medium text-sm md:text-base flex items-center gap-3 opacity-0 animate-fade-in-up ' +
        (on ? "border-burgundy-700 bg-burgundy-700/10 text-charcoal-700" : "border-gold-300 bg-card text-charcoal-700") + '" style="animation-delay:' + (i * 0.1) + 's;animation-fill-mode:forwards">' +
        '<span class="opt-dot w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ' + (on ? "border-burgundy-700" : "border-gold-300") + '">' +
        (on ? '<span class="w-3 h-3 rounded-full bg-burgundy-700"></span>' : "") + "</span>" +
        '<span class="flex-1 text-left">' + fmtOption(o) + "</span></button>"
      );
    }).join("");
    return (
      '<div class="w-full max-w-[380px] mx-auto animate-fade-in">' + progressBar(s.progress) +
      '<h2 class="text-xl md:text-2xl font-bold text-burgundy-700 text-center mb-6 whitespace-pre-line">' + esc(s.question) + "</h2>" +
      '<div class="space-y-3">' + opts + "</div></div>"
    );
  }

  // --- Passo: checkbox (múltipla escolha) ------------------------------------
  function stepCheckbox(s) {
    var sel = state.answers[state.step] || [];
    var opts = s.options.map(function (o, i) {
      var on = sel.indexOf(o) !== -1;
      return (
        '<button data-opt="' + esc(o) + '" class="w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:border-burgundy-600/50 hover:bg-accent/50 font-medium text-sm md:text-base flex items-center gap-3 opacity-0 animate-fade-in-up ' +
        (on ? "border-burgundy-700 bg-burgundy-700/10 text-charcoal-700" : "border-gold-300 bg-card text-charcoal-700") + '" style="animation-delay:' + (i * 0.1) + 's;animation-fill-mode:forwards">' +
        '<span class="cb-box w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ' + (on ? "border-burgundy-700 bg-burgundy-700" : "border-gold-300 bg-transparent") + '">' +
        (on ? ICON.check("w-4 h-4 text-white") : "") + "</span>" +
        '<span class="text-center flex-1">' + fmtOption(o) + "</span></button>"
      );
    }).join("");
    var canGo = sel.length > 0;
    return (
      '<div class="w-full max-w-[380px] mx-auto animate-fade-in">' + progressBar(s.progress) +
      '<h2 class="text-xl md:text-2xl font-bold text-burgundy-700 text-center mb-6 whitespace-pre-line">' + esc(s.question) + "</h2>" +
      '<div class="space-y-3 mb-4">' + opts + "</div>" +
      '<p class="text-charcoal-500 text-sm italic text-center mb-6">' + esc(s.subtitle) + "</p>" +
      '<button id="cb-next" class="w-full py-4 rounded-xl font-bold text-lg transition-all ' +
      (canGo ? "bg-burgundy-700 text-white hover:bg-burgundy-800" : "bg-charcoal-300 text-charcoal-500 cursor-not-allowed") + '">Continuar</button></div>'
    );
  }

  // --- Passo: captura de WhatsApp  [MUDANÇA 2] -------------------------------
  function stepWhatsapp() {
    var nome = state.userName ? esc(state.userName) : "amor";
    var valid = isValidPhone(state.phone);
    return (
      '<div class="w-full max-w-[380px] mx-auto animate-fade-in">' + progressBar(90) +
      '<h2 class="text-xl md:text-2xl font-bold text-burgundy-700 text-center mb-3">📲 Falta um passo, ' + nome + ".</h2>" +
      '<p class="text-charcoal-700 text-center mb-6">Deixa seu WhatsApp pra te avisarmos quando a sua turma da Consagração abrir — e te enviarmos o link de acesso pra você não perder o início.</p>' +
      '<div class="mb-4">' +
      '<input id="wpp-input" type="tel" inputmode="tel" autocomplete="tel" value="' + esc(formatPhone(state.phone)) + '" placeholder="+55 (11) 91234-5678" ' +
      'class="w-full p-4 rounded-xl border-2 border-gold-300 bg-card text-charcoal-700 placeholder-charcoal-400 focus:border-burgundy-600 focus:outline-none transition-colors text-center text-lg"></div>' +
      '<button id="wpp-btn" ' + (valid ? "" : "disabled") + ' class="w-full py-4 rounded-xl font-bold text-lg transition-all ' +
      (valid ? "bg-burgundy-700 text-white hover:bg-burgundy-800" : "bg-charcoal-300 text-charcoal-500 cursor-not-allowed") + '">QUERO SER AVISADO(A) 🙏</button>' +
      '<p class="text-charcoal-400 text-xs text-center mt-4">Seus dados estão seguros. Você receberá comunicações sobre a Consagração. Nada de spam.</p></div>'
    );
  }

  // --- Passo: vela -----------------------------------------------------------
  function stepCandle(s) {
    var lit = state.candleLit;
    var candlesLine = "";
    // [MUDANÇA 3] contador "9.152 velas" só aparece se houver valor real de API.
    if (CFG.CANDLES_TODAY != null) {
      candlesLine =
        '<div class="bg-cream-100 rounded-full py-2 px-4 mx-auto w-fit mb-6"><p class="text-charcoal-700 text-sm">' +
        '<span class="text-burgundy-700 font-bold">' + Number(CFG.CANDLES_TODAY).toLocaleString("pt-BR") + "</span> pessoas acenderam velas hoje</p></div>";
    }
    return (
      '<div class="w-full max-w-[380px] mx-auto animate-fade-in">' + progressBar(100) +
      '<h2 class="text-xl md:text-2xl font-bold text-burgundy-700 text-center mb-6">' + esc(s.question) + "</h2>" +
      '<input id="intention-input" type="text" value="' + esc(state.intention) + '" placeholder="Digite aqui sua intenção ou oração" ' +
      'class="w-full p-4 rounded-xl border-2 border-gold-300 bg-card text-charcoal-700 placeholder-charcoal-400 focus:border-burgundy-600 focus:outline-none transition-colors mb-6">' +
      '<p class="text-charcoal-700 text-center mb-4">Acenda uma vela virtual como símbolo da sua fé e intenção</p>' +
      '<div class="flex flex-col items-center mb-6"><button id="candle-btn" class="relative flex flex-col items-center transition-transform hover:scale-105">' +
      (lit ? '<div class="absolute -top-8 left-1/2 -translate-x-1/2"><div class="w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-pulse opacity-90"></div><div class="absolute inset-0 w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-ping opacity-30"></div></div>' : "") +
      '<div class="w-1 h-4 bg-charcoal-700 rounded-full mb-0"></div>' +
      '<div class="w-16 h-24 bg-gradient-to-b from-cream-100 to-cream-200 rounded-t-sm rounded-b-lg shadow-md relative">' +
      (lit ? "" : '<div class="absolute inset-0 flex items-center justify-center"><span class="text-xs text-charcoal-600 font-medium text-center px-1 leading-tight">Toque<br>para<br>acender</span></div>') +
      "</div>" +
      '<div class="w-20 h-4 bg-gradient-to-b from-amber-200 to-amber-300 rounded-md shadow-sm"></div></button></div>' +
      candlesLine +
      '<button id="candle-next" class="w-full py-4 rounded-xl font-bold text-lg bg-burgundy-700 text-white hover:bg-burgundy-800 transition-all">Continuar</button></div>'
    );
  }

  // --- Bind por passo --------------------------------------------------------
  function bindStep(s) {
    if (s.type === "name-input") {
      var inp = q("#name-input"), btn = q("#name-btn");
      var refresh = function () {
        var ok = inp.value.trim().length > 0;
        btn.className = "w-full py-4 rounded-xl font-bold text-lg transition-all " +
          (ok ? "bg-burgundy-700 text-white hover:bg-burgundy-800" : "bg-charcoal-300 text-charcoal-500 cursor-not-allowed");
      };
      inp.oninput = refresh; refresh();
      btn.onclick = function () { if (inp.value.trim()) { state.userName = inp.value.trim(); nextStep(); } };
      inp.onkeydown = function (e) { if (e.key === "Enter" && inp.value.trim()) { state.userName = inp.value.trim(); nextStep(); } };
    } else if (s.type === "confirmation") {
      q("#confirm-btn").onclick = nextStep;
    } else if (s.type === "radio") {
      // Atualiza a seleção NO LUGAR (sem re-render) — evita a "tremida" das animações.
      var paintRadio = function (opt) {
        Array.prototype.forEach.call(document.querySelectorAll("[data-opt]"), function (btn) {
          var on = btn.getAttribute("data-opt") === opt;
          btn.className = "w-full text-center p-4 rounded-xl border-2 transition-all duration-300 hover:border-burgundy-600/50 hover:bg-accent/50 font-medium text-sm md:text-base flex items-center gap-3 " +
            (on ? "border-burgundy-700 bg-burgundy-700/10 text-charcoal-700" : "border-gold-300 bg-card text-charcoal-700");
          var dot = btn.querySelector(".opt-dot");
          if (dot) {
            dot.className = "opt-dot w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all " + (on ? "border-burgundy-700" : "border-gold-300");
            dot.innerHTML = on ? '<span class="w-3 h-3 rounded-full bg-burgundy-700"></span>' : "";
          }
        });
      };
      Array.prototype.forEach.call(document.querySelectorAll("[data-opt]"), function (b) {
        b.onclick = function () {
          var opt = b.getAttribute("data-opt");
          state.answers[state.step] = opt;
          paintRadio(opt);
          setTimeout(nextStep, 400);
        };
      });
    } else if (s.type === "checkbox") {
      // Marca/desmarca NO LUGAR (sem re-render) — evita a "tremida".
      var paintCb = function () {
        var cur = state.answers[state.step] || [];
        Array.prototype.forEach.call(document.querySelectorAll("[data-opt]"), function (btn) {
          var on = cur.indexOf(btn.getAttribute("data-opt")) !== -1;
          btn.className = "w-full text-left p-4 rounded-xl border-2 transition-all duration-300 hover:border-burgundy-600/50 hover:bg-accent/50 font-medium text-sm md:text-base flex items-center gap-3 " +
            (on ? "border-burgundy-700 bg-burgundy-700/10 text-charcoal-700" : "border-gold-300 bg-card text-charcoal-700");
          var box = btn.querySelector(".cb-box");
          if (box) {
            box.className = "cb-box w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all " + (on ? "border-burgundy-700 bg-burgundy-700" : "border-gold-300 bg-transparent");
            box.innerHTML = on ? ICON.check("w-4 h-4 text-white") : "";
          }
        });
        var nb = q("#cb-next");
        if (nb) nb.className = "w-full py-4 rounded-xl font-bold text-lg transition-all " +
          (cur.length > 0 ? "bg-burgundy-700 text-white hover:bg-burgundy-800" : "bg-charcoal-300 text-charcoal-500 cursor-not-allowed");
      };
      Array.prototype.forEach.call(document.querySelectorAll("[data-opt]"), function (b) {
        b.onclick = function () {
          var o = b.getAttribute("data-opt");
          var cur = state.answers[state.step] || [];
          if (cur.indexOf(o) !== -1) cur = cur.filter(function (x) { return x !== o; });
          else cur = cur.concat([o]);
          state.answers[state.step] = cur;
          paintCb();
        };
      });
      q("#cb-next").onclick = function () { if ((state.answers[state.step] || []).length > 0) nextStep(); };
    } else if (s.type === "whatsapp") {
      var wi = q("#wpp-input"), wb = q("#wpp-btn");
      wi.oninput = function () {
        var digits = wi.value.replace(/\D/g, "");
        if (digits.indexOf("55") === 0 && digits.length > 11) digits = digits.slice(2);
        digits = digits.slice(0, 11);
        state.phone = digits;
        wi.value = formatPhone(digits);
        var ok = isValidPhone(digits);
        wb.disabled = !ok;
        wb.className = "w-full py-4 rounded-xl font-bold text-lg transition-all " +
          (ok ? "bg-burgundy-700 text-white hover:bg-burgundy-800" : "bg-charcoal-300 text-charcoal-500 cursor-not-allowed");
      };
      wb.onclick = function () { if (isValidPhone(state.phone)) { saveLead(); nextStep(); } };
    } else if (s.type === "candle") {
      var ci = q("#intention-input");
      ci.oninput = function () { state.intention = ci.value; };
      q("#candle-btn").onclick = function () { state.candleLit = true; renderQuiz(); };
      q("#candle-next").onclick = function () { state.intention = q("#intention-input").value; startLoading(); };
    }
  }

  // ===========================================================================
  // TELEFONE — máscara + validação  [MUDANÇA 2]
  // ===========================================================================
  function formatPhone(digits) {
    digits = (digits || "").replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";
    var ddd = digits.slice(0, 2), rest = digits.slice(2), out = "+55 (" + ddd;
    if (ddd.length === 2) out += ") ";
    if (rest.length <= 4) out += rest;
    else if (rest.length <= 8) out += rest.slice(0, 4) + "-" + rest.slice(4);
    else out += rest.slice(0, 5) + "-" + rest.slice(5);
    return out;
  }
  function isValidPhone(digits) {
    digits = (digits || "").replace(/\D/g, "");
    if (digits.length !== 10 && digits.length !== 11) return false;
    var ddd = parseInt(digits.slice(0, 2), 10);
    if (!(ddd >= 11 && ddd <= 99)) return false;
    if (digits.length === 11 && digits.charAt(2) !== "9") return false; // celular começa com 9
    return true;
  }

  // ===========================================================================
  // LEAD — salva nome + telefone + respostas (mesmo payload)  [MUDANÇA 2]
  // ===========================================================================
  function leadPayload() {
    return {
      name: state.userName,
      phone: state.phone,           // telefone junto das demais respostas
      phoneFormatted: formatPhone(state.phone),
      intention: state.intention,
      answers: state.answers,
      milagre: (state.answers[4] || []),
      ts: new Date().toISOString(),
    };
  }
  function saveLead() {
    var payload = leadPayload();
    try { localStorage.setItem("consagracao_lead", JSON.stringify(payload)); } catch (e) {}
    if (CFG.LEAD_WEBHOOK_URL) {
      try {
        fetch(CFG.LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(function () {});
      } catch (e) {}
    }
    if (window.fbq) { try { fbq("track", "Lead"); } catch (e) {} }
  }

  // ===========================================================================
  // LOADING ÚNICO DE 6s  [MUDANÇA 1]
  // 3 frases (2s cada) + barra contínua 0→100% → redireciona p/ /resultado
  // ===========================================================================
  var LOADING_PHRASES = [
    "Lendo suas respostas com atenção...",
    "Seu nome já está na lista de oração 🙏",
    "Preparando seu caminho de 15 dias...",
  ];
  function startLoading() {
    saveLead(); // garante o lead salvo mesmo que o usuário tenha vindo por atalho
    root().innerHTML =
      '<div class="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-4">' +
      '<img src="' + LOGO + '" alt="Terço Mariano" class="w-16 h-16 mb-8 animate-pulse">' +
      '<div class="loader mb-6"></div>' +
      '<p id="loading-msg" class="text-charcoal-700 font-semibold text-center mb-4">' + LOADING_PHRASES[0] + "</p>" +
      '<div class="w-48 h-2 bg-accent rounded-full overflow-hidden"><div id="loading-bar" class="h-full bg-burgundy-700 rounded-full" style="width:0%"></div></div>' +
      '<p id="loading-pct" class="text-charcoal-500 text-sm mt-2">0%</p></div>';

    var DURATION = 6000, start = Date.now();
    var timer = setInterval(function () {
      var elapsed = Date.now() - start;
      var pct = Math.min(100, (elapsed / DURATION) * 100);
      var idx = Math.min(LOADING_PHRASES.length - 1, Math.floor(elapsed / 2000));
      var bar = q("#loading-bar"), pctEl = q("#loading-pct"), msg = q("#loading-msg");
      if (bar) bar.style.width = pct + "%";
      if (pctEl) pctEl.textContent = Math.round(pct) + "%";
      if (msg && msg.textContent !== LOADING_PHRASES[idx]) msg.textContent = LOADING_PHRASES[idx];
      if (elapsed >= DURATION) { clearInterval(timer); location.hash = "#/resultado"; }
    }, 50);
  }

  // ===========================================================================
  // TURMA — datas reais (America/Sao_Paulo)  [MUDANÇA 3]
  // ===========================================================================
  function saoPauloParts(d) {
    var tz = CFG.TIMEZONE || "America/Sao_Paulo";
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, weekday: "short",
    }).formatToParts(d).reduce(function (a, p) { a[p.type] = p.value; return a; }, {});
    return parts;
  }
  // Retorna { classDate: Date(segunda), deadline: Date(domingo 23:59:59), classLabel }
  function getTurma() {
    var now = new Date();
    var p = saoPauloParts(now);
    var dowMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var dow = dowMap[p.weekday];
    // instante das 00:00 de hoje em São Paulo (UTC-3, sem horário de verão)
    var base = new Date(p.year + "-" + p.month + "-" + p.day + "T00:00:00-03:00");
    var d = (1 - dow + 7) % 7; if (d === 0) d = 7;             // dias até a PRÓXIMA segunda
    var classDate = new Date(base.getTime() + d * 86400000);   // segunda de início
    var deadline = new Date(base.getTime() + (d - 1) * 86400000 + (23 * 3600 + 59 * 60 + 59) * 1000); // domingo 23:59:59
    var classLabel = new Intl.DateTimeFormat("pt-BR", {
      timeZone: CFG.TIMEZONE || "America/Sao_Paulo", day: "numeric", month: "long",
    }).format(classDate);
    return { classDate: classDate, deadline: deadline, classLabel: classLabel };
  }
  function countdownCells(msLeft) {
    if (msLeft < 0) msLeft = 0;
    var s = Math.floor(msLeft / 1000);
    var dd = Math.floor(s / 86400); s -= dd * 86400;
    var hh = Math.floor(s / 3600); s -= hh * 3600;
    var mm = Math.floor(s / 60); var ss = s - mm * 60;
    function cell(v, label) {
      return '<div class="bg-card rounded-lg px-3 py-2 text-center border border-border"><span class="text-2xl md:text-3xl font-bold text-primary">' +
        String(v).padStart(2, "0") + '</span><p class="text-muted-foreground text-xs">' + label + "</p></div>";
    }
    return cell(dd, "dias") + cell(hh, "horas") + cell(mm, "min") + cell(ss, "seg");
  }
  var _turmaTimer = null;
  function startTurmaCountdown() {
    if (_turmaTimer) clearInterval(_turmaTimer);
    var tick = function () {
      var t = getTurma();
      var left = t.deadline.getTime() - Date.now();
      var els = document.querySelectorAll(".turma-countdown");
      Array.prototype.forEach.call(els, function (el) { el.innerHTML = countdownCells(left); });
    };
    tick();
    _turmaTimer = setInterval(tick, 1000);
  }

  // Bloco de turma reutilizável (escassez real)
  function turmaBlock() {
    var t = getTurma();
    return (
      '<div class="bg-secondary rounded-xl p-4 mb-4">' +
      '<p class="text-foreground text-sm text-center mb-2">🕯️ A próxima turma da Consagração começa <strong>segunda-feira, dia ' + esc(t.classLabel) + "</strong>.</p>" +
      '<p class="text-muted-foreground text-sm text-center mb-3">Todos começam juntos, terminam juntos — e os nomes da turma são levados juntos em oração no dia do encerramento.</p>' +
      '<p class="text-foreground text-sm text-center mb-4">As inscrições desta turma se encerram <strong>domingo às 23h59</strong>.</p>' +
      '<div class="turma-countdown flex justify-center items-center gap-2"></div></div>'
    );
  }

  // ===========================================================================
  // RESULTADO PERSONALIZADO  [MUDANÇA 5 + 6]
  // ===========================================================================
  var PERSONA_BODY = [
    "Suas respostas revelam um coração que carrega uma dor antiga — mas que se recusa a parar de acreditar. Pessoas com esse exato perfil são as que mais relatam transformação ao completar os 15 dias.",
    "Suas respostas mostram um coração ferido por alguém que você ama — e a Consagração de 15 dias é o caminho que milhares usaram para restaurar o que parecia perdido.",
    "Suas respostas revelam alguém que está vivo, mas não está inteiro — e que precisa reencontrar o motivo de acordar com vontade de viver. É exatamente isso que os 15 dias vão trabalhar.",
    "Suas respostas mostram um coração cansado de esperar resposta — mas que ainda não desistiu. A Consagração é o caminho de quem quer voltar a sentir a presença de Deus.",
    "Suas respostas mostram que o que você mais quer não é pra você — é pra quem você ama. Mãe entende mãe: é exatamente por isso que a Consagração existe.",
  ];
  var PERSONA_DEFAULT = "Suas respostas revelam um coração que buscou Nossa Senhora com sinceridade — e pessoas com esse perfil são as que mais relatam transformação ao completar os 15 dias.";
  function getPersonaBody() {
    var milagre = state.answers[4] || [];        // primeira opção marcada
    if (!milagre.length) return PERSONA_DEFAULT;
    var idx = MILAGRE_OPCOES.indexOf(milagre[0]);
    return (idx >= 0 && PERSONA_BODY[idx]) ? PERSONA_BODY[idx] : PERSONA_DEFAULT;
  }

  // ===========================================================================
  // PLAYER DE VÍDEO  [MUDANÇA 8]
  // ===========================================================================
  // Ícone de som mutado (alto-falante com risco diagonal), como no overlay de VSL.
  var VSL_MUTED_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="2" x2="1" y2="22"/></svg>';

  function videoBlock() {
    // Player VSL nativo: autoplay MUTADO + overlay "clique para ouvir" + barra vermelha de progresso.
    // Se CONFIG.VSL_EMBED_CODE tiver HTML (Vturb/ConverteAI), ele é usado no lugar do vídeo nativo.
    if (CFG.VSL_EMBED_CODE && CFG.VSL_EMBED_CODE.trim()) {
      return '<div class="w-full rounded-xl overflow-hidden shadow-burgundy">' + CFG.VSL_EMBED_CODE + "</div>";
    }
    var src = CFG.VSL_VIDEO_URL || "assets/vsl.mp4";
    return (
      '<div class="vsl-wrap shadow-burgundy">' +
      '<video id="vsl-video" src="' + esc(src) + '" muted autoplay playsinline webkit-playsinline preload="auto"></video>' +
      '<button id="vsl-unmute" class="vsl-overlay" aria-label="Clique para ouvir"><div class="vsl-box">' +
      '<span class="vsl-t1">sua transformação começou</span>' +
      '<span class="vsl-icon">' + VSL_MUTED_ICON + "</span>" +
      '<span class="vsl-t2">clique para ouvir</span></div></button>' +
      '<div class="vsl-bar"><div id="vsl-bar-fill"></div></div>' +
      "</div>"
    );
  }

  function bindVSL() {
    var v = document.getElementById("vsl-video");
    if (!v) return;
    var ov = document.getElementById("vsl-unmute");
    var fill = document.getElementById("vsl-bar-fill");
    v.muted = true;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
    if (ov) ov.addEventListener("click", function () {
      v.muted = false;
      var pp = v.play();
      if (pp && pp.catch) pp.catch(function () {});
      ov.classList.add("vsl-hidden");
    });
    v.addEventListener("timeupdate", function () {
      if (v.duration && fill) fill.style.width = (v.currentTime / v.duration * 100) + "%";
    });
  }

  // ===========================================================================
  // DEPOIMENTOS  ([MUDANÇA 4] Novena->Consagração, 9 dias->15 dias, 9º->15º)
  // ===========================================================================
  var TESTIMONIALS = [
    { name: "Maria Aparecida", location: "São Paulo, SP", title: "Meu casamento foi restaurado!", image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Eu estava passando por um momento muito difícil no meu casamento quando comecei a Consagração. No 15º dia, meu marido me procurou para conversar e hoje estamos reconstruindo nossa família com a bênção de Nossa Senhora." },
    { name: "João Paulo", location: "Belo Horizonte, MG", title: "Consegui um novo emprego!", image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Estava desempregado há 8 meses e com muitas dívidas. Durante a Consagração, entreguei tudo nas mãos de Nossa Senhora e, antes mesmo de terminar os 15 dias, recebi duas propostas de emprego!" },
    { name: "Ana Lúcia", location: "Recife, PE", title: "Minha filha voltou para a igreja!", image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Minha filha estava afastada da igreja há anos e isso me entristecia muito. Fiz a Consagração pedindo pela conversão dela e, para minha surpresa, ela me ligou dizendo que queria voltar a frequentar a missa comigo." },
    { name: "Fernanda Silva", location: "Porto Alegre, RS", title: "Encontrei meu propósito!", image: "https://randomuser.me/api/portraits/women/65.jpg",
      text: "Eu estava perdida espiritualmente, sem rumo na vida. A Consagração me reconectou com minha fé e me ajudou a encontrar um propósito. Hoje sou voluntária na minha paróquia." },
  ];
  var _testiIndex = 0, _testiTimer = null;

  var FAQ = [
    { q: "O que é a Consagração a Nossa Senhora?", a: "A Consagração a Nossa Senhora é uma jornada espiritual de 15 dias, onde você entrega seu coração à Virgem Maria, permitindo que ela o conduza mais profundamente ao coração de Jesus. É um caminho de transformação interior e renovação espiritual." },
    { q: "Preciso ter experiência religiosa para fazer a Consagração?", a: "Não! A Consagração é para todos, independentemente de sua experiência religiosa. Se você está começando sua jornada de fé ou retornando após um tempo afastado, este é um caminho perfeito para fortalecer sua conexão espiritual." },
    { q: "Como funciona o acesso ao material?", a: "Após a confirmação do pagamento, você receberá um e-mail com as instruções de acesso à plataforma. Lá você encontrará todos os materiais organizados dia a dia, incluindo vídeos, orações, reflexões e os bônus exclusivos." },
    { q: "Por quanto tempo terei acesso ao conteúdo?", a: "Seu acesso é vitalício! Você poderá revisitar os materiais sempre que desejar e também terá acesso a todas as atualizações futuras sem custo adicional." },
    { q: "Quanto tempo preciso dedicar por dia?", a: "Recomendamos cerca de 10-15 minutos diários para as orações e reflexões. No entanto, você pode adaptar de acordo com sua rotina e disponibilidade, o importante é a constância e a entrega do coração." },
    { q: "Existe garantia de satisfação?", a: "Sim! Oferecemos garantia de 7 dias. Se por qualquer motivo você não ficar satisfeito com o material, basta nos enviar um e-mail solicitando o reembolso dentro deste período." },
  ];

  // ===========================================================================
  // RESULTADO
  // ===========================================================================
  function goCheckout() { window.location.href = CFG.CHECKOUT_URL; }

  function renderResult() {
    var nome = state.userName ? state.userName.toUpperCase() : "";
    var headline = (nome ? esc(nome) + ", " : "") + "NOSSA SENHORA OUVIU VOCÊ.";
    var body = getPersonaBody();
    var intentionLine = state.intention && state.intention.trim()
      ? '<p class="text-foreground italic mt-3">Sua intenção — “' + esc(state.intention.trim()) + '” — já está na lista de oração desta turma.</p>'
      : "";

    // [MUDANÇA 3] contador "X pessoas visualizando" só se houver valor real
    var viewersLine = "";
    if (CFG.LIVE_VIEWERS != null) {
      viewersLine =
        '<div class="bg-secondary rounded-lg p-3 flex items-center justify-center gap-2 mb-4">' +
        ICON.users("w-5 h-5 text-muted-foreground") +
        '<span class="text-foreground text-sm"><strong>' + Number(CFG.LIVE_VIEWERS).toLocaleString("pt-BR") + "</strong> pessoas estão visualizando esta página</span></div>";
    }

    var receberList = ["Guia da Consagração a Nossa Senhora", "15 Vídeos aulas exclusivas", "Orações Diárias Necessárias", "Santíssimo Sacramento", "Dicas Práticas", "Grupo de adoração"]
      .map(function (g) {
        return '<div class="bg-card rounded-xl p-4 flex items-center gap-3 border border-border">' +
          '<div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">' + ICON.check("w-5 h-5 text-white") + "</div>" +
          '<span class="text-foreground font-medium">' + esc(g) + "</span></div>";
      }).join("");

    var testis = TESTIMONIALS.map(function (t) {
      return '<div class="w-full flex-shrink-0 px-1"><div class="bg-card rounded-2xl p-5 border border-border">' +
        '<div class="flex items-center gap-4 mb-4"><div class="w-14 h-14 rounded-full bg-secondary overflow-hidden flex-shrink-0">' +
        '<img src="' + t.image + '" alt="' + esc(t.name) + '" class="w-full h-full object-cover"></div>' +
        '<div class="flex-1"><h4 class="font-bold text-foreground">' + esc(t.name) + "</h4>" +
        '<p class="text-muted-foreground text-sm">' + esc(t.location) + "</p>" +
        '<div class="flex gap-0.5 mt-1">' + Array(5).join(0).split("").map(function () { return ""; }).join("") +
        [0, 1, 2, 3, 4].map(function () { return ICON.star("w-4 h-4 fill-amber-400 text-amber-400"); }).join("") + "</div></div></div>" +
        '<div class="bg-secondary rounded-lg p-3 mb-3"><p class="font-bold text-foreground text-center text-sm">"' + esc(t.title) + '"</p></div>' +
        '<p class="text-muted-foreground italic text-sm leading-relaxed">"' + esc(t.text) + '"</p></div></div>';
    }).join("");
    var dots = TESTIMONIALS.map(function (_, i) {
      return '<button data-dot="' + i + '" class="w-2.5 h-2.5 rounded-full transition-all ' + (i === 0 ? "bg-primary" : "bg-muted") + '"></button>';
    }).join("");

    var faq = FAQ.map(function (f, i) {
      return '<div class="bg-card rounded-xl border border-border px-4"><button data-faq="' + i + '" class="w-full text-left text-foreground font-medium text-sm py-4 flex justify-between items-center gap-2">' +
        "<span>" + esc(f.q) + '</span><span class="text-primary faq-arrow">+</span></button>' +
        '<div class="faq-body text-muted-foreground text-sm overflow-hidden" style="max-height:0;transition:max-height .3s ease"><p class="pb-4">' + esc(f.a) + "</p></div></div>";
    }).join("");

    root().innerHTML =
      '<main class="bg-background flex flex-col items-center pt-6 md:pt-10 px-4 pb-12 min-h-screen">' +
      '<div class="w-full flex justify-center mb-5"><img src="' + LOGO + '" alt="Terço Mariano" class="mx-auto h-[60px] w-auto animate-fade-in"></div>' +
      '<div class="w-full max-w-[420px] mx-auto"><div class="text-center">' +

      // [MUDANÇA 5] headline + parágrafo personalizados + linha de intenção
      '<div class="mb-4 animate-fade-in"><span class="text-4xl mb-2 block">🙏</span>' +
      '<h1 class="text-2xl md:text-3xl font-bold text-primary mb-3">' + headline + "</h1>" +
      '<p class="text-foreground">' + esc(body) + "</p>" + intentionLine + "</div>" +

      // [MUDANÇA 8] vídeo (Vturb-ready)
      '<div class="mb-4 animate-fade-in">' + videoBlock() + "</div>" +

      '<button class="cta-btn w-full py-4 rounded-xl font-bold text-lg text-black hover:opacity-90 transition-all mb-6 shadow-lg" style="background:linear-gradient(180deg,#FFD700 0%,#FFC107 100%);animation:pulse-yellow 2s ease-in-out infinite">QUERO ME CONSAGRAR</button>' +

      // benefícios
      '<div class="mb-8 bg-card border border-border rounded-xl p-5 shadow-sm animate-fade-in">' +
      '<p class="text-foreground mb-4">Você deu o primeiro passo para uma <span class="font-bold">transformação espiritual</span> profunda.</p>' +
      '<p class="text-foreground mb-4">A <span class="text-primary font-semibold">Consagração de 15 dias</span> vai te ajudar a:</p>' +
      '<ul class="space-y-3 text-left">' +
      '<li class="flex items-start gap-3 text-foreground"><span class="text-primary">✨</span><span>Encontrar <strong>paz interior</strong> verdadeira</span></li>' +
      '<li class="flex items-start gap-3 text-foreground"><span class="text-primary">✓</span><span>Fortalecer sua <strong>fé</strong> como nunca</span></li>' +
      '<li class="flex items-start gap-3 text-foreground"><span class="text-primary">🛡️</span><span>Receber a <strong>proteção</strong> da Mãe de Deus</span></li>' +
      '<li class="flex items-start gap-3 text-foreground"><span class="text-primary">❤️</span><span>Experimentar o <strong>amor</strong> que cura</span></li></ul></div>' +

      // tudo que irá receber
      '<div class="mb-8"><h2 class="text-2xl md:text-3xl font-bold text-primary mb-6">Tudo que irá receber</h2>' +
      '<div class="mb-6"><img src="' + IMG_PRODUTOS + '" alt="Produtos da Consagração" class="w-full rounded-2xl shadow-lg"></div>' +
      '<div class="space-y-3">' + receberList + "</div>" +
      '<p class="text-muted-foreground text-center mt-4 font-medium">e muito mais...</p></div>' +

      // bônus
      '<div class="mb-8"><h2 class="text-2xl md:text-3xl font-bold text-primary mb-2">A Virgem Maria bate à sua porta!</h2>' +
      '<p class="text-foreground mb-6">📖 Você vai abrir ou deixar essa chance passar?</p><div class="space-y-4">' +
      bonusCard("BÔNUS #1", ICON.sparkles("w-5 h-5 text-primary") + ' Livro "A Força do Silêncio"', IMG_BONUS1, "A Força do Silêncio",
        "Um guia profundo pra encontrar Deus no silêncio e fortalecer sua fé com contemplação.", "R$ 51,90") +
      // [MUDANÇA 4] Diário 2025 -> 2026
      bonusCard("BÔNUS #2", ICON.sparkles("w-5 h-5 text-primary") + " Meu Diário de Oração 2026", IMG_BONUS2, "Meu Diário de Oração 2026",
        "Com dedicatória especial. Devocionário exclusivo com orações e novenas à Nossa Senhora.", "R$ 96,90") +
      "</div></div>" +

      // oferta + turma + preço
      '<div class="mb-8 bg-card rounded-2xl overflow-hidden border border-border">' +
      '<div class="bg-secondary p-4"><h2 class="text-xl font-bold text-foreground text-center">Consagração a Nossa Senhora</h2></div>' +
      '<div class="p-4">' +
      '<div class="flex items-center justify-between mb-4 flex-wrap gap-2"><div class="flex items-center gap-2 text-foreground">' +
      ICON.clock("w-5 h-5") + '<span class="font-medium text-sm">Oferta por tempo limitado:</span></div>' +
      '<span class="text-primary font-medium text-xs bg-primary/10 px-2 py-1 rounded">Aproveite enquanto há tempo!</span></div>' +

      // [MUDANÇA 3] bloco de turma (substitui timer + vagas preenchidas + vaga restante)
      turmaBlock() +

      '<div class="bg-secondary rounded-xl p-4 text-center"><p class="text-foreground mb-2 text-sm">Receba tudo isso por apenas:</p>' +
      '<div class="flex items-center justify-center gap-2 mb-2"><span class="text-muted-foreground line-through text-lg">R$ 299,99</span>' +
      // [MUDANÇA 4] -78% -> -91%
      '<span class="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">-91%</span></div>' +
      '<div class="bg-card rounded-xl p-4 mb-3 border border-border"><span class="text-4xl font-bold text-primary">R$ 27,90</span></div>' +
      '<div class="bg-green-100 rounded-lg p-3 flex items-center justify-center gap-2">' + ICON.check("w-5 h-5 text-green-600") +
      // [MUDANÇA 4] Economize 280,09 -> 272,09
      '<span class="text-green-700 text-sm font-medium">Economize R$ 272,09 + Receba 3 Livros <strong>GRÁTIS</strong></span></div></div>' +
      "</div></div>" +

      // você recebe tudo isso + garantia
      '<div class="mb-8 bg-card rounded-2xl p-6 border border-border">' +
      '<div class="flex items-center justify-center gap-2 mb-6">' + ICON.sparkles("w-6 h-6 text-primary") +
      '<h3 class="text-primary font-bold text-lg">VOCÊ RECEBE TUDO ISSO</h3></div>' +
      '<div class="space-y-3 mb-6">' +
      receberItem("<strong>Consagração Completa</strong> - Guia passo a passo para os 15 dias") +
      receberItem("<strong>15 Vídeo Aulas</strong> - Com ensinamentos diários") +
      receberItem("<strong>3 Livros Exclusivos</strong>") +
      receberItem("<strong>Acesso Vitalício</strong> - A todos os materiais e futuras atualizações") +
      "</div>" +
      '<button class="cta-btn w-full py-4 rounded-xl font-bold text-lg bg-primary text-primary-foreground hover:opacity-90 transition-all mb-4 flex items-center justify-center gap-2" style="animation:pulse-button 2s ease-in-out infinite">' +
      ICON.sparkles("w-5 h-5") + " QUERO ME CONSAGRAR</button>" +
      viewersLine +
      '<div class="text-center"><div class="flex items-center justify-center gap-2 text-muted-foreground mb-3">' + ICON.shield("w-5 h-5") +
      '<span class="text-sm">Pagamento 100% seguro</span></div>' +
      '<div class="relative w-24 h-24 mx-auto mb-4"><div class="absolute inset-0 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>' +
      '<div class="absolute inset-2 bg-gray-800 rounded-full flex flex-col items-center justify-center">' + ICON.shield("w-6 h-6 text-amber-400 mb-1") +
      '<span class="text-amber-400 text-[8px] font-bold leading-tight text-center">GARANTIA<br>7 DIAS</span></div></div>' +
      // [MUDANÇA 7] texto reforçado da garantia
      '<div class="bg-secondary rounded-xl p-4 text-left"><p class="text-foreground text-sm font-bold mb-1">Garantia de Coração em Paz</p>' +
      '<p class="text-muted-foreground text-sm">Faça os 3 primeiros dias. Se não sentir seu coração mais leve, devolvemos cada centavo. O risco é todo nosso — a fé é sua.</p></div>' +
      "</div></div>" +

      // depoimentos
      '<div class="mb-8"><h2 class="text-2xl font-bold text-primary mb-6 text-center">Vidas Transformadas pela Consagração</h2>' +
      '<div class="relative overflow-hidden"><div id="testi-track" class="flex transition-transform duration-500 ease-in-out" style="transform:translateX(0%)">' +
      testis + "</div>" +
      '<div class="flex justify-center gap-2 mt-4">' + dots + "</div></div></div>" +

      // FAQ
      '<div class="mb-8"><h2 class="text-2xl font-bold text-primary mb-2 text-center">Dúvidas Frequentes</h2>' +
      '<p class="text-muted-foreground text-center mb-6">Respostas para as perguntas mais comuns</p>' +
      '<div class="space-y-2">' + faq + "</div></div>" +

      // bloco final (urgência de turma no lugar de "1 vaga")
      '<div class="mb-8 text-center bg-card rounded-2xl p-6 border border-border">' +
      '<h2 class="text-xl font-bold text-foreground mb-2">Não perca esta oportunidade de transformação!</h2>' +
      '<p class="text-muted-foreground mb-4 text-sm">As inscrições desta turma se encerram <span class="text-primary font-bold">domingo às 23h59</span>. Garanta o seu lugar antes que a turma feche!</p>' +
      '<button class="cta-btn w-full py-4 rounded-xl font-bold text-lg text-black hover:opacity-90 transition-all mb-4" style="background:linear-gradient(180deg,#FFD700 0%,#FFC107 100%);animation:pulse-yellow 2s ease-in-out infinite">QUERO ME CONSAGRAR AGORA</button>' +
      '<p class="text-muted-foreground text-xs">Acesso imediato e vitalício a todo o material</p></div>' +

      '<button id="restart-btn" class="text-muted-foreground text-sm underline hover:text-primary transition-colors mb-8">Fazer o quiz novamente</button>' +
      '<p class="text-muted-foreground text-xs italic">"A quem recorre a Maria, jamais será desamparado"</p>' +

      "</div></div>" + musicButton() +
      '<style>@keyframes pulse-yellow{0%,100%{box-shadow:0 0 10px rgba(255,215,0,.5),0 0 20px rgba(255,215,0,.3);transform:scale(1)}50%{box-shadow:0 0 20px rgba(255,215,0,.7),0 0 40px rgba(255,215,0,.5);transform:scale(1.02)}}@keyframes pulse-button{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}' +
      '.vsl-wrap{position:relative;width:100%;border-radius:.75rem;overflow:hidden;line-height:0}' +
      '.vsl-wrap video{width:100%;height:auto;display:block;background:#000}' +
      '.vsl-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:9%;background:transparent;border:none;cursor:pointer}' +
      '.vsl-overlay.vsl-hidden{display:none}' +
      '.vsl-box{width:100%;display:flex;flex-direction:column;align-items:center;gap:.35rem;padding:1.1rem 1rem;border-radius:.75rem;background:rgba(228,228,228,.14);border:1px solid rgba(255,255,255,.16);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.55);animation:vsl-pulse 2.4s ease-in-out infinite}' +
      '.vsl-box .vsl-icon{display:block;margin-bottom:.15rem;line-height:0}' +
      '.vsl-box .vsl-t1{font-size:1.15rem;font-weight:700;text-align:center;line-height:1.2}' +
      '.vsl-box .vsl-t2{font-size:.95rem;font-weight:600;text-align:center;opacity:.95}' +
      '@keyframes vsl-pulse{0%,100%{transform:scale(1);opacity:.86}50%{transform:scale(1.035);opacity:1}}' +
      '.vsl-bar{position:absolute;left:0;right:0;bottom:0;height:5px;background:rgba(0,0,0,.28)}' +
      '.vsl-bar>div{height:100%;width:0;background:#ef2b2b;transition:width .25s linear}</style>' +
      "</main>";

    // binds
    Array.prototype.forEach.call(document.querySelectorAll(".cta-btn"), function (b) { b.onclick = goCheckout; });
    q("#restart-btn").onclick = function () {
      state = { step: 0, userName: "", answers: {}, phone: "", intention: "", candleLit: false, musicMuted: true };
      location.hash = "#/";
    };
    Array.prototype.forEach.call(document.querySelectorAll("[data-dot]"), function (b) {
      b.onclick = function () { setTesti(parseInt(b.getAttribute("data-dot"), 10)); };
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-faq]"), function (b) {
      b.onclick = function () {
        var body = b.parentNode.querySelector(".faq-body");
        var arrow = b.querySelector(".faq-arrow");
        var open = body.style.maxHeight && body.style.maxHeight !== "0px";
        body.style.maxHeight = open ? "0px" : body.scrollHeight + 40 + "px";
        arrow.textContent = open ? "+" : "−";
      };
    });
    bindMusic();
    bindVSL();
    startTurmaCountdown();
    startTestiCarousel();
    window.scrollTo(0, 0);
  }

  function bonusCard(tag, titleHtml, img, alt, desc, valor) {
    return '<div class="bg-card rounded-2xl overflow-hidden border border-border">' +
      '<div class="bg-secondary p-3 flex justify-between items-center"><span class="text-foreground text-sm font-bold">' + esc(tag) + "</span>" +
      '<span class="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">GRÁTIS</span></div>' +
      '<div class="p-4"><h3 class="font-bold text-foreground mb-3 flex items-center gap-2">' + titleHtml + "</h3>" +
      '<div class="rounded-xl mb-3 overflow-hidden"><img src="' + img + '" alt="' + esc(alt) + '" class="w-full h-auto rounded-xl"></div>' +
      '<p class="text-muted-foreground text-sm mb-3">' + esc(desc) + "</p>" +
      '<div class="bg-secondary rounded-lg p-2 text-center"><p class="text-muted-foreground text-sm">Valor: <span class="line-through text-primary font-bold">' + esc(valor) + "</span></p></div></div></div>";
  }
  function receberItem(html) {
    return '<div class="bg-secondary rounded-lg p-3 flex items-start gap-3">' + ICON.check("w-5 h-5 text-green-500 flex-shrink-0 mt-0.5") +
      '<span class="text-foreground text-sm">' + html + "</span></div>";
  }
  function setTesti(i) {
    _testiIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    var track = q("#testi-track");
    if (track) track.style.transform = "translateX(-" + _testiIndex * 100 + "%)";
    Array.prototype.forEach.call(document.querySelectorAll("[data-dot]"), function (b, idx) {
      b.className = "w-2.5 h-2.5 rounded-full transition-all " + (idx === _testiIndex ? "bg-primary" : "bg-muted");
    });
  }
  function startTestiCarousel() {
    if (_testiTimer) clearInterval(_testiTimer);
    _testiTimer = setInterval(function () { setTesti(_testiIndex + 1); }, 5000);
  }

  // ===========================================================================
  // ROTEADOR
  // ===========================================================================
  function route() {
    if (_testiTimer) { clearInterval(_testiTimer); _testiTimer = null; }
    if (_turmaTimer) { clearInterval(_turmaTimer); _turmaTimer = null; }
    var h = location.hash || "#/";
    if (h.indexOf("#/quiz") === 0) renderQuiz();
    else if (h.indexOf("#/resultado") === 0) renderResult();
    else renderLanding();
  }
  window.addEventListener("hashchange", route);
  route();
})();
