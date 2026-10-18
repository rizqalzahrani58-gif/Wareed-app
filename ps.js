/* أخصائي المنتجات (١٨ أكتوبر ٢٠٢٦) — وكيل علم بيانات: الباقات والتحاليل حسب المنطقة والفرع والفئة العمرية والموسم، وترمومتر الصحة من نتائج التحاليل.
   المصدر: سوبرسيت LDM (تجميعات فقط) عبر ps_sync.py → ssh/p_* ثم ps_build.py → ps/latest و ps/brief.
   قاعدة أبو راكان: ٢٠٢٢–٢٠٢٤ للنمو فقط، ٢٠٢٥ للمقارنة، ٢٠٢٦ الوضع الحالي. بدون أي مبالغ (الدخل في الداشبورد من Wareed BI). */
(function(){"use strict";if(window.__psLoaded)return;window.__psLoaded=true;
const AR=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const N=n=>n==null?"—":AR(Number(n).toLocaleString("en-US"));
const P=n=>n==null?"—":AR(n)+"٪";
const SG=n=>n==null?"":(n>0?"+":"")+AR(n)+"٪";
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=String(txt);return e;};
const short=s=>String(s||"").replace(/\s*\(.*?\)\s*/g," ").replace(/\s+/g," ").trim();
const MON=["ينا","فبر","مار","أبر","ماي","يون","يول","أغس","سبت","أكت","نوف","ديس"];
const S={d:null,brief:null,regionF:""};

function css(){if(document.getElementById("psCss"))return;const s=el("style");s.id="psCss";s.textContent=`
#psSec{font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif}
#psSec *{box-sizing:border-box}
#psSec [hidden]{display:none!important}
.psHint{color:var(--muted,#8f98ad);font-size:.86em;line-height:1.6;margin:.2em 0 .9em}
.psCard{background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:16px;padding:14px;width:100%;margin-bottom:12px}
.psH{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:8px}
.psH h2{margin:0;font-family:"Readex Pro",system-ui;font-size:1.02em;font-weight:600}
.psH small{color:var(--muted,#8f98ad);font-size:.78em;text-align:left}
.psBig{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin:2px 0 6px}
.psBig b{font-family:"Readex Pro",system-ui;font-size:1.9em;line-height:1}
.psBig span{color:var(--muted,#8f98ad);font-size:.86em}
.psKv{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:8px;margin:8px 0}
.psKv div{background:var(--panel,#161a23);border:1px solid var(--line,#272d3a);border-radius:12px;padding:8px 10px}
.psKv b{display:block;font-family:"Readex Pro",system-ui;font-size:1.15em}
.psKv span{font-size:.76em;color:var(--muted,#8f98ad)}
.psGrp{font-size:.78em;color:var(--muted,#8f98ad);margin:10px 2px 5px}
.psList{display:flex;flex-direction:column;gap:5px}
.psRow{display:flex;align-items:center;gap:8px;background:var(--panel,#161a23);border:1px solid var(--line,#272d3a);border-radius:11px;padding:7px 10px;font-size:.88em}
.psRow .t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.psRow .v{font-family:"Readex Pro",system-ui;font-size:.92em;white-space:nowrap}
.psChip{font-size:.7em;border-radius:999px;padding:2px 8px;border:1px solid var(--line,#272d3a);color:var(--muted,#8f98ad);white-space:nowrap}
.psChip.up{color:#5fe39b;border-color:rgba(61,220,132,.45)}.psChip.dn{color:#ff8a8a;border-color:rgba(255,92,92,.45)}.psChip.hot{color:#ffd76a;border-color:rgba(255,200,61,.45)}.psChip.ax{color:#9cc7ff;border-color:rgba(90,162,255,.45)}
.psBar{position:relative;height:6px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;flex:0 0 70px}
.psBar i{position:absolute;inset-block:0;right:0;border-radius:99px;background:linear-gradient(90deg,#5aa2ff,#7cc4ff)}
.psBar i.warm{background:linear-gradient(90deg,#ff8a5b,#ffc83d)}
.psRec{display:flex;gap:8px;align-items:flex-start;font-size:.88em;line-height:1.55;padding:7px 0;border-top:1px solid rgba(255,255,255,.06)}
.psRec:first-of-type{border-top:0}
.psRec .n{flex:0 0 20px;height:20px;border-radius:50%;background:rgba(90,162,255,.15);color:#9cc7ff;font-family:"Readex Pro",system-ui;font-size:.74em;display:flex;align-items:center;justify-content:center;margin-top:2px}
.psAges{display:flex;align-items:flex-end;gap:4px;height:54px;margin:6px 0 2px}
.psAges div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:3px}
.psAges i{display:block;width:100%;border-radius:3px 3px 0 0;background:var(--accent,#5aa2ff);opacity:.85}
.psAges span{font-size:.62em;color:var(--muted,#8f98ad);white-space:nowrap}
.psSeason{display:flex;align-items:flex-end;gap:2px;height:30px;direction:ltr;flex:0 0 110px}
.psSeason i{flex:1;display:block;border-radius:2px 2px 0 0;background:var(--accent,#5aa2ff);opacity:.75}
.psSeason i.now{opacity:1;background:#ffc83d}
.psTabs{display:flex;gap:6px;flex-wrap:wrap;margin:4px 0 10px}
.psTabs button{border:1px solid var(--line,#272d3a);background:transparent;color:var(--fg,#f3f5f9);border-radius:999px;padding:5px 11px;font:inherit;font-size:.78em;cursor:pointer}
.psTabs button.on{background:#5aa2ff;border-color:#5aa2ff;color:#fff}
.psMore{background:transparent;border:1px solid var(--line,#272d3a);color:var(--fg,#f3f5f9);border-radius:10px;padding:6px 12px;font:inherit;font-size:.8em;cursor:pointer;margin-top:8px}
.psTwo{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:560px){.psTwo{grid-template-columns:1fr}}
.psMeta{font-size:.74em;color:var(--muted,#8f98ad);margin-top:6px;line-height:1.5}
.psTbl{width:100%;border-collapse:collapse;font-size:.82em}
.psTbl th{font-weight:500;color:var(--muted,#8f98ad);text-align:right;padding:4px 6px;border-bottom:1px solid var(--line,#272d3a)}
.psTbl td{padding:6px;border-bottom:1px solid rgba(255,255,255,.05);vertical-align:top}
.psTbl td.n{font-family:"Readex Pro",system-ui;white-space:nowrap}
.psTbl tr.low td:first-child{color:#ff8a8a}.psTbl tr.high td:first-child{color:#5fe39b}
`;document.head.append(s);}

function wait(fn,ms){return new Promise(r=>{const t0=Date.now();(function f(){let v=null;try{v=fn();}catch(e){}if(v)return r(v);if(Date.now()-t0>(ms||120000))return r(null);setTimeout(f,250);})();});}
async function load(){
  const {data,error}=await window.sb.from("docs").select("id,data").eq("collection","ps").in("id",["latest","brief"]);
  if(error)throw error;
  (data||[]).forEach(r=>{if(r.id==="latest")S.d=r.data;if(r.id==="brief")S.brief=r.data&&r.data.text;});
  window.__ps={latest:S.d,brief:S.brief};
}

/* ── كروت ── */
function chip(txt,cls){return el("span","psChip"+(cls?" "+cls:""),txt);}
function bar(p,warm){const b=el("div","psBar");const i=el("i");if(warm)i.className="warm";i.style.width=Math.max(2,Math.min(100,+p||0))+"%";b.append(i);return b;}
function row(name,val,chips,barPct,warm){const r=el("div","psRow");r.append(el("span","t",name));(chips||[]).forEach(c=>c&&r.append(c));if(barPct!=null)r.append(bar(barPct,warm));r.append(el("span","v",val));return r;}
function ages(list,nat){const w=el("div","psAges");const mx=Math.max(1,...list.map(a=>+a.p||0));
  list.forEach(a=>{const d=el("div");const i=el("i");i.style.height=Math.max(3,(+a.p||0)/mx*100)+"%";const n=nat&&nat.find(x=>x.b===a.b);if(n&&a.p-n.p>=2)i.style.background="#ffc83d";i.title=a.b+" · "+P(a.p)+(n?" (وطني "+P(n.p)+")":"");d.append(i,el("span","",a.b));w.append(d);});return w;}
function season(prof,nowM){const w=el("div","psSeason");if(!prof)return w;const mx=Math.max(1,...prof);prof.forEach((v,i)=>{const b=el("i");b.style.height=Math.max(4,v/mx*100)+"%";if(i===nowM)b.className="now";b.title=MON[i]+" "+P(v);w.append(b);});return w;}
function recs(list,c){(list||[]).forEach((t,i)=>{const r=el("div","psRec");r.append(el("span","n",AR(i+1)),el("div","",t));c.append(r);});}

function headCard(){const d=S.d,n=d.national;const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","صورة الشهر · "+AR(d.month)));h.append(el("small","","سوبرسيت LDM · آخر تحديث "+AR(String(d.asOf||"").slice(5,16).replace("T"," "))));c.append(h);
  const big=el("div","psBig");big.append(el("b","",P(n.pkgShare)),el("span","","من الخدمات المباعة هالشهر باقات ("+N(n.pkg)+" باقة · "+N(n.tests)+" تحليل)"));c.append(big);
  const kv=el("div","psKv");const k=(v,l)=>{const x=el("div");x.append(el("b","",v),el("span","",l));kv.append(x);};
  k(n.ytdYoy!=null?SG(n.ytdYoy):"—","الخدمات "+AR(n.ytdMonths||"")+" مقابل "+AR(d.cmp));k(P(n.pkgRevShare),"حصة الباقات من قيمة الخدمات");k(P(n.age&&n.age.f),"إناث من الطلبات");
  k((n.peakHours||[]).slice(0,2).map(x=>AR(String(x.k).padStart(2,"0"))+":00").join(" · ")||"—","ذروة التسجيل");c.append(kv);
  c.append(el("div","psMeta",d.policy));return c;}
function recCard(){const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","توصيات أخصائي المنتجات"));h.append(el("small","","مبنية على أرقام الشهر و"+AR(S.d.cmp)));c.append(h);recs(S.d.recs,c);return c;}
function topCard(){const n=S.d.national;const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","الأكثر مبيعاً وطنياً"));h.append(el("small","","حصة من الباقات/التحاليل · التغير عن "+AR(S.d.cmp)));c.append(h);
  const two=el("div","psTwo");const a=el("div"),b=el("div");a.append(el("div","psGrp","الباقات"));b.append(el("div","psGrp","التحاليل"));const la=el("div","psList"),lb=el("div","psList");
  const mxP=Math.max(1,...n.topPkgs.map(p=>p.share||0)),mxT=Math.max(1,...n.topTests.map(p=>p.share||0));
  n.topPkgs.slice(0,8).forEach(p=>la.append(row(p.name,N(p.svc),[p.new?chip("جديدة","hot"):(p.yoy!=null?chip(SG(p.yoy),p.yoy>=0?"up":"dn"):null),p.age&&p.age.ages[0]?chip(p.age.ages[0].b+" · ♀"+AR(p.age.f)+"٪"):null],p.share/mxP*100)));
  n.topTests.slice(0,8).forEach(p=>lb.append(row(short(p.name),N(p.svc),[p.axis?chip(p.axis,"ax"):null,p.yoy!=null?chip(SG(p.yoy),p.yoy>=0?"up":"dn"):null],p.share/mxT*100)));
  a.append(la);b.append(lb);two.append(a,b);c.append(two);return c;}
function regionCard(R){const n=S.d.national;const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","منطقة "+R.name));h.append(el("small","",N(R.svc)+" خدمة · "+N(R.orders)+" طلب"));c.append(h);
  const kv=el("div","psKv");const k=(v,l)=>{const x=el("div");x.append(el("b","",v),el("span","",l));kv.append(x);};
  k(P(R.pkgShare),"باقات (وطنياً "+P(R.pkgShareNat)+")");k(R.yoyYtd!=null?SG(R.yoyYtd):"—","الخدمات مقابل "+AR(S.d.cmp));k(R.ageOver?R.ageOver.b:"—","أعلى فئة عن المتوسط"+(R.ageOver?" (+"+AR(R.ageOver.d)+")":""));
  k((R.peakHours||[]).slice(0,2).map(x=>AR(String(x.k).padStart(2,"0"))+":00").join(" · ")||"—","ذروة التسجيل"+((R.peakDow||[]).length?" · "+R.peakDow[0].k:""));c.append(kv);
  const two=el("div","psTwo");const a=el("div"),b=el("div");a.append(el("div","psGrp","أعلى الباقات هنا (× = مقارنة بالحصة الوطنية)"));b.append(el("div","psGrp","أعلى التحاليل"));const la=el("div","psList"),lb=el("div","psList");
  const mxP=Math.max(1,...(R.topPkgs||[]).map(p=>p.share||0)),mxT=Math.max(1,...(R.topTests||[]).map(p=>p.share||0));
  (R.topPkgs||[]).slice(0,5).forEach(p=>la.append(row(p.name,N(p.svc),[p.idx!=null?chip("×"+AR(p.idx),p.idx>=1.25?"up":(p.idx<=0.7?"dn":"")):null],p.share/mxP*100)));
  (R.topTests||[]).slice(0,5).forEach(p=>lb.append(row(short(p.name),N(p.svc),[p.idx!=null?chip("×"+AR(p.idx),p.idx>=1.25?"up":(p.idx<=0.7?"dn":"")):null],p.share/mxT*100)));
  a.append(la);b.append(lb);two.append(a,b);c.append(two);
  if(R.age&&R.age.ages){c.append(el("div","psGrp","الفئات العمرية (أصفر = أعلى من المتوسط الوطني)"));c.append(ages(R.age.ages,n.age&&n.age.ages));}
  if((R.thermo||[]).length){c.append(el("div","psGrp","ترمومتر الصحة · نسبة النتائج غير الطبيعية (مقابل الوطني)"));const l=el("div","psList");
    R.thermo.slice(0,4).forEach(x=>l.append(row(short(x.test),P(x.abn)+(x.nat!=null?" / "+P(x.nat):""),[chip(x.axis,"ax"),x.diff!=null&&x.diff>=4?chip("+"+AR(x.diff)+" نقطة","hot"):null],x.abn,x.diff>=4)));c.append(l);}
  if((R.recs||[]).length){c.append(el("div","psGrp","توصيات المنطقة"));recs(R.recs,c);}
  return c;}
function ageCard(){const n=S.d.national;const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","الفئات العمرية · وش تطلب كل فئة"));h.append(el("small","",N(n.age&&n.age.n)+" طلب هالشهر"));c.append(h);
  c.append(ages(n.age.ages));const tabs=el("div","psTabs");const body=el("div","psList");let cur=(n.age.ages.slice().sort((a,b)=>b.p-a.p)[0]||{}).b;
  const draw=()=>{body.replaceChildren();(n.ageTopSvc[cur]||[]).forEach(x=>body.append(row(short(x.name),N(x.svc))));tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.b===cur));};
  n.age.ages.forEach(a=>{const b=el("button","",a.b+" · "+P(a.p));b.type="button";b.dataset.b=a.b;b.onclick=()=>{cur=a.b;draw();};tabs.append(b);});c.append(tabs,body);draw();
  if(n.thermoAge){const keys=Object.keys(n.thermoAge).filter(k=>/hba1c|vitamin d|ferritin|cholesterol|tsh/i.test(k)).slice(0,4);if(keys.length){c.append(el("div","psGrp","غير الطبيعي حسب العمر"));keys.forEach(k=>{const l=el("div","psRow");l.append(el("span","t",short(k)));const v=el("span","v",n.thermoAge[k].map(z=>z.b+" "+AR(z.abn)+"٪").join(" · "));v.style.whiteSpace="normal";v.style.fontSize=".78em";l.append(v);c.append(l);});}}
  return c;}
