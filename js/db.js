import{CONFIG}from'./config.js';
const DB='crafterra-save';const LS='crafterra-save-fallback';let db=null,mode='idb';
const timeout=(ms)=>new Promise((_,no)=>setTimeout(()=>no(new Error('IndexedDB timeout')),ms));
function lsLoad(){try{return JSON.parse(localStorage.getItem(LS)||'null')}catch{return null}}
function lsSave(s){try{localStorage.setItem(LS,JSON.stringify(s));return true}catch{return false}}
export async function initDB(){
 try{
  if(!('indexedDB'in globalThis))throw Error('IndexedDB unavailable');
  db=await Promise.race([new Promise((ok,no)=>{const r=indexedDB.open(DB,CONFIG.dbVersion);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('state'))d.createObjectStore('state');if(!d.objectStoreNames.contains('history'))d.createObjectStore('history',{keyPath:'at'});if(r.oldVersion<2&&!d.objectStoreNames.contains('daily'))d.createObjectStore('daily')};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error||Error('IndexedDB open failed'));r.onblocked=()=>no(Error('IndexedDB blocked'))}),timeout(1800)]);
  mode='idb';return await Promise.race([load(),timeout(1200)]);
 }catch(e){console.warn('[CRAFTERRA] Guardado alternativo activado:',e?.message||e);mode='local';db=null;return lsLoad()}
}
export async function load(){if(mode!=='idb'||!db)return lsLoad();return new Promise(ok=>{try{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>ok(r.result||null);r.onerror=()=>ok(lsLoad())}catch{ok(lsLoad())}})}
export async function save(s){if(mode!=='idb'||!db){lsSave(s);return}try{await new Promise((ok,no)=>{const t=db.transaction('state','readwrite');t.objectStore('state').put(typeof structuredClone==='function'?structuredClone(s):JSON.parse(JSON.stringify(s)),'main');t.oncomplete=ok;t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)})}catch{mode='local';lsSave(s)}}
export async function reset(){try{localStorage.removeItem(LS)}catch{}if(mode!=='idb'||!db)return;return new Promise(ok=>{try{const t=db.transaction('state','readwrite');t.objectStore('state').delete('main');t.oncomplete=ok;t.onerror=ok}catch{ok()}})}
export function exportSave(s){return new Blob([JSON.stringify({format:'CRAFTERRA_SAVE',version:CONFIG.version,state:s},null,2)],{type:'application/json'})}
