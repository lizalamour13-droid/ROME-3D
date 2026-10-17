const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});try{
const page=await browser.newPage({viewport:{width:500,height:350}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.ROME_TEST_URL||'http://127.0.0.1:5174/ROME-3D/');await page.waitForFunction(()=>window.room?.verticalRoutes);await page.evaluate(()=>{room.renderer.setPixelRatio(.4);room.renderer.shadowMap.enabled=false;});await page.click('#enter');await page.waitForFunction(()=>room.active);await page.evaluate(()=>room.renderer.setAnimationLoop(null));
const reports=[];
for(const name of ['gallery','galleryRight','crypt'])for(const reverse of [false,true]){
await page.evaluate(({name,reverse})=>{const s=room.verticalRoutes.spirals[name],t=reverse?1:0,a=s.start+t*s.turns*Math.PI*2*(s.direction??1),r=(s.inner+s.outer)/2;room.camera.position.set(s.x+Math.cos(a)*r,1.75+s.height*t,s.z+Math.sin(a)*r);room.interactions.update();},{name,reverse});
await page.keyboard.down('ArrowUp');const result=await page.evaluate(({name,reverse})=>{
const s=room.verticalRoutes.spirals[name],r=(s.inner+s.outer)/2;let blocked=0,maxJump=0;
for(let i=1;i<=960;i++){
const t=reverse?1-i/960:i/960,a=s.start+t*s.turns*Math.PI*2*(s.direction??1),x=s.x+Math.cos(a)*r,z=s.z+Math.sin(a)*r,dx=x-room.camera.position.x,dz=z-room.camera.position.z,yaw=Math.atan2(-dx,-dz);
dispatchEvent(new MouseEvent('mousemove',{movementX:(room.camera.rotation.y-yaw)/.002}));const old=room.camera.position.y;room.stepMovement(Math.hypot(dx,dz)/3.5);if(Math.hypot(room.camera.position.x-x,room.camera.position.z-z)>.002)blocked++;maxJump=Math.max(maxJump,Math.abs(room.camera.position.y-old));
}
return {name,reverse,blocked,maxJump,height:room.camera.position.y-1.75,expected:reverse?0:s.height};},{name,reverse});await page.keyboard.up('ArrowUp');assert.equal(result.blocked,0,JSON.stringify(result));assert(Math.abs(result.height-result.expected)<.01);assert(result.maxJump<.2);reports.push(result);
}
// En plein escalier, le déplacement latéral et la souris restent libres.
await page.evaluate(()=>{const s=room.verticalRoutes.spirals.gallery;room.camera.position.set(s.x+1.1,1.75+s.height/6,s.z);room.interactions.update();dispatchEvent(new MouseEvent('mousemove',{movementX:room.camera.rotation.y/.002}));});
await page.keyboard.down('ArrowRight');const lateral=await page.evaluate(()=>{const x=room.camera.position.x;room.stepMovement(.05);return room.camera.position.x-x;});await page.keyboard.up('ArrowRight');assert(lateral>.15);
const stopped=await page.evaluate(()=>{const p=room.camera.position.clone();for(let i=0;i<30;i++)room.stepMovement(.05);return room.camera.position.distanceTo(p);});assert.equal(stopped,0);
const checks=await page.evaluate(()=>{const plaque=room.scene.getObjectByName('tomb-wall-plaque');return{controllerAbsent:!room.stairController,avatarAbsent:!room.scene.getObjectByName('player-stair-avatar'),stairSigns:room.scene.children.filter(o=>o.name.startsWith('stair-access-')).length,wallPlaque:plaque.geometry.parameters.width===.48&&plaque.position.x>2,plaqueNoPost:plaque.parent.children.length===1};});assert(checks.controllerAbsent&&checks.avatarAbsent&&checks.stairSigns===0&&checks.wallPlaque&&checks.plaqueNoPost);assert.deepEqual(errors,[]);console.log(JSON.stringify({reports,lateral,stopped,checks,errors}));
}finally{await browser.close()}})();
