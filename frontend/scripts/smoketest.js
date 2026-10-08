/**
 * Smoketest — renderiza la app real en jsdom y detecta crashes de render.
 * Uso: node scripts/smoketest.js
 * No necesita navegador: carga el bundle compilado y monta <App />.
 */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const BUILD = path.join(__dirname, "..", "build", "static", "js");
const bundle = fs
  .readdirSync(BUILD)
  .filter((f) => f.startsWith("main.") && f.endsWith(".js") && !f.endsWith(".map"))
  .map((f) => path.join(BUILD, f))[0];

if (!bundle) {
  console.error("❌ No hay bundle compilado. Corre `npm run build` antes.");
  process.exit(1);
}

const html = fs.readFileSync(path.join(__dirname, "..", "build", "index.html"), "utf8");

const errors = [];
const dom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  resources: undefined,
  beforeParse(window) {
    window.matchMedia =
      window.matchMedia ||
      (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
    window.ResizeObserver = window.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} };
    window.IntersectionObserver = window.IntersectionObserver || class { observe() {} unobserve() {} disconnect() {} };
    // Simular navegador SIN WebGL (el caso que tumbaba la web)
    const origGetContext = window.HTMLCanvasElement.prototype.getContext;
    window.HTMLCanvasElement.prototype.getContext = function (type) {
      if (String(type).indexOf("webgl") !== -1) return null;
      return origGetContext ? origGetContext.apply(this, arguments) : null;
    };
    window.localStorage.clear?.();
    window.addEventListener("error", (e) => errors.push("window.error: " + (e.message || e.error)));
    window.addEventListener("unhandledrejection", (e) => errors.push("unhandled: " + e.reason));
  },
});

// Cargar el bundle dentro del DOM
const scriptContent = fs.readFileSync(bundle, "utf8");
try {
  dom.window.eval(scriptContent);
} catch (e) {
  errors.push("bundle eval: " + e.message);
}

setTimeout(() => {
  const doc = dom.window.document;
  const root = doc.getElementById("root");
  const boundary = doc.querySelector('[data-testid="error-boundary"]');
  const landing = doc.querySelector('[data-testid="landing-page"]');
  const text = (root && root.textContent) || "";

  console.log("─── RESULTADO ───");
  console.log("root vacio      :", !root || root.children.length === 0);
  console.log("error boundary  :", !!boundary);
  console.log("landing page    :", !!landing);
  console.log("longitud texto  :", text.trim().length);
  console.log("errores capturados:", errors.length);
  errors.slice(0, 8).forEach((e) => console.log("   •", e.slice(0, 220)));

  const ok = landing && !boundary && errors.length === 0;
  console.log(ok ? "\n✅ RENDER OK" : "\n❌ HAY PROBLEMA");
  process.exit(ok ? 0 : 1);
}, 2500);
