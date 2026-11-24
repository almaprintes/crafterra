import{gatheringPlan}from './adventure-rules.js?v=0.9.0';
import{actionArt,actionKind}from './adventure-art.js?v=0.9.0';
import{drawTerrainTile,drawContactShadow,terrainTextureRevision}from './terrain-textures.js?v=0.11.1';
import{safeCanvasDpr,targetFrameInterval,captureRuntimeFault,noteRuntimeScene}from './runtime-diagnostics.js?v=0.11.1';
import{createCameraPan}from './world-camera.js?v=0.11.3';
import{drawPremiumTree,drawPremiumRock,drawPremiumHouse,drawPremiumCave,drawPremiumForge,drawPremiumBridge}from './world-art-premium.js?v=0.11.0';
import{BIOMES,ORE_TYPES,CAVE_ENTRANCES,CAVE_NODES,WORLD_ANIMALS,ANIMAL_SPECIES,biomeAt,biomeLabel,isBiomeResource}from './world-biomes.js?v=0.9.0';
import{stationOptions,runStationProcess,heatOf,MAX_FIRE_HEAT}from './material-economy.js?v=0.9.0';
import{TREE_SPECIES,HOUSE_ROOMS,ROOM_OBJECTS,nodeAvailable,availableActions,completeWorldAction,performRoomAction,RESOURCE_RESPAWN,hasBowl,isOre}from './world-actions.js?v=0.9.0';
// CRAFTERRA · Primer mundo isométrico (sin dependencias externas)
// La aventura comparte inventario y guardado con el juego original.
export const WORLD_SIZE = Object.freeze({width:30,height:22});
export const WORLD_NODES = Object.freeze([
 // Praderas y bosques: recolección orgánica
 {id:'arbol1',x:5,y:7,type:'wood',species:'pine',qty:2},
 {id:'arbol2',x:4,y:14,type:'wood',species:'oak',qty:3},
 {id:'arbol3',x:10,y:16,type:'wood',species:'pine',qty:2},
 {id:'arbol4',x:8,y:6,type:'wood',species:'oak',qty:3},
 {id:'arbol5',x:20,y:13,type:'wood',species:'oak',qty:3},
 {id:'fibra1',x:9,y:13,type:'plant_fiber',qty:2},
 {id:'fibra2',x:5,y:17,type:'plant_fiber',qty:2},
 {id:'fibra3',x:11,y:8,type:'plant_fiber',qty:2},
 {id:'fibra4',x:22,y:16,type:'plant_fiber',qty:2},
 {id:'bayas_pradera',x:7,y:12,type:'berries',qty:2},
 {id:'bayas_ribera',x:21,y:11,type:'berries',qty:2},
 {id:'hierbas_pradera',x:11,y:13,type:'herbs',qty:2},
 {id:'setas_bosque',x:6,y:16,type:'mushroom',qty:2},
 // Sierras y afloramientos: ninguna veta en prados
 {id:'roca1',x:5,y:19,type:'stone',qty:3},
 {id:'roca2',x:11,y:5,type:'stone',qty:3},
 {id:'roca3',x:8,y:19,type:'stone',qty:3},
 {id:'roca4',x:24,y:6,type:'stone',qty:3},
 {id:'mena_hierro',x:10,y:4,type:'iron',qty:2},
 {id:'mena_cobre',x:9,y:18,type:'copper',qty:2},
 {id:'mena_estano',x:25,y:12,type:'tin',qty:2},
 {id:'carbon',x:6,y:19,type:'coal',qty:2},
 {id:'cuarzo',x:24,y:17,type:'quartz',qty:1},
 {id:'plata',x:26,y:7,type:'silver',qty:1},
 {id:'oro',x:26,y:18,type:'gold',qty:1}
]);
export const WORLD_NPCS = Object.freeze([
  {id:'mara',name:'Mara',x:7,y:10,palette:'orange'},
  {id:'taro',name:'Taro',x:13,y:10,palette:'blue'},
  {id:'lia',name:'Lía',x:22,y:10,palette:'violet'}
]);
export function isWalkable(x,y,bridge=false,gathered={},now=Date.now()){
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<1||x>=WORLD_SIZE.width-1||y<1||y>=WORLD_SIZE.height-1)return false;
  if(x===15&&(!bridge||y!==10))return false;
  if(WORLD_HOUSES.some(t=>t.x===x&&t.y===y))return false;
  if(CAVE_ENTRANCES.some(t=>t.x===x&&t.y===y))return false;
  if(WORLD_ANIMALS.some(t=>t.x===x&&t.y===y&&nodeAvailable({adventure:{gathered}},t,now)))return false;
  if(WORLD_CAMPFIRE.x===x&&WORLD_CAMPFIRE.y===y)return false;
  if(WORLD_WORKSTATIONS.some(o=>o.x===x&&o.y===y))return false;
  if(WORLD_TREES.some(t=>t.x===x&&t.y===y&&nodeAvailable({adventure:{gathered}},t,now)))return false;
  if(WORLD_NODES.some(n=>n.x===x&&n.y===y&&!['plant_fiber','berries','herbs','mushroom'].includes(n.type)&&nodeAvailable({adventure:{gathered}},n,now)))return false;
  return true;
}
export function findPath(from,to,bridge=false,gathered={}){
  const start=[Math.round(from.x),Math.round(from.y)],goal=[Math.round(to.x),Math.round(to.y)];
  if(!isWalkable(goal[0],goal[1],bridge,gathered))return [];
  const key=(x,y)=>x+','+y,queue=[start],seen=new Map([[key(...start),null]]);
  for(let i=0;i<queue.length;i++){
    const [x,y]=queue[i];if(x===goal[0]&&y===goal[1])break;
    for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){
      const nx=x+dx,ny=y+dy,k=key(nx,ny);
      if(isWalkable(nx,ny,bridge,gathered)&&!seen.has(k)){seen.set(k,[x,y]);queue.push([nx,ny]);}
    }
  }
  let k=key(...goal);if(!seen.has(k))return [];
  const path=[];while(seen.get(k)){const [x,y]=k.split(',').map(Number);path.unshift({x,y});k=key(...seen.get(k));}
  return path;
}
const TW=48,TH=24,RESPAWN=RESOURCE_RESPAWN;
export const WORLD_CAMPFIRE=Object.freeze({id:'valley_campfire',x:10,y:12,kind:'fire',label:'Hoguera del valle'});
export const WORLD_WORKSTATIONS=Object.freeze([
  {id:'stone_table',x:8,y:12,kind:'workshop',station:'stonework',label:'Mesa de cantería'},
  {id:'village_foundry',x:12,y:7,kind:'workshop',station:'foundry',label:'Horno y forja del valle'}
]);
export const WORLD_HOUSES=Object.freeze([{id:'house_mara',x:6,y:7,kind:'house',label:'Casa de Mara'},{id:'house_lia',x:21,y:7,kind:'house',label:'Taller de Lía'}]);
const color={
  avatar:{h:'#61402e',s:'#f8ce99',j:'#e8b04b',p:'#274b65'},
  orange:{h:'#693721',s:'#ffd2a1',j:'#cb6b45',p:'#4e4661'},
  blue:{h:'#503b2e',s:'#f0c390',j:'#4989ae',p:'#354766'},
  violet:{h:'#392a49',s:'#dfb18d',j:'#a47bd0',p:'#4c4667'}
};
const hash=(x,y)=>((x*1789+y*3247+x*y*1297)>>>0)%19;
// Todo árbol pintado es un árbol del mundo: sin atrezo que no responda.
export const WORLD_TREES=Object.freeze((()=>{
 const out=[];
 for(let y=2;y<WORLD_SIZE.height-2;y++)for(let x=2;x<WORLD_SIZE.width-2;x++){
   const area=biomeAt(x,y);
   if(area!=='meadow'&&area!=='forest')continue;
   if(Math.abs(x-15)<3||y>=9&&y<=11||hash(x,y)>(area==='forest'?2:0))continue;
   if(WORLD_HOUSES.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3))continue;
   if(CAVE_ENTRANCES.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3))continue;
   if(WORLD_ANIMALS.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<2))continue;
   if(WORLD_NPCS.some(n=>Math.abs(n.x-x)<3&&Math.abs(n.y-y)<3))continue;
   if(WORLD_NODES.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<2))continue;
   if(WORLD_WORKSTATIONS.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<2))continue;
   out.push({id:'bosque_'+x+'_'+y,x,y,type:'wood',species:(x+y)%2?'pine':'oak',qty:(x+y)%2?2:3,kind:'node'});
 }
 return out;
})());
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sprite=(ctx,x,y,palette,phase=0,facing=1)=>{
 const c=color[palette]||color.avatar;
 const walking=phase!==0,step=walking?Math.round(Math.sin(phase)*4):0;
 const arm=walking?Math.round(Math.sin(phase)*3):0;
 const px=(v)=>Math.round(v);
 // Sombra fija y pies anclados al terreno; los brazos y piernas alternan de verdad.
 ctx.fillStyle='#152f3866';ctx.beginPath();ctx.ellipse(px(x),px(y+1),12,4,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=c.p;
 ctx.fillRect(px(x-9-step),px(y-12),7,12);
 ctx.fillRect(px(x+3+step),px(y-12),7,12);
 ctx.fillStyle='#263b44';
 ctx.fillRect(px(x-11-step),px(y-2),9,3);
 ctx.fillRect(px(x+3+step),px(y-2),9,3);
 ctx.fillStyle=c.s;
 ctx.fillRect(px(x-14-arm),px(y-27),5,13);
 ctx.fillRect(px(x+9+arm),px(y-27),5,13);
 ctx.fillStyle=c.j;
 ctx.fillRect(px(x-10),px(y-29),20,19);
 ctx.fillStyle='#fff5d8';ctx.fillRect(px(x-6),px(y-27),12,3);
 ctx.fillStyle=c.s;ctx.fillRect(px(x-8),px(y-43),16,16);
 ctx.fillStyle=c.h;ctx.fillRect(px(x-9),px(y-46),18,8);
 ctx.fillRect(px(x-11),px(y-40),4,8);
 ctx.fillStyle='#25394b';
 if(facing>=0){ctx.fillRect(px(x+1),px(y-34),3,3);ctx.fillRect(px(x+7),px(y-34),2,2);}
 else{ctx.fillRect(px(x-5),px(y-34),3,3);ctx.fillRect(px(x-10),px(y-34),2,2);}
 ctx.fillStyle='#ecdfa6';ctx.fillRect(px(x-3),px(y-24),6,4);
};

const diamond=(ctx,x,y,c,edge)=>{
  ctx.beginPath();ctx.moveTo(x,y-TH/2);ctx.lineTo(x+TW/2,y);ctx.lineTo(x,y+TH/2);ctx.lineTo(x-TW/2,y);ctx.closePath();
  ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=.7;ctx.stroke();
};
const tree=(ctx,x,y,species='pine',seed=0)=>drawPremiumTree(ctx,x,y,species,seed);
const rock=(ctx,x,y)=>drawPremiumRock(ctx,x,y,'stone');
const drawAnimal=(ctx,x,y,species,time=0,shorn=false)=>{
 const gait=Math.round(Math.sin(time*2.4+x*.14)*2),px=Math.round(x),py=Math.round(y);
 ctx.fillStyle='#09263077';ctx.fillRect(px-14,py-3,30,4);
 if(species==='sheep'){
   ctx.fillStyle='#695f51';for(const dx of [-12,-3,7,13])ctx.fillRect(px+dx,py-8,4,9);
   ctx.fillStyle=shorn?'#a6b0a5':'#dce6d7';ctx.fillRect(px-17,py-26+gait,30,20);
   if(!shorn){ctx.fillStyle='#f4f3dc';for(const dx of [-16,-8,0,8])ctx.fillRect(px+dx,py-31+gait,10,10);}
   ctx.fillStyle='#7b665c';ctx.fillRect(px+11,py-23+gait,12,12);
   ctx.fillStyle='#e4c5a3';ctx.fillRect(px+17,py-15+gait,7,4);
   ctx.fillStyle='#182938';ctx.fillRect(px+20,py-20+gait,3,3);
 }else if(species==='rabbit'){
   ctx.fillStyle='#7e6450';ctx.fillRect(px-12,py-13,21,11);
   ctx.fillStyle='#c3ab88';ctx.fillRect(px-8,py-19+gait,16,14);
   ctx.fillStyle='#9d7f65';ctx.fillRect(px+3,py-32+gait,5,18);ctx.fillRect(px+11,py-29+gait,5,17);
   ctx.fillStyle='#d7bda4';ctx.fillRect(px+6,py-29+gait,2,12);
   ctx.fillStyle='#b2a295';ctx.fillRect(px-14,py-10,9,8);
   ctx.fillStyle='#151f2c';ctx.fillRect(px+9,py-16+gait,3,3);
   ctx.fillStyle='#fff1d6';ctx.fillRect(px-14,py-12,5,6);
 }else if(species==='deer'){
   ctx.fillStyle='#614a34';for(const dx of [-13,-5,5,13])ctx.fillRect(px+dx,py-14,4,14);
   ctx.fillStyle='#a3784d';ctx.fillRect(px-16,py-31+gait,33,21);
   ctx.fillStyle='#c89a69';ctx.fillRect(px-9,py-30+gait,16,6);
   ctx.fillStyle='#99673f';ctx.fillRect(px+13,py-39+gait,11,19);
   ctx.fillStyle='#c8a078';ctx.fillRect(px+19,py-24+gait,9,5);
   ctx.strokeStyle='#cfa878';ctx.lineWidth=3;
   ctx.beginPath();ctx.moveTo(px+19,py-38+gait);ctx.lineTo(px+15,py-53+gait);ctx.lineTo(px+9,py-59+gait);
   ctx.moveTo(px+15,py-50+gait);ctx.lineTo(px+7,py-50+gait);
   ctx.moveTo(px+20,py-38+gait);ctx.lineTo(px+27,py-53+gait);ctx.lineTo(px+34,py-56+gait);
   ctx.moveTo(px+26,py-49+gait);ctx.lineTo(px+34,py-48+gait);ctx.stroke();
   ctx.fillStyle='#1c2933';ctx.fillRect(px+22,py-32+gait,3,3);
 }
};
const drawCaveEntrance=(ctx,x,y,name)=>drawPremiumCave(ctx,x,y,name);
const drawOre=(ctx,x,y,o)=>drawPremiumRock(ctx,x,y,o.type);
const grass=(ctx,x,y)=>{ctx.fillStyle='#267d57';for(const dx of [-6,0,6])ctx.fillRect(x+dx,y-5+Math.abs(dx)/3,2,8);ctx.fillStyle='#dbd15f';ctx.fillRect(x-1,y-7,3,3);};
const house=(ctx,x,y,blue=false)=>drawPremiumHouse(ctx,x,y,blue);
const drawBridge=(ctx,x,y,built)=>drawPremiumBridge(ctx,x,y,built);

export function mountIsometricWorld(root,{getState,persist,onCraft,onExpeditions=()=>{},notify,onProgress=()=>{}}){
  root.innerHTML='<canvas class="adventure-canvas" aria-label="Mapa isométrico interactivo de Crafterra"></canvas>'+
    '<div class="adv-atmosphere" aria-hidden="true"></div>'+
    '<div class="adventure-hud"><b id="adv-region">VALLE DEL ORIGEN</b><small id="adv-objective"></small></div>'+
    '<div class="adventure-inventory" id="adv-inventory" aria-label="Recursos actuales"></div>'+
    '<div class="adventure-tool" id="adv-tool"></div>'+
    '<div class="adventure-work" id="adv-work" hidden><div class="adv-work-row"><span id="adv-work-art">'+actionArt('pick','sm')+'</span><div class="adv-work-copy"><b id="adv-work-label">Trabajando...</b><small>TOCA EL GOLPE PARA ACELERAR</small></div></div>'+
      '<div class="adventure-work-track"><span id="adv-work-bar"></span></div>'+
      '<button type="button" id="adv-strike" class="adv-strike" aria-label="Dar un golpe de trabajo">'+actionArt('hammer','sm')+'<span>¡GOLPEA!</span></button></div>'+
    '<button id="adv-recenter" class="adv-recenter" type="button" aria-label="Centrar la cámara en el personaje" hidden><span aria-hidden="true">◎</span><b>CENTRAR</b></button>'+
    '<div class="adventure-bottom"><div class="adventure-dpad" aria-label="Controles de movimiento">'+
    '<button class="adv-up" type="button" aria-label="Mover arriba" data-dir="-1,-1">▲</button>'+
    '<button class="adv-left" type="button" aria-label="Mover izquierda" data-dir="-1,1">◀</button><button class="adv-down" type="button" aria-label="Mover abajo" data-dir="1,1">▼</button><button class="adv-right" type="button" aria-label="Mover derecha" data-dir="1,-1">▶</button>'+
    '</div><button id="adv-interact" type="button" class="adventure-action">'+actionArt('shield','sm')+'<span>ACCIÓN</span></button>'+
    '<button id="adv-workshop" type="button" class="adventure-craft">'+actionArt('hammer','sm')+'<span>CREAR</span></button>'+
    '<button id="adv-expeditions" type="button" class="adventure-expeditions" aria-expanded="false" aria-controls="expeditionPanel">'+actionArt('tent','sm')+'<span>EXPEDICIONES</span><i class="exp-notice" aria-hidden="true">!</i></button></div>'+
    '<div class="adventure-dialog" role="dialog" aria-label="Acciones del mundo" hidden>'+
      '<div class="adv-dialog-top"><span>CRAFTERRA · ACCIONES</span><button id="adv-dismiss" type="button" aria-label="Cerrar menú">×</button></div>'+
      '<div class="adv-dialog-heading"><span id="adv-dialog-emblem">'+actionArt('gem','lg')+'</span><div><h3 id="adv-speaker"></h3><p id="adv-dialog-text"></p></div></div>'+
      '<div id="adv-dialog-actions" class="adv-dialog-grid"></div></div>'+
    '<div class="adventure-hint" id="adv-tip">TOCA LOS OBJETOS DEL MUNDO PARA INTERACTUAR</div>';
  const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx){notify('No se pudo iniciar la vista gráfica.');return{refresh(){}};}
  const el=q=>root.querySelector(q);
  let player={x:9,y:10},path=[],pending=null,cam={x:0,y:0},last=0,step=0,frameCount=0,dialogOpen=false,loaded=false,w=480,h=300,harvest=null,walkPhase=0,facing=1,held=null,workPhase=0,lastStrike=0,fx=[];
  let lastDrawAt=0,lastFaultAt=-Infinity,renderFailures=0,currentDpr=1;
  const floorCache=new Map();let floorCacheRevision=-1;
  const actors=WORLD_NPCS.map(n=>({...n,homeX:n.x,homeY:n.y,phase:0,facing:1,idle:0,steps:[]}));
  const state=()=>getState();
  const cameraPan=createCameraPan({
    getCamera:()=>cam,
    setCamera:next=>{cam.x=next.x;cam.y=next.y;},
    getViewport:()=>({width:w,height:h,rect:canvas.getBoundingClientRect()}),
    getBounds:()=>adventure().scene?{width:11,height:9}:WORLD_SIZE,
    onStart:()=>{
      // A gesture on the landscape is not a movement command.
      path=[];pending=null;held=null;
    },
    onPan:()=>{lastDrawAt=-Infinity;},
    onMode:free=>{
      el('#adv-recenter').hidden=!free;
      canvas.classList.toggle('camera-free',free);
    }
  });

  function adventure(){
    const s=state();
    if(!s.adventure||typeof s.adventure!=='object')s.adventure={x:9,y:10,metMara:false,bridge:false,completed:false,gathered:{}};
    const a=s.adventure;
    if(!a.gathered||typeof a.gathered!=='object')a.gathered={};
    if(!a.roomPositions||typeof a.roomPositions!=='object')a.roomPositions={};
    if(a.scene&&!HOUSE_ROOMS[a.scene])a.scene=null;
    if(!Number.isFinite(a.x)||!Number.isFinite(a.y)||!isWalkable(Math.round(a.x),Math.round(a.y),!!a.bridge,a.gathered)){a.x=9;a.y=10;}
    return a;
  }
  function loadPosition(){if(loaded)return;const a=adventure();player=a.scene?{...(a.roomPositions[a.scene]||{x:5,y:6})}:{x:a.x,y:a.y};cam={x:(player.x-player.y)*TW/2,y:(player.x+player.y)*TH/2};loaded=true;noteRuntimeScene(a.scene||'valley');}
  function savePosition(){const a=adventure();if(a.scene)a.roomPositions[a.scene]={...player};else{a.x=player.x;a.y=player.y;}persist();}
  function project(x,y){return{x:(x-y)*TW/2-cam.x+w/2,y:(x+y)*TH/2-cam.y+h*.53};}
  function screenToTile(sx,sy){const ix=sx-w/2+cam.x,iy=sy-h*.53+cam.y;return{x:Math.round(ix/TW+iy/TH),y:Math.round(iy/TH-ix/TW)};}
function available(node){return nodeAvailable(state(),node,Date.now());}
  function riverNode(y,side=player.x<15?14:16){
    return {id:'rio_'+side+'_'+y,x:side,y,type:'water',kind:'node',qty:1,label:'Agua del río'};
  }
  function entities(){
    const scene=adventure().scene;
    if(scene)return [
      ...ROOM_OBJECTS[scene].map(x=>({...x})),
      ...(CAVE_NODES[scene]||[]).filter(available).map(n=>({...n,kind:'node'}))
    ];
    return [
      ...actors.map(n=>({...n,kind:'npc'})),
      ...WORLD_NODES.filter(available).map(n=>({...n,kind:'node'})),
      ...WORLD_TREES.filter(available).map(n=>({...n,kind:'node'})),
      ...WORLD_ANIMALS.filter(available).map(n=>({...n,kind:'node'})),
      ...CAVE_ENTRANCES,
      ...WORLD_HOUSES,
      ...WORLD_WORKSTATIONS,
      WORLD_CAMPFIRE,
      {id:'puente',x:14,y:10,kind:'bridge'},
      ...(Math.abs(player.x-15)<3?[riverNode(Math.min(20,Math.max(1,Math.round(player.y))))]:[])
    ];
  }
  function near(e){return Math.hypot(player.x-e.x,player.y-e.y)<=1.65;}
  function nearby(){return entities().map(e=>({...e,d:Math.hypot(player.x-e.x,player.y-e.y)})).sort((a,b)=>a.d-b.d)[0];}
  function updateHud(){
    const a=adventure(),s=state(),scene=a.scene,region=scene?HOUSE_ROOMS[scene].name:biomeLabel(Math.round(player.x),Math.round(player.y)).toUpperCase();
    const heading=el('#adv-region');
    if(heading.textContent!==region)heading.textContent=region;
    const goal=scene?'EXPLORA EL INTERIOR':a.completed?((s.stock?.iron_pickaxe||0)>0?'FORJA DOMINADA · EXPLORA':'META: FORJAR PICO DE HIERRO'):!a.metMara?'BUSCA A MARA':!a.bridge?'REPARA EL PUENTE':'HABLA CON LÍA';
    if(el('#adv-objective').textContent!==goal)el('#adv-objective').textContent=goal;
    const get=id=>Math.max(0,Number(s.stock?.[id]||0));
    const resources=[['log','wood',get('wood')],['log','rough_wood',get('rough_wood')],['bowl','water',get('water')],
                     ['stone','stone',get('stone')],['basket','fiber',get('plant_fiber')],['ingot','iron',get('iron_ingot')]];
    const signature=resources.map(r=>r[2]).join('|');
    const inv=el('#adv-inventory');
    if(inv.dataset.signature!==signature){
      inv.dataset.signature=signature;
      inv.innerHTML=resources.map(r=>'<span class="adv-resource" title="'+r[1]+'">'+actionArt(r[0],'xs')+'<b>'+r[2]+'</b></span>').join('');
    }
    const gather=gatheringPlan(s,'wood'),mine=gatheringPlan(s,'stone');
    const toolText=(gather.tool?gather.remaining+'/'+gather.max:'MANOS')+' · '+(mine.tool?mine.remaining+'/'+mine.max:'MANOS');
    const tool=el('#adv-tool');
    if(tool.dataset.signature!==toolText){
      tool.dataset.signature=toolText;
      tool.innerHTML='<span>'+actionArt('axe','xs')+'<b>'+(gather.tool?gather.remaining+'/'+gather.max:'MANOS')+'</b></span>'+
                     '<span>'+actionArt('pick','xs')+'<b>'+(mine.tool?mine.remaining+'/'+mine.max:'MANOS')+'</b></span>';
    }
    const nearbyEntity=nearby();
    const kind=nearbyEntity&&nearbyEntity.d<2.2?(nearbyEntity.kind==='npc'?'shield':
      nearbyEntity.kind==='house'||nearbyEntity.kind==='cave'||nearbyEntity.kind==='exit'?'door':
      nearbyEntity.kind==='workshop'?(nearbyEntity.station==='stonework'?'stone':'forge'):
      nearbyEntity.kind==='fire'?'fire':nearbyEntity.kind==='station'?actionKind(nearbyEntity.id):
      nearbyEntity.kind==='bridge'?'shield':nearbyEntity.type==='animal'?nearbyEntity.species:actionKind(nearbyEntity.type,nearbyEntity.label||'')):'gem';
    const label=nearbyEntity&&nearbyEntity.d<2.2?(nearbyEntity.kind==='npc'?'HABLAR':
      nearbyEntity.kind==='house'||nearbyEntity.kind==='cave'?'ENTRAR':nearbyEntity.kind==='exit'?'SALIR':
      nearbyEntity.kind==='workshop'||nearbyEntity.kind==='station'?'USAR':
      nearbyEntity.kind==='fire'?'FOGATA':nearbyEntity.kind==='bridge'?'PUENTE':
      nearbyEntity.type==='animal'?(nearbyEntity.species==='sheep'?'LANA':'CAZAR'):
      nearbyEntity.type==='water'?'AGUA':nearbyEntity.type==='wood'?'CORTAR':
      nearbyEntity.type==='plant_fiber'?'RECOGER':'EXTRAER'):'EXPLORAR';
    const btn=el('#adv-interact');
    if(btn.dataset.signature!==kind+'|'+label){
      btn.dataset.signature=kind+'|'+label;
      btn.innerHTML=actionArt(kind,'sm')+'<span>'+label+'</span>';
    }
    const tip=scene?.startsWith('cave_')?'PICA VETAS Y REGRESA POR LA SALIDA':scene?'TOCA UNA ESTACIÓN O LA PUERTA':
      'PRADERAS: FIBRAS Y FAUNA · SIERRAS: ROCA Y VETAS';
    if(el('#adv-tip').textContent!==tip)el('#adv-tip').textContent=tip;
  }

  function closeDialog(){
    el('.adventure-dialog').hidden=true;
    dialogOpen=false;
    root.classList.remove('adv-menu-open');
  }
  function showDialog(name,message,buttons=[{label:'Continuar',action:'close'}]){
    dialogOpen=true;path=[];pending=null;harvest=null;
    el('#adv-work').hidden=true;
    root.classList.add('adv-menu-open');
    el('#adv-speaker').textContent=name;
    el('#adv-dialog-text').textContent=message;
    const title=String(name||'').toLowerCase();
    const art=title.includes('canter')?'stone':title.includes('horno')||title.includes('forja')?'forge':
       title.includes('pino')||title.includes('roble')?'log':title.includes('veta')?'pick':
       title.includes('casa')?'door':title.includes('río')?'bowl':actionKind('',name);
    el('#adv-dialog-emblem').innerHTML=actionArt(art,'lg');
    const actions=el('#adv-dialog-actions');
    actions.replaceChildren();
    buttons.forEach(b=>{
      const secondary=b.secondary===true||b.action==='close'||/^(salir|cancelar|volver|continuar|quedarme)/i.test(b.label||'');
      const button=document.createElement('button');
      button.type='button';
      button.className='adv-choice'+(secondary?' adv-choice-secondary':'');
      button.disabled=b.enabled===false;
      const graphic=document.createElement('span');
      graphic.className='adv-choice-graphic';
      graphic.innerHTML=actionArt(b.art||actionKind(b.id||'',b.title||b.label),'md');
      const text=document.createElement('span');
      text.className='adv-choice-copy';
      const titleEl=document.createElement('strong');
      titleEl.className='adv-choice-title';
      titleEl.textContent=String(b.title||b.label||'Continuar').replace(/^[^\p{L}\p{N}]+/u,'').replace(/\s+[·—]\s+\d+(?:\.\d+)?\s*s$/i,'').split(' — ')[0];
      text.append(titleEl);
      if(b.detail||b.need){
        const detail=document.createElement('small');
        detail.className='adv-choice-detail';
        detail.textContent=b.enabled===false?(b.need||b.detail):(b.detail||'');
        text.append(detail);
      }
      button.append(graphic,text);
      button.setAttribute('aria-label',(b.title||b.label||'Acción')+(b.need?' · '+b.need:''));
      button.addEventListener('click',()=>{
        closeDialog();
        if(b.action==='craft')onCraft();
        if(b.action==='repair')repair();
        if(typeof b.run==='function')b.run();
      });
      actions.append(button);
    });
    el('.adventure-dialog').hidden=false;
  }

  function repair(){
    const a=adventure(),s=state();
    if(a.bridge){showDialog('Puente del río','El puente ya está reparado. ¡Puedes cruzarlo!');return;}
    if(!a.metMara){showDialog('Puente derrumbado','Primero habla con Mara. Parece que conoce la historia de este puente.');return;}
    if((s.stock?.plank||0)<2||(s.stock?.rope||0)<1){
      showDialog('Puente derrumbado','Faltan materiales: necesitas 2 tablones y 1 cuerda. Recoge madera, piedra y fibras, y descubre las recetas en el Taller.',[{label:'Abrir taller',action:'craft'},{label:'Seguir explorando',action:'close'}]);return;
    }
    s.stock.plank-=2;s.stock.rope-=1;
    a.bridge=true;s.coins=(Number(s.coins)||0)+120;
    persist();onProgress();updateHud();notify('¡Puente reparado! +120 monedas');
    showDialog('Misión completada','¡Has reparado el puente! Cruza a la otra orilla y busca a Lía, la inventora.');
  }
function enterRoom(id){
    const a=adventure();
    if(!HOUSE_ROOMS[id])return;
    a.x=player.x;a.y=player.y;a.scene=id;
    player={...(a.roomPositions[id]||{x:5,y:6})};
    path=[];pending=null;harvest=null;held=null;
    el('#adv-work').hidden=true;
    cam={x:(player.x-player.y)*TW/2,y:(player.x+player.y)*TH/2};
    cameraPan.recenter();
    savePosition();noteRuntimeScene(id);updateHud();notify('Has entrado en '+HOUSE_ROOMS[id].name);
  }
  function leaveRoom(){
    const a=adventure();
    a.roomPositions[a.scene]={...player};a.scene=null;
    player={x:a.x,y:a.y};path=[];pending=null;harvest=null;held=null;
    cam={x:(player.x-player.y)*TW/2,y:(player.x+player.y)*TH/2};
    cameraPan.recenter();
    savePosition();noteRuntimeScene('valley');updateHud();notify('Has salido al Valle del Origen');
  }
  function activateWork(label,ms,kind){
    const work=el('#adv-work');
    work.hidden=false;
    work.dataset.kind=kind;
    el('#adv-work-label').textContent=label;
    el('#adv-work-art').innerHTML=actionArt(kind,'sm');
    el('#adv-strike').innerHTML=actionArt(kind,'sm')+'<span>¡GOLPEA!</span>';
    el('#adv-work-bar').style.width='0%';
    lastStrike=0;
    workPhase=0;
  }
  function beginWork(e,option){
    if(!option?.enabled){notify(option?.need||'No puedes hacerlo todavía');return;}
    if(!available(e))return;
    harvest={node:e,actionId:option.id,elapsed:0,ms:option.ms,plan:option};
    path=[];pending=null;
    const kind=e.type==='animal'?e.species:option.id==='mine'?'pick':option.id==='hit'?'log':actionKind(option.id,option.label);
    activateWork(option.label,option.ms,kind);
    updateHud();
  }
  // Menús en dos niveles: evita enormes listas de procesos en una pantalla móvil.
  function showStationMenu(kind,fireId,title,group=null,node=null){
    const s=state(),opts=stationOptions(s,kind,fireId);
    const heat=kind==='fire'||kind==='foundry'?heatOf(s,fireId):null;
    const sections={
      foundry:[['fuel','Combustible','fire'],['smelt','Fundir metales','ingot'],['forge','Forjar herramientas','hammer']],
      stonework:[['stone','Tallar y montar','stone'],['ore','Preparar minerales','pick']]
    };
    const describe=kind==='fire'?'La hoguera almacena calor sin consumirse. Alimenta el fuego antes de cocinar.':
      kind==='sawmill'?'Madera tosca: trabaja 2 piezas a mano o una con sierra reutilizable.':
      kind==='stonework'?'La mesa de cantería transforma piedra bruta y prepara minerales para fundir.':
      'Horno comunitario: el combustible aporta calor, los minerales preparados se funden en lingotes y después pueden forjarse herramientas.';
    if(!group&&sections[kind]){
      showDialog(title,describe+(heat===null?'':'\n♨️ Calor '+heat+'/'+MAX_FIRE_HEAT),[
        ...sections[kind].map(([k,label,art])=>({
          label,title:label,art,detail:k==='fuel'?'ALIMENTAR':k==='smelt'?'LINGOTES Y ALEACIONES':k==='forge'?'HERRAMIENTAS DE HIERRO':k==='stone'?'PIEDRA Y PICOS':'VETAS Y CONCENTRADOS',
          run:()=>showStationMenu(kind,fireId,title,k,node)
        })),
        {label:'Salir',action:'close',art:'door',secondary:true}
      ]);
      return;
    }
    const displayed=group?opts.filter(o=>group==='fuel'?o.kind==='fuel':o.group===group):opts;
    showDialog(title,describe+(heat===null?'':'\n♨️ Calor '+heat+'/'+MAX_FIRE_HEAT),[
      ...displayed.map(o=>({
        id:o.id,title:o.label,art:o.kind==='fuel'?actionKind(o.fuel,o.label):actionKind(o.id,o.label),
        label:o.label,
        detail:o.enabled?(o.kind==='fuel'?'+'+o.gain+' CALOR':(o.ms/1000).toFixed(1)+' S · ELABORAR'):o.reason,
        enabled:o.enabled,
        need:o.reason,
        run:()=>{
          if(o.kind==='fuel'){
            const result=runStationProcess(state(),kind,o.id,fireId);
            if(result.ok){persist();onProgress();updateHud();notify(result.message);}
            else notify(result.reason||'No se pudo añadir combustible');
            showStationMenu(kind,fireId,title,group,node);
            return;
          }
          // La transformación consume tiempo: solo se cobra y entrega al completarla.
          harvest={kind:'station',node:node||{x:player.x,y:player.y},station:kind,actionId:o.id,
                   fireId,elapsed:0,ms:o.ms||1200,group,title};
          path=[];pending=null;
          activateWork(o.label,o.ms||1200,actionKind(o.id,o.label));
        }
      })),
      {label:sections[kind]?'Volver':'Cerrar',art:'door',secondary:true,run:sections[kind]?()=>showStationMenu(kind,fireId,title,null,node):null}
    ]);
  }
  function roomStation(e){
    const a=adventure(),s=state();
    if(e.id==='workbench'){onCraft();return;}
    if(e.id==='hearth'){showStationMenu('fire','house_mara','🔥 Hogar de Mara',null,e);return;}
    if(e.id==='sawmill'){showStationMenu('sawmill','house_lia','🪚 Banco de carpintería',null,e);return;}
    if(e.id==='tannery'){showStationMenu('tannery','house_lia','Curtiduría de Lía',null,e);return;}
    const r=performRoomAction(s,a.scene,e.id);
    if(r.ok){persist();onProgress();updateHud();}
    showDialog(e.label,r.ok?r.message:r.reason);
  }
  function interact(e){
    if(!e||!near(e))return;
    const a=adventure(),s=state();
    if(a.scene){
      if(e.kind==='exit'){leaveRoom();return;}
      if(e.kind==='station'){roomStation(e);return;}
      if(e.kind!=='node')return;
    }
    if(e.kind==='house'||e.kind==='cave'){
      showDialog(e.label,e.kind==='cave'?'La entrada lleva a galerías subterráneas con piedra y minerales.':'La puerta está abierta. Dentro encontrarás estaciones y tareas diferentes.',[
        {label:'🚪 Entrar',run:()=>enterRoom(e.id)},
        {label:'Quedarme fuera',action:'close'}]);
      return;
    }
    if(e.kind==='fire'){showStationMenu('fire','valley','🔥 Hoguera del valle',null,e);return;}
    if(e.kind==='workshop'){showStationMenu(e.station,e.id,e.label,null,e);return;}
    if(e.kind==='bridge'){repair();return;}
    if(e.kind==='node'){
      if(!available(e)||harvest)return;
      const options=availableActions(s,e);
      if(!options.length)return;
      const name=e.type==='wood'?(TREE_SPECIES[e.species]||TREE_SPECIES.pine).label:
        e.type==='animal'?ANIMAL_SPECIES[e.species]?.name||'Animal':
        e.type==='water'?'Orilla del río':e.type==='stone'?'Roca':e.type==='plant_fiber'?'Planta fibrosa':
        e.type==='berries'?'Arbusto de bayas':e.type==='herbs'?'Hierbas silvestres':e.type==='mushroom'?'Setas de bosque':
        'Veta de '+({iron:'hierro',copper:'cobre',tin:'estaño',coal:'carbón',quartz:'cuarzo',silver:'plata',gold:'oro'}[e.type]||e.type);
      showDialog(name,e.type==='water'?'Necesitas un cuenco de madera o arcilla. El recipiente se conserva después de llenarlo.':
        e.type==='wood'?'Cortar con hacha produce madera, golpearlo da madera tosca.':
        e.type==='animal'?(e.species==='sheep'?'Obtén lana sin lastimar a la oveja. Las tijeras aprovechan mejor el vellón.':'La caza requiere tiempo y herramienta; obtendrás carne y piel cruda.'):
        'Selecciona cómo quieres obtener el recurso.',[
        ...options.map(o=>({
          id:o.id,title:o.label,label:o.label,art:e.type==='animal'?e.species:o.id==='mine'?'pick':o.id==='hit'?'log':actionKind(o.id,o.label),
          detail:o.enabled?(o.ms/1000).toFixed(1)+' S'+(o.tool?' · CON HERRAMIENTA':' · A MANO'):o.need,
          enabled:o.enabled,need:o.need,run:()=>beginWork(e,o)
        })),
        {label:'Cancelar',action:'close'}]);
      return;
    }
    if(e.id==='mara'){
      if(!a.metMara){a.metMara=true;persist();onProgress();}
      showDialog('Mara · Habitante de la aldea',a.bridge?'¡Qué maravilla! Gracias a ti hemos recuperado el camino. Busca a Lía al otro lado del río.':'Nuestro puente cayó durante la última tormenta. Necesitamos a alguien que sepa fabricar. Consigue 2 tablones y 1 cuerda para repararlo. ¡El Taller sigue abierto!', [{label:'Ir al taller',action:'craft'},{label:'Voy a explorar',action:'close'}]);return;
    }
    if(e.id==='taro'){showDialog('Taro · Guardabosques',a.bridge?'¡Buen trabajo! El bosque oriental vuelve a estar conectado con la aldea.':'Aquí todo tiene un uso. Puedes cortar pinos y robles con hacha, o golpearlos para conseguir madera tosca. Para recoger agua fabrica un cuenco y acércate al río. Los minerales necesitan un pico.');return;}
    if(e.id==='lia'){
      if(!a.bridge){showDialog('Lía · Inventora','¿Cómo has llegado hasta aquí? El puente del valle sigue sin reparar.');return;}
      if(!a.completed){a.completed=true;s.coins=(Number(s.coins)||0)+250;persist();onProgress();notify('Capítulo 1 completado · +250 monedas');}
      showDialog('Lía · Inventora','¡Has devuelto la conexión al valle! Encontré planos de máquinas de una civilización olvidada. Esta será nuestra próxima aventura: recuperar sus conocimientos.');return;
    }
  }

function roomWalkable(x,y){
    const room=adventure().scene;
    return x>=1&&x<=9&&y>=1&&y<=7&&!ROOM_OBJECTS[room].some(o=>o.kind==='station'&&o.x===x&&o.y===y)
      &&!(CAVE_NODES[room]||[]).some(n=>n.x===x&&n.y===y&&available(n));
  }
  function roomPath(from,to){
    const start=[Math.round(from.x),Math.round(from.y)],goal=[Math.round(to.x),Math.round(to.y)],k=(x,y)=>x+','+y;
    if(!roomWalkable(...goal))return [];
    const queue=[start],prev=new Map([[k(...start),null]]);
    for(let i=0;i<queue.length;i++){
      const [x,y]=queue[i];if(x===goal[0]&&y===goal[1])break;
      for(const [dx,dy]of[[1,0],[0,1],[-1,0],[0,-1]]){
        const nx=x+dx,ny=y+dy,key=k(nx,ny);
        if(roomWalkable(nx,ny)&&!prev.has(key)){prev.set(key,[x,y]);queue.push([nx,ny]);}
      }
    }
    let key=k(...goal);if(!prev.has(key))return [];
    const route=[];while(prev.get(key)){const [x,y]=key.split(',').map(Number);route.unshift({x,y});key=k(...prev.get(key));}
    return route;
  }
  function pathTo(x,y){
    return adventure().scene?roomPath(player,{x,y}):findPath(player,{x,y},adventure().bridge,adventure().gathered);
  }
  function moveTo(x,y,pick=null){
    if(dialogOpen)return;
    harvest=null;el('#adv-work').hidden=true;
    const indoors=!!adventure().scene;
    x=clamp(Math.round(x),1,indoors?9:WORLD_SIZE.width-2);
    y=clamp(Math.round(y),1,indoors?7:WORLD_SIZE.height-2);
    let target={x,y},route=[];
    if(pick){
      const around=[[0,-1],[1,0],[-1,0],[0,1],[1,1],[-1,-1],[1,-1],[-1,1]]
       .map(([dx,dy])=>({x:x+dx,y:y+dy}))
       .filter(p=>indoors?roomWalkable(p.x,p.y):isWalkable(p.x,p.y,adventure().bridge,adventure().gathered));
      // Elige la casilla libre accesible más cercana a la interacción.
      const choices=around.map(p=>({p,route:pathTo(p.x,p.y)}))
       .filter(o=>o.route.length||Math.hypot(o.p.x-player.x,o.p.y-player.y)<.38)
       .sort((a,b)=>a.route.length-b.route.length);
      if(!choices.length){notify('No puedes acercarte desde aquí.');return;}
      target=choices[0].p;route=choices[0].route;
    }else route=pathTo(x,y);
    if(!route.length&&Math.hypot(target.x-player.x,target.y-player.y)>.38){
      notify('No hay camino. Quizá debas construir algo.');return;
    }
    path=route;pending=pick;
    if(!path.length&&pending){const t=pending;pending=null;interact(t);}
  }
  function stepDir(dx,dy){
    if(dialogOpen)return;
    harvest=null;el('#adv-work').hidden=true;
    if(path.length)return;
    pending=null;
    const x=Math.round(player.x)+dx,y=Math.round(player.y)+dy;
    if(adventure().scene?roomWalkable(x,y):isWalkable(x,y,adventure().bridge,adventure().gathered))path=[{x,y}];
  }
  function walkNPCs(dt){
    if(dialogOpen||adventure().scene)return;
    for(const n of actors){
      if(Math.hypot(player.x-n.x,player.y-n.y)<2.5){n.idle=1.3;n.steps=[];n.phase=0;continue;}
      if(n.steps.length){
        const v=n.steps[0],dist=Math.hypot(v.x-n.x,v.y-n.y),speed=dt*1.15;
        if(dist<speed){n.x=v.x;n.y=v.y;n.steps.shift();if(!n.steps.length)n.idle=1.7+Math.random()*3;}
        else{const vx=(v.x-n.x)/dist,vy=(v.y-n.y)/dist;n.x+=vx*speed;n.y+=vy*speed;n.facing=vx-vy>=0?1:-1;n.phase+=speed*10;}
      }else{
        n.phase=0;n.idle-=dt;
        if(n.idle<=0){
          const candidates=[[0,1],[0,-1],[1,0],[-1,0]].map(([dx,dy])=>({x:Math.round(n.x)+dx,y:Math.round(n.y)+dy}))
          .filter(v=>Math.hypot(v.x-n.homeX,v.y-n.homeY)<=2&&isWalkable(v.x,v.y,adventure().bridge,adventure().gathered));
          if(candidates.length)n.steps=[candidates[Math.floor(Math.random()*candidates.length)]];
          n.idle=2+Math.random()*3;
        }
      }
    }
  }
  function impact(node,kind='stone',power=1){
    const p=project(node?.x??player.x,node?.y??player.y);
    const palette=kind==='fire'||kind==='ingot'||kind==='hammer'?['#ffe9a1','#f9b66d','#fffdf1']:
      kind==='log'||kind==='axe'?['#c5ed9e','#e8b677','#fff5c7']:
      kind==='bowl'?['#80f5ee','#c7ffff','#67bfd9']:
      ['#dce9f1','#a6c7d5','#ffecb7'];
    for(let n=0;n<5+power*3;n++){
      const a=Math.PI*2*n/(5+power*3)+Math.random()*.5,speed=(18+Math.random()*45)*power;
      fx.push({x:p.x+(Math.random()-.5)*18,y:p.y-20+(Math.random()-.5)*10,
        vx:Math.cos(a)*speed,vy:-25+Math.sin(a)*speed,life:.38+Math.random()*.25,
        max:.55,size:2+Math.random()*2,color:palette[n%palette.length]});
    }
    if(fx.length>90)fx.splice(0,fx.length-90);
  }
  function tickEffects(dt){
    for(const p of fx){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=96*dt;p.life-=dt;}
    fx=fx.filter(p=>p.life>0);
  }
  function paintEffects(){
    if(harvest){
      const h=harvest,p=project(h.node.x,h.node.y);
      const completion=Math.min(1,h.elapsed/h.ms);
      ctx.save();
      ctx.translate(p.x,p.y-17);
      ctx.strokeStyle='#0c2738c0';ctx.lineWidth=6;
      ctx.beginPath();ctx.arc(0,0,23,-Math.PI/2,Math.PI*1.5);ctx.stroke();
      ctx.strokeStyle=h.kind==='station'?'#ffcb78':'#a7f4c0';
      ctx.lineWidth=4;
      ctx.beginPath();ctx.arc(0,0,23,-Math.PI/2,-Math.PI/2+Math.PI*2*completion);ctx.stroke();
      const swing=Math.sin(workPhase*1.6);
      ctx.rotate(swing*.45);
      ctx.strokeStyle='#f3d2a1';ctx.lineWidth=5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(-8,-22);ctx.lineTo(7,-38);ctx.stroke();
      ctx.fillStyle=h.kind==='station'?'#f8b45e':'#d5eaf0';
      ctx.fillRect(2,-41,18,9);
      ctx.restore();
    }
    for(const p of fx){
      ctx.globalAlpha=Math.min(1,p.life/.23);
      ctx.fillStyle=p.color;
      ctx.fillRect(Math.round(p.x),Math.round(p.y),Math.round(p.size),Math.round(p.size));
    }
    ctx.globalAlpha=1;
  }
function tickGather(dt){
    if(!harvest)return;
    const h=harvest;
    if(!near(h.node)||(h.kind!=='station'&&!available(h.node))){
      harvest=null;el('#adv-work').hidden=true;return;
    }
    h.elapsed+=dt*1000;
    workPhase+=dt*11;
    h.impactClock=(h.impactClock||0)+dt;
    if(h.impactClock>=.55){h.impactClock=0;impact(h.node,el('#adv-work').dataset.kind,1);}
    el('#adv-work-bar').style.width=Math.min(100,100*h.elapsed/h.ms)+'%';
    if(h.elapsed<h.ms)return;
    harvest=null;el('#adv-work').hidden=true;
    impact(h.node,el('#adv-work').dataset.kind,2);
    if(h.kind==='station'){
      // Revalidación atómica: no se gasta calor ni herramienta hasta terminar.
      const result=runStationProcess(state(),h.station,h.actionId,h.fireId,Date.now());
      if(!result.ok){notify(result.reason||'El trabajo no pudo completarse');return;}
      savePosition();onProgress();updateHud();
      notify('✓ '+result.message);
      return;
    }
    const result=completeWorldAction(state(),h.node,h.actionId,Date.now());
    if(!result.ok){notify(result.reason);return;}
    savePosition();onProgress();
    const names={wood:'madera',rough_wood:'madera tosca',stone:'piedra',plant_fiber:'fibra',water:'agua',
      iron:'hierro',copper:'cobre',tin:'estaño',coal:'carbón',quartz:'cuarzo',silver:'plata',gold:'oro',resin:'resina'};
    const earned=Object.entries(result.received).map(([id,q])=>'+'+q+' '+(names[id]||id)).join(' · ');
    notify(earned+(result.wear?.broken?' · herramienta agotada':''));
    updateHud();
  }
function worldObjects(){
    const scene=adventure().scene;
    if(scene)return [
      ...ROOM_OBJECTS[scene].map(o=>({...o,kind:o.kind})),
      ...(CAVE_NODES[scene]||[]).filter(available).map(n=>({...n,kind:'resource'})),
      {kind:'player',x:player.x,y:player.y}
    ].sort((a,b)=>(a.x+a.y)-(b.x+b.y));
    const objects=[];
    for(const n of [...WORLD_TREES,...WORLD_NODES,...WORLD_ANIMALS])if(available(n))objects.push({...n,kind:'resource'});
    objects.push(...WORLD_HOUSES,...WORLD_WORKSTATIONS,...CAVE_ENTRANCES,WORLD_CAMPFIRE);
    for(const n of actors)objects.push({...n,kind:'npc'});
    objects.push({kind:'bridgeart',x:15,y:10},{kind:'player',x:player.x,y:player.y});
    return objects.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
  }
  // Precompose each indoor floor only once per room and texture revision.
  // Before this change a stationary workshop painted 99 textured tiles every
  // frame, even though only the player and interactive workstations changed.
  function getRoomFloor(scene){
    const revision=terrainTextureRevision();
    if(floorCacheRevision!==revision){floorCache.clear();floorCacheRevision=revision;}
    if(floorCache.has(scene))return floorCache.get(scene);
    const layer=document.createElement('canvas');layer.width=560;layer.height=285;
    const g=layer.getContext('2d',{alpha:true});
    if(!g)return null;
    g.imageSmoothingEnabled=false;
    const cave=!!CAVE_NODES[scene],home=scene==='house_mara';
    for(let y=0;y<=8;y++)for(let x=0;x<=10;x++){
      const px=(x-y)*TW/2+270,py=(x+y)*TH/2+24;
      drawTerrainTile(g,px,py,cave?'cave':home?'cottage':'workshop',x+(cave?39:21),y+(cave?17:9));
      if(cave&&(x===0||y===0||x===10||y===8)){
        g.fillStyle='#293b49';g.fillRect(Math.round(px-18),Math.round(py-18),36,9);
        g.fillStyle='#64747b';g.fillRect(Math.round(px-18),Math.round(py-19),36,3);
        g.fillStyle='#9ca9a2';g.fillRect(Math.round(px-14),Math.round(py-21),10,2);
      }
    }
    floorCache.set(scene,layer);
    return layer;
  }
  function paintRoomFloor(scene){
    const layer=getRoomFloor(scene);
    if(layer){
      ctx.drawImage(layer,Math.round(w/2-cam.x-270),Math.round(h*.53-cam.y-24));
    }
  }
  function drawInside(scene){
    if(CAVE_NODES[scene]){
      ctx.fillStyle='#101f2b';ctx.fillRect(0,0,w,h);
      paintRoomFloor(scene);
      for(const o of worldObjects()){
        const p=project(o.x,o.y);
        drawContactShadow(ctx,p.x,p.y,o.kind==='resource'?'stone':o.kind==='player'?'player':'cave');
        if(o.kind==='player'){sprite(ctx,p.x,p.y,'avatar',harvest?workPhase:walkPhase,facing);continue;}
        if(o.kind==='resource'){
          drawOre(ctx,p.x,p.y,o);
          ctx.fillStyle='#f6db9e';ctx.fillRect(p.x-2,p.y-28,5,5);
        }else if(o.kind==='exit'){
          ctx.fillStyle='#283e45';ctx.fillRect(p.x-21,p.y-33,42,33);
          ctx.fillStyle='#dbbb83';ctx.fillRect(p.x-13,p.y-29,26,27);
          ctx.fillStyle='#2b4a50';ctx.fillRect(p.x-9,p.y-26,18,22);
          ctx.fillStyle='#f4e2ac';ctx.font='bold 10px system-ui';ctx.textAlign='center';
          ctx.fillText('SALIDA',p.x,p.y-42);
        }
      }
      return;
    }
    ctx.fillStyle=scene==='house_mara'?'#57483f':'#303f58';ctx.fillRect(0,0,w,h);
    const home=scene==='house_mara';
    paintRoomFloor(scene);
    for(const o of worldObjects()){
      const p=project(o.x,o.y);
      drawContactShadow(ctx,p.x,p.y,o.kind==='player'?'player':'workshop');
      if(o.kind==='player'){sprite(ctx,p.x,p.y,'avatar',harvest?workPhase:walkPhase,facing);continue;}
      const icon={exit:'🚪',bed:'🛏',pantry:'🧺',hearth:'🔥',workbench:'⚒',sawmill:'🪚',repair:'🔧',tannery:'🧵'}[o.id]||'⚙';
      ctx.fillStyle=o.kind==='exit'?'#486a52':home?'#78513a':'#3e6573';
      ctx.fillRect(p.x-18,p.y-22,36,21);
      ctx.fillStyle='#e2c597';ctx.fillRect(p.x-18,p.y-25,36,5);
      ctx.font='23px system-ui';ctx.textAlign='center';ctx.fillText(icon,p.x,p.y-29);
      ctx.fillStyle='#102e3de8';ctx.fillRect(p.x-37,p.y-65,74,17);
      ctx.font='bold 9px system-ui';ctx.fillStyle='#fff1cc';
      ctx.fillText(o.label,p.x,p.y-53,72);
    }
  }
  function draw(){
    ctx.fillStyle='#6ba4a3';ctx.fillRect(0,0,w,h);
    ctx.imageSmoothingEnabled=false;
    const a=adventure();
    if(a.scene){drawInside(a.scene);paintEffects();return;}
    for(let y=0;y<WORLD_SIZE.height;y++)for(let x=0;x<WORLD_SIZE.width;x++){
      const p=project(x,y);if(p.x<-TW||p.x>w+TW||p.y<-65||p.y>h+45)continue;
      const area=biomeAt(x,y);
      drawTerrainTile(ctx,p.x,p.y,area,x,y,x===14?-1:x===16?1:0);
    }
    for(const o of worldObjects()){
      const p=project(o.x,o.y);if(p.x<-80||p.x>w+80||p.y<-95||p.y>h+65)continue;
      const contact=o.kind==='resource'?(o.type==='wood'?'wood':o.type==='animal'?'animal':'stone'):o.kind;
      drawContactShadow(ctx,p.x,p.y,contact);
      if(o.kind==='workshop'){
        const furnace=o.station==='foundry',fuel=furnace?heatOf(state(),o.id):0;
        if(furnace)drawPremiumForge(ctx,p.x,p.y,fuel>0);
        else{
          drawPremiumRock(ctx,p.x,p.y,'stone');
          ctx.fillStyle='#c49c65';ctx.fillRect(p.x-18,p.y-31,35,6);
          ctx.fillStyle='#ead4a0';ctx.fillRect(p.x-15,p.y-35,29,6);
        }
        ctx.fillStyle='#fff2c0';ctx.textAlign='center';ctx.font='bold 9px system-ui';
        ctx.fillText(furnace?'⚒ FUNDICIÓN':'🪨 CANTERÍA',p.x,p.y-(furnace?65:44));
        if(furnace){ctx.font='bold 10px system-ui';ctx.fillText(fuel+'/'+MAX_FIRE_HEAT+' ♨',p.x,p.y-78);}
      }
      if(o.kind==='fire'){
        const fuel=heatOf(state(),'valley');
        ctx.fillStyle='#725443';ctx.fillRect(p.x-17,p.y-7,34,10);
        ctx.fillStyle='#8b9595';for(const dx of [-17,-8,5,14])ctx.fillRect(p.x+dx,p.y-6,6,5);
        ctx.fillStyle='#50391f';ctx.fillRect(p.x-11,p.y-11,22,7);
        if(fuel){ctx.fillStyle='#f8aa3e';ctx.fillRect(p.x-6,p.y-25,12,16);ctx.fillStyle='#fbed74';ctx.fillRect(p.x-2,p.y-19,6,11);}
        ctx.fillStyle='#fff6d1';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('🔥 '+fuel+'/'+MAX_FIRE_HEAT,p.x,p.y-32);
      }
      if(o.kind==='cave')drawCaveEntrance(ctx,p.x,p.y,o.label);
      if(o.kind==='house'){house(ctx,p.x,p.y,o.id==='house_lia');ctx.fillStyle='#fff1b5';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText(o.label,p.x,p.y-82);}
      if(o.kind==='bridgeart')drawBridge(ctx,p.x,p.y,a.bridge);
      if(o.kind==='resource'){
        if(o.type==='wood')tree(ctx,p.x,p.y,o.species,o.x*113+o.y*71);
        if(o.type==='stone')drawOre(ctx,p.x,p.y,o);
        if(o.type==='animal'){
          const last=state().adventure?.gathered?.[o.id],shorn=o.species==='sheep'&&!!last&&Date.now()-last<RESPAWN;
          drawAnimal(ctx,p.x,p.y,o.species,performance.now()/1000,shorn);
        }
        if(o.type==='plant_fiber')grass(ctx,p.x,p.y);
        if(o.type==='berries'||o.type==='herbs'||o.type==='mushroom'){
          grass(ctx,p.x,p.y);ctx.fillStyle=o.type==='berries'?'#ec6f83':o.type==='mushroom'?'#d6a486':'#c6dc87';
          ctx.fillRect(p.x-6,p.y-10,6,5);ctx.fillRect(p.x+5,p.y-7,5,4);
        }
        if(isOre(o))drawOre(ctx,p.x,p.y,o);
        ctx.fillStyle='#fff2ae';ctx.fillRect(p.x-3,p.y-(o.type==='wood'?57:o.type==='animal'?48:25),6,5);
      }
      if(o.kind==='npc'){
        sprite(ctx,p.x,p.y,o.palette,o.phase,o.facing);
        ctx.fillStyle='#102d39e8';ctx.fillRect(p.x-17,p.y-55,34,12);
        ctx.fillStyle='#fff4cd';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText(o.name,p.x,p.y-46);
        if(o.id==='mara'&&!a.metMara||o.id==='lia'&&a.bridge&&!a.completed){
          ctx.fillStyle='#fdd475';ctx.fillRect(p.x-3,p.y-69,6,10);
        }
      }
      if(o.kind==='player')sprite(ctx,p.x,p.y,'avatar',harvest?workPhase:walkPhase,facing);
    }
    paintEffects();
  }
  function resize(){
    const rect=root.getBoundingClientRect();
    w=Math.max(200,Math.round(rect.width));h=Math.max(180,Math.round(rect.height));
    currentDpr=safeCanvasDpr(w,h,typeof window==='undefined'?1:window.devicePixelRatio||1);
    const pxW=Math.round(w*currentDpr),pxH=Math.round(h*currentDpr);
    if(canvas.width!==pxW||canvas.height!==pxH){
      canvas.width=pxW;canvas.height=pxH;
      ctx.setTransform(currentDpr,0,0,currentDpr,0,0);
      ctx.imageSmoothingEnabled=false;
    }
  }

  function tick(t){
    const dt=clamp((t-last)/1000||0,0,.06);last=t;
    try{
    if(root.closest('.view')?.classList.contains('active')&&document.visibilityState!=='hidden'){
      resize();frameCount++;
      if(held&&!path.length)stepDir(...held);
      if(path.length&&!dialogOpen){
        const next=path[0],distance=Math.hypot(next.x-player.x,next.y-player.y),speed=2.55*dt;
        const delta=Math.min(speed,distance);
        const dx=next.x-player.x,dy=next.y-player.y;
        if(distance<.015||distance<=speed){
          player.x=next.x;player.y=next.y;path.shift();
          if(!path.length){savePosition();if(pending){const target=pending;pending=null;interact(target);}}
        }else{player.x+=dx/distance*delta;player.y+=dy/distance*delta;}
        if(distance>0){facing=(dx-dy)>=0?1:-1;walkPhase+=delta*11;}
      }else walkPhase=0;
      if(!path.length&&held)stepDir(...held);
      walkNPCs(dt);tickGather(dt);tickEffects(dt);
      const desiredX=(player.x-player.y)*TW/2,desiredY=(player.x+player.y)*TH/2;
      if(!cameraPan.isManual){cam.x+=(desiredX-cam.x)*Math.min(1,dt*8);cam.y+=(desiredY-cam.y)*Math.min(1,dt*8);}
      const moving=!!path.length||!!held||cameraPan.isPanning;
      const interval=targetFrameInterval(moving,!!harvest,!!fx.length);
      if(t-lastDrawAt>=interval){
        draw();
        lastDrawAt=t;
        renderFailures=0;
      }
      if(frameCount%12===0)updateHud();
    }
    }catch(error){
      renderFailures++;
      if(t-lastFaultAt>6000){
        lastFaultAt=t;
        captureRuntimeFault(error,{
          scene:adventure().scene||'valley',
          stage:'animation-frame',
          width:canvas.width,height:canvas.height,dpr:currentDpr
        });
        console.error('[CRAFTERRA] Error del motor gráfico recuperado:',error);
        if(renderFailures===1)notify('Error gráfico detectado. Puedes exportar diagnóstico en Ajustes.');
      }
    }finally{
      // A single painting error must never permanently stop the world loop.
      requestAnimationFrame(tick);
    }
  }
  // Safari pointer events: 9px differentiates an intentional tap from a drag.
  canvas.addEventListener('pointerdown',ev=>{
    if(dialogOpen)return;
    if(cameraPan.down(ev)){
      try{canvas.setPointerCapture(ev.pointerId);}catch(_){}
    }
  });
  canvas.addEventListener('pointermove',ev=>cameraPan.move(ev),{passive:false});
  canvas.addEventListener('pointerup',ev=>cameraPan.end(ev));
  canvas.addEventListener('pointercancel',ev=>cameraPan.end(ev));
  canvas.addEventListener('lostpointercapture',ev=>cameraPan.end(ev));
  el('#adv-recenter').addEventListener('click',()=>cameraPan.recenter());
  canvas.addEventListener('click',ev=>{
    if(cameraPan.ignoreClick())return;
    const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*w/r.width,y=(ev.clientY-r.top)*h/r.height;
    let hit=null,min=29;
    for(const e of entities()){
      const p=project(e.x,e.y);
      const tall=e.type==='wood'||e.type==='animal'||e.kind==='npc'||e.kind==='house'||e.kind==='station'||e.kind==='workshop'||e.kind==='cave';
      const shift=tall?(e.kind==='house'?45:e.kind==='station'?39:e.kind==='workshop'?29:e.kind==='cave'?52:e.type==='animal'?12:30):12;
      const radius=tall?43:27;
      const d=Math.hypot(x-p.x,y-(p.y-shift));
      if(d<radius&&d<min+15){hit=e;min=d;}
    }
    if(hit){moveTo(hit.x,hit.y,hit);return;}
    const tile=screenToTile(x,y);
    if(!adventure().scene&&tile.x===15&&tile.y>0&&tile.y<WORLD_SIZE.height-1){
      const side=player.x<15?14:16;
      const water=riverNode(tile.y,side);
      moveTo(water.x,water.y,water);return;
    }
    moveTo(tile.x,tile.y);
  });
  el('#adv-dismiss').addEventListener('click',closeDialog);
  el('#adv-strike').addEventListener('pointerdown',ev=>{
    ev.preventDefault();
    if(!harvest)return;
    const t=performance.now();
    if(t-lastStrike<155)return;
    lastStrike=t;
    harvest.elapsed=Math.min(harvest.ms,harvest.elapsed+Math.min(240,harvest.ms*.11));
    workPhase+=.92;
    impact(harvest.node,el('#adv-work').dataset.kind,2);
    const btn=el('#adv-strike');
    btn.classList.remove('pulse');
    void btn.offsetWidth;
    btn.classList.add('pulse');
    try{if(navigator.vibrate)navigator.vibrate(12);}catch(_){}
  });
    el('#adv-interact').addEventListener('click',()=>{const n=nearby();if(n&&n.d<2.2)interact(n);else notify('Acércate a una persona, recurso o al puente.');});
  el('#adv-workshop').addEventListener('click',()=>{savePosition();onCraft();});
  el('#adv-expeditions').addEventListener('click',()=>onExpeditions());

  for(const btn of root.querySelectorAll('[data-dir]')){
    const direction=btn.dataset.dir.split(',').map(Number);
    btn.addEventListener('pointerdown',ev=>{
      ev.preventDefault();held=direction;stepDir(...direction);
      try{btn.setPointerCapture(ev.pointerId);}catch(_){}
    });
    for(const type of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(type,()=>{held=null;});
  }
  document.addEventListener('keydown',ev=>{
    if(!root.closest('.view')?.classList.contains('active')||dialogOpen)return;
    const map={ArrowUp:[-1,-1],ArrowDown:[1,1],ArrowLeft:[-1,1],ArrowRight:[1,-1]};
    if(map[ev.key]){ev.preventDefault();stepDir(...map[ev.key]);}
    if(ev.key===' '||ev.key==='Enter'){const n=nearby();if(n&&n.d<2.2)interact(n);}
  });
  loadPosition();resize();updateHud();requestAnimationFrame(tick);
  return {refresh(){
    try{updateHud();draw();}
    catch(error){
      captureRuntimeFault(error,{scene:adventure().scene||'valley',stage:'refresh',width:canvas.width,height:canvas.height,dpr:currentDpr});
      console.error('[CRAFTERRA] Error de refresco recuperado:',error);
    }
  }};
}
