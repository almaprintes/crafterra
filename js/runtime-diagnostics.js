// CRAFTERRA 0.11.1 · Lightweight, private runtime diagnostics and safe frame budgets.
// Diagnostics stay on the device and are exported only if the player requests them.
export const DIAG_KEY='crafterra-diagnostics-v1';
const MAX_EVENTS=12;
function storage(){
 try{return typeof localStorage!=='undefined'?localStorage:null;}catch{return null;}
}
function read(){
 try{return JSON.parse(storage()?.getItem(DIAG_KEY)||'{}')||{};}catch{return {};}
}
function write(data){
 try{storage()?.setItem(DIAG_KEY,JSON.stringify(data));}catch{}
}
export function noteRuntimeScene(scene,version='0.11.1'){
 const prev=read();
 write({...prev,version,scene:scene||'valley',sceneAt:new Date().toISOString()});
}
export function captureRuntimeFault(error,info={}){
 const prev=read();
 const event={
  at:new Date().toISOString(),
  message:String(error?.message||error||'Unknown rendering problem').slice(0,260),
  stack:String(error?.stack||'').slice(0,700),
  scene:String(info.scene||prev.scene||'valley').slice(0,60),
  stage:String(info.stage||'unknown').slice(0,50),
  width:Number(info.width||0),
  height:Number(info.height||0),
  dpr:Number(info.dpr||0)
 };
 const events=[...(Array.isArray(prev.events)?prev.events:[]),event].slice(-MAX_EVENTS);
 write({...prev,events,lastErrorAt:event.at});
 if(typeof window!=='undefined')window.__CRAF_LAST_ERROR=event.message;
 return event;
}
export function runtimeDiagnosticReport(){
 const s=read();return {
  version:s.version||'0.11.1',scene:s.scene||'unknown',
  sceneAt:s.sceneAt||null,events:Array.isArray(s.events)?s.events:[],
  note:'Local-only diagnostics. Not automatically uploaded. Browser process kills cannot always be captured.'
 };
}
export function clearRuntimeFaults(){
 const prev=read();write({...prev,events:[],lastErrorAt:null});
}
// Avoid backing large Retina canvases for a UI occupying most of the phone screen.
// At CSS width=390/height=640 this produces roughly 0.6 Mpix, not 2.2 Mpix.
export function safeCanvasDpr(width,height,devicePixelRatio=1,maxPixels=950000){
 const w=Math.max(1,Number(width)||1),h=Math.max(1,Number(height)||1);
 const pixelRatio=Math.max(1,Number(devicePixelRatio)||1);
 const cap=Math.sqrt(Math.max(1,maxPixels)/(w*h));
 return Math.max(1,Math.min(pixelRatio,1.55,cap));
}
export function targetFrameInterval(isMoving=false,isGathering=false,isAnimating=false){
 return isMoving||isGathering||isAnimating?1000/28:1000/14;
}
