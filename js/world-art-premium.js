// CRAFTERRA 0.11 · Rich pixel-art sprites for gameplay objects.
// All artwork belongs to real interactive objects in the world.
const cache=new Map();
const H=(v)=>{v=Math.imul(v^(v>>>16),0x7feb352d);v=Math.imul(v^(v>>>15),0x846ca68b);return (v^(v>>>16))>>>0;};
const rng=(n)=>()=>((n=H(n+0x9e3779b9))>>>0)/4294967296;
function poly(c,coords,fill,stroke=null){
 c.beginPath();c.moveTo(coords[0],coords[1]);
 for(let i=2;i<coords.length;i+=2)c.lineTo(coords[i],coords[i+1]);
 c.closePath();c.fillStyle=fill;c.fill();
 if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}
}
function p(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x|0,y|0,w|0,h|0);}
function sprite(key,w,h,paint){
 if(cache.has(key))return cache.get(key);
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=w;c.height=h;
 const g=c.getContext('2d');
 if(!g)return null;
 g.imageSmoothingEnabled=false;paint(g);
 cache.set(key,c);return c;
}
function canopyDetails(g,seed,polygon,colors,count=70){
 const rand=rng(seed);g.save();g.beginPath();g.moveTo(polygon[0],polygon[1]);
 for(let i=2;i<polygon.length;i+=2)g.lineTo(polygon[i],polygon[i+1]);
 g.closePath();g.clip();
 for(let k=0;k<count;k++){
  const x=12+rand()*74,y=11+rand()*77,z=rand()>.76?6:rand()>.48?4:2;
  p(g,x,y,z,2+rand()*3,colors[Math.floor(rand()*colors.length)]);
 }
 g.restore();
}
export function drawPremiumTree(ctx,x,y,species='pine',seed=0){
 const variant=H(seed||7)%8;
 const tree=sprite(species+variant,110,118,g=>{
  const rand=rng(H(variant+species.length*71));
  p(g,48,71,13,43,'#4b3428');p(g,48,73,4,38,'#ad7f4d');p(g,57,77,4,35,'#312b24');
  for(let i=0;i<6;i++)p(g,49+rand()*9,78+i*5,2,2,'#d4a068');
  if(species==='oak'){
   const cloud=[[27,39,21,21],[44,21,24,24],[65,31,23,23],[22,56,23,20],[51,49,32,23],[40,14,20,17]];
   for(let i=0;i<cloud.length;i++){
    const [cx,cy,w,h]=cloud[i];
    p(g,cx-3,cy+4,w+6,h+3,'#173b35');
    p(g,cx,cy,w,h,['#31704a','#438951','#3d7d41','#548f4a','#5c9d51','#568c39'][i]);
   }
   for(let k=0;k<95;k++){
    const px=18+rand()*72,py=17+rand()*60;
    const pal=rand()>.7?'#b7d65b':rand()>.5?'#86bd4c':rand()>.25?'#5a9d43':'#235e3d';
    p(g,px,py,2+rand()*5,2+rand()*4,pal);
   }
   for(let k=0;k<15;k++)p(g,20+rand()*60,23+rand()*44,2,2,'#d5e880');
  }else{
   const branches=[
    [53,8, 22,45, 85,45],[53,20,17,59,90,59],[53,30,12,77,95,77],
    [53,43,15,90,91,90]
   ];
   for(let i=0;i<branches.length;i++){
    const b=branches[i],dark=i%2?'#154c3e':'#164d3a',base=i%2?'#257050':'#2f8250';
    poly(g,[b[0],b[1]+5,b[2]-3,b[3]+5,b[4]+3,b[5]+5],dark);
    poly(g,[b[0],b[1],b[2],b[3],b[4],b[5]],base);
   }
   const outline=[53,8,13,80,92,80];
   canopyDetails(g,variant*721+777,outline,['#3e9151','#72b953','#a4d855','#255c45','#86cb54','#d9ed77'],105);
   for(let k=0;k<16;k++)p(g,36+rand()*33,13+rand()*62,2+rand()*3,2,'#c6e777');
  }
 });
 if(tree)ctx.drawImage(tree,Math.round(x-55),Math.round(y-111));
}
export function drawPremiumRock(ctx,x,y,ore='stone'){
 const map={
  stone:['#b3b6aa','#747d82','#4c626c','#dce0c8'],
  iron:['#bec8cb','#6d7785','#435561','#e1eff1'],copper:['#f3a86d','#9b674d','#5a5960','#ffd491'],
  tin:['#e6dbb4','#9d9e99','#596b7c','#fff4d2'],coal:['#656477','#30394c','#202e3c','#8892a0'],
  quartz:['#b6f3ee','#619db8','#3a7d94','#e1fff8'],silver:['#edf7f7','#9ba5b7','#636f83','#fffefe'],
  gold:['#f8cd68','#c18740','#7c5d40','#fff1a0']
 };
 const colors=map[ore]||map.stone;
 const rock=sprite('ore'+ore,53,44,g=>{
  poly(g,[4,24,15,7,36,3,50,19,42,34,12,37],colors[2]);
  poly(g,[15,7,36,3,45,17,33,26,5,24],colors[0]);
  poly(g,[5,24,33,26,42,34,12,37],colors[1]);
  poly(g,[36,3,50,19,42,34,33,26,45,17],colors[2]);
  p(g,16,12,12,3,colors[3]);p(g,12,18,8,3,colors[3]);
  for(const [sx,sy]of [[18,17],[31,12],[39,21],[27,28]]){
   p(g,sx,sy,5,4,ore==='stone'?'#a4b5af':colors[3]);
   p(g,sx+1,sy,2,2,ore==='coal'?'#596777':colors[0]);
  }
  p(g,14,35,22,2,'#1f38474d');
 });
 if(rock)ctx.drawImage(rock,Math.round(x-26),Math.round(y-37));
}
export function drawPremiumHouse(ctx,x,y,blue=false){
 const house=sprite('house'+blue,123,119,g=>{
  p(g,20,88,86,17,'#283b42');p(g,22,59,82,37,blue?'#e0c39c':'#edc89a');
  p(g,22,59,5,37,'#967050');p(g,99,59,5,37,'#977450');
  p(g,26,82,72,4,'#f1d9a7');p(g,28,61,67,2,'#fff0c1');
  // warm windows that seem illuminated, not flat cyan rectangles
  for(const wx of [31,84]){
   p(g,wx-3,66,19,25,'#805535');p(g,wx-1,66,15,20,'#ffdb7c');
   p(g,wx+2,68,9,14,'#fff0b0');p(g,wx+5,66,3,20,'#845530');p(g,wx,76,14,2,'#845530');
   p(g,wx+1,86,12,3,'#f1bb59');
  }
  p(g,53,72,22,30,'#6b442f');p(g,57,75,14,27,'#46392e');p(g,68,89,3,3,'#f9d277');
  p(g,49,100,36,5,'#ada58a');p(g,53,104,28,3,'#8a8e7e');
  // isometric roof and tiled material, extending beyond the body.
  poly(g,[12,57,55,24,117,58,104,64,55,32,20,64],blue?'#174868':'#7f4a3d','#173648');
  poly(g,[55,24,117,58,104,64,55,32],blue?'#27617d':'#a7634d');
  poly(g,[12,57,55,24,55,32,20,64],blue?'#32748e':'#b97954');
  g.save();g.beginPath();g.moveTo(12,57);g.lineTo(55,24);g.lineTo(117,58);g.lineTo(104,64);g.lineTo(55,32);g.lineTo(20,64);g.closePath();g.clip();
  for(let i=0;i<7;i++){
   const ry=27+i*6;
   g.strokeStyle=i%2?'#102e4c':'#90bbbf';g.lineWidth=1.5;
   g.beginPath();g.moveTo(4,ry+15);g.lineTo(117,ry+15);g.stroke();
   for(let j=0;j<12;j++)p(g,8+j*11+(i%2)*5,ry+9,1,5,i%2?'#133f55':'#5790a0');
  }
  g.restore();
  // chimney fitted to roof
  p(g,84,13,13,24,'#8f6b4f');p(g,86,13,10,17,'#c49a70');p(g,82,10,17,5,'#f0d2a6');
  p(g,85,11,12,2,'#3d4043');p(g,101,34,4,4,'#deecdf8c');
 });
 if(house)ctx.drawImage(house,Math.round(x-60),Math.round(y-107));
}
export function drawPremiumCave(ctx,x,y,label=''){
 const cave=sprite('cave',133,121,g=>{
  const rand=rng(177);
  poly(g,[4,107,12,48,34,22,45,35,68,10,91,31,114,18,129,65,130,112], '#596577','#263e4a');
  poly(g,[4,107,12,48,34,22,45,35,68,10,91,31,114,18,129,65,130,112,93,106,39,111],'#7a8490');
  for(let i=0;i<45;i++){
   const bx=10+rand()*110,by=25+rand()*75;
   p(g,bx,by,4+rand()*10,2+rand()*4,rand()>.4?'#a5ab9d':'#475c6b');
  }
  // Stone door blocks and glowing interior
  p(g,40,61,60,49,'#253744');p(g,47,68,46,42,'#111d2a');
  p(g,51,84,37,23,'#362c24');p(g,60,97,22,10,'#a75a28');
  p(g,38,57,10,53,'#b0b2a5');p(g,95,57,10,53,'#949b98');
  p(g,36,52,73,11,'#8e9a9e');p(g,40,47,65,7,'#c2c1ae');
  for(let i=0;i<4;i++){
   p(g,39+i*17,53,1,9,'#4d606b');p(g,38,60+i*11,10,1,'#526473');p(g,95,60+i*11,10,1,'#586672');
  }
  for(const bx of [28,111]){
   p(g,bx-4,66,7,24,'#543929');p(g,bx-9,61,17,6,'#ad7440');
   poly(g,[bx-7,61,bx-5,47,bx,36,bx+4,49,bx+6,61],'#ffc45c');
   poly(g,[bx-4,59,bx,45,bx+3,59],'#fff0a7');
  }
  // Moss/vines around the cave are painted onto interactive portal rock
  for(let k=0;k<31;k++)p(g,8+rand()*116,38+rand()*48,3+rand()*6,1+rand()*3,
    rand()>.46?'#598e5e':'#abc35f');
 });
 if(cave)ctx.drawImage(cave,Math.round(x-66),Math.round(y-113));
 if(label){ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillStyle='#ffe1a6';ctx.fillText(label,x,y-120,130);}
}
export function drawPremiumForge(ctx,x,y,active=false){
 const forge=sprite('forge',65,69,g=>{
  p(g,5,39,56,23,'#344652');
  p(g,4,35,57,8,'#a7ada6');p(g,7,30,51,7,'#84979b');
  p(g,12,17,44,31,'#737f83');p(g,12,17,6,31,'#b9bfaf');
  p(g,52,19,5,30,'#51656d');p(g,17,13,31,6,'#c3c1a9');
  p(g,20,32,30,28,'#29383f');
  p(g,24,37,21,21,'#0d2833');
  for(const [px,py]of [[8,44],[50,50],[13,55],[36,23]]){
   p(g,px,py,6,2,'#c6cbb8');
  }
 });
 if(forge)ctx.drawImage(forge,Math.round(x-32),Math.round(y-62));
 if(active){
  ctx.fillStyle='#b84b22';ctx.fillRect(x-12,y-18,25,13);
  ctx.fillStyle='#fc9b37';ctx.fillRect(x-9,y-22,17,16);
  ctx.fillStyle='#fff5a5';ctx.fillRect(x-3,y-17,6,11);
 }
}
export function drawPremiumBridge(ctx,x,y,built=false){
 ctx.save();
 const wood=built?'#bc8653':'#8a6543';
 poly(ctx,[x-33,y-11,x+25,y-12,x+34,y+4,x-25,y+6],wood,'#4d3a2b');
 for(let i=0;i<7;i++){
  const bx=x-30+i*9;
  poly(ctx,[bx,y-11,bx+7,y-11,bx+15,y+5,bx+8,y+5],i%2?'#c79b6c':'#e0b97b','#6f4a31');
  p(ctx,bx+2,y-10,1,2,'#e8cf91');
 }
 for(const dx of [-29,28]){
  p(ctx,x+dx,y-29,5,27,'#68432c');p(ctx,x+dx+1,y-31,4,7,'#bf935d');
 }
 if(!built){
  p(ctx,x-6,y-11,14,15,'#2e708c');
  p(ctx,x-8,y-2,12,5,'#276782');
 }
 ctx.restore();
}
export function premiumSpriteCacheSize(){return cache.size;}
