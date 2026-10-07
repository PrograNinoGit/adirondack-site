const CH=(()=>{
const scn=new THREE.Scene(),SRGB=THREE.sRGBEncoding;
const tex=(w,h,fn,rot=0)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=SRGB;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;if(rot){t.center.set(.5,.5);t.rotation=rot}return t};
const grainFn=(x,w,h)=>{x.fillStyle='#ececec';x.fillRect(0,0,w,h);
  for(let i=0;i<600;i++){x.fillStyle=`rgba(${Math.random()>.5?'255,255,255':'0,0,0'},${Math.random()*.1})`;x.fillRect(0,Math.random()*h,w,.5+Math.random()*2.5)}
  for(let i=0;i<16;i++){x.strokeStyle='rgba(70,40,10,.16)';x.lineWidth=1+Math.random()*1.5;x.beginPath();let y=Math.random()*h;x.moveTo(0,y);for(let p=0;p<=w;p+=32){y+=(Math.random()-.5)*5;x.lineTo(p,y)}x.stroke()}};
const G={s:tex(512,512,grainFn),b:tex(512,512,grainFn,Math.PI/2),a:tex(512,512,grainFn),f:tex(512,512,grainFn,Math.PI/2)};
const M={};for(const k in G)M[k]=new THREE.MeshPhysicalMaterial({roughness:.6,envMapIntensity:.8});
const bolt=new THREE.MeshStandardMaterial({color:0xb9bec5,metalness:1,roughness:.35});
/* Geometrie: Bretter mit gerundeten Kanten */
const ext=(s,d,r=.007)=>{const g=new THREE.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:3,curveSegments:14});g.translate(0,0,-(d-2*r)/2);return g};
const RB=(w,h,d,r=.007)=>{const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2+r);s.lineTo(w/2-r,-h/2+r);s.lineTo(w/2-r,h/2-r);s.lineTo(-w/2+r,h/2-r);return ext(s,d,r)};
const root=new THREE.Group();scn.add(root);
const mesh=(g,m,x=0,y=0,z=0,p=root)=>{const o=new THREE.Mesh(g,typeof m==='string'?M[m]:m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o};
/* Sitz: 7 Latten mit Fugen */
const seat=new THREE.Group();seat.position.y=.46;seat.rotation.x=-.12;root.add(seat);
for(let i=0;i<7;i++)mesh(RB(.96,.034,.11),'s',0,0,(i-3)*.125,seat);
mesh(RB(.9,.08,.05),'f',0,-.06,.42,seat);
/* Seitenprofile (Seitenansicht in z/y, dann gedreht) */
const side=(s,t)=>{const g=ext(s,t,.006);g.rotateY(-Math.PI/2);return g};
const lp=new THREE.Shape();lp.moveTo(.3,.4);lp.bezierCurveTo(0,.38,-.4,.3,-.62,.09);lp.lineTo(-.74,0);lp.lineTo(-.58,0);lp.bezierCurveTo(-.4,.12,-.05,.22,.3,.26);
const gp=new THREE.Shape();gp.moveTo(.4,.72);gp.lineTo(0,.72);gp.quadraticCurveTo(.02,.55,-.25,.46);gp.lineTo(.4,.46);
const legG=side(lp,.05),gusG=side(gp,.03);
const ap=new THREE.Shape();ap.moveTo(-.115,.54);ap.lineTo(.115,.54);ap.lineTo(.15,-.46);ap.quadraticCurveTo(.15,-.54,.08,-.54);ap.lineTo(-.08,-.54);ap.quadraticCurveTo(-.15,-.54,-.15,-.46);
const armG=ext(ap,.045,.009);armG.rotateX(-Math.PI/2);
const boltG=new THREE.CylinderGeometry(.013,.013,.012,14);boltG.rotateZ(Math.PI/2);
[-1,1].forEach(k=>{
  mesh(RB(.05,.1,.92),'f',k*.46,-.07,0,seat);
  mesh(RB(.09,.74,.09),'f',k*.5,.37,.42);
  mesh(legG,'f',k*.545,0,0);
  mesh(gusG,'f',k*.53,0,0);
  mesh(armG,'a',k*.58,.745,.04);
  [.15,.55].forEach(y=>mesh(boltG,bolt,k*.548,y,.42));
});
mesh(RB(.9,.07,.05),'f',0,.2,.42);
/* Rückenlehne: Fächer mit gewölbter Oberkante */
const back=new THREE.Group();back.position.set(0,.5,-.43);back.rotation.x=-.38;root.add(back);
const top=x=>1.1-.95*x*x;
[-2,-1,0,1,2].forEach(i=>{const xc=i*.19,s=new THREE.Shape();
  s.moveTo(-.085,0);s.lineTo(.085,0);s.lineTo(.085,top(xc+.085));s.lineTo(-.085,top(xc-.085));
  mesh(ext(s,.04,.006),'b',xc,0,0,back).rotation.z=-i*.035});
[.3,.66].forEach(y=>mesh(RB(.98,.07,.03),'f',0,y,-.04,back));
[-1,1].forEach(k=>mesh(RB(.06,.5,.04),'f',k*.44,.25,-.04,back));
/* Kissen */
const cush=mesh(RB(.8,.11,.7,.035),new THREE.MeshStandardMaterial({roughness:1,map:tex(256,256,x=>{for(let i=0;i<16;i++){x.fillStyle=i%2?'#bdb7aa':'#f0ece2';x.fillRect(i*16,0,16,256)}})}),0,.078,.03,seat);
/* Boden: Schatten + weicher Kontakt */
const cv=document.createElement('canvas');cv.width=cv.height=128;const cx=cv.getContext('2d'),gr=cx.createRadialGradient(64,64,0,64,64,64);
gr.addColorStop(0,'rgba(0,0,0,.4)');gr.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=gr;cx.fillRect(0,0,128,128);
const blob=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));
blob.rotation.x=-Math.PI/2;blob.position.set(0,.004,-.1);scn.add(blob);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.ShadowMaterial({opacity:.32}));
floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scn.add(floor);
/* Umgebungslicht (Himmel, Horizont, Boden, Softboxen) */
const envTex=tex(1024,512,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);
  [[0,'#e3b48a'],[.42,'#f6dcc0'],[.5,'#ffe6c2'],[.58,'#8a7560'],[1,'#4a3b2e']].forEach(([o,c])=>g.addColorStop(o,c));x.fillStyle=g;x.fillRect(0,0,w,h);
  const s=x.createRadialGradient(w*.62,h*.28,0,w*.62,h*.28,90);s.addColorStop(0,'#fff');s.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=s;x.fillRect(0,0,w,h);
  x.fillStyle='rgba(255,255,255,.85)';x.fillRect(w*.12,h*.3,150,90);x.fillRect(w*.85,h*.32,110,70)});