function thermoCard(){const n=S.d.national;const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","ترمومتر الصحة · وطنياً"));h.append(el("small","","نسبة النتائج غير الطبيعية هالشهر"));c.append(h);
  c.append(el("div","psHint","تصنيف بالاسم (محور التحليل) مو تشخيص؛ LDM ما فيه رموز أمراض. كل نتيجة غير طبيعية = عميل متابعة بعد ٣ أشهر."));
  const l=el("div","psList");(n.thermo||[]).slice(0,10).forEach(x=>l.append(row(short(x.test),P(x.abn),[chip(x.axis,"ax"),x.crit>=0.2?chip("حرج "+P(x.crit),"hot"):null],x.abn,x.abn>=40)));c.append(l);return c;}
function seasonCard(){const s=S.d.season||{};const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","الموسمية · من سنة "+AR(s.year||S.d.cmp)));h.append(el("small","","حصة كل شهر من السنة · الأصفر = الشهر الجاي"));c.append(h);
  const now=(new Date().getMonth()+1)%12;const l=el("div","psList");const items=Object.entries(s.pkgs||{}).concat(Object.entries(s.tests||{})).map(([k,v])=>[k,v,Math.max(...v)/(v.reduce((a,b)=>a+b,0)/12)]).sort((a,b)=>b[2]-a[2]).slice(0,10);
  if(!items.length)c.append(el("div","psHint","تظهر بعد اكتمال سحب سنة "+AR(s.year||S.d.cmp)+" كاملة."));
  items.forEach(([k,v,pk])=>{const r=el("div","psRow");r.append(el("span","t",short(k)));const mi=v.indexOf(Math.max(...v));r.append(chip("ذروة "+MON[mi]+" "+P(v[mi]),pk>=2?"hot":""));r.append(season(v,now));l.append(r);});c.append(l);return c;}
