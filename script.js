/* ═══════════════════════════════════════════
   SATCORP — REALISTIC COCKPIT
   script.js — All live instrument simulation
═══════════════════════════════════════════ */
'use strict';

/* ── CURSOR ── */
(function(){
  const cur = document.getElementById('cur');
  const ring = document.getElementById('curRing');
  if(!cur) return;
  let rx=0,ry=0,mx=window.innerWidth/2,my=window.innerHeight/2;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left=mx+'px'; cur.style.top=my+'px';
  });
  function animRing(){
    rx+=(mx-rx)*0.12; ry+=(my-ry)*0.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a,button,[onclick],.ufc-btn,.mode-btn,.snav-btn,.op-card,.op-div-row,.mfd-tab,.tier-opt').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cur.style.transform='translate(-50%,-50%) scale(1.8)'; ring.style.transform='translate(-50%,-50%) scale(0.6)'; ring.style.borderRadius='0'; });
    el.addEventListener('mouseleave',()=>{ cur.style.transform='translate(-50%,-50%) scale(1)'; ring.style.transform='translate(-50%,-50%) scale(1)'; ring.style.borderRadius='50%'; });
  });
})();

/* ── BOOT SEQUENCE ── */
(function(){
  const bootEl = document.getElementById('boot');
  const logEl  = document.getElementById('bootLog');
  const barEl  = document.getElementById('bootBar');
  const pctEl  = document.getElementById('bootPct');
  if(!bootEl) return;

  const msgs = [
    {t:'BIOS POST COMPLETE',ok:false},
    {t:'AVIONICS BUS POWER: ON',ok:false},
    {t:'INERTIAL NAV SYSTEM: ALIGNING...',ok:false},
    {t:'ADI GYRO SPOOL-UP: OK',ok:true},
    {t:'HSI COMPASS CARD: OK',ok:true},
    {t:'RADAR ALTIMETER: ONLINE',ok:true},
    {t:'RWR SUBSYSTEM: ONLINE',ok:true},
    {t:'IFF MODE 3/A: SET',ok:true},
    {t:'COMMS: UHF/VHF CHECKED',ok:true},
    {t:'HUD POWER: ON',ok:true},
    {t:'LEFT MFD: RADAR MAP',ok:true},
    {t:'RIGHT MFD: SYS STATUS',ok:true},
    {t:'SATCORP FLIGHT SYSTEMS: ONLINE',ok:true},
    {t:'ANU // OPERATOR: ONLINE',ok:true},
    {t:'KYRAX // AI CONCIERGE: ONLINE',ok:true},
    {t:'KI-RA STUDIOS: STANDBY',ok:true},
    {t:'PULSΞ // BROADCAST: READY',ok:true},
    {t:'ALL SYSTEMS NOMINAL — CLEARED FOR FLIGHT',ok:true},
  ];

  let i=0;
  function next(){
    if(i>=msgs.length){
      barEl.style.width='100%';
      pctEl.textContent='100%';
      setTimeout(()=>{
        bootEl.classList.add('off');
        setTimeout(()=>bootEl.style.display='none',900);
      },600);
      return;
    }
    const m=msgs[i]; i++;
    const pct=Math.round((i/msgs.length)*100);
    barEl.style.width=pct+'%';
    pctEl.textContent=pct+'%';
    const sp=document.createElement('span');
    sp.textContent=m.t;
    if(m.ok) sp.classList.add('ok');
    logEl.appendChild(sp);
    logEl.scrollTop=logEl.scrollHeight;
    setTimeout(next, 80+Math.random()*80);
  }
  next();
})();

/* ── CLOCK ── */
(function(){
  function tick(){
    const n=new Date();
    const hh=String(n.getHours()).padStart(2,'0');
    const mm=String(n.getMinutes()).padStart(2,'0');
    const ss=String(n.getSeconds()).padStart(2,'0');
    const t=hh+':'+mm+':'+ss;
    const el=document.getElementById('gsTime');
    if(el) el.textContent=t;
    const el2=document.getElementById('gsUtc');
    if(el2) el2.textContent=String(n.getUTCHours()).padStart(2,'0')+':'+String(n.getUTCMinutes()).padStart(2,'0')+'Z';
  }
  tick(); setInterval(tick,1000);
})();

