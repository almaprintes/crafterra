import{CONFIG}from'./config.js?v=0.2.26-almaprintad';
export class RewardedAdsProvider{constructor(){this.mode='DEVELOPMENT'}async show(context,state){const key=new Date().toLocaleDateString('sv');if(state.ads.date!==key)state.ads={date:key,count:0};if(state.ads.count>=CONFIG.ads.dailyLimit)throw Error('Límite diario alcanzado');state.ads.count++;return{development:true,reward:CONFIG.ads.rewards[state.ads.count-1]||250,context}}}
export class StoreProvider{constructor(){this.mode='DEVELOPMENT'}async purchase(){return{ok:false,development:true,message:'Compra no disponible en esta versión.'}}}
