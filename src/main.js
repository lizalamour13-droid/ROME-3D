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
// Décor du mur monumental : deux niches en marbre et une porte à caissons.
// Ces ornements restent derrière la limite de visite : aucun passage ajouté.
const nicheShadow=mat('#68665b');
const bronze=mat('#665441',.66,.22);
const bronzePanel=mat('#79664d',.7,.16);
function statue(x,z){
  box(1.38,.22,.9,x,.24,z,gray);
  box(1.12,.84,.7,x,.77,z,cream);
  box(1.38,.16,.92,x,1.27,z,stone);
  cylinder(.32,.49,1.52,x,2.12,z,white,8);
  cylinder(.42,.31,.64,x,3.13,z,white,8);
  cylinder(.14,.17,.19,x,3.54,z,white,8);
  const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.27,0),white);
  head.position.set(x,3.87,z);head.scale.set(.83,1.18,.9);
  head.castShadow=true;scene.add(head);
  for(const side of [-1,1]){
    const arm=cylinder(.13,.17,.97,x+side*.39,3,z,white,6);
    arm.rotation.z=side*.15;
  }
  // Plis verticaux et tablette : quelques formes seulement, sans visage détaillé.
  for(const dx of [-.22,0,.22])box(.06,1.25,.07,x+dx,2.1,z+.31,cream);
  const tablet=box(.33,.43,.12,x+.35,2.75,z+.2,stone);
  tablet.rotation.z=-.12;
}
for(const x of [-6.7,6.7]){
  const recess=new THREE.Shape();
  recess.moveTo(-.91,0);recess.lineTo(.91,0);recess.lineTo(.91,4.1);
  recess.absarc(0,4.1,.91,0,Math.PI,false);recess.closePath();
  const backing=new THREE.Mesh(new THREE.ShapeGeometry(recess,24),nicheShadow);
  backing.position.set(x,.35,-12.61);scene.add(backing);
  arch(x,4.45,-12.58,.94,.22,.19,cream);
  arch(x,4.45,-12.37,1.18,.045,.04,gold);
  for(const dx of [-1.05,1.05]){
    box(.23,4.1,.25,x+dx,2.4,-12.46,cream);
    box(.32,.17,.35,x+dx,4.44,-12.4,stone);
  }
  statue(x,-12.12);
  box(2.5,.22,.46,x,5.82,-12.39,cream);
  box(2.16,1.65,.1,x,7.35,-12.6,red);
  for(const dx of [-1.15,1.15])box(.13,1.94,.15,x+dx,7.35,-12.49,cream);
  for(const y of [6.38,8.32])box(2.43,.13,.15,x,y,-12.49,cream);
  const boss=cylinder(.23,.23,.08,x,7.35,-12.43,gold,8);
  boss.rotation.x=Math.PI/2;
}
// Porte fermée, conservée dans la niche existante sous l'arche.
box(4.5,5.8,.18,0,2.96,-14.42,bronze);
for(const x of [-2.42,2.42]){
  box(.34,6.12,.48,x,3.09,-14.28,cream);
  box(.07,5.74,.06,x,3.09,-14.01,gold);
  box(.54,.3,.64,x,.19,-14.2,gray);
}
box(5.3,.34,.58,0,6.19,-14.23,cream);
box(5.36,.08,.63,0,6.4,-14.21,gold);
for(const x of [-1.1,1.1])for(const y of [1.13,2.99,4.85]){
  box(1.78,1.52,.12,x,y,-14.27,bronzePanel);
  for(const dx of [-.9,.9])box(.055,1.57,.06,x+dx,y,-14.18,gold);
  for(const dy of [-.78,.78])box(1.85,.055,.06,x,y+dy,-14.18,gold);
  box(1.45,1.19,.05,x,y,-14.17,bronze);
}
box(.07,5.73,.09,0,2.96,-14.14,gold);
for(const x of [-.16,.16]){
  const handle=cylinder(.065,.065,.3,x,2.85,-14.04,gold,8);
  handle.rotation.x=.12;
}
// Fronton triangulaire et médaillon sobre, sans texture ni sculpture importée.
const pediment=new THREE.Shape();
pediment.moveTo(-2.66,0);pediment.lineTo(2.66,0);pediment.lineTo(0,1.15);pediment.closePath();
const crown=new THREE.Mesh(new THREE.ExtrudeGeometry(pediment,{depth:.22,bevelEnabled:false}),cream);
crown.position.set(0,6.47,-14.38);crown.castShadow=true;scene.add(crown);
const seal=cylinder(.39,.39,.07,0,6.92,-14.1,gold,12);seal.rotation.x=Math.PI/2;
// Quatre colonnes monumentales à fûts sobres et chapiteaux géométriques.
const columns=[];
for(const x of [-5.8,5.8])for(const z of [-6,5]){columns.push({x,z});box(1.95,.35,1.95,x,.2,z,gray);box(1.7,.25,1.7,x,.5,z,cream);cylinder(.9,.9,.25,x,.75,z,stone);cylinder(.64,.8,7.6,x,4.65,z,stone,16);cylinder(.78,.65,.24,x,8.55,z,gray);cylinder(.91,.77,.35,x,8.83,z,cream);box(1.85,.3,1.85,x,9.12,z,cream);box(1.9,.09,1.9,x,9.32,z,gold);}
// Pilastres, panneaux et moulures : détails réguliers sans sculptures complexes.
for(const side of [-1,1]){for(const z of [-10,-3,4,11]){box(.28,9,.65,side*8.65,4.5,z,cream);box(.4,.25,.95,side*8.55,9,z,stone);}for(const z of [-6.5,.5,7.5]){box(.08,4.4,4.4,side*8.72,4.1,z,stone);box(.11,3.9,3.9,side*8.65,4.1,z,cream);box(.15,.12,4,side*8.56,2.2,z,gold);}box(.3,.9,26,side*8.67,.5,0,gray);}
for(const y of [9.6,10,10.3]){box(18,.18,.3,0,y,-12.55,y===10?gold:cream);for(const side of [-1,1])box(.4,.18,26,side*8.6,y,0,y===10?gold:cream);}
// Plafond à caissons, aux bordures or ancien.
box(18,.35,26,0,12.1,0,cream);
// Profil concave : le centre remonte dans le plafond, les bords sont arrondis.
const coveMaterial=cream.clone();coveMaterial.side=THREE.DoubleSide;
const coveGeometry=new THREE.LatheGeometry([
  [0,11.87],[1.35,11.87],[1.6,11.82],[1.81,11.7],[1.99,11.52],
  [2.13,11.32],[2.25,11.16],[2.4,11.06],[2.52,11.04]
].map(([r,y])=>new THREE.Vector2(r,y)),48);
for(const x of [-6,0,6])for(const z of [-9,-3,3,9]){
  const cove=new THREE.Mesh(coveGeometry,coveMaterial);cove.position.set(x,0,z);
  cove.name='rounded-ceiling-cove';cove.receiveShadow=true;scene.add(cove);
  ring(2.52,.085,11.04,cream,x,z);
  ring(2.4,.035,11.08,gold,x,z);
  ring(1.67,.025,11.79,gold,x,z);
}
// Fenêtres claires en hauteur, avec encadrements et meneaux simples.
const glazing=new THREE.MeshBasicMaterial({color:'#fff2cf'});
for(const side of [-1,1])for(const z of [-6.5,.5,7.5]){box(.09,1.65,2.6,side*8.72,8,z,glazing);box(.16,.09,2.8,side*8.58,8,z,stone);box(.16,1.8,.1,side*8.58,8,z,stone);}
// Fontaine centrale à deux vasques : pierre crème, lèvres dorées et eau discrète.
function ring(radius,tube,y,material,x=0,z=0){
  const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,6,40),material);
  mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y,z);
  mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
