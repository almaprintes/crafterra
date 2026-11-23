import assert from 'node:assert/strict';
import {
 BIOMES,biomeAt,biomeLabel,isBiomeResource,ORE_TYPES,WORLD_ANIMALS,ANIMAL_SPECIES,
 CAVE_ENTRANCES,CAVE_NODES
} from '../js/world-biomes.js';
import {WORLD_NODES,WORLD_TREES,WORLD_SIZE,isWalkable,findPath} from '../js/adventure-world.js';
import {ROOM_OBJECTS,HOUSE_ROOMS,availableActions,completeWorldAction,nodeAvailable} from '../js/world-actions.js';
import {toolCharge} from '../js/adventure-rules.js';
import {STATION_PROCESSES,stationOptions,runStationProcess} from '../js/material-economy.js';
import {ITEMS,RECIPES} from '../js/data.js';

const state=(stock={})=>({stock:{...stock},adventure:{gathered:{},fires:{}},
 discovered:{},toolDurability:{},xp:0});
assert.equal(biomeAt(9,10),'meadow','the original spawn is still grassland');
assert.equal(biomeAt(10,4),'rocky','iron on accessible western rocks');
assert.equal(biomeAt(9,18),'rocky','copper in the western uplands');
assert.equal(biomeAt(19,16),'forest','deer habitat');
assert.equal(biomeAt(25,4),'rocky','eastern cave is in rocks');
assert.equal(biomeAt(15,8),'river','river is preserved');
assert.equal(biomeLabel(10,4),'Sierra rocosa');
for(const area of ['meadow','forest','rocky','cave'])assert.ok(BIOMES[area]?.ground,'distinct biome '+area);
for(const node of WORLD_NODES){
 assert.ok(isBiomeResource(node),'surface resource outside its habitat: '+node.id+' '+node.type+' ('+node.x+','+node.y+')');
 if(ORE_TYPES.includes(node.type)||node.type==='stone')assert.equal(biomeAt(node.x,node.y),'rocky','no ore on meadow');
 else assert.ok(['meadow','forest'].includes(biomeAt(node.x,node.y)),'organics belong in forest or grass');
}
for(const tree of WORLD_TREES){
 assert.ok(isBiomeResource(tree),'generated tree must not grow inside bare mountain: '+tree.id);
 assert.notEqual(biomeAt(tree.x,tree.y),'rocky');
}
for(const animal of WORLD_ANIMALS){
 assert.ok(isBiomeResource(animal),'animal in wrong habitat '+animal.id);
 assert.equal(biomeAt(animal.x,animal.y),ANIMAL_SPECIES[animal.species].biome);
 assert.equal(isWalkable(animal.x,animal.y),false,'animals occupy real space '+animal.id);
}
assert.equal(WORLD_ANIMALS.filter(a=>a.species==='sheep').length,2);
assert.equal(WORLD_ANIMALS.filter(a=>a.species==='rabbit').length,2);
assert.equal(WORLD_ANIMALS.filter(a=>a.species==='deer').length,2);
const ids=[...WORLD_NODES,...WORLD_TREES,...WORLD_ANIMALS,...CAVE_ENTRANCES,
 ...Object.values(CAVE_NODES).flat()].map(x=>x.id);
assert.equal(new Set(ids).size,ids.length,'all map and cave entities must have unique IDs');
for(const entry of CAVE_ENTRANCES){
 assert.equal(biomeAt(entry.x,entry.y),'rocky','entrance must be surrounded by stone');
 assert.equal(isWalkable(entry.x,entry.y,true),false,'portal occupies solid tile');
 assert.ok(HOUSE_ROOMS[entry.scene],'scene must have persistent room identity');
 assert.ok(ROOM_OBJECTS[entry.scene].some(o=>o.kind==='exit'),'cave can be exited without a reload');
 assert.ok(CAVE_NODES[entry.scene].length>=4,'caves offer actual mineral deposits');
 for(const node of CAVE_NODES[entry.scene]){
   assert.equal(node.biome,'cave');
   assert.ok(isBiomeResource(node),'cave node in wrong biome');
   assert.ok(['stone',...ORE_TYPES].includes(node.type),'only rock/ore in cave');
   assert.ok(node.x>=1&&node.x<=9&&node.y>=1&&node.y<=7,'inside walkable room geometry');
 }
}
const WEST=CAVE_ENTRANCES[0],EAST=CAVE_ENTRANCES[1];
const steps=[[0,-1],[1,0],[0,1],[-1,0]];
const canReach=(origin,entry,bridge)=>steps.some(([dx,dy])=>{
 const to={x:entry.x+dx,y:entry.y+dy};
 return isWalkable(to.x,to.y,bridge)&&
   (findPath(origin,to,bridge).length>0||(origin.x===to.x&&origin.y===to.y));
});
assert.ok(canReach({x:9,y:10},WEST,false),'west cave must be reachable before repairing bridge');
assert.ok(canReach({x:22,y:10},EAST,true),'east cave can be reached after bridge');

