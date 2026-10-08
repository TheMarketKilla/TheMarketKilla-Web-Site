const fs=require("fs"),path=require("path"),{JSDOM}=require("jsdom");
const B=path.join(__dirname,"..","build","static","js");
const b=path.join(B,fs.readdirSync(B).filter(f=>f.startsWith("main.")&&f.endsWith(".js")&&!f.endsWith(".map"))[0]);
const dom=new JSDOM(fs.readFileSync(path.join(__dirname,"..","build","index.html"),"utf8"),{url:"http://localhost/",runScripts:"dangerously",pretendToBeVisual:true,beforeParse(w){
w.matchMedia=()=>(({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
const g=w.HTMLCanvasElement.prototype.getContext;w.HTMLCanvasElement.prototype.getContext=function(t){return String(t).includes("webgl")?null:g.apply(this,arguments)};
}});
try{dom.window.eval(fs.readFileSync(b,"utf8"))}catch(e){}
setTimeout(()=>{const d=dom.window.document,txt=d.getElementById("root").textContent;
const checks={
 "email nuevo hotmail": txt.includes("themarketkilla@hotmail.com"),
 "email viejo FUERA": !txt.includes("dannyrock824"),
 "canal copytrading (link)": !!d.querySelector('[href*="TheMarketKillaCopyTrading"]'),
 "CTA canal copy visible": txt.includes("Entrar al canal de CopyTrading"),
 "precio $490 tachado": txt.includes("$490"),
 "precio nuevo $200": txt.includes("$200"),
 "chip ahorro -59%": txt.includes("-59%"),
 "tier BULL RUN 2026": txt.includes("BULL RUN 2026"),
 "tier ROBOT BREAKOUTS": txt.includes("ROBOT BREAKOUTS"),
 "tier COPYTRADING": txt.includes("COPYTRADING"),
 "tier SEÑALES": txt.includes("SEÑALES"),
 "4 tiers en la rejilla": d.querySelectorAll('[data-testid^="pricing-tier-"]').length===4,
 "link roboforex presente": !!d.querySelector('[href*="roboforex.com"]'),
};
let bad=0;for(const[k,v]of Object.entries(checks)){console.log((v?"✅":"❌")+" "+k);if(!v)bad++}
console.log("\nnº tiers:",d.querySelectorAll('[data-testid^="pricing-tier-"]').length);
console.log(bad?`\n❌ ${bad} fallos`:"\n✅ TODO OK");
process.exit(bad?1:0)},2500);