function basin(profile,material){
  const mesh=new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),40),material);
  mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
cylinder(2.16,2.24,.16,0,.13,0,gray,32);
cylinder(2.04,2.16,.14,0,.28,0,cream,32);
basin([[0,.32],[1.84,.32],[2.02,.45],[2.09,.7],[1.91,.7],[1.84,.43],[0,.43]],cream);
ring(2.015,.055,.7,gold);
ring(2.12,.035,.25,gold);
const waterMaterial=new THREE.MeshStandardMaterial({color:'#809a94',roughness:.25,metalness:.18,transparent:true,opacity:.86});
function waterDisk(radius,y){const mesh=new THREE.Mesh(new THREE.CircleGeometry(radius,40),waterMaterial);mesh.rotation.x=-Math.PI/2;mesh.position.y=y;scene.add(mesh);return mesh;}
waterDisk(1.86,.49);
cylinder(.38,.56,.45,0,.68,0,stone);
cylinder(.23,.36,1.1,0,1.4,0,cream);
ring(.31,.05,1.85,gold);
basin([[.16,1.82],[.65,1.94],[1.02,2.22],[1.08,2.4],[.96,2.4],[.88,2.24],[.2,2.06]],cream);
ring(1.02,.045,2.4,gold);
waterDisk(.94,2.29);
cylinder(.13,.2,.7,0,2.66,0,stone);
basin([[.1,2.94],[.43,3.06],[.58,3.27],[.5,3.29],[.43,3.15],[.1,3.05]],cream);
ring(.55,.035,3.28,gold);
waterDisk(.47,3.18);
const finial=new THREE.Mesh(new THREE.OctahedronGeometry(.16),gold);finial.position.y=3.53;scene.add(finial);
const streamMaterial=new THREE.MeshStandardMaterial({color:'#a9c0b7',transparent:true,opacity:.62,roughness:.2});
for(let i=0;i<8;i++){
  const angle=i*Math.PI/4;
  const points=[[.94,2.3],[1.17,2.22],[1.38,1.55],[1.48,.52]].map(([r,y])=>new THREE.Vector3(Math.cos(angle)*r,y,Math.sin(angle)*r));
  const stream=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),14,.016,4,false),streamMaterial);
  scene.add(stream);
}
const drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.035,6,4),streamMaterial,32);
drops.name='fountain-drops';drops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);drops.frustumCulled=false;scene.add(drops);
const dropDummy=new THREE.Object3D();
function animateFountain(time){
  for(let i=0;i<32;i++){
    const angle=(i%8)*Math.PI/4;
    const t=(time*.45+Math.floor(i/8)*.25)%1;
    const radius=.95+.53*t;
    dropDummy.position.set(Math.cos(angle)*radius,2.3-1.78*t*t,Math.sin(angle)*radius);
    dropDummy.scale.set(1,1.5,1);dropDummy.updateMatrix();drops.setMatrixAt(i,dropDummy.matrix);
  }
  drops.instanceMatrix.needsUpdate=true;
}
animateFountain(0);
for(let i=0;i<3;i++)ring(.15+i*.15,.008,.5,streamMaterial,1.48,0);

