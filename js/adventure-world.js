// CRAFTERRA · Primer mundo isométrico (sin dependencias externas)
// La aventura comparte inventario y guardado con el juego original.
export const WORLD_SIZE = Object.freeze({width:30,height:22});
export const WORLD_NODES = Object.freeze([
  {id:'arbol1',x:5,y:7,type:'wood',qty:2},
  {id:'arbol2',x:4,y:14,type:'wood',qty:2},
  {id:'arbol3',x:10,y:16,type:'wood',qty:2},
  {id:'arbol4',x:8,y:3,type:'wood',qty:2},
  {id:'roca1',x:6,y:14,type:'stone',qty:3},
  {id:'roca2',x:11,y:5,type:'stone',qty:3},
  {id:'roca3',x:3,y:10,type:'stone',qty:3},
  {id:'fibra1',x:9,y:13,type:'plant_fiber',qty:2},
  {id:'fibra2',x:5,y:17,type:'plant_fiber',qty:2},
  {id:'fibra3',x:11,y:8,type:'plant_fiber',qty:2},
  {id:'arbol5',x:20,y:13,type:'wood',qty:3},
  {id:'roca4',x:24,y:6,type:'stone',qty:3},
  {id:'fibra4',x:25,y:16,type:'plant_fiber',qty:2}
]);
export const WORLD_NPCS = Object.freeze([
  {id:'mara',name:'Mara',x:7,y:10,palette:'orange'},
  {id:'taro',name:'Taro',x:13,y:10,palette:'blue'},
  {id:'lia',name:'Lía',x:22,y:10,palette:'violet'}
]);
export function isWalkable(x,y,bridge=false){
  return Number.isInteger(x)&&Number.isInteger(y)&&x>=1&&x<WORLD_SIZE.width-1&&y>=1&&y<WORLD_SIZE.height-1&&(x!==15||(bridge&&y===10));
}
export function findPath(from,to,bridge=false){
  const start=[Math.round(from.x),Math.round(from.y)],goal=[Math.round(to.x),Math.round(to.y)];
  if(!isWalkable(goal[0],goal[1],bridge))return [];
  const key=(x,y)=>x+','+y,queue=[start],seen=new Map([[key(...start),null]]);
  for(let i=0;i<queue.length;i++){
    const [x,y]=queue[i];if(x===goal[0]&&y===goal[1])break;
    for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){
      const nx=x+dx,ny=y+dy,k=key(nx,ny);
      if(isWalkable(nx,ny,bridge)&&!seen.has(k)){seen.set(k,[x,y]);queue.push([nx,ny]);}
    }
  }
  let k=key(...goal);if(!seen.has(k))return [];
  const path=[];while(seen.get(k)){const [x,y]=k.split(',').map(Number);path.unshift({x,y});k=key(...seen.get(k));}
  return path;
}
const TW=48,TH=24,RESPAWN=5*60*1000;
const color={
  avatar:{h:'#61402e',s:'#f8ce99',j:'#e8b04b',p:'#274b65'},
  orange:{h:'#693721',s:'#ffd2a1',j:'#cb6b45',p:'#4e4661'},
  blue:{h:'#503b2e',s:'#f0c390',j:'#4989ae',p:'#354766'},
  violet:{h:'#392a49',s:'#dfb18d',j:'#a47bd0',p:'#4c4667'}
};
const hash=(x,y)=>((x*1789+y*3247+x*y*1297)>>>0)%19;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const sprite=(ctx,x,y,palette,walk,scale=3)=>{
  const c=color[palette]||color.avatar;
  const rows=['...HHHH...','..HHHHHH..','..HSSSSH..','..HSSSSH..','...SSSS...','..JJJJJJ..','.JJJJJJJJ.','..JJJJJJ..','...PPPP...','...PPPP...','..PP..PP..',walk?'..PP...PP.':'.PPP..PPP.'];
  const map={H:c.h,S:c.s,J:c.j,P:c.p};
  ctx.fillStyle='#16324755';ctx.fillRect(Math.round(x-13),Math.round(y+1),26,5);
  rows.forEach((line,i)=>[...line].forEach((v,j)=>{
    if(map[v]){ctx.fillStyle=map[v];ctx.fillRect(Math.round(x+(j-5)*scale),Math.round(y-36+i*scale),scale,scale);}
  }));
  ctx.fillStyle='#293747';ctx.fillRect(Math.round(x-7),Math.round(y-29),2,2);
  ctx.fillRect(Math.round(x+4),Math.round(y-29),2,2);
};
const diamond=(ctx,x,y,c,edge)=>{
  ctx.beginPath();ctx.moveTo(x,y-TH/2);ctx.lineTo(x+TW/2,y);ctx.lineTo(x,y+TH/2);ctx.lineTo(x-TW/2,y);ctx.closePath();
  ctx.fillStyle=c;ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=.7;ctx.stroke();
};
const tree=(ctx,x,y)=>{
  ctx.fillStyle='#553e2a';ctx.fillRect(x-4,y-18,8,20);
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

export function mountIsometricWorld(root,{getState,persist,onCraft,notify}){
  root.innerHTML='<canvas class="adventure-canvas" aria-label="Mapa isométrico interactivo de Crafterra"></canvas>'+
    '<div class="adventure-hud"><b>🌿 VALLE DEL ORIGEN</b><small id="adv-objective"></small></div>'+
    '<div class="adventure-inventory" id="adv-inventory"></div>'+
    '<div class="adventure-bottom"><div class="adventure-dpad">'+
    '<button aria-label="Mover arriba" data-dir="0,-1">▲</button>'+
    '<div><button aria-label="Mover izquierda" data-dir="-1,0">◀</button><button aria-label="Mover abajo" data-dir="0,1">▼</button><button aria-label="Mover derecha" data-dir="1,0">▶</button></div>'+
    '</div><button id="adv-interact" class="adventure-action">✦ Interactuar</button><button id="adv-workshop" class="adventure-craft">⚒ Taller</button></div>'+
    '<div class="adventure-dialog" hidden><h3 id="adv-speaker"></h3><p id="adv-dialog-text"></p><div id="adv-dialog-actions"></div></div>'+
    '<div class="adventure-hint">Toca un lugar para caminar · Toca personas y recursos para interactuar</div>';
  const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx){notify('No se pudo iniciar la vista gráfica.');return{refresh(){}};}
  const el=q=>root.querySelector(q);
  let player={x:9,y:10},path=[],pending=null,cam={x:0,y:0},last=0,step=0,frameCount=0,dialogOpen=false,loaded=false,w=480,h=300,pointerEntity=null;
  const state=()=>getState();
  function adventure(){
    const s=state();
    if(!s.adventure||typeof s.adventure!=='object')s.adventure={x:9,y:10,metMara:false,bridge:false,completed:false,gathered:{}};
    const a=s.adventure;
    if(!a.gathered||typeof a.gathered!=='object')a.gathered={};
    if(!Number.isFinite(a.x)||!Number.isFinite(a.y)||!isWalkable(Math.round(a.x),Math.round(a.y),!!a.bridge)){a.x=9;a.y=10;}
    return a;
  }
  function loadPosition(){if(loaded)return;const a=adventure();player={x:a.x,y:a.y};cam={x:(player.x-player.y)*TW/2,y:(player.x+player.y)*TH/2};loaded=true;}
  function savePosition(){const a=adventure();a.x=player.x;a.y=player.y;persist();}
  function project(x,y){return{x:(x-y)*TW/2-cam.x+w/2,y:(x+y)*TH/2-cam.y+h*.53};}
  function screenToTile(sx,sy){const ix=sx-w/2+cam.x,iy=sy-h*.53+cam.y;return{x:Math.round(ix/TW+iy/TH),y:Math.round(iy/TH-ix/TW)};}
  function available(node){return !adventure().gathered[node.id]||Date.now()-adventure().gathered[node.id]>=RESPAWN;}
  function entities(){return [
    ...WORLD_NPCS.map(n=>({...n,kind:'npc'})),
    ...WORLD_NODES.filter(available).map(n=>({...n,kind:'node'})),
    {id:'puente',x:14,y:10,kind:'bridge'}
  ];}
  function near(e){return Math.hypot(player.x-e.x,player.y-e.y)<=1.65;}
  function nearby(){return entities().map(e=>({...e,d:Math.hypot(player.x-e.x,player.y-e.y)})).sort((a,b)=>a.d-b.d)[0];}
  function updateHud(){
    const a=adventure(),s=state();
    el('#adv-objective').textContent=a.completed?'Capítulo 1 completo · Explora a tu ritmo':!a.metMara?'Habla con Mara, en la aldea':!a.bridge?'Repara el puente: 2 tablones + 1 cuerda':'Cruza el río y habla con Lía';
    el('#adv-inventory').textContent='🪵 '+(s.stock?.wood||0)+'   🪨 '+(s.stock?.stone||0)+'   🧶 '+(s.stock?.plant_fiber||0)+'   ▤ '+(s.stock?.plank||0)+'   ⛓ '+(s.stock?.rope||0);
    const n=nearby();el('#adv-interact').textContent=n&&n.d<2.2?'✦ '+(n.kind==='npc'?'Hablar':n.kind==='bridge'?'Puente':'Recoger'):'✦ Interactuar';
  }
  function showDialog(name,message,buttons=[{label:'Continuar',action:'close'}]){
    dialogOpen=true;path=[];pending=null;
    el('#adv-speaker').textContent=name;el('#adv-dialog-text').textContent=message;
    const actions=el('#adv-dialog-actions');actions.replaceChildren();
    buttons.forEach(b=>{const btn=document.createElement('button');btn.textContent=b.label;btn.addEventListener('click',()=>{
      el('.adventure-dialog').hidden=true;dialogOpen=false;
      if(b.action==='craft')onCraft();
      if(b.action==='repair')repair();
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
    persist();updateHud();notify('¡Puente reparado! +120 monedas');
    showDialog('Misión completada','¡Has reparado el puente! Cruza a la otra orilla y busca a Lía, la inventora.');
  }
  function interact(e){
    if(!e||!near(e))return;
    const a=adventure(),s=state();
    if(e.kind==='bridge'){repair();return;}
    if(e.kind==='node'){
      if(!available(e))return;
      s.stock=s.stock||{};s.stock[e.type]=(s.stock[e.type]||0)+e.qty;
      if(!s.discovered[e.type]){s.discovered[e.type]=Date.now();s.xp+=20;}
      a.gathered[e.id]=Date.now();persist();notify('+'+e.qty+' '+({wood:'madera',stone:'piedra',plant_fiber:'fibra vegetal'}[e.type]||e.type));updateHud();return;
    }
    if(e.id==='mara'){
      if(!a.metMara){a.metMara=true;persist();}
      showDialog('Mara · Habitante de la aldea',a.bridge?'¡Qué maravilla! Gracias a ti hemos recuperado el camino. Busca a Lía al otro lado del río.':'Nuestro puente cayó durante la última tormenta. Necesitamos a alguien que sepa fabricar. Consigue 2 tablones y 1 cuerda para repararlo. ¡El Taller sigue abierto!', [{label:'Ir al taller',action:'craft'},{label:'Voy a explorar',action:'close'}]);return;
    }
    if(e.id==='taro'){showDialog('Taro · Guardabosques',a.bridge?'¡Buen trabajo! El bosque oriental vuelve a estar conectado con la aldea.':'El río no se puede cruzar por aquí. Si te falta material para reparar el puente, recoge troncos, rocas y fibras por el valle.');return;}
    if(e.id==='lia'){
      if(!a.bridge){showDialog('Lía · Inventora','¿Cómo has llegado hasta aquí? El puente del valle sigue sin reparar.');return;}
      if(!a.completed){a.completed=true;s.coins=(Number(s.coins)||0)+250;persist();notify('Capítulo 1 completado · +250 monedas');}
      showDialog('Lía · Inventora','¡Has devuelto la conexión al valle! Encontré planos de máquinas de una civilización olvidada. Esta será nuestra próxima aventura: recuperar sus conocimientos.');return;
    }
  }
  function moveTo(x,y,pick=null){
    if(dialogOpen)return;
    x=clamp(Math.round(x),1,WORLD_SIZE.width-2);y=clamp(Math.round(y),1,WORLD_SIZE.height-2);
    const p=findPath(player,{x,y},adventure().bridge);
    if(!p.length&&!(Math.round(player.x)===x&&Math.round(player.y)===y)){notify('No hay camino. Puede que necesites construir algo.');return;}
    path=p;pending=pick;
    if(!path.length&&pending){const t=pending;pending=null;interact(t);}
  }
  function stepDir(dx,dy){if(dialogOpen)return;path=[];pending=null;const x=Math.round(player.x)+dx,y=Math.round(player.y)+dy;if(isWalkable(x,y,adventure().bridge))path=[{x,y}];}
  function worldObjects(){
    const objects=[];
    for(let y=2;y<WORLD_SIZE.height-2;y++)for(let x=2;x<WORLD_SIZE.width-2;x++){
      if(x===15||Math.abs(x-15)<2||hash(x,y)>2)continue;
      if(WORLD_NPCS.some(n=>Math.abs(n.x-x)<3&&Math.abs(n.y-y)<3))continue;
      if(WORLD_NODES.some(n=>n.x===x&&n.y===y))continue;
      objects.push({kind:'decortree',x,y});
    }
    objects.push({kind:'house',x:6,y:7});
    objects.push({kind:'house2',x:21,y:7});
    for(const n of WORLD_NODES)if(available(n))objects.push({...n,kind:'resource'});
    for(const n of WORLD_NPCS)objects.push({...n,kind:'npc'});
    objects.push({kind:'bridgeart',x:15,y:10});
    objects.push({kind:'player',x:player.x,y:player.y});
    return objects.sort((a,b)=>(a.x+a.y)-(b.x+b.y));
  }
  function draw(){
    ctx.fillStyle='#6ba4a3';ctx.fillRect(0,0,w,h);
    ctx.imageSmoothingEnabled=false;
    const a=adventure();
    for(let y=0;y<WORLD_SIZE.height;y++)for(let x=0;x<WORLD_SIZE.width;x++){
      const p=project(x,y);if(p.x<-TW||p.x>w+TW||p.y<-65||p.y>h+45)continue;
      const river=x===15;
      const base=river?'#4c92ba':x>15?'#77ac72':y<6?'#a5b873':'#8bbd75';
      const fill=river?(hash(x,y)%2?'#5aa9cc':base):(hash(x,y)%4===0?'#a1c77c':base);
      diamond(ctx,p.x,p.y,fill,river?'#69b9d7':'#7daa73');
      if(river){ctx.fillStyle='#b4ddda';ctx.fillRect(p.x-10+hash(x,y)%6,p.y-1,7,2);}
      else if(hash(x,y)===6){ctx.fillStyle='#d4d889';ctx.fillRect(p.x+7,p.y-2,3,4);}
    }
    const objects=worldObjects();
    for(const o of objects){
      const p=project(o.x,o.y);if(p.x<-80||p.x>w+80||p.y<-95||p.y>h+65)continue;
      if(o.kind==='decortree')tree(ctx,p.x,p.y);
      if(o.kind==='house'||o.kind==='house2')house(ctx,p.x,p.y,o.kind==='house2');
      if(o.kind==='bridgeart')drawBridge(ctx,p.x,p.y,a.bridge);
      if(o.kind==='resource'){
        if(o.type==='wood')tree(ctx,p.x,p.y);
        if(o.type==='stone')rock(ctx,p.x,p.y);
        if(o.type==='plant_fiber')grass(ctx,p.x,p.y);
        ctx.fillStyle='#fff2ae';ctx.fillRect(p.x-3,p.y-(o.type==='wood'?64:25),6,6);
      }
      if(o.kind==='npc'){
        sprite(ctx,p.x,p.y,o.palette,frameCount%35<18);
        ctx.fillStyle='#102d39e8';ctx.fillRect(p.x-17,p.y-55,34,12);
        ctx.fillStyle='#fff4cd';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.fillText(o.name,p.x,p.y-46);
        if(o.id==='mara'&&!a.metMara||o.id==='lia'&&a.bridge&&!a.completed){
          ctx.fillStyle='#fdd475';ctx.fillRect(p.x-3,p.y-69,6,10);
        }
      }
      if(o.kind==='player')sprite(ctx,p.x,p.y,'avatar',path.length>0&&frameCount%12<6);
    }
  }
  function resize(){
    const rect=root.getBoundingClientRect();w=Math.max(200,Math.round(rect.width));h=Math.max(180,Math.round(rect.height));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false;}
  }
  function tick(t){
    const dt=clamp((t-last)/1000||0,0,.08);last=t;
    if(root.closest('.view')?.classList.contains('active')&&document.visibilityState!=='hidden'){
      resize();frameCount++;
      if(path.length&&!dialogOpen){
        const next=path[0],distance=Math.hypot(next.x-player.x,next.y-player.y),speed=3.8*dt;
        if(distance<=speed||distance<.02){
          player.x=next.x;player.y=next.y;path.shift();step++;
          if(!path.length){savePosition();if(pending){const target=pending;pending=null;interact(target);}}
        }else{player.x+=(next.x-player.x)/distance*speed;player.y+=(next.y-player.y)/distance*speed;}
      }
      const desiredX=(player.x-player.y)*TW/2,desiredY=(player.x+player.y)*TH/2;
      cam.x+=(desiredX-cam.x)*Math.min(1,dt*9);cam.y+=(desiredY-cam.y)*Math.min(1,dt*9);
      if(frameCount%3===0)draw();
      if(frameCount%15===0)updateHud();
    }
    requestAnimationFrame(tick);
  }
  canvas.addEventListener('click',ev=>{
    const r=canvas.getBoundingClientRect(),x=(ev.clientX-r.left)*w/r.width,y=(ev.clientY-r.top)*h/r.height;
    let hit=null,min=29;
    for(const e of entities()){const p=project(e.x,e.y);const d=Math.hypot(x-p.x,y-(p.y-20));if(d<min){hit=e;min=d;}}
    if(hit){moveTo(hit.x,hit.y,hit);return;}
    const tile=screenToTile(x,y);moveTo(tile.x,tile.y);
  });
  el('#adv-interact').addEventListener('click',()=>{const n=nearby();if(n&&n.d<2.2)interact(n);else notify('Acércate a una persona, recurso o al puente.');});
  el('#adv-workshop').addEventListener('click',()=>{savePosition();onCraft();});
  for(const btn of root.querySelectorAll('[data-dir]')){
    const [dx,dy]=btn.dataset.dir.split(',').map(Number);
    btn.addEventListener('click',()=>stepDir(dx,dy));
  }
  document.addEventListener('keydown',ev=>{
    if(!root.closest('.view')?.classList.contains('active')||dialogOpen)return;
    const map={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    if(map[ev.key]){ev.preventDefault();stepDir(...map[ev.key]);}
    if(ev.key===' '||ev.key==='Enter'){const n=nearby();if(n&&n.d<2.2)interact(n);}
  });
  loadPosition();resize();updateHud();requestAnimationFrame(tick);
  return {refresh(){const a=adventure();if(!path.length&&Math.abs(player.x-a.x)>3){player.x=a.x;player.y=a.y;}updateHud();draw();}};
}
