import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {getIronQuestGuide,ironQuestTotals,IRON_QUEST_STAGES} from '../js/mission-guide.js';
import {STATION_PROCESSES,FUEL_HEAT,runStationProcess,heatOf} from '../js/material-economy.js';
import {TOOL_RULES,toolCharge} from '../js/adventure-rules.js';
import {RECIPES} from '../js/data.js';
const file=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const state=(stock={})=>({
 stock:{...stock},adventure:{gathered:{},fires:{}},
 discovered:{},crafted:{},toolDurability:{},xp:0
});
const next=s=>getIronQuestGuide(s).next;
assert.equal(IRON_QUEST_STAGES.length,6);
assert.deepEqual(IRON_QUEST_STAGES.map(x=>x.id),['pick','iron','prepare','smelt','hammer','forge']);
for(const id of ['prep_iron','smelt_iron','forge_iron_hammer','forge_iron_pickaxe','make_stone_pickaxe']){
 assert.ok(STATION_PROCESSES[id],id+' must come from a real workstation');
}
const newPlayer=state({wood:2,stone:8,plant_fiber:4});
assert.equal(next(newPlayer).id,'craft_cut_stone','new player is shown a concrete recipe instead of an impossible mine');
assert.deepEqual(next(newPlayer).action.ingredients,['stone','stone']);
const hasCutStone=state({wood:1,stone:4,cut_stone:1,plant_fiber:2});
assert.equal(next(hasCutStone).id,'craft_handle');
const hasHandle=state({handle:1,cut_stone:1,plant_fiber:2});
assert.equal(next(hasHandle).id,'craft_rope');
const toolReady=state({stone_pickaxe:1});
assert.equal(next(toolReady).id,'gather_iron');
assert.equal(next(toolReady).action.resource,'iron');
assert.equal(ironQuestTotals(toolReady).oreNeeded,4,'without an iron hammer, two full ingots require four ores');
assert.equal(next(state({stone_pickaxe:1,iron:2})).id,'prep_iron');
const prepared=state({stone_pickaxe:1,iron_concentrate:1});
assert.equal(next(prepared).id,'gather_wood','without fuel, the guide must first direct the player to collect burnable wood');
assert.equal(next(state({stone_pickaxe:1,iron_concentrate:1,coal:1})).id,'fuel');
assert.equal(next(state({stone_pickaxe:1,iron_concentrate:1,coal:1})).action.process,'fuel_coal');
const heated=state({stone_pickaxe:1,iron_concentrate:1});
heated.adventure.fires.village_foundry=8;
assert.equal(next(heated).id,'smelt_iron');
assert.equal(next(heated).action.station,'foundry');
assert.equal(next(heated).action.group,'smelt');
assert.equal(next(heated).heat,8);
const oneIngot=state({stone_pickaxe:1,iron_ingot:1,handle:1,stone_hammer:1});
assert.equal(next(oneIngot).id,'fuel','forging a hammer also requires heat');
oneIngot.adventure.fires.village_foundry=4;
assert.equal(next(oneIngot).id,'forge_iron_hammer');
assert.equal(next(oneIngot).action.group,'forge');
assert.equal(next(oneIngot).tool,'Martillo de piedra');
const hammerNeeded=state({stone_pickaxe:1,iron_ingot:1,handle:1,stone:2});
assert.equal(next(hammerNeeded).id,'craft_stone_hammer');
assert.deepEqual(next(hammerNeeded).action.ingredients,['handle','stone']);
const ironHammer=state({stone_pickaxe:1,iron_hammer:1,iron_ingot:1,handle:1});
assert.equal(ironQuestTotals(ironHammer).oreNeeded,0);
assert.equal(next(ironHammer).id,'fuel');
ironHammer.adventure.fires.village_foundry=4;
assert.equal(next(ironHammer).id,'forge_iron_pickaxe');
assert.deepEqual(STATION_PROCESSES.forge_iron_pickaxe.inputs,{iron_ingot:1,handle:1});
const fromScreenshot=state({stone_pickaxe:1,wood:10,rough_wood:2,water:10,stone:294,plant_fiber:21});
assert.equal(next(fromScreenshot).id,'gather_iron','current iPhone inventory should lead to mining');
const forged=state({iron_pickaxe:1});
assert.equal(getIronQuestGuide(forged).completed,true);
assert.equal(next(forged).id,'finished');
assert.equal(getIronQuestGuide(forged).completedCount,6);
// First ingot + remaining concentrate should never be counted as two missing ingots.
const partial=state({stone_pickaxe:1,iron_hammer:1,iron_concentrate:1});
assert.equal(ironQuestTotals(partial).oreNeeded,0);
assert.equal(next(partial).id,'fuel');
const progress=state({stone_pickaxe:1,iron_ingot:1,crafted:{iron_concentrate:1}});
progress.crafted.iron_concentrate=1;
assert.ok(getIronQuestGuide(progress).stages[2].done,'completed preparation remains recognized after consuming the prepared ore');
// All shown manual recipes must be actual recipes (not invented shortcuts).
for(const target of ['cut_stone','handle','rope','stone_hammer']){
 const r=RECIPES.find(r=>r.result===target);
 assert.ok(r?.a&&r?.b,'missing concrete manual ingredients for '+target);
}
assert.equal(TOOL_RULES.stone_pickaxe.uses,10);
assert.equal(TOOL_RULES.iron_pickaxe.uses,100);
const initial=structuredClone(fromScreenshot.stock);
getIronQuestGuide(fromScreenshot);
assert.deepEqual(fromScreenshot.stock,initial,'guide inspection must not consume or forge resources');
// Exercise the full physical production pipeline with real station processes.
const real=state({stone_pickaxe:1,iron:4,handle:2,stone_hammer:1,coal:3});
assert.equal(runStationProcess(real,'stonework','prep_iron').ok,true);
assert.equal(runStationProcess(real,'stonework','prep_iron').ok,true);
assert.equal(runStationProcess(real,'foundry','fuel_coal','village_foundry').ok,true);
assert.equal(runStationProcess(real,'foundry','smelt_iron','village_foundry').ok,true);
assert.equal(runStationProcess(real,'foundry','forge_iron_hammer','village_foundry').ok,true);
assert.equal(runStationProcess(real,'foundry','fuel_coal','village_foundry').ok,true);
assert.equal(runStationProcess(real,'foundry','smelt_iron','village_foundry').ok,true);
assert.equal(runStationProcess(real,'foundry','forge_iron_pickaxe','village_foundry').ok,true);
assert.equal(toolCharge(real,'iron_pickaxe'),100);
assert.equal(getIronQuestGuide(real).completed,true);
const [app,world,html,css,sw,workflow]=await Promise.all([
 file('js/app.js'),file('js/adventure-world.js'),file('index.html'),
 file('css/mission-guide.css'),file('sw.js'),file('.github/workflows/validate-crafterra.yml')
]);
for(const term of ['getIronQuestGuide(S)','function renderIronGuidePanel()','function performGuideNext()','function openRecipeBook()',
                   "data-quest-guide","data-guide-next","data-recipe-prepare","$('#recipesBtn').onclick=openRecipeBook"]){
 assert.ok(app.includes(term),'guide interaction not wired: '+term);
}
for(const term of ['function guideTo(action)','function showStationMenu(kind,fireId,title,group=null,node=null,focus=null)',
  'guideProcess:action.process','guided:o.id===focus','function moveTo(x,y,pick=null)']){
 assert.ok(world.includes(term),'world guide does not use real interactive stations: '+term);
}
assert.ok(html.includes('id="ironGuidePanel"')&&html.includes('id="recipesBtn"'),'guide and recipe controls must exist');
assert.ok(css.includes('.quest-guide-steps')&&css.includes('.quest-guide-go'),'mission guide styles loaded');
assert.ok(sw.includes('mission-guide.js?v=0.12.0')&&sw.includes('mission-guide.css?v=0.12.0'),'new offline assets must be precached');
assert.ok(workflow.includes('tests/mission-guide.mjs'),'guide testing must be mandatory');
console.log('CRAFTERRA 0.12: guided real recipes, live inventory, foundry heat, 4-ore progression, recetario and navigation OK');
