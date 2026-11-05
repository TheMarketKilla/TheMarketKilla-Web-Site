/* Auditoría móvil de la home: altura estimada + conteo de CTAs por sección.
   Uso: node scripts/audit-home-mobile.js   (requiere build/) */
const path = require("path"), fs = require("fs"), { JSDOM } = require("jsdom");
const build = path.resolve(__dirname, "../build");
const html = fs.readFileSync(path.join(build, "index.html"), "utf8");
const js = fs.readdirSync(path.join(build, "static/js")).filter(f => f.endsWith(".js")).sort((a,b)=>fs.statSync(path.join(build,"static/js",b)).size-fs.statSync(path.join(build,"static/js",a)).size)[0];
const dom = new JSDOM(html.replace(/<script[^>]*><\/script>/g, ""), { url: "https://www.themarketkilla.com/", pretendToBeVisual: true, runScripts: "outside-only" });
const w = dom.window;
w.matchMedia = () => ({ matches:false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} });
w.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
w.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
w.scrollTo = () => {};
w.HTMLCanvasElement.prototype.getContext = () => null;
w.requestAnimationFrame = (cb) => setTimeout(cb, 0);
w.HTMLElement.prototype.scrollIntoView = () => {};
try { w.eval(fs.readFileSync(path.join(build, "static/js", js), "utf8")); } catch (e) { console.log("EVAL ERR:", e.message); }
setTimeout(() => {
  const d = w.document;
  const secs = Array.from(d.querySelectorAll("#top, [data-testid='price-ticker'], #markets, #services, #pricing, #contact, footer"));
  // estimación: 390px ancho útil 342 (px-6=24*2), 16px por línea de body, títulos 2 líneas
  const est = (el) => {
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    const cards = el.querySelectorAll("[data-testid^='service-card'], [data-testid^='pricing-tier'], [data-testid^='market-card']").length;
    const lines = Math.ceil(t.length / 42);
    const cardH = el.querySelector("[data-testid^='pricing-tier']") ? 470 : 300;
    return Math.round(lines * 21 + cards * cardH + 120);
  };
  let total = 0;
  secs.forEach(el => {
    const h = est(el), name = el.id || el.dataset.testid || "footer";
    total += h;
    const tg = el.querySelectorAll("a[href*='t.me'], a[href^='mailto']").length;
    console.log(`${name.padEnd(14)} ~${String(h).padStart(5)} px   CTAs=${tg}   textos=${(el.textContent||"").length}`);
  });
  console.log(`TOTAL ~${total} px ≈ ${(total/844).toFixed(1)} pantallas de 844px (iPhone 14)`);
  process.exit(0);
}, 1500);
