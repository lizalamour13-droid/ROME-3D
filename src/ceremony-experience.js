import * as THREE from 'three';
import {CRYPT} from './vertical-routes.js';

const history='Je suis Simon Pierre, un pêcheur de Galilée devenu apôtre de Jésus. Selon la tradition chrétienne, je suis mort martyr à Rome, au premier siècle, sous le règne de Néron. Au quatrième siècle, une première basilique a été élevée ici, en mémoire de Pierre. La basilique actuelle a ensuite été construite entre 1506 et 1626. Ce sanctuaire rappelle les origines de la communauté chrétienne de Rome.';
const mass=[
  ['Accueil','Bienvenue dans cette courte reconstitution d’une messe. Au nom du Père, et du Fils, et du Saint-Esprit. Amen. Que la paix soit avec vous.','mass-welcome',15],
  ['Lecture · Matthieu 5, 9','Heureux les artisans de paix, car ils seront appelés fils de Dieu. Acclamons la Parole de Dieu. Louange à toi, Seigneur Jésus.','mass-reading',17],
  ['Prière universelle','Prions pour celles et ceux qui souffrent, pour les familles, et pour la paix entre les peuples. Seigneur, écoute notre prière. Prenons maintenant un instant de silence.','mass-intercession',20],
  ['Notre Père · en latin','Pater noster, qui es in caelis… Notre Père, qui es aux cieux… Vous pouvez suivre la prière dans les livrets.','../pater-noster-latin',43],
  ['Bénédiction et envoi','Que le Seigneur vous bénisse et vous garde. Qu’il vous accorde sa paix. Au nom du Père, et du Fils, et du Saint-Esprit. Amen. Allez dans la paix du Christ.','mass-blessing',18]
];
export function createCeremonyExperience({scene,camera,canvas,chapel,prayer,restoreView}){
  const marker=new THREE.Group();marker.name='tomb-interaction';marker.position.set(CRYPT.centerX+2.3,CRYPT.floor,-37.5);marker.userData={dialogueName:'Mémoire de saint Pierre',dialogueRole:'tomb'};scene.add(marker);
  const signCanvas=document.createElement('canvas');signCanvas.width=512;signCanvas.height=256;const ctx=signCanvas.getContext('2d');ctx.fillStyle='#242824';ctx.fillRect(0,0,512,256);ctx.fillStyle='#e4d2a1';ctx.textAlign='center';ctx.font='32px Georgia';ctx.fillText('MÉMOIRE DE PIERRE',256,90);ctx.font='25px Arial';ctx.fillText('Approchez · E',256,155);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(.48,.24),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(signCanvas),side:THREE.DoubleSide}));sign.name='tomb-wall-plaque';sign.position.set(2.1,1.25,0);sign.rotation.y=-Math.PI/2;marker.add(sign);marker.traverse(object=>object.layers.set(2));
  const apparition=new THREE.Group();apparition.name='saint-peter-apparition';apparition.visible=false;scene.add(apparition);
  const ghostMaterials=[];
  function ghost(color){const m=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.18,transparent:true,opacity:0,depthWrite:false,roughness:.75});ghostMaterials.push(m);return m;}
  const ivory=ghost('#dfd6be'),gold=ghost('#b09a60'),skin=ghost('#c6ad8c');
  const add=(geometry,material,x,y,z,parent=apparition)=>{const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);parent.add(m);return m;};
  add(new THREE.CylinderGeometry(.26,.46,1.45,12),ivory,0,.8,0);
  const sash=add(new THREE.BoxGeometry(.18,1.34,.08),gold,.15,.91,.32);sash.rotation.z=-.15;
  add(new THREE.SphereGeometry(.22,12,8),skin,0,1.76,0);
  add(new THREE.SphereGeometry(.23,12,8,0,Math.PI*2,0,Math.PI*.52),ivory,0,1.82,-.02);
  const beard=add(new THREE.ConeGeometry(.16,.31,9),ivory,0,1.56,.13);beard.rotation.z=Math.PI;
  const arm=new THREE.Group();arm.position.set(-.32,1.38,0);apparition.add(arm);
  add(new THREE.CylinderGeometry(.09,.12,.6,8),ivory,0,-.24,0,arm);add(new THREE.SphereGeometry(.09,8,6),skin,0,-.57,0,arm);
  const other=add(new THREE.BoxGeometry(.18,.6,.2),ivory,.35,1.14,0);other.rotation.z=.22;
  for(const dx of [0,.14]){const key=add(new THREE.TorusGeometry(.075,.023,6,16),gold,.36+dx,.95,.18);add(new THREE.BoxGeometry(.035,.34,.035),gold,key.position.x,.73,.18);add(new THREE.BoxGeometry(.11,.04,.04),gold,key.position.x+.03,.59,.18);}
  apparition.traverse(object=>object.layers.set(2));
  const panel=document.createElement('section');panel.id='experience-panel';panel.hidden=true;panel.setAttribute('aria-label','Cérémonie et récit');panel.innerHTML='<small id="experience-kind"></small><h2 id="experience-title"></h2><p id="experience-text" aria-live="polite"></p><div><button id="experience-next">Étape suivante</button><button id="experience-sound" aria-pressed="true">Voix activée</button><button id="experience-close">Reprendre la visite · Échap</button></div><small id="experience-feedback"></small>';document.querySelector('#app').append(panel);
  const audio=new Audio();audio.preload='auto';let state=null,saved=null,index=0,elapsed=0,previous=null,sound=true,failed=false,ending=false;
  function stop(){if(!state)return;audio.pause();audio.removeAttribute('src');audio.load();if(state==='mass')chapel.setCeremony(null);prayer.setDucked(false);scene.userData.experienceActive=false;apparition.visible=false;state=null;panel.hidden=true;document.querySelector('#app').classList.remove('in-experience');restoreView(saved);saved=null;}
  function phase(){
    const item=state==='mass'?mass[index]:['La mémoire de saint Pierre',history,'peter-history',27];elapsed=0;failed=false;ending=false;
    document.querySelector('#experience-kind').textContent=state==='mass'?`MESSE RECONSTITUÉE · ${index+1} / ${mass.length} · VERSION COURTE`:'APPARITION SYMBOLIQUE · RÉCIT HISTORIQUE';
    document.querySelector('#experience-title').textContent=item[0];document.querySelector('#experience-text').textContent=item[1];document.querySelector('#experience-feedback').textContent='Voix de narration synthétique · Sous-titres toujours disponibles';document.querySelector('#experience-next').hidden=state!=='mass';
    if(state==='mass')chapel.setCeremony(index);
    const file=item[2].startsWith('../')?'audio/pater-noster-latin.mp3':`audio/experiences/${item[2]}.mp3`;
    audio.src=`${import.meta.env.BASE_URL}${file}`;audio.currentTime=0;audio.muted=!sound;audio.volume=Number(document.querySelector('#prayer-volume').value);void audio.play().catch(()=>{failed=true;document.querySelector('#experience-feedback').textContent='Le son est indisponible. Le récit continue avec les sous-titres.';});
  }
  function advance(){if(!state)return;if(state==='mass'&&index<mass.length-1){index++;phase();}else if(state==='tomb'){ending=true;elapsed=0;audio.pause();}else stop();}
  function start(kind){
    if(state||!['mass','tomb'].includes(kind))return;
    saved={position:camera.position.clone(),rotation:camera.rotation.clone()};state=kind;index=0;previous=null;scene.userData.experienceActive=true;prayer.setDucked(true);document.exitPointerLock();document.querySelector('#app').classList.add('in-experience');panel.hidden=false;
    if(kind==='mass'){camera.position.set(3.15,1.37,-23);camera.lookAt(0,2.85,-31.5);}else{camera.position.set(CRYPT.view.x,CRYPT.floor+1.75,CRYPT.view.z);camera.lookAt(CRYPT.tomb.x,CRYPT.floor+1.9,CRYPT.tomb.z);apparition.visible=true;}
    phase();document.querySelector('#experience-close').focus();
  }
  audio.addEventListener('error',()=>{if(state){failed=true;document.querySelector('#experience-feedback').textContent='Son indisponible : suivez les sous-titres.';}});
  document.querySelector('#experience-next').addEventListener('click',advance);document.querySelector('#experience-close').addEventListener('click',stop);
  document.querySelector('#experience-sound').addEventListener('click',e=>{sound=!sound;audio.muted=!sound;e.target.textContent=sound?'Voix activée':'Voix coupée';e.target.setAttribute('aria-pressed',String(sound));});
  addEventListener('keydown',e=>{if(state&&e.code==='Escape'){e.preventDefault();stop();}});
  document.addEventListener('visibilitychange',()=>{if(!state)return;if(document.hidden)audio.pause();else if(!ending)void audio.play().catch(()=>failed=true);});
  function update(time){
    const dt=previous===null?0:Math.max(0,Math.min(.1,time-previous));previous=time;if(!state||document.hidden)return;elapsed+=dt;
    if(state==='tomb'){
      const fade=ending?1-THREE.MathUtils.smoothstep(elapsed,0,1.6):THREE.MathUtils.smoothstep(elapsed,0,2.3);
      apparition.position.set(CRYPT.tomb.x,CRYPT.floor-.65+fade*1.5,CRYPT.tomb.z);apparition.rotation.y=.54;ghostMaterials.forEach(m=>m.opacity=fade*.88);arm.rotation.x=-.6+Math.sin(time*.8)*.16;
      if(ending){if(elapsed>=1.6)stop();return;}
    }
    const fallback=(state==='mass'?mass[index][3]:27);
    if((audio.ended&&elapsed>(state==='mass'&&index===2?audio.duration+7:2))||(failed&&elapsed>fallback)||(Number.isFinite(audio.duration)&&elapsed>audio.duration+4))advance();
  }
  return {start,stop,update,audio,get active(){return !!state;},get kind(){return state;},get phase(){return index;}};
}
