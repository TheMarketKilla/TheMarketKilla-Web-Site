const fs=require("fs"),path=require("path"),{JSDOM}=require("jsdom");
const B=path.join(__dirname,"..","build","static","js");
const b=path.join(B,fs.readdirSync(B).filter(f=>f.startsWith("main.")&&f.endsWith(".js")&&!f.endsWith(".map"))[0]);
const dom=new JSDOM(fs.readFileSync(path.join(__dirname,"..","build","index.html"),"utf8"),{url:"http://localhost/",runScripts:"dangerously",pretendToBeVisual:true,beforeParse(w){
w.matchMedia=()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};w.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
const g=w.HTMLCanvasElement.prototype.getContext;w.HTMLCanvasElement.prototype.getContext=function(t){return String(t).includes("webgl")?null:g.apply(this,arguments)};
}});
try{dom.window.eval(fs.readFileSync(b,"utf8"))}catch(e){}
setTimeout(()=>{
const d=dom.window.document;
const grid=d.querySelector('[data-testid="pricing-section"] .grid');
console.log("grid classes   :", grid.className);
const cards=[...d.querySelectorAll('[data-testid^="pricing-tier-"]')];
console.log("tarjetas       :", cards.length);
cards.forEach(c=>{
  const name=c.querySelector(".label-mono").textContent.trim();
  const cls=c.className;
  console.log(`  ${name.padEnd(18)} flex=${cls.includes("flex-col")} h-full=${cls.includes("h-full")}`);
});
console.log("\nchip descuento :", d.querySelector(".pulse-discount")?.className||"NO ENCONTRADO");
console.log("¿aún rojo?     :", d.querySelector('[class*="EF4444"]')?"❌ SÍ QUEDA ROJO":"✅ sin rojo");
},2500);
