const fs=require("fs"),path=require("path"),{JSDOM}=require("jsdom");
const B=path.join(__dirname,"..","build","static","js");
const b=path.join(B,fs.readdirSync(B).filter(f=>f.startsWith("main.")&&f.endsWith(".js")&&!f.endsWith(".map"))[0]);
const dom=new JSDOM(fs.readFileSync(path.join(__dirname,"..","build","index.html"),"utf8"),{url:"http://localhost/",runScripts:"dangerously",pretendToBeVisual:true,beforeParse(w){
w.matchMedia=()=>(({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
const g=w.HTMLCanvasElement.prototype.getContext;w.HTMLCanvasElement.prototype.getContext=function(t){return String(t).includes("webgl")?null:g.apply(this,arguments)};
}});
try{dom.window.eval(fs.readFileSync(b,"utf8"))}catch(e){}
setTimeout(()=>{
const d=dom.window.document,txt=d.getElementById("root").textContent;
// Todos los href del DOM, para validar DESTINOS (no solo el texto visible)
const hrefs=[...d.querySelectorAll("a[href]")].map(a=>a.getAttribute("href")).join(" ");
// El bundle entero: caza strings enlazados en el código (mailto:, tel:, etc.)
const bundle=fs.readFileSync(b,"utf8");
const checks={
 // --- texto visible ---
 "email nuevo hotmail (visible)": txt.includes("themarketkilla@hotmail.com"),
 "precio $490 tachado": txt.includes("$490"),
 "precio nuevo $200": txt.includes("$200"),
 "chip ahorro -59%": txt.includes("-59%"),
 "tier BULL RUN 2026": txt.includes("BULL RUN 2026"),
 "tier ROBOT BREAKOUTS": txt.includes("ROBOT BREAKOUTS"),
 "tier COPYTRADING": txt.includes("COPYTRADING"),
 "tier SEÑALES": txt.includes("SEÑALES"),
 "CTA canal copy visible": txt.includes("Entrar al canal de CopyTrading"),
 "4 tiers en la rejilla": d.querySelectorAll('[data-testid^="pricing-tier-"]').length===4,
 // --- DESTINOS de los enlaces (hrefs reales, no texto) ---
 "href mailto NUEVO (hotmail)": hrefs.includes("themarketkilla@hotmail.com"),
 "href mailto viejo FUERA": !hrefs.includes("dannyrock824"),
 "href canal copytrading": hrefs.includes("TheMarketKillaCopyTrading"),
 "href canal principal": hrefs.includes("t.me/The_Market_Killa"),
 "href DM telegram": hrefs.includes("t.me/TheMarketKilla"),
 "href panel roboforex": hrefs.includes("roboforex.com"),
 "href youtube": hrefs.includes("youtube.com/@themarketkilla"),
 // --- el código fuente compilado (caza strings fuera del DOM) ---
 "bundle: sin gmail personal": !bundle.includes("dannyrock824"),
 "bundle: sin restos de emergent": !/emergent/i.test(bundle),
 // --- auditoría web (2026-10-09): hero CTA, legales, og:image, sin disclaimer ---
 "hero CTA 'Ver cómo funciona'": txt.includes("Ver cómo funciona"),
 "hero CTA apunta a #services": hrefs.includes("#services"),
 "footer link Términos": hrefs.includes("/terminos"),
 "footer link Privacidad": hrefs.includes("/privacidad"),
 "legal: página terminos.html existe": fs.existsSync(path.join(__dirname,"..","public","terminos.html")),
 "legal: página privacidad.html existe": fs.existsSync(path.join(__dirname,"..","public","privacidad.html")),
 "og:image 1200x630 existe": fs.existsSync(path.join(__dirname,"..","public","og-image.jpg")),
 "sin disclaimer de riesgo": !/conlleva riesgo/i.test(txt) && !bundle.includes("riesgo de p\\xe9rdida"),
};
let bad=0;for(const[k,v]of Object.entries(checks)){console.log((v?"✅":"❌")+" "+k);if(!v)bad++}
console.log("\nnº tiers:",d.querySelectorAll('[data-testid^="pricing-tier-"]').length,"| hrefs:",[...d.querySelectorAll("a[href]")].length);
console.log(bad?`\n❌ ${bad} FALLOS`:"\n✅ TODO OK");
process.exit(bad?1:0)},2500);
