import * as THREE from 'three';
import './style.css';

const canvas=document.querySelector('#scene');
const status=document.querySelector('#status');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(error){status.textContent='Le rendu 3D nécessite WebGL. Activez l’accélération graphique dans votre navigateur.';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;
const scene=new THREE.Scene();scene.background=new THREE.Color('#c9bda5');
const camera=new THREE.PerspectiveCamera(65,1,.1,100);
camera.rotation.order='YXZ';
const mat=(color,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const cream=mat('#e5ddc9'),stone=mat('#b7ad99'),wall=mat('#d1c5ae'),gray=mat('#8e8b81'),red=mat('#784c40'),black=mat('#343630'),gold=mat('#a28b51',.48,.42),white=mat('#eee6d5');
const boxGeometry=new THREE.BoxGeometry(1,1,1);
function box(w,h,d,x,y,z,m){const mesh=new THREE.Mesh(boxGeometry,m);mesh.scale.set(w,h,d);mesh.position.set(x,y,z);mesh.receiveShadow=true;mesh.castShadow=true;scene.add(mesh);return mesh;}
function cylinder(r1,r2,h,x,y,z,m,n=12){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;}
// Une seule salle de 18 × 26 mètres. Aucun modèle ou texture externe.
box(18,.3,26,0,-.16,0,cream);
for(let x=-8;x<=8;x+=2)for(let z=-12;z<=12;z+=2){box(1.94,.018,1.94,x,.008,z,((x+z)/2)%2===0?cream:white);if(x>-7&&x<7){const tile=box(.72,.025,.72,x,.024,z,red);tile.rotation.y=Math.PI/4;const inset=box(.37,.028,.37,x,.029,z,black);inset.rotation.y=Math.PI/4;}}
for(const x of [-7,7]){box(.19,.04,25.7,x,.035,0,black);box(.14,.04,25.7,x+Math.sign(x)*.28,.035,0,red);}
for(const z of [-10,10])box(13.8,.04,.2,0,.035,z,black);
box(.5,12,26,-9,6,0,wall);box(.5,12,26,9,6,0,wall);box(18,12,.5,0,6,13,wall);
// Mur du fond et arche ouverte sur une niche peu profonde, dans la même salle.
box(4.4,12,.7,-6.8,6,-13,wall);box(4.4,12,.7,6.8,6,-13,wall);box(9.2,1.4,.7,0,11.3,-13,wall);
box(9,11,.3,0,5.5,-14.7,stone);box(9,.2,2,0,0,-13.8,cream);box(9,.3,2,0,11,-13.8,cream);
// Voussoirs : blocs radiaux qui dessinent une vraie ouverture semi-circulaire.
function arch(cx,cy,z,r,thickness,depth,material){const shape=new THREE.Shape();shape.absarc(0,0,r+thickness,0,Math.PI,false);shape.lineTo(-r,0);shape.absarc(0,0,r,Math.PI,0,true);shape.closePath();const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:24}),material);mesh.position.set(cx,cy,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);}
arch(0,6,-13.45,3.8,.75,1,cream);arch(0,6,-12.38,4.57,.12,.08,gold);
for(const x of [-4.18,4.18]){box(.76,6,1.1,x,3,-12.95,cream);box(.94,.26,1.3,x,6,-12.9,stone);box(.95,.4,1.3,x,.2,-12.9,gray);}
// Quatre colonnes monumentales à fûts sobres et chapiteaux géométriques.
const columns=[];
for(const x of [-5.8,5.8])for(const z of [-6,5]){columns.push({x,z});box(1.95,.35,1.95,x,.2,z,gray);box(1.7,.25,1.7,x,.5,z,cream);cylinder(.9,.9,.25,x,.75,z,stone);cylinder(.64,.8,7.6,x,4.65,z,stone,16);cylinder(.78,.65,.24,x,8.55,z,gray);cylinder(.91,.77,.35,x,8.83,z,cream);box(1.85,.3,1.85,x,9.12,z,cream);box(1.9,.09,1.9,x,9.32,z,gold);}
// Pilastres, panneaux et moulures : détails réguliers sans sculptures complexes.
for(const side of [-1,1]){for(const z of [-10,-3,4,11]){box(.28,9,.65,side*8.65,4.5,z,cream);box(.4,.25,.95,side*8.55,9,z,stone);}for(const z of [-6.5,.5,7.5]){box(.08,4.4,4.4,side*8.72,4.1,z,stone);box(.11,3.9,3.9,side*8.65,4.1,z,cream);box(.15,.12,4,side*8.56,2.2,z,gold);}box(.3,.9,26,side*8.67,.5,0,gray);}
for(const y of [9.6,10,10.3]){box(18,.18,.3,0,y,-12.55,y===10?gold:cream);for(const side of [-1,1])box(.4,.18,26,side*8.6,y,0,y===10?gold:cream);}
// Plafond à caissons, aux bordures or ancien.
box(18,.35,26,0,12.1,0,cream);
for(const x of [-6,0,6])for(const z of [-9,-3,3,9]){box(5.2,.12,5.2,x,11.86,z,stone);box(4.8,.14,4.8,x,11.78,z,cream);for(const dx of [-2.42,2.42])box(.08,.12,4.92,x+dx,11.65,z,gold);for(const dz of [-2.42,2.42])box(4.92,.12,.08,x,11.65,z+dz,gold);const rosette=cylinder(.32,.4,.12,x,11.61,z,gold,8);rosette.rotation.y=Math.PI/8;}
// Fenêtres claires en hauteur, avec encadrements et meneaux simples.
const glazing=new THREE.MeshBasicMaterial({color:'#fff2cf'});
for(const side of [-1,1])for(const z of [-6.5,.5,7.5]){box(.09,1.65,2.6,side*8.72,8,z,glazing);box(.16,.09,2.8,side*8.58,8,z,stone);box(.16,1.8,.1,side*8.58,8,z,stone);}
scene.add(new THREE.HemisphereLight('#fff0d8','#918271',2));
const sun=new THREE.DirectionalLight('#fff1d7',3.1);sun.position.set(6,11,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-16,right:16,top:18,bottom:-18,near:.5,far:50});sun.shadow.normalBias=.035;sun.target.position.set(-3,0,-5);scene.add(sun,sun.target);
const fill=new THREE.PointLight('#ffe3b4',65,23,2);fill.position.set(0,8,-10);scene.add(fill);
// Navigation à hauteur d’œil, collisions avec les colonnes et les limites de la salle.
const keys=new Set();let active=false;let yaw=0,pitch=0;
function reset(){camera.position.set(2.8,1.75,10.7);yaw=.15;pitch=.115;camera.rotation.set(pitch,yaw,0);}
reset();
const enter=document.querySelector('#enter');
enter.addEventListener('click',async()=>{try{await canvas.requestPointerLock();}catch{status.textContent='La capture de souris est indisponible. Maintenez le clic sur la scène pour regarder ; ZQSD reste disponible.';active=true;document.querySelector('#app').classList.add('visiting');}});
document.addEventListener('pointerlockchange',()=>{active=document.pointerLockElement===canvas;document.querySelector('#app').classList.toggle('visiting',active);document.querySelector('#crosshair').hidden=!active;document.querySelector('#pause').hidden=active;enter.innerHTML='Reprendre la visite <span>↗</span>';keys.clear();});
document.querySelector('#reset').addEventListener('click',reset);
addEventListener('keydown',e=>{if(e.code==='Escape'){document.exitPointerLock();keys.clear();}if(['KeyZ','KeyW','KeyQ','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();keys.add(e.code);}});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>keys.clear());
let dragging=false;canvas.addEventListener('pointerdown',()=>dragging=true);addEventListener('pointerup',()=>dragging=false);
addEventListener('mousemove',e=>{if(!active&&!dragging)return;yaw-=e.movementX*.002;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.002,-1.2,1.2);camera.rotation.set(pitch,yaw,0);});
function allowed(x,z){return Math.abs(x)<8.25&&z>-11.8&&z<12.15&&!columns.some(c=>Math.hypot(x-c.x,z-c.z)<1.2);}
function move(dt){if(!active&&!dragging)return;const forward=Number(keys.has('KeyZ')||keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'));const right=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyQ')||keys.has('KeyA')||keys.has('ArrowLeft'));const length=Math.hypot(forward,right)||1;const dx=(right*Math.cos(yaw)-forward*Math.sin(yaw))*3.5*dt/length;const dz=(-forward*Math.cos(yaw)-right*Math.sin(yaw))*3.5*dt/length;if(allowed(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(allowed(camera.position.x,camera.position.z+dz))camera.position.z+=dz;}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{move(Math.min(clock.getDelta(),.05));renderer.render(scene,camera);});
// État observable pour les tests navigateur, sans modifier la scène.
window.room={camera,scene,renderer,allowed,reset,get active(){return active;}};
