const CACHE='crafterra-v0.11.1-stable';
const CORE=['./','./index.html','./manifest.webmanifest','./css/game.css?v=0.2.32-visualb1','./js/app.js?v=0.11.1-stable','./js/adventure-world.js?v=0.11.1','./js/terrain-textures.js?v=0.11.1','./js/material-art-data.js?v=0.11.0','./js/world-art-premium.js?v=0.11.0','./js/runtime-diagnostics.js?v=0.11.1','./js/adventure-art.js?v=0.9.0','./js/adventure-rules.js?v=0.9.0','./js/world-actions.js?v=0.9.0','./js/world-biomes.js?v=0.9.0','./js/material-economy.js?v=0.9.0','./css/adventure-world.css?v=0.8.0-premium3','./css/world-premium.css?v=0.11.0','./css/craft-layout.css?v=0.8.2','./js/config.js?v=0.11.1','./js/data.js?v=0.9.0','./js/db.js?v=0.2.26-almaprintad','./js/engine.js?v=0.11.1','./js/providers.js?v=0.11.1','./assets/crafterra-emblem.png','./assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png','./assets/favicon-64.png','./assets/logo.svg','./tools/recipe-editor.html','./tools/editor.js','./js/promo-almaprint-data.js?v=0.2.30-embeddedvideo'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(x=>c.add(x)))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 // Safari/iOS uses byte-range requests for media. Never cache/intercept video.
 if(e.request.headers.has('range')||/\.(mp4|mov|m4v|webm)$/i.test(u.pathname))return;
 const isNav=e.request.mode==='navigate'||e.request.destination==='document';
 if(isNav){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
   const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return r
  }).catch(()=>caches.match('./index.html')));
  return
 }
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
  if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c)).catch(()=>{})}
  return r
 })));
});
