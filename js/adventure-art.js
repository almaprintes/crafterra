// CRAFTERRA · Iconografía vectorial ilustrada, incluida y usable sin conexión.
// Cada botón contiene arte SVG con volúmenes, materiales y reflejos, no emojis.
const art={
 axe:'<g transform="rotate(-29 36 35)"><path d="M32 14h9v47h-9z" fill="url(#wood)" stroke="#61452f" stroke-width="2"/><path d="M30 16l13-3 10 10-3 13-13-4-9 5-11-1-1-14z" fill="url(#steel)" stroke="#2e5366" stroke-width="2"/><path d="M19 22l12-5-3 15-10 3" fill="#edfaff"/><path d="M34 49h6" stroke="#fed890" stroke-width="3"/></g>',
 pick:'<g transform="rotate(-30 36 35)"><path d="M33 18h9v44h-9z" fill="url(#wood)" stroke="#61452f" stroke-width="2"/><path d="M11 19q25-17 49 1l-2 10-15-5-21 2-11 6z" fill="url(#steel)" stroke="#3a526a" stroke-width="2"/><path d="M15 22l13-5M47 18l9 4" stroke="#eafbff" stroke-width="2"/></g>',
 hammer:'<g transform="rotate(-24 36 36)"><rect x="34" y="17" width="9" height="46" rx="2" fill="url(#wood)" stroke="#734d2a" stroke-width="2"/><path d="M16 14h43v17H16z" fill="url(#steel)" stroke="#3c566b" stroke-width="2"/><path d="M18 19h39" stroke="#ecfbff" opacity=".8" stroke-width="2"/></g>',
 log:'<g transform="rotate(-14 36 39)"><path d="M15 29l31-12 16 14-30 16z" fill="url(#wood)" stroke="#57391e" stroke-width="2"/><ellipse cx="24" cy="39" rx="12" ry="13" fill="#f4c98c" stroke="#976038" stroke-width="2"/><ellipse cx="24" cy="39" rx="7.5" ry="8" fill="none" stroke="#be7c41" stroke-width="2"/><ellipse cx="24" cy="39" rx="2.7" ry="3.2" fill="#a46937"/><path d="M46 21l11 10" stroke="#f6ce9b" stroke-width="2"/></g>',
 stone:'<path d="M11 47l13-23 24-8 16 19-7 18-30 5Z" fill="#8a9fa8" stroke="#425e71" stroke-width="2"/><path d="M11 47l17-5 20-26-24 8z" fill="#d3e4e1"/><path d="M28 42l20-26 16 19-7 18z" fill="#687e8d"/><path d="M20 52l10-3 23 4" fill="none" stroke="#eef3e8" stroke-width="2"/>',
 fire:'<path d="M12 56l15-9 31 10-13 6zM15 51l12-9 30 12" fill="url(#wood)" stroke="#473027" stroke-width="3"/><path d="M25 50C14 38 28 32 31 21c4 11 8 8 13 0-2 12 15 17 6 29-6 10-22 11-25 0z" fill="url(#flame)"/><path d="M31 52q-5-7 6-18 3 12 8 12-1 10-14 6" fill="#fff0aa"/>',
 bowl:'<path d="M10 33q26-9 52 0-5 27-26 27-21 0-26-27" fill="url(#wood)" stroke="#79502d" stroke-width="2"/><ellipse cx="36" cy="33" rx="26" ry="9" fill="#5aaebf" stroke="#f3cd8d" stroke-width="3"/><path d="M14 31q20-9 44 0" fill="none" stroke="#b9fbff" stroke-width="3"/><path d="M26 15q-6 8 0 12M39 12q-6 9 0 15" stroke="#c0f5ff" stroke-width="3" fill="none" opacity=".65"/>',
 ingot:'<path d="M13 49l9-18h30l9 18-8 7H21z" fill="url(#steel)" stroke="#637486" stroke-width="2"/><path d="M22 31h30l9 18H13z" fill="#d8e4e6"/><path d="M24 36h27l4 11H19z" fill="#a1b2c6"/><path d="M19 49h35" stroke="#fff" stroke-width="2" opacity=".6"/>',
 gem:'<path d="M35 10l25 15-5 24-20 14-22-15-2-24z" fill="url(#gem)" stroke="#3e8bb2" stroke-width="2"/><path d="M35 10l6 21-7 32-10-35z" fill="#d7f9ff" opacity=".8"/><path d="M41 31l19-6-5 24-21 14z" fill="#2486ba" opacity=".55"/>',
 saw:'<g transform="rotate(-20 36 34)"><path d="M16 12h16v46H16z" fill="url(#wood)" stroke="#6b442a" stroke-width="2"/><path d="M26 17h26v38l-5-5-5 5-5-5-5 5-6-5z" fill="url(#steel)" stroke="#43576b" stroke-width="2"/><path d="M31 23h17" stroke="#f9ffff" stroke-width="2"/><circle cx="24" cy="50" r="3.5" fill="#ffe0a0"/></g>',
 door:'<path d="M18 11h37v54H18z" fill="#6a4f3b" stroke="#d6ba8a" stroke-width="3"/><path d="M24 18h25v44H24z" fill="url(#wood)"/><path d="M27 22h19v16H27z" fill="none" stroke="#f0bc79" stroke-width="2"/><circle cx="43" cy="45" r="3" fill="#ffe58c"/>',
 bed:'<path d="M8 39h56v16H8z" fill="url(#wood)" stroke="#725038" stroke-width="2"/><path d="M8 32h56v13H8z" fill="#d0b978"/><rect x="12" y="30" width="19" height="12" rx="4" fill="#fff0d0"/><path d="M38 32h23v12H38z" fill="#63aaac"/><path d="M12 55v8M57 55v8" stroke="#a16a43" stroke-width="5"/>',
 basket:'<path d="M11 31h50l-6 30H17z" fill="#c8914d" stroke="#664b2b" stroke-width="2"/><path d="M18 34l8 26m10-26v26m11-26-8 26" stroke="#805d35" stroke-width="3"/><path d="M21 31Q26 10 36 10t15 21" fill="none" stroke="#e5bc7f" stroke-width="5"/><circle cx="28" cy="29" r="8" fill="#dd5060"/><circle cx="42" cy="27" r="8" fill="#b5d374"/><circle cx="36" cy="34" r="8" fill="#f2b35c"/>',
 shield:'<path d="M36 8l26 9-3 27-23 22-23-22-3-27z" fill="url(#steel)" stroke="#c8deea" stroke-width="2"/><path d="M36 13v47l19-18 2-21z" fill="#a7c2c7"/><path d="M25 35l8 7 15-18" fill="none" stroke="#f9df93" stroke-width="6" stroke-linecap="round"/>'
};
const palette={
 fire:['#66412d','#232339','#ffb553'],forge:['#684632','#212739','#ffb553'],
 stone:['#456a7a','#193144','#b4e7e5'],ore:['#456a7a','#193144','#b4e7e5'],
 log:['#5c7855','#233c3c','#dfc484'],axe:['#3f707b','#192f41','#c8e6e9'],
 pick:['#426c85','#1d3147','#d8eafa'],hammer:['#4d6680','#233246','#d6eafa'],
 bowl:['#2c768a','#153f58','#a0f4ff'],ingot:['#526b88','#1e3048','#edf7ff'],
 gem:['#30758b','#1e3a54','#bbfdff'],saw:['#566a77','#26394b','#dbedff'],
 door:['#786342','#253747','#f4d08f'],bed:['#76634b','#25354b','#f4d08f'],
 basket:['#786644','#2a433c','#f7d482'],shield:['#4c6477','#23314a','#e3efff']
};
export function actionKind(id='',label=''){
 const k=String(id).toLowerCase(),n=String(label).toLowerCase();
 if(k==='chop'||k.includes('axe'))return'axe';
 if(k==='hit'||k.includes('rough_wood')||k.includes('wood'))return'log';
 if(k==='mine'||k.includes('pickaxe'))return'pick';
 if(k==='fill'||k.includes('water'))return'bowl';
 if(k.includes('saw')||k.startsWith('refine'))return'saw';
 if(k==='stone_table'||k.includes('stonework')||k.includes('cut_stone')||k==='stone')return'stone';
 if(k.includes('hammer')||k.includes('repair'))return'hammer';
 if(k.includes('forge'))return'forge';
 if(k.includes('smelt')||k.includes('ingot')||k.includes('alloy'))return'ingot';
 if(k.startsWith('fuel')||k.includes('hearth')||k.includes('fire')||k==='charcoal')return'fire';
 if(k.includes('pantry')||k.includes('fiber')||k.includes('berries'))return'basket';
 if(k.includes('bed'))return'bed';
 if(k.includes('house')||k.includes('exit'))return'door';
 if(k.includes('workbench')||k.includes('workshop'))return'hammer';
 if(k.includes('bridge'))return'shield';
 if(k.includes('copper')||k.includes('tin')||k.includes('gold')||k.includes('silver')||k.includes('iron'))return'ingot';
 if(k.includes('quartz')||k.includes('gem'))return'gem';
 if(k.includes('coal'))return'stone';
 if(n.includes('combustible')||n.includes('fuego'))return'fire';
 if(n.includes('tallar')||n.includes('piedra'))return'stone';
 if(n.includes('mineral')||n.includes('mena'))return'ore';
 if(n.includes('fundir')||n.includes('aleacion'))return'ingot';
 if(n.includes('forjar')||n.includes('herramienta'))return'forge';
 if(n.includes('hablar'))return'shield';
 if(n.includes('entrar')||n.includes('salir')||n.includes('volver'))return'door';
 if(n.includes('cortar'))return'axe';
 if(n.includes('golpear'))return'log';
 return'gem';
}
let artSequence=0;
export function actionArt(kind='gem',size='md'){
 const chosen=kind==='ore'?'stone':kind==='forge'?'hammer':kind;
 const motif=art[chosen]||art.gem,p=palette[kind]||palette[chosen]||palette.gem;
 const defs='<defs><linearGradient id="bg" x1=".1" y1="0" x2=".9" y2="1"><stop stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[1]+'"/></linearGradient><linearGradient id="steel" x1=".1" y1="0" x2=".9" y2="1"><stop stop-color="#f8ffff"/><stop offset=".5" stop-color="#acc8d1"/><stop offset="1" stop-color="#587589"/></linearGradient><linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f9c17a"/><stop offset=".55" stop-color="#aa7044"/><stop offset="1" stop-color="#634630"/></linearGradient><linearGradient id="flame" x1=".2" x2=".8" y1="1" y2="0"><stop stop-color="#ff692f"/><stop offset=".6" stop-color="#ffc74e"/><stop offset="1" stop-color="#fff1a3"/></linearGradient><linearGradient id="gem" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#caffff"/><stop offset=".5" stop-color="#70d4f4"/><stop offset="1" stop-color="#338fc7"/></linearGradient><radialGradient id="halo"><stop stop-color="'+p[2]+'" stop-opacity=".5"/><stop offset="1" stop-color="'+p[2]+'" stop-opacity="0"/></radialGradient></defs>';
 const svg='<svg class="adv-art adv-art-'+size+'" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+defs+'<rect x="2" y="2" width="68" height="68" rx="16" fill="url(#bg)"/><circle cx="35" cy="29" r="33" fill="url(#halo)"/><path d="M8 55Q35 43 64 55v9Q35 73 8 62" fill="#081522" opacity=".34"/><path d="M8 8Q33 1 59 8" stroke="#fff" stroke-width="2" opacity=".22" fill="none"/>'+motif+'<rect x="3" y="3" width="66" height="66" rx="15" stroke="#fff" stroke-opacity=".23" fill="none"/></svg>';
 const suffix='adv'+(++artSequence).toString(36);
 return svg.replace(/id="(bg|steel|wood|flame|gem|halo)"/g,(_,id)=>'id="'+id+'-'+suffix+'"')
   .replace(/url\(#(bg|steel|wood|flame|gem|halo)\)/g,(_,id)=>'url(#'+id+'-'+suffix+')');
}
