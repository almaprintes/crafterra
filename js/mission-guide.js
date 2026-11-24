// CRAFTERRA 0.12 · Guía de forja: datos de recetas y estaciones reales.
// Nunca consume recursos: su trabajo es explicar, preparar y orientar al jugador.
import {RECIPES,ITEMS} from './data.js?v=0.9.0';
import {STATION_PROCESSES,FUEL_HEAT,heatOf,stationOptions} from './material-economy.js?v=0.9.0';
import {toolCharge} from './adventure-rules.js?v=0.9.0';
const name=id=>ITEMS.find(i=>i.id===id)?.name||id;
const amount=(s,id)=>Math.max(0,Number(s.stock?.[id]||0));
const tool=(s,id)=>amount(s,id)>0&&toolCharge(s,id)>0;
const label=(id,q)=>q+' '+name(id);
const recipeFor=id=>RECIPES.find(r=>r.result===id&&r.a&&r.b);
const inputList=inputs=>Object.entries(inputs).map(([id,count])=>({id,name:name(id),count}));
export const IRON_QUEST_STAGES=Object.freeze([
 {id:'pick',name:'Preparar un pico',art:'pick'},
 {id:'iron',name:'Extraer hierro',art:'stone'},
 {id:'prepare',name:'Preparar el mineral',art:'hammer'},
 {id:'smelt',name:'Fundir un lingote',art:'fire'},
 {id:'hammer',name:'Forjar un martillo',art:'hammer'},
 {id:'forge',name:'Forjar el pico',art:'pick'}
]);
export function ironQuestTotals(s){
 const hammerReady=tool(s,'iron_hammer');
 const bars=Math.max(0,(hammerReady?1:2)-amount(s,'iron_ingot'));
 const concentrates=Math.max(0,bars-amount(s,'iron_concentrate'));
 return {
  hammerReady,barsNeeded:bars,
  preparedNeeded:concentrates,
  oreNeeded:Math.max(0,2*concentrates-amount(s,'iron')),
  ingots:amount(s,'iron_ingot'),
  prepared:amount(s,'iron_concentrate'),
  iron:amount(s,'iron'),
  heat:heatOf(s,'village_foundry'),
  handle:amount(s,'handle'),
  hasPick:tool(s,'stone_pickaxe')||tool(s,'iron_pickaxe')
 };
}
function craft(s,result,stage,detail){
 const recipe=recipeFor(result);
 if(!recipe)throw new Error('No existe una receta comprobada para '+result);
 const inputs={};for(const id of [recipe.a,recipe.b])inputs[id]=(inputs[id]||0)+1;
 return {
  id:'craft_'+result,stage,result,title:'Fabricar '+name(result).toLowerCase(),
  description:detail||'Coloca los dos ingredientes en la mesa y pulsa Fusionar.',
  ingredients:inputList(inputs),
  instruction:inputList(inputs).map(i=>label(i.id,i.count)).join(' + ')+' → '+name(result),
  action:{kind:'craft',result,ingredients:[recipe.a,recipe.b]},cta:'Preparar la combinación'
 };
}
function gather(s,resource,stage,description){
 return {
  id:'gather_'+resource,stage,title:resource==='iron'?'Picar una veta de hierro':resource==='wood'?'Cortar un árbol':resource==='plant_fiber'?'Recoger fibras vegetales':'Recoger piedra',
  description,ingredients:[],
  action:{kind:'resource',resource},cta:'Llévame al recurso'
 };
}
function station(s,process,stage,description){
 const p=STATION_PROCESSES[process];
 if(!p)throw new Error('Proceso de estación inexistente: '+process);
 return {
  id:process,stage,title:p.label,description,
  ingredients:inputList(p.inputs),
  tool:p.tool?name(p.tool):null,
  heat:p.heat||0,
  instruction:inputList(p.inputs).map(i=>label(i.id,i.count)).join(' + ')+
   (p.tool?' · '+name(p.tool):'')+(p.heat?' · '+p.heat+' de calor':''),
  action:{kind:'station',station:p.station,process,group:p.group||null},
  cta:p.station==='stonework'?'Ir a Cantería':'Ir al Horno'
 };
}
function ingredient(s,id,stage){
 if(amount(s,id)>0)return null;
 if(id==='cut_stone'){
  if(amount(s,'stone')<2)return gather(s,'stone',stage,'Necesitas 2 piedras para fabricar piedra tallada. Las rocas están en zonas pedregosas.');
  return craft(s,'cut_stone',stage,'En Crear, combina Piedra + Piedra; no hace falta memorizar la receta.');
 }
 if(id==='handle'){
  if(amount(s,'wood')<1)return gather(s,'wood',stage,'Consigue madera cortando un árbol. Con una herramienta tardarás menos.');
  const p=ingredient(s,'cut_stone',stage);if(p)return p;
  return craft(s,'handle',stage,'Combina 1 madera y 1 piedra tallada para obtener un mango.');
 }
 if(id==='rope'){
  if(amount(s,'plant_fiber')<2)return gather(s,'plant_fiber',stage,'Recoge 2 fibras vegetales de las plantas de pradera o bosque.');
  return craft(s,'rope',stage,'Dos fibras vegetales forman una cuerda.');
 }
 if(id==='stone_hammer'){
  const p=ingredient(s,'handle',stage);if(p)return p;
  if(amount(s,'stone')<1)return gather(s,'stone',stage,'Necesitas una piedra más para el martillo de piedra.');
  return craft(s,'stone_hammer',stage,'Combina un mango y una piedra para fabricar el martillo.');
 }
 return null;
}
function fuelStep(s,stage,minHeat){
 const heat=heatOf(s,'village_foundry');
 const fuel=stationOptions(s,'foundry','village_foundry')
   .filter(o=>o.kind==='fuel'&&o.enabled)
   .sort((a,b)=>Number(b.gain)-Number(a.gain))[0];
 if(!fuel)return gather(s,'wood',stage,
  'Te faltan '+(minHeat-heat)+' unidades de calor. Reúne madera o madera tosca: podrás echarla al horno sin fabricar otra receta.');
 return {
  id:'fuel',stage,title:'Alimentar el horno',
  description:'Calor disponible: '+heat+'/'+minHeat+'. Selecciona '+name(fuel.fuel)+
   ' para añadir +'+fuel.gain+' de calor, y repite si hace falta.',
  ingredients:[{id:fuel.fuel,name:name(fuel.fuel),count:1}],
  instruction:'Horno: '+name(fuel.fuel)+' → +'+fuel.gain+' de calor',
  action:{kind:'station',station:'foundry',process:fuel.id,group:'fuel'},
  cta:'Ir a añadir combustible'
 };
}
function sourceReady(s,id){
 return amount(s,id)>0||Number(s.crafted?.[id]||0)>0;
}
export function getIronQuestGuide(s){
 const st=s||{stock:{},adventure:{}};
 const total=ironQuestTotals(st);
 const result=tool(st,'iron_pickaxe');
 const knownNext=()=>{
  if(result)return {
   id:'finished',stage:5,title:'¡Ya tienes el pico de hierro!',
   description:'Puedes picar minerales raros y explorar las cuevas más difíciles.',
   ingredients:[],action:{kind:'finished'},cta:'Objetivo completado'
  };
  if(!total.hasPick){
   for(const id of ['handle','cut_stone','rope']){
    const p=ingredient(st,id,0);if(p)return p;
   }
   return station(st,'make_stone_pickaxe',0,'La Cantería monta el pico de piedra con mango, piedra tallada y cuerda; te servirá para picar hierro.');
  }
  // If one ingot exists, forge the hammer before collecting the second.
  if(!total.hammerReady&&total.ingots>=1){
   for(const id of ['handle','stone_hammer']){const p=ingredient(st,id,4);if(p)return p;}
   if(total.heat<STATION_PROCESSES.forge_iron_hammer.heat)
    return fuelStep(st,4,STATION_PROCESSES.forge_iron_hammer.heat);
   return station(st,'forge_iron_hammer',4,'Para forjar el martillo necesitas un lingote, un mango, un martillo de piedra en buen estado y calor.');
  }
  if(total.hammerReady&&total.ingots>=1){
   const p=ingredient(st,'handle',5);if(p)return p;
   if(total.heat<STATION_PROCESSES.forge_iron_pickaxe.heat)
    return fuelStep(st,5,STATION_PROCESSES.forge_iron_pickaxe.heat);
   return station(st,'forge_iron_pickaxe',5,'Ya puedes fabricar el pico definitivo. El martillo de hierro no desaparece: pierde solo un uso.');
  }
  if(total.prepared>=1){
   if(total.heat<STATION_PROCESSES.smelt_iron.heat)
    return fuelStep(st,3,STATION_PROCESSES.smelt_iron.heat);
   return station(st,'smelt_iron',3,'Un mineral preparado y 8 de calor producen un lingote de hierro.');
  }
  if(total.iron>=STATION_PROCESSES.prep_iron.inputs.iron)
   return station(st,'prep_iron',2,'Dos minerales brutos se convierten en una unidad preparada, lista para fundir.');
  return gather(st,'iron',1,'Busca las vetas Fe en la sierra rocosa. Con cada extracción consigues 2 minerales. Te falta reunir '+Math.max(0,2-total.iron)+' para el siguiente preparado.');
 };
 const next=knownNext();
 const stages=IRON_QUEST_STAGES.map((v,index)=>{
  let done=false;
  switch(v.id){
   case'pick':done=total.hasPick;break;
   case'iron':done=sourceReady(st,'iron')||sourceReady(st,'iron_concentrate')||sourceReady(st,'iron_ingot')||total.hammerReady||result;break;
   case'prepare':done=sourceReady(st,'iron_concentrate')||sourceReady(st,'iron_ingot')||total.hammerReady||result;break;
   case'smelt':done=sourceReady(st,'iron_ingot')||total.hammerReady||result;break;
   case'hammer':done=total.hammerReady||result;break;
   case'forge':done=result;break;
  }
  return {...v,done,active:index===next.stage&&!result};
 });
 const completed=stages.filter(v=>v.done).length;
 const stock=[
  {id:'iron',count:total.iron},
  {id:'iron_concentrate',count:total.prepared},
  {id:'iron_ingot',count:total.ingots},
  {id:'handle',count:total.handle},
  {id:'stone_pickaxe',count:amount(st,'stone_pickaxe')},
  {id:'iron_hammer',count:amount(st,'iron_hammer')}
 ];
 return {
  title:'Tu primer pico de hierro',
  completed:result,
  next,
  stages,
  stageCount:stages.length,
  completedCount:completed,
  stock,
  totals:total,
  summary:result?'¡Objetivo cumplido!':next.title,
  footer:'Receta final: '+label('iron_ingot',1)+' + '+label('handle',1)+
   ' · '+name('iron_hammer')+' · 4 calor. Si aún no tienes martillo de hierro, forja uno primero.'
 };
}
