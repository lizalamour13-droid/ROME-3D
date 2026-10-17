// Récitation locale : démarrage à l'entrée, atténuation dans le passage et fondu temporel.
export function setupPrayerAudio(){
  const audio=new Audio(`${import.meta.env.BASE_URL}audio/pater-noster-latin.mp3`);audio.loop=true;audio.preload='none';audio.volume=0;
  const panel=document.querySelector('#prayer-controls'),button=document.querySelector('#prayer-toggle'),volume=document.querySelector('#prayer-volume'),feedback=document.querySelector('#audio-feedback');
  let ducked=false;
  let enabled=true,inChapel=false,unlocked=false,pending=false,gain=0,level=Number(volume.value),previousTime=null;
  function label(){button.textContent=enabled&&unlocked?'Couper la prière · P':'Écouter la prière latine · P';button.setAttribute('aria-pressed',String(enabled&&unlocked));}
  async function play(){
    if(pending||!audio.paused||document.hidden)return;pending=true;
    try{await audio.play();feedback.hidden=true;}catch{unlocked=false;label();feedback.textContent='Cliquez sur « Écouter la prière » pour autoriser le son.';feedback.hidden=false;}
    finally{pending=false;}
  }
  // Autoriser cet élément audio pendant le clic d'entrée, sans son hors de la salle.
  document.querySelector('#enter').addEventListener('click',()=>{
    unlocked=true;label();if(!enabled)return;
    if(!inChapel&&gain===0){audio.volume=0;void play().then(()=>{if(!inChapel&&gain===0)audio.pause();});}else void play();
  });
  function toggle(){if(!inChapel)return;enabled=unlocked?!enabled:true;unlocked=true;label();if(enabled)void play();}
  button.addEventListener('click',toggle);volume.addEventListener('input',()=>level=Number(volume.value));
  addEventListener('keydown',e=>{if(e.code==='KeyP'&&!e.repeat&&!(e.target instanceof HTMLInputElement)){e.preventDefault();toggle();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();gain=0;audio.volume=0;previousTime=null;}else if(enabled&&inChapel&&unlocked)void play();});
  audio.addEventListener('error',()=>{unlocked=false;feedback.textContent='Le fichier de prière n’a pas pu être chargé. Réessayez après avoir actualisé la page.';feedback.hidden=false;});
  label();
  return {audio,setDucked(value){ducked=value;},setInChapel(value){inChapel=value;panel.hidden=!value;if(value&&enabled&&unlocked)void play();},update(z,time,presenceScale=1){
    const dt=previousTime===null?0:Math.max(0,Math.min(1,time-previousTime));previousTime=time;
    if(document.hidden)return;
    const presence=Math.max(0,Math.min(1,(-13-z)/5));
    const audible=enabled&&unlocked&&(inChapel||!audio.paused);
    const target=audible&&!ducked?level*presence*presenceScale:0;
    gain+=(target-gain)*(1-Math.exp(-dt/(enabled?1.1:.35)));
    if(gain<.0008&&target===0){gain=0;if(!pending)audio.pause();}
    audio.volume=Math.max(0,Math.min(1,gain));
    if(enabled&&unlocked&&inChapel)void play();
  }};
}
