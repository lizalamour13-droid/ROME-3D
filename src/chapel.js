import * as THREE from 'three';

// Salle II : nef avec abside elliptique, Cathedra Petri interprétée géométriquement.
export function createChapel({scene,box,cylinder,mat,cream,stone,gray,black,gold,white}){
  const chapel=new THREE.Group();chapel.name='chapel';scene.add(chapel);
  const wood=mat('#65503c'),darkWood=mat('#493c30'),chairBronze=mat('#5b412c',.52,.4),chairGold=mat('#ad8b4b',.42,.5);
  const obstacles=[];
  const floorShape=new THREE.Shape();floorShape.moveTo(-8,-17);floorShape.lineTo(8,-17);floorShape.lineTo(8,-28);
  floorShape.absellipse(0,-28,8,9,0,Math.PI,true);floorShape.lineTo(-8,-17);floorShape.closePath();
  // Shape XY convertie en plan XZ ; l'abside s'étend vers z négatif.
  const floorGeometry=new THREE.ShapeGeometry(floorShape,40);
  const floor=new THREE.Mesh(floorGeometry,cream);floor.rotation.x=Math.PI/2;floor.receiveShadow=true;floor.material=cream.clone();floor.material.side=THREE.DoubleSide;floor.name='chapel-floor';chapel.add(floor);
  box(4.2,.22,3.2,0,-.12,-15.5,cream);
  for(const side of [-1,1]){
    box(6.25,10.7,.4,side*4.875,5.35,-17,cream);
    box(.4,10.7,11,side*8,5.35,-22.5,cream);
    box(.48,.7,11,side*7.76,.35,-22.5,black);
    box(.5,.05,11,side*7.74,.75,-22.5,gold);
  }
  box(3.5,4.2,.4,0,8.6,-17,cream);
  // Murs courbes de l'abside : segments tangents, sans modèles importés.
  for(let i=0;i<32;i++){
    const a=i*Math.PI/32,b=(i+1)*Math.PI/32;
    const x1=8*Math.cos(a),z1=-28-9*Math.sin(a),x2=8*Math.cos(b),z2=-28-9*Math.sin(b);
    const x=(x1+x2)/2,z=(z1+z2)/2,length=Math.hypot(x2-x1,z2-z1)+.04;
    for(const [y,h,m] of [[5.35,10.7,cream],[.35,.7,black],[9.7,.12,gold]]){
      const segment=box(length,h,.3,x,y,z,m);segment.rotation.y=-Math.atan2(z2-z1,x2-x1);
    }
  }
  // Dallage sobre et allée centrale : la zone arrondie reste en marbre crème.
  for(let z=-18;z>=-30;z-=2){box(2.6,.022,1.94,0,.015,z,white);for(const side of [-1,1])box(.065,.03,1.97,side*1.39,.02,z,black);}
  for(const z of [-18.7,-30.2])box(14.8,.025,.12,0,.025,z,stone);
  // Voûte en berceau au-dessus de la nef, prolongée par une demi-coupole.
  const vaultMaterial=stone.clone();vaultMaterial.side=THREE.DoubleSide;
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
    box(.22,8.5,.44,side*7.67,4.25,z,stone);box(.38,.18,.64,side*7.6,8.6,z,gold);
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
    const material=new THREE.MeshStandardMaterial({map:texture,emissive:'#e6c98b',emissiveMap:texture,emissiveIntensity:.55,roughness:.5});
    const window=new THREE.Mesh(new THREE.PlaneGeometry(1.55,3.4),material);window.rotation.y=-side*Math.PI/2;window.position.set(x,6.5,z);window.name='chapel-stained-glass';chapel.add(window);
    for(const dz of [-.84,.84])box(.16,3.6,.1,x-side*.08,6.5,z+dz,stone);
    for(const y of [4.72,8.28])box(.16,.12,1.8,x-side*.08,y,z,gold);
    if(index===1){const light=new THREE.SpotLight(side>0?'#e2bc83':'#a7c4cd',40,15,.47,.8,1.5);light.position.set(x-side*.3,6.2,z);light.target.position.set(side*1.8,.1,z+2);scene.add(light,light.target);}
    for(let p=0;p<4;p++){
      const patch=new THREE.Mesh(new THREE.PlaneGeometry(.75,2.8),new THREE.MeshBasicMaterial({color:['#7f9dae','#b48660','#9e7870','#94a386'][p],transparent:true,opacity:.2,depthWrite:false}));
      patch.rotation.set(-Math.PI/2,0,-side*.45);patch.position.set(side*(3.8+p*.65),.045,z+1.1+p*.24);chapel.add(patch);
    }
    const beamGeometry=new THREE.BufferGeometry();beamGeometry.setAttribute('position',new THREE.Float32BufferAttribute([x,7.7,z-.65,x,7.7,z+.65,side*2.2,.07,z+3, x,7.7,z-.65,side*2.2,.07,z+3,side*3.7,.07,z+1.1],3));beamGeometry.computeVertexNormals();
    const beam=new THREE.Mesh(beamGeometry,new THREE.MeshBasicMaterial({color:'#d5c5a0',transparent:true,opacity:.035,side:THREE.DoubleSide,depthWrite:false}));chapel.add(beam);
  }
  // Estrade de la chaire, laissant une allée devant elle.
  box(7.4,.18,4.8,0,.12,-33.4,gray);box(6.7,.22,4.3,0,.3,-33.55,cream);box(6,.2,3.8,0,.51,-33.7,stone);
  obstacles.push({x:0,z:-33.5,hx:4,hz:2.9});
  const chair=new THREE.Group();chair.name='cathedra-petri';chair.userData.palette='bronze sombre, or ancien, ivoire et ambre';chair.position.set(0,.63,-33.8);chapel.add(chair);
  const cbox=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;chair.add(mesh);return mesh;};
  // Le trône est une interprétation du reliquaire en bronze de Bernin.
  for(const x of [-.95,.95])for(const z of [-.5,.5])cbox(.24,1.25,.24,x,.94,z,chairBronze);
  cbox(2.35,.3,1.65,0,1.65,0,chairBronze);cbox(1.75,.12,1.25,0,1.86,.05,mat('#704734'));
  cbox(2.05,2.12,.28,0,2.77,-.65,chairBronze);cbox(1.6,1.67,.06,0,2.78,-.48,chairGold);cbox(1.35,1.43,.07,0,2.78,-.43,chairBronze);
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
  // Gloire dorée et fenêtre ambrée avec colombe, marqueurs visuels de la chaire.
  const glory=new THREE.Group();glory.name='cathedra-glory';glory.position.set(0,7.45,-36.58);chapel.add(glory);
  const amber=new THREE.Mesh(new THREE.CircleGeometry(1.02,48),new THREE.MeshBasicMaterial({color:'#d7b365'}));amber.scale.y=1.3;amber.position.z=.12;glory.add(amber);
  for(const radius of [1.07,1.17]){const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,.06,6,48),chairGold);rim.scale.y=1.3;rim.position.z=.17;glory.add(rim);}
  for(let i=0;i<36;i++){
    const a=i*Math.PI/18,length=.65+(i%3)*.2;
    const ray=new THREE.Mesh(new THREE.ConeGeometry(.075,length,4),chairGold);ray.position.set(Math.sin(a)*(1.65+length*.35),Math.cos(a)*(1.9+length*.35),0);ray.rotation.z=-a;glory.add(ray);
    if(i%3===0){const cloud=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,0),chairGold);cloud.position.set(Math.sin(a)*1.38,Math.cos(a)*1.62,.05);cloud.scale.set(1.3,.65,.5);glory.add(cloud);}
  }
  const doveShape=new THREE.Shape();doveShape.moveTo(0,-.35);doveShape.lineTo(-.16,-.05);doveShape.quadraticCurveTo(-.67,.14,-.72,.48);doveShape.quadraticCurveTo(-.26,.32,0,.12);doveShape.quadraticCurveTo(.26,.32,.72,.48);doveShape.quadraticCurveTo(.67,.14,.16,-.05);doveShape.closePath();
  const dove=new THREE.Mesh(new THREE.ShapeGeometry(doveShape),new THREE.MeshBasicMaterial({color:'#fff0cf'}));dove.position.z=.2;glory.add(dove);
  const glow=new THREE.PointLight('#f3d19a',32,13,1.6);glow.position.set(0,7,-34.5);scene.add(glow);
  const focus=new THREE.SpotLight('#ffe4b9',100,24,.52,.8,1.5);focus.position.set(0,10,-28);focus.target.position.set(0,2.5,-33.8);scene.add(focus,focus.target);
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
  return {allowed};
}
