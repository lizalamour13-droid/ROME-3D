// Enregistrements naturels locaux (CC0 / domaine public), crédits dans public/audio/ambient/README.md.
export function setupAmbientAudio({enter,prayerAudio,exterior}){
  const panel=document.querySelector('#ambient-controls');
  const button=document.querySelector('#ambient-toggle'),volume=document.querySelector('#ambient-volume'),feedback=document.querySelector('#ambient-feedback');
  const tracks=Object.fromEntries(['birds','stream','wind','conversation','music'].map(name=>{const audio=new Audio(`${import.meta.env.BASE_URL}audio/ambient/${name}.mp3`);audio.loop=true;audio.preload='none';audio.volume=0;return [name,audio];}));
  const musicEnabled=document.querySelector('#music-enabled');
  let enabled=false,chosen=false,level=.45;
  function label(){button.textContent=enabled?'Couper les ambiances · M':'Activer les ambiances · M';button.setAttribute('aria-pressed',String(enabled));}
  async function play(){
    const results=await Promise.allSettled(Object.values(tracks).map(audio=>audio.play()));
    if(results.some(r=>r.status==='rejected')){enabled=false;Object.values(tracks).forEach(a=>a.pause());label();feedback.hidden=false;feedback.textContent='Cliquez sur « Activer les ambiances » pour lancer le son.';}else feedback.hidden=true;
  }
  function toggle(){panel.hidden=false;chosen=true;enabled=!enabled;label();if(enabled)void play();else Object.values(tracks).forEach(a=>a.pause());}
  button.addEventListener('click',toggle);volume.addEventListener('input',()=>level=Number(volume.value));
  enter.addEventListener('click',()=>{panel.hidden=false;if(!chosen){enabled=true;label();}if(enabled)void play();});
  addEventListener('keydown',e=>{if(e.code==='KeyM'&&!e.repeat&&!(e.target instanceof HTMLInputElement)){e.preventDefault();toggle();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)Object.values(tracks).forEach(a=>a.pause());else if(enabled)void play();});
  function update(position,experienceActive=false){
    if(!enabled||document.hidden)return;
    const outside=Math.max(0,Math.min(1,(position.z-14)/5)),chapel=position.z<-17;
    const distance=(x,z)=>Math.hypot(position.x-x,position.z-z);
    const nearFountain=outside?Math.max(...[-15,15].map(x=>1/(1+(distance(x,66)/8)**2))):0;
    const targets={music:musicEnabled.checked?(prayerAudio.paused?.2:.04):0,conversation:outside*exterior.conversationGain(position)*.45,birds:outside*.28,stream:nearFountain*.5,wind:chapel?(prayerAudio.paused?.025:.008):.04+outside*.12};
    for(const [name,audio] of Object.entries(tracks))audio.volume+=((targets[name]*level*(experienceActive?.08:1))-audio.volume)*.08;
  }
  return {tracks,update,get enabled(){return enabled;}};
}
