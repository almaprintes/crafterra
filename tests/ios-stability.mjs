import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
 safeCanvasDpr,targetFrameInterval,DIAG_KEY,runtimeDiagnosticReport,
 captureRuntimeFault,clearRuntimeFaults
} from '../js/runtime-diagnostics.js';
const file=async p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const [world,app,terrain,workflow]=await Promise.all([
 file('js/adventure-world.js'),file('js/app.js'),
 file('js/terrain-textures.js'),file('.github/workflows/validate-crafterra.yml')
]);
assert.equal(DIAG_KEY,'crafterra-diagnostics-v1');
assert.ok(safeCanvasDpr(390,640,3)<=1.55,'iPhone Retina drawing must have a quality cap');
assert.ok(Math.round(390*safeCanvasDpr(390,640,3))*Math.round(640*safeCanvasDpr(390,640,3))<=950000,'max pixel budget');
assert.equal(safeCanvasDpr(1,1,1),1);
assert.equal(safeCanvasDpr(390,640,1),1);
assert.ok(safeCanvasDpr(1920,1080,3)>=1,'canvas never scales below CSS resolution');
assert.ok(targetFrameInterval(false,false,false)>68,'idle frame rate should not exceed ~14fps');
assert.ok(targetFrameInterval(true,false,false)<37,'walking stays around 28fps');
assert.ok(targetFrameInterval(false,true,false)<37,'harvesting updates at walk framerate');
const sample=captureRuntimeFault(new Error('Synthetic test only'),{stage:'test',scene:'house_lia',width:600,height:900,dpr:1.5});
assert.equal(sample.scene,'house_lia');
assert.equal(sample.stage,'test');
assert.match(sample.message,/Synthetic/);
assert.equal(runtimeDiagnosticReport().scene,'unknown','server tests have no browser localStorage');
clearRuntimeFaults();
assert.ok(world.includes('function getRoomFloor(scene)'),'rooms are pre-rendered');
assert.ok(world.includes('floorCache.set(scene,layer)'),'precomposed room flooring is retained');
assert.ok(world.includes('floorCacheRevision!==revision'),'new texture atlas invalidates stale room floor');
assert.ok(world.includes('paintRoomFloor(scene);'),'cave and house renders reuse a cached layer');
assert.ok(world.split('paintRoomFloor(scene);').length>=3,'both house and cave reuse the floor cache');
assert.ok(world.includes('currentDpr=safeCanvasDpr('),'canvas DPR limited');
assert.ok(!world.includes('Math.min(2,Math.max(1,typeof window'),'uncapped 2x retina implementation removed');
assert.ok(world.includes('const interval=targetFrameInterval('),'render cadence adapts to activity');
assert.ok(world.includes('if(t-lastDrawAt>=interval)'),'render skips idle frames');
assert.ok(/function tick\(t\)[\s\S]*?catch\(error\)[\s\S]*?finally\s*\{[\s\S]*?requestAnimationFrame\(tick\)/.test(world),'frame loop survives exception');
assert.ok(world.includes("stage:'animation-frame'"),'render exceptions are recorded');
assert.ok(world.includes("stage:'refresh'"),'refresh exceptions are recorded');
assert.ok(app.includes('id="diagnosticBtn"'),'players can export diagnostics from settings');
assert.ok(app.includes('runtimeDiagnosticReport()'),'diagnostic export uses real stored errors');
assert.ok(app.includes("link.download='crafterra-diagnostico-"),'report is available as a JSON file');
assert.ok(app.includes("captureRuntimeFault(event.reason"),'uncaught promises are captured');
assert.ok(app.includes("captureRuntimeFault(event.error"),'uncaught JS errors are captured');
assert.ok(terrain.includes('terrainTextureRevision()'),'room cache tracks texture atlas revisions');
assert.ok(workflow.includes('tests/ios-stability.mjs'),'this test is mandatory in CI');
console.log('CRAFTERRA 0.11.1: bounded iOS retina canvas, idle FPS, precomposed workshop/caves, RAF recovery and local diagnostics OK');