envTex.mapping=THREE.EquirectangularReflectionMapping;
const mkR=o=>{const r=new THREE.WebGLRenderer({antialias:true,alpha:true,...o});r.outputEncoding=SRGB;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.08;r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;return r};
const rig=r=>{const pm=new THREE.PMREMGenerator(r),env=pm.fromEquirectangular(envTex).texture;pm.dispose();
  const dl=new THREE.DirectionalLight(0xffe2c0,1.5);dl.position.set(3,5,3.5);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);
  Object.assign(dl.shadow.camera,{left:-2,right:2,top:2,bottom:-2,near:1,far:12});dl.shadow.bias=-.0004;dl.shadow.normalBias=.02;return{dl,env}};
let cur;const draw=(r,c,g)=>{if(cur!==g){cur&&scn.remove(cur.dl);scn.add(g.dl);scn.environment=g.env;cur=g}r.render(scn,c)};
const cam=()=>{const c=new THREE.PerspectiveCamera(32,1,.1,50);c.position.set(2.9,1.7,3.5);c.lookAt(0,.55,0);return c};
let last,r2,c2,g2;
function paint(g){last=g;for(const k in M){const m=M[k],w=g.m>0;
  m.color.set(g.c[k]).convertSRGBToLinear();m.roughness=g.g?.16:(w?.5:.62);m.clearcoat=g.g?1:0;m.clearcoatRoughness=.06;
  const mp=w?G[k]:null;if(m.map!==mp){m.map=m.bumpMap=mp;m.needsUpdate=true}m.bumpScale=w?.8:0}
  cush.visible=!!g.k}
function snap(g,a){
  if(!r2){r2=mkR({preserveDrawingBuffer:true});r2.setPixelRatio(1);r2.setSize(640,640);c2=cam();g2=rig(r2)}
  const p=last,ry=root.rotation.y;paint(g);root.rotation.y=a;draw(r2,c2,g2);
  const u=r2.domElement.toDataURL('image/png');root.rotation.y=ry;p&&paint(p);return u;
}
function live(el,g){
  paint(g);
  const r=mkR(),c=cam(),rg=rig(r);r.setPixelRatio(Math.min(devicePixelRatio,2));el.prepend(r.domElement);
  let ry=.6,d=0,lx=0,z=1,auto=1;
  const rs=()=>{r.setSize(el.clientWidth,el.clientHeight);c.aspect=el.clientWidth/el.clientHeight;c.updateProjectionMatrix()};rs();addEventListener('resize',rs);
  el.onpointerdown=e=>{d=1;auto=0;lx=e.clientX;el.setPointerCapture(e.pointerId);el.style.cursor='grabbing'};
  el.onpointermove=e=>{if(d){ry+=(e.clientX-lx)*.01;lx=e.clientX}};
  el.onpointerup=()=>{d=0;el.style.cursor='grab'};
  el.addEventListener('wheel',e=>{e.preventDefault();z=Math.min(1.5,Math.max(.7,z+e.deltaY*.001));c.position.set(2.9*z,1.7*z,3.5*z);c.lookAt(0,.55,0)},{passive:false});
  (function loop(){requestAnimationFrame(loop);if(auto)ry+=.005;root.rotation.y=ry;draw(r,c,rg)})();
}
return{paint,snap,live};
})();
function fillChairs(r=document){r.querySelectorAll('img[data-chair]').forEach(i=>{const[id,a]=i.dataset.chair.split(':');i.src=CH.snap(PRODUCTS.find(p=>p.id===id).cfg,+a)})}
fillChairs();
