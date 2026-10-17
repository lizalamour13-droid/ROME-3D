import * as THREE from 'three';

// Petite crypte en pierre claire, inspirée de la référence, sans modifier son accès ouvert.
export function decorateCrypt({crypt,tomb,floor}){
  const root=new THREE.Group();root.name='crypt-reference-architecture';crypt.add(root);
  const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness:.8,metalness});
  const cream=mat('#d4c6af'),pale=mat('#e3d6be'),stone=mat('#8e877c'),gold=mat('#ac8c4d',.45),red=mat('#64313a');
  const cube=new THREE.BoxGeometry(1,1,1);
  function add(g,m,x,y,z,parent=root){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.receiveShadow=true;parent.add(o);return o;}
  function box(w,h,d,x,y,z,m,parent=root){const o=add(cube,m,x,y,z,parent);o.scale.set(w,h,d);return o;}
  function arch(x,y,z,rx,ry,width=.12){const shape=new THREE.Shape();for(let i=0;i<=48;i++){const a=i/48*Math.PI,px=x+(rx+width)*Math.cos(a),py=y+(ry+width)*Math.sin(a);i?shape.lineTo(px,py):shape.moveTo(px,py);}for(let i=48;i>=0;i--){const a=i/48*Math.PI;shape.lineTo(x+rx*Math.cos(a),y+ry*Math.sin(a));}shape.closePath();const o=add(new THREE.ExtrudeGeometry(shape,{depth:.13,bevelEnabled:false,curveSegments:24}),cream,0,0,z);o.name='crypt-stone-arch';return o;}
  // Berceau bas et côtes de pierre ; la partie autour de l’escalier reste ouverte.
  const vertices=[],indices=[];
  for(let j=0;j<=10;j++)for(let i=0;i<=48;i++){const a=i/48*Math.PI;vertices.push(4.42*Math.cos(a),floor+2.05+1.13*Math.sin(a),-41.15+j*.59);if(j<10&&i<48){const k=j*49+i;indices.push(k,k+1,k+49,k+1,k+50,k+49);}}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();const vaultMat=cream.clone();vaultMat.side=THREE.DoubleSide;add(geometry,vaultMat,0,0,0).name='crypt-rounded-vault';
  for(const z of [-40.95,-38.25,-35.45]){
    arch(0,floor+2.03,z,4.28,1.05,.12);
    for(const side of [-1,1]){box(.38,2.05,.38,side*4.3,floor+1.025,z,pale);box(.6,.16,.6,side*4.3,floor+.08,z,cream);for(const [y,w] of [[.25,.5],[1.95,.58],[2.1,.66]])box(w,.12,.55,side*4.3,floor+y,z,y===1.95?gold:cream);}
  }
  // Deux niches de saints en pierre ; les statues occupent le fond, hors des allées.
  for(const side of [-1,1]){
    const x=side*2.85;
    box(1.35,1.85,.08,x,floor+1.36,-41.12,stone);
    arch(x,floor+2.05,-41.01,.65,.64,.1);
    for(const dx of [-.72,.72]){box(.16,2.1,.22,x+dx,floor+1.05,-40.94,cream);box(.23,.09,.28,x+dx,floor+2.02,-40.9,gold);}
    const saint=new THREE.Group();saint.name='crypt-niche-saint';saint.position.set(x,floor+.48,-40.73);root.add(saint);
    box(.62,.16,.43,0,.08,0,cream,saint);add(new THREE.ConeGeometry(.23,1.2,12),pale,0,.8,0,saint);add(new THREE.SphereGeometry(.15,12,8),pale,0,1.55,0,saint);
    add(new THREE.ConeGeometry(.11,.22,9),pale,0,1.39,.1,saint);
    for(const sign of [-1,1]){const arm=box(.09,.45,.13,sign*.21,1.08,.06,pale,saint);arm.rotation.z=sign*.25;}
    box(.035,1.1,.035,side*.23,.95,.16,gold,saint);
    if(side<0){box(.2,.035,.03,side*.23,1.27,.16,gold,saint);}else{box(.25,.33,.07,-.12,1.05,.21,pale,saint);}
    // Lanterne à bougie, vitrage chaud et armature ancienne.
    const lantern=new THREE.Group();lantern.name='crypt-candle-lantern';lantern.position.set(side*4.0,floor+1.7,-37.1);root.add(lantern);
    const glass=new THREE.MeshStandardMaterial({color:'#e6c18c',transparent:true,opacity:.22,roughness:.3});box(.24,.43,.24,0,.1,0,glass,lantern);
    for(const dx of [-.14,.14])for(const dz of [-.14,.14])box(.022,.5,.022,dx,.1,dz,gold,lantern);
    for(const y of [-.17,.37])box(.34,.045,.34,0,y,0,gold,lantern);
    add(new THREE.ConeGeometry(.24,.15,4),gold,0,.46,0,lantern);
    box(.025,.27,.025,0,.65,0,gold,lantern);box(.5,.04,.05,side*.2,.8,0,gold,lantern);
    add(new THREE.CylinderGeometry(.04,.045,.24,8),pale,0,.02,0,lantern);const flame=add(new THREE.SphereGeometry(.04,8,6),new THREE.MeshBasicMaterial({color:'#ffd39a'}),0,.19,0,lantern);flame.scale.y=2;
    const light=new THREE.PointLight('#ffd6a0',9,5,1.8);light.position.set(0,.18,0);light.layers.set(2);lantern.add(light);
  }
  // Marbre clair du tombeau, cadres dorés et médaillon des clefs.
  tomb.traverse(o=>{if(o.isMesh&&o.material?.color?.getHexString()==='252326')o.material=cream;if(o.isMesh&&o.material?.map)o.visible=false;});
  const emblem=new THREE.Group();emblem.name='crypt-tomb-keys';emblem.position.set(0,floor+.64,-38.32);root.add(emblem);
  const disc=add(new THREE.CircleGeometry(.29,32),red,0,0,0,emblem);add(new THREE.TorusGeometry(.29,.02,6,32),gold,0,0,.012,emblem);
  for(const side of [-1,1]){const key=new THREE.Group();key.rotation.z=side*.6;emblem.add(key);add(new THREE.TorusGeometry(.06,.014,5,16),gold,0,.12,.03,key);box(.022,.26,.025,0,-.04,.03,gold,key);box(.09,.025,.025,.025,-.15,.03,gold,key);}
  // Dalles gris chaud et crème, sans relief dans la circulation.
  for(let row=0;row<7;row++)for(let col=0;col<6;col++){const x=-3.75+col*1.5,z=-40.4+row*1.5;if(Math.abs(x)<1.8&&z<-37.6)continue;box(1.46,.012,1.46,x,floor+.008,z,(row+col)%3===0?stone:cream);}
  const medallion=add(new THREE.TorusGeometry(.65,.025,6,40),gold,0,floor+.032,-36.4);medallion.rotation.x=-Math.PI/2;
  box(.055,.018,.85,0,floor+.035,-36.4,gold);box(.6,.018,.055,0,floor+.035,-36.23,gold);
  root.traverse(o=>o.layers.set(2));
  return root;
}
