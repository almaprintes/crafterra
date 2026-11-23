import assert from 'node:assert/strict';
import {actionArt,actionKind} from '../js/adventure-art.js';
import {readFile} from 'node:fs/promises';
const src=await readFile(new URL('../js/adventure-world.js',import.meta.url),'utf8');
const css=await readFile(new URL('../css/adventure-world.css',import.meta.url),'utf8');
for(const kind of ['axe','pick','hammer','log','stone','fire','bowl','ingot','gem','saw','door','bed','basket','shield']){
 const art=actionArt(kind,'md');
 assert.ok(art.startsWith('<svg'),'missing illustration '+kind);
 assert.ok(art.includes('<path')||art.includes('<rect'),'empty illustration '+kind);
 assert.ok(!/https?:\/\/|<image|<script/.test(art),'visuals must be built-in and offline');
 assert.ok(art.includes('viewBox="0 0 72 72"'),'scalable art');
 assert.ok(/linearGradient/.test(art),'not a flat emoji');
}
assert.notEqual(actionArt('axe'),actionArt('axe'),'gradient IDs must be unique across cards');
assert.equal(actionKind('chop'),'axe');
assert.equal(actionKind('hit'),'log');
assert.equal(actionKind('mine'),'pick');
assert.equal(actionKind('fill'),'bowl');
assert.equal(actionKind('forge_iron_hammer'),'hammer');
assert.equal(actionKind('refine_saw'),'saw');
for(const needle of ['adv-dialog-heading','adv-dialog-grid','adv-choice','adv-dismiss','adv-work','adv-strike','adv-work-art','paintEffects','tickEffects','pointerdown']){
 assert.ok(src.includes(needle),'missing premium action integration '+needle);
}
for(const needle of ['.adv-choice-graphic','.adventure-dialog button.adv-choice','.adv-strike','.adv-art-md','#world.adventure-world']){
 assert.ok(css.includes(needle),'missing illustrated button style '+needle);
}
assert.ok(src.includes('harvest.elapsed+Math.min(240'),'active tapping should accelerate work');
assert.ok(src.includes('completeWorldAction'),'resource completion remains connected to inventory');
assert.ok(src.includes('runStationProcess'),'station completion remains connected to production');
assert.ok(src.includes('if(!near(h.node)'),'walking away cancels work');
console.log('CRAFTERRA premium: illustrated offline actions, visual feedback, movement and resource invariants OK');
