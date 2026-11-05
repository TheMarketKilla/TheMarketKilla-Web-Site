const fs=require("fs"),path=require("path"),{JSDOM}=require("jsdom");
const dir=path.resolve("build/static/js");
const code=fs.readdirSync(dir).filter(f=>f.endsWith(".js")).map(f=>fs.readFileSync(path.join(dir,f),"utf8")).join("\n");
function render(route){
 const dom=new JSDOM("<!doctype html><html><body><div id=root></div></body></html>",{url:"http://localhost"+route,runScripts:"dangerously",pretendToBeVisual:true,beforeParse(w){
  w.matchMedia=w.matchMedia||(()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
  w.ResizeObserver=w.ResizeObserver||class{observe(){}unobserve(){}disconnect(){}};
  w.IntersectionObserver=w.IntersectionObserver||class{observe(){}unobserve(){}disconnect(){}};
  const g=w.HTMLCanvasElement.prototype.getContext; w.HTMLCanvasElement.prototype.getContext=function(t){if(String(t).indexOf("webgl")!==-1)return null;return g?g.apply(this,arguments):null;};
  w.scrollTo=()=>{};}});
 try{dom.window.eval(code);}catch(e){console.log(route,"eval",e.message);}
 return dom;
}
// Copytrading: bloque resultados debe ser estático (sin abanico), pruebas con abanico lleno
let d=render("/copytrading").window.document;
setTimeout(()=>{
 console.log("COPY single:",!!d.querySelector('[data-testid="results-single"]'),"| fan-track en resultados:",!!d.querySelector('[data-testid="results-fan-track"]'),"| static img:",!!d.querySelector('[data-testid="results-image"]'));
 console.log("COPY carousel items (debe cubrir pantalla):",d.querySelectorAll('.media-carousel-track .media-tile').length);
 // Breakouts: video correcto
 const b=render("/robot-breakouts").window.document;
 setTimeout(()=>{
  const vids=[...b.querySelectorAll("video")].map(v=>v.getAttribute("src"));
  console.log("BREAKOUTS videos:",vids.join(" , "));
  const c=render("/copytrading").window.document;
  setTimeout(()=>{
   console.log("COPY videos:",[...c.querySelectorAll("video")].map(v=>v.getAttribute("src")).join(" , "));
  },2600);
 },2600);
},2600);
