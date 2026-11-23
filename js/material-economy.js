// CRAFTERRA: una regla compartida para refinar, alimentar fuego y cocinar.
// Aquí no se inventan recetas duplicadas del laboratorio.
import {syncTools,wearTool,toolCharge} from './adventure-rules.js?v=0.9.0';

export const FUEL_HEAT=Object.freeze({rough_wood:3,wood:5,charcoal:7,coal:12});
export const MAX_FIRE_HEAT=24;

// Categorías de uso, desacopladas de cómo se obtiene cada recurso.
export const RESOURCE_ROLES=Object.freeze({
 rough_wood:{name:'Madera tosca',gather:'Golpear pinos o robles',uses:['Combustible','Refinado a madera']},
 wood:{name:'Madera',gather:'Talar pinos o robles',uses:['Herramientas','Construcción','Combustible','Carbón vegetal']},
 stone:{name:'Piedra',gather:'Picar afloramientos',uses:['Piedra tallada','Construcción','Herramientas']},
 plant_fiber:{name:'Fibra vegetal',gather:'Recoger plantas',uses:['Cuerdas','Tejidos']},
 water:{name:'Agua',gather:'Llenar cuenco en el río',uses:['Cocina','Fabricación','Preparación']},
 iron:{name:'Mineral de hierro',gather:'Picar veta de hierro',uses:['Lingotes','Herramientas de metal']},
 copper:{name:'Mineral de cobre',gather:'Picar veta de cobre',uses:['Lingotes','Aleaciones']},
 tin:{name:'Mineral de estaño',gather:'Picar veta de estaño',uses:['Bronce']},
 coal:{name:'Carbón mineral',gather:'Picar veta de carbón',uses:['Combustible','Metalurgia']},
 animal_hide:{name:'Piel cruda',gather:'Cazar con lanza o arco; atrapar conejos',uses:['Curtido a cuero']},
 wool:{name:'Lana',gather:'Esquilar ovejas o recoger lana suelta',uses:['Tela','Abrigo']},
 raw_meat:{name:'Carne cruda',gather:'Cazar animales de praderas y bosques',uses:['Cocina']}
});
export const STATION_PROCESSES=Object.freeze({
 // Carpintería
 refine_basic:{station:'sawmill',label:'Preparar madera (a mano)',inputs:{rough_wood:2},outputs:{wood:1},tool:null,heat:0,ms:1800,description:'Dos maderas toscas rinden una madera normal.'},
 refine_saw:{station:'sawmill',label:'Aserrar madera',inputs:{rough_wood:1},outputs:{wood:1},tool:'saw',heat:0,ms:1100,description:'La sierra mejora el aprovechamiento y pierde un uso.'},
 // Curtiduría: la piel es materia prima, el cuero un material trabajado.
 tan_hide:{station:'tannery',label:'Curtir piel para cuero',inputs:{animal_hide:1,water:1,rough_wood:1},
  outputs:{leather:1},tool:null,heat:0,ms:3500,description:'Agua y madera tosca aportan el curtiente; una piel cruda se convierte en cuero.'},
 // Hogueras: estaciones persistentes que consumen calor, no objetos
 cook_meat:{station:'fire',label:'Cocinar carne',inputs:{raw_meat:1},outputs:{cooked_meat:1},tool:null,heat:2,ms:1700},
 cook_fish:{station:'fire',label:'Asar pescado',inputs:{fish:1},outputs:{cooked_fish:1},tool:null,heat:2,ms:1700},
 charcoal:{station:'fire',label:'Producir carbón vegetal',inputs:{wood:1},outputs:{charcoal:1},tool:null,heat:3,ms:2100},
 // Cantería: piedra utilizable y mineral preparado
 cut_stone_hand:{station:'stonework',group:'stone',label:'Tallado: 2 piedras → piedra tallada',inputs:{stone:2},outputs:{cut_stone:1},tool:null,heat:0,ms:3500},
 cut_stone_hammer:{station:'stonework',group:'stone',label:'Martillo: 1 piedra → piedra tallada',inputs:{stone:1},outputs:{cut_stone:1},tool:'stone_hammer',heat:0,ms:1300},
 make_stone_pickaxe:{station:'stonework',group:'stone',label:'Montar pico de piedra',inputs:{handle:1,cut_stone:1,rope:1},outputs:{stone_pickaxe:1},tool:null,heat:0,ms:1900},
 make_stone_axe:{station:'stonework',group:'stone',label:'Montar hacha de piedra',inputs:{handle:1,cut_stone:1,rope:1},outputs:{stone_axe:1},tool:null,heat:0,ms:1900},
 prep_iron:{station:'stonework',group:'ore',label:'Preparar mineral de hierro',inputs:{iron:2},outputs:{iron_concentrate:1},tool:null,heat:0,ms:2300},
 prep_copper:{station:'stonework',group:'ore',label:'Preparar mineral de cobre',inputs:{copper:2},outputs:{copper_concentrate:1},tool:null,heat:0,ms:2300},
 prep_tin:{station:'stonework',group:'ore',label:'Preparar mineral de estaño',inputs:{tin:2},outputs:{tin_concentrate:1},tool:null,heat:0,ms:2300},
 prep_silver:{station:'stonework',group:'ore',label:'Preparar mineral de plata',inputs:{silver:2},outputs:{silver_concentrate:1},tool:null,heat:0,ms:2600},
 prep_gold:{station:'stonework',group:'ore',label:'Preparar mineral de oro',inputs:{gold:2},outputs:{gold_concentrate:1},tool:null,heat:0,ms:2600},
 // Fundición: el combustible alimenta un horno, con reserva de calor guardada
 smelt_iron:{station:'foundry',group:'smelt',label:'Fundir hierro → lingote',inputs:{iron_concentrate:1},outputs:{iron_ingot:1},tool:null,heat:8,ms:4000},
 smelt_copper:{station:'foundry',group:'smelt',label:'Fundir cobre → lingote',inputs:{copper_concentrate:1},outputs:{copper_ingot:1},tool:null,heat:6,ms:3400},
 smelt_tin:{station:'foundry',group:'smelt',label:'Fundir estaño → lingote',inputs:{tin_concentrate:1},outputs:{tin_ingot:1},tool:null,heat:6,ms:3400},
 smelt_silver:{station:'foundry',group:'smelt',label:'Fundir plata → lingote',inputs:{silver_concentrate:1},outputs:{silver_ingot:1},tool:null,heat:10,ms:4300},
 smelt_gold:{station:'foundry',group:'smelt',label:'Fundir oro → lingote',inputs:{gold_concentrate:1},outputs:{gold_ingot:1},tool:null,heat:10,ms:4300},
 bronze_alloy:{station:'foundry',group:'smelt',label:'Aleación: obtener bronce',inputs:{copper_ingot:1,tin_ingot:1},outputs:{bronze:1},tool:null,heat:7,ms:3400},
 steel_alloy:{station:'foundry',group:'smelt',label:'Aleación: obtener acero',inputs:{iron_ingot:1,coal:1},outputs:{steel:1},tool:null,heat:9,ms:3900},
 // Forja: yunque comunitario integrado, herramienta con desgaste
 forge_iron_hammer:{station:'foundry',group:'forge',label:'Forjar martillo de hierro',inputs:{iron_ingot:1,handle:1},outputs:{iron_hammer:1},tool:'stone_hammer',heat:4,ms:3300},
 forge_iron_axe:{station:'foundry',group:'forge',label:'Forjar hacha de hierro',inputs:{iron_ingot:1,handle:1},outputs:{iron_axe:1},tool:'iron_hammer',heat:4,ms:3300},
 forge_iron_pickaxe:{station:'foundry',group:'forge',label:'Forjar pico de hierro',inputs:{iron_ingot:1,handle:1},outputs:{iron_pickaxe:1},tool:'iron_hammer',heat:4,ms:3300},
 forge_shears:{station:'foundry',group:'forge',label:'Forjar tijeras de esquilar',inputs:{iron_ingot:1},outputs:{shears:1},tool:'iron_hammer',heat:4,ms:2900}
});
export const MATERIAL_NAMES=Object.freeze({
 rough_wood:'madera tosca',wood:'madera',stone:'piedra',cut_stone:'piedra tallada',rope:'cuerda',handle:'mango',
 charcoal:'carbón vegetal',coal:'carbón mineral',raw_meat:'carne cruda',fish:'pescado',saw:'sierra',
 stone_hammer:'martillo de piedra',iron_hammer:'martillo de hierro',
 iron:'mineral de hierro',copper:'mineral de cobre',tin:'mineral de estaño',silver:'mineral de plata',gold:'mineral de oro',
 iron_concentrate:'hierro preparado',copper_concentrate:'cobre preparado',tin_concentrate:'estaño preparado',
 silver_concentrate:'plata preparada',gold_concentrate:'oro preparado',
 iron_ingot:'lingote de hierro',copper_ingot:'lingote de cobre',tin_ingot:'lingote de estaño',
 silver_ingot:'lingote de plata',gold_ingot:'lingote de oro',
 animal_hide:'piel cruda',wool:'lana',leather:'cuero',shears:'tijeras de esquilar'
});
const pretty=MATERIAL_NAMES;
const amount=(s,id)=>Math.max(0,Math.floor(Number(s.stock?.[id]||0)));
export function heatOf(s,fireId){
 return Math.max(0,Math.min(MAX_FIRE_HEAT,Math.floor(Number(s.adventure?.fires?.[fireId]||0))));
}
function ensureFire(s){s.adventure=s.adventure||{};s.adventure.fires=s.adventure.fires||{};return s.adventure.fires;}
export function stationOptions(s,station,fireId='hearth'){
 const result=[];
 if(station==='fire'||station==='foundry'){
   const heat=heatOf(s,fireId);
   for(const [fuel,gain]of Object.entries(FUEL_HEAT)){
     const have=amount(s,fuel);
     const ok=have>0&&heat+gain<=MAX_FIRE_HEAT;
     const reason=!have?'Te falta '+(pretty[fuel]||fuel):'El depósito de calor no admite más combustible';
     result.push({id:'fuel_'+fuel,label:'Añadir '+(pretty[fuel]||fuel)+' · +'+gain+' calor',enabled:ok,reason,kind:'fuel',fuel,gain});
   }
 }
 for(const [id,p]of Object.entries(STATION_PROCESSES)){
   if(p.station!==station)continue;
   const lacks=Object.entries(p.inputs).filter(([item,qty])=>amount(s,item)<qty);
   const toolMissing=!!p.tool&&(!amount(s,p.tool)||!toolCharge(s,p.tool));
   const cold=!!p.heat&&heatOf(s,fireId)<p.heat;
   const enabled=!lacks.length&&!toolMissing&&!cold;
   const reason=lacks.length?'Necesitas '+lacks.map(([item,qty])=>qty+' '+(pretty[item]||item)).join(', '):
     toolMissing?'Necesitas '+(pretty[p.tool]||p.tool)+' con usos disponibles':
     cold?'Alimenta la hoguera (faltan '+(p.heat-heatOf(s,fireId))+' de calor)':'';
   result.push({id,label:p.label,enabled,reason,kind:'process',group:p.group||null,ms:p.ms||1200,inputs:p.inputs,outputs:p.outputs,heat:p.heat,tool:p.tool});
 }
 return result;
}
export function runStationProcess(s,station,processId,fireId='hearth',now=Date.now()){
 const option=stationOptions(s,station,fireId).find(x=>x.id===processId);
 if(!option)return {ok:false,reason:'Esta acción no existe en esa estación.'};
 if(!option.enabled)return {ok:false,reason:option.reason||'Faltan recursos.'};
 s.stock=s.stock||{};s.discovered=s.discovered||{};
 if(option.kind==='fuel'){
   s.stock[option.fuel]-=1;
   const fires=ensureFire(s);fires[fireId]=heatOf(s,fireId)+option.gain;
   return {ok:true,message:(station==='foundry'?'Horno':'Hoguera')+' alimentado con '+(pretty[option.fuel]||option.fuel)+' · '+fires[fireId]+'/'+MAX_FIRE_HEAT+' de calor.',heat:fires[fireId]};
 }
 if(option.tool){
   syncTools(s);
   const used=wearTool(s,option.tool);
   if(!used.ok)return {ok:false,reason:'Herramienta sin usos restantes.'};
 }
 for(const [id,qty]of Object.entries(option.inputs))s.stock[id]-=qty;
 for(const [id,qty]of Object.entries(option.outputs)){
   s.stock[id]=amount(s,id)+qty;
   s.crafted=s.crafted||{};s.crafted[id]=(Number(s.crafted[id])||0)+qty;
   if(!s.discovered[id]){
     s.discovered[id]=now;
     s.xp=Math.max(0,Number(s.xp||0))+20;
   }
 }
 if(option.heat){const fires=ensureFire(s);fires[fireId]=heatOf(s,fireId)-option.heat;}
 syncTools(s);
 return {ok:true,message:option.label+' completado.',outputs:option.outputs,heat:heatOf(s,fireId)};
}
