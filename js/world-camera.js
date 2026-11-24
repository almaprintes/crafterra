// CRAFTERRA · Cámara táctil independiente del avatar.
// Un toque mantiene "caminar/interactuar", un arrastre mueve exclusivamente el mapa.
// Pure math and pointer callbacks can be exercised in Node without DOM or iPhone.
export const PAN_START_PX=9;
export const CAMERA_TILE_WIDTH=48;
export const CAMERA_TILE_HEIGHT=24;
export function clampCameraPosition(x,y,columns=30,rows=22){
 const cols=Math.max(2,columns),lines=Math.max(2,rows);
 const halfWidth=CAMERA_TILE_WIDTH/2,halfHeight=CAMERA_TILE_HEIGHT/2;
 // The camera stays within the map's diamond, with one tile of breathing room.
 const minX=-(lines-1)*halfWidth-CAMERA_TILE_WIDTH;
 const maxX=(cols-1)*halfWidth+CAMERA_TILE_WIDTH;
 const minY=-CAMERA_TILE_HEIGHT*2;
 const maxY=(cols+lines-2)*halfHeight+CAMERA_TILE_HEIGHT*2;
 return {x:Math.min(maxX,Math.max(minX,x)),y:Math.min(maxY,Math.max(minY,y))};
}
export function createCameraPan({
 getCamera,setCamera,getViewport,getBounds,onStart=()=>{},onPan=()=>{},onMode=()=>{}
}){
 let gesture=null,manual=false,suppressClick=false;
 const emitMode=value=>{
  if(manual===value)return;
  manual=value;onMode(manual);
 };
 function down(ev){
  if(gesture||ev.isPrimary===false||(ev.pointerType==='mouse'&&ev.button!==0))return false;
  suppressClick=false;
  const cam=getCamera();
  gesture={id:ev.pointerId,startX:ev.clientX,startY:ev.clientY,
   baseX:cam.x,baseY:cam.y,dragging:false};
  return true;
 }
 function move(ev){
  if(!gesture||gesture.id!==ev.pointerId)return false;
  const dx=ev.clientX-gesture.startX,dy=ev.clientY-gesture.startY;
  if(!gesture.dragging){
   if(Math.hypot(dx,dy)<PAN_START_PX)return false;
   gesture.dragging=true;
   emitMode(true);
   onStart();
  }
  const viewport=getViewport();
  const rect=viewport.rect;
  const scaleX=viewport.width/Math.max(1,rect.width);
  const scaleY=viewport.height/Math.max(1,rect.height);
  const bounds=getBounds();
  const cam=clampCameraPosition(
   gesture.baseX-dx*scaleX,gesture.baseY-dy*scaleY,
   bounds.width,bounds.height
  );
  setCamera(cam);
  onPan();
  ev.preventDefault?.();
  return true;
 }
 function end(ev){
  if(!gesture||gesture.id!==ev.pointerId)return false;
  const moved=gesture.dragging;
  gesture=null;
  if(moved)suppressClick=true;
  return moved;
 }
 function ignoreClick(){
  if(!suppressClick)return false;
  suppressClick=false;
  return true;
 }
 function recenter(){
  gesture=null;
  suppressClick=false;
  emitMode(false);
 }
 return {
  down,move,end,ignoreClick,recenter,
  get isManual(){return manual},
  get isPanning(){return !!gesture?.dragging}
 };
}
