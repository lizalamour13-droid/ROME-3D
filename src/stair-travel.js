import * as THREE from 'three';
import {SPIRALS} from './vertical-routes.js';

// Le personnage parcourt les marches avec le contrôleur de collisions du joueur.
// La caméra de visite reste sa position réelle ; seule la caméra de rendu le suit.
export function createStairTravel({scene,camera,walkTo,onFinish}){
  const anchors={gallery:{bottom:{x:-5.5,z:7.45,y:0},top:{x:-5.5,z:11.5,y:6.4}},galleryRight:{bottom:{x:5.5,z:7.45,y:0},top:{x:5.5,z:11.5,y:6.4}},crypt:{bottom:{x:2.65,z:-34.25,y:-8},top:{x:2.6,z:-34,y:0}}};
  for(const [name,ends] of Object.entries(anchors))for(const [end,point] of Object.entries(ends)){
    const marker=new THREE.Group();marker.name=`stair-access-${name}-${end}`;marker.position.set(point.x,point.y,point.z);
    marker.userData={dialogueName:name.startsWith('gallery')?'Escalier des balcons':'Escalier de la crypte',dialogueRole:`stairs-${name}-${end}`,interactionRadius:name==='crypt'&&end==='top'?1.05:1.3};scene.add(marker);
    // Cartels aux paliers d’arrivée ; les deux entrées possèdent déjà leur panneau.
    if(name.startsWith('gallery')&&end==='top'||name==='crypt'&&end==='bottom'){
      const plate=new THREE.Mesh(new THREE.BoxGeometry(.28,.035,.2),new THREE.MeshStandardMaterial({color:'#a28b51',metalness:.4,roughness:.6}));plate.position.y=.9;marker.add(plate);
      const pole=new THREE.Mesh(new THREE.CylinderGeometry(.02,.035,.9,8),plate.material);pole.position.y=.45;marker.add(pole);
      const offset=name==='crypt'?{x:0,z:.55}:{x:Math.sign(point.x)*.65,z:0};plate.position.x=pole.position.x=offset.x;plate.position.z=pole.position.z=offset.z;
      if(name==='crypt')marker.traverse(obj=>obj.layers.set(2));
    }
  }
  const avatar=new THREE.Group();avatar.name='player-stair-avatar';avatar.visible=false;scene.add(avatar);
  const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.9});
  const robe=mat('#673442'),pants=mat('#333a3b'),skin=mat('#bd9675'),hair=mat('#493b30'),gold=mat('#a28b51'),shoe=mat('#252824');
  const add=(geometry,material,x,y,z,parent=avatar)=>{const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
  add(new THREE.BoxGeometry(.4,.55,.25),robe,0,1.1,0);
  add(new THREE.BoxGeometry(.055,.5,.03),gold,-.13,1.1,-.14);
  add(new THREE.SphereGeometry(.15,12,8),skin,0,1.58,0);
  add(new THREE.SphereGeometry(.155,12,8,0,Math.PI*2,0,Math.PI*.56),hair,0,1.62,-.015);
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const hip=new THREE.Group();hip.position.set(side*.11,.83,0);avatar.add(hip);
    add(new THREE.BoxGeometry(.13,.36,.15),pants,0,-.18,0,hip);
    const knee=new THREE.Group();knee.position.y=-.36;hip.add(knee);
    add(new THREE.BoxGeometry(.12,.35,.14),pants,0,-.175,0,knee);
    add(new THREE.BoxGeometry(.16,.1,.25),shoe,0,-.4,.05,knee);legs.push({hip,knee,side});
    const arm=new THREE.Group();arm.position.set(side*.245,1.32,0);avatar.add(arm);
    add(new THREE.BoxGeometry(.11,.38,.13),robe,0,-.18,0,arm);
    const elbow=new THREE.Group();elbow.position.y=-.36;arm.add(elbow);
    add(new THREE.BoxGeometry(.1,.24,.12),robe,0,-.1,0,elbow);add(new THREE.SphereGeometry(.057,8,6),skin,0,-.24,0,elbow);elbow.rotation.x=-.25;arms.push({arm,side});
  }
  const viewCamera=new THREE.PerspectiveCamera(78,camera.aspect,.07,300);viewCamera.rotation.order='YXZ';viewCamera.layers.enable(2);
  const panel=document.createElement('aside');panel.id='stair-travel-panel';panel.hidden=true;panel.innerHTML='<b id="stair-travel-title"></b><progress id="stair-travel-progress" max="1" value="0" aria-label="Progression sur l’escalier"></progress><small>Votre personnage suit les marches · Retour à la visite libre à l’arrivée</small><button id="stair-travel-stop">Arrêter ici · Échap</button>';document.querySelector('#app').append(panel);
  let state=null,path=[],index=1,distance=0,total=1;
  const point=p=>new THREE.Vector3(p.x,p.y,p.z);
  function finish(arrived=false){
    if(!state)return;const previous=state;state=null;avatar.visible=false;scene.userData.stairTravelActive=false;panel.hidden=true;document.querySelector('#app').classList.remove('in-stair-travel');
    onFinish(arrived?previous:null);
  }
  function start(action){
    if(state||scene.userData.experienceActive)return false;
    const [,name,end]=action.split(':');if(!anchors[name]?.[end])return false;
    const anchor=anchors[name][end],ground=camera.position.y-1.75;
    if(Math.abs(ground-anchor.y)>.3||Math.hypot(camera.position.x-anchor.x,camera.position.z-anchor.z)>1.4)return false;
    const s=SPIRALS[name],reverse=name.startsWith('gallery')?end==='top':end==='bottom',radius=(s.inner+s.outer)/2;
    path=[new THREE.Vector3(camera.position.x,ground,camera.position.z),point(anchor)];
    // Le palier droit de la crypte évite la colonne du baldaquin.
    if(name==='crypt')path.push(new THREE.Vector3(2.4,ground,s.z));
    for(let i=0;i<=480;i++){const t=reverse?1-i/480:i/480,a=s.start+t*s.turns*Math.PI*2*(s.direction??1);path.push(new THREE.Vector3(s.x+radius*Math.cos(a),s.height*t,s.z+radius*Math.sin(a)));}
    const destination=anchors[name][end==='top'?'bottom':'top'];
    if(name==='crypt')path.push(new THREE.Vector3(2.4,destination.y,s.z));path.push(point(destination));
    total=path.reduce((sum,p,i)=>sum+(i?p.distanceTo(path[i-1]):0),0);index=1;distance=0;
    document.querySelector('#status').textContent='';state={name,end,reverse,heading:camera.rotation.y};scene.userData.stairTravelActive=true;avatar.visible=true;panel.hidden=false;document.querySelector('#app').classList.add('in-stair-travel');document.exitPointerLock();
    document.querySelector('#stair-travel-title').textContent=(destination.y>ground?'Montée':'Descente')+(name.startsWith('gallery')?' · Escalier des balcons':' · Escalier de la crypte');
    pose(new THREE.Vector3(0,0,0));return true;
  }
  function pose(movement){
    if(!state)return;
    const ground=camera.position.y-1.75,s=SPIRALS[state.name],a=Math.atan2(camera.position.z-s.z,camera.position.x-s.x);
    if(movement.lengthSq()>.000001)state.heading=Math.atan2(movement.x,movement.z);
    avatar.position.set(camera.position.x,ground,camera.position.z);avatar.rotation.set(0,state.heading,0);
    const moving=movement.lengthSq()>.000001,phase=distance*10;
    legs.forEach(({hip,knee,side})=>{const cycle=phase+(side<0?Math.PI:0);hip.rotation.x=moving?Math.sin(cycle)*.4:0;knee.rotation.x=moving?.18+Math.max(0,-Math.sin(cycle))*.75:0;});
    arms.forEach(({arm,side})=>arm.rotation.x=moving?-Math.sin(phase+(side<0?Math.PI:0))*.25:0);
    avatar.traverse(obj=>obj.layers.set(state.name==='crypt'&&ground<-.15?2:0));
    const direction=(state.reverse?-1:1)*(s.direction??1),behind=a-direction*1.1,radius=Math.hypot(camera.position.x-s.x,camera.position.z-s.z);
    // Dans le puits, la caméra suit la courbe et reste entre les deux garde-corps.
    if(radius<s.outer+.1){viewCamera.position.set(s.x+Math.cos(behind)*radius,ground+2.25,s.z+Math.sin(behind)*radius);}
    else viewCamera.position.set(camera.position.x-Math.sin(state.heading)*.95,ground+2.25,camera.position.z-Math.cos(state.heading)*.95);
    viewCamera.lookAt(camera.position.x,ground+.85,camera.position.z);viewCamera.aspect=camera.aspect;viewCamera.updateProjectionMatrix();
  }
  function update(dt){
    if(!state||document.hidden)return;
    const before=camera.position.clone();let budget=Math.max(0,Math.min(.1,dt))*1.3;
    while(budget>.00001&&state){
      if(index>=path.length){finish(true);break;}
      const current=new THREE.Vector3(camera.position.x,camera.position.y-1.75,camera.position.z),target=path[index],length=current.distanceTo(target);
      if(Math.hypot(current.x-target.x,current.z-target.z)<.009){index++;continue;}
      const step=Math.min(length,budget),next=current.clone().lerp(target,step/(length||1));walkTo(next.x,next.z);
      if(Math.hypot(camera.position.x-next.x,camera.position.z-next.z)>.005){finish();document.querySelector('#status').textContent='Le passage est occupé. Rapprochez-vous du palier puis réessayez avec E.';break;}
      distance+=step;budget-=step;
    }
    pose(camera.position.clone().sub(before));document.querySelector('#stair-travel-progress').value=Math.min(1,distance/total);
  }
  document.querySelector('#stair-travel-stop').addEventListener('click',()=>finish());
  addEventListener('keydown',event=>{if(event.code==='Escape'&&state){event.preventDefault();finish();}});
  return {start,update,stop:()=>finish(),avatar,viewCamera,get active(){return !!state;},get progress(){return distance/total;}};
}