function branchCard(){const B=S.d.branches||[];const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","الفروع · بيع الباقات"));h.append(el("small","","حصة الباقات من خدمات الفرع مقابل وسيط منطقته"));c.append(h);
  const regs=[...new Set(B.map(b=>b.region))];const tabs=el("div","psTabs");const all=el("button","","الكل");all.type="button";all.onclick=()=>{S.regionF="";draw();};tabs.append(all);
  regs.forEach(r=>{const b=el("button","",r);b.type="button";b.onclick=()=>{S.regionF=r;draw();};tabs.append(b);});c.append(tabs);
  const wrap=el("div");c.append(wrap);let lim=15;
  const draw=()=>{wrap.replaceChildren();tabs.querySelectorAll("button").forEach((b,i)=>b.classList.toggle("on",i===0?!S.regionF:b.textContent===S.regionF));
    const rows=B.filter(b=>!S.regionF||b.region===S.regionF).slice().sort((a,b)=>(a.flag==="low"?-1:0)-(b.flag==="low"?-1:0)||b.svc-a.svc);
    const t=el("table","psTbl");const th=el("tr");["الفرع","باقات","وسيط المنطقة","مقابل "+AR(S.d.cmp),"أعلى باقة"].forEach(x=>th.append(el("th","",x)));t.append(th);
    rows.slice(0,lim).forEach(b=>{const tr=el("tr",b.flag);tr.append(el("td","",b.name),el("td","n",P(b.pkgShare)),el("td","n",P(b.regMed)),el("td","n",b.yoy!=null?SG(b.yoy):"—"),el("td","",b.topPkgs[0]?b.topPkgs[0].name:"—"));t.append(tr);});
    wrap.append(t);if(rows.length>lim){const m=el("button","psMore","عرض الكل ("+AR(rows.length)+")");m.type="button";m.onclick=()=>{lim=999;draw();};wrap.append(m);}};
  draw();c.append(el("div","psMeta","أحمر = أقل من ٦٠٪ من وسيط منطقته (يحتاج تدريب بيع باقات)؛ أخضر = فوق ١٤٠٪."));return c;}
