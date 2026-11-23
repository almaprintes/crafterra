// CRAFTERRA · Interacciones de mundo: reglas puras, sin DOM.
import {pickTool,wearTool,toolCharge,TOOL_RULES} from './adventure-rules.js?v=0.9.0';
import {runStationProcess} from './material-economy.js?v=0.9.0';
import {ANIMAL_SPECIES,CAVE_NODES,ORE_TYPES,isBiomeResource} from './world-biomes.js?v=0.9.0';
export const RESOURCE_RESPAWN=5*60*1000;
export const TREE_SPECIES=Object.freeze({
  pine:{label:'Pino',wood:2,rough:2,bonus:null,factor:1},
  oak:{label:'Roble',wood:3,rough:1,bonus:'resin',factor:1.4}
});
export const HOUSE_ROOMS=Object.freeze({
  house_mara:{name:'Casa de Mara',label:'Casa familiar'},
  house_lia:{name:'Taller de la inventora',label:'Taller de Lía'},
  cave_west:{name:'Cueva de la sierra',label:'Galería de la montaña'},
  cave_east:{name:'Gruta de los cristales',label:'Galería mineral'}
});
export const ROOM_OBJECTS=Object.freeze({
 house_mara:[
  {id:'exit',x:5,y:7,label:'Puerta',kind:'exit'},
  {id:'bed',x:3,y:3,label:'Cama',kind:'station'},
  {id:'pantry',x:7,y:3,label:'Despensa',kind:'station'},
  {id:'hearth',x:5,y:2,label:'Hogar',kind:'station'}
 ],
 house_lia:[
  {id:'exit',x:5,y:7,label:'Puerta',kind:'exit'},
  {id:'workbench',x:3,y:3,label:'Mesa de trabajo',kind:'station'},
  {id:'sawmill',x:7,y:3,label:'Banco de madera',kind:'station'},
  {id:'repair',x:5,y:2,label:'Banco de reparación',kind:'station'},
  {id:'tannery',x:8,y:5,label:'Curtiduría',kind:'station'}
 ],
 cave_west:[{id:'exit',x:5,y:7,label:'Salir de la cueva',kind:'exit'}],
 cave_east:[{id:'exit',x:5,y:7,label:'Salir de la gruta',kind:'exit'}]
});
export function hasBowl(s){return (s.stock?.wood_bowl||0)>0||(s.stock?.clay_bowl||0)>0;}
export function isOre(node){return ORE_TYPES.includes(node.type);}
export function nodeAvailable(s,node,now=Date.now()){
 if(node.type==='water')return true;
 const last=s.adventure?.gathered?.[node.id];
 return !last||now-last>=RESOURCE_RESPAWN;
}
export function availableActions(s,node){
 if(!node)return [];
 if(node.type==='animal'){
   const species=ANIMAL_SPECIES[node.species];
   if(!species)return [];
   if(species.method==='shear'){
     const shears=pickTool(s,'shear'),knife=(s.stock?.flint_knife||0)>0&&toolCharge(s,'flint_knife')?'flint_knife':null;
     return [
       {id:'shear',label:'Esquilar oveja',tool:shears,enabled:!!shears,need:'Necesitas tijeras de esquilar',ms:1250,output:{wool:3}},
       {id:'trim',label:'Cortar lana con cuchillo',tool:knife,enabled:!!knife,need:'Necesitas cuchillo de pedernal',ms:3100,output:{wool:2}},
       {id:'loose_wool',label:'Recoger lana suelta',tool:null,enabled:true,ms:5200,output:{wool:1}}
     ];
   }
   const weapons=['iron_spear','stone_spear','bow'].filter(id=>(s.stock?.[id]||0)>0&&toolCharge(s,id)>0&&
     (id!=='bow'||(s.stock?.arrow||0)>0));
   const weapon=weapons[0]||null;
   const output={raw_meat:species.meat,animal_hide:species.hide,...(species.bone?{bone:species.bone}:{})};
   return [
    {id:'hunt',label:'Cazar '+species.name.toLowerCase(),tool:weapon,extraCost:weapon==='bow'?{arrow:1}:null,
      enabled:!!weapon,need:'Necesitas una lanza o arco con flechas',ms:weapon?TOOL_RULES[weapon].ms:3700,output},
    ...(node.species==='rabbit'?[{id:'catch',label:'Capturar conejo a mano',tool:null,enabled:true,ms:7400,output}]:[])
   ];
 }
 if(node.type==='berries'||node.type==='herbs'||node.type==='mushroom'){
   return [{id:'forage',label:node.type==='berries'?'Recoger bayas':node.type==='herbs'?'Recolectar hierbas':'Recoger setas',
     tool:null,enabled:true,ms:1800,output:{[node.type]:node.qty||1}}];
 }
 if(node.type==='wood'){
   const species=TREE_SPECIES[node.species]||TREE_SPECIES.pine;
   const tool=pickTool(s,'wood');
   return [
    {id:'chop',label:'Cortar con hacha',tool,enabled:!!tool,need:'Necesitas un hacha',ms:Math.round(TOOL_RULES[tool]?.ms*species.factor)||1500,
     output:{wood:species.wood,...(species.bonus?{[species.bonus]:1}:{})}},
    {id:'hit',label:'Golpear el tronco a mano',tool:null,enabled:true,ms:Math.round(5700*species.factor),
     output:{rough_wood:species.rough}}
   ];
 }
 if(node.type==='water'){
   return [{id:'fill',label:'Llenar cuenco',tool:null,enabled:hasBowl(s),need:'Fabrica un cuenco de madera o arcilla en el Taller',ms:1250,output:{water:1}}];
 }
 if(node.type==='stone'||isOre(node)){
   const tool=pickTool(s,'stone');
   const hard=node.type==='quartz'||node.type==='silver'||node.type==='gold';
   const advanced=tool==='iron_pickaxe';
   const enabled=node.type==='stone'||(!!tool&&(!hard||advanced));
   const need=node.type==='stone'?null:hard?'Necesitas pico de hierro':'Necesitas pico de piedra o hierro';
   return [{id:'mine',label:node.type==='stone'?'Picar piedra':'Extraer mineral',tool,enabled,need,
     ms:tool?Math.round(TOOL_RULES[tool].ms*(hard?1.9:1.35)):7500,output:{[node.type]:node.qty}}];
 }
 if(node.type==='plant_fiber'){
   const tool=pickTool(s,'plant_fiber');
   return [{id:'pick',label:'Recoger fibras',tool,enabled:true,ms:tool?TOOL_RULES[tool].ms:2100,output:{plant_fiber:node.qty}}];
 }
 return [];
}
export function completeWorldAction(s,node,actionId,now=Date.now()){
 if(!nodeAvailable(s,node,now))return {ok:false,reason:'Recurso agotado temporalmente'};
 const action=availableActions(s,node).find(a=>a.id===actionId);
 if(!action||!action.enabled)return {ok:false,reason:action?.need||'Acción no disponible'};
 if(action.extraCost&&Object.entries(action.extraCost).some(([id,q])=>(s.stock?.[id]||0)<q))
   return {ok:false,reason:'Ya no tienes las flechas necesarias'};
 const amount=action.output||{},wear=action.tool?wearTool(s,action.tool):null;
 if(action.tool&&!wear?.ok)return {ok:false,reason:'La herramienta ya no tiene usos'};
 for(const [id,qty] of Object.entries(action.extraCost||{}))s.stock[id]-=qty;
 s.stock=s.stock||{};s.discovered=s.discovered||{};
 for(const [id,qty] of Object.entries(amount)){
   s.stock[id]=(Number(s.stock[id])||0)+qty;
   if(!s.discovered[id]){s.discovered[id]=now;s.xp=(Number(s.xp)||0)+20;}
 }
 s.adventure=s.adventure||{};s.adventure.gathered=s.adventure.gathered||{};
 if(node.type!=='water')s.adventure.gathered[node.id]=now;
 return {ok:true,received:amount,wear,tool:action.tool};
}
export function performRoomAction(s,room,actionId,now=Date.now()){
 if(!ROOM_OBJECTS[room]?.some(x=>x.id===actionId))return {ok:false,reason:'Estación inexistente'};
 s.adventure=s.adventure||{};s.adventure.rooms=s.adventure.rooms||{};
 s.stock=s.stock||{};s.discovered=s.discovered||{};
 const r=s.adventure.rooms;
 const add=(id,qty)=>{s.stock[id]=(s.stock[id]||0)+qty;if(!s.discovered[id])s.discovered[id]=now;};
 const needs=(id,qty)=>Number(s.stock[id]||0)>=qty;
 if(actionId==='bed'){s.adventure.energy=100;return {ok:true,message:'Has descansado y recuperado las fuerzas.'};}
 if(actionId==='pantry'){
   const day=new Date(now).toISOString().slice(0,10);
   if(r.pantryDay===day)return {ok:false,reason:'La despensa ya se ha recogido hoy.'};
   r.pantryDay=day;add('berries',2);return {ok:true,message:'Has obtenido 2 bayas.'};
 }
 if(actionId==='hearth'){
   return runStationProcess(s,'fire','cook_meat','house_mara',now);
 }
 if(actionId==='sawmill'){
   return runStationProcess(s,'sawmill','refine_basic','house_lia',now);
 }
 if(actionId==='repair'){
   const candidates=['stone_axe','stone_pickaxe','iron_axe','iron_pickaxe'].filter(id=>needs(id,1));
   const id=candidates.find(x=>(s.toolDurability?.[x]?.[0]||0)<(x.startsWith('stone_')?10:100));
   if(!id)return {ok:false,reason:'No hay herramienta desgastada para reparar.'};
   const material=id.startsWith('stone_')?'stone':'iron',cost=id.startsWith('stone_')?2:1;
   if(!needs(material,cost))return {ok:false,reason:'Necesitas '+cost+' de '+(material==='stone'?'piedra':'hierro')+' para reparar.'};
   s.stock[material]-=cost;
   const max=id.startsWith('stone_')?10:100;
   s.toolDurability[id][0]=Math.min(max,s.toolDurability[id][0]+(max===10?5:25));
   return {ok:true,message:'Has reparado '+id.replaceAll('_',' ')+'. Usos: '+s.toolDurability[id][0]+'/'+max+'.'};
 }
 return {ok:false,reason:'Utiliza el Taller desde la mesa de trabajo'};
}
