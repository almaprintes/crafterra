import{gatheringPlan}from './adventure-rules.js?v=0.6.0';
import{stationOptions,runStationProcess,heatOf,MAX_FIRE_HEAT}from './material-economy.js?v=0.6.0';
import{TREE_SPECIES,HOUSE_ROOMS,ROOM_OBJECTS,nodeAvailable,availableActions,completeWorldAction,performRoomAction,RESOURCE_RESPAWN,hasBowl,isOre}from './world-actions.js?v=0.6.0';
// CRAFTERRA · Primer mundo isométrico (sin dependencias externas)
// La aventura comparte inventario y guardado con el juego original.
export const WORLD_SIZE = Object.freeze({width:30,height:22});
export const WORLD_NODES = Object.freeze([
 {id:'arbol1',x:5,y:7,type:'wood',species:'pine',qty:2},
 {id:'arbol2',x:4,y:14,type:'wood',species:'oak',qty:3},
 {id:'arbol3',x:10,y:16,type:'wood',species:'pine',qty:2},
 {id:'arbol4',x:8,y:3,type:'wood',species:'oak',qty:3},
 {id:'arbol5',x:20,y:13,type:'wood',species:'oak',qty:3},
 {id:'roca1',x:6,y:14,type:'stone',qty:3},
 {id:'roca2',x:11,y:5,type:'stone',qty:3},
 {id:'roca3',x:3,y:10,type:'stone',qty:3},
 {id:'roca4',x:24,y:6,type:'stone',qty:3},
 {id:'fibra1',x:9,y:13,type:'plant_fiber',qty:2},
 {id:'fibra2',x:5,y:17,type:'plant_fiber',qty:2},
 {id:'fibra3',x:11,y:8,type:'plant_fiber',qty:2},
 {id:'fibra4',x:25,y:16,type:'plant_fiber',qty:2},
 {id:'mena_hierro',x:10,y:4,type:'iron',qty:2},
 {id:'mena_cobre',x:9,y:17,type:'copper',qty:2},
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
  if(WORLD_CAMPFIRE.x===x&&WORLD_CAMPFIRE.y===y)return false;
  if(WORLD_WORKSTATIONS.some(o=>o.x===x&&o.y===y))return false;
  if(WORLD_TREES.some(t=>t.x===x&&t.y===y&&nodeAvailable({adventure:{gathered}},t,now)))return false;
  if(WORLD_NODES.some(n=>n.x===x&&n.y===y&&n.type!=='plant_fiber'&&nodeAvailable({adventure:{gathered}},n,now)))return false;
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
   if(Math.abs(x-15)<3||y>=9&&y<=11||hash(x,y)!==0)continue;
   if(WORLD_HOUSES.some(n=>Math.abs(n.x-x)+Math.abs(n.y-y)<3))continue;
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
const tree=(ctx,x,y,species='pine')=>{
  ctx.fillStyle='#553e2a';ctx.fillRect(x-4,y-18,8,20);
  if(species==='oak'){
    ctx.fillStyle='#456c37';ctx.fillRect(x-20,y-36,40,22);
    ctx.fillStyle='#66934f';ctx.fillRect(x-16,y-48,32,24);
    ctx.fillStyle='#87b75e';ctx.fillRect(x-10,y-54,20,21);
    return;
  }
  ctx.fillStyle='#1c624d';ctx.fillRect(x-14,y-37,28,23);
  ctx.fillStyle='#298360';ctx.fillRect(x-10,y-48,20,26);
  ctx.fillStyle='#45a777';ctx.fillRect(x-6,y-52,12,22);
  ctx.fillStyle='#79bc7c';ctx.fillRect(x-6,y-46,5,9);
};
const rock=(ctx,x,y)=>{ctx.fillStyle='#465d63';ctx.fillRect(x-12,y-10,25,12);ctx.fillStyle='#9cb3aa';ctx.fillRect(x-8,y-15,18,8);ctx.fillStyle='#cadaaa';ctx.fillRect(x-6,y-15,6,5);};
const grass=(ctx,x,y)=>{ctx.fillStyle='#267d57';for(const dx of [-6,0,6])ctx.fillRect(x+dx,y-5+Math.abs(dx)/3,2,8);ctx.fillStyle='#dbd15f';ctx.fillRect(x-1,y-7,3,3);};
const house=(ctx,x,y,blue=false)=>{
  ctx.fillStyle='#384950';ctx.fillRect(x-31,y-13,62,18);
  ctx.fillStyle=blue?'#d5bbaa':'#e5ca9a';ctx.fillRect(x-31,y-45,62,35);
  ctx.fillStyle=blue?'#456d83':'#a95e4a';ctx.beginPath();ctx.moveTo(x-38,y-43);ctx.lineTo(x,y-72);ctx.lineTo(x+38,y-43);ctx.closePath();ctx.fill();
  ctx.fillStyle='#503d2e';ctx.fillRect(x-7,y-30,14,27);
  ctx.fillStyle='#9cdce5';ctx.fillRect(x-24,y-35,11,10);ctx.fillRect(x+15,y-35,11,10);
  ctx.fillStyle='#ffffff55';ctx.fillRect(x-23,y-34,4,4);
};
const drawBridge=(ctx,x,y,built)=>{
  ctx.fillStyle=built?'#8b613f':'#644c38';ctx.fillRect(x-26,y-7,52,15);
  if(built){for(let i=-22;i<24;i+=9){ctx.fillStyle=i%2?'#b38b57':'#d4ad72';ctx.fillRect(x+i,y-8,6,16);}ctx.fillStyle='#5f3c28';ctx.fillRect(x-24,y-14,4,12);ctx.fillRect(x+20,y-14,4,12);}
  else{ctx.fillStyle='#385d6a';ctx.fillRect(x-6,y-8,14,17);ctx.fillStyle='#cd9879';ctx.fillRect(x-25,y-13,3,10);ctx.fillRect(x+23,y-13,3,10);}
};

export function mountIsometricWorld(root,{getState,persist,onCraft,notify,onProgress=()=>{}}){
  root.innerHTML='<canvas class="adventure-canvas" aria-label="Mapa isométrico interactivo de Crafterra"></canvas>'+
    '<div class="adventure-hud"><b id="adv-region">🌿 VALLE DEL ORIGEN</b><small id="adv-objective"></small></div>'+
    '<div class="adventure-inventory" id="adv-inventory"></div>'+
    '<div class="adventure-tool" id="adv-tool">🪓 Manos · ⛏ Manos</div>'+
    '<div class="adventure-work" id="adv-work" hidden><b id="adv-work-label">Trabajando…</b><div class="adventure-work-track"><span id="adv-work-bar"></span></div></div>'+
    '<div class="adventure-bottom"><div class="adventure-dpad" aria-label="Controles de movimiento">'+
    '<button class="adv-up" aria-label="Mover arriba" data-dir="-1,-1">▲</button>'+
    '<button class="adv-left" aria-label="Mover izquierda" data-dir="-1,1">◀</button><button class="adv-down" aria-label="Mover abajo" data-dir="1,1">▼</button><button class="adv-right" aria-label="Mover derecha" data-dir="1,-1">▶</button>'+
    '</div><button id="adv-interact" class="adventure-action">✦ Interactuar</button><button id="adv-workshop" class="adventure-craft">⚒ Taller</button></div>'+
    '<div class="adventure-dialog" hidden><h3 id="adv-speaker"></h3><p id="adv-dialog-text"></p><div id="adv-dialog-actions"></div></div>'+
    '<div class="adventure-hint" id="adv-tip">Toca un recurso para decidir qué hacer · Las casas tienen interior</div>';
  const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx){notify('No se pudo iniciar la vista gráfica.');return{refresh(){}};}
  const el=q=>root.querySelector(q);
  let player={x:9,y:10},path=[],pending=null,cam={x:0,y:0},last=0,step=0,frameCount=0,dialogOpen=false,loaded=false,w=480,h=300,harvest=null,walkPhase=0,facing=1,held=null;
  const actors=WORLD_NPCS.map(n=>({...n,homeX:n.x,homeY:n.y,phase:0,facing:1,idle:0,steps:[]}));
  const state=()=>getState();
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
  function loadPosition(){if(loaded)return;const a=adventure();player=a.scene?{...(a.roomPositions[a.scene]||{x:5,y:6})}:{x:a.x,y:a.y};cam={x:(player.x-player.y)*TW/2,y:(player.x+player.y)*TH/2};loaded=true;}
  function savePosition(){const a=adventure();if(a.scene)a.roomPositions[a.scene]={...player};else{a.x=player.x;a.y=player.y;}persist();}
  function project(x,y){return{x:(x-y)*TW/2-cam.x+w/2,y:(x+y)*TH/2-cam.y+h*.53};}
  function screenToTile(sx,sy){const ix=sx-w/2+cam.x,iy=sy-h*.53+cam.y;return{x:Math.round(ix/TW+iy/TH),y:Math.round(iy/TH-ix/TW)};}
function available(node){return nodeAvailable(state(),node,Date.now());}
  function riverNode(y,side=player.x<15?14:16){
    return {id:'rio_'+side+'_'+y,x:side,y,type:'water',kind:'node',qty:1,label:'Agua del río'};
  }
  function entities(){
    const scene=adventure().scene;
    if(scene)return ROOM_OBJECTS[scene].map(x=>({...x}));
    return [
      ...actors.map(n=>({...n,kind:'npc'})),
      ...WORLD_NODES.filter(available).map(n=>({...n,kind:'node'})),
      ...WORLD_TREES.filter(available).map(n=>({...n,kind:'node'})),
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
    const a=adventure(),s=state(),scene=a.scene;
    el('#adv-region').textContent=scene?'🏠 '+HOUSE_ROOMS[scene].name:'🌿 VALLE DEL ORIGEN';
    el('#adv-objective').textContent=scene?'Interactúa con sus estaciones o sal por la puerta':a.completed?'Capítulo 1 completo · Sigue explorando':!a.metMara?'Habla con Mara, en la aldea':!a.bridge?'Construye el puente: 2 tablones + 1 cuerda':'Cruza el río y habla con Lía';
    const gather=gatheringPlan(s,'wood'),mine=gatheringPlan(s,'stone');
    el('#adv-inventory').textContent='🪵 '+(s.stock?.wood||0)+' · 🪓 '+(s.stock?.rough_wood||0)+' · 💧 '+(s.stock?.water||0)+' · 🪨 '+(s.stock?.stone||0)+' · 🧶 '+(s.stock?.plant_fiber||0);
    el('#adv-tool').textContent='🪓 '+(gather.tool?gather.label+' '+gather.remaining+'/'+gather.max:'Manos')+' · ⛏ '+(mine.tool?mine.label+' '+mine.remaining+'/'+mine.max:'Manos');
    const n=nearby();
    const label=n&&n.d<2.2?(n.kind==='npc'?'Hablar':n.kind==='house'?'Entrar':n.kind==='workshop'?'Utilizar':n.kind==='fire'?'Hoguera':n.kind==='exit'?'Salir':n.kind==='station'?'Usar':n.kind==='bridge'?'Puente':n.type==='water'?'Agua':n.type==='wood'?'Árbol':n.type==='plant_fiber'?'Recoger':'Extraer'):'Interactuar';
    el('#adv-interact').textContent='✦ '+label;
    el('#adv-tip').textContent=scene?'Toca una estación para utilizarla · Puerta: salir al exterior':'Árboles: cortar o golpear · Río: cuenco · Vetas: pico · Casas: entrar';
  }
  function showDialog(name,message,buttons=[{label:'Continuar',action:'close'}]){
    dialogOpen=true;path=[];pending=null;harvest=null;el('#adv-work').hidden=true;
    el('#adv-speaker').textContent=name;el('#adv-dialog-text').textContent=message;
    const actions=el('#adv-dialog-actions');actions.replaceChildren();
    buttons.forEach(b=>{const btn=document.createElement('button');btn.textContent=b.label;btn.disabled=b.enabled===false;if(b.need)btn.title=b.need;btn.addEventListener('click',()=>{
      el('.adventure-dialog').hidden=true;dialogOpen=false;
      if(b.action==='craft')onCraft();
      if(b.action==='repair')repair();
      if(typeof b.run==='function')b.run();
    });actions.append(btn);});
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
    savePosition();updateHud();notify('Has entrado en '+HOUSE_ROOMS[id].name);
  }
  function leaveRoom(){
    const a=adventure();
    a.roomPositions[a.scene]={...player};a.scene=null;
    player={x:a.x,y:a.y};path=[];pending=null;harvest=null;held=null;
    cam={x:(player.x-player.y)*TW/2,y:(player.x+player.y)*TH/2};
    savePosition();updateHud();notify('Has salido al Valle del Origen');
  }
  function beginWork(e,option){
    if(!option?.enabled){notify(option?.need||'No puedes hacerlo todavía');return;}
    if(!available(e))return;
    harvest={node:e,actionId:option.id,elapsed:0,ms:option.ms,plan:option};
    path=[];pending=null;
    el('#adv-work').hidden=false;
    el('#adv-work-label').textContent=option.label+' · '+(option.ms/1000).toFixed(1)+' s';
    el('#adv-work-bar').style.width='0%';
    updateHud();
  }
  function showStationMenu(kind,fireId,title){
    const s=state(),opts=stationOptions(s,kind,fireId),heat=kind==='fire'?heatOf(s,fireId):null;
    const description=kind==='fire'?
      'Calor disponible: '+heat+'/'+MAX_FIRE_HEAT+'. Añade combustible primero y utiliza el calor para cocinar o preparar carbón vegetal. La hoguera no se consume.':
      'Trabajar a mano cuesta 2 maderas toscas por 1 madera. Con sierra basta una madera tosca y la herramienta pierde un uso.';
    showDialog(title,description,[
      ...opts.map(o=>({
        label:o.enabled?o.label:'🔒 '+o.label,
        enabled:o.enabled,
        need:o.reason,
        run:()=>{
          const result=runStationProcess(state(),kind,o.id,fireId);
          if(result.ok){persist();onProgress();updateHud();}
          showDialog(title,result.ok?result.message:(result.reason||'No puedes realizar la acción'),[
            {label:'Volver a las acciones',run:()=>showStationMenu(kind,fireId,title)},
            {label:'Cerrar',action:'close'}
          ]);
        }
      })),
      {label:'Volver',action:'close'}
    ]);
  }
  function roomStation(e){
    const a=adventure(),s=state();
    if(e.id==='workbench'){onCraft();return;}
    if(e.id==='hearth'){showStationMenu('fire','house_mara','🔥 Hogar de Mara');return;}
    if(e.id==='sawmill'){showStationMenu('sawmill','house_lia','🪚 Banco de carpintería');return;}
    const r=performRoomAction(s,a.scene,e.id);
    if(r.ok){persist();onProgress();updateHud();}
    showDialog(e.label,r.ok?r.message:r.reason);
  }
  function interact(e){
    if(!e||!near(e))return;
    const a=adventure(),s=state();
    if(a.scene){
      if(e.kind==='exit'){leaveRoom();return;}
      if(e.kind==='station')roomStation(e);
      return;
    }
    if(e.kind==='house'){
      showDialog(e.label,'La puerta está abierta. Dentro encontrarás estaciones y tareas diferentes.',[
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
        e.type==='water'?'Orilla del río':e.type==='stone'?'Roca':e.type==='plant_fiber'?'Planta fibrosa':
        'Veta de '+({iron:'hierro',copper:'cobre',tin:'estaño',coal:'carbón',quartz:'cuarzo',silver:'plata',gold:'oro'}[e.type]||e.type);
      showDialog(name,e.type==='water'?'Necesitas un cuenco de madera o arcilla. El recipiente se conserva después de llenarlo.':
        e.type==='wood'?'Elige entre cortar madera útil con un hacha o golpear el tronco para conseguir madera tosca.':
        'Selecciona cómo quieres obtener el recurso.',[
        ...options.map(o=>({label:o.enabled?(o.label+' · '+(o.ms/1000).toFixed(1)+' s'+(o.tool?' ('+o.tool.replaceAll('_',' ')+')':'')):('🔒 '+(o.need||o.label)),
          enabled:o.enabled,need:o.need,run:()=>beginWork(e,o)})),
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
    return x>=1&&x<=9&&y>=1&&y<=7&&!ROOM_OBJECTS[room].some(o=>o.kind==='station'&&o.x===x&&o.y===y);
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
function tickGather(dt){
    if(!harvest)return;
    const h=harvest;
    if(!near(h.node)||!available(h.node)){harvest=null;el('#adv-work').hidden=true;return;}
    h.elapsed+=dt*1000;
    el('#adv-work-bar').style.width=Math.min(100,100*h.elapsed/h.ms)+'%';
    if(h.elapsed<h.ms)return;
    harvest=null;el('#adv-work').hidden=true;
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
      {kind:'player',x:player.x,y:player.y}
    ].sort((a,b)=>(a.x+a.y)-(b.x+b.y));
    const objects=[];
    for(const n of [...WORLD_TREES,...WORLD_NODES])if(available(n))objects.push({...n,kind:'resource'});
    objects.push(...WORLD_HOUSES,...WORLD_WORKSTATIONS,WORLD_CAMPFIRE);
    for(const n of actors)objects.push({...n,kind:'npc'});
    objects.push({kind:'bridgeart',x:15,y:10},{kind:'player',x:player.x,y:player.y});
    return objects.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
  }
  function drawInside(scene){
    ctx.fillStyle=scene==='house_mara'?'#57483f':'#303f58';ctx.fillRect(0,0,w,h);
    const home=scene==='house_mara';
    for(let y=0;y<=8;y++)for(let x=0;x<=10;x++){
      const p=project(x,y);
      const floor=(x+y)%2===0?(home?'#c6a06d':'#7790a2'):(home?'#b58d61':'#698294');
      diamond(ctx,p.x,p.y,floor,home?'#977352':'#567083');
    }
    for(const o of worldObjects()){
      const p=project(o.x,o.y);
      if(o.kind==='player'){sprite(ctx,p.x,p.y,'avatar',walkPhase,facing);continue;}
      const icon={exit:'🚪',bed:'🛏',pantry:'🧺',hearth:'🔥',workbench:'⚒',sawmill:'🪚',repair:'🔧'}[o.id]||'⚙';
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
    if(a.scene){drawInside(a.scene);return;}
    for(let y=0;y<WORLD_SIZE.height;y++)for(let x=0;x<WORLD_SIZE.width;x++){
      const p=project(x,y);if(p.x<-TW||p.x>w+TW||p.y<-65||p.y>h+45)continue;
      const river=x===15;
      const base=river?'#4c92ba':x>15?'#77ac72':y<6?'#a5b873':'#8bbd75';
      const fill=river?(hash(x,y)%2?'#5aa9cc':base):(hash(x,y)%4===0?'#a1c77c':base);
      diamond(ctx,p.x,p.y,fill,river?'#69b9d7':'#7daa73');
      if(river){ctx.fillStyle='#b4ddda';ctx.fillRect(p.x-10+hash(x,y)%6,p.y-1,7,2);}
    }
    for(const o of worldObjects()){
      const p=project(o.x,o.y);if(p.x<-80||p.x>w+80||p.y<-95||p.y>h+65)continue;
      if(o.kind==='workshop'){
        const furnace=o.station==='foundry';
        ctx.fillStyle=furnace?'#534e48':'#6b665d';ctx.fillRect(p.x-19,p.y-14,38,17);
        ctx.fillStyle=furnace?'#aaa39b':'#b0b9ae';ctx.fillRect(p.x-17,p.y-22,34,10);
        ctx.fillStyle=furnace?'#d38b4c':'#ded0a4';ctx.fillRect(p.x-11,p.y-28,22,8);
        if(furnace&&heatOf(state(),o.id)>0){ctx.fillStyle='#f5b353';ctx.fillRect(p.x-6,p.y-25,12,13);ctx.fillStyle='#ffe69e';ctx.fillRect(p.x-2,p.y-22,4,7);}
        ctx.fillStyle='#fff5d2';ctx.textAlign='center';ctx.font='bold 9px system-ui';ctx.fillText(furnace?'⚒️ FUNDICIÓN':'🪨 CANTERÍA',p.x,p.y-39);
        if(furnace){ctx.font='bold 10px system-ui';ctx.fillText(heatOf(state(),o.id)+'/'+MAX_FIRE_HEAT+' ♨',p.x,p.y-51);}
      }
      if(o.kind==='fire'){
        const fuel=heatOf(state(),'valley');
        ctx.fillStyle='#725443';ctx.fillRect(p.x-17,p.y-7,34,10);
        ctx.fillStyle='#8b9595';for(const dx of [-17,-8,5,14])ctx.fillRect(p.x+dx,p.y-6,6,5);
        ctx.fillStyle='#50391f';ctx.fillRect(p.x-11,p.y-11,22,7);
        if(fuel){ctx.fillStyle='#f8aa3e';ctx.fillRect(p.x-6,p.y-25,12,16);ctx.fillStyle='#fbed74';ctx.fillRect(p.x-2,p.y-19,6,11);}
        ctx.fillStyle='#fff6d1';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText('🔥 '+fuel+'/'+MAX_FIRE_HEAT,p.x,p.y-32);
      }
      if(o.kind==='house'){house(ctx,p.x,p.y,o.id==='house_lia');ctx.fillStyle='#fff1b5';ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.fillText(o.label,p.x,p.y-82);}
      if(o.kind==='bridgeart')drawBridge(ctx,p.x,p.y,a.bridge);
      if(o.kind==='resource'){
        if(o.type==='wood')tree(ctx,p.x,p.y,o.species);
        if(o.type==='stone')rock(ctx,p.x,p.y);
        if(o.type==='plant_fiber')grass(ctx,p.x,p.y);
        if(isOre(o)){
          rock(ctx,p.x,p.y);
          ctx.fillStyle=({iron:'#b3c0cd',copper:'#f19b64',tin:'#f4dfa8',coal:'#343f52',quartz:'#8ae5e7',silver:'#dceaff',gold:'#f4c74a'})[o.type]||'#ffffff';
          ctx.fillRect(p.x-5,p.y-13,7,7);ctx.fillRect(p.x+5,p.y-10,4,4);
          ctx.font='bold 9px system-ui';ctx.fillStyle='#173646';ctx.textAlign='center';ctx.fillText(({iron:'Fe',copper:'Cu',tin:'Sn',coal:'C',quartz:'Qz',silver:'Ag',gold:'Au'})[o.type],p.x,p.y-20);
        }
        ctx.fillStyle='#fff2ae';ctx.fillRect(p.x-3,p.y-(o.type==='wood'?57:25),6,5);
      }
      if(o.kind==='npc'){
        sprite(ctx,p.x,p.y,o.palette,o.phase,o.facing);
        ctx.fillStyle='#102d39e8';ctx.fillRect(p.x-17,p.y-55,34,12);
        ctx.fillStyle='#fff4cd';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText(o.name,p.x,p.y-46);
        if(o.id==='mara'&&!a.metMara||o.id==='lia'&&a.bridge&&!a.completed){
          ctx.fillStyle='#fdd475';ctx.fillRect(p.x-3,p.y-69,6,10);
        }
      }
      if(o.kind==='player')sprite(ctx,p.x,p.y,'avatar',walkPhase,facing);
    }
  }
  function resize(){
    const rect=root.getBoundingClientRect();w=Math.max(200,Math.round(rect.width));h=Math.max(180,Math.round(rect.height));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false;}
  }

  function tick(t){
    const dt=clamp((t-last)/1000||0,0,.06);last=t;
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
      walkNPCs(dt);tickGather(dt);
      const desiredX=(player.x-player.y)*TW/2,desiredY=(player.x+player.y)*TH/2;
      cam.x+=(desiredX-cam.x)*Math.min(1,dt*8);cam.y+=(desiredY-cam.y)*Math.min(1,dt*8);
      if(frameCount%2===0)draw();
      if(frameCount%12===0)updateHud();
    }
    requestAnimationFrame(tick);
  }
  canvas.addEventListener('click',ev=>{
    const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*w/r.width,y=(ev.clientY-r.top)*h/r.height;
    let hit=null,min=29;
    for(const e of entities()){
      const p=project(e.x,e.y);
      const tall=e.type==='wood'||e.kind==='npc'||e.kind==='house'||e.kind==='station';
      const shift=tall?(e.kind==='house'?45:e.kind==='station'?39:30):12;
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
  el('#adv-interact').addEventListener('click',()=>{const n=nearby();if(n&&n.d<2.2)interact(n);else notify('Acércate a una persona, recurso o al puente.');});
  el('#adv-workshop').addEventListener('click',()=>{savePosition();onCraft();});

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
  return {refresh(){updateHud();draw();}};
}
