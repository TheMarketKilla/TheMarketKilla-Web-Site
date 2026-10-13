/*
 * verify-home-sections.js — Verifica el render real de la home:
 *  · las 4 tarjetas de servicio con datos (la 4ª = Señales)
 *  · botón "Contratar" (Telegram DM) en cada tarjeta de precio
 * Uso: node scripts/verify-home-sections.js   (necesita build/ fresco)
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const BUILD = path.join(__dirname, "..", "build", "static", "js");
const bundle = fs
  .readdirSync(BUILD)
  .filter((f) => f.startsWith("main.") && f.endsWith(".js") && !f.endsWith(".map"))
  .map((f) => path.join(BUILD, f))[0];
const html = fs.readFileSync(path.join(__dirname, "..", "build", "index.html"), "utf8");
const code = fs.readFileSync(bundle, "utf8");

const checks = [];
const ok = (name, cond) => checks.push({ name, pass: !!cond });

const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  beforeParse(w) {
    w.matchMedia = w.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
    w.ResizeObserver = w.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} };
    w.IntersectionObserver = w.IntersectionObserver || class { observe() {} unobserve() {} disconnect() {} };
    const g = w.HTMLCanvasElement.prototype.getContext;
    w.HTMLCanvasElement.prototype.getContext = function (t) {
      if (String(t).indexOf("webgl") !== -1) return null;
      return g ? g.apply(this, arguments) : null;
    };
    w.scrollTo = () => {};
    w.localStorage.clear?.();
  },
});
dom.window.eval(code);

setTimeout(() => {
  const doc = dom.window.document;

  // ── 1. Las 4 tarjetas de servicio, todas con datos ──
  const CARD_KEYS = ["copytrading", "breakouts", "bullrun", "senales"];
  const CARD_MUST = {
    copytrading: ["CopyTrading en Oro", "GRATIS", "MT5 ProCent"],
    breakouts: ["Robot BreakOuts", "FTMO"],
    bullrun: ["Bull Run 2026", "10 PLAZAS"],
    senales: ["Señales", "PRÓXIMAMENTE", "Entrega por canal privado", "Desde $30/mes"],
  };
  for (const k of CARD_KEYS) {
    const card = doc.querySelector(`[data-testid="service-card-${k}"]`);
    ok(`tarjeta ${k} existe`, !!card);
    if (!card) continue;
    const txt = card.textContent;
    ok(`tarjeta ${k} NO está vacía`, txt.trim().length > 40);
    for (const m of CARD_MUST[k]) ok(`tarjeta ${k} dice "${m}"`, txt.includes(m));
    const link = card.querySelector(`[data-testid="service-link-${k}"]`);
    ok(`tarjeta ${k} es clicable`, !!link && !!link.getAttribute("href"));
  }
  // La 4ª tarjeta debe tener el mismo contenido que las demás (bug reportado: salía sin datos)
  const s4 = doc.querySelector('[data-testid="service-card-senales"]');
  if (s4) {
    const t4 = s4.textContent;
    ok("tarjeta Señales tiene tag 04", t4.includes("04"));
    ok("tarjeta Señales tiene texto descriptivo (>120 ch)", t4.trim().length > 120);
  }

  // ── 2. Botón "Contratar" en cada tarjeta de precio → Telegram DM ──
  // OJO: el testid usa el nombre del tier tal cual (p.ej. pricing-hire-señales, con ñ)
  const TIERS = ["copytrading", "robot-breakouts", "bull-run-2026", "señales"];
  for (const s of TIERS) {
    const hire = doc.querySelector(`[data-testid="pricing-hire-${s}"]`);
    ok(`botón contratar en tier ${s}`, !!hire);
    if (hire) {
      const href = hire.getAttribute("href") || "";
      ok(`contratar ${s} → Telegram DM`, href === "https://t.me/TheMarketKilla");
      ok(`contratar ${s} dice "Contratar ahora"`, hire.textContent.includes("Contratar ahora"));
      ok(`contratar ${s} abre en pestaña nueva`, hire.getAttribute("target") === "_blank");
    }
    // El botón "Ver el servicio" debe seguir existiendo
    ok(`tier ${s} mantiene "Ver el servicio"`, !!doc.querySelector(`[data-testid="pricing-cta-${s}"]`));
  }

  const failed = checks.filter((c) => !c.pass);
  failed.forEach((c) => console.log(`❌ ${c.name}`));
  console.log(`\n${checks.length - failed.length}/${checks.length} aserciones OK`);
  if (failed.length) {
    console.log(`❌ ${failed.length} fallaron`);
    process.exit(1);
  }
  console.log("✅ HOME SECTIONS OK");
  process.exit(0);
}, 2500);
