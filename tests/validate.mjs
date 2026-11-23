import{ITEMS,RECIPES,COLLECTIONS,MISSIONS,PUZZLES,ACHIEVEMENTS,STATIONS}from'../js/data.js';
import{readFile}from'node:fs/promises';
const ok=(v,m)=>{if(!v)throw Error(m)};
ok(ITEMS.length===245,`Objetos: ${ITEMS.length}`);
ok(RECIPES.length===242,`Recetas explícitas: ${RECIPES.length}`);
ok(COLLECTIONS.length>=20,`Colecciones: ${COLLECTIONS.length}`);
ok(PUZZLES.length===15,`Puzles: ${PUZZLES.length}`);
ok(MISSIONS.length>=28,`Misiones: ${MISSIONS.length}`);
ok(ACHIEVEMENTS.length===25,`Logros: ${ACHIEVEMENTS.length}`);
const ids=new Set(ITEMS.map(x=>x.id));ok(ids.size===ITEMS.length,'IDs de objeto duplicados');
ok(!ids.has('redstone'),'Cristal rojo sigue en el catálogo');
const names=ITEMS.map(x=>x.name);ok(new Set(names).size===names.length,'Nombres de objeto duplicados');
ok(RECIPES.some(r=>r.id==='r234'&&r.a==='rough_wood'&&r.b==='rough_wood'&&r.result==='wood'),'No existe receta básica de madera tosca');
ok(RECIPES.some(r=>r.id==='r235'&&r.a==='rough_wood'&&r.b==='saw'&&r.result==='wood'),'No existe receta con sierra');
for(const id of ['iron','copper','tin','silver','gold']){
 ok(ITEMS.some(i=>i.id===id+'_concentrate'),'Falta mena preparada de '+id);
 ok(RECIPES.some(r=>r.a===id&&r.b===id&&r.result===id+'_concentrate'),'Falta receta de triturado de '+id);
}
ok(RECIPES.some(r=>r.id==='r241'&&r.result==='shears'),'Falta receta de tijeras');
ok(RECIPES.some(r=>r.id==='r242'&&r.a==='animal_hide'&&r.result==='leather'),'Falta receta de curtido');
const pairs=new Set;for(const r of RECIPES){ok(ids.has(r.a)&&ids.has(r.b)&&ids.has(r.result),`Referencia rota ${r.id}`);const p=[r.a,r.b].sort().join('|');ok(!pairs.has(p),`Par duplicado ${p}`);pairs.add(p)}
const reachable=new Set(['stone','wood','rough_wood','animal_hide','water','fire','earth']);let change=true;while(change){change=false;for(const r of RECIPES)if(reachable.has(r.a)&&reachable.has(r.b)&&!reachable.has(r.result)){reachable.add(r.result);change=true}}
ok(reachable.size===ITEMS.length,`${ITEMS.length-reachable.size} objetos no alcanzables`);
for(const c of COLLECTIONS)for(const id of c.items)ok(ids.has(id),`Colección ${c.name}: ${id} inexistente`);
for(const m of MISSIONS)ok(ids.has(m.target),`Misión ${m.name}: objetivo inexistente`);
for(const p of PUZZLES){ok(ids.has(p.target),`Puzle ${p.name}: objetivo inexistente`);for(const id of p.resources)ok(ids.has(id),`Puzle ${p.name}: recurso ${id} inexistente`)}
for(const id of STATIONS)ok(ids.has(id),`Estación inexistente: ${id}`);
const source=await readFile(new URL('../js/data.js',import.meta.url),'utf8');ok(!source.includes('R.length<'),'Existe relleno automático de recetas');ok(!source.includes("'zinc'")&&!source.includes("'nickel'")&&!source.includes("'flower'"),'Referencias heredadas inválidas');
const sw=await readFile(new URL('../sw.js',import.meta.url),'utf8');
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
for(const file of ['./index.html','./manifest.webmanifest','./js/app.js?v=0.11.0-premium',
 './js/adventure-world.js?v=0.11.0','./js/terrain-textures.js?v=0.11.0','./js/material-art-data.js?v=0.11.0','./js/world-art-premium.js?v=0.11.0','./js/adventure-art.js?v=0.9.0','./js/adventure-rules.js?v=0.9.0','./js/world-actions.js?v=0.9.0','./js/world-biomes.js?v=0.9.0','./js/material-economy.js?v=0.9.0','./css/adventure-world.css?v=0.8.0-premium3','./css/world-premium.css?v=0.11.0','./css/craft-layout.css?v=0.8.2',
 './js/config.js','./js/data.js','./js/db.js','./js/engine.js','./js/providers.js'])
 ok(sw.includes(file),'Falta '+file+' en caché');
ok(html.includes('class="adventure-world"'),'Falta el nuevo mundo isométrico en index');
ok(html.includes('js/app.js?v=0.11.0-premium'),'Falta versión nueva en el arranque');
console.log(JSON.stringify({status:'OK',objects:ITEMS.length,recipes:RECIPES.length,
 reachable:reachable.size,collections:COLLECTIONS.length,puzzles:PUZZLES.length,
 missions:MISSIONS.length,achievements:ACHIEVEMENTS.length,stations:STATIONS.length},null,2));