function growthCard(){const g=(S.d.growth||[]).filter(x=>x.months);const c=el("div","psCard");const h=el("div","psH");h.append(el("h2","","النمو ٢٠٢٢ ← "+AR(new Date().getFullYear())));h.append(el("small","","خدمات (باقات + تحاليل) بالسنة"));c.append(h);
  const mx=Math.max(1,...g.map(x=>x.svc));const l=el("div","psList");g.forEach(x=>l.append(row(AR(x.year)+" · "+x.role,N(x.svc)+(x.months<12?" ("+AR(x.months)+" شهر)":""),[chip("باقات "+N(x.pkg))],x.svc/mx*100)));c.append(l);
  c.append(el("div","psMeta","أرقام ٢٠٢٢–٢٠٢٤ تعكس دخول الفروع على نظام LDM تدريجياً، فهي للاتجاه مو للمقارنة."));return c;}

function render(){const body=document.getElementById("psBody");if(!body||!S.d)return;body.replaceChildren();
  body.append(headCard(),recCard(),topCard());(S.d.regions||[]).forEach(R=>body.append(regionCard(R)));body.append(ageCard(),thermoCard(),seasonCard(),branchCard(),growthCard());
  const sec=document.getElementById("psSec");sec.dataset.n=String((S.d.recs||[]).length);try{window.dispatchEvent(new Event("psrender"));}catch(e){}}

