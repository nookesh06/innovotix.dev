(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];const year=$('#year');if(year)year.textContent=new Date().getFullYear();const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Responsive nav works on all three independent pages.
const menu=$('.menu'),nav=$('.topbar nav');if(menu&&nav)menu.addEventListener('click',()=>nav.classList.toggle('open'));
// GSAP is optional: all content is visible by default. Wheel robots are articulated SVG characters.
const initWheelBot=(bot,stage,status)=>{
 if(!bot||!stage)return;
 const gsap=window.gsap;
 let active=false;
 const setStatus=(on)=>{if(status){status.textContent=on?'CURSOR LINK: ACTIVE':'CURSOR LINK: STANDBY';status.classList.toggle('active',on);}};
 if(gsap&&!reduce){
   gsap.to(bot.querySelector('.wheelbot-rig'),{y:-6,duration:.8,yoyo:true,repeat:-1,ease:'sine.inOut'});
   ['.wheelbot-wheel-left','.wheelbot-wheel-right'].forEach((sel,i)=>gsap.to(bot.querySelector(sel),{rotation:360,duration:2.4,repeat:-1,ease:'none',transformOrigin:'center center',delay:i*.12}));
   gsap.to(bot.querySelector('.wheelbot-head'),{rotation:3,duration:1.8,yoyo:true,repeat:-1,ease:'sine.inOut',transformOrigin:'200px 185px'});
   gsap.to(bot.querySelector('.wheelbot-core'),{scale:1.22,opacity:.55,duration:.9,yoyo:true,repeat:-1,ease:'sine.inOut',transformOrigin:'center'});
   gsap.to(bot.querySelectorAll('.wheelbot-arm'),{rotation:7,duration:.65,yoyo:true,repeat:-1,stagger:.18,ease:'sine.inOut',transformOrigin:'50% 10%'});
 }
 const move=(event)=>{
   const r=stage.getBoundingClientRect();
   const px=(event.clientX-r.left)/r.width, py=(event.clientY-r.top)/r.height;
   const dx=Math.max(-r.width*.23,Math.min(r.width*.23,(px-.5)*r.width*.46));
   const dy=Math.max(-r.height*.12,Math.min(r.height*.12,(py-.55)*r.height*.24));
   if(active){
     if(gsap&&!reduce)gsap.to(bot,{x:dx,y:dy,duration:.55,ease:'power3.out',overwrite:'auto'});
     else bot.style.transform=`translate(${dx}px,${dy}px)`;
   }
   const head=bot.querySelector('.wheelbot-head');
   if(head&&gsap&&!reduce){const look=(px-.5)*10;gsap.to(head,{rotation:look,duration:.3,ease:'power2.out',overwrite:'auto'});}
 };
 const toggle=()=>{
   active=!active;bot.classList.toggle('cursor-follow-active',active);setStatus(active);
   if(!active){if(gsap&&!reduce)gsap.to(bot,{x:0,y:0,duration:.55,ease:'power3.out'});else bot.style.transform='';}
   else if(status)status.textContent='CURSOR LINK: ACTIVE · MOVE POINTER';
 };
 bot.addEventListener('click',toggle);
 bot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
 stage.addEventListener('pointermove',move);
 stage.addEventListener('pointerleave',()=>{if(active){if(gsap&&!reduce)gsap.to(bot,{x:0,y:0,duration:.7,ease:'power2.out'});else bot.style.transform='';}});
};
if(window.gsap&&!reduce){const gsap=window.gsap;if(window.ScrollTrigger)gsap.registerPlugin(window.ScrollTrigger);
 if($('.home-page')){
   const bot=$('.hero-bot');initWheelBot(bot,$('.home-stage'),null);
   gsap.to('.orbit-a',{rotation:360,duration:38,repeat:-1,ease:'none'});gsap.to('.orbit-b',{rotation:-360,duration:31,repeat:-1,ease:'none'});
   gsap.to('.robot-shadow',{scaleX:.75,opacity:.12,duration:.8,yoyo:true,repeat:-1,ease:'sine.inOut'});
 }
 if($('.robotics-page')){
   const bot=$('.walk-bot');initWheelBot(bot,$('.robot-walk-stage'),$('.robot-follow-status'));
   $$('.sidekick-bot').forEach((b,i)=>{gsap.to(b,{y:i%2?-10:9,rotation:i%2?2:-2,duration:1.2+i*.2,yoyo:true,repeat:-1,ease:'sine.inOut'});b.querySelectorAll('.wheelbot-wheel').forEach((w,j)=>gsap.to(w,{rotation:360,duration:2.8+i*.5,repeat:-1,ease:'none',delay:j*.1}));const core=b.querySelector('.wheelbot-core');if(core)gsap.to(core,{scale:1.2,opacity:.55,duration:.8+i*.2,yoyo:true,repeat:-1});});
 }
 if($('.smart-page')){gsap.to('.smart-glow',{opacity:.5,duration:1.8,yoyo:true,repeat:-1,stagger:.3,ease:'sine.inOut'});gsap.to('.smart-lamp i',{opacity:.6,duration:1.4,yoyo:true,repeat:-1,stagger:.25,ease:'sine.inOut'});}
 if(window.ScrollTrigger){$$('.module-card,.company-story,.person-card,.partner-grid article,.learning-grid article,.kit-detail,.solution-grid article,.routine-grid article,.timeline article').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.7,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));}
}else{
 document.documentElement.classList.add('motion-fallback');
 // CSS fallback also keeps cursor interaction available without GSAP.
 if($('.home-page'))initWheelBot($('.hero-bot'),$('.home-stage'),null);
 if($('.robotics-page'))initWheelBot($('.walk-bot'),$('.robot-walk-stage'),$('.robot-follow-status'));
}
// Smart-lighting demo. Controls only manipulate the illustrative scene, never a real home.
const room=$('#interactive-room');if(room){const values={ceiling:82,accent:58,floor:72},tones={warm:'255,204,133',neutral:'245,241,220',cool:'168,216,255',blue:'111,145,255'};const presets={welcome:{ceiling:82,accent:58,floor:72,tone:'warm'},focus:{ceiling:100,accent:22,floor:0,tone:'neutral'},movie:{ceiling:12,accent:42,floor:18,tone:'warm'},night:{ceiling:0,accent:12,floor:18,tone:'blue'}};
 const update=(key,value)=>{values[key]=Math.max(0,Math.min(100,Number(value)));room.style.setProperty('--'+key,values[key]/100);const slider=$(`[data-brightness="${key}"]`);if(slider)slider.value=values[key];const label=$(`[data-value="${key}"]`);if(label)label.textContent=values[key]+'%';const toggle=$(`[data-light="${key}"]`);if(toggle){toggle.classList.toggle('on',values[key]>0);toggle.setAttribute('aria-pressed',String(values[key]>0));}const active=Object.values(values).filter(v=>v>0).length;$('#active-count').textContent=active+' / 03 ON';};
 const tone=t=>{room.style.setProperty('--light-color',tones[t]||tones.warm);$$('.tone').forEach(b=>b.classList.toggle('active',b.dataset.tone===t));};
 $$('[data-light]').forEach(btn=>btn.addEventListener('click',()=>{const k=btn.dataset.light;update(k,values[k]>0?0:Math.max(45,values[k]));$$('.scene-btn').forEach(b=>b.classList.remove('active'));}));
 $$('[data-brightness]').forEach(sl=>sl.addEventListener('input',()=>{update(sl.dataset.brightness,sl.value);$$('.scene-btn').forEach(b=>b.classList.remove('active'));}));
 $$('.scene-btn').forEach(btn=>btn.addEventListener('click',()=>{const p=presets[btn.dataset.scene];if(!p)return;Object.keys(values).forEach(k=>update(k,p[k]));tone(p.tone);$$('.scene-btn').forEach(b=>b.classList.toggle('active',b===btn));room.dataset.scene=btn.dataset.scene;}));
 $$('.tone').forEach(btn=>btn.addEventListener('click',()=>tone(btn.dataset.tone)));tone('warm');Object.keys(values).forEach(k=>update(k,values[k]));}
})();