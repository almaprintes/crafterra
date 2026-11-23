import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TILE_WIDTH,TILE_HEIGHT,TERRAIN_PALETTE,terrainVariant,terrainTextureSpec,terrainTextureCount,drawTerrainTile,drawContactShadow} from '../js/terrain-textures.js';
import {biomeAt} from '../js/world-biomes.js';

assert.equal(TILE_WIDTH,48);
assert.equal(TILE_HEIGHT,24);
assert.deepEqual(Object.keys(TERRAIN_PALETTE).sort(),['cave','cottage','forest','meadow','river','rocky','workshop'].sort());
for(const biome of Object.keys(TERRAIN_PALETTE)){
 const spec=terrainTextureSpec(biome,6,8);
 assert.equal(spec.biome,biome);
 assert.equal(spec.variant,terrainVariant(6,8));
 assert.ok(spec.dots>=20,'textures must contain meaningful surface detail: '+biome);
 assert.match(spec.color,/^#[0-9a-f]{6}$/i,'palette color');
}
assert.equal(terrainVariant(7,11),terrainVariant(7,11),'tile texture must not flicker');
const variants=new Set();
for(let y=0;y<22;y++)for(let x=0;x<30;x++)variants.add(terrainVariant(x,y));
assert.ok(variants.size>=27,'many variants required to avoid visible repeating patterns');
assert.equal(terrainTextureCount(),0,'atlas creation is lazy, not triggered during module import');
assert.equal(biomeAt(9,10),'meadow');
assert.equal(biomeAt(19,16),'forest');
assert.equal(biomeAt(10,4),'rocky');
assert.equal(biomeAt(15,10),'river');
const calls=[];
const ctx={
 fillStyle:'',strokeStyle:'',lineWidth:1,
 save:()=>calls.push('save'),restore:()=>calls.push('restore'),
 beginPath:()=>calls.push('path'),moveTo:()=>{},lineTo:()=>{},closePath:()=>{},
 fill:()=>calls.push('fill'),stroke:()=>calls.push('stroke'),ellipse:()=>calls.push('ellipse'),
 drawImage:()=>calls.push('image')
};
drawTerrainTile(ctx,50,80,'meadow',9,10);
drawTerrainTile(ctx,50,80,'forest',18,16);
drawTerrainTile(ctx,50,80,'rocky',10,4,-1);
drawTerrainTile(ctx,50,80,'river',15,10);
drawTerrainTile(ctx,50,80,'cave',3,4);
drawTerrainTile(ctx,50,80,'cottage',3,4);
drawTerrainTile(ctx,50,80,'workshop',3,4);
assert.ok(calls.includes('fill'),'without document Canvas falls back to solid diamond safely');
assert.ok(calls.includes('stroke'),'riverbank edge effect supported');
calls.length=0;
drawContactShadow(ctx,40,50,'wood');
drawContactShadow(ctx,40,50,'house');
drawContactShadow(ctx,40,50,'stone');
assert.equal(calls.filter(x=>x==='ellipse').length,6,'each contact shadow uses soft footprint and outer penumbra');
const art=await readFile(new URL('../js/terrain-textures.js',import.meta.url),'utf8');
const world=await readFile(new URL('../js/adventure-world.js',import.meta.url),'utf8');
for(const needle of ['makeAtlasSprite','atlas=new Map','g.clip()','createLinearGradient','type===\'meadow\'','type===\'forest\'',
                      'type===\'rocky\'','type===\'river\'','type===\'cave\'','type===\'cottage\'','drawContactShadow']){
 assert.ok(art.includes(needle),'missing generated texture element '+needle);
}
assert.ok(!art.includes('Math.random'),'terrain cannot flicker when the camera moves');
assert.ok(!art.includes('fetch('),'offline procedural material texturing cannot request external assets');
assert.ok(world.includes("drawTerrainTile(ctx,p.x,p.y,area,x,y"),'the exterior uses the textured atlas');
assert.ok(world.includes("drawTerrainTile(g,px,py,cave?'cave':home?'cottage':'workshop'"),'caves use textured rock in their cached floor');
assert.ok(world.includes("home?'cottage':'workshop'"),'houses use real plank/stone materials');
assert.ok(world.includes('drawContactShadow(ctx,p.x,p.y,contact)'), 'objects ground to terrain');
assert.ok(world.includes('ctx.setTransform(currentDpr,0,0,currentDpr,0,0)'), 'bounded retina scaling preserves gameplay coordinates');
console.log('CRAFTERRA 0.10: cached procedural textured terrain, bevels, varied cave/interior floors, shadows, retina and offline safety OK');
