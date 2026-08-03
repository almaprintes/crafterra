const CACHE='crafterra-v0.2.31-importsave';
const CORE=['./','./index.html','./manifest.webmanifest','./css/game.css?v=0.2.31-importsave','./js/app.js?v=0.2.31-importsave','./js/config.js?v=0.2.26-almaprintad','./js/data.js?v=0.2.26-almaprintad','./js/db.js?v=0.2.26-almaprintad','./js/engine.js?v=0.2.26-almaprintad','./js/providers.js?v=0.2.26-almaprintad','./assets/crafterra-emblem.png','./assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png','./assets/favicon-64.png','./assets/logo.svg','./tools/recipe-editor.html','./tools/editor.js','./js/promo-almaprint-data.js?v=0.2.30-embeddedvideo'];
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