const sheep=WORLD_ANIMALS.find(a=>a.species==='sheep');
const animalState=state();
let options=availableActions(animalState,sheep);
assert.equal(options.find(o=>o.id==='loose_wool').enabled,true);
assert.equal(options.find(o=>o.id==='shear').enabled,false);
assert.equal(completeWorldAction(animalState,sheep,'loose_wool',1000000).ok,true);
assert.equal(animalState.stock.wool,1,'wool does not require killing sheep');
assert.equal(animalState.stock.raw_meat||0,0);
assert.equal(animalState.stock.animal_hide||0,0);
assert.equal(nodeAvailable(animalState,sheep,1000001),true,'sheep must remain in the meadow after shearing');
assert.equal(availableActions(animalState,sheep,1000001).find(o=>o.id==='loose_wool').enabled,false,'fleece must regrow before harvesting');
assert.equal(completeWorldAction(animalState,sheep,'loose_wool',1000001).ok,false,'cannot duplicate wool during regrowth');
assert.equal(nodeAvailable(animalState,sheep,1000000+300001),true);
assert.equal(availableActions(animalState,sheep,1000000+300001).find(o=>o.id==='loose_wool').enabled,true,'wool is renewable once fleece regrows');
const shearingState=state({shears:1});
assert.equal(completeWorldAction(shearingState,sheep,'shear',1000000).ok,true);
assert.equal(shearingState.stock.wool,3);
assert.equal(shearingState.stock.shears,1,'shears are reused');
assert.equal(toolCharge(shearingState,'shears'),99);
const rabbit=WORLD_ANIMALS.find(a=>a.species==='rabbit');
const catchState=state();
assert.equal(completeWorldAction(catchState,rabbit,'hunt',1000000).ok,false,'hunting requires equipment');
assert.equal(completeWorldAction(catchState,rabbit,'catch',1000000).ok,true,'rabbits can be caught without weapons');
assert.equal(catchState.stock.raw_meat,1);
assert.equal(catchState.stock.animal_hide,1);
const deer=WORLD_ANIMALS.find(a=>a.species==='deer');
assert.equal(completeWorldAction(state(),deer,'hunt',1000000).ok,false,'large game requires a weapon');
const huntState=state({stone_spear:1});
assert.equal(completeWorldAction(huntState,deer,'hunt',1000000).ok,true,'spear can hunt deer');
assert.equal(huntState.stock.raw_meat,3);
assert.equal(huntState.stock.animal_hide,2);
assert.equal(huntState.stock.bone,1);
assert.equal(toolCharge(huntState,'stone_spear'),9,'spear loses one use');
const bowState=state({bow:1,arrow:1});
assert.equal(completeWorldAction(bowState,deer,'hunt',1000000).ok,true,'bow with one arrow can hunt');
assert.equal(bowState.stock.arrow,0,'arrows are consumed by shooting');
assert.equal(bowState.stock.bow,1,'bow remains available');
assert.equal(toolCharge(bowState,'bow'),99);
const noArrowState=state({bow:1});
assert.equal(availableActions(noArrowState,deer).find(o=>o.id==='hunt').enabled,false);
const impossible=state({stone_pickaxe:1});
const fakeOre={id:'invalid_iron_meadow',x:9,y:10,type:'iron',qty:2};
assert.deepEqual(availableActions(impossible,fakeOre),[],'meadow mining is forbidden in rules');
assert.equal(completeWorldAction(impossible,fakeOre,'mine').ok,false);
const caveOre=CAVE_NODES.cave_west.find(x=>x.type==='iron');
assert.equal(completeWorldAction(impossible,caveOre,'mine',1000000).ok,true,'iron is accessible in the western cave');

const tanning=state({animal_hide:1,water:1,rough_wood:1});
assert.equal(stationOptions(tanning,'tannery').find(o=>o.id==='tan_hide').enabled,true);
assert.equal(runStationProcess(tanning,'tannery','tan_hide').ok,true);
assert.equal(tanning.stock.leather,1);
assert.equal(tanning.stock.animal_hide,0);
assert.equal(tanning.stock.water,0);
assert.equal(tanning.stock.rough_wood,0);
assert.equal(STATION_PROCESSES.tan_hide.ms,3500);
assert.ok(ROOM_OBJECTS.house_lia.some(n=>n.id==='tannery'),'tannery must be reachable indoors');
const forged=state({iron_ingot:1,iron_hammer:1,wood:1,coal:1});
assert.equal(runStationProcess(forged,'foundry','fuel_coal','village_foundry').ok,true);
assert.equal(runStationProcess(forged,'foundry','forge_shears','village_foundry').ok,true);
assert.equal(forged.stock.shears,1);
assert.equal(toolCharge(forged,'shears'),100);
assert.equal(toolCharge(forged,'iron_hammer'),99);
assert.ok(ITEMS.some(i=>i.id==='animal_hide')&&ITEMS.some(i=>i.id==='shears'));
assert.ok(RECIPES.some(r=>r.result==='shears')&&RECIPES.some(r=>r.a==='animal_hide'&&r.result==='leather'));
const preserve=structuredClone({adventure:{scene:'cave_west',roomPositions:{cave_west:{x:5,y:6}},gathered:catchState.adventure.gathered},stock:catchState.stock});
assert.equal(preserve.adventure.scene,'cave_west');
assert.equal(preserve.stock.animal_hide,1);
console.log('CRAFTERRA 0.9: organic prairies, forest animals, rocky ore veins, two playable caves, wool, hides and tanning OK');
