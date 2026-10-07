const $=(s,r=document)=>r.querySelector(s);
const eur=n=>n.toLocaleString('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0});
const clone=g=>JSON.parse(JSON.stringify(g));
function scene(o){
  let s=o.seed;const R=()=>(s=s*16807%2147483647)/2147483647;
  const tr=(y,a,b,c,n)=>{let t='';for(let i=0;i<n;i++){const x=R()*1700-50,h=a+R()*(b-a),w=h*.36;t+=`<polygon fill='${c}' points='${x-w},${y} ${x},${y-h} ${x+w},${y}'/>`}return t};
  let bush='',pl='';
  for(let i=0;i<26;i++)bush+=`<ellipse cx='${R()*1650}' cy='${648+R()*14}' rx='${40+R()*50}' ry='${18+R()*22}' fill='${R()>.5?o.tree[0]:o.tree[1]}'/>`;
  for(let i=-12;i<30;i++){const x=i*85;pl+=`<line x1='${x}' y1='650' x2='${800+(x-800)*2.4}' y2='900'/>`}
  [668,700,742,796,862].forEach(y=>pl+=`<line x1='0' y1='${y}' x2='1600' y2='${y}'/>`);
  const [sx,sy]=o.sun;
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900' preserveAspectRatio='xMidYMid slice'><defs><filter id='b'><feGaussianBlur stdDeviation='3.5'/></filter><linearGradient id='a' x2='0' y2='1'><stop offset='0' stop-color='${o.sky[0]}'/><stop offset='1' stop-color='${o.sky[1]}'/></linearGradient><linearGradient id='w' x2='0' y2='1'><stop offset='0' stop-color='${o.water[0]}'/><stop offset='1' stop-color='${o.water[1]}'/></linearGradient><radialGradient id='s'><stop offset='0' stop-color='${o.glow}' stop-opacity='.95'/><stop offset='1' stop-color='${o.glow}' stop-opacity='0'/></radialGradient><linearGradient id='d' x2='0' y2='1'><stop offset='0' stop-color='${o.deck[1]}'/><stop offset='1' stop-color='${o.deck[0]}'/></linearGradient></defs><rect width='1600' height='900' fill='url(#a)'/><circle cx='${sx}' cy='${sy}' r='320' fill='url(#s)'/><g filter='url(#b)'><path d='M0 430 Q250 320 560 400 T1120 370 T1600 410 V470 H0Z' fill='${o.far}'/>${tr(440,50,110,o.tree[0],80)}${tr(462,80,175,o.tree[1],55)}</g><rect y='452' width='1600' height='210' fill='url(#w)'/><ellipse cx='${sx}' cy='540' rx='170' ry='24' fill='${o.glow}' opacity='.45'/><ellipse cx='${sx}' cy='575' rx='90' ry='10' fill='${o.glow}' opacity='.35'/>${bush}<rect y='650' width='1600' height='250' fill='url(#d)'/><g stroke='${o.deck[1]}' stroke-width='3' opacity='.6'>${pl}</g><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .3 0 0 0 -.08'/></filter><rect width='1600' height='900' filter='url(#n)'/></svg>`;
}
const SC=[
 {seed:7,sky:['#f2b27c','#fbe3c4'],glow:'#fff0c8',sun:[1150,260],far:'#a68a78',tree:['#6d7a4c','#4a5d3a'],water:['#e0a88a','#f2cfae'],deck:['#c99a6a','#9c6f45']},
 {seed:21,sky:['#3b2c4a','#f0935a'],glow:'#ffc680',sun:[420,360],far:'#5a4256',tree:['#2f3b35','#1f2c28'],water:['#7b5b6e','#e08a60'],deck:['#6a4a35','#45301f']},
 {seed:3,sky:['#f9dcc0','#fff3e2'],glow:'#ffffff',sun:[800,250],far:'#c4a98f',tree:['#8b9a68','#6b7f50'],water:['#ecd0b5','#f6e3cf'],deck:['#d9b78b','#b48a5c']},
 {seed:11,sky:['#2a1d2e','#c0703c'],glow:'#ffb870',sun:[1200,400],far:'#3b2e3a',tree:['#2a3a2e','#1b2b22'],water:['#5a4658','#c07a58'],deck:['#5d4130','#3b281b']}
];

/* Hintergründe: erst images/<name>.jpg (eigene Fotos), sonst die gezeichnete Szene */
const bgImg=(n,i)=>`url("images/${n}.jpg"),url("data:image/svg+xml,${encodeURIComponent(scene(SC[i]))}")`;
function applyBg(r=document){r.querySelectorAll('[data-bg]').forEach(e=>{const[n,i]=e.dataset.bg.split(':');e.style.backgroundImage=bgImg(n,+i);e.classList.add('bg');const t=new Image();t.onload=()=>e.querySelectorAll('img[data-chair]').forEach(x=>x.remove());t.src=`images/${n}.jpg`})}

/* Produkte & Preise */
const MAT=[['Kiefer lackiert',0],['Eiche geölt',700],['Teak-Massivholz',1600]];
const BASE=900,GLOSS=390,DUO=290,CUSH=190;
const one=c=>({s:c,b:c,a:c,f:c});
const calc=g=>BASE+MAT[g.m][1]+(g.g?GLOSS:0)+(new Set(Object.values(g.c)).size>1?DUO:0)+(g.k?CUSH:0);
const info=g=>`${MAT[g.m][0]} · ${g.g?'Glänzend':'Matt'}${g.k?' · mit Kissen':''}`;
const PRODUCTS=[
 {id:'signal',name:'Signalrot',d:'Der Klassiker in kräftigem Rot. Pur, matt und unverkennbar.',sc:0,cfg:{c:one('#e8301f'),g:0,m:0,k:0}},
 {id:'nordic',name:'Nordic White',d:'Reinweiß mit gestreiftem Leinenkissen. Hell und skandinavisch.',sc:2,cfg:{c:one('#f5f1e8'),g:0,m:0,k:1}},
 {id:'navy',name:'Marine Navy',d:'Tiefes Marineblau mit glänzendem Lack und Kissen.',sc:0,cfg:{c:one('#1f3a5f'),g:1,m:0,k:1}},
 {id:'duo',name:'Anthrazit & Honig',d:'Zweifarbig: dunkles Gestell, helle geölte Eichenlatten.',sc:1,cfg:{c:{s:'#c08a4a',b:'#c08a4a',a:'#c08a4a',f:'#2b2d33'},g:0,m:1,k:0}},
 {id:'teak',name:'Teak Natur',d:'Massives Teakholz mit sichtbarer Maserung und Kissen.',sc:2,cfg:{c:one('#b9803f'),g:0,m:2,k:1}},
 {id:'sig',name:'Signature Edition',d:'Teak-Massivholz, Marine-Gestell, Hochglanz und Kissen. Unser Flaggschiff.',sc:3,cfg:{c:{s:'#c08a4a',b:'#c08a4a',a:'#c08a4a',f:'#1f3a5f'},g:1,m:2,k:1}}
];

/* Header & Footer */
const PAGE=document.body.dataset.page;
const NAV=[['index','Startseite'],['ueber-uns','Über uns'],['shop','Shop'],['konfigurator','Configurator'],['blog','Blog'],['kontakt','Kontakt']];
document.body.insertAdjacentHTML('afterbegin',`<header><div class="nav"><a class="logo" href="index.html">Adiron<span>dack</span></a><nav>${NAV.map(([f,t])=>`<a href="${f}.html" class="${PAGE===f?'on':''}">${t}</a>`).join('')}</nav><a class="ic" href="warenkorb.html" aria-label="Warenkorb">🛒<b id="cnt">0</b></a></div></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer><p style="margin-bottom:10px">${NAV.map(([f,t])=>`<a href="${f}.html">${t}</a>`).join('')}<a href="warenkorb.html">Warenkorb</a></p>© 2026 ADIRONDACK Outdoor Luxury · Demo-Shop, keine echten Bestellungen</footer><div class="toast" id="toast"></div>`);
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2600)}

