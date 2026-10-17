const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const path=require('node:path');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
 const page=await browser.newPage({viewport:{width:1000,height:850}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.ROME_TEST_URL||'http://127.0.0.1:5174/ROME-3D/');await page.waitForFunction(()=>window.room);
 const checks=await page.evaluate(()=>{const architecture=room.scene.getObjectByName('chapel-reference-architecture');let windows=0,statues=0,niches=0;architecture.traverse(m=>{if(m.name==='chapel-recessed-niche')niches++;if(m.name==='chapel-clerestory-window')windows++;if(m.name.startsWith('chapel-statue-'))statues++;});room.camera.position.set(0,1.75,-18);room.camera.lookAt(0,9.7,-25.5);room.renderer.setPixelRatio(.8);document.querySelector('#app').classList.add('visiting');return {windows,statues,niches,dome:!!room.scene.getObjectByName('chapel-blue-dome'),vault:!!room.scene.getObjectByName('chapel-coffered-vault')};});
 if(checks.niches!==4||checks.windows!==12||checks.statues!==4||!checks.dome||!checks.vault)throw Error(JSON.stringify(checks));
 await page.screenshot({path:path.join(__dirname,'../artifacts/plafond-chapelle.png')});await page.evaluate(()=>{room.camera.position.set(5.3,1.75,-18.3);room.camera.lookAt(7.7,3.3,-21.1);});await page.screenshot({path:path.join(__dirname,'../artifacts/niches-chapelle.png')});if(errors.length)throw Error(errors.join());console.log(JSON.stringify({checks,errors}));
}finally{await browser.close();}})();
