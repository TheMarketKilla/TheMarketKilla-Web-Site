/* Volcado de los textos de una sub-página de servicio, bloque a bloque.
   Uso: node scripts/dump-service-copy.js <slug> [es|en] */
const path = require("path");
const src = path.resolve(__dirname, "../src/i18n/translations.js");
let code = require("fs").readFileSync(src, "utf8");
// quitar el "export" para poder evaluarlo
code = code.replace(/export const translations/, "const translations").replace(/export default translations;?/, "");
const mod = { exports: {} };
new Function("module", "exports", code + "\nmodule.exports = translations;")(mod, mod.exports);
const slug = process.argv[2] || "copytrading";
const lang = process.argv[3] || "es";
const p = mod.exports[lang].services.pages[slug];
if (!p) { console.log("sin página para", slug); process.exit(1); }
const len = (s) => (s || "").length;
console.log(`=== ${slug} (${lang}) ===`);
console.log("TITULAR:", p.title_a, p.title_b, "| lead:", len(p.lead), "ch");
console.log("\n[HERO facts]", p.facts.map(f => `${f.label}=${f.value}`).join(" · "));
console.log("\n[ASIDE]", p.aside.price, p.aside.price_note);
p.aside.items.forEach(i => console.log("  -", len(i).toString().padStart(3), i));
console.log("  note:", len(p.aside.note), "ch");
console.log("\n[HOW]", p.how.title);
p.how.items.forEach(i => console.log(`  ${i.n} ${i.t} (${len(i.d)}ch)`));
console.log("\n[STEPS]", p.steps.title);
p.steps.items.forEach(i => console.log(`  ${i.n} ${i.t} (${len(i.d)}ch)`));
console.log("  footnote:", len(p.steps.footnote), "ch");
console.log("\n[PROOF]", p.proof.title, "| text:", len(p.proof.text), "ch");
console.log("  shots:", p.proof.shots.length, "| links:", p.proof.links.length, "| video:", p.proof.video ? "sí" : "no", "| disclaimer:", len(p.proof.disclaimer), "ch");
p.proof.links.forEach(l => console.log("   *", l.label, "->", l.href));
if (p.honest) { console.log("\n[HONEST]", p.honest.title); p.honest.items.forEach(i => console.log("  -", len(i).toString().padStart(3), i)); }
if (p.results) {
  console.log("\n[RESULTS]", p.results.title, "| text:", len(p.results.text), "ch");
  console.log("  stats:", p.results.stats.map(s => `${s.label}: ${s.value}`).join(" · "));
  console.log("  image:", p.results.image.src, "| caption:", len(p.results.image.caption), "ch");
}
console.log("\n[FAQ]", p.faq.items.length, "items");
p.faq.items.forEach(f => console.log(`  Q: ${f.q} (${len(f.a)}ch)`));
console.log("\n[FINAL]", p.final.title, "|", len(p.final.text), "ch");
