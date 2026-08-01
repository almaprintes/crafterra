import{CONFIG}from'./config.js';
const DB='crafterra-save';let db;
export async function initDB(){db=await new Promise((ok,no)=>{const r=indexedDB.open(DB,CONFIG.dbVersion);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('state'))d.createObjectStore('state');if(!d.objectStoreNames.contains('history'))d.createObjectStore('history',{keyPath:'at'});if(r.oldVersion<2&&!d.objectStoreNames.contains('daily'))d.createObjectStore('daily')};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});return load()}
export async function load(){return new Promise(ok=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>ok(r.result||null);r.onerror=()=>ok(null)})}
export async function save(s){return new Promise((ok,no)=>{const t=db.transaction('state','readwrite');t.objectStore('state').put(structuredClone(s),'main');t.oncomplete=ok;t.onerror=()=>no(t.error)})}
export async function reset(){return new Promise(ok=>{const t=db.transaction('state','readwrite');t.objectStore('state').delete('main');t.oncomplete=ok})}
export function exportSave(s){return new Blob([JSON.stringify({format:'CRAFTERRA_SAVE',version:CONFIG.version,state:s},null,2)],{type:'application/json'})}
