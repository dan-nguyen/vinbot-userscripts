(function(){'use strict';

// ── Shared string fragments ──
const _F='Tesla Fremont, CA',_SH='Giga Shanghai, China',_LFP='LFP — Lithium Iron Phosphate Battery',_ELI='Electric — Lithium-Ion';
const _MB='Manual belts + Front Airbags',_OD=', Occupant Detection',_SI=', Side Inflatable Restraints',_KA=', Knee Airbags',_AH=' + Active Hood';
const _R5=_MB+_OD+_SI+_KA+' — 5-seat',_R5s=_MB+_SI+' — 5-seat',_R7=_MB+_OD+_SI+_KA+' — 7-seat (2+3+2)';
const _R6=_MB+_OD+_SI+_KA+' — 6-seat (2+2+2)',_R5c=_MB+_OD+_SI+' — 5-seat (2+3)',_R5d=_MB+_OD+_SI+_KA+' — 5-seat (2+3)';
const _RAH=_MB+_SI+_AH+' — 5-seat';
const _SB12={A:'Hatchback 5-Door LHD — RWD',B:'Hatchback 5-Door LHD — AWD',C:'Hatchback 5-Door RHD — RWD',D:'Hatchback 5-Door RHD — AWD'};
const _SF12={A:'10 kW Charger',B:'20 kW Charger',C:'10 kW Charger + DC Fast Charge',D:'20 kW Charger + DC Fast Charge'};
const _SD12={C:'Base AC Motor — Tier 2 Battery',G:'Base AC Motor — Tier 4 Battery',N:'Base AC Motor — Tier 7 Battery',P:'Performance AC Motor — Tier 7 Battery'};
const _SD1518={1:'Single Motor — Large Base',2:'Dual Motor — Small+Small',3:'Single Motor — Large Performance',4:'Dual Motor — Small+Large Performance'};
const _SD1920={1:'Single Motor — Standard',2:'Dual Motor — Standard',3:'Single Motor — Performance',4:'Dual Motor — Performance'};
const _SR12={1:'USA — Manual belts + airbags, 5-seat',2:'EU — Manual belts + airbags, 5-seat'};
const _SR1517={1:_R5,3:_R5s,7:_RAH},_SR1820={1:_R5,3:_R5s,7:_R5s},_SLE={E:'Electric'};

// ── Lookup tables ──
const MODEL={S:'Model S',3:'Model 3',X:'Model X',Y:'Model Y',C:'Cybertruck',R:'Roadster',A:'Cybercab',T:'Semi'};
const ALL_WMI=new Set(['5YJ','7SA','LRW','XP7','SFZ','5XJ','3MW','7G2']);

const WMI={
  3:{'5YJ':_F+' / Austin, TX','5XJ':_F+' (Secondary)',LRW:_SH,'3MW':'Monterrey, Mexico (Future)'},
  S:{'5YJ':_F,'5XJ':_F+' (Secondary)'},
  X:{'7SA':_F+' / Austin, TX'},
  Y:{'5YJ':'Tesla Fremont — through MY2021','7SA':'Tesla Fremont / Giga Texas — from MY2022',LRW:_SH,XP7:'Giga Berlin, Germany','3MW':'Monterrey, Mexico (Future)'},
  C:{'5YJ':_F,'7SA':'Tesla Austin, TX','7G2':'Tesla Austin, TX / Giga Nevada'},
  R:{SFZ:'Lotus Factory — Norfolk, UK'},A:{'5YJ':_F},T:{'7G2':'Tesla Austin, TX / Giga Nevada'},
};

const BODY={
  3:{E:'Sedan 4-Door — LHD',F:'Sedan 4-Door — RHD'},
  S:{A:'Hatchback 5-Door — LHD',B:'Hatchback 5-Door — RHD'},
  X:{C:'Class E MPV 5-Door — LHD',D:'Class E MPV 5-Door — RHD'},
  Y:{G:'Class D MPV 5-Door — LHD',H:'Class D MPV 5-Door — RHD'},
  C:{E:'Truck / Pickup — LHD',J:'Crew Cab — LHD'},
  A:{J:'Robotaxi Body'},T:{K:'Day Cab',L:'Sleeper Cab',1:'Day Cab — Standard'},
};

const RESTRAINT={
  3:{1:_R5,7:_R5s},S:{1:_R5,7:_R5s},
  X:{A:_R7,B:_R6,C:_R5c,D:_R5d},Y:{A:_R7,B:_R6,C:_R5c,D:_R5d},
  C:{H:_R5,G:'Class 2B-3 GVWR',B:'Class 2B GVWR'},
  R:{2:'Manual Seatbelts'},A:{E:'Robotaxi Restraint'},T:{H:'Class 8 GVWR',E:'Class 8 GVWR'},
};

const FUEL={
  3:{E:'Electric — Li-ion NMC/NCA',F:_LFP,H:_LFP},S:{E:'Electric'},X:{E:'Electric'},
  Y:{E:'Electric — Li-ion NMC/NCA',F:_LFP,H:_LFP},
  C:{S:'Standard Range (~250 mi)',R:'Long Range (~340 mi)',E:_ELI,0:'Battery — Base'},
  R:{B:'Battery — Lithium-Ion'},A:{E:_ELI},T:{S:'Standard Range (~300 mi)',R:'Long Range (~500 mi)',E:_ELI,0:'Battery — Base'},
};

const DRIVE={
  3:{A:'Single Motor — Standard (3DU 800A)',B:'Dual Motor — Standard',C:'Dual Motor — Performance',J:'Single Motor — Hairpin',K:'Dual Motor — Hairpin',L:'Dual Motor — Hairpin Performance',R:'Single Motor — Standard (3DU 600A)',S:'Single Motor — Standard (DUB 600A)',T:'Dual Motor — Performance (Highland)'},
  S:{5:'Dual Motor',6:'Triple Motor — Plaid'},X:{5:'Dual Motor',6:'Triple Motor — Plaid'},
  Y:{D:'Single Motor — Standard',E:'Dual Motor — Standard',F:'Dual Motor — Performance (3DU 800A)',J:'Single Motor — Hairpin',K:'Dual Motor — Hairpin',L:'Dual Motor — Hairpin Performance',R:'Single Motor — Standard (3DU 600A)',S:'Single Motor — Standard (DUB 600A)'},
  C:{D:'Dual Motor — AWD Standard',E:'Triple Motor — Cyberbeast'},
  R:{4:'Single Motor — AC Induction'},A:{U:'Robotaxi Drive Unit'},T:{B:'Dual Drive Rear Axle',0:'Drive Unit — Standard'},
};

const YEAR={8:'2008',9:'2009',A:'2010',B:'2011',C:'2012',D:'2013',E:'2014',F:'2015',G:'2016',H:'2017',J:'2018',K:'2019',L:'2020',M:'2021',N:'2022',P:'2023',R:'2024',S:'2025',T:'2026',V:'2027'};
const PLANT={F:'Tesla Fremont, CA',A:'Giga Texas — Austin, TX',C:'Giga Shanghai, China',B:'Giga Berlin, Germany',G:'Giga Berlin, Brandenburg',N:'Giga Nevada — Reno, NV',1:'Lotus Factory — Norfolk, UK',3:'Palo Alto R&D',P:'Palo Alto R&D'};

const S_LEGACY_YEARS=new Set(['C','D','E','F','G','H','J','K','L']);
const S_LEGACY={
  body:{C:_SB12,D:_SB12},
  restraint:{
    C:_SR12,D:_SR12,
    E:{1:_R5,2:_MB+_SI+_KA+' — 5-seat',4:_MB+_SI+_KA+' — 4-seat',5:_MB+_SI+' — 4-seat',6:_MB+_SI+' — 5-seat',7:_RAH,8:_MB+_SI+_AH+' — 4-seat'},
    F:{1:_R5,3:_R5s,6:_R5s,7:_RAH,8:_MB+_SI+_AH+' — 4-seat'},
    G:_SR1517,H:_SR1517,J:_SR1820,K:_SR1820,L:_SR1820,
  },
  fuel:{
    C:_SF12,D:_SF12,
    E:{H:'Li-ion — High Capacity',S:'Li-ion — Standard Capacity'},
    F:{S:'Li-ion — Standard',H:'Li-ion — High Capacity',V:'Li-ion — Ultra High',E:'Electric'},
    G:_SLE,H:_SLE,J:_SLE,K:_SLE,L:_SLE,
  },
  drive:{
    C:_SD12,D:_SD12,
    E:{1:'Single Motor — 3-Phase AC Induction',2:'Dual Motor — 3-Phase AC Induction'},
    F:_SD1518,G:_SD1518,H:_SD1518,J:_SD1518,K:_SD1920,L:_SD1920,
  },
  typedSeq:new Set(['C','D','E']),
};

const SEQ_TYPES={A:'Alpha Prototype',B:'Beta Prototype',F:'Founder Series',P:'Production',R:'Release Candidate',S:'Signature Series'};
const PLANT_MODEL_TOTALS={Y:{F:950000,C:2200000,A:750000,B:500000,G:500000},3:{F:750000,C:1800000,B:280000,G:280000},S:{F:360000},X:{F:390000},C:{A:75000,N:5000},T:{A:1500,N:500}};
const GLOBAL_YEAR_RANGE={
  Y:{L:[0,100000],M:[100000,600000],N:[600000,1400000],P:[1400000,2600000],R:[2600000,3700000],S:[3700000,4600000],T:[4600000,5050000]},
  3:{H:[0,2000],J:[2000,150000],K:[150000,450000],L:[450000,750000],M:[750000,1200000],N:[1200000,1800000],P:[1800000,2400000],R:[2400000,3100000],S:[3100000,3500000],T:[3500000,3700000]},
  C:{R:[0,40000],S:[40000,70000],T:[70000,80000]},
};
const PURE_SEQ_CUTOFF={S:180000,X:140000};

// ── Check digit ──
function chk(v){
  const xl={A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,J:1,K:2,L:3,M:4,N:5,P:7,R:9,S:2,T:3,U:4,V:5,W:6,X:7,Y:8,Z:9};
  const w=[8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2];
  let s=0;
  for(let i=0;i<17;i++){const c=v[i];s+=(c>='0'&&c<='9'?+c:xl[c])*w[i];}
  const r=s%11;return r===10?'X':''+r;
}

// ── Autopilot hardware ──
function getHW(m,seq,plant,yr){
  const year=parseInt(YEAR[yr]||0);
  const UP3='May have been upgraded to HW3 if FSD was purchased';
  const TRANS='Exact hardware depends on production month';
  if(m==='C'||m==='A'||m==='T')return{t:'HW4',c:'ok'};
  if(m==='Y'){
    if(year>=2024)return{t:'HW4',c:'ok'};
    if(plant==='F'){if(seq>=800000)return{t:'Likely HW4',c:'likely'};if(seq>=790000)return{t:'Possibly HW4',c:'possible'};}
    else if(plant==='A'){if(seq>=131200)return{t:'Likely HW4',c:'likely'};if(seq>=127000)return{t:'Possibly HW4',c:'possible'};}
    else if(year===2023)return{t:'Possibly HW4',c:'possible',note:'Shanghai & Berlin transitioned late 2023'};
    if(year===2023)return{t:'Possibly HW4',c:'possible'};
    return{t:'Shipped with HW3',c:'none'};
  }
  if(m==='X'){
    if(seq>=385000)return{t:'Likely HW4',c:'likely'};if(seq>=370000)return{t:'Possibly HW4',c:'possible'};
    if(year>=2020&&year<=2022)return{t:'Shipped with HW3',c:'none'};
    if(year===2019)return{t:'HW2.5 or HW3',c:'none',note:TRANS+'. '+UP3};
    if(year===2018)return{t:'Shipped with HW2.5',c:'none',note:UP3};
    if(year===2017)return{t:'HW2.0 or HW2.5',c:'none',note:TRANS+'. '+UP3};
    if(year===2016)return{t:'HW1 or HW2.0',c:'none',note:TRANS};
    if(year===2015)return{t:'Shipped with HW1',c:'none'};
    return null;
  }
  if(m==='S'){
    if(!S_LEGACY_YEARS.has(yr)){
      if(seq>=502000)return{t:'Likely HW4',c:'likely'};if(seq>=501000)return{t:'Possibly HW4',c:'possible'};
      return{t:'Shipped with HW3',c:'none'};
    }
    if(year===2020)return{t:'Shipped with HW3',c:'none'};
    if(year===2019)return{t:'HW2.5 or HW3',c:'none',note:TRANS+'. '+UP3};
    if(year===2018)return{t:'Shipped with HW2.5',c:'none',note:UP3};
    if(year===2017)return{t:'HW2.0 or HW2.5',c:'none',note:TRANS+'. '+UP3};
    if(year===2016)return{t:'HW1 or HW2.0',c:'none',note:TRANS};
    if(year===2015)return{t:'Shipped with HW1',c:'none'};
    if(year===2014)return{t:'No AP or HW1',c:'none',note:'Autopilot hardware introduced late 2014'};
    if(year<=2013)return{t:'No autopilot hardware',c:'none'};
    return null;
  }
  if(m==='3'){
    if(year>=2024)return{t:'HW4',c:'ok'};
    if(year===2023)return{t:'Possibly HW4',c:'possible',note:'Highland refresh (late 2023) ships with HW4'};
    if(year>=2020&&year<=2022)return{t:'Shipped with HW3',c:'none'};
    if(year===2019)return{t:'HW2.5 or HW3',c:'none',note:TRANS+'. '+UP3};
    if(year===2017||year===2018)return{t:'Shipped with HW2.5',c:'none',note:UP3};
    return null;
  }
  return null;
}

// ── Derived fields ──
function getDerived(m,driveCode,restraintCode,bodyCode,plant,yr,isLS){
  const year=parseInt(YEAR[yr]||0);
  let drivetrain=null;
  if(m==='R')drivetrain='RWD';
  else if(m==='T'||m==='A')drivetrain=null;
  else if(isLS)drivetrain=year<=2013?'RWD':['2','4'].includes(driveCode)?'AWD':'RWD';
  else{const AWD={S:['5','6'],3:['B','C','K','L','T'],X:['5','6'],Y:['E','F','K','L'],C:['D','E']};if(driveCode)drivetrain=(AWD[m]||[]).includes(driveCode)?'AWD':'RWD';}
  let trim=null;
  if(isLS){
    if(['C','G','N','P'].includes(driveCode))trim={C:'40 kWh',G:'60 kWh',N:'85 kWh',P:'P85 Performance'}[driveCode];
    else if(year<=2014)trim=driveCode==='2'?'Dual Motor':'Standard';
    else if(year<=2018)trim={'1':'Standard','2':'Dual Motor','3':'Performance','4':'Dual Motor Performance'}[driveCode]||null;
    else trim={'1':'Standard Range','2':'Long Range','3':'Performance','4':'Long Range Performance'}[driveCode]||null;
  } else {
    trim=({S:{'5':'Long Range','6':'Plaid'},3:{'A':'Standard Range','B':'Long Range','C':'Performance','J':'Standard Range','K':'Long Range','L':'Performance','R':'Standard Range','S':'Standard Range','T':'Performance'},X:{'5':'Long Range','6':'Plaid'},Y:{'D':'Standard Range','E':'Long Range','F':'Performance','J':'Standard Range','K':'Long Range','L':'Performance','R':'Standard Range','S':'Standard Range'},C:{'D':'Dual Motor','E':'Cyberbeast'},R:{'4':'Sport'},T:{'B':'Semi'}}[m]||{})[driveCode]||null;
  }
  let seats=null;
  if(m==='R')seats='2-seat';
  else if(m==='X'||m==='Y')seats=(restraintCode==='A'?'7':restraintCode==='B'?'6':'5')+'-seat';
  else seats='5-seat';
  let range=null;
  if(m==='Y'){const rwd=['D','J','R','S'].includes(driveCode),perf=['F','L'].includes(driveCode);range=rwd?(year>=2024?'~260 mi':'~244 mi'):perf?'~303 mi':year>=2023?'~330 mi':'~326 mi';}
  else if(m==='3'){const rwd=['A','J','R','S'].includes(driveCode),perf=['C','L','T'].includes(driveCode);if(year>=2024)range=rwd?'~272 mi':perf?'~315 mi':'~341 mi';else if(rwd)range=year>=2021?'~272 mi':'~250 mi';else range=perf?'~315 mi':year>=2021?'~358 mi':'~322 mi';}
  else if(m==='S'&&!isLS)range=driveCode==='6'?'~396 mi':'~405 mi';
  else if(m==='X')range=driveCode==='6'?'~333 mi':'~348 mi';
  else if(m==='C')range=driveCode==='E'?'~301 mi':'~340 mi';
  else if(m==='R')range='~244 mi';
  else if(m==='T')range='~300–500 mi';
  let supercharger=null;
  if(m==='R')supercharger='Not Supercharger compatible';
  else if(m==='T')supercharger='Megacharger — up to 1 MW';
  else if(m==='C')supercharger='V4 — up to 350 kW';
  else if(m==='A')supercharger='V3 / V4 — up to 350 kW';
  else if(m==='S'||m==='X')supercharger=year>=2021?'V3 — up to 250 kW':year>=2016?'V2 — up to 150 kW':'V1 / V2 — up to 120 kW';
  else if(m==='3')supercharger=year>=2019?'V3 — up to 250 kW':'V2 — up to 120 kW';
  else if(m==='Y')supercharger='V3 — up to 250 kW';
  const isRHD=({S:['B'],3:['F'],X:['D'],Y:['H']}[m]||[]).includes(bodyCode);
  let market=null;
  if(plant==='F'||plant==='A')market=isRHD?'UK / Australia / NZ':'North America';
  else if(plant==='C')market=isRHD?'Japan / Hong Kong / Thailand':'China / Asia Pacific';
  else if(plant==='B'||plant==='G')market=isRHD?'United Kingdom':'Europe';
  else if(plant==='N')market='North America';
  else if(plant==='1')market='United Kingdom / Europe';
  else if(plant==='P'||plant==='3')market='Prototype / Pre-production';
  return{drivetrain,trim,seats,range,supercharger,market};
}

// ── Sequence context ──
function seqContext(m,seqNum,plant,yr,seqLabel){
  const multi=!!(GLOBAL_YEAR_RANGE[m]);
  const pmt=multi?(PLANT_MODEL_TOTALS[m]||{})[plant]:null;
  const yr_range=multi?(GLOBAL_YEAR_RANGE[m]||{})[yr]:null;
  const cutoff=PURE_SEQ_CUTOFF[m];
  const fmtN=n=>n===0?'#1':n>=1000000?`~${(n/1000000).toFixed(1)}M`:`~${Math.round(n/1000)}k`;
  if(multi&&pmt){
    let s=`${seqLabel} at ${PLANT[plant]||plant}`;
    if(yr_range)s+=` · Est. ${YEAR[yr]||yr} global: ${fmtN(yr_range[0])}–${fmtN(yr_range[1])}`;
    return s;
  }
  if(cutoff!==undefined&&seqNum>cutoff)return`${seqLabel} · shared VIN counter — not model-specific`;
  if(cutoff!==undefined)return`${seqLabel} · exact global rank (pre-dates shared VIN counter)`;
  return seqLabel;
}

// ── Full decode ──
function decode(raw){
  const v=raw.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g,'');
  if(v.length!==17)return null;
  const wmi=v.slice(0,3);
  if(!ALL_WMI.has(wmi))return null;
  const m=v[3],yr=v[9],plant=v[10];
  const isLS=m==='S'&&S_LEGACY_YEARS.has(yr);
  const bm=isLS?(S_LEGACY.body[yr]||BODY.S):(BODY[m]||{});
  const rm=isLS?(S_LEGACY.restraint[yr]||{}):(RESTRAINT[m]||{});
  const fm=isLS?(S_LEGACY.fuel[yr]||{}):(FUEL[m]||{});
  const dm=isLS?(S_LEGACY.drive[yr]||{}):(DRIVE[m]||{});
  const exp=chk(v),got=v[8],checkOk=got===exp;
  const sc=v.slice(11);
  const seqNum=isLS&&S_LEGACY.typedSeq.has(yr)?parseInt(v.slice(12),10):parseInt(sc,10);
  let seqLabel;
  if(isLS&&S_LEGACY.typedSeq.has(yr)){const tc=v[11];seqLabel=`${SEQ_TYPES[tc]??tc} — #${parseInt(v.slice(12),10).toLocaleString()}`;}
  else seqLabel=`#${seqNum.toLocaleString()}`;
  const hw=getHW(m,seqNum,plant,yr);
  const d=getDerived(m,v[7],v[5],v[4],plant,yr,isLS);
  return{
    vin:v,checkOk,exp,got,
    model:MODEL[m],year:YEAR[yr],
    body:bm[v[4]],battery:fm[v[6]],drive:dm[v[7]],
    plantName:PLANT[plant],hw,d,
    seq:seqContext(m,seqNum,plant,yr,seqLabel),
  };
}

// ── Popup ──
let activePopup=null;
function closePopup(){if(activePopup){activePopup.remove();activePopup=null;}}

function showPopup(vin,anchor){
  closePopup();
  const r=decode(vin);
  if(!r)return;
  const row=(lbl,val,cls='',note='')=>val
    ?`<div class="tvd-row"><span class="tvd-lbl">${lbl}</span><div><div class="tvd-val${cls?' '+cls:''}">${val}</div>${note?`<div class="tvd-note">${note}</div>`:''}</div></div>`
    :'';
  const el=document.createElement('div');
  el.className='tvd-popup';
  el.setAttribute('data-tvd','1');
  el.innerHTML=`
    <button class="tvd-x">✕</button>
    <div class="tvd-head">
      <div class="tvd-vin">${r.vin}</div>
      <div class="tvd-title">${[r.year,r.model].filter(Boolean).join(' ')}</div>
      <div class="tvd-chk ${r.checkOk?'ok':'fail'}">${r.checkOk?'✓ Valid VIN':'✗ Invalid check digit — expected '+r.exp+', got '+r.got}</div>
    </div>
    <div class="tvd-section">
      ${row('Body',r.body)}
      ${row('Drive',r.drive)}
      ${row('Battery',r.battery)}
      ${row('Plant',r.plantName)}
      ${row('Market',r.d.market)}
    </div>
    <div class="tvd-section">
      ${row('Trim',r.d.trim)}
      ${row('Drivetrain',r.d.drivetrain)}
      ${row('Seats',r.d.seats)}
      ${row('Range',r.d.range)}
      ${row('Supercharger',r.d.supercharger)}
    </div>
    ${r.hw?`<div class="tvd-section">${row('Autopilot HW',r.hw.t,r.hw.c,r.hw.note||'')}</div>`:''}
    <div class="tvd-seq">${r.seq}</div>
    <div class="tvd-footer"><a href="https://dan-nguyen.github.io/vinbot/?vin=${r.vin}" target="_blank">Full decode at dan-nguyen.github.io/vinbot ↗</a></div>
  `;
  document.body.appendChild(el);
  activePopup=el;
  const ar=anchor.getBoundingClientRect();
  const {width:pw,height:ph}=el.getBoundingClientRect();
  let top=ar.bottom+8,left=ar.left;
  if(top+ph>window.innerHeight-10)top=Math.max(10,ar.top-ph-8);
  if(left+pw>window.innerWidth-10)left=window.innerWidth-pw-10;
  if(left<10)left=10;
  el.style.top=top+'px';el.style.left=left+'px';
  el.querySelector('.tvd-x').addEventListener('click',e=>{e.stopPropagation();closePopup();});
}

// ── DOM scanning ──
const VIN_RE=/\b(5YJ|7SA|LRW|XP7|SFZ|5XJ|3MW|7G2)[A-HJ-NPR-Z0-9]{14}\b/g;
const SKIP_TAGS=new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT','SELECT','BUTTON','CODE','PRE']);
const processed=new WeakSet();

function dotClass(r){
  if(!r||!r.checkOk)return'fail';
  if(!r.hw)return'none';
  return r.hw.c;
}

function scanNode(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
    acceptNode(n){
      const p=n.parentElement;
      if(!p||SKIP_TAGS.has(p.tagName)||p.closest('[data-tvd]'))return NodeFilter.FILTER_REJECT;
      VIN_RE.lastIndex=0;
      return VIN_RE.test(n.textContent)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;
    }
  });
  const nodes=[];
  let n;
  while((n=walker.nextNode()))nodes.push(n);
  nodes.forEach(node=>{
    if(processed.has(node))return;
    processed.add(node);
    VIN_RE.lastIndex=0;
    const text=node.textContent;
    const frag=document.createDocumentFragment();
    let last=0,match;
    while((match=VIN_RE.exec(text))!==null){
      if(match.index>last)frag.appendChild(document.createTextNode(text.slice(last,match.index)));
      const vin=match[0];
      const r=decode(vin);
      const dc=dotClass(r);
      const badge=document.createElement('span');
      badge.setAttribute('data-tvd','1');
      badge.className=`tvd-badge ${dc}`;
      badge.innerHTML=`${vin}<span class="tvd-dot ${dc}"></span>`;
      badge.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();showPopup(vin,badge);});
      frag.appendChild(badge);
      last=match.index+vin.length;
    }
    if(last<text.length)frag.appendChild(document.createTextNode(text.slice(last)));
    if(last>0)node.parentNode.replaceChild(frag,node);
  });
}

document.addEventListener('click',e=>{if(activePopup&&!activePopup.contains(e.target))closePopup();},{capture:true,passive:true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePopup();});

scanNode(document.body);
let pending=[],timer=null;
new MutationObserver(muts=>{
  muts.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&!n.hasAttribute('data-tvd'))pending.push(n);}));
  clearTimeout(timer);
  timer=setTimeout(()=>{const q=pending.splice(0);q.forEach(n=>scanNode(n));},250);
}).observe(document.body,{childList:true,subtree:true});

})();
