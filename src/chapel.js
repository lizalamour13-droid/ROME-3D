import * as THREE from 'three';
import {buildChapelArchitecture} from './chapel-architecture.js';

// Salle II : nef avec abside elliptique, Cathedra Petri interprétée géométriquement.
export function createChapel({scene,box,cylinder,mat,cream,stone,gray,black,gold,white}){
  const chapel=new THREE.Group();chapel.name='chapel';scene.add(chapel);
  const wood=mat('#65503c'),darkWood=mat('#493c30'),chairBronze=mat('#25251f',.4,.45),chairGold=mat('#b09452',.35,.65);
  const obstacles=[{x:0,z:-33.5,hx:4,hz:2.9}];
  const {flames,candleLights,floatingCandles}=buildChapelArchitecture({chapel,scene,mat,cream,gold,black,chairGold,chairBronze});
  const sparkleCanvas=document.createElement('canvas');sparkleCanvas.width=32;sparkleCanvas.height=32;
  const sparkleContext=sparkleCanvas.getContext('2d');
  const shimmer=sparkleContext.createRadialGradient(16,16,0,16,16,16);shimmer.addColorStop(0,'#fff1c7');shimmer.addColorStop(.2,'#e1b860aa');shimmer.addColorStop(1,'#bb8b3000');sparkleContext.fillStyle=shimmer;sparkleContext.fillRect(0,0,32,32);
  const sparkleTexture=new THREE.CanvasTexture(sparkleCanvas);sparkleTexture.colorSpace=THREE.SRGBColorSpace;
  const sparklePositions=new Float32Array(280*3),sparkleSeeds=[];let sparkleSeed=2319;
  const random=()=>{sparkleSeed=(sparkleSeed*1664525+1013904223)>>>0;return sparkleSeed/4294967296;};
  for(let i=0;i<280;i++){
    const z=-18-random()*17,maxX=z<-28?6.6*Math.sqrt(Math.max(.1,1-((z+28)/8.4)**2)):6.6;
    sparkleSeeds.push({x:(random()*2-1)*maxX,y:random()*8.1,z,phase:random()*Math.PI*2,speed:.06+random()*.08});
  }
  const sparkleGeometry=new THREE.BufferGeometry();sparkleGeometry.setAttribute('position',new THREE.BufferAttribute(sparklePositions,3).setUsage(THREE.DynamicDrawUsage));
  const sparkles=new THREE.Points(sparkleGeometry,new THREE.PointsMaterial({map:sparkleTexture,color:'#d6b268',size:.095,transparent:true,opacity:.72,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  sparkles.name='chapel-gold-sparkles';sparkles.frustumCulled=false;chapel.add(sparkles);
  // Moulures classiques : corniches à denticules et encadrements cintrés dorés.
  const mouldings=new THREE.Group();mouldings.name='chapel-classical-mouldings';chapel.add(mouldings);
  for(const side of [-1,1]){
    for(const y of [9.1,9.3]){const cornice=box(.3,.1,10.9,side*7.62,y,-22.55,chairGold);cornice.castShadow=false;}
    for(let z=-17.6;z>-28;z-=.48){const tooth=box(.22,.17,.15,side*7.55,8.98,z,chairGold);tooth.castShadow=false;mouldings.attach(tooth);}
    for(const z of [-20.7,-25.6]){
      const points=[];for(let i=0;i<=24;i++){const a=i*Math.PI/24;points.push(new THREE.Vector3(side*7.55,6.1+1.75*Math.sin(a),z+1.75*Math.cos(a)));}
      const arch=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.045,5,false),chairGold);mouldings.add(arch);
      for(const dz of [-1.75,1.75]){const edge=box(.1,3.1,.075,side*7.55,4.55,z+dz,chairGold);edge.castShadow=false;mouldings.attach(edge);}
      const sill=box(.12,.09,3.6,side*7.55,3,z,chairGold);sill.castShadow=false;mouldings.attach(sill);
    }
  }
  for(let i=0;i<25;i++){
    const a=.47+i/24*(Math.PI-.94),x=7.68*Math.cos(a),z=-28-8.68*Math.sin(a);
    const tooth=box(.17,.18,.22,x,8.91,z,chairGold);tooth.rotation.y=Math.atan2(-Math.cos(a),Math.sin(a));tooth.castShadow=false;mouldings.attach(tooth);
  }
  // Personnages debout : maître de cérémonie et deux marcheurs dans les allées.
  const walkers=[],seatedMotion=[],risingVisitors=[];let animationTime=0;
  function standingPerson(x,z,role,index){
    const group=new THREE.Group();group.name=role;group.position.set(x,0,z);chapel.add(group);
    const skin=mat(index%2?'#a58265':'#c2a083'),robe=mat('#63323e'),hair=mat('#514638');
    const part=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);group.add(mesh);return mesh;};
    const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.2,.29,.75,10),robe);skirt.position.y=.76;group.add(skirt);
    part(.38,.46,.25,0,1.25,0,robe);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.145,10,7),skin);head.position.y=1.67;group.add(head);
    const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.15,10,6,0,Math.PI*2,0,Math.PI*.5),hair);hairCap.position.y=1.71;group.add(hairCap);
    const limbs=[];
    for(const side of [-1,1]){
      const leg=new THREE.Group();leg.position.set(side*.11,.63,0);group.add(leg);
      leg.position.y=.79;
      const thigh=new THREE.Mesh(new THREE.BoxGeometry(.115,.34,.14),robe);thigh.position.y=-.17;leg.add(thigh);
      const knee=new THREE.Group();knee.name='walking-knee';knee.position.y=-.34;leg.add(knee);
      const calf=new THREE.Mesh(new THREE.BoxGeometry(.105,.33,.12),robe);calf.position.y=-.165;knee.add(calf);
      const shoe=new THREE.Mesh(new THREE.BoxGeometry(.14,.1,.25),black);shoe.position.set(0,-.38,.055);knee.add(shoe);
      const arm=new THREE.Group();arm.position.set(side*.24,1.41,0);group.add(arm);
      const sleeve=new THREE.Mesh(new THREE.BoxGeometry(.105,.42,.13),robe);sleeve.position.y=-.2;arm.add(sleeve);
      const hand=new THREE.Mesh(new THREE.SphereGeometry(.06,8,5),skin);hand.position.y=-.44;arm.add(hand);limbs.push({leg,knee,arm,side});
    }
    if(role==='master-of-ceremonies'){
      part(.4,.28,.035,0,1.29,.144,cream);
      for(const side of [-1,1])part(.065,.57,.04,side*.13,1.07,.17,chairGold);
      part(.027,.2,.03,0,1.27,.17,chairGold);part(.13,.027,.03,0,1.29,.17,chairGold);
      const book=part(.3,.04,.23,0,1.18,.37,chairBronze);book.rotation.x=-.18;
      part(.26,.018,.21,0,1.2,.37,cream);
      limbs[0].arm.rotation.x=-.8;limbs[1].arm.rotation.x=-1.05;
      group.userData.role='Maître de cérémonie';group.scale.setScalar(1.08);
    }
    return {group,head,limbs};
  }
  const ceremonyMaster=standingPerson(0,-31.5,'master-of-ceremonies',0);
  ceremonyMaster.group.position.y=1.14;
  const ceremonyStage=new THREE.Group();ceremonyStage.name='ceremony-stage';chapel.add(ceremonyStage);
  for(const [w,h,d,y,z,m] of [[2.3,1.08,2.3,.54,-31.1,chairBronze],[2.35,.045,2.35,1.105,-31.1,chairGold],[2.16,.035,2.16,1.145,-31.1,mat('#702c40')],[2.3,.34,.45,.17,-29.7,cream],[2.3,.68,.45,.34,-30.1,cream]]){
    const step=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);step.position.set(0,y,z);ceremonyStage.add(step);
  }
  obstacles.push({x:0,z:-31.1,hx:1.43,hz:1.8});
  const lectern=new THREE.Group();lectern.name='ceremony-lectern';lectern.position.set(0,1.14,-30.83);chapel.add(lectern);
  const deskPart=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);lectern.add(mesh);return mesh;};
  deskPart(.86,.12,.65,0,.08,0,chairBronze);
  deskPart(.62,1.13,.28,0,.69,0,chairBronze);
  for(const x of [-.29,.29])deskPart(.045,1.12,.31,x,.69,0,chairGold);
  const desktop=deskPart(.95,.09,.65,0,1.31,0,chairGold);desktop.rotation.x=.18;
  const pages=deskPart(.43,.025,.33,0,1.38,-.05,cream);pages.rotation.x=.18;
  deskPart(.035,.31,.035,0,.89,.155,chairGold);deskPart(.18,.035,.035,0,.95,.155,chairGold);
  const microphone=new THREE.Group();microphone.name='ceremony-microphone';lectern.add(microphone);
  const neck=new THREE.CatmullRomCurve3([new THREE.Vector3(.3,1.36,0),new THREE.Vector3(.3,1.65,0),new THREE.Vector3(.13,1.78,-.22)]);
  microphone.add(new THREE.Mesh(new THREE.TubeGeometry(neck,16,.018,6,false),black));
  const micHead=new THREE.Mesh(new THREE.SphereGeometry(.055,10,7),gray);micHead.scale.set(1,1,1.65);micHead.position.set(.13,1.78,-.22);microphone.add(micHead);
  obstacles.push({x:0,z:-30.83,hx:.65,hz:.53});
  function walkingPose(person,distance,moving){
    const phase=distance*11;
    person.limbs.forEach(({leg,knee,arm,side})=>{
      const cycle=phase+(side<0?Math.PI:0);
      leg.rotation.x=moving?Math.sin(cycle)*.42:0;
      knee.rotation.x=moving?Math.max(0,-Math.sin(cycle))*.72:0;
      arm.rotation.x=moving?-Math.sin(cycle)*.28:0;
    });
    person.group.position.y=moving?Math.abs(Math.sin(phase))*.025:0;
  }
  for(const [index,side] of [-1,1].entries()){
    const person=standingPerson(side*6.6,-20.1-index*4,'walking-visitor',index+1);
    walkers.push({...person,distance:index*.4,direction:1});
  }

  function animate(time,viewerPosition){
    const delta=Math.min(Math.max(time-animationTime,0),.1);animationTime=time;
    walkers.forEach((walker,index)=>{
      const nextZ=walker.group.position.z+walker.direction*delta*.32;
      const clear=!viewerPosition||Math.hypot(viewerPosition.x-walker.group.position.x,viewerPosition.z-nextZ)>.95;
      if(clear){walker.distance+=Math.abs(nextZ-walker.group.position.z);walker.group.position.z=nextZ;}
      if(walker.group.position.z>-19.6)walker.direction=-1;
      if(walker.group.position.z<-28.6)walker.direction=1;
      walker.group.rotation.y=walker.direction<0?Math.PI:0;
      walkingPose(walker,walker.distance,clear);
    });
    ceremonyMaster.limbs[1].arm.rotation.x=-1.05+Math.sin(time*.7)*.12;
    ceremonyMaster.head.rotation.x=.045+.025*Math.sin(time*.6);
    seatedMotion.forEach((person,index)=>person.rotation.x=Math.sin(time*.55+index)*.006);
    risingVisitors.forEach((actor,index)=>{
      // Se lever, sortir de la rangée, traverser son intervalle puis revenir s’asseoir.
      const t=(actor.clock+delta)%38;
      const rise=THREE.MathUtils.smoothstep(t,3,5)*(1-THREE.MathUtils.smoothstep(t,33,35));
      const travel=THREE.MathUtils.smoothstep(t,7,16)*(1-THREE.MathUtils.smoothstep(t,23,32));
      const forward=THREE.MathUtils.smoothstep(t,5,7)*(1-THREE.MathUtils.smoothstep(t,32,33));
      const nextX=actor.x+actor.side*2.05*travel,nextZ=actor.z-1.25*forward;
      if(viewerPosition&&Math.hypot(viewerPosition.x-nextX,viewerPosition.z-nextZ)<.95)return;
      actor.clock=t;
      const dx=nextX-actor.group.position.x,dz=nextZ-actor.group.position.z,distance=Math.hypot(dx,dz);
      actor.distance+=distance;
      actor.walking.group.visible=rise>.99;actor.group.children.forEach(mesh=>mesh.visible=rise<=.99);
      actor.walking.group.position.set(nextX,0,nextZ);
      if(distance>.0001)actor.walking.group.rotation.y=Math.atan2(dx,dz);
      walkingPose(actor.walking,actor.distance,distance>.0001);
      actor.group.position.set(nextX,0,nextZ);actor.group.userData.posture=rise>.95?'debout':'assis';
      actor.parts.forEach(({mesh,y,z})=>{
        const targetY=y===.19?.10:y===.44?.34:y===.72?.63:y===.47?.76:y+.28;
        mesh.position.y=THREE.MathUtils.lerp(y,targetY,rise);mesh.position.z=z*(1-rise*.85);
        if(y===.72)mesh.rotation.x=rise*Math.PI*.5;
      });
      actor.group.rotation.y=Math.PI+actor.side*Math.PI*.5*travel;
      actor.group.rotation.x=rise>.95?Math.sin(time*3)*.018*travel:0;
    });
    sparkleSeeds.forEach((p,i)=>{sparklePositions[i*3]=p.x+.12*Math.sin(time*.25+p.phase);sparklePositions[i*3+1]=1+(p.y+time*p.speed)%8.1;sparklePositions[i*3+2]=p.z+.1*Math.cos(time*.22+p.phase);});sparkleGeometry.attributes.position.needsUpdate=true;
    floatingCandles.forEach(({group,y,phase})=>{group.position.y=y+Math.sin(time*.65+phase)*.07;group.rotation.z=Math.sin(time*.4+phase)*.018;});
    flames.forEach((flame,index)=>flame.scale.y=.11*(1+.06*Math.sin(time*5+index*1.7)));
    candleLights.forEach((light,index)=>light.intensity=65*(1+.025*Math.sin(time*3+index*2)));
  }

  const burgundyRobe=mat('#63323e');
  function visitor(x,z,index){
    const person=new THREE.Group();person.name='seated-visitor';person.position.set(x,0,z);person.rotation.y=Math.PI;chapel.add(person);
    const clothes=burgundyRobe;person.userData.outfit='robe bordeaux';
    const skin=mat(['#c5a184','#b98d6a','#82664f','#d1b59a'][index%4]),hair=mat(index%3?'#4b4034':'#aaa390');
    const localBox=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);person.add(mesh);return mesh;};
    localBox(.36,.42,.25,0,1.02,0,clothes);localBox(.34,.12,.36,0,.77,.12,clothes);
    const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,.53,10),clothes);skirt.position.set(0,.47,.17);person.add(skirt);
    localBox(.1,.035,.025,0,1.19,.139,cream);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.14,10,7),skin);head.position.set(0,1.4,.015);person.add(head);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.146,10,6,0,Math.PI*2,0,Math.PI*.55),hair);cap.position.set(0,1.43,.005);person.add(cap);
    for(const side of [-1,1]){
      localBox(.12,.13,.39,side*.105,.72,.19,clothes);localBox(.105,.43,.12,side*.105,.44,.36,clothes);localBox(.13,.08,.24,side*.105,.19,.43,black);
      const arm=localBox(.085,.28,.1,side*.215,1.01,.08,clothes);arm.rotation.x=-.48;
      const forearm=localBox(.08,.085,.25,side*(index%3===0?.09:.19),.87,.2,skin);forearm.rotation.y=side*(index%3===0?.5:0);
    }
    if(index%3===1){const book=localBox(.23,.025,.2,0,.86,.3,cream);book.rotation.x=-.2;}
    if(index===1||index===4||index===11||index===14){
      const walking=standingPerson(x,z,'walking-standing-visitor',index);walking.group.visible=false;
      const actor={group:person,walking,clock:risingVisitors.length*9,distance:0,x,z,side:Math.sign(x),parts:person.children.map(mesh=>({mesh,y:mesh.position.y,z:mesh.position.z}))};
      risingVisitors.push(actor);
    }else seatedMotion.push(person);
  }
  // Vingt chaises individuelles bordeaux et or, regroupées en trois objets instanciés.
  const chairFrames=[],chairVelvet=[],chairRosettes=[];
  const chairDummy=new THREE.Object3D(),velvet=mat('#702c40',.93,0);
  function ceremonialChair(x,z){
    const chairGroup=new THREE.Group();chairGroup.name='burgundy-gold-chair';chairGroup.position.set(x,0,z);chapel.add(chairGroup);
    const instance=(list,w,h,d,dx,y,dz)=>{chairDummy.position.set(x+dx,y,z+dz);chairDummy.rotation.set(0,0,0);chairDummy.scale.set(w,h,d);chairDummy.updateMatrix();list.push(chairDummy.matrix.clone());};
    instance(chairVelvet,.61,.14,.65,0,.57,0);instance(chairVelvet,.49,.55,.11,0,1,.32);
    for(const dx of [-.29,.29]){
      for(const dz of [-.25,.25])instance(chairFrames,.065,.5,.065,dx,.29,dz);
      instance(chairFrames,.06,.86,.065,dx,.92,.33);
      instance(chairFrames,.07,.07,.7,dx,.86,0);
      instance(chairFrames,.055,.28,.055,dx,.73,-.24);
    }
    for(const y of [.7,1.32])instance(chairFrames,.64,.06,.07,0,y,.33);
    instance(chairFrames,.64,.055,.7,0,.48,0);
    instance(chairRosettes,.055,.075,.025,0,1.33,.38);
  }
  let visitorIndex=0;
  for(const z of [-20.5,-23,-25.5,-28])for(const side of [-1,1]){
    const x=side*3.7;obstacles.push({x,z,hx:2.2,hz:.95});
    for(const dx of z===-23||z===-28?[-1,0,1]:[-.8,.8]){ceremonialChair(x+dx,z);visitor(x+dx,z,visitorIndex++);}
  }
  for(const [list,material,geometry] of [[chairFrames,chairGold,new THREE.BoxGeometry(1,1,1)],[chairVelvet,velvet,new THREE.BoxGeometry(1,1,1)],[chairRosettes,chairGold,new THREE.OctahedronGeometry(1)]]){
    const mesh=new THREE.InstancedMesh(geometry,material,list.length);list.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;chapel.add(mesh);
  }
  chapel.userData={shape:'abside elliptique',benches:0,chairs:20,visitors:visitorIndex,walkers:2,risingVisitors:4,ceremonyMaster:true};
  function allowed(x,z){
    if(z>-17.55)return Math.abs(x)<1.58&&z<-11.5;
    const inside=z>=-28?Math.abs(x)<7.35:(x/7.35)**2+((z+28)/8.3)**2<1;
    return inside&&z>-36.3&&!(Math.abs(x)>6.95&&[-20.75,-25.65].some(nz=>Math.abs(z-nz)<1.6))&&![...walkers,...risingVisitors].some(w=>Math.hypot(x-w.group.position.x,z-w.group.position.z)<.52)&&!obstacles.some(o=>Math.abs(x-o.x)<o.hx&&Math.abs(z-o.z)<o.hz);
  }
  return {allowed,animate};
}
