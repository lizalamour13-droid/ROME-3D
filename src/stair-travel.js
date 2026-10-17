import * as THREE from 'three';
import {SPIRALS} from './vertical-routes.js';

// L’escalier avance seulement pendant l’appui sur ↑ / Z ; ↓ permet de reculer.
// Le guidage suit la courbure des marches, sans bouton, trajet automatique ou téléportation.
export function createStairController({scene,camera,walkTo,onExit}){
  const anchors={gallery:{bottom:{x:-5.5,z:7.55,y:0},top:{x:-5.5,z:11.9,y:6.4}},galleryRight:{bottom:{x:5.5,z:7.55,y:0},top:{x:5.5,z:11.9,y:6.4}},crypt:{bottom:{x:1.9,z:-33.1,y:-8},top:{x:1.9,z:-33.1,y:0}}};
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
  let state=null,distance=0,lookYaw=0,lookHeight=0;
  const point=p=>new THREE.Vector3(p.x,p.y,p.z);
  function reset(){state=null;avatar.visible=false;scene.userData.onStairs=false;document.querySelector('#app').classList.remove('on-stairs');}
  function enter(dx,dz,forward){
    if(forward<=0)return false;
    const ground=camera.position.y-1.75;
    for(const [name,ends] of Object.entries(anchors))for(const [end,anchor] of Object.entries(ends)){
      if(Math.abs(ground-anchor.y)>.25||Math.hypot(camera.position.x-anchor.x,camera.position.z-anchor.z)>.9)continue;
      if(name.startsWith('gallery')&&Math.abs(camera.position.x-anchor.x)>.48)continue;
      const s=SPIRALS[name],reverse=name.startsWith('gallery')?end==='top':end==='bottom',radius=(s.inner+s.outer)/2,t=reverse?1:0,a=s.start+t*s.turns*Math.PI*2*(s.direction??1);
      const entrance=new THREE.Vector3(s.x+Math.cos(a)*radius,s.height*t,s.z+Math.sin(a)*radius);
      const toward=new THREE.Vector2(entrance.x-camera.position.x,entrance.z-camera.position.z),motion=new THREE.Vector2(dx,dz);
      if(toward.length()>.05&&toward.normalize().dot(motion.normalize())<.45)continue;
      const path=[new THREE.Vector3(camera.position.x,ground,camera.position.z)];
      if(name==='crypt')path.push(new THREE.Vector3(s.x-s.outer-.5,ground,s.z));

      for(let i=0;i<=480;i++){const u=reverse?1-i/480:i/480,b=s.start+u*s.turns*Math.PI*2*(s.direction??1);path.push(new THREE.Vector3(s.x+Math.cos(b)*radius,s.height*u,s.z+Math.sin(b)*radius));}
      const destination=ends[end==='top'?'bottom':'top'];if(name==='crypt')path.push(new THREE.Vector3(s.x-s.outer-.5,destination.y,s.z));path.push(point(destination));
      const lengths=[0];for(let i=1;i<path.length;i++)lengths.push(lengths.at(-1)+path[i].distanceTo(path[i-1]));
      state={name,s,reverse,path,lengths,cursor:0,heading:camera.rotation.y};lookYaw=0;lookHeight=0;distance=0;avatar.visible=true;scene.userData.onStairs=true;document.querySelector('#app').classList.add('on-stairs');return true;
    }
    return false;
  }
  function sample(cursor){const {path,lengths}=state;let lo=0,hi=lengths.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(lengths[mid]<cursor)lo=mid;else hi=mid;}return path[lo].clone().lerp(path[hi],(cursor-lengths[lo])/(lengths[hi]-lengths[lo]||1));}
  function pose(movement){
    const ground=camera.position.y-1.75,s=state.s,a=Math.atan2(camera.position.z-s.z,camera.position.x-s.x),moving=movement.lengthSq()>.000001;
    avatar.position.set(camera.position.x,ground,camera.position.z);avatar.rotation.set(0,state.heading,0);
    const phase=distance*10;
    legs.forEach(({hip,knee,side})=>{const cycle=phase+(side<0?Math.PI:0);hip.rotation.x=moving?Math.sin(cycle)*.4:0;knee.rotation.x=moving?.12+Math.max(0,-Math.sin(cycle))*.7:0;});
    arms.forEach(({arm,side})=>arm.rotation.x=moving?-Math.sin(phase+(side<0?Math.PI:0))*.25:0);
    avatar.traverse(obj=>obj.layers.set(state.name==='crypt'&&ground<-.15?2:0));
    const direction=(state.reverse?-1:1)*(s.direction??1),behind=a-direction*1.1+lookYaw,radius=Math.hypot(camera.position.x-s.x,camera.position.z-s.z);
    if(radius<s.outer+.1)viewCamera.position.set(s.x+Math.cos(behind)*radius,ground+2.25,s.z+Math.sin(behind)*radius);
    else viewCamera.position.set(camera.position.x-Math.sin(state.heading)*1.1,ground+2.1,camera.position.z-Math.cos(state.heading)*1.1);
    viewCamera.lookAt(camera.position.x,ground+.85+lookHeight,camera.position.z);viewCamera.aspect=camera.aspect;viewCamera.updateProjectionMatrix();
  }
  function move(dx,dz,forward,right,dt){
    if(!state&&!enter(dx,dz,forward))return false;
    const before=camera.position.clone(),nextCursor=THREE.MathUtils.clamp(state.cursor+forward*Math.min(dt,.1)*1.7,0,state.lengths.at(-1)),next=sample(nextCursor);
    if(forward){walkTo(next.x,next.z);if(Math.hypot(camera.position.x-next.x,camera.position.z-next.z)<.006){distance+=forward*before.distanceTo(camera.position);const tangent=sample(Math.min(state.lengths.at(-1),nextCursor+.03)).sub(sample(Math.max(0,nextCursor-.03)));state.heading=Math.atan2(tangent.x,tangent.z);state.cursor=nextCursor;}}
    lookYaw=THREE.MathUtils.clamp(lookYaw+right*dt*.5,-.35,.35);pose(camera.position.clone().sub(before));
    if((forward>0&&state.cursor>=state.lengths.at(-1)-.005)||(forward<0&&state.cursor<=.005)){const heading=state.heading;reset();onExit(heading);}
    return true;
  }
  return {move,reset,avatar,viewCamera,look(x,y){lookYaw=THREE.MathUtils.clamp(lookYaw-x*.001,-.35,.35);lookHeight=THREE.MathUtils.clamp(lookHeight+y*.001,-.35,.35);},get active(){return !!state;}};
}
