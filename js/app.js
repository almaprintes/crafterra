import{ITEMS,RECIPES,COLLECTIONS,MISSIONS,PUZZLES,ACHIEVEMENTS,STATIONS}from'./data.js';import{CONFIG}from'./config.js';import{initDB,save,reset,exportSave}from'./db.js';import{initialState,normalizeState,merge,item,eraFor}from'./engine.js';import{RewardedAdsProvider,StoreProvider}from'./providers.js';
let S,board=[],filter='Todos',goal='missions',bookMode='items';const $=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];const ads=new RewardedAdsProvider,store=new StoreProvider;
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
 if(double){try{await ads.show('expedition-double',S);mult=2}catch(e){toast(e.message);return}}
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
function evaluateProgress(){let bonus=0;MISSIONS.forEach(m=>{if(S.discovered[m.target]&&!S.missions[m.id]){S.missions[m.id]=true;bonus+=m.reward;S.xp+=m.xp}});COLLECTIONS.forEach(c=>{if(c.items.every(id=>S.discovered[id])&&!S.collections[c.id]){S.collections[c.id]=true;bonus+=c.coins;S.xp+=c.xp}});const metrics=[Object.keys(S.discovered).length,S.stats.merges,Object.keys(S.collections).length,S.world.length];ACHIEVEMENTS.forEach(a=>{if(metrics[a.type]>=a.value&&!S.achievements[a.id]){S.achievements[a.id]=true;bonus+=a.reward}});if(bonus){S.coins+=bonus;S.level=1+Math.floor(S.xp/250)}}
async function persist(){evaluateProgress();await save(S);renderHeader()}
function renderHeader(){ $('#coins').textContent=S.coins.toLocaleString('es');$('#level').textContent=S.level;const e=eraFor(S);$('#eraLabel').textContent=`ERA ${['I','II','III','IV','V','VI','VII'][e]}`;$('#eraName').textContent=CONFIG.eras[e][0]}
function showView(v){$$('.view').forEach(x=>x.classList.toggle('active',x.id===`view-${v}`));$$('nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===v));if(v==='craft')renderCraft();if(v==='book')renderBook();if(v==='goals')renderGoals();if(v==='shop')renderShop()}
function renderWorld(){const tiles=$('#worldTiles');tiles.innerHTML=Array.from({length:25},(_,i)=>`<i style="--x:${i%5};--y:${Math.floor(i/5)}"></i>`).join('');$('#worldBuildings').innerHTML=S.world.map((id,i)=>`<button class="building" style="--x:${(i*2)%5};--y:${Math.floor(i/3)%5}" data-item="${id}">${icon(item(id))}<small>${item(id).name}</small></button>`).join('');const next=MISSIONS.find(m=>!S.discovered[m.target]);$('#missionHint').textContent=next?`Objetivo: ${next.name}`:'¡Has completado la campaña!';$('#questStrip').innerHTML=next?`<b>${next.name}</b><span>Descubre ${item(next.target).name}</span><strong>+${next.reward}</strong>`:'<b>Horizonte alcanzado</b><span>Sigue experimentando</span>';renderExpeditionPanel()}
function stockOf(id){return Math.max(0,Number(S.stock?.[id]||0))}
function boardQty(id){return board.reduce((n,x)=>n+(x===id?1:0),0)}
function canPlaceFromInventory(id){return stockOf(id)>boardQty(id)}
function renderCraft(){const known=ITEMS.filter(i=>S.discovered[i.id]);$('#inventoryGrid').innerHTML=known.map(i=>`<button class="item" data-add="${i.id}">${icon(i)}<small>${i.name}</small>${S.stock[i.id]?`<em class="qty">×${S.stock[i.id]}</em>`:''}</button>`).join('');$('#stationBar').innerHTML=['none',...STATIONS.filter(x=>S.discovered[x])].map((id,i)=>`<button>${i?'⚙ '+item(id).name:'Mesa libre'}</button>`).join('');renderBoard()}
function renderBoard(){const b=$('#craftBoard');b.querySelectorAll('.piece').forEach(x=>x.remove());board.forEach((id,i)=>{const it=item(id),el=document.createElement('button');el.className='piece';el.dataset.index=i;el.style.cssText=`--x:${18+(i%4)*22}%;--y:${25+Math.floor(i/4)*28}%;`;el.innerHTML=icon(it)+`<small>${it.name}</small>`;el.draggable=true;el.addEventListener('pointerdown',dragStart);b.append(el)})}
function dragStart(ev){const el=ev.currentTarget,idx=+el.dataset.index;el.setPointerCapture(ev.pointerId);el.classList.add('held');const move=e=>{const r=$('#craftBoard').getBoundingClientRect();el.style.left=`${e.clientX-r.left}px`;el.style.top=`${e.clientY-r.top}px`;el.style.transform='translate(-50%,-50%) scale(1.12)'};const up=async e=>{el.removeEventListener('pointermove',move);el.classList.remove('held');el.style.pointerEvents='none';const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('.piece');el.style.pointerEvents='';if(target&&+target.dataset.index!==idx){await doMerge(idx,+target.dataset.index)}else renderBoard()};el.addEventListener('pointermove',move);el.addEventListener('pointerup',up,{once:true})}
async function doMerge(i,j){
 const a=board[i],b=board[j];
 const need={};need[a]=(need[a]||0)+1;need[b]=(need[b]||0)+1;
 for(const [id,q] of Object.entries(need)){
   if(stockOf(id)<q){toast(`No tienes suficiente ${item(id)?.name||'material'}.`);renderCraft();return}
 }
 const out=merge(S,a,b);
 if(!out.ok){
   toast(['Eso no parece funcionar.','Interesante… pero no.','Quizá necesites otra herramienta.'][S.stats.failed%3]);
   renderBoard();persist();return
 }
 for(const [id,q] of Object.entries(need))S.stock[id]=Math.max(0,stockOf(id)-q);
 S.stock[out.result.id]=stockOf(out.result.id)+1;
 board=board.filter((_,k)=>k!==i&&k!==j);
 board.push(out.result.id);

 // Refresh the whole crafting view immediately:
 // consumed materials disappear/decrease and the new item appears at once.
 renderCraft();

 if(out.fresh){
   modal(`<div class="discovery">${icon(out.result)}<small>NUEVO DESCUBRIMIENTO</small><h2>${out.result.name}</h2><b>${out.result.rarity} · ERA ${out.result.era}</b><p>${out.result.description}</p><strong>+${CONFIG.rewards[out.result.rarity]} monedas</strong></div>`);
   renderWorld()
 }
 await persist()
}
function renderBook(){
 const hintEntries=Object.values(S.hintLibrary||{}).sort((x,y)=>(y.purchasedAt||0)-(x.purchasedAt||0));
 $('#hintBookCount').textContent=hintEntries.length;
 $$('[data-book-mode]').forEach(x=>x.classList.toggle('selected',x.dataset.bookMode===bookMode));
 const filters=$('#filters'),grid=$('#bookGrid'),library=$('#hintLibrary');
 if(bookMode==='hints'){
   filters.hidden=true;grid.hidden=true;library.hidden=false;
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
 const cats=['Todos',...new Set(ITEMS.map(x=>x.category))];
 filters.innerHTML=cats.map(x=>`<button class="${filter===x?'selected':''}" data-filter="${x}">${x}</button>`).join('');
 const list=ITEMS.filter(x=>filter==='Todos'||x.category===filter);
 $('#bookCount').textContent=`${Object.keys(S.discovered).length} / ${ITEMS.length}`;
 grid.innerHTML=list.map(i=>`<button class="card ${S.discovered[i.id]?'':'locked'}" data-detail="${i.id}">${S.discovered[i.id]?icon(i):'<span class="unknown">?</span>'}<b>${S.discovered[i.id]?i.name:'Desconocido'}</b><small>${S.discovered[i.id]?i.rarity:'???'}</small></button>`).join('')
}
function detail(id){const i=item(id);if(!S.discovered[id])return;const rs=RECIPES.filter(r=>r.result===id);modal(`<div class="detail">${icon(i)}<h2>${i.name}</h2><b>${i.rarity} · ${i.category} · ERA ${i.era}</b><p>${i.description}</p><h3>Recetas conocidas</h3>${rs.map(r=>S.discovered[r.a]&&S.discovered[r.b]?`<p>${item(r.a).name} + ${item(r.b).name} → ${i.name}</p>`:'<p>??? + ??? → '+i.name+'</p>').join('')||'<p>Elemento primario.</p>'}</div>`)}
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
 return RECIPES.filter(r=>{
   if(!r||!r.result)return false;
   if(S.discovered[r.result]||stockOf(r.result)>0)return false;
   if(S.hintLibrary?.[hintKey(r)])return false;
   return hasRecipeMaterials(r)
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
function shopContentsHTML(contents,showTotals=false){
 return Object.entries(contents).map(([id,q])=>{
   const it=item(id),total=stockOf(id)+(showTotals?q:0);
   return `<div class="shop-line">${icon(it)}<div><b>${it.name}</b>${showTotals?`<small>Ahora tienes ${total}</small>`:''}</div><strong>×${q}</strong></div>`
 }).join('')
}
function renderShop(){
 const offers=Object.values(SHOP_OFFERS);
 $('#shopList').innerHTML=offers.map(o=>{
   const disabled=o.currency==='store';
   const action=o.currency==='coins'?`${o.price} ◆`:o.currency==='rewarded'?'VER ANUNCIO':'PRÓXIMAMENTE';
   const detail=o.contents?Object.entries(o.contents).map(([id,q])=>`${item(id).name} ×${q}`).join(' · '):o.desc;
   return `<article class="offer ${disabled?'disabled':''}">
     <span class="shopicon">${o.icon}</span>
     <div><b>${o.name}</b><small>${detail}</small></div>
     <button ${disabled?'disabled':''} data-offer="${o.id}">${action}</button>
   </article>`
 }).join('')
}
function confirmShopOffer(id){
 const o=SHOP_OFFERS[id];if(!o)return;
 if(o.currency==='store'){toast('Esta compra todavía no está disponible.');return}
 if(id==='hint'){
   const r=pickHintRecipe();
   if(!r){
     modal(`<div class="shop-confirm"><small>PISTAS</small><h2>💡 No hay una pista útil ahora mismo</h2><p>Las pistas solo se ofrecen para recetas aún no descubiertas y cuyos materiales ya tengas en cantidad suficiente.</p><button class="primary" data-shop-close>Aceptar</button></div>`);
     return
   }
 }
 if(o.currency==='rewarded'){
   modal(`<div class="shop-confirm"><small>RECOMPENSA OPCIONAL</small><h2>${o.icon} ${o.name}</h2><p>${o.desc}</p><div class="shop-balance"><span>Coste</span><b>1 anuncio</b></div><button class="primary" data-shop-confirm="${o.id}">Ver anuncio y recibir monedas</button></div>`);
   return
 }
 const after=S.coins-o.price;
 modal(`<div class="shop-confirm"><small>CONFIRMAR COMPRA</small><h2>${o.icon} ${o.name}</h2><p>${o.desc}</p>${o.contents?`<div class="shop-contents">${shopContentsHTML(o.contents)}</div>`:''}<div class="shop-balance"><span>Tu saldo</span><b>${S.coins.toLocaleString('es')} ◆</b></div><div class="shop-balance after"><span>Después de comprar</span><b>${Math.max(0,after).toLocaleString('es')} ◆</b></div><button class="primary" data-shop-confirm="${o.id}">Comprar por ${o.price} ◆</button><button class="shop-cancel" data-shop-cancel>Cancelar</button></div>`)
}
async function buy(t){
 const o=SHOP_OFFERS[t];if(!o)return;
 if(o.currency==='coins'){
   if(S.coins<o.price){close();toast('No tienes monedas suficientes.');return}
   let hintRecipe=null;
   if(t==='hint'){
     hintRecipe=pickHintRecipe();
     if(!hintRecipe){
       close();
       toast('Ahora mismo no hay ninguna pista útil para comprar.');
       return
     }
   }
   S.coins-=o.price;
   if(o.contents){
     for(const [id,q] of Object.entries(o.contents)){
       S.stock[id]=stockOf(id)+q;
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
   }
   await persist();
   renderShop();
   if(o.contents){
     modal(`<div class="shop-receipt"><small>COMPRA REALIZADA</small><h2>✓ ${o.name}</h2><p>Los materiales ya están en tu inventario.</p><div class="shop-contents">${shopContentsHTML(o.contents,true)}</div><div class="shop-balance"><span>Saldo restante</span><b>${S.coins.toLocaleString('es')} ◆</b></div><button class="primary" data-shop-close>Aceptar</button></div>`)
   }else{
     close();
     const r=hintRecipe;
     modal(`<div class="shop-receipt"><small>PISTA ADQUIRIDA</small><h2>💡 Una pista para ti</h2><p>${r?.hints?.[0]||'Prueba a combinar algunos de los materiales que ya tienes.'}</p><div class="hint-eligibility"><span>✓ Resultado aún no descubierto</span><span>✓ Tienes los materiales necesarios</span></div><div class="shop-balance"><span>Saldo restante</span><b>${S.coins.toLocaleString('es')} ◆</b></div><button class="primary" data-shop-close>Aceptar</button></div>`)
   }
   return
 }
 if(o.currency==='rewarded'){
   try{
     const r=await ads.show('coins',S);
     S.coins+=r.reward;
     await persist();
     renderShop();
     modal(`<div class="shop-receipt"><small>RECOMPENSA RECIBIDA</small><h2>🎁 +${r.reward.toLocaleString('es')} monedas</h2><p>Se han añadido directamente a tu saldo.</p><div class="shop-balance"><span>Nuevo saldo</span><b>${S.coins.toLocaleString('es')} ◆</b></div><button class="primary" data-shop-close>Aceptar</button></div>`)
   }catch(e){close();toast(e.message)}
   return
 }
 toast('Esta compra todavía no está disponible.')
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
const f=e.target.closest('[data-filter]')?.dataset.filter;if(f){filter=f;renderBook()}const d=e.target.closest('[data-detail]')?.dataset.detail;if(d)detail(d);const g=e.target.closest('[data-goal]')?.dataset.goal;if(g){goal=g;$$('[data-goal]').forEach(x=>x.classList.toggle('selected',x.dataset.goal===g));renderGoals()}const o=e.target.closest('[data-offer]')?.dataset.offer;if(o){confirmShopOffer(o);return}
const shopConfirm=e.target.closest('[data-shop-confirm]')?.dataset.shopConfirm;if(shopConfirm){buy(shopConfirm);return}
if(e.target.closest('[data-shop-cancel]')||e.target.closest('[data-shop-close]')){close();return}const p=e.target.closest('[data-puzzle]')?.dataset.puzzle;if(p)playPuzzle(p)});$('#clearBoard').onclick=()=>{board=[];renderBoard()};$('#modalClose').onclick=close;$('#modal').onclick=e=>{if(e.target.id==='modal')close()};$('#settingsBtn').onclick=settings;$('#dailyBtn').onclick=()=>{const p=PUZZLES[new Date().getDate()%PUZZLES.length];modal(`<h2>Desafío diario</h2><p>Consigue <b>${item(p.target).name}</b> en un máximo de ${p.limit} fusiones.</p><strong>Recompensa: ${CONFIG.dailyReward} monedas</strong><button class="primary" id="dailyPlay">Comenzar</button>`);setTimeout(()=>$('#dailyPlay').onclick=()=>{close();playPuzzle(p.id)})};$('#itemSearch').oninput=e=>$$('#inventoryGrid .item').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(e.target.value.toLowerCase()))}
function revealApp(){const splash=$('#splash'),app=$('#app');if(app)app.hidden=false;if(splash)splash.remove()}async function boot(){window.__CRAF_BOOT_STARTED=true;const watchdog=setTimeout(()=>{console.warn('[CRAFTERRA] Arranque lento: liberando interfaz.');if(!S)S=initialState();try{bind();renderHeader();renderWorld()}catch(e){console.error(e)}revealApp()},3000);try{S=normalizeState(await initDB());bind();renderHeader();renderWorld();clearTimeout(watchdog);window.__CRAF_BOOT_OK=true;setTimeout(revealApp,350);if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(e=>console.warn('[CRAFTERRA] SW:',e))}catch(e){console.error('[CRAFTERRA] Error de arranque:',e);S=normalizeState(S);try{bind();renderHeader();renderWorld();window.__CRAF_BOOT_OK=true}catch(inner){console.error(inner)}clearTimeout(watchdog);revealApp();toast('Se inició en modo seguro. Tu progreso seguirá guardándose localmente.')}}setInterval(tickExpeditions,1000);boot();
