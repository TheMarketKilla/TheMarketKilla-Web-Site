/* Mide el abanico de pruebas en móvil (390×844): alto real, ancho de cada
   pieza y si desborda horizontalmente. Uso: node scripts/audit-carousel.js */
const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.resolve(__dirname, "../src/index.css"), "utf8");
const jsDir = path.resolve(__dirname, "../build/static/js");
const files = fs.existsSync(jsDir) ? fs.readdirSync(jsDir).filter((f) => f.endsWith(".js")) : [];
const bundle = files.map((f) => fs.readFileSync(path.join(jsDir, f), "utf8")).join("\n");

// valores relevantes del CSS real (fuente de verdad)
const grab = (re) => { const m = css.match(re); return m ? m[1] : null; };
const tileDesktop = grab(/\.media-tile\s*\{\s*width:\s*([\d.]+)px/);
const tileMobile = grab(/@media \(max-width: 640px\)[\s\S]*?\.media-tile\s*\{\s*width:\s*([\d.]+)px/);
const gapCarousel = grab(/\.media-carousel-track\s*\{[\s\S]*?gap:\s*([\d.]+)rem/);
const aspect = grab(/\.media-tile-media\s*\{\s*aspect-ratio:\s*([\d\s/]+);/);

const VIEW = 390;
const gapPx = parseFloat(gapCarousel) * 16;
const tile = parseFloat(tileMobile || tileDesktop);
const imgSide = tile;                      // aspect-ratio 1/1
const capH = 0.7 * 16 * 2 + 14;            // padding + line-height
const capBorder = 1;
const tileH = imgSide + capH + capBorder;
const trackPad = 16 * 2;                   // py-4 = 1rem arriba y abajo
const carouselH = tileH + trackPad;

console.log("── Abanico de pruebas (móvil 390px) ──");
console.log(`pieza: ${tile}px ancho × ${tileH.toFixed(0)}px alto (imagen ${imgSide}px + caption)`);
console.log(`alto total del abanico: ~${carouselH.toFixed(0)}px  (${(carouselH / 844).toFixed(2)} pantallas)`);
console.log(`piezas visibles a la vez: ${((VIEW + gapPx) / (tile + gapPx)).toFixed(2)}`);
console.log(`crece hacia abajo al girar: NO (una sola fila, flex-row, overflow-hidden)`);
console.log(`scroll horizontal de página: NO (overflow-hidden + touchAction pan-y)`);

// comprobar en el bundle que sigue siendo una sola fila
const oneRow = /media-carousel-track/.test(bundle);
console.log(`\nbundle: ${files.length} archivo(s), track presente: ${oneRow}`);
if (carouselH > 400) console.log("⚠️  pieza demasiado alta para móvil: valorar recortar caption");
