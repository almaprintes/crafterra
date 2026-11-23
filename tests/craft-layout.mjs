import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const css=await readFile(new URL('../css/craft-layout.css',import.meta.url),'utf8');
const app=await readFile(new URL('../js/app.js',import.meta.url),'utf8');
const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');

for(const id of ['craftBoard','combineBoard','inventoryFilter','inventoryGrid','inventoryCount','inventoryEmpty','itemSearch']){
 assert.ok(html.includes('id="'+id+'"'),'missing functional element '+id);
}
assert.ok(html.includes('class="craft-slots"'),'exactly two crafting positions should be visible');
assert.ok(html.includes('css/craft-layout.css?v=0.8.1'),'mobile redesign must be loaded');
assert.ok(sw.includes('./css/craft-layout.css?v=0.8.1'),'workshop redesign must be available offline');
assert.ok(html.includes('js/app.js?v=0.8.1-craft'),'cache bust changed app startup');
assert.ok(sw.includes('./js/app.js?v=0.8.1-craft'),'precache changed startup');
assert.ok(/#view-craft\.view\.active\s*\{[^}]*overflow-y:auto/.test(css),'single document-level craft scroll');
assert.ok(/#view-craft #inventoryGrid\s*\{[^}]*max-height:none;[^}]*overflow:visible/.test(css),'inventory may never have its own vertical scroll');
assert.ok(/#view-craft #stationBar\s*\{[^}]*flex-wrap:wrap;[^}]*overflow:visible/.test(css),'station bar cannot scroll sideways');
assert.ok(/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/.test(css),'mobile inventory cards need minmax(0) grid');
assert.ok(css.includes('position:sticky'),'craft board remains usable while inventory scrolls');
assert.ok(app.includes("if(board.length>=2)"),'limit board to two ingredients');
assert.ok(app.includes("if(board.length===2)doMerge(0,1)"),'tap-to-combine action wired');
assert.ok(app.includes('const filter=$(\'#inventoryFilter\')?.value||\'owned\''),'owned inventory default');
assert.ok(app.includes("$('#inventoryFilter').onchange=renderInventoryItems"),'inventory filter responds to change');
assert.ok(app.includes("$('#itemSearch').oninput=renderInventoryItems"),'search filters displayed inventory directly');
assert.ok(app.includes("visible.sort("),'owned and alphabetical inventory ordering');
assert.ok(app.includes("b.dataset.pieces=String(Math.min(board.length,2))"),'board never renders extra pieces offscreen');
console.log('CRAFTERRA 0.8.1: one-scroll workshop, fixed 2-slot crafting, accessible inventory filters and PWA cache OK');
