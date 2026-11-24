import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
 PAN_START_PX,CAMERA_TILE_WIDTH,CAMERA_TILE_HEIGHT,
 clampCameraPosition,createCameraPan
} from '../js/world-camera.js';
const read=async p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const [world,css,html,sw]=await Promise.all([
 read('js/adventure-world.js'),read('css/world-premium.css'),
 read('index.html'),read('sw.js')
]);
assert.equal(PAN_START_PX,9);
assert.equal(CAMERA_TILE_WIDTH,48);assert.equal(CAMERA_TILE_HEIGHT,24);
let cam={x:100,y:190},player={x:9,y:10},walking=true,pending=true,panStarts=0,panEvents=0,modeChanges=[];
const pan=createCameraPan({
 getCamera:()=>cam,setCamera:next=>{cam=next;},
 getViewport:()=>({width:320,height:560,rect:{width:160,height:280}}),
 getBounds:()=>({width:30,height:22}),
 onStart:()=>{walking=false;pending=false;panStarts++;},
 onPan:()=>{panEvents++;},
 onMode:manual=>{modeChanges.push(manual);}
});
const pointer=(x,y,id=3)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,button:0,preventDefault(){this.prevented=true;}});
assert.equal(pan.isManual,false);
assert.equal(pan.down(pointer(70,95)),true);
assert.equal(pan.move(pointer(75,99)),false,'a 6px wobble remains a tap');
assert.deepEqual(cam,{x:100,y:190},'tap cannot move camera');
assert.equal(pan.end(pointer(75,99)),false);
assert.equal(pan.ignoreClick(),false,'a tap must still trigger click-to-walk');
assert.equal(panStarts,0);assert.equal(walking,true);
assert.equal(pan.down(pointer(70,95)),true);
let move=pointer(95,120);
assert.equal(pan.move(move),true,'drag of more than 9px pans');
assert.equal(move.prevented,true,'touch scroll must be cancelled');
assert.deepEqual(cam,{x:50,y:140},'the terrain follows the finger, scaled to CSS pixels');
assert.equal(player.x,9,'panning cannot move the player');
assert.equal(player.y,10,'panning cannot move the player');
assert.equal(walking,false,'ongoing auto-walk stops when deliberate panning begins');
assert.equal(pending,false,'previous target interaction is cancelled');
assert.equal(panStarts,1);
assert.equal(panEvents,1);
assert.equal(pan.isManual,true,'manual camera must not snap back to avatar');
assert.equal(pan.isPanning,true);
assert.equal(pan.end(pointer(95,120)),true);
assert.equal(pan.isPanning,false);
assert.equal(pan.ignoreClick(),true,'browser-generated post-drag click cannot move the player');
assert.equal(pan.ignoreClick(),false,'click suppression is consumed only once');
assert.equal(pan.down(pointer(95,120)),true);
assert.equal(pan.end(pointer(95,120)),false);
assert.equal(pan.ignoreClick(),false,'the next intentional tap works immediately');
assert.deepEqual(cam,{x:50,y:140},'pan position persists without automatic recentering');
pan.recenter();assert.equal(pan.isManual,false);
assert.deepEqual(modeChanges,[true,false],'recenter visibly changes the mode');
assert.deepEqual(clampCameraPosition(-100000,100000,30,22),{x:-552,y:660},'pan cannot wander infinitely out of the map');
assert.deepEqual(clampCameraPosition(100000,-100000,11,9),{x:288,y:-48},'indoor panning has separate map bounds');
const wrongPointer=pointer(40,50,99);
assert.equal(pan.down(pointer(30,30,1)),true);
assert.equal(pan.move(wrongPointer),false,'unrelated pointer cannot steal pan gesture');
assert.equal(pan.end(wrongPointer),false);
assert.equal(pan.end(pointer(30,30,1)),false);
assert.ok(world.includes("import{createCameraPan}from './world-camera.js"),'controller is imported by real game');
assert.ok(world.includes("id=\\"adv-recenter\\""),'recenter UI is present');
assert.ok(world.includes("cameraPan.down(ev)"),'pointer down wired to map');
assert.ok(world.includes("cameraPan.move(ev)"),'pointer move wired to map');
assert.ok(world.includes("cameraPan.end(ev)"),'pointer up/cancel wired to map');
assert.ok(world.includes("if(cameraPan.ignoreClick())return;"),'post-drag browser click cannot issue walk command');
assert.ok(world.includes("if(!cameraPan.isManual){cam.x+="),'following only happens in auto mode');
assert.ok(world.includes("cameraPan.isPanning"),'drawing boosts frame cadence during drag');
assert.ok(world.includes("cameraPan.recenter();"),'changing scene restores player following');
assert.ok(css.includes('touch-action:none!important'),'iPhone WebKit must not interpret panning as page scroll');
assert.ok(css.includes('.adv-recenter[hidden]'),'recenter control hidden until free camera');
assert.ok(sw.includes('world-camera.js?v=0.11.3'),'new camera code must be available offline');
assert.ok(html.includes('js/app.js?v=0.11.3-camera'),'PWA must load camera release');
console.log('CRAFTERRA 0.11.3: touch tap-to-walk vs drag-to-pan, bounded free camera, click suppression, scene reset and offline cache OK');
