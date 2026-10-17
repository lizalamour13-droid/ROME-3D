import * as THREE from 'three';
import {SPIRALS} from './vertical-routes.js';

// Petit public de musée : les trajets restent à distance des œuvres et des colonnes.
export function createInteriorVisitors(scene){
  const root=new THREE.Group();root.name='marble-room-visitors';scene.add(root);
  const clothes=['#544f53','#6a3442','#596154','#5d5261','#635746','#343b43'];
  const material=color=>new THREE.MeshStandardMaterial({color,roughness:.9});
  const skin=material('#bf9c7e'),shoes=material('#302d29');
  function person(index){
    const group=new THREE.Group();group.name='interior-visitor';root.add(group);
    const fabric=material(clothes[index%clothes.length]),hair=material(index%2?'#514134':'#8d8171');
    const mesh=(geo,mat,x,y,z,parent=group)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;};
    mesh(new THREE.CylinderGeometry(.2,.23,.62,10),fabric,0,1.05,0);
    const head=mesh(new THREE.SphereGeometry(.145,10,7),skin,0,1.58,0);
    mesh(new THREE.SphereGeometry(.15,10,6,0,Math.PI*2,0,Math.PI*.55),hair,0,1.62,-.01);
    const limbs=[];
    for(const side of [-1,1]){
      const leg=new THREE.Group();leg.position.set(side*.11,.78,0);group.add(leg);
      mesh(new THREE.BoxGeometry(.13,.68,.15),fabric,0,-.34,0,leg);
      mesh(new THREE.BoxGeometry(.16,.1,.25),shoes,0,-.73,.04,leg);
      const arm=new THREE.Group();arm.position.set(side*.24,1.3,0);group.add(arm);
      mesh(new THREE.BoxGeometry(.11,.45,.13),fabric,0,-.2,0,arm);
      mesh(new THREE.SphereGeometry(.06,8,5),skin,0,-.46,0,arm);
      limbs.push({leg,arm,side});
    }
    return {group,head,limbs};
  }
  const watchers=[
    [2.75,.3,0,1.65,0,'maquette'],
    [-6.6,-6.5,-8.3,4.18,-6.5,'tableau'],
    [6.65,.5,8.3,4.18,.5,'tableau'],
    [-6.65,4,-8.05,2.7,4,'sculpture'],
    [6.6,-3,8.05,2.7,-3,'sculpture']
  ].map(([x,z,tx,ty,tz,interest],i)=>{
    const actor=person(i);actor.group.position.set(x,0,z);actor.group.rotation.y=Math.atan2(tx-x,tz-z);
    actor.head.rotation.x=-Math.atan2(ty-1.58,Math.hypot(tx-x,tz-z))*.38;
    actor.group.userData.interest=interest;return actor;
  });
  const route=[[.75,-18.5],[.75,-9],[5,-9],[5,3.5],[-5,3.5],[-5,-9],[-.75,-9],[-.75,-18.5]];
  const walkers=[0,4].map((target,i)=>{const actor=person(i+5);actor.group.name='inter-room-visitor';actor.group.position.set(...[route[target][0],0,route[target][1]]);return {...actor,target:(target+1)%route.length,distance:0};});
  // Deux visiteurs suivent le même circuit, espacés : montée à gauche, galerie, descente à droite.
  const balconyPath=[];
  function point(x,y,z){balconyPath.push(new THREE.Vector3(x,y,z));}
  function helix(s,reverse=false){const radius=(s.inner+s.outer)/2;for(let i=0;i<=240;i++){const t=reverse?1-i/240:i/240,a=s.start+t*s.turns*Math.PI*2*(s.direction??1);point(s.x+Math.cos(a)*radius,s.height*t,s.z+Math.sin(a)*radius);}}
  point(-5.5,0,7.5);helix(SPIRALS.gallery);point(-5.5,6.4,11.55);
  point(-7.3,6.4,11.55);point(-7.3,6.4,-11.1);point(7.3,6.4,-11.1);point(7.3,6.4,11.55);point(5.5,6.4,11.55);
  helix(SPIRALS.galleryRight,true);point(5.5,0,7.5);point(-5.5,0,7.5);
  const lengths=[0];for(let i=1;i<balconyPath.length;i++)lengths.push(lengths.at(-1)+balconyPath[i].distanceTo(balconyPath[i-1]));const total=lengths.at(-1);
  function sample(cursor){let lo=0,hi=lengths.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(lengths[mid]<cursor)lo=mid;else hi=mid;}return balconyPath[lo].clone().lerp(balconyPath[hi],(cursor-lengths[lo])/(lengths[hi]-lengths[lo]||1));}
  const balconyVisitors=[.04,.53].map((fraction,i)=>{const actor=person(i+7);actor.group.name='balcony-walking-visitor';actor.group.userData.interest='balcons';const cursor=fraction*total;actor.group.position.copy(sample(cursor));return {...actor,cursor,distance:0};});
  let previous=null;
  function update(time,viewer){
    const dt=previous===null?0:Math.max(0,Math.min(.1,time-previous));previous=time;
    watchers.forEach((a,i)=>{a.group.rotation.z=Math.sin(time*.55+i)*.006;a.limbs[0].arm.rotation.x=-.18+Math.sin(time*.4+i)*.04;});
    for(const actor of walkers){
      const [x,z]=route[actor.target],dx=x-actor.group.position.x,dz=z-actor.group.position.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*.55);
      const nx=actor.group.position.x+dx/(d||1)*step,nz=actor.group.position.z+dz/(d||1)*step;
      const clear=(!viewer||Math.abs(viewer.y-1.75)>.8||Math.hypot(nx-viewer.x,nz-viewer.z)>.85)&&!walkers.some(a=>a!==actor&&Math.hypot(nx-a.group.position.x,nz-a.group.position.z)<.65);
      if(clear){actor.group.position.set(nx,0,nz);actor.distance+=step;if(d<.06)actor.target=(actor.target+1)%route.length;}
      actor.group.rotation.y=Math.atan2(dx,dz);
      actor.limbs.forEach(({leg,arm,side})=>{const swing=clear?Math.sin(actor.distance*10+side*Math.PI/2):0;leg.rotation.x=swing*.35;arm.rotation.x=-swing*.26;});
    }
    for(const actor of balconyVisitors){
      const cursor=(actor.cursor+dt*.48)%total,next=sample(cursor),nearViewer=viewer&&Math.abs(next.y-(viewer.y-1.75))<1.8&&Math.hypot(next.x-viewer.x,next.z-viewer.z)<.65;
      const nearOther=balconyVisitors.some(other=>other!==actor&&next.distanceTo(other.group.position)<.7);
      const clear=!nearViewer&&!nearOther;
      if(clear){actor.distance+=next.distanceTo(actor.group.position);actor.cursor=cursor;actor.group.position.copy(next);}
      const tangent=sample((actor.cursor+.05)%total).sub(actor.group.position);actor.group.rotation.y=Math.atan2(tangent.x,tangent.z);
      actor.limbs.forEach(({leg,arm,side})=>{const swing=clear?Math.sin(actor.distance*10+side*Math.PI/2):0;leg.rotation.x=swing*.34;arm.rotation.x=-swing*.25;});
    }

  }
  return {update,balconyVisitors,blocked(x,z,height=0){return [...watchers,...walkers,...balconyVisitors].some(a=>Math.abs(a.group.position.y-height)<1.5&&Math.hypot(x-a.group.position.x,z-a.group.position.z)<.43);}};
}
