// =====================================================================
// LM Tracker — análise do funil (Supabase do Lar de Maria)
// Grava eventos anônimos por sessão: page_view, quiz_start, step_view,
// lead, vsl_view, checkout_click. Sem dado pessoal: só um id aleatório.
// O slug do quiz vem de ?src= (redirecionador) ou CONFIG.QUIZ_SLUG.
// =====================================================================
(function () {
  "use strict";
  var SUPA = "https://dwquecpfcnfnihxwscrq.supabase.co";
  var KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cXVlY3BmY25mbmloeHdzY3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNjc3MDQsImV4cCI6MjA5OTg0MzcwNH0.chpJ7TT0lpHztpSml7GPE9hk7XVrWlVi1d_dTtn-_9w";

  function param(name) {
    var m = new RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }

  var slug = param("src") || (window.CONFIG && window.CONFIG.QUIZ_SLUG) || "quiz1";
  slug = String(slug).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40) || "quiz1";

  var sid;
  try {
    sid = localStorage.getItem("lm_sid");
    if (!sid) {
      sid = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
      localStorage.setItem("lm_sid", sid);
    }
  } catch (e) {
    sid = "s-" + Math.random().toString(36).slice(2, 12);
  }

  function track(tipo, step, label) {
    try {
      fetch(SUPA + "/rest/v1/quiz_events", {
        method: "POST",
        keepalive: true,
        headers: {
          apikey: KEY,
          Authorization: "Bearer " + KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          sp_slug: window.SP_SLUG || null,
          quiz_slug: slug,
          session_id: sid,
          tipo: tipo,
          step: typeof step === "number" ? step : null,
          step_label: label ? String(label).slice(0, 80) : null,
        }),
      }).catch(function () {});
    } catch (e) { /* análise nunca pode quebrar o quiz */ }
  }

  window.LM = { track: track, slug: slug, sid: sid };
  track("page_view");
})();
