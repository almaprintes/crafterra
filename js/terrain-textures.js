// CRAFTERRA · Texturas y relieve del mundo isométrico.
// Todo el detalle es procedimental, determinista y cacheado en pequeños sprites.
// No se descargan imágenes, no se crean objetos decorativos, no se altera la física.
export const TILE_WIDTH=48;
export const TILE_HEIGHT=24;
const SPRITE_HEIGHT=36;
export const TERRAIN_PALETTE=Object.freeze({
 meadow:{base:'#92b879',light:'#c2dc92',dark:'#517e55',soil:'#82734e',edge:'#4b7652',side:'#53774d'},
 forest:{base:'#547d5e',light:'#91a66b',dark:'#294e42',soil:'#695b44',edge:'#345949',side:'#3d5543'},
 rocky:{base:'#8b9791',light:'#c4ccc0',dark:'#52636a',soil:'#74766c',edge:'#586b70',side:'#57636a'},
 river:{base:'#37839e',light:'#9dd8d5',dark:'#175d79',soil:'#377c91',edge:'#2f7088',side:'#1f5874'},
 cave:{base:'#505c69',light:'#9caaa9',dark:'#263947',soil:'#6e7472',edge:'#344955',side:'#33414e'},
 cottage:{base:'#b48b63',light:'#e7ba83',dark:'#735137',soil:'#8c6d4b',edge:'#6c523a',side:'#74553c'},
 workshop:{base:'#70869a',light:'#becbd0',dark:'#46596b',soil:'#617583',edge:'#516b78',side:'#4a5b66'}
});
const TEXTURE_COUNTS=Object.freeze({meadow:65,forest:78,rocky:72,river:34,cave:90,cottage:20,workshop:34});
// 32 variants / biome: lots of detail with a fixed offscreen atlas (~1.6 MB).
const VARIANTS=32;
const atlas=new Map();
const uint=v=>v>>>0;
function hash32(x,y,seed=0){
 let h=uint(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(seed|0,2246822519)+0x9e3779b9);
 h=Math.imul(h^(h>>>13),1274126177);h=uint(h^(h>>>16));
 return h;
}
function rng(seed){
 let n=uint(seed||1);
 return ()=>{n=uint(n+0x6d2b79f5);let r=Math.imul(n^(n>>>15),1|n);r^=r+Math.imul(r^(r>>>7),61|r);return uint(r^(r>>>14))/4294967296};
}
export function terrainVariant(x,y){return hash32(x,y,17)%VARIANTS;}
export function terrainTextureSpec(biome,x,y){
 const type=TERRAIN_PALETTE[biome]?biome:'meadow';
 return Object.freeze({biome:type,variant:terrainVariant(x,y),dots:TEXTURE_COUNTS[type],color:TERRAIN_PALETTE[type].base});
}
export function terrainTextureCount(){return atlas.size;}
function pathTop(c){
 c.beginPath();
 c.moveTo(24,3);
 c.lineTo(47.4,15);
 c.lineTo(24,27);
 c.lineTo(.6,15);
 c.closePath();
}
function makeAtlasSprite(type,variant){
 const canvas=document.createElement('canvas');
 canvas.width=TILE_WIDTH;canvas.height=SPRITE_HEIGHT;
 const g=canvas.getContext('2d',{alpha:true});
 if(!g)return canvas;
 g.imageSmoothingEnabled=false;
 const pal=TERRAIN_PALETTE[type],rand=rng(hash32(variant,31,type.length*107));
 const tint=(c,alpha)=>{g.globalAlpha=alpha;g.fillStyle=c;};
 // Small topographically raised tile, with two darker visible side facets.
 g.fillStyle=pal.side;
 g.beginPath();g.moveTo(.7,15);g.lineTo(24,27);g.lineTo(24,32);
 g.lineTo(.7,20);g.closePath();g.fill();
 g.fillStyle=pal.edge;
 g.beginPath();g.moveTo(24,27);g.lineTo(47.3,15);g.lineTo(47.3,20);g.lineTo(24,32);g.closePath();g.fill();
 g.fillStyle=pal.dark;g.fillRect(23,30,2,2);
 g.globalAlpha=1;
 g.save();
 pathTop(g);g.clip();
 g.fillStyle=pal.base;g.fillRect(0,2,48,26);
 // Sun from northwest and subtle dirt/stain color variation; pixel-art finish.
 const light=g.createLinearGradient(4,3,44,28);
 light.addColorStop(0,'#ffffff20');light.addColorStop(.56,'#ffffff00');light.addColorStop(1,'#10263336');
 g.fillStyle=light;g.fillRect(0,2,48,26);
 const patches=type==='forest'?6:type==='rocky'||type==='cave'?7:type==='meadow'?5:3;
 for(let i=0;i<patches;i++){
  const x=3+rand()*41,y=4+rand()*23;
  tint(rand()>.48?pal.dark:pal.light,.065+rand()*.13);
  g.beginPath();g.ellipse(x,y,2+rand()*7,.8+rand()*2.3,rand()*.4,0,Math.PI*2);g.fill();
 }
 for(let i=0;i<TEXTURE_COUNTS[type];i++){
  // Interior uniform sampling is clipped to the 48×24 diamond, avoiding grid overlays.
  const x=1+rand()*46,y=3+rand()*24,size=(type==='rocky'||type==='cave'?1:rand()>.85?2:1);
  tint(rand()<.52?pal.dark:rand()<.57?pal.light:pal.soil,
    type==='cave'?.24+rand()*.19:type==='rocky'?.17+rand()*.18:.10+rand()*.19);
  g.fillRect(x|0,y|0,size,rand()>.82?2:1);
 }
 // Materials actually have different microstructure, not just a different palette.
 if(type==='meadow'||type==='forest'){
  const blades=type==='meadow'?18:13;
  for(let k=0;k<blades;k++){
   const x=4+rand()*39,y=6+rand()*18,length=1+rand()*3;
   tint(rand()>.28?pal.dark:pal.light,.2+rand()*.2);
   g.fillRect(x|0,y|0,1,length|0);
   if(rand()>.66)g.fillRect((x+1)|0,(y+1)|0,1,1);
  }
  if(type==='forest'){
   // Leaf litter / roots are microdetails of the surface, not collectible items.
   for(let k=0;k<13;k++){
    const x=5+rand()*38,y=7+rand()*16;
    tint(rand()>.5?pal.soil:pal.light,.27+rand()*.19);
    g.fillRect(x|0,y|0,2,1);
    if(rand()>.67)g.fillRect((x+1)|0,(y-1)|0,1,1);
   }
  }else{
   for(let k=0;k<6;k++){
    const x=7+rand()*34,y=8+rand()*13;
    tint(pal.soil,.22);g.fillRect(x|0,y|0,2+(rand()*3|0),1);
   }
  }
 }else if(type==='rocky'||type==='cave'||type==='workshop'){
  for(let k=0;k<(type==='cave'?9:7);k++){
   const x=5+rand()*36,y=7+rand()*15;
   tint(rand()>.55?pal.dark:pal.light,.2+rand()*.2);
   g.beginPath();g.moveTo(x|0,y|0);g.lineTo((x+2+rand()*5)|0,(y+(rand()>.5?2:-2))|0);
   g.strokeStyle=g.fillStyle;g.lineWidth=rand()>.8?2:1;g.stroke();
  }
  if(type==='cave')for(let k=0;k<6;k++){
   const x=5+rand()*37,y=6+rand()*16;
   tint(pal.light,.12+rand()*.17);
   g.fillRect(x|0,y|0,3+(rand()*4|0),1);
  }
 }else if(type==='river'){
  // Ripple reflections follow the water current, rather than grass speckles.
  for(let k=0;k<16;k++){
   const x=3+rand()*42,y=5+rand()*19;
   tint(rand()>.4?pal.light:pal.dark,.18+rand()*.32);
   g.fillRect(x|0,y|0,2+(rand()*8|0),1);
  }
 }else if(type==='cottage'){
  // Timber planks with joints, end grain, and soft woodgrain.
  for(let k=0;k<5;k++){
   const y=5+k*5;
   tint(pal.dark,.30);g.fillRect(0,y,48,1);
   tint(pal.light,.22);g.fillRect(0,y+1,48,1);
   const x=((k*13+variant*7)%34)+6;
   tint(pal.dark,.28);g.fillRect(x,y-2,1,5);
   tint(pal.light,.25);g.fillRect(x+2,y+2,6,1);
  }
 }
 g.restore();g.globalAlpha=1;
 // Upper-left rim + lower-right inset shadow emphasize material thickness.
 g.strokeStyle='#f8f8e51e';g.lineWidth=1;
 g.beginPath();g.moveTo(1,14.5);g.lineTo(24,3.4);g.lineTo(47,14.5);g.stroke();
 g.strokeStyle='#061d2c39';g.beginPath();g.moveTo(47,15.5);g.lineTo(24,26.5);g.lineTo(1,15.5);g.stroke();
 return canvas;
}
function cachedSprite(type,variant){
 const key=type+':'+variant;
 if(!atlas.has(key) && typeof document!=='undefined'){
  atlas.set(key,makeAtlasSprite(type,variant));
 }
 return atlas.get(key);
}
export function drawTerrainTile(ctx,x,y,biome,gridX,gridY,shore=0){
 const type=TERRAIN_PALETTE[biome]?biome:'meadow';
 const texture=cachedSprite(type,terrainVariant(gridX,gridY));
 if(texture)ctx.drawImage(texture,Math.round(x-24),Math.round(y-15));
 else{
  // Rendering fallback if the browser cannot make offscreen tiles.
  ctx.fillStyle=TERRAIN_PALETTE[type].base;
  ctx.beginPath();ctx.moveTo(x,y-12);ctx.lineTo(x+24,y);ctx.lineTo(x,y+12);ctx.lineTo(x-24,y);ctx.closePath();ctx.fill();
 }
 // A damp soil strip marks the interface between river and land. Geometry stays unchanged.
 if(shore===-1||shore===1){
  ctx.save();
  ctx.strokeStyle='#385c4a8f';ctx.lineWidth=2;
  ctx.beginPath();
  if(shore===-1){ctx.moveTo(x+23,y+.4);ctx.lineTo(x,y+11.3);}
  else{ctx.moveTo(x-23,y-.4);ctx.lineTo(x,y-11.2);}
  ctx.stroke();
  ctx.strokeStyle='#d1c49b83';ctx.lineWidth=.9;ctx.stroke();
  ctx.restore();
 }
}
export function drawContactShadow(ctx,x,y,kind='resource'){
 const size={wood:[21,7],stone:[13,4],animal:[17,5],npc:[11,4],
  house:[36,12],workshop:[22,7],fire:[17,5],cave:[26,8],player:[12,4],bridgeart:[31,7]}[kind]||[12,4];
 ctx.save();
 ctx.fillStyle='#09222562';
 ctx.beginPath();ctx.ellipse(Math.round(x+2),Math.round(y+3),size[0],size[1],0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#162b2f20';
 ctx.beginPath();ctx.ellipse(Math.round(x+1),Math.round(y+1),size[0]*1.25,size[1]*1.65,0,0,Math.PI*2);ctx.fill();
 ctx.restore();
}