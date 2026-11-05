// Mide altura de la home en móvil (390x844) usando el bundle de producción con jsdom.
const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");

const build = path.resolve(process.env.HOME, "Projects/TheMarketKilla-Web-Site/frontend/build");
const html = fs.readFileSync(path.join(build, "index.html"), "utf8");
const bundleFile = fs.readdirSync(path.join(build, "static/js")).find((f) => f.endsWith(".js"));

const dom = new JSDOM(html.replace(/<script[^>]*><\/script>/g, ""), {
  url: "https://www.themarketkilla.com/",
  pretendToBeVisual: true,
  runScripts: "outside-only",
});
const w = dom.window;
w.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
w.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
w.scrollTo = () => {};
w.HTMLCanvasElement.prototype.getContext = () => null;
w.requestAnimationFrame = (cb) => setTimeout(cb, 0);
w.HTMLElement.prototype.scrollIntoView = () => {};

const bundle = fs.readFileSync(path.join(build, "static/js", bundleFile), "utf8");
try { w.eval(bundle); } catch (e) { console.log("EVAL ERR:", e.message); }

setTimeout(() => {
  const d = w.document;
  const q = (s) => d.querySelector(s);
  const rows = [
    ["hero", "#top"],
    ["ticker", '[data-testid="price-ticker"]'],
    ["markets", "#markets"],
    ["services", "#services"],
    ["pricing", "#pricing"],
    ["contact", "#contact"],
    ["footer", '[data-testid="site-footer"]'],
  ];
  console.log("== SECTION ORDER / heights (jsdom: offsetHeight no fiable, se usa textLength) ==");
  const order = Array.from(d.querySelectorAll("section, footer, [data-testid='price-ticker']"))
    .map((el) => (el.id ? "#" + el.id : el.dataset.testid || el.tagName));
  console.log("ORDEN:", order.join(" > "));
  rows.forEach(([n, sel]) => {
    const el = q(sel);
    if (!el) return console.log(n, "NO ENCONTRADO");
    const txt = (el.textContent || "").replace(/\s+/g, " ").trim();
    console.log(`${n}: chars=${txt.length} | ${txt.slice(0, 90)}`);
  });
  const cta = Array.from(d.querySelectorAll("a")).filter((a) => /telegram|t\.me/i.test(a.href));
  console.log("CTAs telegram:", cta.length);
  console.log("H1:", q("h1")?.textContent);
  console.log("H2s:", Array.from(d.querySelectorAll("h2")).map((h) => h.textContent.trim()).join(" | "));
  console.log("ERRORES:", (w.__errs || []).length);
  process.exit(0);
}, 1500);
