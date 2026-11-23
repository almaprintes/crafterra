// CRAFTERRA: una regla compartida para refinar, alimentar fuego y cocinar.
// Aquí no se inventan recetas duplicadas del laboratorio.
import {syncTools,wearTool,toolCharge} from './adventure-rules.js?v=0.6.0';

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
 coal:{name:'Carbón mineral',gather:'Picar veta de carbón',uses:['Combustible','Metalurgia']}
});
export const STATION_PROCESSES=Object.freeze({
 refine_basic:{station:'sawmill',label:'Preparar madera (a mano)',inputs:{rough_wood:2},outputs:{wood:1},tool:null,heat:0,description:'Dos piezas toscas se trabajan para aprovechar una madera.'},
 refine_saw:{station:'sawmill',label:'Aserrar con sierra',inputs:{rough_wood:1},outputs:{wood:1},tool:'saw',heat:0,description:'Una sierra permite aprovechar una pieza completa y pierde 1 uso.'},
 cook_meat:{station:'fire',label:'Cocinar carne',inputs:{raw_meat:1},outputs:{cooked_meat:1},tool:null,heat:2,description:'La hoguera consume calor, no desaparece.'},
 cook_fish:{station:'fire',label:'Asar pescado',inputs:{fish:1},outputs:{cooked_fish:1},tool:null,heat:2,description:'El pescado se cocina con calor almacenado.'},
 charcoal:{station:'fire',label:'Producir carbón vegetal',inputs:{wood:1},outputs:{charcoal:1},tool:null,heat:3,description:'La carbonización consume madera y parte del calor de la hoguera.'}
});
const pretty={rough_wood:'madera tosca',wood:'madera',charcoal:'carbón vegetal',coal:'carbón',raw_meat:'carne cruda',fish:'pescado',saw:'sierra'};
const amount=(s,id)=>Math.max(0,Math.floor(Number(s.stock?.[id]||0)));
export function heatOf(s,fireId){
 return Math.max(0,Math.min(MAX_FIRE_HEAT,Math.floor(Number(s.adventure?.fires?.[fireId]||0))));
}
function ensureFire(s){s.adventure=s.adventure||{};s.adventure.fires=s.adventure.fires||{};return s.adventure.fires;}
export function stationOptions(s,station,fireId='hearth'){
 const result=[];
 if(station==='fire'){
   const heat=heatOf(s,fireId);
   for(const [fuel,gain]of Object.entries(FUEL_HEAT)){
     const have=amount(s,fuel);
     const ok=have>0&&heat+gain<=MAX_FIRE_HEAT;
     const reason=!have?'Te falta '+(pretty[fuel]||fuel):'La hoguera ya tiene suficiente combustible';
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
     toolMissing?'Necesitas una sierra con usos restantes':
     cold?'Alimenta la hoguera (faltan '+(p.heat-heatOf(s,fireId))+' de calor)':'';
   result.push({id,label:p.label,enabled,reason,kind:'process',inputs:p.inputs,outputs:p.outputs,heat:p.heat,tool:p.tool});
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
   return {ok:true,message:'Hoguera alimentada con '+(pretty[option.fuel]||option.fuel)+' · '+fires[fireId]+'/'+MAX_FIRE_HEAT+' de calor.',heat:fires[fireId]};
 }
 if(option.tool){
   syncTools(s);
   const used=wearTool(s,option.tool);
   if(!used.ok)return {ok:false,reason:'Herramienta sin usos restantes.'};
 }
 for(const [id,qty]of Object.entries(option.inputs))s.stock[id]-=qty;
 for(const [id,qty]of Object.entries(option.outputs)){
   s.stock[id]=amount(s,id)+qty;
   if(!s.discovered[id]){
     s.discovered[id]=now;
     s.xp=Math.max(0,Number(s.xp||0))+20;
   }
 }
 if(option.heat){const fires=ensureFire(s);fires[fireId]=heatOf(s,fireId)-option.heat;}
 return {ok:true,message:option.label+' completado.',outputs:option.outputs,heat:heatOf(s,fireId)};
}