/* ── ADI SIMULATION (gentle bank/pitch drift) ── */
(function(){
  const ball=document.getElementById('adiBall');
  const pitchEl=document.getElementById('adiPitch');
  if(!ball) return;
  let bank=0, pitch=0;
  let targetBank=0, targetPitch=0;
  let phase=0;

  function randomTarget(){
    targetBank=(Math.random()-0.5)*14;
    targetPitch=(Math.random()-0.5)*8;
  }
  randomTarget();
  setInterval(randomTarget, 5000);

  function animate(){
    bank+=(targetBank-bank)*0.01;
    pitch+=(targetPitch-pitch)*0.01;
    // ball rotates for bank, translates vertically for pitch
    ball.style.transform=`rotate(${bank}deg) translateY(${pitch*2}px)`;
    if(pitchEl) pitchEl.style.transform=`rotate(${bank}deg) translateY(${pitch*3}px)`;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── HUD READOUT SIMULATION ── */
(function(){
  let alt=24000, spd=420, hdg=27, mach=0.84, gs=510, vsi=200;
  let targetAlt=24000, targetSpd=420;

  function drift(){
    targetAlt=24000+(Math.random()-0.5)*600;
    targetSpd=420+(Math.random()-0.5)*20;
    vsi=Math.round((Math.random()-0.5)*400);
    hdg=Math.round(hdg+(Math.random()-0.5)*2+360)%360;
  }
  setInterval(drift,4000);

  function update(){
    alt+=(targetAlt-alt)*0.02;
    spd+=(targetSpd-spd)*0.02;
    mach=spd/500;
    gs=spd+Math.round(Math.random()*10);

    const altEl=document.getElementById('hudAlt');
    const spdEl=document.getElementById('hudSpd');
    const machEl=document.getElementById('hudMach');
    const gsEl=document.getElementById('hudGs');
    const hdgEl=document.getElementById('hudHdg');
    const vsiEl=document.getElementById('hudVsi');
    const sbsMach=document.getElementById('sbsMach');

    if(altEl) altEl.innerHTML='ALT<br>'+Math.round(alt);
    if(spdEl) spdEl.innerHTML='IAS<br>'+Math.round(spd);
    if(machEl) machEl.textContent='M '+mach.toFixed(2);
    if(gsEl) gsEl.textContent='GS '+gs;
    if(hdgEl) hdgEl.textContent='HDG '+String(hdg).padStart(3,'0')+'°';
    if(vsiEl) vsiEl.textContent='VSI '+(vsi>=0?'+':'')+vsi+' FPM';
    if(sbsMach) sbsMach.textContent=mach.toFixed(2);

    requestAnimationFrame(update);
  }
  update();
})();

/* ── G-LOAD SIMULATION ── */
(function(){
  const el=document.getElementById('sbsG');
  if(!el) return;
  let g=1.0, tg=1.0;
  setInterval(()=>{ tg=1+(Math.random()-0.4)*0.4; },2000);
  function u(){ g+=(tg-g)*0.05; el.textContent=g.toFixed(1)+'G'; requestAnimationFrame(u); }
  u();
})();

/* ── WARNING LIGHTS ── */
(function(){
  const master=document.getElementById('wlMaster');
  const caution=document.getElementById('wlCaution');
  // Occasional random warnings
  function maybeTrigger(){
    const r=Math.random();
    if(r<0.15){
      caution.classList.add('lit');
      setTimeout(()=>caution.classList.remove('lit'),3000);
    }
  }
  setInterval(maybeTrigger,8000);
})();

/* ── FIRE BUTTON ── */
(function(){
  const btn=document.getElementById('fireBtn');
  if(!btn) return;
  let armed=false;
  btn.addEventListener('click',()=>{
    armed=!armed;
    if(armed){
      btn.classList.add('active');
      btn.style.boxShadow='0 0 20px rgba(255,0,0,0.8),inset 0 0 10px rgba(255,0,0,0.3)';
      btn.textContent='ARMED';
      document.getElementById('wlMaster').classList.add('lit');
      document.getElementById('wlAim').style.background='#001a44';
      document.getElementById('wlAim').style.color='#4488ff';
      document.getElementById('wlAim').style.boxShadow='0 0 8px rgba(68,136,255,0.4)';
    } else {
      btn.classList.remove('active');
      btn.style.boxShadow='';
      btn.textContent='ARM';
      document.getElementById('wlMaster').classList.remove('lit');
      document.getElementById('wlAim').style.background='#003344';
      document.getElementById('wlAim').style.color='#006688';
      document.getElementById('wlAim').style.boxShadow='none';
    }
  });
})();

/* ── MFD TAB SWITCHER ── */
function mfdTab(btn, pageId){
  document.querySelectorAll('.mfd-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.mfd-page').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const page=document.getElementById(pageId);
  if(page) page.classList.add('active');
}

/* ── OVERLAY SYSTEM ── */
function showOverlay(id){
  document.querySelectorAll('.overlay-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.snav-btn').forEach(b=>b.classList.remove('active'));
  const page=document.getElementById('overlay-'+id);
  if(page) page.classList.add('active');
  const idx={'services':0,'divisions':1,'doctrine':2,'contact':3}[id];
  const btns=document.querySelectorAll('.snav-btn');
  if(btns[idx]) btns[idx].classList.add('active');
}
function closeOverlay(){
  document.querySelectorAll('.overlay-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.snav-btn').forEach(b=>b.classList.remove('active'));
}

/* ── UFC ── */
let ufcVal='satcorp.io';
function ufcType(ch){
  if(ufcVal==='satcorp.io') ufcVal='';
  ufcVal+=ch;
  const el=document.getElementById('ufcDisplay');
  if(el) el.textContent=ufcVal.slice(-12);
}
function ufcClear(){
  ufcVal='';
  const el=document.getElementById('ufcDisplay');
  if(el) el.textContent='';
}
function ufcEnter(){
  const el=document.getElementById('ufcDisplay');
  if(el){ el.textContent='ACCEPT'; setTimeout(()=>{ el.textContent=ufcVal||'satcorp.io'; },800); }
}

/* ── RADAR STATUS BLINK ── */
(function(){
  const el=document.getElementById('rdrStatus');
  if(!el) return;
  const states=['SWEEP','SCAN','LOCK','SRCH','EMIT'];
  let i=0;
  setInterval(()=>{ i=(i+1)%states.length; el.textContent=states[i]; },2200);
})();

/* ── CONTACT FORM ── */
(function(){
  const form=document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=form.querySelector('.op-submit');
    btn.disabled=true;
    btn.textContent='[ TRANSMISSION CONFIRMED // ANU NOTIFIED ]';
    btn.style.color='#00ff41';
    btn.style.borderColor='rgba(0,255,65,0.5)';
    btn.style.background='rgba(0,255,65,0.15)';
    setTimeout(()=>{
      btn.disabled=false;
      btn.textContent='[ TRANSMIT BRIEF ]';
      btn.style.color=''; btn.style.borderColor=''; btn.style.background='';
      form.reset();
    },4000);
  });
})();

/* ── ATMOSPHERIC PARTICLES ── */
(function(){
  const container=document.getElementById('particles');
  if(!container) return;
  for(let i=0;i<12;i++){
    const p=document.createElement('div');
    p.className='particle';
    const size=Math.random()*2+0.5;
    p.style.cssText=`
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      bottom:${Math.random()*-20}%;
      animation-duration:${8+Math.random()*12}s;
      animation-delay:${Math.random()*8}s;
      opacity:0;
    `;
    container.appendChild(p);
  }
})();

/* ── MODE BUTTONS ── */
document.querySelectorAll('.mode-btn').forEach(btn=>{
  if(!btn.hasAttribute('onclick')){
    btn.addEventListener('click',function(){
      const parent=this.parentElement;
      parent.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
    });
  }
});

/* ── THROTTLE INTERACTION ── */
(function(){
  const throttle=document.getElementById('thr1');
  if(!throttle) return;
  let dragging=false;
  throttle.addEventListener('mousedown',()=>dragging=true);
  document.addEventListener('mouseup',()=>dragging=false);
  document.addEventListener('mousemove',e=>{
    if(!dragging) return;
    const rect=throttle.getBoundingClientRect();
    const pct=1-((e.clientY-rect.top)/rect.height);
    const clamped=Math.min(1,Math.max(0,pct));
    const fill=document.getElementById('thrFill1');
    if(fill) fill.style.height=(clamped*100)+'%';
    const n1=document.getElementById('n1Val');
    if(n1) n1.textContent=Math.round(30+clamped*70);
    const mfdEng=document.getElementById('mfdEng');
    if(mfdEng) mfdEng.textContent='N1 '+Math.round(30+clamped*70)+'%';
  });
})();
