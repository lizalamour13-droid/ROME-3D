import * as THREE from 'three';
import {createExteriorCity} from './exterior-city.js';

export function createExterior({scene,mat,cream,stone,gold,gray}){
  const group=new THREE.Group();group.name='vatican-exterior';scene.add(group);
  const roof=mat('#777d7b'),paving=mat('#292d31',.88),shadow=mat('#565b58'),water=mat('#739a9b',.25),bronze=mat('#514c3e');
  const add=(g,m,x,y,z,parent=group)=>{const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  const box=(w,h,d,x,y,z,m,parent)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
  const cyl=(rt,rb,h,x,y,z,m,n=16,parent)=>add(new THREE.CylinderGeometry(rt,rb,h,n),m,x,y,z,parent);
  // Porte de la galerie : un passage continu, sans téléportation.
  const centralDoor=new THREE.Group();centralDoor.name='central-entry-door';group.add(centralDoor);
  for(const x of [-2.72,2.72]){box(.28,6.5,.7,x,3.25,13,cream,centralDoor);box(.055,6.35,.08,x,3.25,12.6,gold,centralDoor);box(.3,6.4,4,x,3.2,15,cream,centralDoor);}
  box(5.8,.3,4.5,0,6.6,15,cream,centralDoor);box(5.8,.2,4.5,0,-.1,15.2,cream,centralDoor);
  box(14,.3,7,3.5,-.17,16.5,cream);
  for(let i=0;i<8;i++)box(60,.25,1,0,-.125-i*.25,20+i*.85,cream).name='vatican-steps';
  const plaza=add(new THREE.CircleGeometry(1,96),paving,0,-2.03,66);plaza.rotation.x=-Math.PI/2;plaza.scale.set(47,43,1);plaza.name='saint-peter-square';
  box(63,.15,14,0,-2.12,27,paving);
  // Le terrain extérieur ne doit pas traverser le puits ni le sous-sol de la basilique.
  const terrainShape=new THREE.Shape();terrainShape.absarc(0,0,125,0,Math.PI*2,false);
  const basementHole=new THREE.Path();basementHole.moveTo(-1.4,74.5);basementHole.lineTo(9.5,74.5);basementHole.lineTo(9.5,87);basementHole.lineTo(-1.4,87);basementHole.closePath();terrainShape.holes.push(basementHole);
  const terrain=add(new THREE.ShapeGeometry(terrainShape,64),mat('#929775'),0,-2.25,45);terrain.rotation.x=-Math.PI/2;terrain.name='exterior-surrounding-ground';
  // Pavés sombres à joints fins : texture locale et motifs de pierre gris clair.
  const pavementCanvas=document.createElement('canvas');pavementCanvas.width=512;pavementCanvas.height=512;
  const pavementContext=pavementCanvas.getContext('2d');pavementContext.fillStyle='#171b1e';pavementContext.fillRect(0,0,512,512);
  const paverColors=['#343b40','#42474b','#30363b','#3b4145','#2c3237'];
  for(let row=0;row<16;row++)for(let col=-1;col<9;col++){const x=col*64+(row%2)*32;pavementContext.fillStyle=paverColors[((col+9)*3+row*7)%5];pavementContext.fillRect(x+1,row*32+1,61,29);}
  const pavementTexture=new THREE.CanvasTexture(pavementCanvas);pavementTexture.colorSpace=THREE.SRGBColorSpace;pavementTexture.wrapS=pavementTexture.wrapT=THREE.RepeatWrapping;pavementTexture.repeat.set(22,22);paving.map=pavementTexture;paving.color.set('#ffffff');paving.needsUpdate=true;
  const motifStone=mat('#8a9090');
  const diamonds=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),mat('#656d72'),24);diamonds.name='square-stone-patterns';const patternDummy=new THREE.Object3D();
  for(let i=0;i<24;i++){const a=i*Math.PI/12;patternDummy.position.set(Math.sin(a)*27,-1.955,66+Math.cos(a)*24.3);patternDummy.rotation.y=a+Math.PI/4;patternDummy.scale.set(1.2,.025,1.2);patternDummy.updateMatrix();diamonds.setMatrixAt(i,patternDummy.matrix);}group.add(diamonds);
  // Rayons de pierre et anneaux du pavage, matériaux sobres.
  for(let i=0;i<24;i++){
    const a=i*Math.PI/12,points=[];for(const r of [5,39])points.push(new THREE.Vector3(Math.sin(a)*r,-1.99,66+Math.cos(a)*r*.9));
    const line=new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(...points),1,.055,4,false),motifStone);group.add(line);
  }
  for(const r of [8,20,34]){const ring=add(new THREE.TorusGeometry(r,.075,4,96),motifStone,0,-1.97,66);ring.rotation.x=-Math.PI/2;ring.scale.y=.9;}
  const obelisk=new THREE.Group();obelisk.name='vatican-obelisk';group.add(obelisk);
  box(3,.8,3,0,-1.6,66,gray,obelisk);box(1.8,1.7,1.8,0,-.4,66,stone,obelisk);cyl(.25,.67,14,0,7.4,66,stone,4,obelisk);
  cyl(0,.35,1,0,14.9,66,stone,4,obelisk);box(.09,1,.09,0,15.9,66,gold,obelisk);box(.55,.09,.09,0,16.1,66,gold,obelisk);
  const waterJets=[];
  const jetMaterial=new THREE.MeshStandardMaterial({color:'#a8d6de',transparent:true,opacity:.7,roughness:.2,depthWrite:false});
  for(const x of [-15,15]){
    const fountain=new THREE.Group();fountain.name='square-fountain';group.add(fountain);
    cyl(2.5,2.7,.4,x,-1.7,66,cream,32,fountain);cyl(2.3,2.3,.07,x,-1.46,66,water,32,fountain);
    cyl(.35,.6,2.8,x,-.1,66,stone,16,fountain);cyl(1.5,.45,.35,x,1.3,66,cream,24,fountain);cyl(1.3,1.3,.04,x,1.5,66,water,24,fountain);
    cyl(.08,.15,1.9,x,2.45,66,jetMaterial,10,fountain);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6,points=[];
      for(let j=0;j<=20;j++){const t=j/20;points.push(new THREE.Vector3(x+Math.cos(a)*2.05*t,1.55+2.1*t-5.05*t*t,66+Math.sin(a)*2.05*t));}
      const jet=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),24,.035,5,false),jetMaterial);jet.name='fountain-water-jet';fountain.add(jet);
    }
    for(let i=0;i<12;i++){const drop=add(new THREE.SphereGeometry(.065,6,4),jetMaterial,x,0,66,fountain);waterJets.push({mesh:drop,x,phase:i/12*Math.PI*2,offset:i/12});}
    const rim=add(new THREE.TorusGeometry(2.5,.11,6,40),cream,x,-1.42,66,fountain);rim.rotation.x=Math.PI/2;

  }
  // Éclaboussures au pied des jets : une seule géométrie de points pour les deux bassins.
  const splashPositions=new Float32Array(160*3),splashGeometry=new THREE.BufferGeometry();splashGeometry.setAttribute('position',new THREE.BufferAttribute(splashPositions,3).setUsage(THREE.DynamicDrawUsage));
  const splashes=new THREE.Points(splashGeometry,new THREE.PointsMaterial({color:'#c6e9ed',size:.065,transparent:true,opacity:.7,depthWrite:false}));splashes.name='fountain-splashes';splashes.frustumCulled=false;group.add(splashes);
  // Deux bras elliptiques à doubles rangs de colonnes, instanciées.
  const columns=new THREE.InstancedMesh(new THREE.CylinderGeometry(.34,.43,6,10),cream,192);columns.name='exterior-colonnades';const dummy=new THREE.Object3D();let index=0;
  for(const side of [-1,1])for(const row of [0,1.8])for(let i=0;i<48;i++){
    const a=-1.24+i/47*2.48,x=side*(42+row)*Math.cos(a),z=66+(35+row)*Math.sin(a);
    dummy.position.set(x,1.05,z);dummy.updateMatrix();columns.setMatrixAt(index++,dummy.matrix);
  }
  group.add(columns);
  for(const side of [-1,1])for(let i=0;i<47;i++){
    const a=-1.24+i/47*2.48,b=-1.24+(i+1)/47*2.48,x1=side*43*Math.cos(a),z1=66+36*Math.sin(a),x2=side*43*Math.cos(b),z2=66+36*Math.sin(b);
    for(const y of [-1.85,4.3]){const beam=box(Math.hypot(x2-x1,z2-z1)+.1,.5,3.3,(x1+x2)/2,y,(z1+z2)/2,cream);beam.rotation.y=-Math.atan2(z2-z1,x2-x1);}
    if(i%3===0){cyl(.17,.25,.9,x1,5.05,z1,cream,8);add(new THREE.SphereGeometry(.17,8,6),cream,x1,5.65,z1);}
  }
  // Façade de Saint-Pierre : cinq travées, ordre colossal, attique et balustrade.
  const basilica=new THREE.Group();basilica.name='saint-peter-basilica';group.add(basilica);
  const warm=mat('#cbb797'),recess=mat('#363d40'),burgundy=mat('#702c39'),lead=mat('#697e8b',.55,.15);
  const arch=(x,y,z,r,m,width=.16,parent=basilica)=>{
    const points=[];for(let i=0;i<=32;i++){const a=i*Math.PI/32;points.push(new THREE.Vector3(x+r*Math.cos(a),y+r*Math.sin(a),z));}
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,width,6,false),m);parent.add(mesh);return mesh;
  };
  const triangle=(x,y,z,w,h,m)=>{const shape=new THREE.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(0,h);shape.closePath();return add(new THREE.ExtrudeGeometry(shape,{depth:.25,bevelEnabled:false}),m,x,y,z,basilica);};
  box(27.5,5,1.3,-16.25,2.5,17,cream,basilica);box(27.5,5,1.3,16.25,2.5,17,cream,basilica);
  box(60,16.3,1.3,0,14.85,17,cream,basilica);for(const x of [-16.25,16.25])box(27.5,1.7,1.3,x,5.85,17,cream,basilica);
  for(const y of [.25,9.1,18.4,19,23.3]){box(61.2,.32,2,0,y,17.35,warm,basilica);box(61.6,.12,2.3,0,y+.24,17.45,cream,basilica);}
  for(const [index,x] of [-24,-12,0,12,24].entries()){
    const portal=new THREE.Group();portal.name='basilica-arched-portal';basilica.add(portal);
    if(index===2){
      arch(0,6.45,17.95,2.6,warm,.25,portal);
      add(new THREE.CircleGeometry(2.45,32,0,Math.PI),recess,0,6.45,17.75,portal);
      for(const side of [-1,1]){
        box(.3,6.5,.4,side*2.62,3.25,17.95,warm,portal);
        const leaf=new THREE.Group();leaf.name='central-open-door-leaf';leaf.position.set(side*2.45,0,17.95);leaf.rotation.y=side*Math.PI*.43;portal.add(leaf);
        box(2.45,6.2,.18,-side*1.225,3.15,0,bronze,leaf);
        for(const y of [1.15,3.15,5.15]){box(2.05,1.65,.08,-side*1.225,y,.14,burgundy,leaf);for(const dx of [-1,1])box(.055,1.7,.045,-side*1.225+dx,y,.2,gold,leaf);for(const dy of [-.83,.83])box(2.08,.055,.045,-side*1.225,y+dy,.2,gold,leaf);}
        box(.08,.5,.1,-side*2.1,3,.24,gold,leaf);
      }
    }else{
    box(3.8,5.5,.1,x,2.9,17.73,recess,portal);
    const tympanum=add(new THREE.CircleGeometry(1.9,24,0,Math.PI),recess,x,5.65,17.74,portal);
    arch(x,5.65,17.95,1.97,warm,.24,portal);
    for(const dx of [-2.06,2.06])box(.28,5.7,.38,x+dx,2.85,17.95,warm,portal);
    box(2.75,4.7,.12,x,2.52,17.85,index===2?burgundy:bronze,portal);
    for(const dx of [-1.28,0,1.28])box(.045,4.65,.05,x+dx,2.52,17.96,gold,portal);
    for(const y of [1.1,2.5,3.9])box(2.6,.045,.05,x,y,17.96,gold,portal);
    }
    // Fenêtres cintrées et frontons entre les colonnes, non cachées derrière elles.
    box(2.4,3.5,.12,x,12.25,17.75,recess,basilica);arch(x,14,17.9,1.2,warm,.14);
    for(const dx of [-1.35,1.35])box(.22,3.85,.35,x+dx,12.2,17.92,warm,basilica);
    box(.065,3.4,.09,x,12.25,17.9,warm,basilica);box(2.4,.06,.09,x,12.5,17.9,warm,basilica);
    triangle(x,15.5,17.8,4.2,1.2,warm);box(4.5,.18,.5,x,15.45,18,cream,basilica);
    for(const dx of [-3.9,3.9]){
      const col=new THREE.Group();col.name='basilica-colossal-column';basilica.add(col);
      box(1.7,1.1,1.45,x+dx,.65,18.2,warm,col);cyl(.5,.64,15.1,x+dx,8.75,18.3,cream,16,col);
      for(const y of [1.25,16.25])cyl(.72,.72,.25,x+dx,y,18.3,warm,16,col);
      box(1.65,.5,1.5,x+dx,16.65,18.3,cream,col);
      for(const sx of [-.48,.48]){const volute=add(new THREE.TorusGeometry(.19,.07,5,12),warm,x+dx+sx,16.35,19,col);}
    }
    // Attique : panneaux, fenêtres carrées et corniche supérieure.
    box(3.8,2.2,.08,x,21.2,17.77,warm,basilica);box(2.8,1.5,.09,x,21.2,17.84,cream,basilica);box(1.2,.95,.1,x,21.2,17.94,recess,basilica);
  }
  // Loggia centrale et tenture papale.
  box(5.2,.4,1.8,0,10.15,18.1,warm,basilica);
  for(let i=0;i<10;i++)cyl(.06,.09,.85,-2.2+i*.49,10.8,18.9,cream,6,basilica);
  box(5.5,.15,.45,0,11.3,18.9,cream,basilica);
  // Drapeau carré du Vatican : jaune / blanc, clefs croisées et tiare dessinées localement.
  const flagCanvas=document.createElement('canvas');flagCanvas.width=512;flagCanvas.height=512;const fc=flagCanvas.getContext('2d');fc.fillStyle='#ddbd43';fc.fillRect(0,0,256,512);fc.fillStyle='#f4efdf';fc.fillRect(256,0,256,512);
  for(const [angle,color] of [[-.65,'#b69a4f'],[.65,'#a7a9a5']]){
    fc.save();fc.translate(384,277);fc.rotate(angle);fc.strokeStyle=color;fc.lineWidth=11;fc.beginPath();fc.arc(0,-64,22,0,Math.PI*2);fc.stroke();fc.fillStyle=color;fc.fillRect(-5,-42,10,127);fc.fillRect(-5,65,35,11);fc.fillRect(19,65,11,28);fc.restore();
  }
  fc.strokeStyle='#954738';fc.lineWidth=6;fc.beginPath();fc.moveTo(346,335);fc.bezierCurveTo(320,375,440,375,420,335);fc.stroke();
  fc.fillStyle='#d1bf88';fc.beginPath();fc.moveTo(353,219);fc.lineTo(360,174);fc.quadraticCurveTo(384,132,408,174);fc.lineTo(415,219);fc.closePath();fc.fill();
  for(const y of [177,194,211]){fc.fillStyle='#b59a4f';fc.fillRect(353,y,62,7);fc.fillStyle='#efe9d3';for(let x=359;x<413;x+=12)fc.fillRect(x,y+1,4,4);}
  fc.fillStyle='#b59a4f';fc.fillRect(381,137,6,26);fc.fillRect(373,144,22,5);
  const flagTexture=new THREE.CanvasTexture(flagCanvas);flagTexture.colorSpace=THREE.SRGBColorSpace;
  const flagGeometry=new THREE.PlaneGeometry(3.4,3.4,16,12),flag=new THREE.Mesh(flagGeometry,new THREE.MeshStandardMaterial({map:flagTexture,side:THREE.DoubleSide,roughness:.95}));flag.name='vatican-entrance-flag';flag.scale.setScalar(.65);flag.position.set(5.75,9.55,20.15);basilica.add(flag);
  const flagWood=mat('#71543a');const pole=cyl(.055,.075,5.3,4.6,8.1,20.15,flagWood,10,basilica);pole.name='vatican-wooden-flagpole';
  add(new THREE.SphereGeometry(.09,8,6),gold,4.6,10.8,20.15,basilica);
  for(const y of [6.15,7.2])box(.2,.12,2.2,4.6,y,19.15,bronze,basilica);
  triangle(0,18.6,18,18,3.5,warm);triangle(0,19,18.3,14.9,2.6,cream);
  const crest=add(new THREE.TorusGeometry(.7,.14,6,24),gold,0,20,18.65,basilica);
  // Dédicace locale, sans texture externe.
  const inscriptionCanvas=document.createElement('canvas');inscriptionCanvas.width=2048;inscriptionCanvas.height=96;
  const context=inscriptionCanvas.getContext('2d');context.fillStyle='#d8c8a8';context.fillRect(0,0,2048,96);context.fillStyle='#655440';context.font='38px Georgia';context.textAlign='center';context.fillText('IN HONOREM PRINCIPIS APOSTOLORVM · PAVLVS V BVRGHESIVS',1024,64);
  const inscriptionTexture=new THREE.CanvasTexture(inscriptionCanvas);inscriptionTexture.colorSpace=THREE.SRGBColorSpace;
  add(new THREE.PlaneGeometry(52,.9),new THREE.MeshStandardMaterial({map:inscriptionTexture,roughness:1}),0,17.8,18.6,basilica);
  // Balustrade et treize silhouettes de saints sur l'attique.
  for(let i=0;i<61;i++)cyl(.055,.095,.95,-30+i,24.05,17.9,cream,6,basilica);
  for(const y of [23.55,24.6])box(62,.22,1.1,0,y,17.8,warm,basilica);
  for(let i=0;i<13;i++){
    const x=-28+i*56/12,g=new THREE.Group();g.name='basilica-roof-saint';g.position.set(x,24.75,17.9);basilica.add(g);
    box(.8,.35,.8,0,.1,0,warm,g);cyl(.18,.4,1.45,0,1,0,cream,10,g);add(new THREE.SphereGeometry(.23,10,7),cream,0,1.98,0,g);
    for(const side of [-1,1]){const arm=box(.14,.8,.16,side*.34,1.36,.03,cream,g);arm.rotation.z=side*(i%2?.5:-.3);}
    if(i%3===0){box(.05,2.4,.05,.55,1.5,0,warm,g);box(.6,.05,.05,.55,2.3,0,warm,g);}
  }
  for(const x of [-27,27]){const clock=add(new THREE.CircleGeometry(1.2,32),cream,x,24.5,18.5,basilica);add(new THREE.TorusGeometry(1.2,.12,6,32),warm,x,24.5,18.55,basilica);box(.055,.8,.06,x,24.8,18.6,shadow,basilica);box(.65,.055,.06,x+.3,24.5,18.6,shadow,basilica);}
  // Coupole haute à tambour rythmé, nervures, oculi et lanterne.
  // Enveloppe creuse : le volume extérieur ne doit pas boucher la coupole intérieure.
  for(const x of [-14.5,14.5])box(1,8,49,x,16,-8,cream,basilica);
  box(30,8,1,0,16,-32.5,cream,basilica);box(34,2,52,0,20.5,-8,roof,basilica);
  const domeGroup=new THREE.Group();domeGroup.name='basilica-great-dome';basilica.add(domeGroup);
  cyl(9,9.6,9,0,27.5,-2,cream,48,domeGroup);
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8,g=new THREE.Group();g.position.set(9.1*Math.cos(a),27.8,-2+9.1*Math.sin(a));g.rotation.y=Math.PI/2-a;domeGroup.add(g);
    box(1.3,4.7,.15,0,0,0,recess,g);for(const x of [-.85,.85])cyl(.16,.22,6.9,x,0,.24,cream,8,g);box(2.3,.2,.5,0,3.5,.2,warm,g);
  }
  for(const y of [23.2,31.7])cyl(9.8,9.8,.45,0,y,-2,warm,48,domeGroup);
  const dome=add(new THREE.SphereGeometry(1,48,28,0,Math.PI*2,0,Math.PI/2),lead,0,32,-2,domeGroup);dome.scale.set(9.6,14,9.6);
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8,points=[];for(let j=0;j<=32;j++){const b=j*Math.PI/64;points.push(new THREE.Vector3(9.65*Math.cos(b)*Math.cos(a),32+14.05*Math.sin(b),-2+9.65*Math.cos(b)*Math.sin(a)));}
    domeGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),36,.12,6,false),warm));
    const b=.36,g=new THREE.Group();g.position.set(9.67*Math.cos(b)*Math.cos(a),32+14.07*Math.sin(b),-2+9.67*Math.cos(b)*Math.sin(a));g.rotation.y=Math.PI/2-a;domeGroup.add(g);
    add(new THREE.SphereGeometry(.29,10,7),warm,0,0,0,g);add(new THREE.SphereGeometry(.18,8,6),shadow,0,0,.14,g);
  }
  cyl(1.35,1.65,3.5,0,47.5,-2,cream,16,domeGroup);cyl(0,1.7,2.2,0,50.3,-2,lead,16,domeGroup);box(.12,2,.12,0,52.1,-2,gold,domeGroup);box(1,.12,.12,0,52.5,-2,gold,domeGroup);
  // Deux coupoles latérales dégagées au-dessus de l’attique, puis les chapelles en retrait.
  function secondaryDome(x,z,r,base,rise,role){
    const group=new THREE.Group();group.name='basilica-secondary-dome';group.userData.role=role;basilica.add(group);
    cyl(r*.91,r,3.6,x,base-1.8,z,cream,24,group);
    for(const y of [base-3.5,base])cyl(r*1.04,r*1.04,.22,x,y,z,warm,24,group);
    for(let i=0;i<10;i++){
      const a=i*Math.PI/5,window=new THREE.Group();window.position.set(x+Math.cos(a)*r*.92,base-1.8,z+Math.sin(a)*r*.92);window.rotation.y=Math.PI/2-a;group.add(window);
      box(.43,1.7,.06,0,0,0,recess,window);for(const dx of [-.29,.29])box(.1,1.9,.13,dx,0,.05,warm,window);
    }
    const dome=add(new THREE.SphereGeometry(1,28,16,0,Math.PI*2,0,Math.PI/2),lead,x,base,z,group);dome.scale.set(r,rise,r);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6,points=[];for(let j=0;j<=20;j++){const b=j*Math.PI/40;points.push(new THREE.Vector3(x+(r+.025)*Math.cos(b)*Math.cos(a),base+(rise+.03)*Math.sin(b),z+(r+.025)*Math.cos(b)*Math.sin(a)));}
      group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.045,5,false),warm));
    }
    cyl(.35,.45,1.15,x,base+rise+.5,z,cream,12,group);cyl(0,.48,.65,x,base+rise+1.4,z,lead,12,group);
    box(.055,.8,.055,x,base+rise+2.05,z,gold,group);box(.38,.055,.055,x,base+rise+2.2,z,gold,group);
  }
  for(const side of [-1,1]){
    secondaryDome(side*18,3,3.3,27.3,7.1,'coupole latérale principale');
    for(const [z,base] of [[-17,25.8],[-29,25.2]])secondaryDome(side*12.8,z,2.35,base,4.4,'coupole de chapelle');
  }
  // Verdure en périphérie : l'axe de visite et les monuments restent accessibles.
  const greenery=new THREE.Group();greenery.name='square-greenery';group.add(greenery);
  const leaves=[mat('#496b40'),mat('#68814c'),mat('#38583b')],trunk=mat('#74604b'),flowers=[mat('#a34d50'),mat('#c6a75f')];
  const planters=[];
  for(const side of [-1,1])for(const z of [38,49,83,94]){
    const x=side*(z===38||z===94?23:31);planters.push({x,z});
    box(2.2,.9,2.2,x,-1.55,z,stone,greenery);box(2.4,.16,2.4,x,-1.04,z,cream,greenery);
    for(let i=0;i<5;i++){
      const a=i*Math.PI*.4;const bush=add(new THREE.IcosahedronGeometry(.75,1),leaves[i%3],x+Math.cos(a)*.45,-.55,z+Math.sin(a)*.45,greenery);bush.scale.y=.8;
      add(new THREE.IcosahedronGeometry(.16,0),flowers[i%2],x+Math.cos(a)*.8,-.1,z+Math.sin(a)*.8,greenery);
    }
  }
  // Pins parasols derrière les colonnades, silhouettes méditerranéennes sobres.
  for(const side of [-1,1])for(const z of [35,48,63,79,94]){
    const x=side*(z===35||z===94?36:48);
    cyl(.35,.55,7,x,1.4,z,trunk,10,greenery);
    for(let i=0;i<5;i++){const a=i*Math.PI*.4;const canopy=add(new THREE.IcosahedronGeometry(2.4,1),leaves[i%3],x+Math.cos(a)*1.5,5.2+(i%2)*.4,z+Math.sin(a)*1.5,greenery);canopy.scale.y=.55;}
  }
  // Oiseaux articulés : trajectoires elliptiques et battements d'ailes.
  const flock=new THREE.Group();flock.name='square-flying-birds';group.add(flock);const birds=[];
  const feather=mat('#e0ded3'),wingTip=mat('#696e70');
  for(let i=0;i<10;i++){
    const bird=new THREE.Group();bird.name='flying-bird';flock.add(bird);
    const body=add(new THREE.SphereGeometry(.16,8,6),feather,0,0,0,bird);body.scale.set(.75,.8,1.65);
    add(new THREE.SphereGeometry(.11,8,6),feather,0,.1,.23,bird);const beak=add(new THREE.ConeGeometry(.045,.14,5),stone,0,.09,.37,bird);beak.rotation.x=Math.PI/2;
    const wings=[];
    for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.x=side*.08;bird.add(pivot);const wing=box(.47,.045,.22,side*.22,0,0,feather,pivot);const tip=box(.2,.04,.16,side*.52,0,-.05,wingTip,pivot);wings.push({pivot,side});}
    birds.push({group:bird,wings,phase:i*Math.PI*.2});
  }
  const city=createExteriorCity({parent:group,mat,cream,stone,planters});
  function animate(time,viewer){
    city.animate(time,viewer);
    const cloth=flagGeometry.attributes.position;for(let i=0;i<cloth.count;i++){const free=(cloth.getX(i)+1.7)/3.4;cloth.setZ(i,Math.sin(time*1.4+cloth.getX(i)*2)*.055*free);}cloth.needsUpdate=true;
    for(let i=0;i<160;i++){
      const t=(time*(.7+(i%5)*.06)+i*.137)%1,a=i*2.39996,r=1.9+t*.5,x=i<80?-15:15;
      splashPositions[i*3]=x+Math.cos(a)*r;splashPositions[i*3+1]=-1.4+Math.sin(t*Math.PI)*(.2+(i%4)*.08);splashPositions[i*3+2]=66+Math.sin(a)*r;
    }
    splashGeometry.attributes.position.needsUpdate=true;
    birds.forEach((bird,i)=>{
      const a=time*(.11+i*.004)+bird.phase,rx=17+(i%3)*5,rz=13+(i%2)*7;
      bird.group.position.set(Math.cos(a)*rx,9+(i%4)*1.5+Math.sin(a*2)*1.2,65+Math.sin(a)*rz);
      bird.group.rotation.y=Math.atan2(-rx*Math.sin(a),rz*Math.cos(a));bird.group.rotation.z=Math.sin(a)*.12;
      bird.wings.forEach(({pivot,side})=>pivot.rotation.z=side*Math.sin(time*7+i)*.65);
    });
    waterJets.forEach(({mesh,x,phase,offset})=>{const t=(time*.65+offset)%1;mesh.position.set(x+Math.cos(phase)*2.05*t,1.55+2.1*t-5.05*t*t,66+Math.sin(phase)*2.05*t);});
  }
  const groundAt=z=>z<20?0:z<26.8?-.25*Math.min(8,Math.floor((z-20)/.85)+1):-2;
  function allowed(x,z){
    if(z<20)return Math.abs(x)<2.1&&z>11.8;
    if(z<34)return Math.abs(x)<28;
    if((x/40)**2+((z-66)/39)**2>1||z<27)return false;
    if(city.blocked(x,z))return false;
    if(planters.some(p=>Math.abs(x-p.x)<1.45&&Math.abs(z-p.z)<1.45))return false;
    if(Math.hypot(x,z-66)<2.1||[-15,15].some(fx=>Math.hypot(x-fx,z-66)<3))return false;
    return true;
  }
  return {allowed,groundAt,animate,conversationGain:city.conversationGain};
}
