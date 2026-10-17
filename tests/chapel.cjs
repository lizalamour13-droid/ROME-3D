const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1200,height:900}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:5173');
    await page.waitForFunction(()=>window.room?.scene.getObjectByName('cathedra-petri'));
    const checks=await page.evaluate(()=>{
      const chapel=room.scene.getObjectByName('chapel');
      const floor=room.scene.getObjectByName('chapel-floor');floor.geometry.computeBoundingBox();
      let passage=true;for(let z=-11.6;z>-30.5;z-=.2)passage&&=room.allowed(0,z);
      return {visitors:chapel.children.filter(m=>m.name==='seated-visitor').length,windows:chapel.children.filter(m=>m.name==='chapel-stained-glass').length,chairs:chapel.children.filter(m=>m.name==='burgundy-gold-chair').length,walkers:chapel.children.filter(m=>m.name==='walking-visitor').length,master:!!room.scene.getObjectByName('master-of-ceremonies'),robes:chapel.children.filter(m=>m.name==='seated-visitor'&&m.userData.outfit==='robe bordeaux').length,sparkles:room.scene.getObjectByName('chapel-gold-sparkles').geometry.attributes.position.count,doors:room.scene.children.filter(m=>m.name==='open-door-leaf').length,passage,benchBlocked:!room.allowed(3.7,-23),stageBlocked:!room.allowed(0,-33.5),curveBlocked:!room.allowed(7,-34)&&!room.allowed(0,-38),sideAisle:room.allowed(7.2,-24)&&room.allowed(-7.2,-24),floorBack:floor.geometry.boundingBox.min.y,sconces:chapel.children.filter(m=>m.name==='chapel-candle-sconce').length,baldachinColumns:room.scene.getObjectByName('bernin-baldachin').children.filter(m=>m.name==='baldachin-twisted-column').length};
    });
    if(checks.chairs!==20||checks.walkers!==2||!checks.master||checks.robes!==20||checks.sparkles!==180||checks.sconces!==8||checks.baldachinColumns!==4||checks.visitors!==20||checks.windows!==0||checks.doors!==2||!checks.passage||!checks.benchBlocked||!checks.stageBlocked||!checks.curveBlocked||!checks.sideAisle||checks.floorBack>-36.9)throw Error(JSON.stringify(checks));
    await page.evaluate(()=>{room.camera.position.set(0,1.75,-18.4);room.camera.lookAt(0,4.5,-33.8);document.querySelector('#app').classList.add('visiting');});
    await page.waitForTimeout(500);
    await page.screenshot({path:path.join(__dirname,'../artifacts/salle-chaire.png')});
    await page.setViewportSize({width:640,height:480});
    await page.evaluate(()=>{document.querySelector('#app').classList.remove('visiting');room.reset();room.camera.position.set(0,1.75,-10.6);room.renderer.setPixelRatio(.5);room.renderer.shadowMap.enabled=false;});
    await page.click('#enter');await page.waitForFunction(()=>room.active);
    await page.evaluate(()=>dispatchEvent(new MouseEvent('mousemove',{movementX:room.camera.rotation.y/.002,movementY:room.camera.rotation.x/.002})));
    await page.keyboard.down('KeyZ');
    try{await page.waitForFunction(()=>room.camera.position.z<-18.2,{},{timeout:30000});}finally{await page.keyboard.up('KeyZ');}
    await page.waitForFunction(()=>document.querySelector('footer b').textContent.includes('02 / 02'));
    await page.keyboard.down('KeyS');
    try{await page.waitForFunction(()=>room.camera.position.z>-10.9,{},{timeout:30000});}finally{await page.keyboard.up('KeyS');}
    if(errors.length)throw Error(errors.join('\n'));
    console.log(JSON.stringify({checks,walkThroughDoor:'passed in both directions',javascriptErrors:errors},null,2));
  }finally{await browser.close();}
})();
