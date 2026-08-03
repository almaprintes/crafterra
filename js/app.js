import{ITEMS,RECIPES,COLLECTIONS,MISSIONS,PUZZLES,ACHIEVEMENTS,STATIONS}from'./data.js?v=0.2.26-almaprintad';import{CONFIG}from'./config.js?v=0.2.26-almaprintad';import{initDB,save,reset,exportSave}from'./db.js?v=0.2.26-almaprintad';import{initialState,normalizeState,merge,item,eraFor}from'./engine.js?v=0.2.26-almaprintad';import{RewardedAdsProvider,StoreProvider}from'./providers.js?v=0.2.26-almaprintad';
let S,board=[],filter='Todos',goal='missions',bookMode='items',pendingHint=null,dailyRun=null;const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];const ads=new RewardedAdsProvider,store=new StoreProvider;
const ART={stone:'stone',wood:'wood',water:'water',fire:'fire',earth:'earth',cut_stone:'cut_stone',handle:'handle',coal:'coal',flint:'flint',campfire:'campfire',rope:'rope',iron:'iron',copper:'copper',tin:'tin',clay:'clay',sand:'sand',glass:'glass',salt:'salt',sulfur:'sulfur',gold:'gold',silver:'silver',quartz:'quartz',amethyst:'amethyst',emerald:'emerald',diamond:'diamond',lapis:'lapis',obsidian:'obsidian',bone:'bone',leather:'leather',plant_fiber:'plant_fiber',fabric:'fabric',wool:'wool',feather:'feather',resin:'resin',charcoal:'charcoal',ash:'ash',wax:'wax',herbs:'herbs',mushroom:'mushroom',bark:'bark',stick:'stick',plank:'plank',beam:'beam',nail:'nail',wire:'wire',gear:'gear',chain:'chain',hinge:'hinge',screw:'screw',spring:'spring',iron_ingot:'iron_ingot',copper_ingot:'copper_ingot',tin_ingot:'tin_ingot',gold_ingot:'gold_ingot',silver_ingot:'silver_ingot',bronze:'bronze',steel:'steel',metal_plate:'metal_plate',metal_pipe:'metal_pipe',rivet:'rivet',stone_axe:'stone_axe',stone_pickaxe:'stone_pickaxe',flint_knife:'flint_knife',stone_hammer:'stone_hammer',iron_axe:'iron_axe',iron_pickaxe:'iron_pickaxe',iron_hammer:'iron_hammer',saw:'saw',shovel:'shovel',tongs:'tongs',stone_spear:'stone_spear',iron_spear:'iron_spear',bow:'bow',arrow:'arrow',iron_sword:'iron_sword',dagger:'dagger',mace:'mace',wood_shield:'wood_shield',iron_shield:'iron_shield',iron_helmet:'iron_helmet',brick:'brick',mortar:'mortar',stone_block:'stone_block',workbench:'workbench',kiln:'kiln',forge:'forge',anvil:'anvil',barrel:'barrel',chest:'chest',wood_crate:'wood_crate',torch:'torch',lantern:'lantern',candle:'candle',table:'table',chair:'chair',bed:'bed',shelf:'shelf',wardrobe:'wardrobe',bench:'bench',rug:'rug',wood_bowl:'wood_bowl',clay_bowl:'clay_bowl',clay_jug:'clay_jug',glass_bottle:'glass_bottle',wood_bucket:'wood_bucket',pot:'pot',pan:'pan',wood_spoon:'wood_spoon',mortar_pestle:'mortar_pestle',grill:'grill',wheat:'wheat',flour:'flour',bread:'bread',raw_meat:'raw_meat',cooked_meat:'cooked_meat',fish:'fish',cooked_fish:'cooked_fish',apple:'apple',berries:'berries',honey:'honey',carrot:'carrot',potato:'potato',onion:'onion',tomato:'tomato',corn:'corn',egg:'egg',milk:'milk',cheese:'cheese',seeds:'seeds',compost:'compost',oil:'oil',alcohol:'alcohol',coal_powder:'coal_powder',sulfur_powder:'sulfur_powder',bone_powder:'bone_powder',herbal_extract:'herbal_extract',healing_potion:'healing_potion',energy_potion:'energy_potion',antidote:'antidote',ink:'ink',paper:'paper',parchment:'parchment',book:'book',map:'map',writing_quill:'writing_quill',ruler:'ruler',drawing_compass:'drawing_compass',magnifying_glass:'magnifying_glass',compass:'compass',hourglass:'hourglass',pulley:'pulley',wood_wheel:'wood_wheel',reinforced_wheel:'reinforced_wheel',crank:'crank',lever:'lever',axle:'axle',bearing:'bearing',simple_mechanism:'simple_mechanism',advanced_mechanism:'advanced_mechanism',lock:'lock',key:'key',padlock:'padlock',bell:'bell',piping:'piping',valve:'valve',hand_pump:'hand_pump',bellows:'bellows',hand_mill:'hand_mill',press:'press',loom:'loom',wood_door:'wood_door',reinforced_door:'reinforced_door',window:'window',ladder:'ladder',fence:'fence',stone_wall:'stone_wall',brick_wall:'brick_wall',wood_floor:'wood_floor',roof:'roof',stone_pillar:'stone_pillar',stone_arch:'stone_arch',wood_bridge:'wood_bridge',stone_bridge:'stone_bridge',cart:'cart',wheelbarrow:'wheelbarrow',raft:'raft',boat:'boat',oar:'oar',sail:'sail',anchor:'anchor',backpack:'backpack',canteen:'canteen',sack:'sack',tent:'tent',bedroll:'bedroll',firestarter:'firestarter',repair_kit:'repair_kit',grappling_rope:'grappling_rope',spyglass:'spyglass',explorer_lantern:'explorer_lantern',polished_lens:'polished_lens',prism:'prism',magnet:'magnet',copper_coil:'copper_coil',precision_spring:'precision_spring',precision_gear:'precision_gear',clockwork:'clockwork',cable:'cable',insulator:'insulator',switch:'switch',primitive_battery:'primitive_battery',dynamo:'dynamo',simple_motor:'simple_motor',bulb:'bulb',electric_lamp:'electric_lamp',fuse:'fuse',connector:'connector',electric_panel:'electric_panel',generator:'generator',electromagnet:'electromagnet',thermometer:'thermometer',barometer:'barometer',microscope:'microscope',telescope:'telescope',balance:'balance',graduated_cylinder:'graduated_cylinder',flask:'flask',distiller:'distiller',reagent:'reagent',science_kit:'science_kit',advanced_alloy:'advanced_alloy',optical_glass:'optical_glass',precision_mechanism:'precision_mechanism',advanced_motor:'advanced_motor',accumulator:'accumulator',complex_machine:'complex_machine',tech_core:'tech_core'};const GLYPH={water:'💧',fire:'🔥',steam:'♨️',seed:'🌱',campfire:'🔥',axe:'🪓',wheat:'🌾',kiln:'🏺',torch:'🔥',handle:'🪵',hammer:'🔨',pickaxe:'⛏️',saw:'🪚',wheel:'🛞',axle:'⚙️',gear:'⚙️',door:'🚪',window:'🪟',roof:'🏠',shelter:'⛺',house:'🏠',field:'🌾',flour:'🌾',dough:'🥣',bread:'🍞',workbench:'🛠️',forge:'⚒️',mill:'🌬️',pulley:'⚙️',cart:'🛒',machine:'⚙️',factory:'🏭',magnet:'🧲',wire:'〰️',coil:'🌀',generator:'⚡',electricity:'⚡',filament:'💡',bulb:'💡',battery:'🔋',motor:'⚙️',vehicle:'🚙',bridge:'🌉',lens:'🔎',microscope:'🔬',telescope:'🔭',laboratory:'🧪',experiment:'⚗️',workshop:'🛠️',electric_shop:'⚡',computer:'💻',chip:'🔳',radio:'📻',antenna:'📡',signal:'📶',star_map:'🌌',observatory:'🔭',fuel:'⛽',rocket:'🚀',space_pad:'🛰️',satellite:'🛰️',pressure:'🌡️',time:'⏳',life:'🧬',heat:'🌡️',motion:'💨',technology:'🤖',automaton:'🤖',moon_bread:'🥖',eternal_flame:'🔥',sky_garden:'🌿',oracle:'🔮'};const icon=it=>ART[it.id]?`<span class="item-art"><img src="assets/items/${ART[it.id]}.webp" alt="" draggable="false"></span>`:`<span class="item-glyph" aria-hidden="true">${GLYPH[it.id]||({Naturaleza:'🌿',Calor:'🔥',Herramientas:'🛠️',Materiales:'🧱',Agricultura:'🌱',Minerales:'💎',Construcción:'🏗️',Estaciones:'⚙️',Mecánica:'⚙️',Transporte:'🛞',Electricidad:'⚡',Energía:'⚡',Ciencia:'🧪',Tecnología:'💻',Conceptos:'✨',Espacio:'🚀',Secretos:'🔮'}[it.category]||'✨')}</span>`;
const EXPEDITIONS=[
{id:'quarry',name:'Cantera cercana',icon:'🪨',desc:'Roca expuesta y vetas superficiales. Ideal para empezar.',requires:[],durations:[5,15,30],loot:[['stone',65],['flint',16],['coal',14],['clay',5]]},
{id:'shallow',name:'Mina superficial',icon:'⛏️',desc:'Galerías poco profundas con los primeros metales.',requires:['stone_pickaxe'],durations:[15,30,120],loot:[['stone',34],['coal',22],['copper',18],['iron',14],['tin',9],['sulfur',3]]},
{id:'deep',name:'Mina profunda',icon:'🕳️',desc:'Más tiempo bajo tierra, mejores vetas y más riesgo.',requires:['iron_pickaxe'],durations:[30,120,480],loot:[['iron',28],['copper',22],['tin',15],['coal',12],['silver',9],['gold',5],['sulfur',7],['obsidian',2]]},
{id:'crystal',name:'Caverna cristalina',icon:'💎',desc:'Una expedición larga a cámaras con minerales raros.',requires:['iron_pickaxe','explorer_lantern'],durations:[120,480],loot:[['quartz',35],['lapis',22],['amethyst',18],['silver',10],['emerald',8],['gold',5],['diamond',2]]}
];
const expById=id=>EXPEDITIONS.find(x=>x.id===id);
const hasReq=id=>!!S.discovered[id];
function toolTier(){if(S.discovered.iron_pickaxe)return 3;if(S.discovered.stone_pickaxe)return 2;return 1}
function durationLabel(m){return m<60?`${m} min`:`${m/60} h`}
function expeditionUnlocked(e){return e.requires.every(hasReq)}
function fmtCountdown(ms){if(ms<=0)return'Lista para recoger';const s=Math.ceil(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;return h?`${h}h ${String(m).padStart(2,'0')}m`:`${m}m ${String(ss).padStart(2,'0')}s`}
function makeLoot(exp,mins){
 const tier=toolTier(),depth=Math.max(1,Math.log2(Math.max(5,mins)/5)+1),rolls=Math.max(2,Math.round(depth*2+tier));
 const pool=exp.loot,got={};
 for(let r=0;r<rolls;r++){
   const total=pool.reduce((n,x)=>n+x[1],0);let x=Math.random()*total,pick=pool[0][0];
   for(const [id,w] of pool){x-=w;if(x<=0){pick=id;break}}
   got[pick]=(got[pick]||0)+Math.max(1,Math.round((.75+Math.random()*.8)*depth*(1+(tier-1)*.22)));
 }
 return got
}
function equipmentLabel(){return S.discovered.iron_pickaxe?'Pico de hierro':S.discovered.stone_pickaxe?'Pico de piedra':'Herramientas manuales'}
function renderExpeditionPanel(){
 const box=$('#expeditionPanel');if(!box)return;
 const ex=S.expeditions?.active;
 if(!ex){
   const unlocked=EXPEDITIONS.filter(expeditionUnlocked);
   box.innerHTML=`<div class="exp-head"><div><small>EXPEDICIONES</small><h3>Exploración minera</h3></div><span>⛏️</span></div><p>Envía al explorador y recoge minerales incluso mientras no estás jugando.</p><div class="exp-meta"><b>${unlocked.length}/${EXPEDITIONS.length} destinos</b><span>Equipo: ${equipmentLabel()}</span></div><button class="primary exp-open" id="openExpeditions">Preparar expedición</button>`;
   $('#openExpeditions').onclick=showExpeditions;
   return
 }
 const e=expById(ex.destination),left=ex.endsAt-Date.now(),done=left<=0;
 box.innerHTML=`<div class="exp-head"><div><small>EXPLORADOR EN RUTA</small><h3>${e.icon} ${e.name}</h3></div><span class="exp-status ${done?'ready':''}">${done?'✓':'…'}</span></div><p>${done?'La expedición ha regresado. El botín está esperando.':`Equipo: ${ex.equipment}`}</p><div class="exp-timer" data-exp-countdown>${fmtCountdown(left)}</div><button class="primary" id="expAction">${done?'Recoger botín':'Ver expedición'}</button>`;
 $('#expAction').onclick=done?showExpeditionResult:()=>showActiveExpedition()
}
function showExpeditions(){
 modal(`<div class="exp-modal"><small>EXPEDICIONES</small><h2>¿A dónde enviamos al explorador?</h2><p class="muted">El equipo se selecciona automáticamente. Las expediciones continúan con el juego cerrado.</p><div class="exp-destinations">${EXPEDITIONS.map(e=>{const ok=expeditionUnlocked(e),missing=e.requires.filter(x=>!hasReq(x));return `<button class="exp-destination ${ok?'':'locked'}" ${ok?`data-exp-dest="${e.id}"`:''}><span>${e.icon}</span><div><b>${e.name}</b><small>${ok?e.desc:`Requiere ${missing.map(x=>item(x)?.name||x).join(' + ')}`}</small></div><strong>${ok?'›':'🔒'}</strong></button>`}).join('')}</div></div>`);
 setTimeout(()=>$$('[data-exp-dest]').forEach(b=>b.onclick=()=>chooseExpedition(b.dataset.expDest)),0)
}
function chooseExpedition(id){
 const e=expById(id);
 modal(`<div class="exp-modal"><small>${e.icon} ${e.name.toUpperCase()}</small><h2>Duración</h2><p>${e.desc}</p><div class="equipment-card"><span>🎒</span><div><small>EQUIPO AUTOMÁTICO</small><b>${equipmentLabel()}</b></div></div><div class="duration-grid">${e.durations.map(m=>`<button type="button" data-exp-start="${id}" data-exp-min="${m}"><b>${durationLabel(m)}</b><small>${m<=15?'Superficie':m<=30?'Vetas cercanas':m<=120?'Profundidad media':'Expedición profunda'}</small></button>`).join('')}</div></div>`);
}
async function startExpedition(id,mins){
 const e=expById(id);if(!e||!expeditionUnlocked(e)||S.expeditions.active)return;
 const now=Date.now(),loot=makeLoot(e,mins);
 S.expeditions.active={destination:id,minutes:mins,startedAt:now,endsAt:now+mins*60000,equipment:equipmentLabel(),loot,doubled:false};
 S.stats.expeditions=(S.stats.expeditions||0)+1;
 close();renderWorld();toast(`${e.name}: expedición iniciada`);
 await persist()
}
function showActiveExpedition(){
 const ex=S.expeditions.active,e=expById(ex.destination),left=ex.endsAt-Date.now();
 modal(`<div class="exp-modal"><span class="exp-big">${e.icon}</span><small>EXPEDICIÓN EN CURSO</small><h2>${e.name}</h2><div class="exp-timer big" id="modalExpTimer">${fmtCountdown(left)}</div><p>${ex.equipment} · ${durationLabel(ex.minutes)}</p><p class="muted">Puedes cerrar CRAFTERRA. El reloj continúa igualmente.</p></div>`)
}
function lootHTML(loot,mult=1){return Object.entries(loot).map(([id,q])=>`<div class="loot-row">${icon(item(id))}<b>${item(id).name}</b><strong>×${q*mult}</strong></div>`).join('')}
function showExpeditionResult(){
 const ex=S.expeditions.active;if(!ex||Date.now()<ex.endsAt)return showActiveExpedition();
 const e=expById(ex.destination);
 modal(`<div class="exp-modal"><small>EXPEDICIÓN COMPLETADA</small><h2>${e.icon} ${e.name}</h2><div class="loot-list">${lootHTML(ex.loot)}</div><button class="primary" id="collectLoot">Recoger</button><button class="reward-ad" id="doubleLoot">▶ DUPLICAR BOTÍN</button><small class="ad-note">Anuncio recompensado · opcional</small></div>`);
 setTimeout(()=>{$('#collectLoot').onclick=()=>collectExpedition(false);$('#doubleLoot').onclick=()=>collectExpedition(true)},0)
}
async function collectExpedition(double){
 const ex=S.expeditions.active;if(!ex||Date.now()<ex.endsAt)return;
 let mult=1;
 if(double){const watched=await playAlmaPrintRewarded();if(!watched){toast('Vídeo cancelado · no se duplica la recompensa.');return}mult=2}
 const fresh=[];
 for(const [id,q] of Object.entries(ex.loot)){S.stock[id]=(S.stock[id]||0)+q*mult;if(!S.discovered[id]){S.discovered[id]=Date.now();fresh.push(id)}}
 S.expeditions.history.unshift({...ex,collectedAt:Date.now(),multiplier:mult});S.expeditions.history=S.expeditions.history.slice(0,20);S.expeditions.active=null;S.xp+=25*mult;
 await persist();close();renderWorld();renderCraft();
 if(fresh.length)modal(`<div class="discovery"><small>LA EXPEDICIÓN HA DESCUBIERTO</small><h2>${fresh.map(id=>item(id).name).join(' · ')}</h2><p>Nuevos recursos añadidos al Archivo.</p></div>`);
 else toast(mult===2?'Botín duplicado y recogido':'Botín recogido')
}
function tickExpeditions(){
 const ex=S?.expeditions?.active;if(!ex)return;
 const el=$('[data-exp-countdown]');if(el)el.textContent=fmtCountdown(ex.endsAt-Date.now());
 const mel=$('#modalExpTimer');if(mel)mel.textContent=fmtCountdown(ex.endsAt-Date.now());
 if(ex.endsAt<=Date.now()&&el&&!el.dataset.ready){el.dataset.ready='1';renderExpeditionPanel()}
}

function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),1900)}function modal(html){$('#modalBody').innerHTML=html;$('#modal').hidden=false}function close(){ $('#modal').hidden=true }
function evaluateProgress(){
 let bonus=0;
 const awards=[];
 MISSIONS.forEach(m=>{
   if(S.discovered[m.target]&&!S.missions[m.id]){
     S.missions[m.id]=true;
     bonus+=m.reward;S.xp+=m.xp;
     awards.push({kind:'mission',name:m.name,coins:m.reward,xp:m.xp})
   }
 });
 COLLECTIONS.forEach(c=>{
   if(c.items.every(id=>S.discovered[id])&&!S.collections[c.id]){
     S.collections[c.id]=true;
     bonus+=c.coins;S.xp+=c.xp;
     awards.push({kind:'collection',name:c.name,coins:c.coins,xp:c.xp})
   }
 });
 const metrics=[Object.keys(S.discovered).length,S.stats.merges,Object.keys(S.collections).length,S.world.length];
 ACHIEVEMENTS.forEach(x=>{
   if(metrics[x.type]>=x.value&&!S.achievements[x.id]){
     S.achievements[x.id]=true;
     bonus+=x.reward;
     awards.push({kind:'achievement',name:x.name,coins:x.reward,xp:0})
   }
 });
 if(bonus){S.coins+=bonus;S.level=1+Math.floor(S.xp/250)}
 return awards
}
let rewardQueue=[],rewardShowing=false;
function displayedCoins(){
 const raw=$('#coins')?.textContent||'0';
 const n=Number(raw.replace(/[^0-9]/g,''));
 return Number.isFinite(n)?n:S.coins
}
function setCoinText(n){
 const el=$('#coins');
 if(el)el.textContent=Math.round(n).toLocaleString('es')
}
function animateCoins(from,to,duration=900){
 return new Promise(resolve=>{
   if(from===to){setCoinText(to);resolve();return}
   const start=performance.now();
   const step=now=>{
     const p=Math.min(1,(now-start)/duration);
     const eased=1-Math.pow(1-p,3);
     setCoinText(from+(to-from)*eased);
     if(p<1)requestAnimationFrame(step);
     else{setCoinText(to);resolve()}
   };
   requestAnimationFrame(step)
 })
}
function ensureRewardLayer(){
 let layer=$('#rewardLayer');
 if(!layer){
   layer=document.createElement('div');
   layer.id='rewardLayer';
   layer.className='reward-layer';
   document.body.append(layer)
 }
 return layer
}
function queueRewards(awards,coinEnd){
 if(!awards.length)return;
 rewardQueue.push({awards,coinEnd});
 runRewardQueue()
}
async function runRewardQueue(){
 if(rewardShowing||!rewardQueue.length)return;
 rewardShowing=true;
 while(rewardQueue.length){
   const batch=rewardQueue.shift();
   const layer=ensureRewardLayer();
   const start=displayedCoins();
   const target=batch.coinEnd;
   const coinAnim=animateCoins(start,target,1500);

   for(const award of batch.awards){
     const pop=document.createElement('div');
     pop.className=`reward-pop compact ${award.kind}`;

     const symbol=award.kind==='collection'?'🏆':
                  award.kind==='mission'?'◇':
                  award.kind==='daily'?'☀️':
                  award.kind==='mastery'?'⭐':'★';

     const title=award.kind==='collection'?'COLECCIÓN COMPLETADA':
                 award.kind==='mission'?'MISIÓN COMPLETADA':
                 award.kind==='daily'?'DESAFÍO DIARIO SUPERADO':
                 award.kind==='mastery'?'MAESTRÍA ALCANZADA':
                 'LOGRO CONSEGUIDO';

     const detail=award.kind==='mastery'
       ? award.unlock
       : `+${award.coins.toLocaleString('es')} ◆${award.xp?` · +${award.xp} XP`:''}`;

     pop.innerHTML=`
       <div class="reward-accent"></div>
       <div class="reward-emblem">${symbol}</div>
       <div class="reward-copy">
         <small>${title}</small>
         <b>${award.name}${award.kind==='mastery'?` · Nivel ${award.level===4?'MÁX':award.level}`:''}</b>
         <span>${detail}</span>
       </div>
       <button class="reward-close" aria-label="Cerrar">×</button>
       <div class="reward-shine"></div>`;

     layer.append(pop);

     let resolveDismiss;
     const dismissed=new Promise(r=>resolveDismiss=r);
     const dismiss=()=>{
       if(pop.dataset.closing)return;
       pop.dataset.closing='1';
       pop.classList.remove('show');
       pop.classList.add('hide');
       setTimeout(()=>{pop.remove();resolveDismiss()},280);
     };

     pop.querySelector('.reward-close')?.addEventListener('click',e=>{e.stopPropagation();dismiss()});
     pop.addEventListener('click',e=>{if(!e.target.closest('.reward-close'))dismiss()});

     requestAnimationFrame(()=>pop.classList.add('show'));

     // Give enough time to actually read it, but don't hijack the whole screen.
     const auto=setTimeout(dismiss,6500);
     await dismissed;
     clearTimeout(auto);
   }

   await coinAnim;
   const wallet=document.querySelector('.wallet');
   wallet?.classList.add('reward-pulse');
   setTimeout(()=>wallet?.classList.remove('reward-pulse'),800)
 }
 rewardShowing=false
}
async function persist(){
 const before=S.coins;
 const awards=evaluateProgress();
 await save(S);
 if(awards.length){
   renderHeader(before);
   queueRewards(awards,S.coins)
 }else renderHeader()
}
function renderHeader(coinOverride=null){
 $('#coins').textContent=(coinOverride===null?S.coins:coinOverride).toLocaleString('es');
 $('#level').textContent=S.level;
 const e=eraFor(S);
 $('#eraLabel').textContent=`ERA ${['I','II','III','IV','V','VI','VII'][e]}`;
 $('#eraName').textContent=CONFIG.eras[e][0]
}
function showView(v){$$('.view').forEach(x=>x.classList.toggle('active',x.id===`view-${v}`));$$('nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===v));if(v==='craft')renderCraft();if(v==='book')renderBook();if(v==='goals')renderGoals();if(v==='shop')renderShop()}
function renderWorld(){const tiles=$('#worldTiles');tiles.innerHTML=Array.from({length:25},(_,i)=>`<i style="--x:${i%5};--y:${Math.floor(i/5)}"></i>`).join('');$('#worldBuildings').innerHTML=S.world.map((id,i)=>`<button class="building" style="--x:${(i*2)%5};--y:${Math.floor(i/3)%5}" data-item="${id}">${icon(item(id))}<small>${item(id).name}</small></button>`).join('');const next=MISSIONS.find(m=>!S.discovered[m.target]);$('#missionHint').textContent=next?`Objetivo: ${next.name}`:'¡Has completado la campaña!';$('#questStrip').innerHTML=next?`<b>${next.name}</b><span>Descubre ${item(next.target).name}</span><strong>+${next.reward}</strong>`:'<b>Horizonte alcanzado</b><span>Sigue experimentando</span>';renderExpeditionPanel()}
function stockOf(id){return Math.max(0,Number(S.stock?.[id]||0))}
function boardQty(id){return board.reduce((n,x)=>n+(x===id?1:0),0)}
function canPlaceFromInventory(id){return stockOf(id)>boardQty(id)}
function renderCraft(){const known=ITEMS.filter(i=>S.discovered[i.id]);$('#inventoryGrid').innerHTML=known.map(i=>`<button class="item" data-add="${i.id}">${icon(i)}<small>${i.name}</small>${S.stock[i.id]?`<em class="qty">×${S.stock[i.id]}</em>`:''}</button>`).join('');$('#stationBar').innerHTML=['none',...STATIONS.filter(x=>S.discovered[x])].map((id,i)=>`<button>${i?'⚙ '+item(id).name:'Mesa libre'}</button>`).join('');renderBoard();renderDailyRun()}
function renderBoard(){const b=$('#craftBoard');b.querySelectorAll('.piece').forEach(x=>x.remove());board.forEach((id,i)=>{const it=item(id),el=document.createElement('button');el.className='piece';el.dataset.index=i;el.style.cssText=`--x:${18+(i%4)*22}%;--y:${25+Math.floor(i/4)*28}%;`;el.innerHTML=icon(it)+`<small>${it.name}</small>`;el.draggable=true;el.addEventListener('pointerdown',dragStart);b.append(el)})}
function dragStart(ev){const el=ev.currentTarget,idx=+el.dataset.index;el.setPointerCapture(ev.pointerId);el.classList.add('held');const move=e=>{const r=$('#craftBoard').getBoundingClientRect();el.style.left=`${e.clientX-r.left}px`;el.style.top=`${e.clientY-r.top}px`;el.style.transform='translate(-50%,-50%) scale(1.12)'};const up=async e=>{el.removeEventListener('pointermove',move);el.classList.remove('held');el.style.pointerEvents='none';const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.piece');el.style.pointerEvents='';if(target&&+target.dataset.index!==idx){await doMerge(idx,+target.dataset.index)}else renderBoard()};el.addEventListener('pointermove',move);el.addEventListener('pointerup',up,{once:true})}
async function doMerge(i,j){
 const a=board[i],b=board[j];
 const need={};need[a]=(need[a]||0)+1;need[b]=(need[b]||0)+1;
 for(const [id,q] of Object.entries(need)){
   if(stockOf(id)<q){toast(`No tienes suficiente ${item(id)?.name||'material'}.`);renderCraft();return}
 }
 const out=merge(S,a,b);
 const masteryAwards=out.ok?recordMastery(out.recipe?.id,1,'manual'):[];
 if(!out.ok){
   toast(['Eso no parece funcionar.','Interesante… pero no.','Quizá necesites otra herramienta.'][S.stats.failed%3]);
   renderBoard();persist();return
 }
 for(const [id,q] of Object.entries(need))S.stock[id]=Math.max(0,stockOf(id)-q);
 S.stock[out.result.id]=stockOf(out.result.id)+1;
 board=board.filter((_,k)=>k!==i&&k!==j);
 board.push(out.result.id);

 if(dailyRun)trackDailyMerge(out.result.id);

 // Refresh the whole crafting view immediately:
 // consumed materials disappear/decrease and the new item appears at once.
 renderCraft();

 if(out.fresh){
   modal(`<div class="discovery">${icon(out.result)}<small>NUEVO DESCUBRIMIENTO</small><h2>${out.result.name}</h2><b>${out.result.rarity} · ERA ${out.result.era}</b><p>${out.result.description}</p><strong>+${CONFIG.rewards[out.result.rarity]} monedas</strong></div>`);
   renderWorld()
 }
 await persist();
 if(masteryAwards.length)queueRewards(masteryAwards,S.coins)
}
function renderBook(){
 const hintEntries=Object.values(S.hintLibrary||{}).sort((x,y)=>(y.purchasedAt||0)-(x.purchasedAt||0));
 $('#hintBookCount').textContent=hintEntries.length;
 $$('[data-book-mode]').forEach(x=>x.classList.toggle('selected',x.dataset.bookMode===bookMode));
 const filters=$('#filters'),grid=$('#bookGrid'),library=$('#hintLibrary');
 if(bookMode==='hints'){
   filters.hidden=true;grid.hidden=true;library.hidden=false;
   filters.style.display='none';grid.style.display='none';library.style.display='grid';
   $('#bookCount').textContent=`${hintEntries.length} pistas`;
   if(!hintEntries.length){
     library.innerHTML=`<div class="hint-empty"><span>💡</span><h3>Tu cuaderno de pistas está vacío</h3><p>Cada pista que compres quedará guardada aquí permanentemente.</p></div>`;
     return
   }
   library.innerHTML=hintEntries.map((x,i)=>{
     const target=item(x.result),needs={};if(x.a)needs[x.a]=(needs[x.a]||0)+1;if(x.b)needs[x.b]=(needs[x.b]||0)+1;
     const mats=Object.entries(needs).map(([id,q])=>`${item(id)?.name||id}${q>1?` ×${q}`:''}`).join(' · ');
     const done=!!S.discovered[x.result];
     const date=x.purchasedAt?new Date(x.purchasedAt).toLocaleDateString('es-ES'):'';
     return `<article class="hint-note ${done?'solved':''}" data-hint-note="${x.key||i}">
       <div class="hint-note-head"><span>💡</span><div><small>PISTA ${done?'RESUELTA':'GUARDADA'}${date?` · ${date}`:''}</small><b>${done&&target?target.name:'Descubrimiento pendiente'}</b></div>${done?'<strong>✓</strong>':''}</div>
       <p>${x.text}</p>
       <div class="hint-note-meta"><span>Materiales que tenías al comprarla</span><b>${mats||'—'}</b></div>
     </article>`
   }).join('');
   return
 }
 filters.hidden=false;grid.hidden=false;library.hidden=true;
 filters.style.display='flex';grid.style.display='grid';library.style.display='none';
 const cats=['Todos',...new Set(ITEMS.map(x=>x.category))];
 filters.innerHTML=cats.map(x=>`<button class="${filter===x?'selected':''}" data-filter="${x}">${x}</button>`).join('');
 const list=ITEMS.filter(x=>filter==='Todos'||x.category===filter);
 $('#bookCount').textContent=`${Object.keys(S.discovered).length} / ${ITEMS.length}`;
 grid.innerHTML=list.map(i=>`<button class="card ${S.discovered[i.id]?'':'locked'}" data-detail="${i.id}">${S.discovered[i.id]?icon(i):'<span class="unknown">?</span>'}<b>${S.discovered[i.id]?i.name:'Desconocido'}</b><small>${S.discovered[i.id]?i.rarity:'???'}</small></button>`).join('')
}



const MASTERY_LEVELS=[
 {level:0,min:0,next:5,batch:1,label:'Aprendida'},
 {level:1,min:5,next:15,batch:2,label:'Maestría I'},
 {level:2,min:15,next:40,batch:5,label:'Maestría II'},
 {level:3,min:40,next:100,batch:10,label:'Maestría III'},
 {level:4,min:100,next:null,batch:10,label:'Maestría Máxima'}
];
function masteryState(rid){
 const v=S.mastery?.[rid]||{};
 return{uses:Math.max(0,Number(v.uses)||0),manual:Math.max(0,Number(v.manual)||0),auto:Math.max(0,Number(v.auto)||0)}
}
function masteryInfo(rid){
 const m=masteryState(rid),uses=m.uses;
 let tier=MASTERY_LEVELS[0];
 for(const x of MASTERY_LEVELS)if(uses>=x.min)tier=x;
 return{...m,...tier}
}
function masteryRecipeForResult(id){
 const rs=learnedRecipesFor(id);
 if(!rs.length)return null;
 return [...rs].sort((x,y)=>masteryState(y.id).uses-masteryState(x.id).uses)[0]
}
function masteryUnlock(level){
 return level===1?'Fabricar ×2':level===2?'Fabricar ×5':level===3?'Fabricar ×10':level===4?'Insignia de Maestría Máxima':''
}
function recordMastery(recipeId,count=1,mode='auto'){
 if(!recipeId||count<=0)return[];
 S.mastery=S.mastery||{};
 const before=masteryInfo(recipeId);
 const v=S.mastery[recipeId]||{uses:0,manual:0,auto:0};
 v.uses=(Number(v.uses)||0)+count;
 if(mode==='manual')v.manual=(Number(v.manual)||0)+count;
 else v.auto=(Number(v.auto)||0)+count;
 S.mastery[recipeId]=v;
 const after=masteryInfo(recipeId),awards=[];
 if(after.level>before.level){
   const r=RECIPES.find(x=>x.id===recipeId);
   for(let lvl=before.level+1;lvl<=after.level;lvl++){
     awards.push({kind:'mastery',name:item(r?.result)?.name||'Receta',coins:0,xp:0,level:lvl,unlock:masteryUnlock(lvl)})
   }
 }
 return awards
}
function recordPlanMastery(plan,qty=1){
 const counts={};
 for(const rid of plan.steps||[])counts[rid]=(counts[rid]||0)+qty;
 let awards=[];
 for(const [rid,n] of Object.entries(counts))awards.push(...recordMastery(rid,n,'auto'));
 return awards
}
function masteryCardHTML(id){
 const r=masteryRecipeForResult(id);if(!r)return'';
 const m=masteryInfo(r.id);
 const max=m.level===4;
 const start=m.min,end=m.next;
 const pct=max?100:Math.max(0,Math.min(100,((m.uses-start)/(end-start))*100));
 const progress=max?'Maestría completada':`${m.uses} / ${end} fabricaciones`;
 const next=max?'Todas las ventajas desbloqueadas':`Siguiente: ${masteryUnlock(m.level+1)}`;
 return `<section class="mastery-card ${max?'max':''}">
   <div class="mastery-head"><div><small>⭐ MAESTRÍA DE RECETA</small><b>${m.label}</b></div><strong>${max?'✦':m.level}</strong></div>
   <div class="mastery-bar"><i style="width:${pct}%"></i></div>
   <div class="mastery-meta"><span>${progress}</span><b>${next}</b></div>
   <div class="mastery-stats"><span>Manual ${m.manual}</span><span>Automática ${m.auto}</span></div>
 </section>`
}
function masteryBatchChoices(id){
 const r=masteryRecipeForResult(id);if(!r)return[1];
 const level=masteryInfo(r.id).level;
 return [1,...(level>=1?[2]:[]),...(level>=2?[5]:[]),...(level>=3?[10]:[])]
}

function learnedRecipesFor(result){
 return RECIPES.filter(r=>r.result===result&&S.knownRecipes?.[r.id])
}
function addQty(obj,id,q=1){obj[id]=(obj[id]||0)+q}
function mergeQty(a,b){
 const out={...a};for(const [id,q] of Object.entries(b||{}))addQty(out,id,q);return out
}
function variantKey(v){
 const cost=Object.entries(v.cost||{}).filter(([,q])=>q).sort().map(([id,q])=>`${id}:${q}`).join('|');
 const make=Object.entries(v.make||{}).filter(([,q])=>q).sort().map(([id,q])=>`${id}:${q}`).join('|');
 return `${cost}#${make}`
}
function ingredientVariants(id,depth=0,seen=new Set()){
 // Option A: use this already-made component directly.
 const out=[{cost:{[id]:1},make:{},steps:[]}];
 if(depth>=8||seen.has(id))return out;

 const nextSeen=new Set(seen);nextSeen.add(id);
 for(const r of learnedRecipesFor(id)){
   const left=ingredientVariants(r.a,depth+1,nextSeen);
   const right=ingredientVariants(r.b,depth+1,nextSeen);
   for(const A of left)for(const B of right){
     const make=mergeQty(A.make,B.make);addQty(make,id,1);
     out.push({
       cost:mergeQty(A.cost,B.cost),
       make,
       steps:[...(A.steps||[]),...(B.steps||[]),r.id]
     })
   }
 }

 // Deduplicate. Keep enough variety for deep trees without exploding the UI.
 const unique=new Map();
 for(const v of out)if(!unique.has(variantKey(v)))unique.set(variantKey(v),v);
 return [...unique.values()]
   .sort((x,y)=>{
     const xm=Object.values(x.make).reduce((n,q)=>n+q,0),ym=Object.values(y.make).reduce((n,q)=>n+q,0);
     if(xm!==ym)return xm-ym;
     return Object.values(x.cost).reduce((n,q)=>n+q,0)-Object.values(y.cost).reduce((n,q)=>n+q,0)
   })
   .slice(0,12)
}
function directPlans(target){
 const routes=learnedRecipesFor(target);
 if(!routes.length)return[];

 const plans=[];
 for(const root of routes){
   const left=ingredientVariants(root.a,0,new Set([target]));
   const right=ingredientVariants(root.b,0,new Set([target]));
   for(const A of left)for(const B of right){
     const cost=mergeQty(A.cost,B.cost);
     const make=mergeQty(A.make,B.make);
     const missing={};
     for(const [id,q] of Object.entries(cost)){
       const lack=Math.max(0,q-stockOf(id));
       if(lack)addQty(missing,id,lack)
     }
     plans.push({
       root,
       cost,
       make,
       steps:[...(A.steps||[]),...(B.steps||[]),root.id],
       missing,
       ok:Object.keys(missing).length===0
     })
   }
 }

 const unique=new Map();
 for(const p of plans){
   const key=variantKey(p);
   if(!unique.has(key))unique.set(key,p)
 }

 // Show feasible routes first, then routes that are closest to being feasible.
 return [...unique.values()]
   .sort((x,y)=>{
     if(x.ok!==y.ok)return x.ok?-1:1;
     const xmiss=Object.values(x.missing).reduce((n,q)=>n+q,0),ymiss=Object.values(y.missing).reduce((n,q)=>n+q,0);
     if(xmiss!==ymiss)return xmiss-ymiss;
     const xmake=Object.values(x.make).reduce((n,q)=>n+q,0),ymake=Object.values(y.make).reduce((n,q)=>n+q,0);
     if(xmake!==ymake)return xmake-ymake;
     return Object.values(x.cost).reduce((n,q)=>n+q,0)-Object.values(y.cost).reduce((n,q)=>n+q,0)
   })
   .slice(0,10)
}

function scaledPlan(plan,qty=1){
 const scale=obj=>Object.fromEntries(Object.entries(obj||{}).map(([id,q])=>[id,q*qty]));
 const cost=scale(plan.cost),make=scale(plan.make),missing={};
 for(const [id,q] of Object.entries(cost)){
   const lack=Math.max(0,q-stockOf(id));
   if(lack)missing[id]=lack
 }
 return{...plan,cost,make,missing,ok:Object.keys(missing).length===0,qty}
}

function routeName(plan){
 const made=Object.values(plan.make||{}).reduce((n,q)=>n+q,0);
 if(!made)return'Usar componentes preparados';
 const directCount=Object.entries(plan.cost||{}).filter(([id])=>learnedRecipesFor(id).length).reduce((n,[,q])=>n+q,0);
 return directCount?'Ruta mixta':'Desde materiales base'
}
function routeMaterialsHTML(plan){
 return `<div class="route-materials">${Object.entries(plan.cost||{}).map(([id,q])=>{
   const have=stockOf(id),ok=have>=q;
   return `<div class="route-mat ${ok?'':'short'}">${icon(item(id))}<span><b>${item(id).name}</b><small>Tienes ${have}</small></span><strong>×${q}</strong></div>`
 }).join('')}</div>`
}
function autoStepsHTML(plan){
 const rows=Object.entries(plan.make||{}).filter(([,q])=>q>0);
 if(!rows.length)return'';
 return `<div class="auto-steps"><small>SE CREARÁ AUTOMÁTICAMENTE</small>${rows.map(([id,q])=>`<span>${item(id).name}${q>1?` ×${q}`:''}</span>`).join('')}</div>`
}
function missingRowsHTML(plan,target){
 const rows=Object.entries(plan.missing||{}).filter(([,q])=>q>0);
 if(!rows.length)return'';
 return `<div class="direct-missing"><small>TE FALTA</small>${rows.map(([id,q])=>{
   const canTry=learnedRecipesFor(id).length>0;
   return `<div class="missing-row"><span>${item(id)?.name||id} ×${q}</span>${canTry?`<button data-direct-make-missing="${id}" data-direct-missing-qty="${q}" data-direct-return="${target}">Fabricar aquí</button>`:''}</div>`
 }).join('')}</div>`
}
function recipeChainHTML(id,depth=0,seen=new Set()){
 if(depth>8||seen.has(id))return'';
 const rs=learnedRecipesFor(id);if(!rs.length)return'';
 const r=rs[0];seen.add(id);
 const line=`<div class="chain-line" style="--depth:${depth}"><span>${item(r.a).name} + ${item(r.b).name}</span><b>→ ${item(id).name}</b></div>`;
 return recipeChainHTML(r.a,depth+1,new Set(seen))+recipeChainHTML(r.b,depth+1,new Set(seen))+line
}
function showDirectCraft(id,qty=1){
 const it=item(id),basePlans=directPlans(id);
 if(!learnedRecipesFor(id).length){toast('Todavía no has aprendido cómo fabricar este objeto.');return}
 const choices=masteryBatchChoices(id);
 if(!choices.includes(qty))qty=1;
 const plans=basePlans.map(p=>scaledPlan(p,qty));
 const r=masteryRecipeForResult(id),mi=r?masteryInfo(r.id):null;

 const cards=plans.map((p,i)=>`<article class="direct-route ${p.ok?'available':'blocked'}">
   <div class="route-head"><div><small>OPCIÓN ${i+1}</small><b>${routeName(p)}</b></div><strong>${p.ok?'✓':'!'}</strong></div>
   ${routeMaterialsHTML(p)}
   ${autoStepsHTML(p)}
   ${missingRowsHTML(p,id)}
   <button class="primary" data-direct-route="${id}" data-direct-route-index="${i}" data-direct-route-qty="${qty}" ${p.ok?'':'disabled'}>${p.ok?`FABRICAR ×${qty} CON ESTA OPCIÓN`:'NO DISPONIBLE'}</button>
 </article>`).join('');

 modal(`<div class="direct-modal"><small>FABRICACIÓN DIRECTA</small><div class="direct-title">${icon(it)}<div><h2>${it.name}</h2><span>Posees ×${stockOf(id)}</span></div></div>
 ${mi?`<div class="mastery-mini"><span>⭐ ${mi.label}</span><b>${mi.uses} usos</b></div>`:''}
 <div class="batch-picker"><small>CANTIDAD</small><div>${choices.map(n=>`<button class="${n===qty?'selected':''}" data-direct-qty="${id}" data-direct-qty-value="${n}">×${n}</button>`).join('')}</div></div>
 <p>Elige la ruta que prefieras. Los lotes se desbloquean dominando la receta.</p><div class="direct-routes">${cards||'<p>No hay rutas aprendidas.</p>'}</div><button class="direct-chain-btn" data-direct-chain="${id}">Ver cadena aprendida</button></div>`)
}
function showDirectChain(id){
 const html=recipeChainHTML(id);
 modal(`<div class="direct-modal"><small>CADENA APRENDIDA</small><h2>${item(id).name}</h2><p>Estos pasos pueden ejecutarse automáticamente durante la Fabricación directa.</p><div class="recipe-chain">${html||'<p>No hay pasos intermedios.</p>'}</div><button class="primary" data-direct-back="${id}">Volver</button></div>`)
}
function applyDirectPlan(id,plan,qty=1){
 for(const [mat,q] of Object.entries(plan.cost||{}))S.stock[mat]=Math.max(0,stockOf(mat)-q*qty);
 for(const [mid,q] of Object.entries(plan.make||{}))S.crafted[mid]=(S.crafted[mid]||0)+q*qty;
 S.stock[id]=stockOf(id)+qty;
 S.crafted[id]=(S.crafted[id]||0)+qty;
 return recordPlanMastery(plan,qty)
}
async function executeDirectCraft(id,routeIndex=0,qty=1,returnTo=null){
 const basePlans=directPlans(id),base=basePlans[routeIndex];
 if(!base){showDirectCraft(id,qty);return}
 const plan=scaledPlan(base,qty);
 if(!plan.ok){showDirectCraft(id,qty);return}
 const masteryAwards=applyDirectPlan(id,base,qty);
 await persist();
 if(masteryAwards.length)queueRewards(masteryAwards,S.coins);
 renderCraft();renderBook();
 if(returnTo){showDirectCraft(returnTo);toast(`${item(id).name} fabricado ×${qty}`)}
 else{close();toast(`${item(id).name} fabricado ×${qty}`)}
}
async function craftMissingHere(id,qty,parent){
 let made=0,allAwards=[];
 for(let n=0;n<qty;n++){
   const plans=directPlans(id),idx=plans.findIndex(p=>p.ok);
   if(idx<0)break;
   allAwards.push(...applyDirectPlan(id,plans[idx],1));
   made++
 }
 if(made){
   await persist();
   if(allAwards.length)queueRewards(allAwards,S.coins);
   renderCraft();renderBook();
   showDirectCraft(parent);
   toast(`${item(id).name} fabricado${made>1?` ×${made}`:' · +1'}`)
 }else{
   toast(`Todavía faltan materiales para fabricar ${item(id)?.name||'ese componente'}.`)
 }
}
function detail(id){
 const i=item(id);if(!S.discovered[id])return;
 const rs=RECIPES.filter(r=>r.result===id);
 const learned=rs.filter(r=>S.knownRecipes?.[r.id]);
 const plans=learned.length?directPlans(id):[];const plan=plans.find(p=>p.ok)||plans[0]||null;
 modal(`<div class="detail">${icon(i)}<h2>${i.name}</h2><b>${i.rarity} · ${i.category} · ERA ${i.era}</b><p>${i.description}</p><div class="detail-stock">En inventario <strong>×${stockOf(id)}</strong></div><h3>Recetas</h3>${rs.map(r=>S.knownRecipes?.[r.id]?`<p class="known-recipe">✓ ${item(r.a).name} + ${item(r.b).name} → ${i.name}</p>`:'<p>??? + ??? → '+i.name+'</p>').join('')||'<p>Elemento primario.</p>'}${masteryCardHTML(id)}${learned.length?`<div class="direct-card"><small>RECETA APRENDIDA</small><b>⚡ Fabricación directa</b><p>${plan?.ok?'Puedes fabricarlo sin construir manualmente los componentes intermedios.':'Conoces la receta, pero ahora mismo te faltan materiales para completar toda la cadena.'}</p><button class="primary" data-direct-craft="${id}">${plan?.ok?'FABRICAR':'VER MATERIALES'}</button></div>`:''}</div>`)
}
function renderGoals(){const list=goal==='missions'?MISSIONS:goal==='puzzles'?PUZZLES:goal==='collections'?COLLECTIONS:ACHIEVEMENTS;$('#goalsList').innerHTML=list.map(x=>{let done=goal==='collections'?x.items.every(i=>S.discovered[i]):goal==='achievements'?!!S.achievements[x.id]:!!S.discovered[x.target];let sub=goal==='collections'?`${x.items.filter(i=>S.discovered[i]).length}/${x.items.length}`:goal==='puzzles'?`Objetivo: ${item(x.target).name} · ${x.limit} fusiones`:goal==='missions'?`Descubre ${item(x.target).name}`:`Meta ${x.value}`;return`<article class="goal ${done?'done':''}"><span>${done?'✓':'◇'}</span><div><b>${x.name}</b><small>${sub}</small></div><strong>+${x.reward||x.coins} ◆</strong>${goal==='puzzles'?`<button data-puzzle="${x.id}">Jugar</button>`:''}</article>`}).join('')}

function recipeNeeds(r){
 const need={};
 if(r.a)need[r.a]=(need[r.a]||0)+1;
 if(r.b)need[r.b]=(need[r.b]||0)+1;
 return need
}
function hasRecipeMaterials(r){
 return Object.entries(recipeNeeds(r)).every(([id,q])=>stockOf(id)>=q)
}
function hintKey(r){return `${[r.a,r.b].filter(Boolean).sort().join('+')}>${r.result}`}
function eligibleHintRecipes(){
 if(!S.hintLibrary||typeof S.hintLibrary!=='object')S.hintLibrary={};
 return RECIPES.filter(r=>{
   try{
     if(!r||!r.result)return false;
     if(S.discovered?.[r.result]||stockOf(r.result)>0)return false;
     if(S.hintLibrary[hintKey(r)])return false;
     return hasRecipeMaterials(r)
   }catch(_){return false}
 })
}
function pickHintRecipe(){
 const list=eligibleHintRecipes();
 if(!list.length)return null;
 return list[Math.floor(Math.random()*list.length)]
}

const SHOP_OFFERS={
 resources:{
   id:'resources',name:'Suministros básicos',icon:'📦',price:100,currency:'coins',
   desc:'Recursos naturales para seguir experimentando.',
   contents:{stone:5,wood:5,water:3,earth:3,sand:3}
 },
 hint:{
   id:'hint',name:'Pista suave',icon:'💡',price:40,currency:'coins',
   desc:'Una orientación contextual para una receta que aún no has descubierto.'
 },
 ad:{
   id:'ad',name:'Cofre del inventor',icon:'🎁',price:0,currency:'rewarded',
   desc:'Mira un anuncio opcional y recibe una recompensa de monedas.'
 },
 coins_small:{
   id:'coins_small',name:'Puñado de monedas',icon:'◆',price:null,currency:'store',
   desc:'2.500 monedas. Compra real aún no activada en esta versión.'
 },
 coins_large:{
   id:'coins_large',name:'Bolsa de monedas',icon:'◆',price:null,currency:'store',
   desc:'7.500 monedas. Compra real aún no activada en esta versión.'
 },
 aurora:{
   id:'aurora',name:'Tema aurora',icon:'🌌',price:null,currency:'store',
   desc:'Personalización futura. Todavía no disponible.'
 }
};
function shopContentsHTML(contents,showTotals=false,mult=1){
 mult=Math.max(1,Math.min(99,Number(mult)||1));
 return Object.entries(contents).map(([id,q])=>{
   const amount=q*mult;
   const it=item(id),total=stockOf(id)+(showTotals?amount:0);
   return `<div class="shop-line">${icon(it)}<div><b>${it.name}</b>${showTotals?`<small>Ahora tienes ${total}</small>`:''}</div><strong>×${amount}</strong></div>`
 }).join('')
}
function renderShop(){
 const offers=Object.values(SHOP_OFFERS);
 $('#shopList').innerHTML=offers.map(o=>{
   const disabled=o.currency==='store';
   const action=o.currency==='coins'?`${o.price} ◆${o.contents?' / lote':''}`:o.currency==='rewarded'?'VER ANUNCIO':'PRÓXIMAMENTE';
   const detail=o.contents?Object.entries(o.contents).map(([id,q])=>`${item(id).name} ×${q}`).join(' · '):o.desc;
   return `<article class="offer ${disabled?'disabled':''}">
     <span class="shopicon">${o.icon}</span>
     <div><b>${o.name}</b><small>${detail}</small></div>
     <button ${disabled?'disabled':''} data-offer="${o.id}">${action}</button>
   </article>`
 }).join('')
}
function confirmShopOffer(id,qty=1){
 const o=SHOP_OFFERS[id];if(!o)return;
 qty=Math.max(1,Math.min(99,Number(qty)||1));
 if(o.currency==='store'){toast('Esta compra todavía no está disponible.');return}
 if(id==='hint'){
   qty=1;
   try{
     pendingHint=pickHintRecipe();
     if(!pendingHint){
       modal(`<div class="shop-confirm"><small>PISTAS</small><h2>💡 No hay una pista útil ahora mismo</h2><p>Ahora mismo no tienes materiales para ninguna receta desconocida que pueda recibir una pista nueva. No se te cobrará nada.</p><button class="primary" data-shop-close>Aceptar</button></div>`);
       return
     }
   }catch(err){
     console.error('[CRAFTERRA] Error preparando pista:',err);
     pendingHint=null;
     modal(`<div class="shop-confirm"><small>PISTAS</small><h2>💡 No pude preparar una pista</h2><p>No se ha cobrado ninguna moneda. Vuelve a intentarlo.</p><button class="primary" data-shop-close>Aceptar</button></div>`);
     return
   }
 }
 if(o.currency==='rewarded'){
   modal(`<div class="shop-confirm"><small>RECOMPENSA OPCIONAL</small><h2>${o.icon} ${o.name}</h2><p>${o.desc}</p><div class="shop-balance"><span>Coste</span><b>1 anuncio</b></div><button class="primary" data-shop-confirm="${o.id}">Ver anuncio y recibir monedas</button></div>`);
   return
 }

 const canBatch=!!o.contents;
 const totalPrice=o.price*qty;
 const after=S.coins-totalPrice;
 const affordable=S.coins>=totalPrice;

 const batchPicker=canBatch?`
   <div class="shop-batch">
     <small>CUÁNTOS LOTES QUIERES</small>
     <div class="shop-stepper">
       <button data-shop-qty="${o.id}" data-shop-qty-value="${qty-1}" ${qty<=1?'disabled':''}>−</button>
       <strong>×${qty}</strong>
       <button data-shop-qty="${o.id}" data-shop-qty-value="${qty+1}" ${qty>=99?'disabled':''}>+</button>
     </div>
     <div class="shop-quick">${[1,2,5,10].map(n=>`<button class="${n===qty?'selected':''}" data-shop-qty="${o.id}" data-shop-qty-value="${n}">×${n}</button>`).join('')}</div>
   </div>`:'';

 modal(`<div class="shop-confirm">
   <small>CONFIRMAR COMPRA</small>
   <h2>${o.icon} ${o.name}${canBatch&&qty>1?` ×${qty}`:''}</h2>
   <p>${o.desc}</p>
   ${batchPicker}
   ${o.contents?`<div class="shop-contents">${shopContentsHTML(o.contents,false,qty)}</div>`:''}
   <div class="shop-balance"><span>Coste total</span><b>${totalPrice.toLocaleString('es')} ◆</b></div>
   <div class="shop-balance"><span>Tu saldo</span><b>${S.coins.toLocaleString('es')} ◆</b></div>
   <div class="shop-balance after ${affordable?'':'insufficient'}"><span>Después de comprar</span><b>${Math.max(0,after).toLocaleString('es')} ◆</b></div>
   <button class="primary" data-shop-confirm="${o.id}" data-shop-buy-qty="${qty}" ${affordable?'':'disabled'}>${affordable?`Comprar ${qty>1?`${qty} lotes`:'1 lote'} por ${totalPrice.toLocaleString('es')} ◆`:'Saldo insuficiente'}</button>
   <button class="shop-cancel" data-shop-cancel>Cancelar</button>
 </div>`)
}

function playAlmaPrintRewarded(){
 return new Promise(resolve=>{
  const overlay=document.createElement('div');
  overlay.className='rewarded-video-overlay';
  overlay.innerHTML=`<div class="rewarded-video-shell">
   <div class="rewarded-video-top"><div><small>CONTENIDO PATROCINADO</small><b>AlmaPrint</b></div><span class="rewarded-video-status">Cargando…</span></div>
   <div class="rewarded-video-stage">
    <video class="rewarded-video" playsinline webkit-playsinline preload="auto" controlslist="nodownload noplaybackrate" disablepictureinpicture src="./assets/video/promo-almaprint.mp4?v=029"></video>
   </div>
   <div class="rewarded-video-progress"><i></i></div>
   <button class="rewarded-video-close" type="button">Cancelar</button>
  </div>`;
  document.body.append(overlay);

  const video=overlay.querySelector('.rewarded-video');
  const bar=overlay.querySelector('.rewarded-video-progress i');
  const status=overlay.querySelector('.rewarded-video-status');
  const closeBtn=overlay.querySelector('.rewarded-video-close');
  let done=false;

  const finish=ok=>{
   if(done)return;
   done=true;
   try{video.pause()}catch(_){}
   overlay.classList.add('closing');
   setTimeout(()=>{overlay.remove();resolve(ok)},220)
  };

  closeBtn.addEventListener('click',()=>finish(false));
  video.addEventListener('timeupdate',()=>{
   if(video.duration&&isFinite(video.duration)){
    bar.style.width=Math.min(100,video.currentTime/video.duration*100)+'%';
    const left=Math.max(0,Math.ceil(video.duration-video.currentTime));
    status.textContent=left?`Recompensa en ${left} s`:'Completado';
   }
  });
  video.addEventListener('playing',()=>{status.textContent='Reproduciendo…'});
  video.addEventListener('waiting',()=>{status.textContent='Cargando…'});
  video.addEventListener('ended',()=>{
   bar.style.width='100%';
   status.textContent='✓ Vídeo completado';
   setTimeout(()=>finish(true),300)
  });
  video.addEventListener('error',()=>{
   status.textContent='No se pudo cargar el vídeo';
   setTimeout(()=>finish(false),1000)
  });

  requestAnimationFrame(()=>overlay.classList.add('show'));

  // IMPORTANT FOR iOS:
  // Invoke play immediately, without an intervening await/setTimeout.
  video.muted=false;
  const p=video.play();
  if(p&&typeof p.catch==='function'){
   p.catch(()=>{
    // Rare iOS/WebKit fallback: don't leave a black frozen screen.
    // Expose native controls so the user can recover, but normal flow is one tap.
    video.controls=true;
    status.textContent='Toca el vídeo para continuar';
   });
  }
 })
}

async function buy(t,qty=1){
 const o=SHOP_OFFERS[t];if(!o)return;
 qty=o.contents?Math.max(1,Math.min(99,Number(qty)||1)):1;
 if(o.currency==='coins'){
   const totalPrice=o.price*qty;
   if(S.coins<totalPrice){close();toast('No tienes monedas suficientes.');return}
   let hintRecipe=null;
   if(t==='hint'){
     try{
       if(!S.hintLibrary||typeof S.hintLibrary!=='object')S.hintLibrary={};
       hintRecipe=pendingHint;
       if(!hintRecipe || S.discovered?.[hintRecipe.result] || !hasRecipeMaterials(hintRecipe) || S.hintLibrary[hintKey(hintRecipe)]){
         hintRecipe=pickHintRecipe();
       }
       if(!hintRecipe){
         pendingHint=null;
         close();
         modal(`<div class="shop-confirm"><small>PISTAS</small><h2>💡 No hay una pista útil ahora mismo</h2><p>No se ha descontado ninguna moneda.</p><button class="primary" data-shop-close>Aceptar</button></div>`);
         return
       }
     }catch(err){
       console.error('[CRAFTERRA] Error comprando pista:',err);
       pendingHint=null;
       close();
       toast('No se pudo preparar la pista. No se ha cobrado nada.');
       return
     }
   }
   S.coins-=totalPrice;
   if(o.contents){
     for(const [id,q] of Object.entries(o.contents)){
       S.stock[id]=stockOf(id)+(q*qty);
       if(!S.discovered[id])S.discovered[id]=Date.now()
     }
   }else if(t==='hint'){
     S.stats.hints++;
     const key=hintKey(hintRecipe);
     S.hintLibrary[key]={
       key,
       result:hintRecipe.result,
       a:hintRecipe.a,
       b:hintRecipe.b,
       text:hintRecipe?.hints?.[0]||'Prueba a combinar algunos de los materiales que ya tienes.',
       purchasedAt:Date.now()
     };
     pendingHint=null;
   }
   await persist();
   renderShop();
   if(o.contents){
     modal(`<div class="shop-receipt"><small>COMPRA REALIZADA</small><h2>✓ ${o.name}${qty>1?` ×${qty}`:''}</h2><p>${qty>1?`Has comprado ${qty} lotes de una vez.`:'Los materiales ya están en tu inventario.'}</p><div class="shop-contents">${shopContentsHTML(o.contents,true,qty)}</div><div class="shop-balance"><span>Gastado</span><b>${totalPrice.toLocaleString('es')} ◆</b></div><div class="shop-balance"><span>Saldo restante</span><b>${S.coins.toLocaleString('es')} ◆</b></div><button class="primary" data-shop-close>Aceptar</button></div>`)
   }else{
     close();
     const r=hintRecipe;
     modal(`<div class="shop-receipt"><small>PISTA ADQUIRIDA</small><h2>💡 Una pista para ti</h2><p>${r?.hints?.[0]||'Prueba a combinar algunos de los materiales que ya tienes.'}</p><div class="hint-eligibility"><span>✓ Resultado aún no descubierto</span><span>✓ Tienes los materiales necesarios</span></div><div class="shop-balance"><span>Saldo restante</span><b>${S.coins.toLocaleString('es')} ◆</b></div><button class="primary" data-shop-close>Aceptar</button></div>`)
   }
   return
 }
 if(o.currency==='rewarded'){
   close();
   const watched=await playAlmaPrintRewarded();
   if(!watched){toast('Vídeo cancelado · no se ha concedido la recompensa.');return}
   const reward=Number(o.reward)||250;
   S.coins+=reward;
   await persist();
   renderShop();
   modal(`<div class="shop-receipt"><small>RECOMPENSA RECIBIDA</small><h2>🎁 +${reward.toLocaleString('es')} monedas</h2><p>Gracias por ver la promo de AlmaPrint. Las monedas ya están en tu saldo.</p><div class="shop-balance"><span>Nuevo saldo</span><b>${S.coins.toLocaleString('es')} ◆</b></div><button class="primary" data-shop-close>Aceptar</button></div>`);
   return
 }
 toast('Esta compra todavía no está disponible.')
}

function todayKey(){return new Date().toLocaleDateString('sv-SE')}
function dailyPuzzle(){
 const key=todayKey();
 let hash=0;for(const ch of key)hash=(hash*31+ch.charCodeAt(0))>>>0;
 const candidates=PUZZLES.filter(p=>S.discovered[p.target]||RECIPES.some(r=>r.result===p.target));
 return (candidates.length?candidates:PUZZLES)[hash%(candidates.length?candidates.length:PUZZLES.length)]
}
function dailyDoneToday(){return S.daily?.date===todayKey()}
function renderDailyRun(){
 let box=$('#dailyRunBar');
 if(!box){
   box=document.createElement('div');
   box.id='dailyRunBar';
   box.className='daily-run';
   const craft=$('#view-craft .panel-title');
   craft?.insertAdjacentElement('afterend',box)
 }
 if(!dailyRun){box.hidden=true;return}
 box.hidden=false;
 const p=PUZZLES.find(x=>x.id===dailyRun.puzzleId);
 const left=Math.max(0,dailyRun.limit-dailyRun.merges);
 box.innerHTML=`<div><small>DESAFÍO DIARIO ACTIVO</small><b>Fabrica ${item(p.target).name}</b><span>${dailyRun.merges}/${dailyRun.limit} fusiones · ${left} restantes</span></div><strong>+${CONFIG.dailyReward} ◆</strong><button id="cancelDailyRun" aria-label="Cancelar desafío">×</button>`;
 $('#cancelDailyRun').onclick=()=>{dailyRun=null;renderDailyRun();toast('Desafío diario cancelado')}
}
function openDailyChallenge(){
 const p=dailyPuzzle();
 if(dailyDoneToday()){
   modal(`<div class="daily-result success"><small>DESAFÍO DIARIO</small><h2>✓ Completado hoy</h2><p>Ya has cobrado la recompensa de hoy.</p><strong>Vuelve mañana para un nuevo desafío.</strong><button class="primary" data-shop-close>Aceptar</button></div>`);
   return
 }
 modal(`<div class="daily-result"><small>DESAFÍO DIARIO</small><h2>${item(p.target).name}</h2><p>Fabrica <b>${item(p.target).name}</b> usando tu propio inventario en un máximo de <b>${p.limit} fusiones</b>.</p><div class="daily-rules"><span>✓ La mesa comienza vacía</span><span>✓ Tú eliges los materiales</span><span>✓ Los materiales consumidos son reales</span></div><div class="shop-balance"><span>Recompensa</span><b>${CONFIG.dailyReward.toLocaleString('es')} ◆</b></div><button class="primary" id="dailyPlay">Comenzar desafío</button></div>`);
 setTimeout(()=>{const b=$('#dailyPlay');if(b)b.onclick=()=>startDailyChallenge(p.id)},0)
}
function startDailyChallenge(id){
 const p=PUZZLES.find(x=>x.id===id);if(!p)return;
 close();
 board=[];
 dailyRun={puzzleId:p.id,target:p.target,limit:p.limit,merges:0,startedAt:Date.now()};
 showView('craft');
 renderCraft();
 renderDailyRun();
 toast(`Desafío diario: fabrica ${item(p.target).name}`)
}
function failDailyChallenge(){
 const p=PUZZLES.find(x=>x.id===dailyRun?.puzzleId);
 dailyRun=null;renderDailyRun();
 modal(`<div class="daily-result fail"><small>DESAFÍO DIARIO</small><h2>Límite alcanzado</h2><p>No has conseguido ${p?item(p.target).name:'el objetivo'} dentro del límite de fusiones.</p><strong>No has perdido monedas. Puedes intentarlo de nuevo.</strong><button class="primary" data-daily-retry>Reintentar</button></div>`);
 setTimeout(()=>{const b=$('[data-daily-retry]');if(b)b.onclick=()=>{close();openDailyChallenge()}},0)
}
async function completeDailyChallenge(){
 if(!dailyRun||dailyDoneToday())return false;
 const p=PUZZLES.find(x=>x.id===dailyRun.puzzleId);
 const before=S.coins;
 S.coins+=CONFIG.dailyReward;
 S.daily.date=todayKey();
 S.daily.completed=(S.daily.completed||0)+1;
 S.daily.best=S.daily.best==null?dailyRun.merges:Math.min(S.daily.best,dailyRun.merges);
 S.daily.streak=(S.daily.streak||0)+1;
 const used=dailyRun.merges;
 dailyRun=null;
 renderDailyRun();
 await save(S);
 renderHeader(before);
 queueRewards([{kind:'daily',name:`Desafío: ${item(p.target).name}`,coins:CONFIG.dailyReward,xp:0}],S.coins);
 modal(`<div class="daily-result success"><small>DESAFÍO SUPERADO</small><h2>✓ ${item(p.target).name}</h2><p>Lo has conseguido en <b>${used} fusiones</b>.</p><div class="shop-balance"><span>Recompensa</span><b>+${CONFIG.dailyReward.toLocaleString('es')} ◆</b></div><button class="primary" data-shop-close>Recoger</button></div>`);
 return true
}
function trackDailyMerge(resultId){
 if(!dailyRun)return;
 dailyRun.merges++;
 const won=resultId===dailyRun.target;
 renderDailyRun();
 if(won){completeDailyChallenge();return}
 if(dailyRun.merges>=dailyRun.limit)failDailyChallenge()
}

function playPuzzle(id){const p=PUZZLES.find(x=>x.id===id);board=[...p.resources];showView('craft');renderBoard();toast(`Puzle: fabrica ${item(p.target).name} en ${p.limit} fusiones`)}
function settings(){modal(`<h2>Ajustes</h2><div class="settings"><button id="exportBtn">Exportar partida</button><button id="resetBtn">Reiniciar progreso</button><a href="tools/recipe-editor.html">Editor de recetas</a><p>Sonido y vibración respetan las preferencias del dispositivo. Todo el progreso se guarda localmente.</p><small>CRAFTERRA v${CONFIG.version} · DEVELOPMENT</small></div>`);setTimeout(()=>{$('#exportBtn').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(exportSave(S));a.download='crafterra-save.json';a.click()};$('#resetBtn').onclick=async()=>{if(confirm('¿Reiniciar todo el progreso?')){await reset();location.reload()}}})}
function bind(){document.addEventListener('click',e=>{
const expStart=e.target.closest('[data-exp-start]');
if(expStart){e.preventDefault();e.stopPropagation();startExpedition(expStart.dataset.expStart,+expStart.dataset.expMin);return}
const v=e.target.closest('[data-view]')?.dataset.view;if(v)showView(v);const add=e.target.closest('[data-add]')?.dataset.add;if(add){
 if(!canPlaceFromInventory(add)){toast(`No tienes más ${item(add)?.name||'unidades'} disponibles.`);return}
 board.push(add);renderBoard()
}const bm=e.target.closest('[data-book-mode]')?.dataset.bookMode;if(bm){bookMode=bm;renderBook();return}
const f=e.target.closest('[data-filter]')?.dataset.filter;if(f){filter=f;renderBook()}const d=e.target.closest('[data-detail]')?.dataset.detail;if(d)detail(d);const g=e.target.closest('[data-goal]')?.dataset.goal;if(g){goal=g;$$('[data-goal]').forEach(x=>x.classList.toggle('selected',x.dataset.goal===g));renderGoals()}const shopQty=e.target.closest('[data-shop-qty]');if(shopQty){e.preventDefault();e.stopPropagation();confirmShopOffer(shopQty.dataset.shopQty,+shopQty.dataset.shopQtyValue);return}const shopBtn=e.target.closest('[data-shop-confirm]');const shopConfirm=shopBtn?.dataset.shopConfirm;if(shopConfirm){e.preventDefault();e.stopPropagation();buy(shopConfirm,+shopBtn.dataset.shopBuyQty||1);return}
const o=e.target.closest('[data-offer]')?.dataset.offer;if(o){e.preventDefault();e.stopPropagation();confirmShopOffer(o,1);return}
if(e.target.closest('[data-shop-cancel]')||e.target.closest('[data-shop-close]')){close();return}const dc=e.target.closest('[data-direct-craft]')?.dataset.directCraft;if(dc){showDirectCraft(dc);return}
const dq=e.target.closest('[data-direct-qty]');if(dq){showDirectCraft(dq.dataset.directQty,+dq.dataset.directQtyValue);return}
const dr=e.target.closest('[data-direct-route]');if(dr){executeDirectCraft(dr.dataset.directRoute,+dr.dataset.directRouteIndex,+dr.dataset.directRouteQty);return}
const dm=e.target.closest('[data-direct-make-missing]');if(dm){craftMissingHere(dm.dataset.directMakeMissing,+dm.dataset.directMissingQty,dm.dataset.directReturn);return}
const dch=e.target.closest('[data-direct-chain]')?.dataset.directChain;if(dch){showDirectChain(dch);return}
const dcb=e.target.closest('[data-direct-back]')?.dataset.directBack;if(dcb){showDirectCraft(dcb);return}
const p=e.target.closest('[data-puzzle]')?.dataset.puzzle;if(p)playPuzzle(p)});$('#clearBoard').onclick=()=>{board=[];renderBoard()};$('#modalClose').onclick=close;$('#modal').onclick=e=>{if(e.target.id==='modal')close()};$('#settingsBtn').onclick=settings;$('#dailyBtn').onclick=openDailyChallenge;$('#itemSearch').oninput=e=>$$('#inventoryGrid .item').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(e.target.value.toLowerCase()))}
function revealApp(){const splash=$('#splash'),app=$('#app');if(app)app.hidden=false;if(splash)splash.remove()}async function boot(){window.__CRAF_BOOT_STARTED=true;const watchdog=setTimeout(()=>{console.warn('[CRAFTERRA] Arranque lento: liberando interfaz.');if(!S)S=initialState();try{bind();renderHeader();renderWorld()}catch(e){console.error(e)}revealApp()},3000);try{S=normalizeState(await initDB());bind();renderHeader();renderWorld();clearTimeout(watchdog);window.__CRAF_BOOT_OK=true;setTimeout(revealApp,350);if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('[CRAFTERRA] SW:',e))}catch(e){console.error('[CRAFTERRA] Error de arranque:',e);S=normalizeState(S);try{bind();renderHeader();renderWorld();window.__CRAF_BOOT_OK=true}catch(inner){console.error(inner)}clearTimeout(watchdog);revealApp();toast('Se inició en modo seguro. Tu progreso seguirá guardándose localmente.')}}setInterval(tickExpeditions,1000);boot();