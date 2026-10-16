/*
 * verify-service-pages.js — Render real (jsdom) de las 4 sub-páginas de servicio.
 * Comprueba estructura + contenido clave + ausencia de promesas inventadas.
 * Uso: node scripts/verify-service-pages.js   (necesita build/ fresco)
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const BUILD = path.join(__dirname, "..", "build", "static", "js");
if (!fs.existsSync(BUILD)) {
  console.error("❌ No hay build/. Corre: CI=false npx craco build");
  process.exit(1);
}
const bundle = fs
  .readdirSync(BUILD)
  .filter((f) => f.startsWith("main.") && f.endsWith(".js") && !f.endsWith(".map"))
  .map((f) => path.join(BUILD, f))[0];
const html = fs.readFileSync(path.join(__dirname, "..", "build", "index.html"), "utf8");
const code = fs.readFileSync(bundle, "utf8");

const checks = [];
const ok = (name, cond) => checks.push({ name, pass: !!cond });

const PAGES = [
  {
    slug: "copytrading",
    route: "/copytrading",
    must: [
      "copiadas a tu cuenta",
      "MT5 ProCent",
      "GRATIS",
      "0 lag",
      "De cero a copiando, en 5 pasos",
      "Los resultados no se dicen: se verifican",
      "strategy-1/12241336",
      "strategy-2/12241349",
      "my.roboforex.com/en/?a=emvr",
      "copytrading-lib.mp4",
      "¿Cuánto cuesta?",
      "Lo que este servicio NO es",
      "RESULTADOS REALES",
      "resultados-19-meses.jpg",
      "¿Se me puede quemar la cuenta?",
      "¿Usa Martingala o Grid?",
      "Empieza a copiar mis operaciones",
    ],
  },
  {
    slug: "breakouts",
    route: "/robot-breakouts",
    must: [
      "ruptura a favor",
      "Nunca Grid ni Martingala",
      "Hasta 8",
      "ArrowZigZag",
      "ftmo-certificado.jpg",
      "myfxbook-breakout-killa.jpg",
      "breakouts-lib.mp4",
      "breakouts-lib.jpg",
      "gal-myfxbook-breakout-killa.jpg",
      "gal-ftmo-certificado.jpg",
      "gal-fundednext-certificado.jpg",
      "fundednext-certificado.jpg",
      "gal-e8-certificado.jpg",
      "e8-certificado.jpg",
      "gal-myfxbook-ftmo-phase1.jpg",
      "gal-myfxbook-fundednext.jpg",
      "FUNDEDNEXT · ELITE TRADER",
      "E8 MARKETS · APROBADO",
      "Challenges pasados. Historial certificado.",
      "RESULTADO REAL · FTMO CHALLENGE",
      "+10,27 %",
      "1,69",
      "SIN VENDERTE HUMO",
      "Pon el robot a operar",
    ],
    selectors: ["results-image", "service-video", "media-carousel-track", "media-tile-open", "video-open", "results-image-open"],
  },
  {
    slug: "bullrun",
    route: "/bull-run-2026",
    must: ["con guía, no a ciegas", "Solo 10", "$490", "Reservar mi plaza", "Lo que este grupo NO es."],
  },
  {
    slug: "senales",
    route: "/senales",
    must: ["y su plan de salida", "$30", "Anotarme en la lista", "Todavía no está lanzado"],
  },
];

// Prohibido en toda la web (regla de marca y de Google Ads)
const FORBIDDEN = ["$84M", "12.4M", "rentabilidad garantizada", "genera ganancias", "sin intervención humana", "cero latencia"];

function run(route) {
  const errors = [];
  const dom = new JSDOM(html, {
    url: `http://localhost${route}`,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    beforeParse(w) {
      w.matchMedia =
        w.matchMedia ||
        (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
      w.ResizeObserver = w.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} };
      w.IntersectionObserver = w.IntersectionObserver || class { observe() {} unobserve() {} disconnect() {} };
      const g = w.HTMLCanvasElement.prototype.getContext;
      w.HTMLCanvasElement.prototype.getContext = function (t) {
        if (String(t).indexOf("webgl") !== -1) return null;
        return g ? g.apply(this, arguments) : null;
      };
      w.localStorage.clear?.();
      w.scrollTo = () => {};
      w.addEventListener("error", (e) => errors.push("window.error: " + (e.message || e.error)));
    },
  });
  try {
    dom.window.eval(code);
  } catch (e) {
    errors.push("bundle eval: " + e.message);
  }
  return { dom, errors };
}

(async () => {
  for (const page of PAGES) {
    const { dom, errors } = run(page.route);
    await new Promise((r) => setTimeout(r, 2000));
    const doc = dom.window.document;
    const lower = (doc.body.textContent || "").toLowerCase();
    const inner = doc.body.innerHTML;

    ok(`[${page.route}] sin error boundary`, !doc.querySelector('[data-testid="error-boundary"]'));
    ok(`[${page.route}] sin errores JS`, errors.length === 0);
    ok(`[${page.route}] renderiza la página`, !!doc.querySelector(`[data-testid="service-page-${page.slug}"]`));
    ok(`[${page.route}] tiene H1`, !!doc.querySelector("h1"));

    for (const m of page.must) {
      const isAsset = /\.(jpg|mp4|png)$/.test(m);
      ok(`[${page.route}] "${m}"`, isAsset ? inner.includes(m) : lower.includes(m.toLowerCase()));
    }
    for (const sel of page.selectors || [])
      ok(`[${page.route}] selector "${sel}"`, !!doc.querySelector(`[data-testid="${sel}"]`));
    for (const f of FORBIDDEN) ok(`[${page.route}] sin "${f}"`, !lower.includes(f.toLowerCase()));
    if (errors.length) console.log(`   errores [${page.route}]:`, errors.slice(0, 2).join(" | ").slice(0, 200));
    dom.window.close();
  }

  const failed = checks.filter((c) => !c.pass);
  failed.forEach((c) => console.log(`❌ ${c.name}`));
  console.log(`\n${checks.length - failed.length}/${checks.length} aserciones OK`);
  if (failed.length) {
    console.log(`❌ ${failed.length} fallaron`);
    process.exit(1);
  }
  console.log("✅ SUB-PÁGINAS OK");
  process.exit(0);
})();