/* Warenkorb (localStorage, gemeinsam für alle Seiten) */
let CART=[];try{CART=JSON.parse(localStorage.getItem('adk3')||'[]')}catch(e){}
const cnt=()=>{$('#cnt').textContent=CART.reduce((s,i)=>s+i.qty,0)};
const saveCart=()=>{try{localStorage.setItem('adk3',JSON.stringify(CART))}catch(e){}cnt()};
function addItem(id,name,cfg,thumb){
  const f=CART.find(i=>i.id===id);
  if(f)f.qty++;else CART.push({id,name,cfg,qty:1,thumb});
  saveCart();toast(name+' liegt im Warenkorb');
}
cnt();

/* Produktkarten (Startseite & Shop) */
function renderProducts(el,ids){
  el.innerHTML=PRODUCTS.filter(p=>!ids||ids.includes(p.id)).map(p=>`<article class="pc"><div class="im" data-bg="x:${p.sc}"><img data-chair="${p.id}:.6" alt="Adirondack ${p.name}"></div><div class="bd"><h3>${p.name}</h3><div class="sp">${info(p.cfg)}</div><p>${p.d}</p><div class="row"><b class="pr">${eur(calc(p.cfg))}</b><button class="btn" data-add="${p.id}">In den Warenkorb</button></div><a class="lk" href="konfigurator.html?p=${p.id}">Im Konfigurator anpassen</a></div></article>`).join('');
  applyBg(el);window.fillChairs&&fillChairs(el);PRODUCTS.forEach(p=>{const t=new Image(),im=el.querySelector(`[data-add=${p.id}]`)?.closest('.pc')?.querySelector('img');t.onload=()=>{if(im){im.src=t.src;im.className='ph'}};t.src=`images/p-${p.id}.jpg`});
}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-add]');if(!a)return;
  const p=PRODUCTS.find(x=>x.id===a.dataset.add);
  addItem(p.id,p.name,clone(p.cfg),a.closest('.pc').querySelector('img').src);
});
applyBg();
