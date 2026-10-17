// Fichier local : voix neuronale synthétique, récitation latine, aucun service ni microphone utilisé.
export function setupPrayerAudio(){
  const audio=new Audio(`${import.meta.env.BASE_URL}audio/pater-noster-latin.mp3`);
  audio.loop=true;audio.preload='none';audio.volume=.45;
  const panel=document.querySelector('#prayer-controls'),button=document.querySelector('#prayer-toggle');
  const volume=document.querySelector('#prayer-volume'),feedback=document.querySelector('#audio-feedback');
  let enabled=false,inChapel=false;
  function updateButton(){button.textContent=enabled?'Couper la prière · P':'Écouter la prière latine · P';button.setAttribute('aria-pressed',String(enabled));}
  async function play(){
    try{await audio.play();feedback.hidden=true;}catch{
      enabled=false;updateButton();feedback.textContent='La lecture n’a pas démarré. Cliquez à nouveau sur « Écouter la prière ».';feedback.hidden=false;
    }
  }
  function toggle(){
    if(!inChapel)return;
    enabled=!enabled;updateButton();if(enabled)void play();else audio.pause();
  }
  button.addEventListener('click',toggle);
  volume.addEventListener('input',()=>audio.volume=Number(volume.value));
  addEventListener('keydown',event=>{if(event.code==='KeyP'&&!event.repeat&&!(event.target instanceof HTMLInputElement)){event.preventDefault();toggle();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();else if(enabled&&inChapel)void play();});
  audio.addEventListener('error',()=>{enabled=false;updateButton();feedback.textContent='Le fichier de prière n’a pas pu être chargé. Réessayez après avoir actualisé la page.';feedback.hidden=false;});
  return {audio,setInChapel(value){inChapel=value;panel.hidden=!value;if(!value)audio.pause();else if(enabled&&!document.hidden)void play();}};
}
