const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1000,height:800}});const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(process.env.ROME_TEST_URL||'http://127.0.0.1:5173');
    await page.waitForFunction(()=>window.room?.prayerAudio);
    await page.evaluate(()=>{room.camera.position.set(0,1.75,-18.4);room.camera.lookAt(0,4.3,-33.8);document.querySelector('#app').classList.add('visiting');});
    await page.waitForSelector('#prayer-controls:not([hidden])');
    const before=await page.evaluate(()=>({walker:room.scene.getObjectByName('walking-visitor').position.z,gesture:room.scene.getObjectByName('master-of-ceremonies').children.filter(m=>m.type==='Group').at(-1).rotation.x}));
    await page.waitForFunction(before=>Math.abs(room.scene.getObjectByName('walking-visitor').position.z-before.walker)>.025&&Math.abs(room.scene.getObjectByName('master-of-ceremonies').children.filter(m=>m.type==='Group').at(-1).rotation.x-before.gesture)>.001,before,{timeout:15000});
    await page.click('#prayer-toggle');
    await page.waitForFunction(()=>!room.prayerAudio.paused&&room.prayerAudio.currentTime>.4,{},{timeout:15000});
    const playing=await page.evaluate(()=>({duration:room.prayerAudio.duration,time:room.prayerAudio.currentTime,volume:room.prayerAudio.volume,muted:room.prayerAudio.muted,src:room.prayerAudio.currentSrc,carpet:!!room.scene.getObjectByName('chapel-red-carpet'),chairs:room.scene.getObjectByName('chapel').children.filter(m=>m.name==='burgundy-gold-chair').length,mouldings:room.scene.getObjectByName('chapel-classical-mouldings').children.length}));
    if(!playing.carpet||!playing.src.includes('pater-noster-latin.mp3')||playing.duration<25||playing.duration>90||playing.volume<=0||playing.muted||playing.chairs!==20||playing.mouldings<50)throw Error(JSON.stringify(playing));
    await page.evaluate(()=>{const input=document.querySelector('#prayer-volume');input.value='.2';input.dispatchEvent(new Event('input',{bubbles:true}));});
    if(await page.evaluate(()=>room.prayerAudio.volume)!==.2)throw Error('Volume control failed');
    await page.keyboard.press('KeyP');await page.waitForFunction(()=>room.prayerAudio.paused);
    await page.keyboard.press('KeyP');await page.waitForFunction(()=>!room.prayerAudio.paused);
    await page.screenshot({path:path.join(__dirname,'../artifacts/ceremonie.png')});
    await page.evaluate(()=>{room.reset();});await page.waitForFunction(()=>room.prayerAudio.paused&&document.querySelector('#prayer-controls').hidden);
    if(errors.length)throw Error(errors.join('\n'));
    console.log(JSON.stringify({playing,motion:true,audioPlayback:true,pauseResume:true,volumeControl:true,stopsOutsideChapel:true,javascriptErrors:errors},null,2));
  }finally{await browser.close();}
})();
