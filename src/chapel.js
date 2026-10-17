import * as THREE from 'three';

// Salle II : nef avec abside elliptique, Cathedra Petri interprétée géométriquement.
export function createChapel({scene,box,cylinder,mat,cream,stone,gray,black,gold,white}){
  const chapel=new THREE.Group();chapel.name='chapel';scene.add(chapel);
  const wood=mat('#65503c'),darkWood=mat('#493c30'),chairBronze=mat('#25251f',.4,.45),chairGold=mat('#b09452',.35,.65);
  const chapelBlack=mat('#11151a'),nightFloor=mat('#d9cdb5',.35),darkStone=mat('#282a2b');
  // Même décor étoilé sur les murs et la voûte, sans panneaux de vitrail.
  const starCanvas=document.createElement('canvas');starCanvas.width=512;starCanvas.height=512;
  const starContext=starCanvas.getContext('2d');starContext.fillStyle='#314e79';starContext.fillRect(0,0,512,512);
  for(const [index,[x,y]] of [[52,80],[218,43],[411,102],[133,219],[334,243],[465,351],[53,433],[242,397],[365,471]].entries()){
    starContext.fillStyle=index%2?'#b19a5f':'#9d8958';starContext.beginPath();
    for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?2.5:6;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?starContext.lineTo(px,py):starContext.moveTo(px,py);}starContext.closePath();starContext.fill();
  }
  const starTexture=new THREE.CanvasTexture(starCanvas);starTexture.colorSpace=THREE.SRGBColorSpace;starTexture.wrapS=starTexture.wrapT=THREE.RepeatWrapping;
  const starWallMaterial=new THREE.MeshStandardMaterial({map:starTexture,roughness:.92,metalness:.08});
  function starred(mesh){
    mesh.material=cream;mesh.geometry=mesh.geometry.clone();const uv=mesh.geometry.attributes.uv,normal=mesh.geometry.attributes.normal;
    for(let i=0;i<uv.count;i++){
      const nx=Math.abs(normal.getX(i)),ny=Math.abs(normal.getY(i));
      const width=nx>.5?mesh.scale.z:mesh.scale.x,height=ny>.5?mesh.scale.z:mesh.scale.y;
      uv.setXY(i,uv.getX(i)*width/3.8,uv.getY(i)*height/3.8);
    }
    uv.needsUpdate=true;mesh.userData.starred=true;return mesh;
  }
  const obstacles=[];
  const floorShape=new THREE.Shape();floorShape.moveTo(-8,-17);floorShape.lineTo(8,-17);floorShape.lineTo(8,-28);
  floorShape.absellipse(0,-28,8,9,0,Math.PI,true);floorShape.lineTo(-8,-17);floorShape.closePath();
  // Shape XY convertie en plan XZ ; l'abside s'étend vers z négatif.
  const floorGeometry=new THREE.ShapeGeometry(floorShape,40);
  const floor=new THREE.Mesh(floorGeometry,cream);floor.rotation.x=Math.PI/2;floor.receiveShadow=true;floor.material=nightFloor.clone();floor.material.side=THREE.DoubleSide;floor.name='chapel-floor';chapel.add(floor);
  box(4.2,.22,3.2,0,-.12,-15.5,cream);
  for(const side of [-1,1]){
    starred(box(6.25,10.7,.4,side*4.875,5.35,-17,chapelBlack));
    starred(box(.4,10.7,11,side*8,5.35,-22.5,chapelBlack));
    box(.48,.7,11,side*7.76,.35,-22.5,black);
    box(.5,.05,11,side*7.74,.75,-22.5,gold);
  }
  starred(box(3.5,4.2,.4,0,8.6,-17,chapelBlack));
  // Murs courbes de l'abside : segments tangents, sans modèles importés.
  for(let i=0;i<32;i++){
    const a=i*Math.PI/32,b=(i+1)*Math.PI/32;
    const x1=8*Math.cos(a),z1=-28-9*Math.sin(a),x2=8*Math.cos(b),z2=-28-9*Math.sin(b);
    const x=(x1+x2)/2,z=(z1+z2)/2,length=Math.hypot(x2-x1,z2-z1)+.04;
    for(const [y,h,m] of [[5.35,10.7,chapelBlack],[.35,.7,black],[9.7,.12,gold]]){
      const segment=box(length,h,.3,x,y,z,m);segment.rotation.y=-Math.atan2(z2-z1,x2-x1);if(m===chapelBlack)starred(segment);
    }
  }
  // Dallage sobre et allée centrale : la zone arrondie reste en marbre crème.
  for(let z=-18;z>=-30;z-=2){box(2.6,.022,1.94,0,.015,z,darkStone);for(const side of [-1,1])box(.065,.03,1.97,side*1.39,.02,z,black);}
  for(const z of [-18.7,-30.2])box(14.8,.025,.12,0,.025,z,stone);
  // Tapis de l'allée centrale : velours bordeaux, liseré doré discret.
  const carpet=box(2.4,.024,12.85,0,.051,-24.175,mat('#741e32',1,0));carpet.name='chapel-red-carpet';carpet.castShadow=false;
  for(const x of [-1.13,1.13]){const trim=box(.035,.005,12.63,x,.066,-24.175,chairGold);trim.castShadow=false;}
  for(const z of [-17.91,-30.44]){const trim=box(2.27,.005,.035,0,.066,z,chairGold);trim.castShadow=false;}
  // Voûte en berceau au-dessus de la nef, prolongée par une demi-coupole.
  const vaultMaterial=starWallMaterial.clone();vaultMaterial.side=THREE.DoubleSide;
  const vaultPositions=[],vaultIndices=[],vaultUV=[];
  for(let i=0;i<=32;i++){
    const a=i*Math.PI/32,x=8*Math.cos(a),y=8.9+3.1*Math.sin(a);
    vaultPositions.push(x,y,-17,x,y,-28);vaultUV.push(i/32*6,0,i/32*6,3);
    if(i<32){const k=i*2;vaultIndices.push(k,k+1,k+2,k+1,k+3,k+2);}
  }
  const vaultGeometry=new THREE.BufferGeometry();vaultGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vaultPositions,3));vaultGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(vaultUV,2));vaultGeometry.setIndex(vaultIndices);vaultGeometry.computeVertexNormals();
  chapel.add(new THREE.Mesh(vaultGeometry,vaultMaterial));
  const dome=new THREE.Mesh(new THREE.SphereGeometry(1,40,16,0,Math.PI,0,Math.PI/2),vaultMaterial);dome.scale.set(8,3.1,9);dome.position.set(0,8.9,-28);dome.rotation.y=Math.PI;const domeUV=dome.geometry.attributes.uv;for(let i=0;i<domeUV.count;i++)domeUV.setXY(i,domeUV.getX(i)*6,domeUV.getY(i)*3);domeUV.needsUpdate=true;chapel.add(dome);
  // Nervures fines dorées, qui soulignent la courbe au lieu d'un plafond carré.
  for(const z of [-17.3,-22.4,-27.7]){
    const points=[];for(let i=0;i<=32;i++){const a=i*Math.PI/32;points.push(new THREE.Vector3(7.95*Math.cos(a),8.87+3.08*Math.sin(a),z));}
    chapel.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),40,.045,5,false),gold));
  }
  for(const side of [-1,1])for(const z of [-18.2,-23.3,-28]){
    box(.22,8.5,.44,side*7.67,4.25,z,darkStone);box(.38,.18,.64,side*7.6,8.6,z,gold);
  }
  // Décor inspiré de la référence : pierre claire, marbre sombre, tentures et anges.
  const referenceDecor=new THREE.Group();referenceDecor.name='chapel-reference-decor';chapel.add(referenceDecor);
  const burgundyMarble=mat('#713b40',.36),paleStone=mat('#d5c5ad',.7);
  const decorateBox=(w,h,d,x,y,z,m)=>{const mesh=box(w,h,d,x,y,z,m);mesh.castShadow=false;referenceDecor.attach(mesh);return mesh;};
  for(let z=-19;z>=-29;z-=2)for(const x of [-6,-4,-2,2,4,6]){
    decorateBox(1.88,.018,1.88,x,.025,z,(Math.round(x/2)+Math.round(z))%2?darkStone:burgundyMarble);
    for(const dx of [-.96,.96])decorateBox(.025,.022,1.94,x+dx,.029,z,chairGold);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.58,.025,5,28),cream);ring.rotation.x=-Math.PI/2;ring.position.set(x,.042,z);referenceDecor.add(ring);
  }
  for(const side of [-1,1])for(const z of [-18.2,-23.3,-28]){
    const x=side*7.66;
    decorateBox(.55,2.1,.85,x,1.1,z,darkStone);
    decorateBox(.54,6,.72,x,5.05,z,paleStone);
    for(const y of [.18,2.2,5.8,8.15])decorateBox(.7,.12,.95,x,y,z,chairGold);
    decorateBox(.73,.28,1.02,x,8.5,z,paleStone);
    // Petits anges en relief, tournés vers l'allée centrale.
    const angel=new THREE.Group();angel.name='chapel-trumpet-angel';angel.position.set(side*7.12,6.45,z);angel.rotation.y=-side*Math.PI/2;referenceDecor.add(angel);
    const add=(g,m,x,y,z)=>{const a=new THREE.Mesh(g,m);a.position.set(x,y,z);angel.add(a);return a;};
    add(new THREE.SphereGeometry(.17,10,7),cream,0,.43,0);
    add(new THREE.ConeGeometry(.23,.46,10),cream,0,.06,0);
    for(const sign of [-1,1]){
      const wing=add(new THREE.SphereGeometry(1,10,7),chairGold,sign*.23,.24,-.1);wing.scale.set(.28,.14,.055);wing.rotation.z=sign*.55;
      const arm=add(new THREE.BoxGeometry(.09,.1,.3),cream,sign*.14,.24,.15);arm.rotation.y=-sign*.35;
    }
    const trumpet=add(new THREE.CylinderGeometry(.105,.035,.45,10),chairGold,0,.32,.37);trumpet.rotation.x=Math.PI/2;
    add(new THREE.SphereGeometry(.075,8,6),cream,-.09,-.2,.12);add(new THREE.SphereGeometry(.075,8,6),cream,.09,-.2,.12);
  }
  for(const side of [-1,1])for(const z of [-20.75,-25.65]){
    const x=side*7.7;
    decorateBox(.08,4.5,1.65,x,5.15,z,burgundyMarble);
    for(const dz of [-.86,.86])decorateBox(.12,4.65,.065,side*7.62,5.15,z+dz,chairGold);
    for(const y of [2.84,7.47])decorateBox(.12,.075,1.8,side*7.62,y,z,chairGold);
    decorateBox(.12,1.05,.09,side*7.6,5.2,z,chairGold);decorateBox(.12,.09,.58,side*7.6,5.4,z,chairGold);
    const archPoints=[];for(let i=0;i<=24;i++){const a=i*Math.PI/24;archPoints.push(new THREE.Vector3(side*7.55,7.5+.9*Math.sin(a),z+.92*Math.cos(a)));}
    referenceDecor.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(archPoints),28,.075,6,false),chairGold));
  }
  // Caissons et nervures soulignent la voûte existante, sans changer son volume.
  for(const z of [-19.1,-20.9,-24.1,-25.9]){
    const points=[];for(let i=0;i<=32;i++){const a=i*Math.PI/32;points.push(new THREE.Vector3(7.92*Math.cos(a),8.84+3.06*Math.sin(a),z));}
    referenceDecor.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),36,.07,6,false),chairGold));
  }
  for(let i=1;i<10;i++){
    const a=i*Math.PI/10,x=7.9*Math.cos(a),y=8.83+3.06*Math.sin(a);
    decorateBox(.065,.065,10.7,x,y,-22.5,chairGold);
    for(const z of [-20,-25]){const rosette=new THREE.Mesh(new THREE.OctahedronGeometry(.13),chairGold);rosette.position.set(x,y-.07,z);referenceDecor.add(rosette);}
  }
  // Estrade de la chaire, laissant une allée devant elle.
  box(7.4,.18,4.8,0,.12,-33.4,gray);box(6.7,.22,4.3,0,.3,-33.55,cream);box(6,.2,3.8,0,.51,-33.7,stone);
  obstacles.push({x:0,z:-33.5,hx:4,hz:2.9});
  const chair=new THREE.Group();chair.name='cathedra-petri';chair.userData.palette='or massif et noir';chair.position.set(0,.63,-33.8);chair.scale.set(1.45,1.45,1.15);chapel.add(chair);
  const cbox=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;chair.add(mesh);return mesh;};
  // Le trône est une interprétation du reliquaire en bronze de Bernin.
  for(const x of [-.95,.95])for(const z of [-.5,.5])cbox(.24,1.25,.24,x,.94,z,chairGold);
  cbox(2.35,.3,1.65,0,1.65,0,chairGold);cbox(1.75,.12,1.25,0,1.86,.05,chairBronze);
  cbox(2.05,2.12,.28,0,2.77,-.65,chairGold);cbox(1.6,1.67,.06,0,2.78,-.48,chairGold);cbox(1.35,1.43,.07,0,2.78,-.43,chairBronze);
  for(const x of [-1.14,1.14]){cbox(.25,.23,1.65,x,2.16,0,chairGold);cbox(.18,.65,.18,x,1.95,.55,chairBronze);}
  for(const x of [-1.05,1.05])cbox(.13,2.2,.38,x,2.8,-.65,chairGold);
  for(const y of [1.78,3.86])cbox(2.3,.13,.38,0,y,-.65,chairGold);
  cbox(.12,.75,.08,0,2.83,-.36,chairGold);cbox(.48,.11,.08,0,3.01,-.36,chairGold);
  for(let i=0;i<7;i++){const crown=new THREE.Mesh(new THREE.OctahedronGeometry(.17),chairGold);crown.position.set(-.9+i*.3,4.02+(.9-Math.abs(-.9+i*.3))*.32,-.65);chair.add(crown);}
  // Quatre figures de soutien, en bronze, évoquent les docteurs de l'Église.
  for(const [i,x] of [-2.7,-1.7,1.7,2.7].entries()){
    const z=-33.9+(i%2?.4:0);cylinder(.23,.36,1.45,x,1.42,z,chairBronze,8);cylinder(.3,.22,.4,x,2.34,z,chairBronze,8);
    const head=new THREE.Mesh(new THREE.IcosahedronGeometry(.21,0),chairBronze);head.position.set(x,2.76,z);chapel.add(head);
    const sash=box(.09,1.1,.07,x,1.8,z+.28,chairGold);sash.rotation.z=Math.sign(x)*.17;
    const arm=box(.17,.78,.2,x-Math.sign(x)*.26,2.5,z+.09,chairBronze);arm.rotation.z=-Math.sign(x)*.55;
  }
  // Fond d'abside bleu nuit, galbé suivant le mur ; le reste reste en pierre claire.
  const midnight=cream;
  const backdrop=new THREE.Group();backdrop.name='cathedra-night-backdrop';chapel.add(backdrop);
  for(let i=0;i<28;i++){
    const a=.45+i/28*(Math.PI-.9),b=.45+(i+1)/28*(Math.PI-.9);
    const x1=7.79*Math.cos(a),z1=-28-8.79*Math.sin(a),x2=7.79*Math.cos(b),z2=-28-8.79*Math.sin(b);
    const width=Math.hypot(x2-x1,z2-z1)+.025;
    for(const [y,h,m] of [[5.4,7.6,midnight],[1.62,.12,chairGold],[9.18,.16,chairGold],[8.95,.055,chairGold]]){
      const panel=box(width,h,.06,(x1+x2)/2,y,(z1+z2)/2,m);panel.rotation.y=-Math.atan2(z2-z1,x2-x1);panel.castShadow=false;if(m===midnight)starred(panel);backdrop.attach(panel);
    }
  }
  for(const a of [.45,.95,Math.PI/2,Math.PI-.95,Math.PI-.45]){
    const x=7.7*Math.cos(a),z=-28-8.7*Math.sin(a);
    const pilaster=box(.13,7.5,.12,x,5.4,z,chairGold);pilaster.rotation.y=Math.atan2(-Math.cos(a),Math.sin(a));pilaster.castShadow=false;
    for(const y of [1.7,8.95]){const cap=box(.35,.15,.22,x,y,z,chairGold);cap.rotation.y=pilaster.rotation.y;cap.castShadow=false;}
  }
  const starShape=new THREE.Shape();
  for(let i=0;i<10;i++){const a=i*Math.PI/5+Math.PI/2,r=i%2?.42:1;const x=Math.cos(a)*r,y=Math.sin(a)*r;i?starShape.lineTo(x,y):starShape.moveTo(x,y);}starShape.closePath();
  const stars=new THREE.InstancedMesh(new THREE.ExtrudeGeometry(starShape,{depth:.08,bevelEnabled:false}),chairGold,108);stars.name='cathedra-gold-stars';
  const starDummy=new THREE.Object3D();
  for(let i=0;i<108;i++){
    const row=Math.floor(i/18),a=.54+(i%18+(row%2)*.35)/18*(Math.PI-1.08);
    starDummy.position.set(7.72*Math.cos(a),2.25+row*1.19,-28-8.72*Math.sin(a));
    starDummy.rotation.set(0,Math.atan2(-Math.cos(a),Math.sin(a)),i%2?.15:-.15);starDummy.scale.setScalar(.065+(i%3)*.015);starDummy.updateMatrix();stars.setMatrixAt(i,starDummy.matrix);
  }
  stars.instanceMatrix.needsUpdate=true;backdrop.add(stars);
  // Encadrement de sanctuaire : colonnes dorées sur bases noires et fronton monumental.
  for(const x of [-3.35,3.35]){
    box(.82,.22,.86,x,.72,-34.7,black);cylinder(.23,.32,5.65,x,3.62,-34.7,chairGold,12);cylinder(.4,.28,.25,x,6.57,-34.7,chairGold,12);box(.91,.18,.89,x,6.79,-34.7,chairGold);
    for(const y of [1.03,6.33])cylinder(.34,.34,.09,x,y,-34.7,black,12);
  }
  box(7.6,.3,.7,0,7.03,-34.72,chairGold);box(7.25,.095,.73,0,7.24,-34.72,black);
  const templeFront=new THREE.Shape();templeFront.moveTo(-3.9,0);templeFront.lineTo(3.9,0);templeFront.lineTo(0,1.05);templeFront.closePath();
  const fronton=new THREE.Mesh(new THREE.ExtrudeGeometry(templeFront,{depth:.26,bevelEnabled:false}),chairGold);fronton.position.set(0,7.31,-34.85);chapel.add(fronton);
  const insetFront=new THREE.Shape();insetFront.moveTo(-3.12,0);insetFront.lineTo(3.12,0);insetFront.lineTo(0,.69);insetFront.closePath();
  const darkFront=new THREE.Mesh(new THREE.ShapeGeometry(insetFront),chairBronze);darkFront.position.set(0,7.46,-34.575);chapel.add(darkFront);
  // Gloire dorée et fenêtre ambrée avec colombe, marqueurs visuels de la chaire.
  const glory=new THREE.Group();glory.name='cathedra-glory';glory.position.set(0,9,-34.38);glory.scale.setScalar(.62);chapel.add(glory);
  const amber=new THREE.Mesh(new THREE.CircleGeometry(1.02,48),new THREE.MeshBasicMaterial({color:'#d7b365'}));amber.scale.y=1.3;amber.position.z=.12;glory.add(amber);
  for(const radius of [1.07,1.17]){const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,.06,6,48),chairGold);rim.scale.y=1.3;rim.position.z=.17;glory.add(rim);}
  for(let i=0;i<36;i++){
    const a=i*Math.PI/18,length=.65+(i%3)*.2;
    const ray=new THREE.Mesh(new THREE.ConeGeometry(.075,length,4),chairGold);ray.position.set(Math.sin(a)*(1.65+length*.35),Math.cos(a)*(1.9+length*.35),0);ray.rotation.z=-a;glory.add(ray);
    if(i%3===0){const cloud=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,0),chairGold);cloud.position.set(Math.sin(a)*1.38,Math.cos(a)*1.62,.05);cloud.scale.set(1.3,.65,.5);glory.add(cloud);}
  }
  const doveShape=new THREE.Shape();doveShape.moveTo(0,-.35);doveShape.lineTo(-.16,-.05);doveShape.quadraticCurveTo(-.67,.14,-.72,.48);doveShape.quadraticCurveTo(-.26,.32,0,.12);doveShape.quadraticCurveTo(.26,.32,.72,.48);doveShape.quadraticCurveTo(.67,.14,.16,-.05);doveShape.closePath();
  const dove=new THREE.Mesh(new THREE.ShapeGeometry(doveShape),new THREE.MeshBasicMaterial({color:'#fff0cf'}));dove.position.z=.2;glory.add(dove);
  const glow=new THREE.PointLight('#f3d19a',24,13,1.6);glow.position.set(0,7,-34.5);scene.add(glow);
  const focus=new THREE.SpotLight('#ffe4b9',95,24,.56,.8,1.5);focus.position.set(0,10,-28);focus.target.position.set(0,4.3,-33.8);scene.add(focus,focus.target);
  // Appliques murales : trois bougies par support, sans éclairage fluorescent.
  const candleWax=mat('#d8c7a5'),flameMaterial=new THREE.MeshBasicMaterial({color:'#ffd69a'});
  const flames=[],candleLights=[];
  const glowCanvas=document.createElement('canvas');glowCanvas.width=64;glowCanvas.height=64;
  const glowContext=glowCanvas.getContext('2d'),gradient=glowContext.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'#ffd39acc');gradient.addColorStop(.25,'#e9a25155');gradient.addColorStop(1,'#d68b3100');glowContext.fillStyle=gradient;glowContext.fillRect(0,0,64,64);
  const glowTexture=new THREE.CanvasTexture(glowCanvas);glowTexture.colorSpace=THREE.SRGBColorSpace;
  const flameGlowMaterial=new THREE.SpriteMaterial({map:glowTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  for(const side of [-1,1])for(const z of [-19,-23,-27,-30]){
    const sconce=new THREE.Group();sconce.name='chapel-candle-sconce';sconce.position.set(side*(z===-30?7.35:7.7),2.9,z);sconce.rotation.y=-side*Math.PI/2;chapel.add(sconce);
    const local=(geometry,material,x,y,z)=>{const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);sconce.add(mesh);return mesh;};
    local(new THREE.BoxGeometry(.25,.76,.07),chairBronze,0,0,0);
    local(new THREE.BoxGeometry(.055,.67,.085),chairGold,0,0,.04);
    local(new THREE.BoxGeometry(.64,.05,.06),chairGold,0,-.21,.33);
    local(new THREE.BoxGeometry(.055,.06,.4),chairGold,0,-.21,.2);
    for(const x of [-.25,0,.25]){
      local(new THREE.CylinderGeometry(.1,.065,.045,10),chairGold,x,-.15,.36);
      local(new THREE.CylinderGeometry(.052,.057,.35,10),candleWax,x,.04,.36);
      local(new THREE.CylinderGeometry(.008,.008,.055,6),black,x,.24,.36);
      const flame=local(new THREE.SphereGeometry(1,8,6),flameMaterial,x,.325,.36);flame.scale.set(.045,.115,.037);flames.push(flame);
      const halo=new THREE.Sprite(flameGlowMaterial);halo.position.set(x,.32,.36);halo.scale.set(.5,.65,1);sconce.add(halo);
    }
  }
  // Quatre sources partagées éclairent les huit appliques pour limiter le coût.
  for(const side of [-1,1])for(const z of [-21,-28.5]){
    const light=new THREE.PointLight('#ffc486',65,12,1.65);light.position.set(side*6.6,3.1,z);scene.add(light);candleLights.push(light);
  }
  // Baldaquin inspiré de Bernin : quatre colonnes salomoniques et volutes ouvertes.
  const baldachin=new THREE.Group();baldachin.name='bernin-baldachin';chapel.add(baldachin);
  const baldachinBronze=mat('#29251d',.4,.6);
  for(const x of [-2.65,2.65])for(const z of [-31.35,-34.85]){
    box(.95,.2,.95,x,.74,z,black);box(.84,.1,.84,x,.9,z,chairGold);
    cylinder(.37,.42,.25,x,1.075,z,baldachinBronze,12);
    const points=[],vinePoints=[];
    for(let i=0;i<=96;i++){
      const t=i/96,a=t*Math.PI*6,y=1.2+t*5.85;
      points.push(new THREE.Vector3(x+Math.cos(a)*.105,y,z+Math.sin(a)*.105));
      vinePoints.push(new THREE.Vector3(x+Math.cos(a)*.365,y,z+Math.sin(a)*.365));
    }
    const shaft=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),96,.235,10,false),baldachinBronze);shaft.name='baldachin-twisted-column';baldachin.add(shaft);
    const vine=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vinePoints),96,.032,5,false),chairGold);baldachin.add(vine);
    for(let i=0;i<10;i++){
      const a=i/9*Math.PI*6;const leaf=new THREE.Mesh(new THREE.OctahedronGeometry(.11),chairGold);
      leaf.position.set(x+Math.cos(a)*.37,1.35+i/9*5.5,z+Math.sin(a)*.37);leaf.scale.set(.6,1.3,.4);leaf.rotation.y=-a;baldachin.add(leaf);
    }
    cylinder(.42,.29,.3,x,7.18,z,chairGold,12);box(.98,.18,.98,x,7.43,z,chairGold);
    const crown=new THREE.Mesh(new THREE.OctahedronGeometry(.23),chairGold);crown.position.set(x,8.02,z);baldachin.add(crown);
  }
  for(const z of [-30.93,-35.27]){
    box(6.45,.34,.35,0,7.7,z,baldachinBronze);box(6.54,.065,.39,0,7.91,z,chairGold);box(6.54,.06,.38,0,7.48,z,chairGold);
    for(let i=0;i<17;i++){const fringe=box(.14,.23,.09,-3+i*.375,7.31,z,chairGold);fringe.rotation.z=i%2?.12:-.12;}
  }
  for(const x of [-3.06,3.06]){
    box(.34,.34,4.4,x,7.7,-33.1,baldachinBronze);box(.38,.065,4.5,x,7.91,-33.1,chairGold);
    for(let i=0;i<11;i++)box(.09,.23,.14,x,7.31,-35.05+i*.39,chairGold);
  }
  for(const x of [-2.65,2.65])for(const z of [-31.35,-34.85]){
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,7.95,z),new THREE.Vector3(x*.86,8.68,z+(z>-33?-.35:.35)),new THREE.Vector3(x*.35,9.23,-33.1),new THREE.Vector3(0,9.48,-33.1)]);
    baldachin.add(new THREE.Mesh(new THREE.TubeGeometry(curve,24,.075,6,false),chairGold));
  }
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),chairGold);orb.position.set(0,9.53,-33.1);baldachin.add(orb);
  box(.065,.65,.065,0,9.98,-33.1,chairGold);box(.37,.065,.065,0,10.09,-33.1,chairGold);
  baldachin.userData={columns:4,style:'bronze sombre et or ancien, colonnes torsadées'};
  // Rayons volumétriques légers : quatre cônes translucides, sans ombres supplémentaires.
  const beams=new THREE.Group();beams.name='chapel-light-beams';chapel.add(beams);
  for(const [x,z] of [[-3,-23],[3,-26],[0,-31.8],[-2,-34]]){
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.08,1.35,8.8,24,1,true),new THREE.MeshBasicMaterial({color:'#e8cc91',transparent:true,opacity:.055,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
    beam.position.set(x,5.1,z);beam.rotation.z=x*.055;beams.add(beam);
  }
  // Saint Pierre, au centre sous le baldaquin : manteau doré, livre et clefs.
  const saint=new THREE.Group();saint.name='saint-peter';saint.position.set(0,.63,-31.9);chapel.add(saint);
  const saintPart=(geometry,material,x,y,z)=>{const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);saint.add(mesh);return mesh;};
  saintPart(new THREE.CylinderGeometry(.62,.72,.24,16),chairBronze,0,.12,0);
  saintPart(new THREE.CylinderGeometry(.3,.53,1.55,12),chairGold,0,1.02,0);
  saintPart(new THREE.BoxGeometry(.78,.72,.42),chairGold,0,1.82,0);
  saintPart(new THREE.SphereGeometry(.29,12,9),cream,0,2.48,0);
  saintPart(new THREE.ConeGeometry(.24,.37,10),gray,0,2.25,.15).rotation.x=Math.PI;
  saintPart(new THREE.TorusGeometry(.4,.035,6,32),chairGold,0,2.53,-.12);
  saintPart(new THREE.BoxGeometry(.16,.74,.2),chairGold,-.5,1.75,.12).rotation.z=-.35;
  saintPart(new THREE.BoxGeometry(.16,.65,.2),chairGold,.49,1.83,.17).rotation.x=-.7;
  saintPart(new THREE.SphereGeometry(.11,8,6),cream,.49,1.64,.42);
  saintPart(new THREE.BoxGeometry(.4,.5,.12),chairBronze,-.48,1.6,.3);
  for(const dx of [-.08,.08]){
    saintPart(new THREE.TorusGeometry(.075,.022,5,16),chairGold,.49+dx,1.52,.46);
    saintPart(new THREE.BoxGeometry(.035,.3,.035),chairGold,.49+dx,1.3,.46);
    saintPart(new THREE.BoxGeometry(.11,.04,.04),chairGold,.52+dx,1.18,.46);
  }
  const sparkleCanvas=document.createElement('canvas');sparkleCanvas.width=32;sparkleCanvas.height=32;
  const sparkleContext=sparkleCanvas.getContext('2d');
  const shimmer=sparkleContext.createRadialGradient(16,16,0,16,16,16);shimmer.addColorStop(0,'#fff1c7');shimmer.addColorStop(.2,'#e1b860aa');shimmer.addColorStop(1,'#bb8b3000');sparkleContext.fillStyle=shimmer;sparkleContext.fillRect(0,0,32,32);
  const sparkleTexture=new THREE.CanvasTexture(sparkleCanvas);sparkleTexture.colorSpace=THREE.SRGBColorSpace;
  const sparklePositions=new Float32Array(280*3),sparkleSeeds=[];let sparkleSeed=2319;
  const random=()=>{sparkleSeed=(sparkleSeed*1664525+1013904223)>>>0;return sparkleSeed/4294967296;};
  for(let i=0;i<280;i++){
    const z=-18-random()*17,maxX=z<-28?6.6*Math.sqrt(Math.max(.1,1-((z+28)/8.4)**2)):6.6;
    sparkleSeeds.push({x:(random()*2-1)*maxX,y:random()*8.1,z,phase:random()*Math.PI*2,speed:.06+random()*.08});
  }
  const sparkleGeometry=new THREE.BufferGeometry();sparkleGeometry.setAttribute('position',new THREE.BufferAttribute(sparklePositions,3).setUsage(THREE.DynamicDrawUsage));
  const sparkles=new THREE.Points(sparkleGeometry,new THREE.PointsMaterial({map:sparkleTexture,color:'#d6b268',size:.095,transparent:true,opacity:.72,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
  sparkles.name='chapel-gold-sparkles';sparkles.frustumCulled=false;chapel.add(sparkles);
  // Moulures classiques : corniches à denticules et encadrements cintrés dorés.
  const mouldings=new THREE.Group();mouldings.name='chapel-classical-mouldings';chapel.add(mouldings);
  for(const side of [-1,1]){
    for(const y of [9.1,9.3]){const cornice=box(.3,.1,10.9,side*7.62,y,-22.55,chairGold);cornice.castShadow=false;}
    for(let z=-17.6;z>-28;z-=.48){const tooth=box(.22,.17,.15,side*7.55,8.98,z,chairGold);tooth.castShadow=false;mouldings.attach(tooth);}
    for(const z of [-20.7,-25.6]){
      const points=[];for(let i=0;i<=24;i++){const a=i*Math.PI/24;points.push(new THREE.Vector3(side*7.55,6.1+1.75*Math.sin(a),z+1.75*Math.cos(a)));}
      const arch=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),28,.045,5,false),chairGold);mouldings.add(arch);
      for(const dz of [-1.75,1.75]){const edge=box(.1,3.1,.075,side*7.55,4.55,z+dz,chairGold);edge.castShadow=false;mouldings.attach(edge);}
      const sill=box(.12,.09,3.6,side*7.55,3,z,chairGold);sill.castShadow=false;mouldings.attach(sill);
    }
  }
  for(let i=0;i<25;i++){
    const a=.47+i/24*(Math.PI-.94),x=7.68*Math.cos(a),z=-28-8.68*Math.sin(a);
    const tooth=box(.17,.18,.22,x,8.91,z,chairGold);tooth.rotation.y=Math.atan2(-Math.cos(a),Math.sin(a));tooth.castShadow=false;mouldings.attach(tooth);
  }
  // Personnages debout : maître de cérémonie et deux marcheurs dans les allées.
  const walkers=[],seatedMotion=[],risingVisitors=[];let animationTime=0;
  function standingPerson(x,z,role,index){
    const group=new THREE.Group();group.name=role;group.position.set(x,0,z);chapel.add(group);
    const skin=mat(index%2?'#a58265':'#c2a083'),robe=mat('#63323e'),hair=mat('#514638');
    const part=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);group.add(mesh);return mesh;};
    const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.2,.29,.75,10),robe);skirt.position.y=.76;group.add(skirt);
    part(.38,.46,.25,0,1.25,0,robe);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.145,10,7),skin);head.position.y=1.67;group.add(head);
    const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.15,10,6,0,Math.PI*2,0,Math.PI*.5),hair);hairCap.position.y=1.71;group.add(hairCap);
    const limbs=[];
    for(const side of [-1,1]){
      const leg=new THREE.Group();leg.position.set(side*.11,.63,0);group.add(leg);
      leg.position.y=.79;
      const thigh=new THREE.Mesh(new THREE.BoxGeometry(.115,.34,.14),robe);thigh.position.y=-.17;leg.add(thigh);
      const knee=new THREE.Group();knee.name='walking-knee';knee.position.y=-.34;leg.add(knee);
      const calf=new THREE.Mesh(new THREE.BoxGeometry(.105,.33,.12),robe);calf.position.y=-.165;knee.add(calf);
      const shoe=new THREE.Mesh(new THREE.BoxGeometry(.14,.1,.25),black);shoe.position.set(0,-.38,.055);knee.add(shoe);
      const arm=new THREE.Group();arm.position.set(side*.24,1.41,0);group.add(arm);
      const sleeve=new THREE.Mesh(new THREE.BoxGeometry(.105,.42,.13),robe);sleeve.position.y=-.2;arm.add(sleeve);
      const hand=new THREE.Mesh(new THREE.SphereGeometry(.06,8,5),skin);hand.position.y=-.44;arm.add(hand);limbs.push({leg,knee,arm,side});
    }
    if(role==='master-of-ceremonies'){
      part(.4,.28,.035,0,1.29,.144,cream);
      for(const side of [-1,1])part(.065,.57,.04,side*.13,1.07,.17,chairGold);
      part(.027,.2,.03,0,1.27,.17,chairGold);part(.13,.027,.03,0,1.29,.17,chairGold);
      const book=part(.3,.04,.23,0,1.18,.37,chairBronze);book.rotation.x=-.18;
      part(.26,.018,.21,0,1.2,.37,cream);
      limbs[0].arm.rotation.x=-.8;limbs[1].arm.rotation.x=-1.05;
      group.userData.role='Maître de cérémonie';group.scale.setScalar(1.08);
    }
    return {group,head,limbs};
  }
  const ceremonyMaster=standingPerson(1.65,-30.05,'master-of-ceremonies',0);
  obstacles.push({x:1.65,z:-30.05,hx:.48,hz:.48});
  const lectern=new THREE.Group();lectern.name='ceremony-lectern';lectern.position.set(1.65,0,-29.38);chapel.add(lectern);
  const deskPart=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);lectern.add(mesh);return mesh;};
  deskPart(.86,.12,.65,0,.08,0,chairBronze);
  deskPart(.62,1.13,.28,0,.69,0,chairBronze);
  for(const x of [-.29,.29])deskPart(.045,1.12,.31,x,.69,0,chairGold);
  const desktop=deskPart(.95,.09,.65,0,1.31,0,chairGold);desktop.rotation.x=.18;
  const pages=deskPart(.43,.025,.33,0,1.38,-.05,cream);pages.rotation.x=.18;
  deskPart(.035,.31,.035,0,.89,.155,chairGold);deskPart(.18,.035,.035,0,.95,.155,chairGold);
  const microphone=new THREE.Group();microphone.name='ceremony-microphone';lectern.add(microphone);
  const neck=new THREE.CatmullRomCurve3([new THREE.Vector3(.3,1.36,0),new THREE.Vector3(.3,1.65,0),new THREE.Vector3(.13,1.78,-.22)]);
  microphone.add(new THREE.Mesh(new THREE.TubeGeometry(neck,16,.018,6,false),black));
  const micHead=new THREE.Mesh(new THREE.SphereGeometry(.055,10,7),gray);micHead.scale.set(1,1,1.65);micHead.position.set(.13,1.78,-.22);microphone.add(micHead);
  obstacles.push({x:1.65,z:-29.38,hx:.65,hz:.53});
  function walkingPose(person,distance,moving){
    const phase=distance*11;
    person.limbs.forEach(({leg,knee,arm,side})=>{
      const cycle=phase+(side<0?Math.PI:0);
      leg.rotation.x=moving?Math.sin(cycle)*.42:0;
      knee.rotation.x=moving?Math.max(0,-Math.sin(cycle))*.72:0;
      arm.rotation.x=moving?-Math.sin(cycle)*.28:0;
    });
    person.group.position.y=moving?Math.abs(Math.sin(phase))*.025:0;
  }
  for(const [index,side] of [-1,1].entries()){
    const person=standingPerson(side*6.6,-20.1-index*4,'walking-visitor',index+1);
    walkers.push({...person,distance:index*.4,direction:1});
  }

  function animate(time,viewerPosition){
    const delta=Math.min(Math.max(time-animationTime,0),.1);animationTime=time;
    walkers.forEach((walker,index)=>{
      const nextZ=walker.group.position.z+walker.direction*delta*.32;
      const clear=!viewerPosition||Math.hypot(viewerPosition.x-walker.group.position.x,viewerPosition.z-nextZ)>.95;
      if(clear){walker.distance+=Math.abs(nextZ-walker.group.position.z);walker.group.position.z=nextZ;}
      if(walker.group.position.z>-19.6)walker.direction=-1;
      if(walker.group.position.z<-28.6)walker.direction=1;
      walker.group.rotation.y=walker.direction<0?Math.PI:0;
      walkingPose(walker,walker.distance,clear);
    });
    ceremonyMaster.limbs[1].arm.rotation.x=-1.05+Math.sin(time*.7)*.12;
    ceremonyMaster.head.rotation.x=.045+.025*Math.sin(time*.6);
    seatedMotion.forEach((person,index)=>person.rotation.x=Math.sin(time*.55+index)*.006);
    risingVisitors.forEach((actor,index)=>{
      // Se lever, sortir de la rangée, traverser son intervalle puis revenir s’asseoir.
      const t=(actor.clock+delta)%38;
      const rise=THREE.MathUtils.smoothstep(t,3,5)*(1-THREE.MathUtils.smoothstep(t,33,35));
      const travel=THREE.MathUtils.smoothstep(t,7,16)*(1-THREE.MathUtils.smoothstep(t,23,32));
      const forward=THREE.MathUtils.smoothstep(t,5,7)*(1-THREE.MathUtils.smoothstep(t,32,33));
      const nextX=actor.x+actor.side*2.05*travel,nextZ=actor.z-1.25*forward;
      if(viewerPosition&&Math.hypot(viewerPosition.x-nextX,viewerPosition.z-nextZ)<.95)return;
      actor.clock=t;
      const dx=nextX-actor.group.position.x,dz=nextZ-actor.group.position.z,distance=Math.hypot(dx,dz);
      actor.distance+=distance;
      actor.walking.group.visible=rise>.99;actor.group.children.forEach(mesh=>mesh.visible=rise<=.99);
      actor.walking.group.position.set(nextX,0,nextZ);
      if(distance>.0001)actor.walking.group.rotation.y=Math.atan2(dx,dz);
      walkingPose(actor.walking,actor.distance,distance>.0001);
      actor.group.position.set(nextX,0,nextZ);actor.group.userData.posture=rise>.95?'debout':'assis';
      actor.parts.forEach(({mesh,y,z})=>{
        const targetY=y===.19?.10:y===.44?.34:y===.72?.63:y===.47?.76:y+.28;
        mesh.position.y=THREE.MathUtils.lerp(y,targetY,rise);mesh.position.z=z*(1-rise*.85);
        if(y===.72)mesh.rotation.x=rise*Math.PI*.5;
      });
      actor.group.rotation.y=Math.PI+actor.side*Math.PI*.5*travel;
      actor.group.rotation.x=rise>.95?Math.sin(time*3)*.018*travel:0;
    });
    sparkleSeeds.forEach((p,i)=>{sparklePositions[i*3]=p.x+.12*Math.sin(time*.25+p.phase);sparklePositions[i*3+1]=1+(p.y+time*p.speed)%8.1;sparklePositions[i*3+2]=p.z+.1*Math.cos(time*.22+p.phase);});sparkleGeometry.attributes.position.needsUpdate=true;
    flames.forEach((flame,index)=>flame.scale.y=.11*(1+.06*Math.sin(time*5+index*1.7)));
    candleLights.forEach((light,index)=>light.intensity=65*(1+.025*Math.sin(time*3+index*2)));
  }

  const burgundyRobe=mat('#63323e');
  function visitor(x,z,index){
    const person=new THREE.Group();person.name='seated-visitor';person.position.set(x,0,z);person.rotation.y=Math.PI;chapel.add(person);
    const clothes=burgundyRobe;person.userData.outfit='robe bordeaux';
    const skin=mat(['#c5a184','#b98d6a','#82664f','#d1b59a'][index%4]),hair=mat(index%3?'#4b4034':'#aaa390');
    const localBox=(w,h,d,x,y,z,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);person.add(mesh);return mesh;};
    localBox(.36,.42,.25,0,1.02,0,clothes);localBox(.34,.12,.36,0,.77,.12,clothes);
    const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.18,.3,.53,10),clothes);skirt.position.set(0,.47,.17);person.add(skirt);
    localBox(.1,.035,.025,0,1.19,.139,cream);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.14,10,7),skin);head.position.set(0,1.4,.015);person.add(head);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.146,10,6,0,Math.PI*2,0,Math.PI*.55),hair);cap.position.set(0,1.43,.005);person.add(cap);
    for(const side of [-1,1]){
      localBox(.12,.13,.39,side*.105,.72,.19,clothes);localBox(.105,.43,.12,side*.105,.44,.36,clothes);localBox(.13,.08,.24,side*.105,.19,.43,black);
      const arm=localBox(.085,.28,.1,side*.215,1.01,.08,clothes);arm.rotation.x=-.48;
      const forearm=localBox(.08,.085,.25,side*(index%3===0?.09:.19),.87,.2,skin);forearm.rotation.y=side*(index%3===0?.5:0);
    }
    if(index%3===1){const book=localBox(.23,.025,.2,0,.86,.3,cream);book.rotation.x=-.2;}
    if(index===1||index===4||index===11||index===14){
      const walking=standingPerson(x,z,'walking-standing-visitor',index);walking.group.visible=false;
      const actor={group:person,walking,clock:risingVisitors.length*9,distance:0,x,z,side:Math.sign(x),parts:person.children.map(mesh=>({mesh,y:mesh.position.y,z:mesh.position.z}))};
      risingVisitors.push(actor);
    }else seatedMotion.push(person);
  }
  // Vingt chaises individuelles bordeaux et or, regroupées en trois objets instanciés.
  const chairFrames=[],chairVelvet=[],chairRosettes=[];
  const chairDummy=new THREE.Object3D(),velvet=mat('#702c40',.93,0);
  function ceremonialChair(x,z){
    const chairGroup=new THREE.Group();chairGroup.name='burgundy-gold-chair';chairGroup.position.set(x,0,z);chapel.add(chairGroup);
    const instance=(list,w,h,d,dx,y,dz)=>{chairDummy.position.set(x+dx,y,z+dz);chairDummy.rotation.set(0,0,0);chairDummy.scale.set(w,h,d);chairDummy.updateMatrix();list.push(chairDummy.matrix.clone());};
    instance(chairVelvet,.61,.14,.65,0,.57,0);instance(chairVelvet,.49,.55,.11,0,1,.32);
    for(const dx of [-.29,.29]){
      for(const dz of [-.25,.25])instance(chairFrames,.065,.5,.065,dx,.29,dz);
      instance(chairFrames,.06,.86,.065,dx,.92,.33);
      instance(chairFrames,.07,.07,.7,dx,.86,0);
      instance(chairFrames,.055,.28,.055,dx,.73,-.24);
    }
    for(const y of [.7,1.32])instance(chairFrames,.64,.06,.07,0,y,.33);
    instance(chairFrames,.64,.055,.7,0,.48,0);
    instance(chairRosettes,.055,.075,.025,0,1.33,.38);
  }
  let visitorIndex=0;
  for(const z of [-20.5,-23,-25.5,-28])for(const side of [-1,1]){
    const x=side*3.7;obstacles.push({x,z,hx:2.2,hz:.95});
    for(const dx of z===-23||z===-28?[-1,0,1]:[-.8,.8]){ceremonialChair(x+dx,z);visitor(x+dx,z,visitorIndex++);}
  }
  for(const [list,material,geometry] of [[chairFrames,chairGold,new THREE.BoxGeometry(1,1,1)],[chairVelvet,velvet,new THREE.BoxGeometry(1,1,1)],[chairRosettes,chairGold,new THREE.OctahedronGeometry(1)]]){
    const mesh=new THREE.InstancedMesh(geometry,material,list.length);list.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;chapel.add(mesh);
  }
  chapel.userData={shape:'abside elliptique',benches:0,chairs:20,visitors:visitorIndex,walkers:2,risingVisitors:4,ceremonyMaster:true};
  function allowed(x,z){
    if(z>-17.55)return Math.abs(x)<1.58&&z<-11.5;
    const inside=z>=-28?Math.abs(x)<7.35:(x/7.35)**2+((z+28)/8.3)**2<1;
    return inside&&z>-36.3&&![...walkers,...risingVisitors].some(w=>Math.hypot(x-w.group.position.x,z-w.group.position.z)<.52)&&!obstacles.some(o=>Math.abs(x-o.x)<o.hx&&Math.abs(z-o.z)<o.hz);
  }
  return {allowed,animate};
}
