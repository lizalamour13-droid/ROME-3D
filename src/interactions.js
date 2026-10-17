import * as THREE from 'three';

export function setupInteractions({scene,camera,canvas}){
  const prompt=document.querySelector('#interaction-prompt'),panel=document.querySelector('#dialogue-panel'),title=document.querySelector('#dialogue-title'),text=document.querySelector('#dialogue-text'),choices=document.querySelector('#dialogue-choices');
  const actors=[];scene.traverse(obj=>{if(obj.userData.dialogueName)actors.push(obj);});
  const scripts={
    guide:{hello:'Bonjour ! Prenez le temps de découvrir la place. Que souhaitez-vous savoir ?',options:[['Où est l’entrée de la basilique ?','Regardez la grande façade. La porte ouverte, à droite du centre, permet de retrouver la salle des marbres.'],['Que peut-on voir sur cette place ?','L’obélisque se trouve au centre, entre les deux fontaines. Les colonnades dessinent les deux bras de la place.'],['Un endroit pour se reposer ?','Vous trouverez des bancs le long des côtés de la place, près des jardinières.']]},
    priest:{hello:'Bonjour, soyez les bienvenus. Souhaitez-vous découvrir le sanctuaire ou écouter la prière ?',options:[['Où est le tombeau de saint Pierre ?','Dans cette reconstitution, le monument se trouve près de l’autel, derrière l’estrade. Approchez par un côté pour mieux le voir.'],['Écouter ou arrêter la prière','La récitation du Pater Noster peut accompagner votre visite. Vous pouvez aussi la régler avec la touche P.','prayer'],['Parlez-moi de la coupole','Levez les yeux : les nervures dorées soulignent la coupole bleue et la verrière laisse apparaître le ciel.']]},
    visitor:{hello:'Bonjour ! C’est agréable de faire une pause ici. Vous aussi, vous visitez la place ?',options:[['Que préférez-vous ici ?','J’aime regarder la coupole depuis le fond de la place, avec les fontaines au premier plan.'],['Avez-vous visité les salles ?','Oui, la première salle abrite une maquette. La seconde possède un sanctuaire sous un baldaquin.']]},
    family:{hello:'Bonjour ! Nous faisons une petite promenade en famille.',options:[['La promenade se passe bien ?','Très bien, merci ! Nous avançons tranquillement avec la poussette.'],['Un conseil pour la visite ?','Profitez des bancs pour faire une pause, puis éloignez-vous un peu pour admirer toute la façade.']]}
  };
  let nearest=null,current=null,wasLocked=false;
  function close(){if(!current)return;current.userData.isConversing=false;current=null;panel.hidden=true;document.querySelector('#app').classList.remove('in-dialogue');scene.userData.dialogueActive=false;if(wasLocked)Promise.resolve(canvas.requestPointerLock()).catch(()=>{});}
  function answer(index){if(!current)return;const option=scripts[current.userData.dialogueRole].options[index];if(!option)return;text.textContent=option[1];if(option[2]==='prayer')document.querySelector('#prayer-toggle').click();}
  function open(){if(!nearest)return;current=nearest;current.userData.isConversing=true;scene.userData.dialogueActive=true;wasLocked=document.pointerLockElement===canvas;if(wasLocked)document.exitPointerLock();title.textContent=current.userData.dialogueName;text.textContent=scripts[current.userData.dialogueRole].hello;choices.replaceChildren();scripts[current.userData.dialogueRole].options.forEach((option,i)=>{const button=document.createElement('button');button.type='button';button.textContent=`${i+1}. ${option[0]}`;button.addEventListener('click',()=>answer(i));choices.append(button);});panel.hidden=false;document.querySelector('#app').classList.add('in-dialogue');prompt.hidden=true;choices.querySelector('button')?.focus();}
  document.querySelector('#dialogue-close').addEventListener('click',close);
  addEventListener('keydown',event=>{if(event.repeat||event.target instanceof HTMLTextAreaElement)return;if(event.code==='KeyE'){event.preventDefault();current?close():open();}else if(current&&/^Digit[123]$/.test(event.code)){event.preventDefault();answer(Number(event.code.at(-1))-1);}else if(current&&event.code==='Escape'){wasLocked=false;close();}});
  const position=new THREE.Vector3();
  function update(){
    if(current){if(camera.position.distanceTo(current.getWorldPosition(position))>5){wasLocked=false;close();}return;}
    nearest=null;let best=2.8;
    for(const actor of actors){const sameArea=(camera.position.z<-17)===(actor.position.z<-17);if(!sameArea)continue;actor.getWorldPosition(position);const distance=Math.hypot(position.x-camera.position.x,position.z-camera.position.z);if(distance<best){best=distance;nearest=actor;}}
    prompt.hidden=!nearest;if(nearest)prompt.textContent=`E · Parler à ${nearest.userData.dialogueName}`;
  }
  return {update,get open(){return !!current;},get nearby(){return nearest?.userData.dialogueName??null;}};
}
