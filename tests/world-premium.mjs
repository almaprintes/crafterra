import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {MATERIAL_ATLAS_URI,MATERIAL_ORDER,MATERIAL_CELL_SIZE} from '../js/material-art-data.js';
import {
 drawPremiumTree,drawPremiumRock,drawPremiumHouse,drawPremiumCave,drawPremiumForge,
 drawPremiumBridge,premiumSpriteCacheSize
} from '../js/world-art-premium.js';
const read=async p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const [html,css,world,app,terrain,sw]=await Promise.all([
 read('index.html'),read('css/world-premium.css'),read('js/adventure-world.js'),
 read('js/app.js'),read('js/terrain-textures.js'),read('sw.js')
]);
assert.equal(MATERIAL_CELL_SIZE,32);
assert.deepEqual(MATERIAL_ORDER,['meadow','forest','rocky','river','cave','cottage']);
assert.match(MATERIAL_ATLAS_URI,/^data:image\/png;base64,iVBOR/);
assert.ok(MATERIAL_ATLAS_URI.length<14000,'raster textures must remain lightweight');
assert.equal(premiumSpriteCacheSize(),0,'world art is lazy and not instantiated on import');
for(const draw of [drawPremiumTree,drawPremiumRock,drawPremiumHouse,
 drawPremiumCave,drawPremiumForge,drawPremiumBridge])assert.equal(typeof draw,'function');
for(const name of ['drawPremiumTree','drawPremiumRock','drawPremiumHouse','drawPremiumCave','drawPremiumForge','drawPremiumBridge']){
 assert.ok(world.includes(name),'missing real world sprite integration '+name);
}
assert.ok(world.includes("drawTerrainTile(ctx,p.x,p.y,area,x,y"),'world still uses interactive tile engine');
assert.ok(terrain.includes('referenceImage.src=MATERIAL_ATLAS_URI'),'generated material art decoded locally');
assert.ok(terrain.includes('g.drawImage(referenceImage'),'actual raster texture embedded into diamond tiles');
assert.ok(!terrain.includes('fetch('),'textures cannot depend on a CDN');
assert.ok(html.includes('css/world-premium.css?v=0.11.0'),'fullscreen layout must load');
assert.ok(html.includes('id="expeditionPanel"')&&html.includes('hidden></section>'),'expeditions hidden until summoned');
assert.ok(/#view-world\.view\.active\s*\{[^}]*overflow:hidden!important/.test(css),'world screen cannot scroll');
assert.ok(/#view-world #world\.adventure-world\s*\{[^}]*flex:1 1 auto/.test(css),'canvas must fill available height');
assert.ok(/#view-world #expeditionPanel\s*\{[^}]*position:absolute/.test(css),'expeditions are an overlay not below map');
assert.ok(/#view-world #expeditionPanel\s*\{[^}]*overflow:hidden!important/.test(css),'no nested expedition scrolling');
assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'all four expedition groups visible together');
assert.ok(world.includes('id="adv-expeditions"')&&world.includes("onExpeditions()"),'expedition button wired to game UI');
for(const id of ['quarry','shallow','deep','crystal','forest','hunt','river']){
 assert.ok(app.includes("id:'"+id+"'"),'missing expedition '+id);
}
for(const id of ['mining','forest','hunt','river'])assert.ok(app.includes("id:'"+id+"',label:"),'missing category '+id);
assert.ok(app.includes("onExpeditions:()=>toggleExpeditions()"),'gameplay expedition callback missing');
assert.ok(app.includes('function toggleExpeditions('),'single expedition sheet lifecycle');
assert.ok(app.includes('function renderExpeditionPanel()'),'live expedition panel renderer');
assert.ok(app.includes('function selectExpTier('),'all mining tiers available in the same panel');
assert.ok(app.includes('function selectExpDuration('),'duration selection on the same screen');
assert.ok(app.includes('const active=S.expeditions?.active'),'legacy active expeditions preserved');
assert.ok(app.includes("data-exp-collect="),'claim rewards on the same screen');
assert.ok(app.includes("data-exp-double="),'optional reward handling preserved');
assert.ok(app.includes('S.expeditions.history.unshift('),'historic runs must remain saved');
assert.ok(!/function showExpeditions\(\)\s*\{\s*modal\(/.test(app),'no stack of expedition popups');
assert.ok(!/box\.innerHTML=\`<div class="exp-head">/.test(app),'old scrolling expedition block removed');
console.log('CRAFTERRA 0.11: approved material art, premium active sprites, full-screen world and all expedition actions in one non-scrolling sheet OK');
