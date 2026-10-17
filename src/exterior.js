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
  // Façade complète de la basilique, orientée vers la place.
  const basilica=new THREE.Group();basilica.name='saint-peter-basilica';group.add(basilica);
  box(34,5,1.3,-13,2.5,17,cream,basilica);box(23,5,1.3,18.5,2.5,17,cream,basilica);box(60,17,1.3,0,13.5,17,cream,basilica);
  for(const y of [.2,9.5,18,22])box(62,.45,2,0,y,17.1,stone,basilica);
  for(const x of [-27,-21,-15,-9,-3,3,9,15,21,27]){
    cyl(.55,.67,15.5,x,10,18.1,cream,16,basilica);box(1.6,.5,1.4,x,18,18.1,stone,basilica);
    if(Math.abs(x)>10){box(2.5,4,.08,x,5,17.72,shadow,basilica);box(2,3.5,.08,x,13.2,17.74,shadow,basilica);}
    cyl(.22,.38,1.7,x,23,17.2,cream,10,basilica);add(new THREE.SphereGeometry(.25,8,6),cream,x,24.1,17.2,basilica);
  }
  box(7,4,.1,0,13.1,17.8,shadow,basilica);for(const x of [-3.6,3.6])box(.3,4.3,.2,x,13.1,18,stone,basilica);box(8,.5,1.4,0,10.8,18.4,cream,basilica);
  const pediment=new THREE.Shape();pediment.moveTo(-10,0);pediment.lineTo(10,0);pediment.lineTo(0,4.5);pediment.closePath();add(new THREE.ExtrudeGeometry(pediment,{depth:1,bevelEnabled:false}),stone,0,18.3,17.1,basilica);
  // Volumes de la nef et coupole en plomb gris, visibles lorsqu'on se retourne.
  box(29,8,43,0,16,-5,cream,basilica);box(34,2,46,0,20.5,-5,roof,basilica);
  cyl(8,8.7,8,0,25,-8,cream,32,basilica);
  for(let i=0;i<16;i++){const a=i*Math.PI/8;box(.8,4,.8,Math.cos(a)*8.3,25.5,-8+Math.sin(a)*8.3,shadow,basilica);cyl(.2,.24,7.4,Math.cos(a)*8.9,25,-8+Math.sin(a)*8.9,cream,8,basilica);}
  for(const y of [21.5,29])cyl(9,9,.4,0,y,-8,stone,32,basilica);
  const dome=add(new THREE.SphereGeometry(1,40,24,0,Math.PI*2,0,Math.PI/2),roof,0,29,-8,basilica);dome.scale.set(8.8,12,8.8);
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8,points=[];for(let j=0;j<=24;j++){const b=j*Math.PI/48;points.push(new THREE.Vector3(8.85*Math.cos(b)*Math.cos(a),29+12.05*Math.sin(b),-8+8.85*Math.cos(b)*Math.sin(a)));}
    basilica.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.11,5,false),stone));
  }
  cyl(1.2,1.4,3,0,42,-8,cream,12,basilica);cyl(0,1.6,2,0,44.5,-8,roof,16,basilica);box(.12,2,.12,0,46.3,-8,gold,basilica);box(1,.12,.12,0,46.7,-8,gold,basilica);
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
