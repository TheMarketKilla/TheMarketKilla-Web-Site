/* Auditoría móvil de una sub-página de servicio (alto estimado + bloques + CTAs).
   Uso: node scripts/audit-service-mobile.js /copytrading */
const path = require("path"), fs = require("fs"), { JSDOM } = require("jsdom");
const build = path.resolve(__dirname, "../build");
const route = process.argv[2] || "/copytrading";
const html = fs.readFileSync(path.join(build, "index.html"), "utf8");
const js = fs.readdirSync(path.join(build, "static/js")).filter(f => f.endsWith(".js")).sort((a,b)=>fs.statSync(path.join(build,"static/js",b)).size-fs.statSync(path.join(build,"static/js",a)).size)[0];
const dom = new JSDOM(html.replace(/<script[^>]*><\/script>/g, ""), { url: "https://www.themarketkilla.com" + route, pretendToBeVisual: true, runScripts: "outside-only" });
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
  console.log("RUTA:", route, "| H1:", d.querySelector("h1")?.textContent?.trim().slice(0,80));
  const blocks = Array.from(d.querySelectorAll("section"));
  let total = 0, i = 0;
  blocks.forEach(el => {
    i++;
    const t = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (t.length < 40) return; // hairlines y wrappers
    const id = el.id || "";
    const h2 = el.querySelector("h1,h2")?.textContent?.replace(/\s+/g," ").trim().slice(0,45) || "(sin título)";
    const cards = el.querySelectorAll(".matte-card").length;
    const cta = el.querySelectorAll("a[href*='t.me'],a[href*='roboforex'],a[href*='myfxbook']").length;
    const video = el.querySelectorAll("video").length;
    const imgs = el.querySelectorAll("img").length;
    // estimación: texto + tarjetas + imágenes
    const h = Math.round(Math.ceil(t.length / 42) * 21 + cards * 300 + video * 260 + imgs * 240 + 140);
    total += h;
    console.log(`#${String(i).padStart(2)} ${id.padEnd(8)} ~${String(h).padStart(5)}px  cards=${String(cards).padStart(2)} cta=${String(cta).padStart(2)} img=${String(imgs).padStart(2)} vid=${video}  textos=${String(t.length).padStart(4)}  «${h2}»`);
  });
  console.log(`TOTAL ~${total}px ≈ ${(total/844).toFixed(1)} pantallas (844px)`);
  process.exit(0);
}, 1600);
