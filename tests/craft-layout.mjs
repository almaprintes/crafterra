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
assert.ok(app.includes("const inventory=$('#view-craft .inventory')"),'return area resolves to the whole materials inventory');
assert.ok(app.includes("el.setPointerCapture(ev.pointerId)"),'finger movement captured outside board');
assert.ok(app.includes("el.addEventListener('pointercancel',cancel)"),'interrupted gestures are safe');
assert.ok(app.includes("Math.hypot(dx,dy)<8"),'tap is distinct from real drag');
assert.ok(app.includes("ghost=el.cloneNode(true)"),'dragging shows an independent visual preview');
assert.ok(app.includes("document.body.append(ghost)"),'drag preview escapes clipped board');
assert.ok(app.includes("const returned=didDrag&&inInventory(e.clientX,e.clientY)"),'inventory drop target detected on release');
assert.ok(app.includes("board.splice(idx,1)"),'return removes selected item from board');
assert.ok(app.includes("}else if(didDrag&&target"),'piece-on-piece merging remains intact');
assert.ok(!/board\.splice\(idx,1\)[\s\S]{0,90}S\.stock/.test(app),'return must not change inventory stock');
assert.ok(css.includes('.craft-drag-ghost'),'floating item preview has styles');
assert.ok(css.includes('.inventory.craft-drop-target'),'inventory highlights while dragging over it');
assert.ok(css.includes('pointer-events:none!important'),'ghost cannot intercept drop hit-testing');

console.log('CRAFTERRA 0.8.2: one-scroll workshop, drag-to-return without stock loss, pointer cancellation and fusion gestures OK');