// Tableaux originaux dessinés localement : paysages et architecture en tons sourds.
// Aucune image distante et aucune reproduction d'œuvre revendiquée.
function paintingTexture(index){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=640;
  const ctx=canvas.getContext('2d');
  const polygon=(points,color)=>{ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();};
  const ellipse=(x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();};
  if(index===0){
    // Vue frontale : coupole de Saint-Pierre et façade claire.
    ctx.fillStyle='#aab5b2';ctx.fillRect(0,0,512,640);
    ctx.fillStyle='#c5b293';ctx.fillRect(0,447,512,193);
    polygon([[0,640],[225,450],[285,450],[512,640]],'#ddcbb0');
    ctx.fillStyle='#ded0b6';ctx.fillRect(83,345,346,132);ctx.fillRect(205,250,102,100);
    ellipse(256,250,62,80,'#d2c1a0');ctx.fillStyle='#aab5b2';ctx.fillRect(190,251,135,26);
    ctx.fillStyle='#b9a685';ctx.fillRect(244,150,24,23);ctx.fillRect(253,124,6,28);
    polygon([[73,348],[256,282],[440,348]],'#9b8766');polygon([[99,343],[256,299],[414,343]],'#e1d2b5');
    for(let x=109;x<426;x+=45){ctx.fillStyle='#827660';ctx.fillRect(x,371,21,87);ctx.fillStyle='#e8d9be';ctx.fillRect(x+26,360,7,106);}
    ctx.fillStyle='#514e43';ctx.fillRect(237,394,39,82);
    for(const x of [36,477]){ellipse(x,410,23,100,'#69745e');}
  }else if(index===1){
    // Paysage horizontal : le Tibre et un pont aux arches sombres.
    ctx.fillStyle='#b5b5a8';ctx.fillRect(0,0,512,640);
    polygon([[0,284],[104,231],[210,285],[338,208],[512,278],[512,430],[0,430]],'#92927b');
    ctx.fillStyle='#798e88';ctx.fillRect(0,383,512,257);
    polygon([[0,355],[142,392],[98,640],[0,640]],'#6e775a');polygon([[512,342],[378,401],[441,640],[512,640]],'#858263');
    ctx.fillStyle='#c9b692';ctx.fillRect(25,335,462,89);
    for(let x=48;x<465;x+=88){ctx.fillStyle='#555b50';ctx.beginPath();ctx.arc(x+30,407,30,Math.PI,0);ctx.lineTo(x+60,426);ctx.lineTo(x,426);ctx.fill();}
    ctx.fillStyle='#e0c9a2';ctx.fillRect(20,326,472,13);
    for(let i=0;i<14;i++){ctx.fillStyle=i%2?'#b4b7a1':'#889f96';ctx.fillRect(140+(i%3)*31,450+i*11,100-i*3,3);}
    for(const x of [37,471]){ellipse(x,301,17,67,'#505f49');}
  }else if(index===2){
    // Nature morte : vase ocre, fleurs ivoire et drapé rouge brun.
    ctx.fillStyle='#484f46';ctx.fillRect(0,0,512,640);
    polygon([[0,0],[131,0],[170,492],[0,558]],'#744e40');
    ctx.fillStyle='#8f7c60';ctx.fillRect(0,480,512,160);
    polygon([[46,489],[314,479],[442,640],[107,640]],'#c9b99b');
    ellipse(271,473,89,19,'#433e32');
    polygon([[222,330],[303,330],[292,371],[316,408],[297,464],[234,464],[210,408],[233,371]],'#b79c6b');
    ellipse(263,332,42,10,'#dbc49a');ellipse(263,332,29,5,'#66563b');
    ctx.strokeStyle='#87916d';ctx.lineWidth=5;
    for(const [x,y] of [[191,205],[263,165],[333,218],[224,260],[301,279]]){
      ctx.beginPath();ctx.moveTo(263,333);ctx.lineTo(x,y);ctx.stroke();
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ellipse(x+Math.cos(a)*13,y+Math.sin(a)*13,12,15,'#ddd4b8');}
      ellipse(x,y,7,7,'#b29559');
    }
  }else{
    // Figure drapée : silhouette classique, manteau bleu grisé et livre.
    ctx.fillStyle='#958a74';ctx.fillRect(0,0,512,640);
    ctx.fillStyle='#626759';ctx.fillRect(103,193,305,447);ellipse(256,194,152,126,'#626759');
    polygon([[0,0],[74,0],[74,640],[0,640]],'#c5b495');polygon([[438,0],[512,0],[512,640],[438,640]],'#c5b495');
    ellipse(260,174,48,57,'#c3ab88');ellipse(260,131,45,17,'#5f5746');
    polygon([[220,226],[300,226],[344,528],[173,528]],'#d9cbb0');
    polygon([[219,224],[265,247],[224,476],[184,530],[156,541],[185,315]],'#778582');
    polygon([[297,229],[324,295],[337,509],[277,480],[263,343]],'#687976');
    polygon([[193,296],[221,307],[257,351],[239,370],[194,338]],'#baa27f');
    polygon([[272,337],[331,311],[343,380],[285,399]],'#765845');
    polygon([[280,342],[323,324],[332,374],[290,389]],'#ded0ad');
    ctx.fillStyle='#bbb09a';ctx.fillRect(150,533,211,20);ctx.fillStyle='#a3967c';ctx.fillRect(133,553,247,22);
  }
  // Patine déterministe pour évoquer une toile, sans charger de texture.
  let seed=index+17;for(let i=0;i<9500;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%512;seed=(seed*1664525+1013904223)>>>0;const y=seed%640;ctx.fillStyle=i%2?'#f1dec00a':'#3b30200a';ctx.fillRect(x,y,2,3);}
  const vignette=ctx.createRadialGradient(256,300,100,256,320,420);vignette.addColorStop(0,'#30261500');vignette.addColorStop(1,'#30261570');ctx.fillStyle=vignette;ctx.fillRect(0,0,512,640);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);return texture;
}
const artworkMaterials=Array.from({length:4},(_,i)=>new THREE.MeshStandardMaterial({map:paintingTexture(i),roughness:1}));
for(const side of [-1,1])for(const [index,z] of [-6.5,7.5].entries()){
  // Les cadres sont adossés aux panneaux existants, sous les fenêtres.
  box(.16,3.38,2.72,side*8.48,4.18,z,bronze);
  for(const dy of [-1.64,1.64]){
    box(.24,.18,2.9,side*8.32,4.18+dy,z,gold);
    box(.27,.045,2.58,side*8.25,4.18+dy-Math.sign(dy)*.15,z,cream);
  }
  for(const dz of [-1.35,1.35]){
    box(.24,3.34,.18,side*8.32,4.18,z+dz,gold);
    box(.27,3.03,.045,side*8.25,4.18,z+dz-Math.sign(dz)*.15,cream);
  }
  const picture=new THREE.Mesh(new THREE.PlaneGeometry(2.42,2.96),artworkMaterials[index+(side>0?2:0)]);
  picture.rotation.y=-side*Math.PI/2;picture.position.set(side*8.3,4.18,z);picture.name='wall-painting';picture.userData.subject=['Saint-Pierre','Le Tibre','Nature morte','Figure drapée'][index+(side>0?2:0)];scene.add(picture);
  box(.15,.08,1.2,side*8.28,2.19,z,gold);
}
// Ornements en or ancien : rosaces des pilastres et feuilles géométriques des chapiteaux.
for(const side of [-1,1])for(const z of [-10,-3,4,11]){
  const medallion=cylinder(.25,.25,.08,side*8.43,7.1,z,gold,12);medallion.rotation.z=Math.PI/2;
  for(const dy of [-.53,.53]){const leaf=box(.1,.31,.2,side*8.43,7.1+dy,z,gold);leaf.rotation.x=Math.PI/4;}
}
for(const c of columns){
  ring(.82,.035,8.67,gold,c.x,c.z);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;const leaf=new THREE.Mesh(new THREE.OctahedronGeometry(.17),gold);
    leaf.position.set(c.x+Math.cos(a)*.83,8.95,c.z+Math.sin(a)*.83);leaf.scale.set(.55,1.4,.55);scene.add(leaf);
  }
}

