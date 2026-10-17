const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
 const page=await browser.newPage({viewport:{width:320,height:240}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.ROME_TEST_URL||'http://127.0.0.1:5174/ROME-3D/');await page.waitForFunction(()=>window.room?.verticalRoutes);
 await page.evaluate(()=>{room.renderer.setPixelRatio(.4);room.renderer.shadowMap.enabled=false;});
 const layout=await page.evaluate(()=>{const s=room.scene,tomb=s.getObjectByName('saint-peter-tomb'),crypt=s.getObjectByName('saint-peter-crypt');return {tombInCrypt:tomb.parent===crypt,tombY:tomb.position.y,tombZ:tomb.position.z,cryptCandles:s.getObjectsByProperty('name','crypt-candle').length,spiralCandles:s.getObjectsByProperty('name','spiral-candle').length,pitHole:s.getObjectByName('chapel-floor').geometry.parameters.shapes.holes.length,balconies:!!s.getObjectByName('marble-room-upper-balconies'),aboveTombPrompt:room.interactions.nearby};});
 assert(layout.tombInCrypt&&layout.tombY<-7&&layout.tombZ<-38&&layout.cryptCandles>=6&&layout.spiralCandles>=6&&layout.pitHole===1&&layout.balconies);
 await page.click('#enter');await page.waitForFunction(()=>room.active);
 // Quelques marches franchies au vrai clavier : la hauteur doit changer sans touche spéciale.
 await page.evaluate(()=>{const s=room.verticalRoutes.spirals.gallery;room.camera.position.set(s.x,1.75,s.z-1.15);dispatchEvent(new MouseEvent('mousemove',{movementX:(room.camera.rotation.y+Math.PI/2)/.002,movementY:room.camera.rotation.x/.002}));});
 await page.keyboard.down('KeyZ');try{await page.waitForFunction(()=>room.camera.position.y>1.82,null,{timeout:30000});}finally{await page.keyboard.up('KeyZ');}
 await page.keyboard.press('Escape');
 // Traversée intégrale par le même contrôleur de collisions que ZQSD, à petits pas.
 const paths=await page.evaluate(()=>{
   room.renderer.setAnimationLoop(null);const report={};
   function travel(name,reverse=false){const s=room.verticalRoutes.spirals[name],radius=(s.inner+s.outer)/2,total=s.turns*Math.PI*2;const heights=[];let maxJump=0,blocked=0;for(let i=0;i<=960;i++){const t=reverse?1-i/960:i/960,a=s.start+t*total,x=s.x+Math.cos(a)*radius,z=s.z+Math.sin(a)*radius,old=room.camera.position.y;room.walkTo(x,z);if(Math.hypot(room.camera.position.x-x,room.camera.position.z-z)>.001)blocked++;maxJump=Math.max(maxJump,Math.abs(room.camera.position.y-old));heights.push(room.camera.position.y-1.75);}return{start:heights[0],end:heights.at(-1),maxJump,blocked};}
   const up=room.verticalRoutes.spirals.gallery;room.camera.position.set(up.x,1.75,up.z-1.085);report.up=travel('gallery');
   // Palier, balcon arrière, balcon latéral, puis retour au même escalier.
   function line(x,z){const start=room.camera.position.clone(),steps=Math.ceil(Math.hypot(x-start.x,z-start.z)/.04);for(let i=1;i<=steps;i++)room.walkTo(start.x+(x-start.x)*i/steps,start.z+(z-start.z)*i/steps);return Math.hypot(room.camera.position.x-x,room.camera.position.z-z)<.03;}
   report.balcony=[line(-5.5,11.55),line(7.3,11.55),line(7.3,-7),line(7.3,11.55),line(-5.5,11.55),line(-5.5,10.685)].every(Boolean);
   report.noFall=!room.navigationAt(4,0,6.4);
   line(-5.5,11.55);line(0,11.55);line(0,11.68);const edge=room.camera.position.clone();room.walkTo(0,11.85);report.noEscapeFromBalcony=room.camera.position.distanceTo(edge)<.001;
   line(0,11.55);line(-5.5,11.55);line(-5.5,10.685);report.downFromBalcony=travel('gallery',true);
   const down=room.verticalRoutes.spirals.crypt;room.camera.position.set(3.4,1.75,-33.5);report.approach=[line(3.4,-34.2),line(1.25,-34.25)].every(Boolean);report.down=travel('crypt');
   report.cryptExit=[line(2.7,-34.25),line(3,-37),line(2.3,-37.5)].every(Boolean);report.cryptY=room.camera.position.y;
   report.tombBlocked=!room.allowed(0,-39.1);report.wellBlocked=!room.navigationAt(-2.1,-34.25,-8);
   report.returnToStairs=[line(3,-37),line(2.7,-34.25),line(1.25,-34.25)].every(Boolean);report.backUp=travel('crypt',true);return report;
 });
 for(const key of ['up','downFromBalcony','down','backUp']){assert.equal(paths[key].blocked,0,`${key}: ${JSON.stringify(paths)}`);assert(paths[key].maxJump<.2);}
 assert(Math.abs(paths.up.end-6.4)<.01&&Math.abs(paths.down.end+8)<.01&&Math.abs(paths.backUp.end)<.01);for(const key of ['balcony','noFall','noEscapeFromBalcony','approach','cryptExit','tombBlocked','wellBlocked','returnToStairs'])assert(paths[key],`${key}: ${JSON.stringify(paths)}`);assert.equal(paths.cryptY,-6.25);
 // Dialogue impossible depuis le sanctuaire ; le cartel fonctionne dans la crypte.
 await page.evaluate(()=>{room.camera.position.set(2.3,1.75,-36.3);room.interactions.update();});assert.notEqual(await page.evaluate(()=>room.interactions.nearby),'Mémoire de saint Pierre');
 await page.evaluate(()=>{room.camera.position.set(2.3,-6.25,-37.5);room.interactions.update();});await page.keyboard.press('KeyE');await page.waitForFunction(()=>room.interactions.open);await page.keyboard.press('Digit1');await page.waitForFunction(()=>room.experience.kind==='tomb');
 // La boucle arrêtée reste pilotable pour vérifier l’émergence au nouveau niveau.
 await page.evaluate(()=>{for(let t=0;t<4;t+=.05)room.experience.update(1000+t);room.verticalRoutes.update(2);room.renderScene();});assert(await page.evaluate(()=>{const p=room.scene.getObjectByName('saint-peter-apparition');return p.visible&&p.position.y>-7.3&&p.position.y<-6.8;}));
 await page.waitForFunction(()=>room.experience.audio.currentTime>.1,null,{timeout:30000});
 await page.setViewportSize({width:1000,height:750});await page.waitForFunction(()=>room.renderer.domElement.width===Math.floor(innerWidth*room.renderer.getPixelRatio()));await page.evaluate(()=>{room.renderer.setPixelRatio(.8);room.renderScene();});await page.screenshot({path:path.join(__dirname,'../artifacts/crypte-recit-saint-pierre.png')});
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>room.experience.active),false);assert.equal(await page.evaluate(()=>room.camera.position.y),-6.25);
 async function capture(name,view){await page.evaluate(v=>{room.camera.position.set(...v.slice(0,3));room.camera.lookAt(...v.slice(3));document.querySelector('#app').classList.add('visiting');document.querySelector('#pause').hidden=true;room.interactions.update();room.renderScene();},view);await page.screenshot({path:path.join(__dirname,'../artifacts/'+name+'.png')});}
 await capture('crypte-aux-bougies',[3.4,-6.25,-35.7,0,-6.7,-39.1]);
 await capture('escalier-spirale-crypte',[0,5.2,-32.1,0,-4,-34.25]);
 await capture('balcons-vue-salle',[0,8.15,10.7,0,1.6,0]);
 await capture('escalier-balcons',[-2,3.6,11.5,-5.5,3.2,9.6]);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({layout,paths,keyboard:'ascension réelle',tomb:'dialogue et apparition dans la crypte seulement',errors}));
}finally{await browser.close()}})();
