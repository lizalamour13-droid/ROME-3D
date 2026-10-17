import * as THREE from 'three';

// Escalier libre et tribune au-dessus de l’entrée de la salle II.
export function createChapelOrgan({scene,camera}){
  const root=new THREE.Group();root.name='chapel-organ-loft';scene.add(root);
  const material=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.48});
  const stone=material('#d3c7b1'),gold=material('#ad8c4d',.65),wood=material('#342b29'),red=material('#542c36'),ivory=material('#e2d7bc'),pipe=material('#b6ad8b',.7);
  const cube=new THREE.BoxGeometry(1,1,1);
  function box(w,h,d,x,y,z,m,parent=root){const o=new THREE.Mesh(cube,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.receiveShadow=true;parent.add(o);return o;}
  function tube(points,r,m=gold){const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),32,r,6,false),m);root.add(mesh);return mesh;}
  const stair={x:-6.5,z0:-30,z1:-19.6,width:1.3,height:4.6,steps:32};
  const run=stair.z1-stair.z0,step=run/stair.steps;
  const steps=new THREE.Group();steps.name='organ-loft-stairs';root.add(steps);
  for(let i=0;i<stair.steps;i++){
    const y=stair.height*(i+1)/stair.steps,z=stair.z0+(i+.5)*step;
    box(stair.width,.14,step+.012,stair.x,y-.07,z,stone,steps);
    box(stair.width,.025,.035,stair.x,y+.012,z-step/2,gold,steps);
  }
  for(const side of [-1,1]){
    const x=stair.x+side*stair.width/2;
    tube([new THREE.Vector3(x,1.02,stair.z0),new THREE.Vector3(x,5.62,stair.z1)],.045);
    for(let i=0;i<=16;i++){const t=i/16;box(.045,.95,.045,x,stair.height*t+.5,stair.z0+t*run,gold);}
  }
  box(10.45,.2,3.2,-.575,4.5,-18.8,stone).name='organ-loft-deck';
  box(1.35,.2,2.5,-6.475,4.5,-18.45,stone);
  box(.08,.8,.7,-5.8,5.02,-20.05,red);
  for(const z of [-20.4,-17.2]){
    const x0=z===-20.4?-5.8:-7.15;
    box(4.65-x0,.65,.09,(4.65+x0)/2,5.02,z,red);
    for(const y of [4.72,5.4])box(4.65-x0,.045,.13,(4.65+x0)/2,y,z,gold);
    for(let x=x0+.2;x<4.65;x+=.5){box(.055,.78,.07,x,5.04,z,ivory);const jewel=new THREE.Mesh(new THREE.OctahedronGeometry(.095),gold);jewel.position.set(x,5.02,z-.06);jewel.scale.z=.3;root.add(jewel);}
  }
  for(const x of [-7.15,4.65]){const depth=x<0?2.5:3.2,z=x<0?-18.45:-18.8;box(.07,.8,depth,x,5.02,z,red);box(.1,.045,depth,x,5.42,z,gold);}
  for(const x of [-3,3]){const light=new THREE.PointLight('#ffe0a8',15,9,2);light.position.set(x,7,-19.3);root.add(light);}
  // Buffet à cinq tourelles, tuyaux ouverts, bouches, couronnes et rinceaux dorés.
  const organ=new THREE.Group();organ.name='gilded-pipe-organ';organ.position.set(0,4.6,-17.85);root.add(organ);
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
  const console=new THREE.Group();console.name='organ-console';console.position.set(0,4.6,-18.75);root.add(console);
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
    const p=camera.position,d=Math.hypot(p.x,p.z+18.75);near=p.y>4.8&&p.y<7.2&&d<3;
    if(near&&!scene.userData.dialogueActive&&!scene.userData.experienceActive){const prompt=document.querySelector('#interaction-prompt');prompt.hidden=false;prompt.textContent=`O · ${playing?'Arrêter':'Jouer de'} l’orgue à tuyaux`;}
    if(context&&playing){const chapel=p.z<-17&&p.y>-1.5;const gain=chapel?Math.min(1,8/Math.max(8,d))*.45:0;const level=Number(document.querySelector('#ambient-volume').value);bus.gain.setTargetAtTime(gain*level*(scene.userData.experienceActive?.12:1),context.currentTime,.45);}
  }
  function surfaceAt(x,z,h){
    if(x>stair.x-.5&&x<stair.x+.5&&z>stair.z0-.25&&z<stair.z1+.1){const height=THREE.MathUtils.clamp((z-stair.z0)/run,0,1)*stair.height;if(Math.abs(height-h)<.3)return {height};}
    if(h>4.3&&x>-6.95&&x<4.45&&z>(x<-5.8?-19.55:-20.2)&&z<-17.4){if(Math.abs(x)<.95&&z>-19.02)return null;return {height:4.6};}
    // Pas de passage au travers ni sous les marches ; l’entrée reste au pied.
    if(Math.abs(x-stair.x)<.75&&z>stair.z0&&z<stair.z1)return null;
    return undefined;
  }
  return {surfaceAt,update,root,stair,get playing(){return playing;},get near(){return near;},get audioState(){if(!context)return null;const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);return {state:context.state,voices:voices.size,gain:bus.gain.value,signal:Math.sqrt(samples.reduce((sum,x)=>sum+x*x,0)/samples.length)};}};
}