async function init(){
  css();const wrap=await wait(()=>window.sb&&document.querySelector(".wrap"));if(!wrap)return;
  let user=null;for(let i=0;i<60&&!user;i++){try{const r=await window.sb.auth.getUser();user=r&&r.data&&r.data.user;}catch(e){}if(!user)await new Promise(r=>setTimeout(r,1000));}
  if(!user)return;
  const sec=document.createElement("section");sec.className="kpisec pssec";sec.id="psSec";sec.hidden=true;
  const hd=el("div","kpihead");hd.append(el("h1","","أخصائي المنتجات"));sec.append(hd);
  sec.append(el("p","psHint","وكيل علم بيانات: وش أفضل باقة وتحليل في كل منطقة وفرع وفئة عمرية وموسم، ووين تشتد المؤشرات الصحية. أعداد ونسب بدون مبالغ."));
  const body=el("div");body.id="psBody";body.append(el("div","psHint","أحمّل…"));sec.append(body);
  const anchor=document.getElementById("hcSec")||document.getElementById("bizSec")||document.getElementById("shSec");if(anchor&&anchor.parentNode===wrap)anchor.after(sec);else wrap.append(sec);
  try{await load();if(!S.d)return;sec.hidden=false;render();}catch(e){return;}   // اللي ما له صلاحية ما تظهر له الأيقونة
  document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="visible"){try{await load();render();}catch(e){}}});
}
if(location.hash!=="#voice")init();
window.__psReload=async()=>{await load();render();};
})();