// Accents de marbre noir : socles, soubassements et filets, sans assombrir les murs.
for(const side of [-1,1]){
  box(.34,.13,25.8,side*8.6,1.02,0,black);
  box(.37,.045,25.8,side*8.58,1.11,0,gold);
}
for(const c of columns){
  box(1.97,.11,1.97,c.x,.38,c.z,black);
  cylinder(.82,.82,.11,c.x,.94,c.z,black,16);
  ring(.82,.025,1.01,gold,c.x,c.z);
}
ring(2.13,.045,.34,black);
for(const x of [-4.18,4.18])box(.22,5.3,.05,x,3.03,-12.37,black);
for(const x of [-6.7,6.7]){
  for(const dx of [-1.24,1.24])box(.07,2.07,.09,x+dx,7.35,-12.43,black);
  for(const y of [6.32,8.38])box(2.55,.07,.09,x,y,-12.43,black);
}

// Caissons à filets noirs et rosaces en relief : une lecture plus riche du plafond.
const ceilingPetals=new THREE.InstancedMesh(new THREE.OctahedronGeometry(1),gold,96);
ceilingPetals.name='ceiling-rosettes';
const petalDummy=new THREE.Object3D();let petalIndex=0;
for(const x of [-6,0,6])for(const z of [-9,-3,3,9]){
  ring(.68,.035,11.79,gold,x,z);
  cylinder(.19,.26,.13,x,11.76,z,cream,8);
  for(let i=0;i<8;i++){
    const angle=i*Math.PI/4;
    petalDummy.position.set(x+Math.cos(angle)*.43,11.76,z+Math.sin(angle)*.43);
    petalDummy.rotation.set(0,-angle,0);petalDummy.scale.set(.25,.08,.115);
    petalDummy.updateMatrix();ceilingPetals.setMatrixAt(petalIndex++,petalDummy.matrix);
  }
}
ceilingPetals.instanceMatrix.needsUpdate=true;scene.add(ceilingPetals);

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
function allowed(x,z){return Math.abs(x)<8.25&&z>-11.8&&z<12.15&&Math.hypot(x,z)>=2.6&&!columns.some(c=>Math.hypot(x-c.x,z-c.z)<1.2);}
function move(dt){if(!active&&!dragging)return;const forward=Number(keys.has('KeyZ')||keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'));const right=Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyQ')||keys.has('KeyA')||keys.has('ArrowLeft'));const length=Math.hypot(forward,right)||1;const dx=(right*Math.cos(yaw)-forward*Math.sin(yaw))*3.5*dt/length;const dz=(-forward*Math.cos(yaw)-right*Math.sin(yaw))*3.5*dt/length;if(allowed(camera.position.x+dx,camera.position.z))camera.position.x+=dx;if(allowed(camera.position.x,camera.position.z+dz))camera.position.z+=dz;}
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}addEventListener('resize',resize);resize();
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{move(Math.min(clock.getDelta(),.05));animateFountain(clock.elapsedTime);renderer.render(scene,camera);});
// État observable pour les tests navigateur, sans modifier la scène.
window.room={camera,scene,renderer,allowed,reset,get active(){return active;}};
