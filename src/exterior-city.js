import * as THREE from 'three';

// Décor romain stylisé : façades regroupées par matériau pour limiter les appels de dessin.
export function createExteriorCity({parent,mat,cream,stone,planters=[]}){
  const city=new THREE.Group();city.name='rome-city-surroundings';parent.add(city);
  const plaster=['#c8ac80','#d0bd9d','#b98e72','#d6c8ab','#c2a58b'].map(c=>mat(c));
  const terracotta=mat('#885d49'),dark=mat('#3e4947'),shutter=mat('#526553'),wood=mat('#79553e'),iron=mat('#3d443e');
  const batches=new Map(),unit=new THREE.BoxGeometry(1,1,1),dummy=new THREE.Object3D();
  const batchBox=(m,w,h,d,x,y,z,ry=0,rx=0)=>{dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,0,'YXZ');dummy.scale.set(w,h,d);dummy.updateMatrix();if(!batches.has(m))batches.set(m,[]);batches.get(m).push(dummy.matrix.clone());};
  function building(x,z,yaw,index){
    const height=11+(index%4)*2.3,width=12+(index%3)*1.1,depth=11;
    const semantic=new THREE.Group();semantic.name='roman-building';semantic.position.set(x,-2.1,z);city.add(semantic);
    const b=(m,w,h,d,lx,y,lz,rx=0)=>batchBox(m,w,h,d,x+lx*Math.cos(yaw)+lz*Math.sin(yaw),y-2.1,z-lx*Math.sin(yaw)+lz*Math.cos(yaw),yaw,rx);
    b(plaster[index%5],width,height,depth,0,height/2,0);
    b(stone,width+.3,.5,depth+.3,0,.3,0);b(cream,width+.5,.25,depth+.5,0,height-.15,0);
    for(const sign of [-1,1])b(terracotta,width+1,.25,depth*.56,0,height+.65,sign*depth*.26,sign*.23);
    b(plaster[(index+1)%5],.65,1.7,.7,width*.3,height+1.2,-2);
    for(let floor=0;floor<Math.floor(height/3)-1;floor++)for(let col=0;col<4;col++){
      const lx=-width*.36+col*width*.24,y=2.4+floor*3;
      b(cream,1.5,1.95,.16,lx,y,5.56);b(dark,1.12,1.6,.18,lx,y,5.66);
      for(const side of [-1,1])b(shutter,.28,1.7,.14,lx+side*.76,y,5.73);
      b(cream,1.8,.12,.42,lx,y-.95,5.7);
      if(floor===1&&(col+index)%2===0){b(iron,1.7,.07,.07,lx,y-.5,6.1);for(const dx of [-.7,0,.7])b(iron,.04,.65,.04,lx+dx,y-.8,6.1);}
    }
    b(wood,1.65,2.8,.15,0,1.4,5.62);b(cream,2,.18,.5,0,2.95,5.7);
    for(const side of [-1,1])for(let floor=0;floor<3;floor++)b(dark,.08,1.4,1.1,side*(width/2+.02),2.8+floor*3,0);
  }
  let buildingIndex=0;
  for(const side of [-1,1])for(const z of [22,40,58,76,94,112])building(side*62,z,-side*Math.PI/2,buildingIndex++);
  for(const x of [-45,-30,-15,15,30,45])building(x,124,Math.PI,buildingIndex++);
  for(const side of [-1,1])for(const z of [-9,7])building(side*41,z,-side*Math.PI/2,buildingIndex++);
  // Rue dans l'axe de la place et trottoirs, visibles entre les palais du fond.
  batchBox(stone,15,.08,52,0,-2.18,129);for(const x of [-8,8])batchBox(cream,1,.1,52,x,-2.1,129);
  const obstacles=[],walkers=[],seated=[];
  const add=(g,m,x,y,z,p=city)=>{const mesh=new THREE.Mesh(g,m);mesh.position.set(x,y,z);p.add(mesh);return mesh;};
  const box=(w,h,d,x,y,z,m,p)=>{const mesh=add(unit,m,x,y,z,p);mesh.scale.set(w,h,d);return mesh;};
  const clothes=['#7e3f42','#365873','#6b7753','#b09371','#665d79','#475b60'].map(c=>mat(c));
  function person(index,sitting=false){
    const group=new THREE.Group();group.name=sitting?'square-seated-person':'square-walking-person';city.add(group);
    const skin=mat(['#c5a184','#96745a','#d0b59a'][index%3]),shirt=clothes[index%clothes.length],legs=mat('#424948');
    const upper=new THREE.Group();upper.position.y=sitting?.42:.79;group.add(upper);
    const torso=add(new THREE.CylinderGeometry(.22,.19,.5,8),shirt,0,.43,0,upper);torso.scale.z=.7;
    const head=add(new THREE.SphereGeometry(.15,10,7),skin,0,.88,0,upper);head.rotation.y=(index%3-1)*.12;
    const hair=add(new THREE.SphereGeometry(.156,10,6,0,Math.PI*2,0,Math.PI*.5),dark,0,.92,0,upper);
    const limbs=[];
    for(const side of [-1,1]){
      const hip=new THREE.Group();hip.position.set(side*.11,0,0);upper.add(hip);
      box(.12,.35,.15,0,-.175,0,legs,hip);const knee=new THREE.Group();knee.position.y=-.35;hip.add(knee);
      box(.11,.33,.13,0,-.165,0,legs,knee);box(.15,.1,.25,0,-.38,.06,dark,knee);
      const arm=new THREE.Group();arm.position.set(side*.23,.63,0);upper.add(arm);
      box(.11,.25,.13,0,-.125,0,shirt,arm);
      const elbow=new THREE.Group();elbow.position.y=-.25;arm.add(elbow);box(.09,.23,.11,0,-.115,0,shirt,elbow);add(new THREE.SphereGeometry(.065,8,6),skin,0,-.255,0,elbow);
      arm.rotation.z=-side*.08;elbow.rotation.x=-.18;
      if(sitting){
        hip.rotation.x=-Math.PI/2+(index%3-1)*.09;hip.rotation.z=side*.07;knee.rotation.x=Math.PI/2;
        arm.rotation.x=side<0&&index%2===0?-.15:-.6;elbow.rotation.x=side<0&&index%2===0?-1:-.55;
        knee.children[0].scale.y=.48;knee.children[0].position.y=-.24;knee.children[1].position.y=-.53;
      }
      limbs.push({hip,knee,arm,elbow,side});
    }
    if(sitting)upper.position.y=.58;
    return {group,limbs,upper,head,pose:index%3};
  }
  for(const side of [-1,1])for(const [index,z] of [44,58,76,90].entries()){
    const x=side*25,yaw=-side*Math.PI/2,g=new THREE.Group();g.name='square-bench';g.position.set(x,-2,z);g.rotation.y=yaw;city.add(g);
    for(const dx of [-1.1,1.1]){box(.12,.55,.65,dx,.28,0,iron,g);box(.1,1,.1,dx,.75,-.25,iron,g);}
    for(let i=0;i<4;i++){box(2.7,.07,.13,0,.58,-.23+i*.15,wood,g);box(2.7,.1,.08,0,.85+i*.13,-.28,wood,g);}
    obstacles.push({x,z,hx:.85,hz:1.65});
    for(const offset of [-.65,.65]){const actor=person(index+(side+1)*3+Math.round(offset),true);actor.group.position.set(x+Math.cos(yaw)*offset,-2,z-Math.sin(yaw)*offset);actor.group.rotation.y=yaw;seated.push(actor);}
  }
  // Trajets qui contournent fontaines, obélisque et bancs ; l'allée de sortie reste libre.
  const routes=[[[8,36],[12,43],[18,50],[20,71],[14,86]], [[-8,37],[-12,44],[-19,54],[-20,75],[-13,89]], [[-10,91],[0,96],[12,90],[20,82]], [[-21,48],[-9,52],[0,55],[10,52],[21,48]]];
  for(let i=0;i<16;i++){
    const actor=person(i);const route=routes[i%4],start=Math.floor(i/4)%route.length;
    actor.group.position.set(route[start][0],-2,route[start][1]);walkers.push({...actor,route,target:(start+1)%route.length,distance:i*.3});
  }
  // Familles : enfants accompagnés et poussettes qui suivent leur parent.
  for(let i=0;i<6;i++){
    const child=person(i+2);child.group.name='square-child';child.group.scale.setScalar(.62+(i%2)*.07);
    const route=routes[i%2],start=1+Math.floor(i/2)%3;child.group.position.set(route[start][0]+(i%2?.9:-.9),-2,route[start][1]-.7);
    walkers.push({...child,route,target:(start+1)%route.length,distance:i*.4,speed:.7});
  }
  for(let i=0;i<3;i++){
    const mother=person(i+3);mother.group.name='square-mother';mother.group.userData.dialogueName=['Lucia et son bébé','Sofia et sa famille','Anna en promenade'][i];mother.group.userData.dialogueRole='family';
    const skirt=add(new THREE.CylinderGeometry(.18,.3,.55,10),clothes[(i+3)%clothes.length],0,.69,0,mother.group);
    const stroller=new THREE.Group();stroller.name='square-stroller';stroller.position.z=.95;mother.group.add(stroller);
    for(const side of [-1,1])for(const z of [-.28,.28]){const wheel=add(new THREE.CylinderGeometry(.16,.16,.07,10),iron,side*.29,.17,z,stroller);wheel.rotation.z=Math.PI/2;}
    box(.5,.28,.7,0,.5,0,clothes[i],stroller);box(.44,.07,.5,0,.65,.04,cream,stroller);
    const hood=add(new THREE.SphereGeometry(1,12,8,0,Math.PI*2,0,Math.PI/2),clothes[i],0,.65,-.16,stroller);hood.scale.set(.28,.27,.27);
    for(const x of [-.25,.25]){const handle=box(.035,.65,.035,x,.82,-.38,iron,stroller);handle.rotation.x=-.35;}
    box(.53,.04,.04,0,1.12,-.48,iron,stroller);
    const route=i===1?[[-22,41],[-22,59],[-21,81],[-15,91]]:[[22,42],[22,57],[22,77],[16,91]];
    const start=i===2?2:0;mother.group.position.set(route[start][0],-2,route[start][1]);walkers.push({...mother,route,target:(start+1)%route.length,distance:i*.8,speed:.5,stroller:true});
  }
  walkers[0].group.userData.dialogueName='Marco, guide de la place';walkers[0].group.userData.dialogueRole='guide';
  seated[0].group.userData.dialogueName='Elena, en visite';seated[0].group.userData.dialogueRole='visitor';
  for(const side of [-1,1])for(const z of [41,53,79,92]){
    const x=side*20;obstacles.push({x,z,hx:.5,hz:.5});
    add(new THREE.CylinderGeometry(.09,.16,3.8,8),iron,x,-.1,z);add(new THREE.CylinderGeometry(.3,.4,.3,10),stone,x,-1.8,z);
    for(const dx of [-.35,0,.35]){const lantern=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),new THREE.MeshBasicMaterial({color:'#e9d2a2'}));lantern.position.set(x+dx,2+(dx===0?.2:0),z);city.add(lantern);}
  }
  for(const [material,matrices] of batches){const mesh=new THREE.InstancedMesh(unit,material,matrices.length);matrices.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.receiveShadow=true;city.add(mesh);}
  const staticClear=(x,z,stroller=false)=>!obstacles.some(o=>Math.abs(x-o.x)<o.hx+.35&&Math.abs(z-o.z)<o.hz+.35)
    &&!planters.some(p=>Math.abs(x-p.x)<1.7&&Math.abs(z-p.z)<1.7)
    &&![-15,15].some(fx=>Math.hypot(x-fx,z-66)<(stroller?4:3.4));
  // Circuits emboîtés, sans carrefours partagés : départs espacés sur la longueur des chemins.
  const lanes=[[4,10,.68],[7,15,.72],[10.5,21,.52],[20,28,.7]];
  const placed=[];
  walkers.forEach((actor,index)=>{
    const lane=actor.stroller?2:index%4,[rx,rz,speed]=lanes[lane];
    actor.speed=speed;actor.route=Array.from({length:64},(_,i)=>{const a=i*Math.PI/32;return [Math.cos(a)*rx,66+Math.sin(a)*rz];});
    let selected=null;
    for(let attempt=0;attempt<64;attempt++){
      const phase=(index*.61803398875+attempt*.137)%1,segment=Math.floor(phase*64),blend=phase*64-segment;
      const a=actor.route[segment],b=actor.route[(segment+1)%64],x=a[0]+(b[0]-a[0])*blend,z=a[1]+(b[1]-a[1])*blend;
      if(!staticClear(x,z,actor.stroller))continue;
      const separation=placed.length?Math.min(...placed.map(p=>Math.hypot(x-p.x,z-p.z))):100;
      if(!selected||separation>selected.separation)selected={x,z,target:(segment+1)%64,separation};
      if(separation>3)break;
    }
    actor.group.position.set(selected.x,-2,selected.z);actor.target=selected.target;placed.push(selected);
    const target=actor.route[actor.target];actor.group.rotation.y=Math.atan2(target[0]-selected.x,target[1]-selected.z);
  });
  let previousTime=null;
  function animate(time,viewer){
    const dt=previousTime===null?0:Math.min(.1,Math.max(0,time-previousTime));previousTime=time;
    walkers.forEach((actor,index)=>{
      if(actor.group.userData.isConversing){
        actor.limbs.forEach(({hip,knee,arm,elbow})=>{hip.rotation.x=0;knee.rotation.x=0;arm.rotation.x=actor.stroller?-.9:-.07;elbow.rotation.x=actor.stroller?-.25:-.22;});
        actor.group.position.y=-2;return;
      }
      // Ne pas chercher à atteindre un point de parcours occupé par une personne arrêtée.
      for(let skip=0;skip<8;skip++){
        const point=actor.route[actor.target];
        if(staticClear(point[0],point[1],actor.stroller)&&!walkers.some(other=>other!==actor&&Math.hypot(point[0]-other.group.position.x,point[1]-other.group.position.z)<2.3))break;
        actor.target=(actor.target+1)%actor.route.length;
      }
      const [tx,tz]=actor.route[actor.target],dx=tx-actor.group.position.x,dz=tz-actor.group.position.z,length=Math.hypot(dx,dz);
      if(length<.12){actor.target=(actor.target+1)%actor.route.length;return;}
      const step=Math.min(length,dt*actor.speed),forwardX=dx/length,forwardZ=dz/length;
      let steerX=forwardX,steerZ=forwardZ;
      // Dépasser doucement une personne arrêtée plutôt que former une file bloquée.
      for(const other of walkers){
        if(other===actor)continue;
        const ox=other.group.position.x-actor.group.position.x,oz=other.group.position.z-actor.group.position.z,distance=Math.hypot(ox,oz);
        if(distance<4&&ox*forwardX+oz*forwardZ>0&&Math.abs(ox*forwardZ-oz*forwardX)<1.5){
          const strength=(4-distance)*.8;steerX+=forwardZ*strength;steerZ-=forwardX*strength;
        }
      }
      const canMove=(nx,nz)=>staticClear(nx,nz,actor.stroller)
        &&!walkers.some(other=>other!==actor&&Math.hypot(other.group.position.x-nx,other.group.position.z-nz)<(actor.stroller||other.stroller?2.1:2));
      const viewerClear=!viewer||Math.hypot(viewer.x-actor.group.position.x,viewer.z-actor.group.position.z)>(actor.stroller?1.9:.95);
      let moved=false;
      if(!actor.group.userData.isConversing&&viewerClear){
        const heading=Math.atan2(steerX,steerZ);
        for(const offset of [0,.7,1.3,-.7,-1.3,Math.PI/2,-Math.PI/2,2.1,-2.1]){
          const angle=heading+offset,nx=actor.group.position.x+Math.sin(angle)*step,nz=actor.group.position.z+Math.cos(angle)*step;
          if(!canMove(nx,nz))continue;
          actor.group.position.x=nx;actor.group.position.z=nz;actor.distance+=step;actor.group.rotation.y=angle;moved=true;break;
        }
      }
      const clear=moved;
      const phase=actor.distance*10;
      actor.limbs.forEach(({hip,knee,arm,elbow,side})=>{const a=phase+(side<0?Math.PI:0);hip.rotation.x=clear?Math.sin(a)*.4:0;knee.rotation.x=clear?Math.max(0,-Math.sin(a))*.65:0;arm.rotation.x=actor.stroller?-.9:clear?-Math.sin(a)*.23:-.07;elbow.rotation.x=actor.stroller?-.25:-.22+(clear?Math.sin(a)*.06:0);});
      actor.group.position.y=-2+(clear?Math.abs(Math.sin(phase))*.025:0);
    });
    seated.forEach((actor,i)=>{
      actor.upper.rotation.x=[-.06,.08,-.02][actor.pose]+Math.sin(time*.5+i)*.012;
      actor.upper.rotation.z=Math.sin(i*1.7)*.025;
      actor.head.rotation.y=Math.sin(time*.35+i)*.12+(i%2?.18:-.18);
      actor.limbs[1].elbow.rotation.x=-.55+Math.sin(time*.6+i)*.05;
    });
  }
  function blocked(x,z){return obstacles.some(o=>Math.abs(x-o.x)<o.hx&&Math.abs(z-o.z)<o.hz)||walkers.some(a=>Math.hypot(x-a.group.position.x,z-a.group.position.z)<(a.stroller?1:.45)||(a.stroller&&Math.hypot(x-a.group.position.x-Math.sin(a.group.rotation.y)*.95,z-a.group.position.z-Math.cos(a.group.rotation.y)*.95)<.65));}
  function conversationGain(position){
    let nearest=Infinity;
    for(const actor of [...walkers,...seated])nearest=Math.min(nearest,Math.hypot(position.x-actor.group.position.x,position.z-actor.group.position.z));
    return nearest>=7?0:(1-Math.max(0,(nearest-1.5)/5.5))**2;
  }
  return {animate,blocked,conversationGain};
}
