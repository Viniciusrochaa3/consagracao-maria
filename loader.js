// =====================================================================
// LOADER — busca a definição do quiz no Painel Admin (Supabase) e só
// então inicia o app. Usado pela RAIZ (quiz1 por padrão) e por /q/.
// Slug: ?s= (player) ou ?src= (redirecionador) ou CONFIG.QUIZ_SLUG.
// SEGURANÇA: se o banco falhar ou demorar +2,5s, o quiz roda com as
// perguntas embutidas no app.js (fallback) — o funil nunca para.
// =====================================================================
(function () {
  "use strict";
  var SUPA = "https://dwquecpfcnfnihxwscrq.supabase.co";
  var KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cXVlY3BmY25mbmloeHdzY3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNjc3MDQsImV4cCI6MjA5OTg0MzcwNH0.chpJ7TT0lpHztpSml7GPE9hk7XVrWlVi1d_dTtn-_9w";
  var booted = false;

  function load(src) {
    return new Promise(function (res) {
      var t = document.createElement("script");
      t.src = src; t.onload = res; t.onerror = res;
      document.body.appendChild(t);
    });
  }
  function boot() {
    if (booted) return;
    booted = true;
    load("tracker.js").then(function () { return load("app.js"); });
  }

  var m = /[?&]s=([a-z0-9-]{1,40})/.exec(window.location.search) ||
          /[?&]src=([a-z0-9-]{1,40})/.exec(window.location.search);
  var slug = (m && m[1]) || (window.CONFIG && window.CONFIG.QUIZ_SLUG) || "quiz1";

  // nunca deixar o visitante esperando pelo banco
  setTimeout(boot, 2500);

  // ---- modo PÁGINA DE VENDA (?p=<slug>): carrega salespages e abre #/resultado
  var sp = /[?&]p=([a-z0-9-]{1,40})/.exec(window.location.search);
  if (sp) {
    window.location.hash = "#/resultado";
    fetch(SUPA + "/rest/v1/salespages?slug=eq." + encodeURIComponent(sp[1]) +
          "&ativo=eq.true&select=slug,nome,config",
      { headers: { apikey: KEY, Authorization: "Bearer " + KEY } })
      .then(function (r) { return r.json(); })
      .then(function (rows) {
        if (booted) return;
        var pg = Array.isArray(rows) && rows[0];
        if (pg) {
          window.SP_SLUG = pg.slug;
          window.SP_DEF = pg.config || {};
          var c = pg.config || {};
          if (c.checkout_url) window.CONFIG.CHECKOUT_URL = c.checkout_url;
          if (c.vsl_embed) window.CONFIG.VSL_EMBED_CODE = c.vsl_embed;
          if (c.vsl_video_url) window.CONFIG.VSL_VIDEO_URL = c.vsl_video_url;
          if (c.vsl_poster_url) window.CONFIG.VSL_POSTER_URL = c.vsl_poster_url;
          if (pg.nome) document.title = pg.nome;
        }
        boot();
      })
      .catch(boot);
    return;
  }

  fetch(SUPA + "/rest/v1/quizzes?slug=eq." + encodeURIComponent(slug) +
        "&ativo=eq.true&select=slug,nome,cards,config",
    { headers: { apikey: KEY, Authorization: "Bearer " + KEY } })
    .then(function (r) { return r.json(); })
    .then(function (rows) {
      if (booted) return; // o fallback já assumiu
      var qz = Array.isArray(rows) && rows[0];
      if (qz && Array.isArray(qz.cards) && qz.cards.length) {
        var n = qz.cards.length;
        window.QUIZ_DEF = {
          slug: qz.slug,
          steps: qz.cards.map(function (s, i) {
            if (!s.progress) s.progress = Math.max(5, Math.round(((i + 1) / n) * 100));
            return s;
          }),
        };
        window.CONFIG.QUIZ_SLUG = qz.slug;
        var c = qz.config || {};
        if (c.checkout_url) window.CONFIG.CHECKOUT_URL = c.checkout_url;
        if (c.vsl_embed) window.CONFIG.VSL_EMBED_CODE = c.vsl_embed;
        if (c.vsl_video_url) window.CONFIG.VSL_VIDEO_URL = c.vsl_video_url;
        if (c.vsl_poster_url) window.CONFIG.VSL_POSTER_URL = c.vsl_poster_url;
        if (c.salespage_url) window.CONFIG.SALES_URL = c.salespage_url;
        if (qz.nome) document.title = qz.nome;
      }
      boot();
    })
    .catch(boot);
})();
