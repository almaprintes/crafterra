import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const read=async path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [app,html,workflow]=await Promise.all([
 read('js/app.js'),read('index.html'),read('.github/workflows/validate-crafterra.yml')
]);
const begin=app.indexOf('function showView(v){'),end=app.indexOf('function renderWorld(){',begin);
assert.ok(begin>=0&&end>begin,'navigation handler must be present');
const fn=app.slice(begin,end).trim();
assert.ok(fn.includes("$$('.view').forEach"),'all views must be selected, not the first .view only');
assert.ok(!/(^|[^$])\$\('\.view'\)\.forEach/.test(fn),'querySelector returns one element, never an array');
const names=['world','craft','book','goals','shop'];
for(const name of names)assert.ok(html.includes('data-view="'+name+'"'),'footer must contain '+name);
let sheetOpen=false,closeCount=0;
const views=names.map(name=>({id:'view-'+name,classList:{active:false,toggle(key,active){this[key]=active;}}}));
const buttons=names.map(name=>({dataset:{view:name},classList:{active:false,toggle(key,active){this[key]=active;}}}));
const renders=[];
const sandbox={
 $$:selector=>selector==='.view'?views:selector==='nav button'?buttons:[],
 $:selector=>{throw Error('Using single-element selector in footer: '+selector);},
 expSheetOpen:true,
 toggleExpeditions(open){closeCount++;sheetOpen=open;sandbox.expSheetOpen=open;},
 renderCraft(){renders.push('craft');},renderBook(){renders.push('book');},
 renderGoals(){renders.push('goals');},renderShop(){renders.push('shop');},
 renderWorld(){renders.push('world');}
};
vm.createContext(sandbox);vm.runInContext(fn+';this.navigate=showView;',sandbox);
for(const name of names){
 if(name==='world')sandbox.expSheetOpen=true;
 const before=renders.length;
 sandbox.navigate(name);
 assert.deepEqual(views.filter(v=>v.classList.active).map(v=>v.id),['view-'+name],'only the chosen screen is visible: '+name);
 assert.deepEqual(buttons.filter(b=>b.classList.active).map(b=>b.dataset.view),[name],'only the chosen footer item is active: '+name);
 assert.equal(renders.length,before+1,'exactly one screen is rendered on '+name);
 assert.equal(renders.at(-1),name);
}
assert.equal(closeCount,1,'leaving the world closes the expedition overlay');
assert.equal(sheetOpen,false);
assert.ok(app.includes("const v=e.target.closest('[data-view]')?.dataset.view;if(v)showView(v)"),
 'footer event delegation must still be wired');
assert.ok(workflow.includes('tests/navigation.mjs'),'footer test must run on every push');
console.log('CRAFTERRA 0.11.2: footer Mundo/Crear/Archivo/Retos/Tienda and active-screen transitions OK');
