import * as THREE from 'three';

// Salle II : nef avec abside elliptique, Cathedra Petri interprétée géométriquement.
export function createChapel({scene,box,cylinder,mat,cream,stone,gray,black,gold,white}){
  const chapel=new THREE.Group();chapel.name='chapel';scene.add(chapel);
  const wood=mat('#65503c'),darkWood=mat('#493c30'),chairBronze=mat('#25251f',.4,.45),chairGold=mat('#b09452',.35,.65);
  const chapelBlack=mat('#11151a'),nightFloor=mat('#292a29'),darkStone=mat('#282a2b');
  const obstacles=[];
  const floorShape=new THREE.Shape();floorShape.moveTo(-8,-17);floorShape.lineTo(8,-17);floorShape.lineTo(8,-28);
  floorShape.absellipse(0,-28,8,9,0,Math.PI,true);floorShape.lineTo(-8,-17);floorShape.closePath();
  // Shape XY convertie en plan XZ ; l'abside s'étend vers z négatif.
  const floorGeometry=new THREE.ShapeGeometry(floorShape,40);
  const floor=new THREE.Mesh(floorGeometry,cream);floor.rotation.x=Math.PI/2;floor.receiveShadow=true;floor.material=nightFloor.clone();floor.material.side=THREE.DoubleSide;floor.name='chapel-floor';chapel.add(floor);
  box(4.2,.22,3.2,0,-.12,-15.5,cream);
  for(const side of [-1,1]){
    box(6.25,10.7,.4,side*4.875,5.35,-17,chapelBlack);
    box(.4,10.7,11,side*8,5.35,-22.5,chapelBlack);
    box(.48,.7,11,side*7.76,.35,-22.5,black);
    box(.5,.05,11,side*7.74,.75,-22.5,gold);
  }
  box(3.5,4.2,.4,0,8.6,-17,chapelBlack);
  // Murs courbes de l'abside : segments tangents, sans modèles importés.
  for(let i=0;i<32;i++){
    const a=i*Math.PI/32,b=(i+1)*Math.PI/32;
    const x1=8*Math.cos(a),z1=-28-9*Math.sin(a),x2=8*Math.cos(b),z2=-28-9*Math.sin(b);
    const x=(x1+x2)/2,z=(z1+z2)/2,length=Math.hypot(x2-x1,z2-z1)+.04;
    for(const [y,h,m] of [[5.35,10.7,chapelBlack],[.35,.7,black],[9.7,.12,gold]]){
      const segment=box(length,h,.3,x,y,z,m);segment.rotation.y=-Math.atan2(z2-z1,x2-x1);
    }
  }
  // Dallage sobre et allée centrale : la zone arrondie reste en marbre crème.
  for(let z=-18;z>=-30;z-=2){box(2.6,.022,1.94,0,.015,z,darkStone);for(const side of [-1,1])box(.065,.03,1.97,side*1.39,.02,z,black);}
  for(const z of [-18.7,-30.2])box(14.8,.025,.12,0,.025,z,stone);
  // Voûte en berceau au-dessus de la nef, prolongée par une demi-coupole.
  const vaultMaterial=chapelBlack.clone();vaultMaterial.side=THREE.DoubleSide;
  const vaultPositions=[],vaultIndices=[];
  for(let i=0;i<=32;i++){
    const a=i*Math.PI/32,x=8*Math.cos(a),y=8.9+3.1*Math.sin(a);
    vaultPositions.push(x,y,-17,x,y,-28);
    if(i<32){const k=i*2;vaultIndices.push(k,k+1,k+2,k+1,k+3,k+2);}
  }
  const vaultGeometry=new THREE.BufferGeometry();vaultGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vaultPositions,3));vaultGeometry.setIndex(vaultIndices);vaultGeometry.computeVertexNormals();
  chapel.add(new THREE.Mesh(vaultGeometry,vaultMaterial));
  const dome=new THREE.Mesh(new THREE.SphereGeometry(1,40,16,0,Math.PI,0,Math.PI/2),vaultMaterial);dome.scale.set(8,3.1,9);dome.position.set(0,8.9,-28);dome.rotation.y=Math.PI;chapel.add(dome);
  // Nervures fines dorées, qui soulignent la courbe au lieu d'un plafond carré.
  for(const z of [-17.3,-22.4,-27.7]){
    const points=[];for(let i=0;i<=32;i++){const a=i*Math.PI/32;points.push(new THREE.Vector3(7.95*Math.cos(a),8.87+3.08*Math.sin(a),z));}
    chapel.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),40,.045,5,false),gold));
  }
  for(const side of [-1,1])for(const z of [-18.2,-23.3,-28]){
    box(.22,8.5,.44,side*7.67,4.25,z,darkStone);box(.38,.18,.64,side*7.6,8.6,z,gold);
  }
  function stainedGlass(index){
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=512;const ctx=canvas.getContext('2d');
    ctx.fillStyle='#756951';ctx.fillRect(0,0,256,512);
    const colors=['#55788a','#9b655e','#b89758','#74856c'];
    for(let row=0;row<8;row++)for(let col=0;col<4;col++){
      ctx.fillStyle=colors[(row+col+index)%4];ctx.fillRect(10+col*60,10+row*62,56,58);
      ctx.strokeStyle='#363c38';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(10+col*60,39+row*62);ctx.lineTo(38+col*60,10+row*62);ctx.lineTo(66+col*60,39+row*62);ctx.lineTo(38+col*60,68+row*62);ctx.closePath();ctx.stroke();
    }
    ctx.fillStyle='#d4ba7c';ctx.beginPath();ctx.ellipse(128,248,58,84,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#554f3e';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#e8d6a6';
    for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.ellipse(128+Math.cos(a)*28,248+Math.sin(a)*37,12,23,a,0,Math.PI*2);ctx.fill();}
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
  }
  // Six vitraux, avec lumière colorée et taches lumineuses géométriques au sol.
  for(const side of [-1,1])for(const [index,z] of [-20.4,-24.7,-28.8].entries()){
    const x=side*(z<-28?7.5:7.77),texture=stainedGlass(index+(side>0?1:0));
    const material=new THREE.MeshStandardMaterial({map:texture,emissive:'#e6c98b',emissiveMap:texture,emissiveIntensity:.16,roughness:.5});
    const window=new THREE.Mesh(new THREE.PlaneGeometry(1.55,3.4),material);window.rotation.y=-side*Math.PI/2;window.position.set(x,6.5,z);window.name='chapel-stained-glass';chapel.add(window);
    for(const dz of [-.84,.84])box(.16,3.6,.1,x-side*.08,6.5,z+dz,stone);
    for(const y of [4.72,8.28])box(.16,.12,1.8,x-side*.08,y,z,gold);
    if(index===1){const light=new THREE.SpotLight(side>0?'#e2bc83':'#a7c4cd',10,15,.47,.8,1.5);light.position.set(x-side*.3,6.2,z);light.target.position.set(side*1.8,.1,z+2);scene.add(light,light.target);}
    for(let p=0;p<4;p++){
      const patch=new THREE.Mesh(new THREE.PlaneGeometry(.75,2.8),new THREE.MeshBasicMaterial({color:['#7f9dae','#b48660','#9e7870','#94a386'][p],transparent:true,opacity:.075,depthWrite:false}));
      patch.rotation.set(-Math.PI/2,0,-side*.45);patch.position.set(side*(3.8+p*.65),.045,z+1.1+p*.24);chapel.add(patch);
    }
    const beamGeometry=new THREE.BufferGeometry();beamGeometry.setAttribute('position',new THREE.Float32BufferAttribute([x,7.7,z-.65,x,7.7,z+.65,side*2.2,.07,z+3, x,7.7,z-.65,side*2.2,.07,z+3,side*3.7,.07,z+1.1],3));beamGeometry.computeVertexNormals();
    const beam=new THREE.Mesh(beamGeometry,new THREE.MeshBasicMaterial({color:'#d5c5a0',transparent:true,opacity:.012,side:THREE.DoubleSide,depthWrite:false}));chapel.add(beam);
  }
  // Estrade de la chaire, laissant une allée devant elle.
  box(7.4,.18,4.8,0,.12,-33.4,gray);box(6.7,.22,4.3,0,.3,-33.55,cream);box(6,.2,3.8,0,.51,-33.7,stone);
  obstacles.push({x:0,z:-33.5,hx:4,hz:2.9});
  const chair=new THREE.Group();chair.name='cathedra-petri';chair.userData.palette='or massif et noir';chair.position.set(0,.63,-33.8);chair.scale.set(1.45,1.45,1.15);chapel.add(chair);
  const cbox=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;chair.add(mesh);return mesh;};
  // Le trône est une interprétation du reliquaire en bronze de Bernin.
  for(const x of [-.95,.95])for(const z of [-.5,.5])cbox(.24,1.25,.24,x,.94,z,chairGold);
  cbox(2.35,.3,1.65,0,1.65,0,chairGold);cbox(1.75,.12,1.25,0,1.86,.05,chairBronze);
  cbox(2.05,2.12,.28,0,2.77,-.65,chairGold);cbox(1.6,1.67,.06,0,2.78,-.48,chairGold);cbox(1.35,1.43,.07,0,2.78,-.43,chairBronze);
  for(const x of [-1.14,1.14]){cbox(.25,.23,1.65,x,2.16,0,chairGold);cbox(.18,.65,.18,x,1.95,.55,chairBronze);}
  for(const x of [-1.05,1.05])cbox(.13,2.2,.38,x,2.8,-.65,chairGold);
  for(const y of [1.78,3.86])cbox(2.3,.13,.38,0,y,-.65,chairGold);
  cbox(.12,.75,.08,0,2.83,-.36,chairGold);cbox(.48,.11,.08,0,3.01,-.36,chairGold);
  for(let i=0;i<7;i++){const crown=new THREE.Mesh(new THREE.OctahedronGeometry(.17),chairGold);crown.position.set(-.9+i*.3,4.02+(.9-Math.abs(-.9+i*.3))*.32,-.65);chair.add(crown);}
  // Quatre figures de soutien, en bronze, évoquent les docteurs de l'Église.
  for(const [i,x] of [-2.7,-1.7,1.7,2.7].entries()){
    const z=-33.9+(i%2?.4:0);cylinder(.23,.36,1.45,x,1.42,z,chairBronze,8);cylinder(.3,.22,.4,x,2.34,z,chairBronze,8);
    const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.21,0),chairBronze);head.position.set(x,2.76,z);chapel.add(head);
    const sash=box(.09,1.1,.07,x,1.8,z+.28,chairGold);sash.rotation.z=Math.sign(x)*.17;
    const arm=box(.17,.78,.2,x-Math.sign(x)*.26,2.5,z+.09,chairBronze);arm.rotation.z=-Math.sign(x)*.55;
  }
  // Fond d'abside bleu nuit, galbé suivant le mur ; le reste reste en pierre claire.
  const midnight=mat('#101c2c',.94,0);
  const backdrop=new THREE.Group();backdrop.name='cathedra-night-backdrop';chapel.add(backdrop);
  for(let i=0;i<28;i++){
    const a=.45+i/28*(Math.PI-.9),b=.45+(i+1)/28*(Math.PI-.9);
    const x1=7.79*Math.cos(a),z1=-28-8.79*Math.sin(a),x2=7.79*Math.cos(b),z2=-28-8.79*Math.sin(b);
    const width=Math.hypot(x2-x1,z2-z1)+.025;
    for(const [y,h,m] of [[5.4,7.6,midnight],[1.62,.12,chairGold],[9.18,.16,chairGold],[8.95,.055,chairGold]]){
      const panel=box(width,h,.06,(x1+x2)/2,y,(z1+z2)/2,m);panel.rotation.y=-Math.atan2(z2-z1,x2-x1);panel.castShadow=false;backdrop.attach(panel);
    }
  }
  for(const a of [.45,.95,Math.PI/2,Math.PI-.95,Math.PI-.45]){
    const x=7.7*Math.cos(a),z=-28-8.7*Math.sin(a);
    const pilaster=box(.13,7.5,.12,x,5.4,z,chairGold);pilaster.rotation.y=Math.atan2(-Math.cos(a),Math.sin(a));pilaster.castShadow=false;
    for(const y of [1.7,8.95]){const cap=box(.35,.15,.22,x,y,z,chairGold);cap.rotation.y=pilaster.rotation.y;cap.castShadow=false;}
  }
  const starShape=new THREE.Shape();
  for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?.42:1;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?starShape.lineTo(x,y):starShape.moveTo(x,y);}starShape.closePath();
  const stars=new THREE.InstancedMesh(new THREE.ExtrudeGeometry(starShape,{depth:.08,bevelEnabled:false}),chairGold,108);stars.name='cathedra-gold-stars';
  const starDummy=new THREE.Object3D();
  for(let i=0;i<108;i++){
    const row=Math.floor(i/18),a=.54+(i%18+(row%2)*.35)/18*(Math.PI-1.08);
    starDummy.position.set(7.72*Math.cos(a),2.25+row*1.19,-28-8.72*Math.sin(a));
    starDummy.rotation.set(0,Math.atan2(-Math.cos(a),Math.sin(a)),i%2?.15:-.15);starDummy.scale.setScalar(.065+(i%3)*.015);starDummy.updateMatrix();stars.setMatrixAt(i,starDummy.matrix);
  }
  stars.instanceMatrix.needsUpdate=true;backdrop.add(stars);
  // Encadrement de sanctuaire : colonnes dorées sur bases noires et fronton monumental.
  for(const x of [-3.35,3.35]){
    box(.82,.22,.86,x,.72,-34.7,black);cylinder(.23,.32,5.65,x,3.62,-34.7,chairGold,12);cylinder(.4,.28,.25,x,6.57,-34.7,chairGold,12);box(.91,.18,.89,x,6.79,-34.7,chairGold);
    for(const y of [1.03,6.33])cylinder(.34,.34,.09,x,y,-34.7,black,12);
  }
  box(7.6,.3,.7,0,7.03,-34.72,chairGold);box(7.25,.095,.73,0,7.24,-34.72,black);
  const templeFront=new THREE.Shape();templeFront.moveTo(-3.9,0);templeFront.lineTo(3.9,0);templeFront.lineTo(0,1.05);templeFront.closePath();
  const fronton=new THREE.Mesh(new THREE.ExtrudeGeometry(templeFront,{depth:.26,bevelEnabled:false}),chairGold);fronton.position.set(0,7.31,-34.85);chapel.add(fronton);
  const insetFront=new THREE.Shape();insetFront.moveTo(-3.12,0);insetFront.lineTo(3.12,0);insetFront.lineTo(0,.69);insetFront.closePath();
  const darkFront=new THREE.Mesh(new THREE.ShapeGeometry(insetFront),chairBronze);darkFront.position.set(0,7.46,-34.575);chapel.add(darkFront);
  // Gloire dorée et fenêtre ambrée avec colombe, marqueurs visuels de la chaire.
  const glory=new THREE.Group();glory.name='cathedra-glory';glory.position.set(0,9,-34.38);glory.scale.setScalar(.62);chapel.add(glory);
  const amber=new THREE.Mesh(new THREE.CircleGeometry(1.02,48),new THREE.MeshBasicMaterial({color:'#d7b365'}));amber.scale.y=1.3;amber.position.z=.12;glory.add(amber);
  for(const radius of [1.07,1.17]){const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,.06,6,48),chairGold);rim.scale.y=1.3;rim.position.z=.17;glory.add(rim);}
  for(let i=0;i<36;i++){
    const a=i*Math.PI/18,length=.65+(i%3)*.2;
    const ray=new THREE.Mesh(new THREE.ConeGeometry(.075,length,4),chairGold);ray.position.set(Math.sin(a)*(1.65+length*.35),Math.cos(a)*(1.9+length*.35),0);ray.rotation.z=-a;glory.add(ray);
    if(i%3===0){const cloud=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,0),chairGold);cloud.position.set(Math.sin(a)*1.38,Math.cos(a)*1.62,.05);cloud.scale.set(1.3,.65,.5);glory.add(cloud);}
  }
  const doveShape=new THREE.Shape();doveShape.moveTo(0,-.35);doveShape.lineTo(-.16,-.05);doveShape.quadraticCurveTo(-.67,.14,-.72,.48);doveShape.quadraticCurveTo(-.26,.32,0,.12);doveShape.quadraticCurveTo(.26,.32,.72,.48);doveShape.quadraticCurveTo(.67,.14,.16,-.05);doveShape.closePath();
  const dove=new THREE.Mesh(new THREE.ShapeGeometry(doveShape),new THREE.MeshBasicMaterial({color:'#fff0cf'}));dove.position.z=.2;glory.add(dove);
  const glow=new THREE.PointLight('#f3d19a',24,13,1.6);glow.position.set(0,7,-34.5);scene.add(glow);
  const focus=new THREE.SpotLight('#ffe4b9',95,24,.56,.8,1.5);focus.position.set(0,10,-28);focus.target.position.set(0,4.3,-33.8);scene.add(focus,focus.target);
  // Appliques murales : trois bougies par support, sans éclairage fluorescent.
  const candleWax=mat('#d8c7a5'),flameMaterial=new THREE.MeshBasicMaterial({color:'#ffd69a'});
  const flames=[],candleLights=[];
  const glowCanvas=document.createElement('canvas');glowCanvas.width=64;glowCanvas.height=64;
  const glowContext=glowCanvas.getContext('2d'),gradient=glowContext.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'#ffd39acc');gradient.addColorStop(.25,'#e9a25155');gradient.addColorStop(1,'#d68b3100');glowContext.fillStyle=gradient;glowContext.fillRect(0,0,64,64);
  const glowTexture=new THREE.CanvasTexture(glowCanvas);glowTexture.colorSpace=THREE.SRGBColorSpace;
  const flameGlowMaterial=new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  for(const side of [-1,1])for(const z of [-19,-23,-27,-30]){
    const sconce=new THREE.Group();sconce.name='chapel-candle-sconce';sconce.position.set(side*(z===-30?7.35:7.7),2.9,z);sconce.rotation.y=-side*Math.PI/2;chapel.add(sconce);
    const local=(geometry,material,x,y,z)=>{const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);sconce.add(mesh);return mesh;};
    local(new THREE.BoxGeometry(.25,.76,.07),chairBronze,0,0,0);
    local(new THREE.BoxGeometry(.055,.67,.085),chairGold,0,0,.04);
    local(new THREE.BoxGeometry(.64,.05,.06),chairGold,0,-.21,.33);
    local(new THREE.BoxGeometry(.055,.06,.4),chairGold,0,-.21,.2);
    for(const x of [-.25,0,.25]){
      local(new THREE.CylinderGeometry(.1,.065,.045,10),chairGold,x,-.15,.36);
      local(new THREE.CylinderGeometry(.052,.057,.35,10),candleWax,x,.04,.36);
      local(new THREE.CylinderGeometry(.008,.008,.055,6),black,x,.24,.36);
      const flame=local(new THREE.SphereGeometry(1,8,6),flameMaterial,x,.325,.36);flame.scale.set(.045,.115,.037);flames.push(flame);
      const halo=new THREE.Sprite(flameGlowMaterial);halo.position.set(x,.32,.36);halo.scale.set(.5,.65,1);sconce.add(halo);
    }
  }
  // Quatre sources partagées éclairent les huit appliques pour limiter le coût.
  for(const side of [-1,1])for(const z of [-21,-28.5]){
    const light=new THREE.PointLight('#ffc486',65,12,1.65);light.position.set(side*6.6,3.1,z);scene.add(light);candleLights.push(light);
  }
  // Baldaquin inspiré de Bernin : quatre colonnes salomoniques et volutes ouvertes.
  const baldachin=new THREE.Group();baldachin.name='bernin-baldachin';chapel.add(baldachin);
  const baldachinBronze=mat('#29251d',.4,.6);
  for(const x of [-2.65,2.65])for(const z of [-31.35,-34.85]){
    box(.95,.2,.95,x,.74,z,black);box(.84,.1,.84,x,.9,z,chairGold);
    cylinder(.37,.42,.25,x,1.075,z,baldachinBronze,12);
    const points=[],vinePoints=[];
    for(let i=0;i<=96;i++){
      const t=i/96,a=t*Math.PI*6,y=1.2+t*5.85;
      points.push(new THREE.Vector3(x+Math.cos(a)*.105,y,z+Math.sin(a)*.105));
      vinePoints.push(new THREE.Vector3(x+Math.cos(a)*.365,y,z+Math.sin(a)*.365));
    }
    const shaft=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),96,.235,10,false),baldachinBronze);shaft.name='baldachin-twisted-column';baldachin.add(shaft);
    const vine=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vinePoints),96,.032,5,false),chairGold);baldachin.add(vine);
    for(let i=0;i<10;i++){
      const a=i/9*Math.PI*6;const leaf=new THREE.Mesh(new THREE.OctahedronGeometry(.11),chairGold);
      leaf.position.set(x+Math.cos(a)*.37,1.35+i/9*5.5,z+Math.sin(a)*.37);leaf.scale.set(.6,1.3,.4);leaf.rotation.y=-a;baldachin.add(leaf);
    }
    cylinder(.42,.29,.3,x,7.18,z,chairGold,12);box(.98,.18,.98,x,7.43,z,chairGold);
    const crown=new THREE.Mesh(new THREE.OctahedronGeometry(.23),chairGold);crown.position.set(x,8.02,z);baldachin.add(crown);
  }
  for(const z of [-30.93,-35.27]){
    box(6.45,.34,.35,0,7.7,z,baldachinBronze);box(6.54,.065,.39,0,7.91,z,chairGold);box(6.54,.06,.38,0,7.48,z,chairGold);
    for(let i=0;i<17;i++){const fringe=box(.14,.23,.09,-3+i*.375,7.31,z,chairGold);fringe.rotation.z=i%2?.12:-.12;}
  }
  for(const x of [-3.06,3.06]){
    box(.34,.34,4.4,x,7.7,-33.1,baldachinBronze);box(.38,.065,4.5,x,7.91,-33.1,chairGold);
    for(let i=0;i<11;i++)box(.09,.23,.14,x,7.31,-35.05+i*.39,chairGold);
  }
  for(const x of [-2.65,2.65])for(const z of [-31.35,-34.85]){
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,7.95,z),new THREE.Vector3(x*.86,8.68,z+(z>-33?-.35:.35)),new THREE.Vector3(x*.35,9.23,-33.1),new THREE.Vector3(0,9.48,-33.1)]);
    baldachin.add(new THREE.Mesh(new THREE.TubeGeometry(curve,24,.075,6,false),chairGold));
  }
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),chairGold);orb.position.set(0,9.53,-33.1);baldachin.add(orb);
  box(.065,.65,.065,0,9.98,-33.1,chairGold);box(.37,.065,.065,0,10.09,-33.1,chairGold);
  baldachin.userData={columns:4,style:'bronze sombre et or ancien, colonnes torsadées'};
  function animate(time){
    flames.forEach((flame,index)=>flame.scale.y=.11*(1+.06*Math.sin(time*5+index*1.7)));
    candleLights.forEach((light,index)=>light.intensity=65*(1+.025*Math.sin(time*3+index*2)));
  }

  function visitor(x,z,index){
    const person=new THREE.Group();person.name='seated-visitor';person.position.set(x,0,z);person.rotation.y=Math.PI;chapel.add(person);
    const clothes=[mat('#4b5961'),mat('#653d46'),mat('#aaa28d'),mat('#53584b')][index%4];
    const skin=mat(['#c5a184','#b98d6a','#82664f','#d1b59a'][index%4]),hair=mat(index%3?'#4b4034':'#aaa390');
    const localBox=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);person.add(mesh);return mesh;};
    localBox(.36,.42,.25,0,1.02,0,clothes);localBox(.34,.12,.36,0,.77,.12,darkWood);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.14,10,7),skin);head.position.set(0,1.4,.015);person.add(head);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.146,10,6,0,Math.PI*2,0,Math.PI*.55),hair);cap.position.set(0,1.43,.005);person.add(cap);
    for(const side of [-1,1]){
      localBox(.12,.13,.39,side*.105,.72,.19,clothes);localBox(.105,.43,.12,side*.105,.44,.36,clothes);localBox(.13,.08,.24,side*.105,.19,.43,black);
      const arm=localBox(.085,.28,.1,side*.215,1.01,.08,clothes);arm.rotation.x=-.48;
      const forearm=localBox(.08,.085,.25,side*(index%3===0?.09:.19),.87,.2,skin);forearm.rotation.y=side*(index%3===0?.5:0);
    }
    if(index%3===1){const book=localBox(.23,.025,.2,0,.86,.3,cream);book.rotation.x=-.2;}
  }
  // Huit bancs et vingt visiteurs, tous tournés vers la chaire.
  let visitorIndex=0;
  for(const z of [-20.5,-23,-25.5,-28])for(const side of [-1,1]){
    const x=side*3.7;box(3.8,.16,.78,x,.57,z,wood);box(3.8,.63,.13,x,.96,z+.34,wood);
    for(const dx of [-1.55,1.55]){box(.16,.47,.58,x+dx,.28,z,darkWood);box(.14,.2,.82,x+dx,.85,z,wood);}
    obstacles.push({x,z,hx:2.2,hz:.95});
    for(const dx of z===-23||z===-28?[-1,0,1]:[-.8,.8])visitor(x+dx,z,visitorIndex++);
  }
  chapel.userData={shape:'abside elliptique',benches:8,visitors:visitorIndex};
  function allowed(x,z){
    if(z>-17.55)return Math.abs(x)<1.58&&z<-11.5;
    const inside=z>=-28?Math.abs(x)<7.35:(x/7.35)**2+((z+28)/8.3)**2<1;
    return inside&&z>-36.3&&!obstacles.some(o=>Math.abs(x-o.x)<o.hx&&Math.abs(z-o.z)<o.hz);
  }
  return {allowed,animate};
}
