// Reglas de extracción y desgaste de herramientas. Sin DOM; comprobables con Node.
export const TOOL_RULES=Object.freeze({
 stone_axe:{kind:'wood',uses:10,ms:1450,label:'Hacha de piedra',tier:1},
 iron_axe:{kind:'wood',uses:100,ms:650,label:'Hacha de hierro',tier:2},
 stone_pickaxe:{kind:'stone',uses:10,ms:1700,label:'Pico de piedra',tier:1},
 iron_pickaxe:{kind:'stone',uses:100,ms:700,label:'Pico de hierro',tier:2},
 flint_knife:{kind:'plant_fiber',uses:10,ms:800,label:'Cuchillo de pedernal',tier:1},
 shovel:{kind:'plant_fiber',uses:100,ms:450,label:'Pala',tier:2},
 stone_hammer:{kind:'craft',uses:10,ms:900,label:'Martillo de piedra',tier:1},
 iron_hammer:{kind:'craft',uses:100,ms:450,label:'Martillo de hierro',tier:2},
 saw:{kind:'craft',uses:100,ms:500,label:'Sierra',tier:2}
});
export const HAND_MS=Object.freeze({wood:6000,stone:7500,plant_fiber:2100});
export function toolUses(id){return TOOL_RULES[id]?.uses||0;}
export function isReusableTool(id){return !!TOOL_RULES[id];}
export function syncTools(s){
 if(!s.toolDurability||typeof s.toolDurability!=='object')s.toolDurability={};
 for(const [id,rule] of Object.entries(TOOL_RULES)){
   const qty=Math.max(0,Math.floor(Number(s.stock?.[id]||0)));
   let list=Array.isArray(s.toolDurability[id])?s.toolDurability[id].filter(v=>Number.isFinite(v)&&v>0).map(v=>Math.min(rule.uses,Math.floor(v))):[];
   if(list.length>qty)list=list.slice(0,qty);
   while(list.length<qty)list.push(rule.uses);
   s.toolDurability[id]=list;
 }
 return s.toolDurability;
}
export function pickTool(s,kind){
 syncTools(s);
 return Object.entries(TOOL_RULES).filter(([id,rule])=>rule.kind===kind&&s.toolDurability[id]?.length)
   .sort((a,b)=>b[1].tier-a[1].tier)[0]?.[0]||null;
}
export function toolCharge(s,id){
 if(!isReusableTool(id))return 0;
 syncTools(s);
 return s.toolDurability[id]?.[0]||0;
}
export function wearTool(s,id){
 if(!isReusableTool(id))return {ok:false,broken:false,remaining:0};
 syncTools(s);
 const bag=s.toolDurability[id];
 if(!bag?.length)return {ok:false,broken:false,remaining:0};
 bag[0]-=1;let broken=false;
 if(bag[0]<=0){
   bag.shift();broken=true;
   s.stock[id]=Math.max(0,Number(s.stock[id]||0)-1);
 } 
 return {ok:true,broken,remaining:bag[0]||0};
}
export function gatheringPlan(s,kind){
 const tool=pickTool(s,kind);
 return {tool,ms:tool?TOOL_RULES[tool].ms:HAND_MS[kind],
   label:tool?TOOL_RULES[tool].label:'A mano',
   remaining:tool?toolCharge(s,tool):null,max:tool?toolUses(tool):null};
}
export function canGather(s,node,now=Date.now(),respawn=300000){
 return !!node&&(!s.adventure?.gathered?.[node.id]||now-s.adventure.gathered[node.id]>=respawn);
}
export function applyHarvest(s,node,now=Date.now(),respawn=300000){
 if(!canGather(s,node,now,respawn))return {ok:false,reason:'unavailable'};
 s.stock=s.stock||{};
 const tool=pickTool(s,node.type);
 const wear=tool?wearTool(s,tool):null;
 s.stock[node.type]=(Number(s.stock[node.type])||0)+node.qty;
 if(!s.discovered[node.type]){
   s.discovered[node.type]=now;
   s.xp=(Number(s.xp)||0)+20;
 }
 if(!s.adventure||typeof s.adventure!=='object')s.adventure={};
 if(!s.adventure.gathered||typeof s.adventure.gathered!=='object')s.adventure.gathered={};
 s.adventure.gathered[node.id]=now;
 return {ok:true,tool,wear,received:node.qty,kind:node.type};
}
