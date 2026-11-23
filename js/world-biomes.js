// CRAFTERRA 0.9 · Los biomas determinan recursos y actividades de forma verificable.
// Sin generadores aleatorios dependientes del guardado ni decoraciones inertes.
export const BIOMES=Object.freeze({
 meadow:{name:'Praderas',ground:'#94c778',edge:'#6ba46b',resources:['wood','plant_fiber','berries','herbs','rabbit','sheep']},
 forest:{name:'Bosque',ground:'#4f976a',edge:'#367a5a',resources:['wood','plant_fiber','mushroom','herbs','deer']},
 rocky:{name:'Sierra rocosa',ground:'#89948d',edge:'#5d7678',resources:['stone','iron','copper','tin','coal','quartz','silver','gold']},
 cave:{name:'Cueva',ground:'#505c66',edge:'#303f4a',resources:['stone','iron','copper','tin','coal','quartz','silver','gold']}
});
export const ORE_TYPES=Object.freeze(['iron','copper','tin','coal','quartz','silver','gold']);
export const CAVE_ENTRANCES=Object.freeze([
 {id:'cave_west',x:12,y:3,kind:'cave',scene:'cave_west',label:'Cueva de la sierra'},
 {id:'cave_east',x:25,y:4,kind:'cave',scene:'cave_east',label:'Gruta de los cristales'}
]);
export const CAVE_NODES=Object.freeze({
 cave_west:Object.freeze([
  {id:'cueva_oeste_piedra',x:3,y:3,type:'stone',qty:3,biome:'cave'},
  {id:'cueva_oeste_hierro',x:6,y:3,type:'iron',qty:2,biome:'cave'},
  {id:'cueva_oeste_cobre',x:7,y:5,type:'copper',qty:2,biome:'cave'},
  {id:'cueva_oeste_carbon',x:2,y:5,type:'coal',qty:2,biome:'cave'}
 ]),
 cave_east:Object.freeze([
  {id:'cueva_este_piedra',x:3,y:5,type:'stone',qty:3,biome:'cave'},
  {id:'cueva_este_estano',x:3,y:2,type:'tin',qty:2,biome:'cave'},
  {id:'cueva_este_plata',x:7,y:3,type:'silver',qty:2,biome:'cave'},
  {id:'cueva_este_oro',x:7,y:5,type:'gold',qty:2,biome:'cave'},
  {id:'cueva_este_cuarzo',x:2,y:4,type:'quartz',qty:2,biome:'cave'}
 ])
});
export const ANIMAL_SPECIES=Object.freeze({
 sheep:{name:'Oveja',biome:'meadow',method:'shear'},
 rabbit:{name:'Conejo',biome:'meadow',method:'hunt',meat:1,hide:1,bone:0},
 deer:{name:'Ciervo',biome:'forest',method:'hunt',meat:3,hide:2,bone:1}
});
export const WORLD_ANIMALS=Object.freeze([
 {id:'oveja1',x:4,y:11,type:'animal',species:'sheep',kind:'node'},
 {id:'oveja2',x:19,y:10,type:'animal',species:'sheep',kind:'node'},
 {id:'conejo1',x:7,y:11,type:'animal',species:'rabbit',kind:'node'},
 {id:'conejo2',x:22,y:9,type:'animal',species:'rabbit',kind:'node'},
 {id:'ciervo1',x:19,y:16,type:'animal',species:'deer',kind:'node'},
 {id:'ciervo2',x:10,y:15,type:'animal',species:'deer',kind:'node'}
]);
// Se mantienen dos sierras accesibles; la occidental no requiere haber reparado el puente.
export function biomeAt(x,y){
 if(x===15)return'river';
 if((x>=8&&x<=13&&y<=5)||(x>=2&&x<=10&&y>=18)||
    (x>=23&&y<=8)||(x>=24&&y>=11&&y<=13)||(x>=24&&y>=17))return'rocky';
 if((x<=13&&y>=14)||(x>=18&&x<=23&&y>=13))return'forest';
 return'meadow';
}
export function isBiomeResource(node){
 if(node.type==='water')return true;
 const area=node.biome||biomeAt(node.x,node.y);
 if(node.type==='animal')return area===ANIMAL_SPECIES[node.species]?.biome;
 return !!BIOMES[area]?.resources.includes(node.type);
}
export function biomeLabel(x,y,scene=null){
 return scene?.startsWith('cave_')?BIOMES.cave.name:BIOMES[biomeAt(x,y)]?.name||'Río del valle';
}
