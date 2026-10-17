import * as THREE from 'three';

export function createExterior({scene,mat,cream,stone,gold,gray}){
  const group=new THREE.Group();group.name='vatican-exterior';scene.add(group);
  const roof=mat('#777d7b'),paving=mat('#b4aca0'),shadow=mat('#565b58'),water=mat('#739a9b',.25),bronze=mat('#514c3e');
  const add=(g,m,x,y,z,parent=group)=>{const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  const box=(w,h,d,x,y,z,m,parent)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
  const cyl=(rt,rb,h,x,y,z,m,n=16,parent)=>add(new THREE.CylinderGeometry(rt,rb,h,n),m,x,y,z,parent);
  // Porte de la galerie : un passage continu, sans téléportation.
  const door=new THREE.Group();door.name='exterior-door';group.add(door);
  for(const x of [3.88,7.12]){box(.24,5.6,.7,x,2.8,13,cream,door);box(.07,5.6,.08,x,2.8,12.6,gold,door);}
  box(3.5,.28,.75,5.5,5.65,13,cream,door);
  for(const side of [-1,1]){const leaf=box(.16,5.25,1.4,5.5+side*1.45,2.65,13.7,bronze,door);for(const y of [1,2.6,4.2])box(.04,1.1,1.1,leaf.position.x-side*.09,y,13.7,gold,door);}
  box(14,.3,7,3.5,-.17,16.5,cream);
  for(let i=0;i<8;i++)box(60,.25,1,0,-.125-i*.25,20+i*.85,cream).name='vatican-steps';
  const plaza=add(new THREE.CircleGeometry(1,96),paving,0,-2.03,66);plaza.rotation.x=-Math.PI/2;plaza.scale.set(47,43,1);plaza.name='saint-peter-square';
  box(63,.15,14,0,-2.12,27,paving);
  // Rayons de pierre et anneaux du pavage, matériaux sobres.
  for(let i=0;i<24;i++){
    const a=i*Math.PI/12,points=[];for(const r of [5,39])points.push(new THREE.Vector3(Math.sin(a)*r,-1.99,66+Math.cos(a)*r*.9));
    const line=new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(...points),1,.055,4,false),cream);group.add(line);
  }
  for(const r of [8,20,34]){const ring=add(new THREE.TorusGeometry(r,.075,4,96),cream,0,-1.97,66);ring.rotation.x=-Math.PI/2;ring.scale.y=.9;}
  const obelisk=new THREE.Group();obelisk.name='vatican-obelisk';group.add(obelisk);
  box(3,.8,3,0,-1.6,66,gray,obelisk);box(1.8,1.7,1.8,0,-.4,66,stone,obelisk);cyl(.25,.67,14,0,7.4,66,stone,4,obelisk);
  cyl(0,.35,1,0,14.9,66,stone,4,obelisk);box(.09,1,.09,0,15.9,66,gold,obelisk);box(.55,.09,.09,0,16.1,66,gold,obelisk);
  for(const x of [-15,15]){
    const fountain=new THREE.Group();fountain.name='square-fountain';group.add(fountain);
    cyl(2.5,2.7,.4,x,-1.7,66,cream,32,fountain);cyl(2.3,2.3,.07,x,-1.46,66,water,32,fountain);
    cyl(.35,.6,2.8,x,-.1,66,stone,16,fountain);cyl(1.5,.45,.35,x,1.3,66,cream,24,fountain);cyl(1.3,1.3,.04,x,1.5,66,water,24,fountain);
    cyl(.08,.15,1.2,x,2.1,66,water,10,fountain);
  }
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
  box(34,5,1.3,-13,2.5,17,cream,basilica);box(23,5,1.3,18.5,2.5,17,cream,basilica);box(60,18,1.3,0,14,17,cream,basilica);
  for(const y of [.25,9.1,18.4,19,23.3]){box(61.2,.32,2,0,y,17.35,warm,basilica);box(61.6,.12,2.3,0,y+.24,17.45,cream,basilica);}
  for(const [index,x] of [-24,-12,0,12,24].entries()){
    const portal=new THREE.Group();portal.name='basilica-arched-portal';basilica.add(portal);
    box(3.8,5.5,.1,x,2.9,17.73,recess,portal);
    const tympanum=add(new THREE.CircleGeometry(1.9,24,0,Math.PI),recess,x,5.65,17.74,portal);
    arch(x,5.65,17.95,1.97,warm,.24,portal);
    for(const dx of [-2.06,2.06])box(.28,5.7,.38,x+dx,2.85,17.95,warm,portal);
    box(2.75,4.7,.12,x,2.52,17.85,index===2?burgundy:bronze,portal);
    for(const dx of [-1.28,0,1.28])box(.045,4.65,.05,x+dx,2.52,17.96,gold,portal);
    for(const y of [1.1,2.5,3.9])box(2.6,.045,.05,x,y,17.96,gold,portal);
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
  box(2.3,4.2,.1,0,13.7,18.3,burgundy,basilica);for(const x of [-1.13,1.13])box(.045,4.2,.03,x,13.7,18.38,gold,basilica);
  box(.08,1.2,.04,0,13.7,18.42,gold,basilica);box(.7,.08,.04,0,13.9,18.42,gold,basilica);
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
  box(29,8,43,0,16,-5,cream,basilica);box(34,2,46,0,20.5,-5,roof,basilica);
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
  for(const x of [-20,20]){cyl(2,2.2,2.5,x,24,-3,cream,16,basilica);const cupola=add(new THREE.SphereGeometry(1,20,12,0,Math.PI*2,0,Math.PI/2),lead,x,25.25,-3,basilica);cupola.scale.set(2.3,3.6,2.3);cyl(.2,.4,1,x,29.3,-3,gold,8,basilica);}
  const groundAt=z=>z<20?0:z<26.8?-.25*Math.min(8,Math.floor((z-20)/.85)+1):-2;
  function allowed(x,z){
    if(z<20)return Math.abs(x-5.5)<1.18&&z>11.8;
    if(z<34)return Math.abs(x)<28;
    if((x/40)**2+((z-66)/39)**2>1||z<27)return false;
    if(Math.hypot(x,z-66)<2.1||[-15,15].some(fx=>Math.hypot(x-fx,z-66)<3))return false;
    return true;
  }
  return {allowed,groundAt};
}
