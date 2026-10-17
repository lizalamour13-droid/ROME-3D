import * as THREE from 'three';

// Escalier libre et tribune au-dessus de l’entrée de la salle II.
export function createChapelOrgan({scene,camera}){
  const root=new THREE.Group();root.name='chapel-organ-loft';scene.add(root);
  const material=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.48});
  const stone=material('#d3c7b1'),gold=material('#ad8c4d',.65),wood=material('#342b29'),red=material('#542c36'),ivory=material('#e2d7bc'),pipe=material('#b6ad8b',.7);
  const cube=new THREE.BoxGeometry(1,1,1);
  function box(w,h,d,x,y,z,m,parent=root){const o=new THREE.Mesh(cube,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.receiveShadow=true;parent.add(o);return o;}
  function tube(points,r,m=gold){const path=new THREE.CurvePath();for(let i=1;i<points.length;i++)path.add(new THREE.LineCurve3(points[i-1],points[i]));const mesh=new THREE.Mesh(new THREE.TubeGeometry(path,Math.max(32,points.length*2),r,6,false),m);root.add(mesh);return mesh;}
  const level=6.6;
  // L’escalier est regroupé à gauche du sanctuaire : il ne traverse plus les niches des statues.
  const stair={x:-4.65,z:-31.2,inner:.12,outer:1.35,height:level,start:Math.PI/2,turns:2.25,steps:108};
  const span=stair.turns*Math.PI*2,delta=span/stair.steps,wellRadius=stair.outer+.12;
  const steps=new THREE.Group();steps.name='organ-loft-stairs';root.add(steps);
  const tread=new THREE.Shape();tread.absarc(0,0,stair.outer,0,delta);tread.lineTo(stair.inner*Math.cos(delta),stair.inner*Math.sin(delta));tread.absarc(0,0,stair.inner,delta,0,true);tread.closePath();
  const treadGeo=new THREE.ExtrudeGeometry(tread,{depth:.12,bevelEnabled:false,curveSegments:5});treadGeo.rotateX(Math.PI/2);
  const treads=new THREE.InstancedMesh(treadGeo,stone,stair.steps),dummy=new THREE.Object3D();
  for(let i=0;i<stair.steps;i++){dummy.position.set(stair.x,level*i/stair.steps,stair.z);dummy.rotation.set(0,-(stair.start+i*delta),0);dummy.updateMatrix();treads.setMatrixAt(i,dummy.matrix);}steps.add(treads);
  for(const radius of [stair.inner,stair.outer]){
    const points=[];for(let i=0;i<=144;i++){const t=i/144,a=stair.start+t*span;points.push(new THREE.Vector3(stair.x+Math.cos(a)*radius,level*t+1.02,stair.z+Math.sin(a)*radius));}
    const handrail=tube(radius===stair.outer?points.slice(8,-8):points,.04);handrail.name=radius===stair.outer?'organ-stair-outer-handrail':'organ-stair-inner-handrail';
    for(let i=1;i<36;i++){const t=i/36,a=stair.start+t*span;if(radius===stair.outer&&(t<.06||t>.94))continue;box(.045,.92,.045,stair.x+Math.cos(a)*radius,level*t+.52,stair.z+Math.sin(a)*radius,gold);}
  }
  const outer=[new THREE.Vector2(-7.75,-17.2),new THREE.Vector2(7.75,-17.2),new THREE.Vector2(7.75,-28)];
  for(let i=1;i<=128;i++){const a=i/128*Math.PI;outer.push(new THREE.Vector2(7.75*Math.cos(a),-28-8.6*Math.sin(a)));}outer.push(outer[0].clone());
  const inner=[new THREE.Vector2(-6.1,-20.4),new THREE.Vector2(6.1,-20.4),new THREE.Vector2(6.1,-28)];
  for(let i=1;i<=192;i++){const a=i/192*Math.PI,z=-28-7.05*Math.sin(a);let x=6.1*Math.cos(a);if(a>Math.PI/2&&Math.abs(z-stair.z)<wellRadius)x=Math.min(x,stair.x-Math.sqrt(wellRadius**2-(z-stair.z)**2));inner.push(new THREE.Vector2(x,z));}inner.push(inner[0].clone());
  const outline=new THREE.Shape(outer),hole=new THREE.Path(inner);outline.holes.push(hole);
  const deck=new THREE.Mesh(new THREE.ExtrudeGeometry(outline,{depth:.2,bevelEnabled:false}),stone);deck.rotation.x=Math.PI/2;deck.position.y=level;deck.name='chapel-complete-balcony';root.add(deck);
  box(1.65,.025,.75,stair.x,.0125,stair.z+1.6,stone).name='organ-stair-entry-apron';
  box(.9,.2,1.4,stair.x-1.47,level-.1,stair.z,stone).name='organ-stair-top-landing';
  const redRail=red.clone();redRail.side=THREE.DoubleSide;
  function railing(points,opening=false){
    const sections=[];let part=[];
    for(let i=0;i<points.length;i++){const p=points[i],skip=opening&&p.x<stair.x-1&&Math.abs(p.y-stair.z)<.76;if(skip){if(part.length>1)sections.push(part);part=[];}else part.push(p);}if(part.length>1)sections.push(part);
    for(const section of sections){
      const vertices=[],indices=[],top=[],bottom=[];let spacing=0;
      section.forEach((p,i)=>{vertices.push(p.x,level+.2,p.y,p.x,level+.78,p.y);top.push(new THREE.Vector3(p.x,level+1.04,p.y));bottom.push(new THREE.Vector3(p.x,level+.16,p.y));if(i<section.length-1){const k=2*i;indices.push(k,k+1,k+2,k+1,k+3,k+2);}if(i)spacing+=p.distanceTo(section[i-1]);if(spacing>.65||i===0){box(.055,.95,.055,p.x,level+.55,p.y,ivory);spacing=0;}});
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();root.add(new THREE.Mesh(g,redRail));tube(top,.04);tube(bottom,.025);
    }
  }
  railing(outer);railing(inner,true);
  for(const side of [-1,1])tube([new THREE.Vector3(stair.x-1.08,level+1.03,stair.z+side*.7),new THREE.Vector3(stair.x-1.9,level+1.03,stair.z+side*.7)],.04);
  for(const side of [-1,1])for(const z of [-21.5,-26.7]){box(.035,.012,2.8,side*6.9,level+.008,z,gold);}
  for(const x of [-3,3]){const light=new THREE.PointLight('#ffe0a8',15,9,2);light.position.set(x,level+2.4,-19.3);root.add(light);}
  // Buffet à cinq tourelles, tuyaux ouverts, bouches, couronnes et rinceaux dorés.
  const organ=new THREE.Group();organ.name='gilded-pipe-organ';organ.position.set(0,level,-17.85);root.add(organ);
  box(6.4,.4,.65,0,.22,0,wood,organ);
  for(const y of [.05,.45])box(6.6,.08,.76,0,y,0,gold,organ);
  let pipeCount=0;
  for(const [index,x] of [-2.55,-1.25,0,1.25,2.55].entries()){
    const h=index===2?3.85:index%2?2.75:3.3,w=index===2?1.35:1.08;
    box(w,h,.38,x,.5+h/2,.1,red,organ);
    for(const side of [-1,1]){
      box(.1,h+.15,.55,x+side*w/2,.48+h/2,-.01,gold,organ);
      const cap=new THREE.Mesh(new THREE.SphereGeometry(.12,10,6),gold);cap.position.set(x+side*w/2,h+.66,-.02);organ.add(cap);
    }
    for(const y of [.55,h+.52])box(w+.2,.12,.6,x,y,-.02,gold,organ);
    for(let j=0;j<7;j++){
      const px=x+(j-3)*w/8,ph=h-.4-Math.abs(j-3)*.15,r=w/23;
      const p=new THREE.Mesh(new THREE.CylinderGeometry(r,r,ph,10,1,true),pipe);p.position.set(px,.65+ph/2,-.24);organ.add(p);pipeCount++;
      const lip=new THREE.Mesh(new THREE.TorusGeometry(r,.012,4,10),gold);lip.rotation.x=Math.PI/2;lip.position.set(px,.65+ph,-.24);organ.add(lip);
      box(r*1.35,.065,.016,px,.91,-.24-r,wood,organ);
      box(r*1.55,.025,.018,px,.86,-.25-r,gold,organ);
    }
    const arch=[];for(let j=0;j<=24;j++){const a=j*Math.PI/24;arch.push(new THREE.Vector3(x+Math.cos(a)*(w*.56),h+.57+Math.sin(a)*.32,-.24));}
    const crown=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arch),24,.045,6,false),gold);organ.add(crown);
    for(const side of [-1,1]){const leaf=new THREE.Mesh(new THREE.OctahedronGeometry(.17),gold);leaf.position.set(x+side*.2,h+.94,-.24);leaf.scale.set(.6,1.5,.3);leaf.rotation.z=-side*.5;organ.add(leaf);}
  }
  box(.065,.65,.065,0,4.93,0,gold,organ);box(.38,.065,.065,0,5.06,0,gold,organ);
  const console=new THREE.Group();console.name='organ-console';console.position.set(0,level,-18.75);root.add(console);
  box(1.5,.85,.45,0,.43,0,wood,console);box(1.65,.08,.55,0,.9,0,gold,console);
  for(let row=0;row<2;row++)for(let k=0;k<24;k++){
    box(.051,.027,.16,(k-11.5)*.054,.95+row*.09,-.14+row*.13,ivory,console);
    if([1,2,4,5,6].includes(k%7))box(.03,.035,.09,(k-11)*.054,.98+row*.09,-.08+row*.13,wood,console);
  }
  box(1.2,.08,.3,0,.52,-.57,wood,console);
  for(const side of [-1,1])box(.08,.5,.25,side*.47,.25,-.57,gold,console);
  root.userData.pipeCount=pipeCount;
  // Harmoniques de flûtes et principaux, attaque douce et réverbération de nef.
  let context,bus,dry,wet,analyser,playing=false,near=false,next=0,beat=0,timer;
  const voices=new Set(),melody=[60,64,67,72,71,67,69,65,67,64,62,67,65,64,62,60];
  function init(){
    context=new AudioContext();bus=context.createGain();bus.gain.value=0;analyser=context.createAnalyser();analyser.fftSize=256;bus.connect(analyser);analyser.connect(context.destination);
    dry=context.createGain();dry.gain.value=.65;dry.connect(bus);
    const reverb=context.createConvolver(),buffer=context.createBuffer(2,context.sampleRate*2.8,context.sampleRate);let seed=519;
    for(let c=0;c<2;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*Math.exp(-i/context.sampleRate*2.3)*.3;}}
    reverb.buffer=buffer;wet=context.createGain();wet.gain.value=.32;wet.connect(reverb);reverb.connect(bus);
  }
  function note(midi,time,duration,gain){
    const osc=context.createOscillator(),env=context.createGain();
    const real=new Float32Array([0,1,.32,.22,.08,.05,.02]),imag=new Float32Array(real.length);osc.setPeriodicWave(context.createPeriodicWave(imag,real));osc.frequency.value=440*2**((midi-69)/12);
    env.gain.setValueAtTime(0,time);env.gain.linearRampToValueAtTime(gain,time+.12);env.gain.setValueAtTime(gain,time+duration-.15);env.gain.linearRampToValueAtTime(0,time+duration+.6);osc.connect(env);env.connect(dry);env.connect(wet);osc.start(time);osc.stop(time+duration+.65);voices.add(osc);osc.onended=()=>{voices.delete(osc);osc.disconnect();env.disconnect();};
  }
  function schedule(){if(!playing||document.hidden||context.state!=='running')return;while(next<context.currentTime+.3){const index=beat%melody.length;note(melody[index],next,.78,.09);if(beat%4===0){const bass=[36,41,43,36][Math.floor(index/4)];for(const n of [bass,bass+12,bass+19])note(n,next,3,.038);}beat++;next+=.85;}}
  async function toggle(){
    if(!near||scene.userData.experienceActive||scene.userData.dialogueActive)return;
    if(!context)init();await context.resume();playing=!playing;
    if(playing){next=context.currentTime+.05;beat=0;schedule();timer=setInterval(schedule,100);}else{clearInterval(timer);for(const osc of voices)try{osc.stop(context.currentTime+.1);}catch{}bus.gain.setTargetAtTime(0,context.currentTime,.25);}
  }
  addEventListener('keydown',e=>{if(e.code==='KeyO'&&!e.repeat&&!(e.target instanceof HTMLInputElement)){e.preventDefault();void toggle();}});
  document.addEventListener('visibilitychange',()=>{if(context){if(document.hidden)void context.suspend();else if(playing){next=context.currentTime+.05;void context.resume();}}});
  function update(){
    const p=camera.position,d=Math.hypot(p.x,p.z+18.75);near=Math.abs(p.y-(level+1.75))<.7&&d<3;
    if(near&&!scene.userData.dialogueActive&&!scene.userData.experienceActive){const prompt=document.querySelector('#interaction-prompt');prompt.hidden=false;prompt.textContent=`O · ${playing?'Arrêter':'Jouer de'} l’orgue à tuyaux`;}
    if(context&&playing){const chapel=p.z<-17&&p.y>-1.5;const gain=chapel?Math.min(1,8/Math.max(8,d))*.45:0;const level=Number(document.querySelector('#ambient-volume').value);bus.gain.setTargetAtTime(gain*level*(scene.userData.experienceActive?.12:1),context.currentTime,.45);}
  }
  function surfaceAt(x,z,h){
    if(z>-17.2)return undefined;
    const dx=x-stair.x,dz=z-stair.z,r=Math.hypot(dx,dz),a=((Math.atan2(dz,dx)-stair.start)%(Math.PI*2)+Math.PI*2)%(Math.PI*2),candidates=[];
    if(r>stair.inner+.06&&r<stair.outer-.07){for(let k=0;k<=2;k++){const angle=a+k*Math.PI*2;if(angle<=span+.001)candidates.push(level*angle/span);}if(a>Math.PI*2-.12)candidates.push(0);}
    const start=Math.abs(Math.atan2(Math.sin(a),Math.cos(a))),end=Math.abs(Math.atan2(Math.sin(a-span),Math.cos(a-span)));
    if(start<.45&&r>stair.inner+.06&&r<stair.outer+.55&&(r>stair.outer-.15||a>Math.PI*2-.45))candidates.push(0);
    if(end<.35&&r>1.02&&r<2.12)candidates.push(level);
    const close=candidates.filter(y=>Math.abs(y-h)<.3);if(close.length)return {height:close.sort((a,b)=>Math.abs(a-h)-Math.abs(b-h))[0]};
    if(h>level-.3){
      const outside=z>=-28?Math.abs(x)<7.62&&z<-17.4:(x/7.62)**2+((z+28)/8.4)**2<1;
      const inVoid=z>=-28?Math.abs(x)<6.2&&z<-20.2:(x/6.2)**2+((z+28)/7.15)**2<1;
      if(outside&&!inVoid&&r>wellRadius+.02){if(Math.abs(x)<3.45&&z>-18.4||Math.abs(x)<.95&&z>-19.02)return null;return {height:level};}
      return null;
    }
    if(r<wellRadius)return null;
    return undefined;
  }
  return {surfaceAt,update,root,stair,get playing(){return playing;},get near(){return near;},get audioState(){if(!context)return null;const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);return {state:context.state,voices:voices.size,gain:bus.gain.value,signal:Math.sqrt(samples.reduce((sum,x)=>sum+x*x,0)/samples.length)};}};
}
