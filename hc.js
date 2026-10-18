/* الرعاية المنزلية — النسخة الثانية (١٨ أكتوبر ٢٠٢٦ مساءً، بطلب أبو راكان: كارد لكل منطقة + كارد للمحاليل والإبر والعلاج الطبيعي، بدون تفاصيل كثيرة).
   المالك أسامة السوادي (أبو ناصر): يحدّث أرقام المحاليل/الإبر/العلاج الطبيعي وحالة التجهيز. الجميع يشوفونها، والكتابة لأسامة بس (RLS مجموعة hc).
   المصادر: زيارات المختبر لكل منطقة من السوبرسيت (hc/lab: الشهر مقابل نفس أيام ٢٠٢٥) + حجوزات اليوم من Wareed BI (hc/labvisits). أعداد فقط، بدون مبالغ. */
(function(){"use strict";if(window.__hcLoaded)return;window.__hcLoaded=true;
const OWNER_ID="a714befb-b324-4976-ae76-25cfc995db50";
const AR=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const N=n=>n==null?"—":AR(Number(n).toLocaleString("en-US"));
const SG=n=>n==null?"":(n>0?"+":"")+AR(n)+"٪";
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=String(txt);return e;};
const fmtT=s=>{try{return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-arab",{timeZone:"Asia/Riyadh",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).format(new Date(s));}catch(e){return "";}};
const MONEY=/(ريال|ر\.\s?س|SAR|﷼|\$|هللة|سعر|أسعار|تكلفة)/i;
const STATES={unk:["لم يُحدَّث","unk"],todo:["لم يبدأ","todo"],prog:["جاري","prog"],done:["مكتمل","done"],block:["متعثر","block"]};
const KST={pending:["بانتظار الاعتماد","pend"],approved:["معتمد","ok"],note:["عليه ملاحظة","note"]};
const SERVICES=[["iv","المحاليل الوريدية"],["inj","الإبر"],["pt","العلاج الطبيعي"]];
const S={me:null,labvisits:null,lab:null,meta:{},status:{groups:[]},target:{cities:[]},kpis:{items:[]}};
const isOwner=()=>S.me&&S.me.id===OWNER_ID;
const isBoss=()=>!!window.__isBoss;
const who=()=>(S.me&&S.me.name)||"";
// مطابقة أسماء المدن بين السوبرسيت والبي آي
const SAME={"الرياض":["الرياض"],"جدة":["جدة"],"الدمام":["المنطقة الشرقية","الدمام"],"القصيم":["القصيم"],"مكة":["مكة المكرمة","مكة"],"عسير":["عسير"],"الطائف":["الطائف"],"المدينة":["المدينة المنورة","المدينة"],"جازان":["جازان"],"حائل":["حائل"]};

function css(){if(document.getElementById("hcCss"))return;const s=el("style");s.id="hcCss";s.textContent=`
#hcSec{font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif}
#hcSec *,.hcOv *{box-sizing:border-box}
#hcSec [hidden],.hcOv [hidden]{display:none!important}
.hcHint{color:var(--muted,#8f98ad);font-size:.86em;line-height:1.6;margin:.2em 0 .9em}
.hcCard{background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:16px;padding:14px;width:100%;margin-bottom:12px}
.hcH{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:8px}
.hcH h2{margin:0;font-family:"Readex Pro",system-ui;font-size:1.02em;font-weight:600}
.hcH small{color:var(--muted,#8f98ad);font-size:.78em;text-align:left}
.hcBig{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.hcBig b{font-family:"Readex Pro",system-ui;font-size:2em;line-height:1}
.hcBig span{color:var(--muted,#8f98ad);font-size:.86em}
.hcGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-bottom:12px}
.hcReg{background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:14px;padding:12px}
.hcReg .n{font-weight:600;font-size:.95em;display:flex;justify-content:space-between;align-items:baseline;gap:6px}
.hcReg .n small{color:var(--muted,#8f98ad);font-weight:400;font-size:.74em}
.hcReg b{display:block;font-family:"Readex Pro",system-ui;font-size:1.7em;line-height:1.15;margin:6px 0 2px}
.hcReg .s{font-size:.76em;color:var(--muted,#8f98ad);line-height:1.5}
.hcChip{display:inline-block;font-size:.7em;border-radius:999px;padding:2px 7px;border:1px solid var(--line,#272d3a);color:var(--muted,#8f98ad);white-space:nowrap;margin-top:5px}
.hcChip.up{color:#5fe39b;border-color:rgba(61,220,132,.45)}.hcChip.dn{color:#ff8a8a;border-color:rgba(255,92,92,.45)}.hcChip.hot{color:#ffd76a;border-color:rgba(255,200,61,.45)}
.hcChip.unk{color:#b4bccd}.hcChip.todo{color:#ff8a8a;border-color:rgba(255,92,92,.4)}.hcChip.prog{color:#ffd76a;border-color:rgba(255,200,61,.4)}.hcChip.done{color:#5fe39b;border-color:rgba(61,220,132,.4)}.hcChip.block{color:#ffa57d;border-color:rgba(255,138,91,.4)}
.hcChip.pend{color:#b4bccd}.hcChip.ok{color:#5fe39b;border-color:rgba(61,220,132,.4)}.hcChip.note{color:#ffd76a;border-color:rgba(255,200,61,.4)}.hcChip.prop{color:#9cc7ff;border-color:rgba(90,162,255,.45)}
.hcBar{position:relative;height:8px;border-radius:99px;background:rgba(255,255,255,.07);margin:8px 0 4px;overflow:hidden}
.hcBar i{position:absolute;inset-block:0;right:0;border-radius:99px;background:linear-gradient(90deg,#5aa2ff,#7cc4ff)}
.hcKv{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin:8px 0 4px}
.hcKv div{background:var(--panel,#161a23);border:1px solid var(--line,#272d3a);border-radius:12px;padding:8px 10px}
.hcKv b{display:block;font-family:"Readex Pro",system-ui;font-size:1.15em}
.hcKv span{font-size:.74em;color:var(--muted,#8f98ad)}
.hcCities{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.hcCity{display:grid;grid-template-columns:1fr auto;gap:2px 10px;width:100%;text-align:right;background:transparent;border:0;border-top:1px solid rgba(255,255,255,.06);padding:8px 0 0;color:var(--fg,#f3f5f9);font:inherit}
.hcCity.ed{cursor:pointer}
.hcCity .cn{font-weight:600;font-size:.9em}.hcCity .v{font-family:"Readex Pro",system-ui;font-size:.9em}
.hcCity .hcBar{grid-column:1/-1;height:5px;margin:3px 0}
.hcCity .s{grid-column:1/-1;font-size:.74em;color:var(--muted,#8f98ad)}
.hcMeta{font-size:.74em;color:var(--muted,#8f98ad);margin-top:6px;line-height:1.5}
.hcDays{display:flex;align-items:flex-end;gap:3px;height:46px;margin:8px 0 2px;direction:ltr}
.hcDays i{flex:1;display:block;border-radius:3px 3px 0 0;background:var(--accent,#3b82f6);opacity:.85}
.hcBtn{background:#5aa2ff;color:#fff;border:0;border-radius:10px;padding:7px 13px;font:inherit;font-size:.84em;font-weight:600;cursor:pointer}
.hcBtn.ghost{background:transparent;border:1px solid var(--line,#272d3a);color:var(--fg,#f3f5f9);font-weight:500}
.hcBtn:disabled{opacity:.5}
.hcOwner{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:.84em;color:var(--muted,#8f98ad);padding:4px 2px 14px}
.hcGrp{font-size:.78em;color:var(--muted,#8f98ad);margin:12px 2px 6px}
.hcList{display:flex;flex-direction:column;gap:7px}
.hcI{display:flex;align-items:center;gap:10px;width:100%;text-align:right;background:var(--panel,#161a23);border:1px solid var(--line,#272d3a);border-radius:13px;padding:10px 12px;color:var(--fg,#f3f5f9);font:inherit}
.hcI.ed{cursor:pointer}.hcI.soon{opacity:.75}
.hcI .dot{flex:0 0 9px;height:9px;border-radius:50%}.dot.unk{background:#8f98ad}.dot.todo{background:#ff5c5c}.dot.prog{background:#ffc83d}.dot.done{background:#3ddc84}.dot.block{background:#ff8a5b}
.hcI .tx{flex:1;min-width:0}.hcI .t{font-weight:600;font-size:.93em}.hcI .o{font-size:.78em;color:var(--muted,#8f98ad);margin-top:2px}
.hcK{display:flex;flex-direction:column;gap:6px;background:var(--panel,#161a23);border:1px solid var(--line,#272d3a);border-radius:13px;padding:10px 12px}
.hcK .top{display:flex;align-items:flex-start;gap:9px}.hcK .t{flex:1;font-size:.92em;line-height:1.5}.hcK .chips{display:flex;gap:5px;flex-wrap:wrap}
.hcK .nt{font-size:.8em;color:#ffd76a;line-height:1.5}.hcK .acts{display:flex;gap:6px}
.hcOv{position:fixed;inset:0;z-index:960;background:rgba(5,7,12,.6);display:flex;align-items:flex-end;justify-content:center}
.hcSh{width:100%;max-width:560px;max-height:90vh;max-height:90dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;background:var(--panel,#161a23);border:1px solid var(--line,#272d3a);border-bottom:0;border-radius:20px 20px 0 0;padding:14px 16px calc(16px + env(safe-area-inset-bottom,0px));color:var(--fg,#f3f5f9);font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif}
.hcShH{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:6px}
.hcShH h2{margin:0;font-family:"Readex Pro",system-ui;font-size:1.1em}
.hcX{background:rgba(255,255,255,.07);border:0;color:var(--fg,#f3f5f9);border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;flex:0 0 32px}
.hcLbl{font-size:.8em;color:var(--muted,#8f98ad);margin:12px 0 6px}
.hcSeg{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}
.hcSeg button{border:1px solid var(--line,#272d3a);background:transparent;color:var(--fg,#f3f5f9);border-radius:10px;padding:8px 2px;font:inherit;font-size:.76em;cursor:pointer}
.hcSeg button.on{background:#5aa2ff;border-color:#5aa2ff;color:#fff}
.hcIn,.hcTa{width:100%;font:inherit;font-size:16px;padding:10px 12px;border:1px solid var(--line,#272d3a);border-radius:12px;background:var(--panel2,#1e2330);color:var(--fg,#f3f5f9)}
.hcTa{min-height:84px;resize:vertical}.hcIn:focus,.hcTa:focus{outline:0;border-color:#5aa2ff}
.hcTwo{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hcMsg{font-size:.84em;min-height:1.2em;margin-top:8px;color:var(--muted,#8f98ad)}.hcMsg.err{color:#ff8a5b}
.hcSave{width:100%;margin-top:14px;padding:11px}
`;document.head.append(s);}

function wait(fn,ms){return new Promise(r=>{const t0=Date.now();(function f(){let v=null;try{v=fn();}catch(e){}if(v)return r(v);if(Date.now()-t0>(ms||120000))return r(null);setTimeout(f,250);})();});}
async function load(){
  const {data,error}=await window.sb.from("docs").select("id,data").eq("collection","hc");
  if(error)throw error;
  (data||[]).forEach(r=>{if(r.id in S)S[r.id]=r.data||{};});
  if(!Array.isArray(S.status.groups))S.status.groups=[];if(!Array.isArray(S.target.cities))S.target.cities=[];if(!Array.isArray(S.kpis.items))S.kpis.items=[];
}
async function save(id,mut){
  const {data,error}=await window.sb.from("docs").select("data").eq("collection","hc").eq("id",id).maybeSingle();
  if(error)throw error;const d=(data&&data.data)||{};mut(d);d.updatedAt=new Date().toISOString();d.updatedBy=who();
  const r=await window.sb.from("docs").upsert({collection:"hc",id,data:d},{onConflict:"collection,id"});if(r.error)throw r.error;
  S[id]=d;return d;
}
const intOrNull=v=>{v=String(v||"").replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).trim();if(!v)return null;if(!/^\d{1,6}$/.test(v))throw new Error("اكتب رقم صحيح بدون فواصل");return +v;};
const noMoney=t=>{if(MONEY.test(t||""))throw new Error("ممنوع أسعار أو أرقام مالية داخل الأيقونة");return t;};

/* ── الواجهة ── */
function render(){
  const body=document.getElementById("hcBody");if(!body)return;body.replaceChildren();
  body.append(todayCard());
  body.append(el("div","hcGrp","زيارات المختبر المنزلية حسب المنطقة · هالشهر"+(S.lab&&S.lab.compareLabel?" مقابل "+S.lab.compareLabel.replace(/\d{4}-\d{2}/,m=>AR(m)):"")));
  body.append(regionGrid());
  body.append(servicesCard());
  if(isOwner()||isBoss())body.append(ownerLine());
  const pend=(S.kpis.items||[]).filter(k=>k.state!=="approved").length;document.getElementById("hcSec").dataset.pend=isOwner()?String(pend):"";
  try{window.dispatchEvent(new Event("hcrender"));}catch(e){}
}
function todayCard(){
  const L=S.labvisits,c=el("div","hcCard");const h=el("div","hcH");h.append(el("h2","","زيارات المختبر المنزلية · اليوم"));
  if(!L||!L.today){h.append(el("small","","من البي آي"));c.append(h,el("div","hcMeta","تنسحب من Wareed BI مع سحب ٩ الصبح و٧ المسا."));return c;}
  h.append(el("small","",(L.complete?"اليوم مكتمل":"حتى "+AR(L.capturedAt||""))+" · Wareed BI"));c.append(h);
  const t=L.today,y=L.yesterday,a=L.avg7;
  const big=el("div","hcBig");big.append(el("b","",N(t.bookings)),el("span","","حجز منزلي اليوم"+(t.share!=null?" · "+AR(t.share)+"٪ من حجوزات اليوم":"")));c.append(big);
  const kv=el("div","hcKv");const k=(v,l)=>{const x=el("div");x.append(el("b","",v),el("span","",l));kv.append(x);};
  k(N(y&&y.n),"أمس"+(a?" · متوسط ٧ أيام "+N(a):""));k(N(t.visitsToday),"زيارات مجدولة اليوم");k(N(t.visitsTomorrow),"مجدولة بكرة");c.append(kv);
  const days=(L.days||[]).slice(-14);if(days.length>1){const mx=Math.max(1,...days.map(d=>+d.n||0));const ch=el("div","hcDays");
    days.forEach((d,i)=>{const b=el("i");b.style.height=Math.max(2,(+d.n||0)/mx*100)+"%";if(i===days.length-1&&!L.complete)b.style.opacity=".4";b.title=d.d+" · "+(d.n||0);ch.append(b);});c.append(ch);
    c.append(el("div","hcMeta","آخر ١٤ يوم"+(L.complete?"":" · آخر عمود جزئي")));}
  return c;
}
function regionGrid(){
  const g=el("div","hcGrid");const lab=S.lab,L=S.labvisits;
  const cities=(lab&&lab.cities)||[];
  if(!cities.length){const c=el("div","hcCard");c.append(el("div","hcHint","أرقام المناطق تنسحب من السوبرسيت مع التحديث الجاي."));return c;}
  const todayBy={};((L&&L.regions)||[]).forEach(r=>{todayBy[r.name]=r.n;});
  cities.forEach(ct=>{const card=el("div","hcReg");const n=el("div","n");n.append(document.createTextNode(ct.city));n.append(el("small","",AR(ct.perDay)+"/يوم"));card.append(n);
    card.append(el("b","",N(ct.visits)));
    const names=SAME[ct.city]||[ct.city];const tb=names.map(x=>todayBy[x]).find(v=>v!=null);
    card.append(el("div","s",(tb!=null?"اليوم "+N(tb)+" حجز · ":"")+(ct.latePct!=null?"متأخر عن الوقت "+AR(ct.latePct)+"٪":"")));
    if(ct.chg!=null)card.append(el("span","hcChip "+(ct.chg>=0?"up":"dn"),SG(ct.chg)+" عن "+AR(lab.compareLabel.replace("نفس الأيام من ","").slice(0,4))));
    else card.append(el("span","hcChip","جديد · ما له مقارنة "+AR(String(lab.compareLabel||"").replace(/\D/g,"").slice(0,4))));
    g.append(card);});
  const tot=lab.total||{};const c=el("div","hcReg");c.style.background="var(--panel,#161a23)";const n=el("div","n");n.append(document.createTextNode("كل المملكة"));n.append(el("small","",AR(tot.perDay||0)+"/يوم"));c.append(n,el("b","",N(tot.visits)));
  c.append(el("div","s",AR(String(lab.period||"").replace(/\d{4}-/g,""))));if(tot.chg!=null)c.append(el("span","hcChip "+(tot.chg>=0?"up":"dn"),SG(tot.chg)+" عن السنة الماضية"));g.append(c);
  return g;
}
function daysTo(iso){const t=new Date(iso+"T00:00:00+03:00").getTime();return Math.ceil((t-Date.now())/864e5);}
function servicesCard(){
  const T=S.target;const c=el("div","hcCard");const h=el("div","hcH");h.append(el("h2","","المحاليل الوريدية والإبر والعلاج الطبيعي"));
  const dd=daysTo(T.start||"2026-11-01");h.append(el("small","",dd>0?"يبدأ ١ نوفمبر · باقي "+AR(dd)+" يوم":"بدأ ١ نوفمبر"));c.append(h);
  const cities=T.cities||[];const done=cities.reduce((a,x)=>a+(+x.done||0),0);const has=cities.some(x=>x.done!=null);const goal=+T.goal||2000;
  const big=el("div","hcBig");big.append(el("b","",has?N(done):"—"),el("span","","من "+N(goal)+" زيارة شهرياً"));c.append(big);
  const bar=el("div","hcBar");const f=el("i");f.style.width=Math.min(100,goal?done/goal*100:0)+"%";bar.append(f);c.append(bar);
  const sv=T.services||{};const kv=el("div","hcKv");SERVICES.forEach(([k,nm])=>{const x=el(isOwner()?"button":"div");x.style.cssText="text-align:right;font:inherit;color:inherit"+(isOwner()?";cursor:pointer":"");if(isOwner()){x.type="button";x.onclick=()=>serviceSheet(k,nm);}x.append(el("b","",sv[k]&&sv[k].done!=null?N(sv[k].done):"—"),el("span","",nm+" هالشهر"));kv.append(x);});c.append(kv);
  const list=el("div","hcCities");
  cities.forEach(ct=>{const b=el(isOwner()?"button":"div","hcCity"+(isOwner()?" ed":""));if(isOwner()){b.type="button";b.onclick=()=>citySheet(ct.key);}
    b.append(el("div","cn",ct.name));const g=+ct.goal||0;b.append(el("div","v",(ct.done!=null?N(ct.done):"—")+" / "+(ct.goal!=null?N(ct.goal):"؟")));
    const bb=el("div","hcBar");const ff=el("i");ff.style.width=Math.min(100,g&&ct.done!=null?ct.done/g*100:0)+"%";bb.append(ff);b.append(bb);
    b.append(el("div","s",ct.goal==null?"هدف المدينة يحدده أسامة":(ct.updatedAt?"آخر تحديث "+fmtT(ct.updatedAt)+(ct.updatedBy?" · "+ct.updatedBy:""):"ما تحدّث للحين")));list.append(b);});
  c.append(list);
  c.append(el("div","hcMeta","هالخدمات ما لها مصدر في السوبرسيت (نظام مختبر)؛ الأرقام يدخّلها أسامة شهرياً لين يصير لها نظام."));
  return c;
}
function ownerLine(){
  const all=(S.status.groups||[]).flatMap(g=>g.items||[]).filter(i=>!i.soon);const pend=(S.kpis.items||[]).filter(k=>k.state!=="approved").length;
  const w=el("div","hcOwner");w.append(el("span","","التجهيز: "+AR(all.filter(i=>i.state==="done").length)+" من "+AR(all.length)+" مكتمل · مؤشرات بانتظار الاعتماد: "+AR(pend)));
  const b=el("button","hcBtn ghost","التجهيز والمؤشرات");b.type="button";b.onclick=adminSheet;w.append(b);return w;
}

/* ── نوافذ ── */
function sheet(title,build){
  document.querySelectorAll(".hcOv").forEach(e=>e.remove());
  const ov=el("div","hcOv");const sh=el("div","hcSh");sh.setAttribute("role","dialog");sh.setAttribute("aria-label",title);ov.append(sh);
  const close=()=>{ov.remove();render();};ov.addEventListener("click",e=>{if(e.target===ov)close();});
  const h=el("div","hcShH");h.append(el("h2","",title));const x=el("button","hcX","✕");x.type="button";x.setAttribute("aria-label","إغلاق");x.onclick=close;h.append(x);sh.append(h);
  const msg=el("div","hcMsg","");build(sh,msg,close);sh.append(msg);document.body.append(ov);
}
const err=(msg,e)=>{msg.textContent="ما انحفظ: "+(e.message||e);msg.className="hcMsg err";};
function adminSheet(){
  sheet("التجهيز والمؤشرات",(sh)=>{
    const all=(S.status.groups||[]).flatMap(g=>g.items||[]).filter(i=>!i.soon);
    sh.append(el("div","hcGrp","حالة التجهيز · "+AR(all.filter(i=>i.state==="done").length)+" من "+AR(all.length)+" مكتمل"));
    (S.status.groups||[]).forEach(g=>{sh.append(el("div","hcGrp",g.title));const l=el("div","hcList");
      (g.items||[]).forEach(it=>{const st=STATES[it.state]||STATES.unk;const b=el(isOwner()?"button":"div","hcI"+(isOwner()?" ed":"")+(it.soon?" soon":""));if(isOwner()){b.type="button";b.onclick=()=>itemSheet(g.key,it.key);}
        const tx=el("div","tx");tx.append(el("div","t",it.title+(it.need?" ("+AR(it.have!=null?it.have:0)+"/"+AR(it.need)+")":"")));
        const sub=[it.note,it.updatedAt?fmtT(it.updatedAt)+(it.updatedBy?" · "+it.updatedBy:""):""].filter(Boolean).join(" · ");if(sub)tx.append(el("div","o",sub));
        b.append(el("span","dot "+st[1]),tx,el("span","hcChip "+st[1],st[0]));l.append(b);});sh.append(l);});
    const its=S.kpis.items||[];sh.append(el("div","hcGrp","مؤشرات الأداء · "+AR(its.filter(k=>k.state==="approved").length)+" من "+AR(its.length)+" معتمد"));
    const l=el("div","hcList");
    its.forEach(k=>{const st=KST[k.state]||KST.pending;const r=el("div","hcK");const top=el("div","top");top.append(el("div","t",AR(k.n||"")+". "+k.title));
      const ch=el("div","chips");if(k.proposed)ch.append(el("span","hcChip prop","مقترح"));ch.append(el("span","hcChip "+st[1],st[0]));top.append(ch);r.append(top);
      if(k.note)r.append(el("div","nt","ملاحظة أسامة: "+k.note));
      if(isOwner()){const a=el("div","acts");const ap=el("button","hcBtn"+(k.state==="approved"?" ghost":""),k.state==="approved"?"إلغاء الاعتماد":"اعتماد ✓");ap.type="button";
        ap.onclick=async()=>{ap.disabled=true;try{await save("kpis",d=>{const x=(d.items||[]).find(z=>z.key===k.key);if(x){x.state=x.state==="approved"?"pending":"approved";x.by=who();x.at=new Date().toISOString();}});adminSheet();}catch(e){ap.disabled=false;alert("ما انحفظ: "+(e.message||e));}};
        const nb=el("button","hcBtn ghost","ملاحظة");nb.type="button";nb.onclick=()=>noteSheet(k.key);a.append(ap,nb);r.append(a);}
      l.append(r);});sh.append(l);
    const M=S.meta;if((M.rules||[]).length){sh.append(el("div","hcGrp","قواعد الأيقونة"));const ul=el("ul");ul.style.cssText="margin:0;padding:0 18px 0 0;font-size:.84em;line-height:1.7";(M.rules||[]).forEach(t=>ul.append(el("li","",t)));sh.append(ul);}
  });
}
function itemSheet(gk,ik){
  const g=(S.status.groups||[]).find(x=>x.key===gk);const it=g&&(g.items||[]).find(x=>x.key===ik);if(!it)return;
  sheet(g.title+" · "+it.title,(sh,msg,close)=>{
    let st=it.state||"unk";sh.append(el("div","hcLbl","الحالة"));const seg=el("div","hcSeg");
    Object.entries(STATES).forEach(([k,[l]])=>{const b=el("button",st===k?"on":"",l);b.type="button";b.onclick=()=>{st=k;seg.querySelectorAll("button").forEach(z=>z.classList.remove("on"));b.classList.add("on");};seg.append(b);});sh.append(seg);
    let have=null;if(it.need){sh.append(el("div","hcLbl","عدد الموظّفات حالياً (المطلوب "+AR(it.need)+")"));have=el("input","hcIn");have.inputMode="numeric";have.value=it.have!=null?String(it.have):"";sh.append(have);}
    sh.append(el("div","hcLbl","ملاحظة (بدون أسعار)"));const ta=el("textarea","hcTa");ta.value=it.note||"";sh.append(ta);
    const sv=el("button","hcBtn hcSave","حفظ");sv.type="button";
    sv.onclick=async()=>{sv.disabled=true;try{const note=noMoney(ta.value.trim());const hv=have?intOrNull(have.value):undefined;
      await save("status",d=>{const gg=(d.groups||[]).find(x=>x.key===gk);const x=gg&&(gg.items||[]).find(z=>z.key===ik);if(!x)throw new Error("البند ما عاد موجود");x.state=st;x.note=note;if(hv!==undefined)x.have=hv;x.updatedAt=new Date().toISOString();x.updatedBy=who();});close();adminSheet();}catch(e){sv.disabled=false;err(msg,e);}};
    sh.append(sv);});
}
function citySheet(ck){
  const ct=(S.target.cities||[]).find(x=>x.key===ck);if(!ct)return;
  sheet("المحاليل والإبر · "+ct.name,(sh,msg,close)=>{
    const two=el("div","hcTwo");const a=el("div"),b=el("div");
    a.append(el("div","hcLbl","هدف المدينة الشهري"));const gi=el("input","hcIn");gi.inputMode="numeric";gi.value=ct.goal!=null?String(ct.goal):"";a.append(gi);
    b.append(el("div","hcLbl","المنفّذ هالشهر"));const di=el("input","hcIn");di.inputMode="numeric";di.value=ct.done!=null?String(ct.done):"";b.append(di);
    two.append(a,b);sh.append(two);
    const sv=el("button","hcBtn hcSave","حفظ");sv.type="button";
    sv.onclick=async()=>{sv.disabled=true;try{const g=intOrNull(gi.value),dn=intOrNull(di.value);
      await save("target",d=>{const x=(d.cities||[]).find(z=>z.key===ck);if(!x)throw new Error("المدينة ما عادت موجودة");x.goal=g;x.done=dn;x.updatedAt=new Date().toISOString();x.updatedBy=who();});close();}catch(e){sv.disabled=false;err(msg,e);}};
    sh.append(sv);});
}
function serviceSheet(k,nm){
  sheet(nm+" · المنفّذ هالشهر",(sh,msg,close)=>{
    sh.append(el("div","hcLbl","عدد الزيارات المنفّذة هالشهر (كل المدن)"));const di=el("input","hcIn");di.inputMode="numeric";const cur=(S.target.services||{})[k];di.value=cur&&cur.done!=null?String(cur.done):"";sh.append(di);
    const sv=el("button","hcBtn hcSave","حفظ");sv.type="button";
    sv.onclick=async()=>{sv.disabled=true;try{const dn=intOrNull(di.value);
      await save("target",d=>{d.services=d.services||{};d.services[k]={done:dn,updatedAt:new Date().toISOString(),updatedBy:who()};});close();}catch(e){sv.disabled=false;err(msg,e);}};
    sh.append(sv);});
}
function noteSheet(kk){
  const k=(S.kpis.items||[]).find(x=>x.key===kk);if(!k)return;
  sheet("ملاحظة على المؤشر",(sh,msg,close)=>{
    sh.append(el("div","hcMeta",k.title));sh.append(el("div","hcLbl","ملاحظتك (تعديل الصياغة، طريقة القياس، أو سبب الرفض)"));
    const ta=el("textarea","hcTa");ta.value=k.note||"";sh.append(ta);
    const sv=el("button","hcBtn hcSave","حفظ الملاحظة");sv.type="button";
    sv.onclick=async()=>{sv.disabled=true;try{const t=noMoney(ta.value.trim());
      await save("kpis",d=>{const x=(d.items||[]).find(z=>z.key===kk);if(!x)throw new Error("المؤشر ما عاد موجود");x.note=t;if(t&&x.state!=="approved")x.state="note";if(!t&&x.state==="note")x.state="pending";x.by=who();x.at=new Date().toISOString();});close();adminSheet();}catch(e){sv.disabled=false;err(msg,e);}};
    sh.append(sv);});
}

async function init(){
  css();
  const wrap=await wait(()=>window.sb&&document.querySelector(".wrap"));if(!wrap)return;
  let user=null;for(let i=0;i<60&&!user;i++){try{const r=await window.sb.auth.getUser();user=r&&r.data&&r.data.user;}catch(e){}if(!user)await new Promise(r=>setTimeout(r,1000));}
  if(!user)return;
  const pr=await window.sb.from("profiles").select("id,name,role,email").eq("id",user.id).maybeSingle();
  S.me=pr.data||{id:user.id,email:user.email};
  const sec=el("section","kpisec hcsec");sec.id="hcSec";sec.hidden=true;
  const hd=el("div","kpihead");hd.append(el("h1","","الرعاية المنزلية"));sec.append(hd);
  sec.append(el("p","hcHint","المالك: أسامة السوادي (أبو ناصر). زيارات المختبر من السوبرسيت وWareed BI؛ المحاليل والإبر والعلاج الطبيعي يدخّلها أسامة. أعداد بدون مبالغ."));
  const body=el("div");body.id="hcBody";body.append(el("div","hcHint","أحمّل…"));sec.append(body);
  const anchor=document.getElementById("bizSec")||document.getElementById("shSec");if(anchor&&anchor.parentNode===wrap)anchor.after(sec);else wrap.append(sec);
  try{await load();sec.hidden=false;render();}catch(e){body.replaceChildren(el("div","hcMsg err","ما قدرت أحمّل الرعاية المنزلية: "+(e.message||e)));sec.hidden=false;}
  document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="visible"&&!document.querySelector(".hcOv")){try{await load();render();}catch(e){}}});
}
if(location.hash!=="#voice")init();
window.__hc={reload:async()=>{await load();render();}};
})();
