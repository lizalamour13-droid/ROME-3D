import * as THREE from 'three';

// Architecture géométrique de la référence ; emprise et circulation conservées.
export function buildChapelArchitecture({chapel,scene,mat,cream,gold,black,chairGold,chairBronze}){
  const architecture=new THREE.Group();architecture.name='chapel-reference-architecture';chapel.add(architecture);
  const marble=mat('#393737',.38),red=mat('#70383c',.58),pale=mat('#d5c5b0',.7),blue=mat('#365b87',.8);
  const add=(g,m,x,y,z,parent=architecture)=>{const a=new THREE.Mesh(g,m);a.position.set(x,y,z);a.receiveShadow=true;parent.add(a);return a;};
  const box=(w,h,d,x,y,z,m,parent)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
  const path=(points,r,m,parent=architecture)=>{const a=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,r,6,false),m);parent.add(a);return a;};
  const arch=(x,y,z,rx,ry,plane='xy',m=cream,r=.13,parent)=>{const points=[];for(let i=0;i<=32;i++){const a=i*Math.PI/32;points.push(new THREE.Vector3(x+(plane==='xy'?rx*Math.cos(a):0),y+ry*Math.sin(a),z+(plane==='yz'?rx*Math.cos(a):0)));}return path(points,r,m,parent);};
  const shape=new THREE.Shape();shape.moveTo(-8,-17);shape.lineTo(8,-17);shape.lineTo(8,-28);shape.absellipse(0,-28,8,9,0,Math.PI,true);shape.lineTo(-8,-17);shape.closePath();
  const floor=add(new THREE.ShapeGeometry(shape,40),pale,0,0,0);floor.rotation.x=Math.PI/2;floor.material=pale.clone();floor.material.side=THREE.DoubleSide;floor.name='chapel-floor';
  box(4.2,.22,3.2,0,-.12,-15.5,cream);
  for(let z=-18;z>=-35;z-=2)for(let x=-6;x<=6;x+=2){
    if(z<-28&&(Math.abs(x)+1)**2/64+(Math.abs(z+28)+1)**2/81>.96)continue;
    box(1.91,.025,1.91,x,.02,z,(Math.round(x/2)+Math.round((z+18)/2))%2?marble:red);
    for(const dx of [-.97,.97])box(.03,.03,1.96,x+dx,.025,z,chairGold);
    const ring=add(new THREE.TorusGeometry(.64,.035,5,24),cream,x,.045,z);ring.rotation.x=-Math.PI/2;
  }
  // Les chaises et personnages restent à leurs coordonnées d'origine.
  for(const side of [-1,1]){
    box(.4,10.7,11,side*8,5.35,-22.5,cream);
    box(6.25,10.7,.4,side*4.875,5.35,-17,cream);
    for(const y of [.25,8.85,9.15])box(.5,.17,11,side*7.75,y,-22.5,y<1?marble:chairGold);
  }
  box(3.5,4.2,.4,0,8.6,-17,cream);
  for(let i=0;i<32;i++){
    const a=i*Math.PI/32,b=(i+1)*Math.PI/32,x=4*(Math.cos(a)+Math.cos(b)),z=-28-4.5*(Math.sin(a)+Math.sin(b));
    const wall=box(Math.hypot(8*(Math.cos(b)-Math.cos(a)),9*(Math.sin(b)-Math.sin(a)))+.04,10.7,.3,x,5.35,z,cream);wall.rotation.y=Math.atan2(9*(Math.sin(b)-Math.sin(a)),8*(Math.cos(b)-Math.cos(a)));
  }
  // Berceau crème à caissons véritables : cadres en relief sur la courbure.
  const pos=[],idx=[];
  for(let j=0;j<24;j++)for(let i=0;i<32;i++){
    const a=i*Math.PI/32,b=(i+1)*Math.PI/32,z=-17-j*11/24,z2=z-11/24,x=8*Math.cos((a+b)/2);
    if(x*x+((z+z2)/2+23)**2<3.5**2)continue;
    const k=pos.length/3;pos.push(8*Math.cos(a),8.9+4*Math.sin(a),z,8*Math.cos(b),8.9+4*Math.sin(b),z,8*Math.cos(a),8.9+4*Math.sin(a),z2,8*Math.cos(b),8.9+4*Math.sin(b),z2);idx.push(k,k+1,k+2,k+1,k+3,k+2);
  }
  const roofGeo=new THREE.BufferGeometry();roofGeo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));roofGeo.setIndex(idx);roofGeo.computeVertexNormals();const roofMat=cream.clone();roofMat.side=THREE.DoubleSide;add(roofGeo,roofMat,0,0,0).name='chapel-coffered-vault';
  for(let i=0;i<12;i++)for(let j=0;j<7;j++){
    const a=(i+.5)*Math.PI/12,z=-17.8-j*1.56,x=7.92*Math.cos(a),y=8.83+3.98*Math.sin(a);
    if(x*x+(z+23)**2<3.8**2)continue;
    const panel=new THREE.Group();panel.position.set(x,y,z);panel.rotation.z=Math.atan2(3.98*Math.cos(a),-7.92*Math.sin(a));architecture.add(panel);
    const w=Math.hypot(7.92*Math.sin(a),3.98*Math.cos(a))*Math.PI/12*.85;
    box(w,.065,1.3,0,0,0,pale,panel);
    for(const dx of [-w/2,w/2])box(.045,.07,1.3,dx,-.055,0,chairGold,panel);
    for(const dz of [-.65,.65])box(w,.07,.045,0,-.055,dz,chairGold,panel);
    const flower=add(new THREE.SphereGeometry(.12,8,6),chairGold,0,-.12,0,panel);flower.scale.y=.35;
  }
  for(const z of [-17.3,-27.7]){arch(0,8.8,z,7.9,4,'xy',pale,.24);arch(0,8.76,z,7.7,3.95,'xy',chairGold,.05);}
  const apseRoof=add(new THREE.SphereGeometry(1,32,16,0,Math.PI,0,Math.PI/2),roofMat,0,8.9,-28);apseRoof.rotation.y=Math.PI;apseRoof.scale.set(8,4,9);
  for(let i=1;i<8;i++){
    const a=i*Math.PI/8,points=[];
    for(let j=0;j<=24;j++){const b=j*Math.PI/48;points.push(new THREE.Vector3(7.93*Math.cos(b)*Math.cos(a),8.86+3.98*Math.sin(b),-28-8.93*Math.cos(b)*Math.sin(a)));}
    path(points,.06,chairGold);
  }
  // Coupole centrale bleu étoilé, tambour percé de fenêtres lumineuses.
  const domeGroup=new THREE.Group();domeGroup.name='chapel-blue-dome';architecture.add(domeGroup);
  const domeMat=blue.clone();domeMat.side=THREE.DoubleSide;
  const dome=add(new THREE.SphereGeometry(1,40,20,0,Math.PI*2,0,Math.PI/2),domeMat,0,12,-23,domeGroup);dome.scale.set(3.65,3.5,3.65);
  const glass=new THREE.MeshBasicMaterial({color:'#e8f0ee'});
  for(let i=0;i<12;i++){
    const a=i*Math.PI/6,x=3.6*Math.cos(a),z=-23+3.6*Math.sin(a);
    const drum=new THREE.Group();drum.position.set(x,10.8,z);drum.rotation.y=Math.PI/2-a;domeGroup.add(drum);
    box(1.82,2.4,.15,0,0,0,cream,drum);
    const window=box(.74,1.65,.03,0,.13,-.1,glass,drum);window.name='chapel-clerestory-window';
    for(const dx of [-.4,0,.4])box(.035,1.76,.06,dx,.13,-.14,chairGold,drum);
    for(const y of [-.72,.08,.96])box(.84,.035,.06,0,y,-.14,chairGold,drum);
    const ribs=[];for(let j=0;j<=24;j++){const b=j*Math.PI/48;ribs.push(new THREE.Vector3(3.61*Math.cos(b)*Math.cos(a),12+3.47*Math.sin(b),-23+3.61*Math.cos(b)*Math.sin(a)));}path(ribs,.045,chairGold,domeGroup);
  }
  for(const y of [9.65,12]){const rim=add(new THREE.TorusGeometry(3.65,.12,6,64),chairGold,0,y,-23,domeGroup);rim.rotation.x=Math.PI/2;}
  for(let row=0;row<4;row++)for(let i=0;i<12;i++){
    const a=(i+(row%2)*.5)*Math.PI/6,b=.25+row*.25;
    const star=add(new THREE.OctahedronGeometry(.075),chairGold,3.61*Math.cos(b)*Math.cos(a),12+3.46*Math.sin(b),-23+3.61*Math.cos(b)*Math.sin(a),domeGroup);star.scale.y=1.7;
  }
  // Colonnes murales et niches, sans encombrer les allées.
  for(const side of [-1,1])for(const z of [-18.2,-23.3,-28]){
    const x=side*7.65;
    box(.6,2.4,.85,x,1.2,z,marble);box(.6,6,.75,x,5.4,z,cream);
    for(const y of [.15,2.45,8.4])box(.78,.17,1.02,x,y,z,chairGold);
    box(.85,.3,1.1,x,8.65,z,pale);
  }
  function statue(x,z,side,keys,scale=1){
    const g=new THREE.Group();g.name=keys?'chapel-statue-peter':'chapel-statue-paul';g.position.set(x,1.1,z);g.rotation.y=-side*Math.PI/2;g.scale.setScalar(scale);architecture.add(g);
    box(.85,.22,.85,0,-.1,0,cream,g);
    add(new THREE.CylinderGeometry(.25,.42,1.5,12),cream,0,.78,0,g);
    add(new THREE.SphereGeometry(.23,12,8),cream,0,1.97,.02,g);
    add(new THREE.ConeGeometry(.19,.35,10),pale,0,1.78,.14,g).rotation.x=Math.PI;
    for(let i=0;i<8;i++){const a=i*Math.PI/4;add(new THREE.SphereGeometry(.1,8,6),cream,.21*Math.cos(a),2.08+.07*Math.sin(a),.12*Math.sin(a),g);}
    for(const s of [-1,1]){const arm=box(.17,.73,.2,s*.38,1.35,.13,cream,g);arm.rotation.z=s*.25;add(new THREE.SphereGeometry(.1,8,6),cream,s*.42,1.04,.17,g);}
    box(.4,.54,.11,-.33,1.12,.3,pale,g);
    if(keys)for(const dx of [-.08,.08]){add(new THREE.TorusGeometry(.11,.03,5,16),chairGold,.33+dx,1.25,.3,g);box(.04,.5,.04,.33+dx,.92,.3,chairGold,g);box(.17,.06,.05,.37+dx,.72,.3,chairGold,g);}
    else{box(.055,1.75,.055,.42,1.03,.3,chairGold,g);box(.38,.055,.06,.42,1.48,.3,chairGold,g);}
  }
  for(const side of [-1,1]){
    for(const z of [-20.75,-25.65]){
      box(.1,5.6,1.75,side*7.72,5.1,z,red);
      for(const dz of [-.9,.9])box(.15,5.75,.06,side*7.6,5.1,z+dz,chairGold);
      arch(side*7.5,7.9,z,.95,1.1,'yz',chairGold,.1);
      box(.13,1,.08,side*7.58,5.25,z,chairGold);box(.13,.08,.55,side*7.58,5.45,z,chairGold);
    }
    box(.65,.95,1.2,side*7.3,.48,-18.6,red);statue(side*7.28,-18.6,side,side<0,1.25);
    statue(side*7.3,-27,side,side>0,.85);
  }
  for(const side of [-1,1])for(const z of [-18.2,-23.3,-28]){
    const angel=new THREE.Group();angel.name='chapel-trumpet-angel';angel.position.set(side*7.1,6.8,z);angel.rotation.y=-side*Math.PI/2;architecture.add(angel);
    add(new THREE.SphereGeometry(.18,10,7),cream,0,.4,0,angel);add(new THREE.ConeGeometry(.25,.48,10),cream,0,.04,0,angel);
    for(const sign of [-1,1]){const wing=add(new THREE.SphereGeometry(1,10,7),chairGold,sign*.25,.25,-.12,angel);wing.scale.set(.3,.15,.06);wing.rotation.z=sign*.5;box(.1,.1,.32,sign*.12,.26,.17,cream,angel);}
    const horn=add(new THREE.CylinderGeometry(.11,.035,.5,10),chairGold,0,.34,.4,angel);horn.rotation.x=Math.PI/2;
  }
  const beams=new THREE.Group();beams.name='chapel-light-beams';architecture.add(beams);
  for(const x of [-2,0,2]){const shaft=add(new THREE.CylinderGeometry(.12,1,10,20,1,true),new THREE.MeshBasicMaterial({color:'#fff0cf',transparent:true,opacity:.035,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}),x,6,-23,beams);shaft.rotation.z=x*.08;}
  for(const a of [.4,.8,Math.PI/2,Math.PI-.8,Math.PI-.4]){
    const g=new THREE.Group();g.position.set(7.65*Math.cos(a),0,-28-8.65*Math.sin(a));g.rotation.y=a-Math.PI/2;architecture.add(g);
    box(1.7,5.5,.1,0,4.1,0,pale,g);
    for(const dx of [-.88,.88])box(.1,5.7,.16,dx,4.1,.08,chairGold,g);
    box(1.86,.12,.16,0,1.3,.08,chairGold,g);
    const pane=box(.84,1.75,.05,0,7.7,.08,new THREE.MeshBasicMaterial({color:'#e3eaf0'}),g);
    for(const dx of [-.46,0,.46])box(.035,1.85,.1,dx,7.7,.13,chairGold,g);
    for(const y of [6.76,7.7,8.64])box(.96,.04,.1,0,y,.13,chairGold,g);
  }
  // Sanctuaire dégagé, escalier et petit autel à la place du grand siège rectangulaire.
  for(let i=0;i<4;i++)box(7.5-i*.4,.18,4.7-i*.5,0,.1+i*.18,-33.5-i*.12,i%2?cream:pale);
  const altar=new THREE.Group();altar.name='cathedra-petri';architecture.add(altar);
  box(2.25,.9,.9,0,1.21,-34,cream,altar);box(2.5,.15,1.12,0,1.76,-34,chairGold,altar);
  box(.07,.55,.06,0,1.3,-33.52,chairGold,altar);box(.32,.07,.06,0,1.43,-33.52,chairGold,altar);
  const glory=new THREE.Group();glory.name='cathedra-glory';glory.position.set(0,4.7,-36.4);architecture.add(glory);
  add(new THREE.CircleGeometry(.48,32),new THREE.MeshBasicMaterial({color:'#ffe4ad'}),0,0,.02,glory);
  for(let i=0;i<32;i++){const a=i*Math.PI/16;const ray=box(.045,.6,.07,Math.sin(a)*.95,Math.cos(a)*.95,0,chairGold,glory);ray.rotation.z=-a;}
  for(const x of [-4.6,4.6]){box(.5,6,.5,x,3.5,-34.8,cream);box(.7,.18,.7,x,6.6,-34.8,chairGold);}arch(0,6.7,-35,4.65,3.6,'xy',chairGold,.16);
  // Baldaquin noir et or à toit triangulaire, comme dans la référence.
  const baldachin=new THREE.Group();baldachin.name='bernin-baldachin';architecture.add(baldachin);
  for(const x of [-2.65,2.65])for(const z of [-31.35,-34.85]){
    box(.92,.35,.92,x,.83,z,cream,baldachin);
    const points=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*6;points.push(new THREE.Vector3(x+Math.cos(a)*.13,1.05+i/80*5.7,z+Math.sin(a)*.13));}
    path(points,.27,chairBronze,baldachin).name='baldachin-twisted-column';
    for(const y of [1.05,6.85]){add(new THREE.CylinderGeometry(.43,.43,.22,12),chairGold,x,y,z,baldachin);box(.88,.18,.88,x,y+.17,z,chairGold,baldachin);}
  }
  for(const z of [-31.1,-35.1]){
    box(6.3,.4,.4,0,7.2,z,chairBronze,baldachin);box(6.45,.1,.5,0,7.45,z,chairGold,baldachin);
    for(let i=0;i<15;i++)box(.13,.27,.12,-2.8+i*.4,6.87,z,chairGold,baldachin);
    const triangle=new THREE.Shape();triangle.moveTo(-3.2,0);triangle.lineTo(3.2,0);triangle.lineTo(0,1.4);triangle.closePath();add(new THREE.ExtrudeGeometry(triangle,{depth:.15,bevelEnabled:false}),chairBronze,0,7.5,z,baldachin);
    for(const side of [-1,1]){const e=box(3.5,.1,.2,side*1.6,8.2,z+.18,chairGold,baldachin);e.rotation.z=-side*Math.atan2(1.4,3.2);}
  }
  add(new THREE.SphereGeometry(.32,12,8),chairGold,0,9.25,-33.1,baldachin);box(.07,.8,.07,0,9.85,-33.1,chairGold,baldachin);box(.4,.07,.07,0,10,-33.1,chairGold,baldachin);
  // Bougies et éclairage diurne doux ; aucun changement de la navigation.
  const flames=[],candleLights=[];
  for(const side of [-1,1])for(const z of [-19,-23,-27,-30]){
    const g=new THREE.Group();g.name='chapel-candle-sconce';g.position.set(side*(z===-30?7.15:7.6),2.9,z);architecture.add(g);
    box(.5,.08,.45,0,0,0,chairGold,g);
    for(const x of [-.18,0,.18]){add(new THREE.CylinderGeometry(.035,.04,.35,8),cream,x,.2,0,g);const flame=add(new THREE.SphereGeometry(1,6,5),new THREE.MeshBasicMaterial({color:'#ffd28c'}),x,.45,0,g);flame.scale.set(.04,.11,.04);flames.push(flame);}
  }
  for(const side of [-1,1])for(const z of [-21,-28.5]){const light=new THREE.PointLight('#ffe0b1',65,12,1.65);light.position.set(side*6.5,4,z);scene.add(light);candleLights.push(light);}
  const daylight=new THREE.PointLight('#fff1da',160,24,1.5);daylight.position.set(0,11.5,-23);scene.add(daylight);
  return {flames,candleLights};
}
