import * as THREE from 'three';

const TAU=Math.PI*2;
export const CRYPT={floor:-8,centerX:4.3,tomb:{x:4.3,z:-39.1},view:{x:6.2,z:-36.9}};
export const SPIRALS={
  crypt:{x:4.3,z:-33.1,inner:.35,outer:1.4,start:Math.PI,turns:2,height:-8,steps:64},
  gallery:{x:-5.5,z:9.6,inner:.42,outer:1.75,start:-Math.PI/2,turns:1.5,height:6.4,steps:64},
  galleryRight:{x:5.5,z:9.6,inner:.42,outer:1.75,start:-Math.PI/2,turns:1.5,height:6.4,steps:64,direction:-1}
};

// Les surfaces de marche et les géométries utilisent les mêmes dimensions.
// On conserve la hauteur courante : deux tours superposés ne sont jamais confondus.
export function createVerticalRoutes({scene}){
  const root=new THREE.Group();root.name='vertical-routes';scene.add(root);
  const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness:.75,metalness});
  const cream=mat('#c7bda7'),gray=mat('#777b7d'),gold=mat('#aa8c4d',.55),dark=mat('#283c35'),balconyBurgundy=mat('#542b35'),stone=mat('#3c3935'),wax=mat('#d2bd91');
  const cube=new THREE.BoxGeometry(1,1,1);
  const add=(geometry,material,x,y,z,parent=root)=>{const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  const box=(w,h,d,x,y,z,m,parent=root)=>{const mesh=add(cube,m,x,y,z,parent);mesh.scale.set(w,h,d);return mesh;};
  const crypt=new THREE.Group();crypt.name='saint-peter-crypt';crypt.position.x=CRYPT.centerX;root.add(crypt);
  const flames=[],lights=[];
  function candle(x,y,z,parent,name,illuminate=true){
    const group=new THREE.Group();group.name=name;group.position.set(x,y,z);parent.add(group);
    box(.25,.07,.22,0,-.08,0,gold,group);
    add(new THREE.CylinderGeometry(.045,.052,.31,8),wax,0,.11,0,group);
    const flame=add(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:'#ffc678'}),0,.31,0,group);flame.scale.set(.65,1.9,.65);flames.push(flame);
    if(illuminate){const light=new THREE.PointLight('#ffd29a',13,5.5,1.6);light.position.set(0,.37,.08);light.layers.set(2);group.add(light);lights.push(light);}
    return group;
  }
  function rail(points,material,r,parent){const mesh=add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),Math.max(8,points.length*2),r,6,false),material,0,0,0,parent);return mesh;}
  function flatRail(x1,z1,x2,z2,y,parent=root){
    const length=Math.hypot(x2-x1,z2-z1),dx=(x2-x1)/length,dz=(z2-z1)/length;
    const panel=box(length,.61,.075,(x1+x2)/2,y+.47,(z1+z2)/2,balconyBurgundy,parent);panel.rotation.y=-Math.atan2(dz,dx);
    for(const dy of [.15,.82,1.06])rail([new THREE.Vector3(x1,y+dy,z1),new THREE.Vector3(x2,y+dy,z2)],gold,dy===1.06?.04:.022,parent);
    for(let d=.18;d<length;d+=.7){const x=x1+dx*d,z=z1+dz*d;box(.07,.95,.07,x,y+.53,z,cream,parent);const jewel=add(new THREE.OctahedronGeometry(.1),gold,x,y+.49,z,parent);jewel.scale.set(.75,1,.45);}
  }
  function spiral(s,name,underground){
    const group=new THREE.Group();group.name=name;root.add(group);
    const span=s.turns*TAU*(s.direction??1),delta=span/s.steps;
    const tread=new THREE.Shape();tread.absarc(0,0,s.outer,0,delta,delta<0);tread.lineTo(s.inner*Math.cos(delta),s.inner*Math.sin(delta));tread.absarc(0,0,s.inner,delta,0,delta>=0);tread.closePath();
    const geometry=new THREE.ExtrudeGeometry(tread,{depth:.13,bevelEnabled:false,curveSegments:5});geometry.rotateX(Math.PI/2);
    const steps=new THREE.InstancedMesh(geometry,gray,s.steps),dummy=new THREE.Object3D();steps.name=name+'-steps';steps.receiveShadow=true;
    for(let i=0;i<s.steps;i++){dummy.position.set(s.x,s.height*i/s.steps,s.z);dummy.rotation.set(0,-(s.start+i*delta),0);dummy.updateMatrix();steps.setMatrixAt(i,dummy.matrix);}
    group.add(steps);
    // Garde-corps à panneaux incurvés, filets d’or et petites palmettes en relief.
    for(const radius of [s.inner,s.outer]){
      const vertices=[],indices=[],low=[],high=[];
      for(let i=0;i<=s.steps*2;i++){
        const t=i/(s.steps*2),a=s.start+t*span,y=s.height*t,x=s.x+Math.cos(a)*radius,z=s.z+Math.sin(a)*radius;
        vertices.push(x,y+.2,z,x,y+.88,z);low.push(new THREE.Vector3(x,y+.17,z));high.push(new THREE.Vector3(x,y+1.04,z));
        if(i<s.steps*2&&!(radius===s.outer&&(t<.024||t>.976))){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
      }
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();const panelMat=dark.clone();panelMat.side=THREE.DoubleSide;add(geo,panelMat,0,0,0,group).name='spiral-carved-balustrade';
      const trim=radius===s.outer?Math.ceil(s.steps*.048):0;
      rail(low.slice(trim,low.length-trim),gold,.025,group);rail(high.slice(trim,high.length-trim),gold,.045,group);
      for(let i=1;i<s.turns*12;i++){
        const t=i/(s.turns*12),a=s.start+t*span,y=s.height*t;
        for(const facing of radius===s.outer?[-1,1]:[1]){
          const r=radius+facing*.045,x=s.x+Math.cos(a)*r,z=s.z+Math.sin(a)*r;
          const rosette=add(new THREE.TorusGeometry(.082,.018,5,12),gold,x,y+.54,z,group);rosette.rotation.y=Math.PI/2-a;
          for(const side of [-1,1]){const leaf=add(new THREE.OctahedronGeometry(.1),gold,x+Math.sin(a)*side*.14,y+.54,z-Math.cos(a)*side*.14,group);leaf.scale.set(.65,1.3,.25);leaf.rotation.set(0,Math.PI/2-a,side*.5);}
        }
      }
    }
    if(underground){
      const lining=dark.clone();lining.side=THREE.DoubleSide;
      // Le puits laisse une ouverture sous l’arche du palier inférieur.
      const radius=s.outer+.19;
      const wall=add(new THREE.CylinderGeometry(radius,radius,8,64,1,true,.34,TAU-.68),lining,s.x,-4,s.z,group);wall.rotation.y=Math.PI/2-s.start;
      const upperLintel=add(new THREE.CylinderGeometry(radius,radius,5.15,8,1,true,-.34,.68),lining,s.x,-2.575,s.z,group);upperLintel.rotation.y=Math.PI/2-s.start;
      for(let i=0;i<8;i++){
        const a=.7+i*Math.PI/2,y=-8*a/(TAU*2)+1.35;
        const c=candle(s.x+Math.cos(a+s.start)*(radius-.14),y,s.z+Math.sin(a+s.start)*(radius-.14),group,'spiral-candle',i%3===0);c.rotation.y=Math.PI/2-a;
      }
      group.traverse(object=>object.layers.set(2));
      // Couronnement au niveau de la salle ; passage ouvert du côté droit.
      const guard=new THREE.Group();guard.name='crypt-stairwell-guard';root.add(guard);
      const points=[];for(let i=0;i<=72;i++){const a=s.start+.36+i/72*(TAU-.72);points.push(new THREE.Vector3(s.x+Math.cos(a)*(radius+.02),1.05,s.z+Math.sin(a)*(radius+.02)));}
      rail(points,gold,.05,guard);
      for(let i=0;i<34;i++){const a=s.start+.4+i/33*(TAU-.8),x=s.x+Math.cos(a)*radius,z=s.z+Math.sin(a)*radius;box(.065,1,.065,x,.52,z,cream,guard);}
    }
    return group;
  }
  spiral(SPIRALS.crypt,'crypt-spiral-stair',true);
  spiral(SPIRALS.gallery,'gallery-spiral-stair',false);
  spiral(SPIRALS.galleryRight,'gallery-right-spiral-stair',false);
  // Petite chambre enterrée : toutes ses surfaces reçoivent seulement les bougies.
  const cy=CRYPT.floor;
  box(9.6,.2,11.4,0,cy-.1,-35.7,stone,crypt);
  for(const x of [-4.8,4.8])box(.3,3.25,11.4,x,cy+1.625,-35.7,stone,crypt);
  for(const z of [-41.4,-30])box(9.6,3.25,.3,0,cy+1.625,z,stone,crypt);
  const ceiling=new THREE.Shape();ceiling.moveTo(-4.8,-41.4);ceiling.lineTo(4.8,-41.4);ceiling.lineTo(4.8,-30);ceiling.lineTo(-4.8,-30);ceiling.closePath();const opening=new THREE.Path();opening.absarc(0,SPIRALS.crypt.z,SPIRALS.crypt.outer+.24,0,TAU,true);ceiling.holes.push(opening);
  const ceilingMesh=add(new THREE.ShapeGeometry(ceiling,64),stone,0,cy+3.25,0,crypt);ceilingMesh.rotation.x=Math.PI/2;ceilingMesh.material=stone.clone();ceilingMesh.material.side=THREE.DoubleSide;ceilingMesh.name='crypt-ceiling-with-stairwell';
  for(const x of [-4.64,4.64])for(const z of [-32,-36.2,-39.8]){
    box(.18,2.9,.35,x,cy+1.45,z,cream,crypt);candle(x-Math.sign(x)*.19,cy+1.8,z,crypt,'crypt-candle',z!==-32);
  }
  for(const x of [-2,2])candle(x,cy+.5,-39.3,crypt,'crypt-candle',false);
  for(const x of [-3,-1.5,0,1.5,3])box(.018,.012,10.8,x,cy+.009,-35.7,gray,crypt);
  for(let z=-40.5;z<-30;z+=1.5)box(9,.012,.018,0,cy+.009,z,gray,crypt);
  box(3.25,.12,2.1,0,cy+.06,CRYPT.tomb.z,cream,crypt);
  const tomb=scene.getObjectByName('saint-peter-tomb');crypt.add(tomb);tomb.position.set(CRYPT.tomb.x-CRYPT.centerX,cy+.12,CRYPT.tomb.z);
  // Moulures et reliefs sobres autour du tombeau, sans source lumineuse supplémentaire.
  const ornaments=new THREE.Group();ornaments.name='crypt-ornaments';crypt.add(ornaments);
  const burgundy=mat('#4d2b34');
  for(const side of [-1,1]){
    for(const y of [cy+.24,cy+3.02])box(.12,.07,11,side*4.62,y,-35.7,gold,ornaments);
    for(const z of [-33,-36,-39]){
      const relief=new THREE.Group();relief.position.set(side*4.48,cy+1.1,z);relief.rotation.y=-side*Math.PI/2;ornaments.add(relief);
      box(.035,1.1,.04,0,.3,0,gold,relief);
      for(let i=0;i<4;i++)for(const sign of [-1,1]){const leaf=add(new THREE.OctahedronGeometry(.12),gold,sign*(.1+i*.015),i*.2,0,relief);leaf.scale.set(.55,1.5,.3);leaf.rotation.z=-sign*.55;}
    }
  }
  for(const x of [-2.65,2.65]){
    box(1.35,1.9,.06,x,cy+1.65,-41.21,burgundy,ornaments);
    for(const dx of [-.7,.7])box(.055,2,.08,x+dx,cy+1.65,-41.15,gold,ornaments);
    for(const y of [cy+.65,cy+2.65])box(1.45,.055,.08,x,y,-41.15,gold,ornaments);
  }
  const archPoints=[];for(let i=0;i<=32;i++){const a=i*Math.PI/32;archPoints.push(new THREE.Vector3(1.7*Math.cos(a),cy+1.05+1.8*Math.sin(a),-41.12));}rail(archPoints,gold,.045,ornaments);
  for(const x of [-1.7,1.7])box(.09,1.1,.12,x,cy+.55,-41.12,cream,ornaments);
  const medallion=add(new THREE.TorusGeometry(.45,.035,6,32),gold,0,cy+2.03,-41.03,ornaments);
  box(.045,.55,.04,0,cy+2.03,-40.98,gold,ornaments);box(.3,.045,.04,0,cy+2.11,-40.98,gold,ornaments);
  // Brume basse locale : sprites diffus, translucides, sans halo ni brouillard global.
  const mistCanvas=document.createElement('canvas');mistCanvas.width=128;mistCanvas.height=128;const mctx=mistCanvas.getContext('2d'),gradient=mctx.createRadialGradient(64,64,2,64,64,64);gradient.addColorStop(0,'#c7c0aeaa');gradient.addColorStop(.5,'#b9b5aa44');gradient.addColorStop(1,'#a9a79f00');mctx.fillStyle=gradient;mctx.fillRect(0,0,128,128);
  const mistTexture=new THREE.CanvasTexture(mistCanvas),mist=new THREE.Group();mist.name='crypt-low-mist';crypt.add(mist);const mistPuffs=[];
  for(let i=0;i<18;i++){
    const material=new THREE.SpriteMaterial({map:mistTexture,color:'#b9b1a1',transparent:true,opacity:.22,depthWrite:false});
    const puff=new THREE.Sprite(material);const x=-3.6+(i%5)*1.65,z=-40.2+Math.floor(i/5)*2.3;puff.position.set(x,cy+.3+(i%3)*.1,z);puff.scale.set(3.4,.85,1);mist.add(puff);mistPuffs.push({puff,x,z,phase:i*1.73});
  }
  crypt.traverse(object=>object.layers.set(2));
  // Balcons ouverts en circuit, au-dessus des tableaux, avec un vide sur toute la salle.
  const balcony=new THREE.Group();balcony.name='marble-room-upper-balconies';root.add(balcony);
  const level=6.4;
  for(const side of [-1,1]){
    box(1.55,.19,21.4,side*7.325,level-.095,1.7,cream,balcony);
    flatRail(side*6.55,-9,side*6.55,10.35,level,balcony);flatRail(side*8.1,-9,side*8.1,12.4,level,balcony);flatRail(side*6.55,-9,side*8.1,-9,level,balcony);
    for(const z of [-7,-1,5]){const brace=box(.8,.45,.35,side*7.7,level-.4,z,cream,balcony);brace.rotation.z=side*.3;}
  }
  const upperStairs=[SPIRALS.gallery,SPIRALS.galleryRight],s=SPIRALS.gallery,r=s.outer+.1,z0=10.35,a=Math.asin((z0-s.z)/r),dx=Math.sqrt(r*r-(z0-s.z)**2);
  const bridge=new THREE.Shape();bridge.moveTo(-8.1,z0);
  for(const stair of upperStairs){bridge.lineTo(stair.x-dx,z0);bridge.absarc(stair.x,stair.z,r,Math.PI-a,a,true);}
  bridge.lineTo(8.1,z0);bridge.lineTo(8.1,12.4);bridge.lineTo(-8.1,12.4);bridge.closePath();
  const deck=add(new THREE.ExtrudeGeometry(bridge,{depth:.19,bevelEnabled:false,curveSegments:48}),cream,0,level,0,balcony);deck.rotation.x=Math.PI/2;deck.name='upper-balcony-open-deck';
  flatRail(-8.1,12.4,8.1,12.4,level,balcony);
  for(const [x1,x2] of [[-6.55,s.x-dx],[s.x+dx,SPIRALS.galleryRight.x-dx],[SPIRALS.galleryRight.x+dx,6.55]])flatRail(x1,z0,x2,z0,level,balcony);
  for(const stair of upperStairs){
    const landing=box(1.5,.19,1.68,stair.x,level-.095,11.56,cream,balcony);landing.name='stair-balcony-landing';
    for(const side of [-1,1])box(.04,.018,1.66,stair.x+side*.75,level+.01,11.56,gold,balcony);
    for(const [start,end] of [[a,Math.PI/2-.45],[Math.PI/2+.45,Math.PI-a]]){
      const points=[];for(let i=0;i<=20;i++){const b=start+(end-start)*i/20;points.push(new THREE.Vector3(stair.x+Math.cos(b)*r,level+1.05,stair.z+Math.sin(b)*r));}rail(points,gold,.045,balcony);
    }
    for(const side of [-1,1])flatRail(stair.x+side*.78,10.72,stair.x+side*.78,11.4,level,balcony);
    // Jonctions continues entre les mains courantes hélicoïdales et le palier.
    const direction=stair.direction??1,outerT=1-Math.ceil(stair.steps*.048)/(stair.steps*2),outerA=stair.start+outerT*stair.turns*TAU*direction;
    rail([new THREE.Vector3(stair.x+Math.cos(outerA)*stair.outer,stair.height*outerT+1.04,stair.z+Math.sin(outerA)*stair.outer),new THREE.Vector3(stair.x+direction*.78,level+1.05,11.35)],gold,.045,balcony);
    rail([new THREE.Vector3(stair.x,level+1.04,stair.z+stair.inner),new THREE.Vector3(stair.x-direction*.78,level+1.05,10.72)],gold,.045,balcony);
  }
  // Galerie transversale : le tour complet reste ouvert autour du vide central.
  const frontDeck=box(16.2,.19,1.55,0,level-.095,-8.225,cream,balcony);frontDeck.name='balcony-front-bridge';
  flatRail(-6.55,-7.45,6.55,-7.45,level,balcony);
  flatRail(-8.1,-9,8.1,-9,level,balcony);
  const decor=new THREE.Group();decor.name='balcony-decorations';balcony.add(decor);
  // Incrustations affleurantes et moulures contre les murs : aucun obstacle dans l’allée.
  for(const side of [-1,1]){
    for(const x of [7.04,7.62])box(.045,.008,19.4,side*x,level+.006,.7,gold,decor);
    box(.28,.006,19.4,side*7.33,level+.004,.7,balconyBurgundy,decor);
    for(const z of [-5.5,-1,3.5,7]){
      box(.06,1.8,1.25,side*8.18,level+1.55,z,balconyBurgundy,decor);
      for(const edge of [-1,1])box(.09,1.95,.045,side*8.12,level+1.55,z+edge*.65,gold,decor);
      for(const y of [.58,2.52])box(.09,.055,1.34,side*8.12,level+y,z,gold,decor);
      const rosette=add(new THREE.TorusGeometry(.17,.027,6,16),gold,side*8.06,level+1.58,z,decor);rosette.rotation.y=Math.PI/2;
      for(const edge of [-1,1]){const leaf=add(new THREE.OctahedronGeometry(.12),gold,side*8.06,level+1.58+edge*.3,z,decor);leaf.scale.set(.25,1.4,.7);}
    }
  }
  for(const z of [-8.225,11.95]){
    box(12.7,.006,.22,0,level+.004,z,balconyBurgundy,decor);
    for(const edge of [-1,1])box(12.7,.008,.035,0,level+.006,z+edge*.2,gold,decor);
  }
  function inCrypt(x,z){return Math.abs(x-CRYPT.centerX)<4.5&&z>-41.1&&z<-30.3;}
  function onBalcony(x,z){
    const sides=Math.abs(x)>6.75&&Math.abs(x)<7.91&&z>-8.8&&z<12.2;
    const rear=Math.abs(x)<7.91&&z>10.55&&z<12.2&&upperStairs.every(stair=>Math.hypot(x-stair.x,z-stair.z)>r+.03);
    const landing=upperStairs.some(stair=>Math.abs(x-stair.x)<.56)&&z>10.72&&z<12.2;
    const front=Math.abs(x)<7.91&&z>-8.8&&z<-7.65;
    return sides||rear||landing||front;
  }
  function candidates(s,x,z,h){
    const dx=x-s.x,dz=z-s.z,radius=Math.hypot(dx,dz),values=[],span=s.turns*TAU;
    let a=(((Math.atan2(dz,dx)-s.start)*(s.direction??1))%TAU+TAU)%TAU;
    if(radius>s.inner+.15&&radius<s.outer-.14){
      for(let k=0;k<=Math.ceil(s.turns);k++){const t=a+k*TAU;if(t<=span+.001)values.push(s.height*t/span);}
      if(a>TAU-.12)values.push(0);
    }
    // Paliers radiaux : entrée au pied et sortie au sommet, sans saut de niveau.
    const startDistance=Math.abs(Math.atan2(Math.sin(a),Math.cos(a))),endDistance=Math.abs(Math.atan2(Math.sin(a-span),Math.cos(a-span)));
    if(startDistance<.2&&radius>s.inner+.15&&radius<s.outer+.45)values.push(0);
    if(endDistance<.2&&radius>s.inner+.15&&radius<s.outer+.45)values.push(s.height);
    return values.filter(y=>Math.abs(y-h)<.3);
  }
  function surfaceAt(x,z,h){
    const down=SPIRALS.crypt,up=SPIRALS.gallery,rd=Math.hypot(x-down.x,z-down.z),ru=Math.hypot(x-up.x,z-up.z);
    const options=Object.values(SPIRALS).flatMap(stair=>candidates(stair,x,z,h));
    if(h>5.95&&onBalcony(x,z))options.push(level);
    if(h<-7.7&&inCrypt(x,z)){
      const a=Math.abs(Math.atan2(Math.sin(Math.atan2(z-down.z,x-down.x)-down.start),Math.cos(Math.atan2(z-down.z,x-down.x)-down.start)));
      // Le mur du puits ne s’ouvre que sur le palier inférieur, à droite.
      const outsideWell=rd>down.outer+.32;
      const exit=a<.29&&rd>down.inner+.15;
      const tombBlocked=Math.abs(x-CRYPT.tomb.x)<1.75&&Math.abs(z-CRYPT.tomb.z)<1.28;
      if((outsideWell||exit)&&!tombBlocked)options.push(cy);
    }
    if(options.length)return {height:options.sort((a,b)=>Math.abs(a-h)-Math.abs(b-h))[0]};
    if(rd<down.outer+.24||ru<up.outer+.18||Math.hypot(x-SPIRALS.galleryRight.x,z-SPIRALS.galleryRight.z)<SPIRALS.galleryRight.outer+.18||h>.3||h<-.3)return null;
    return undefined;
  }
  function update(time){mistPuffs.forEach(({puff,x,z,phase})=>{puff.position.x=x+Math.sin(time*.13+phase)*.28;puff.position.z=z+Math.cos(time*.1+phase)*.22;puff.material.opacity=.2+.025*Math.sin(time*.2+phase);});flames.forEach((f,i)=>f.scale.y=1.9+Math.sin(time*5+i)*.1);lights.forEach((l,i)=>l.intensity=13*(1+.025*Math.sin(time*4+i)));}
  return {surfaceAt,update,crypt,onBalcony,spirals:SPIRALS};
}
