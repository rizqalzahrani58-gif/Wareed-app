/* بوابة «المنافسين» — Raqeeb AI (بناها Claude بطلب أبو راكان ١٩ أكتوبر ٢٠٢٦)
   المصدر: مجموعة rivals (قراءة/كتابة لأبو راكان بس عبر collection_rules).
   - latest + feed_YYYYMMDD: أخبار اليوم من Raqeeb AI (يسحب ٨:٠٠ ويحلل ٨:٢٠ الصبح، السبت–الخميس).
   - cities: المنافسين لكل مدينة فيها فرع لوريد (المرجع: شيت أبو راكان «قوائم المؤسسات الصحية والمنافسين»).
   - chains + handles: الحسابات اللي تدخل السحب؛ المرشّحة تنتظر اعتماده من هنا. */
(function(){"use strict";if(window.__rvLoaded)return;window.__rvLoaded=true;
const AR=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=String(txt);return e;};
const TYPES={offer:"عرض / سعر",product:"منتج / باقة",branch:"فرع",home:"زيارات منزلية",hiring:"توظيف",partner:"شراكة",brand:"حملة",other:"أخرى"};
const PL={instagram:"انستقرام",x:"X",tiktok:"تيك توك",web:"الموقع"};
const S={latest:null,feed:null,cities:null,chains:null,handles:null,f:"top",tab:"news",reg:"الكل"};
function css(){if(document.getElementById("rvCss"))return;const s=el("style");s.id="rvCss";s.textContent=`
#rvSec{font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif}
#rvSec *{box-sizing:border-box}#rvSec [hidden]{display:none!important}
.rvHint{color:var(--muted,#8f98ad);font-size:.86em;line-height:1.6;margin:.2em 0 .9em}
.rvTabs,.rvChips{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:10px}
.rvTab,.rvChip{flex:0 0 auto;background:transparent;border:1px solid var(--line,#272d3a);color:var(--fg,#f3f5f9);border-radius:999px;padding:6px 13px;font:inherit;font-size:.84em;cursor:pointer}
.rvTab[aria-pressed="true"],.rvChip[aria-pressed="true"]{background:#5aa2ff;border-color:#5aa2ff;color:#fff}
.rvCard{background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:16px;padding:14px;margin-bottom:10px;min-width:0}
.rvSum{line-height:1.8;font-size:.95em}
.rvMeta{font-size:.76em;color:var(--muted,#8f98ad);margin-top:6px;line-height:1.6}
.rvIt{display:grid;gap:6px}
.rvIt .h{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.rvIt .h b{font-family:"Readex Pro",system-ui;font-size:1em}
.rvIt .d{font-size:.9em;line-height:1.75;color:var(--fg,#f3f5f9)}
.rvTag{font-size:.7em;border-radius:999px;padding:2px 8px;border:1px solid var(--line,#272d3a);color:var(--muted,#8f98ad);white-space:nowrap}
.rvTag.hot{color:#ffd76a;border-color:rgba(255,200,61,.5)}.rvTag.city{color:#9cc7ff;border-color:rgba(90,162,255,.5)}.rvTag.cand{color:#ffa57d;border-color:rgba(255,138,90,.5)}
.rvIt a{color:#7cc4ff;font-size:.8em;text-decoration:none}
.rvCity summary{cursor:pointer;display:flex;flex-wrap:wrap;align-items:center;gap:8px;list-style:none}
.rvCity summary::-webkit-details-marker{display:none}
.rvCity summary b{font-family:"Readex Pro",system-ui}
.rvRow{display:grid;grid-template-columns:1fr auto;gap:2px 10px;border-top:1px solid rgba(255,255,255,.06);padding:8px 0 0;margin-top:8px}
.rvRow .n{font-weight:600;font-size:.9em}.rvRow .c{font-family:"Readex Pro",system-ui;color:#7cc4ff}
.rvRow .r{grid-column:1/-1;font-size:.74em;color:var(--muted,#8f98ad);line-height:1.6}
.rvWarn{margin-top:8px;font-size:.8em;color:#ffd76a}
.rvBtn{background:#5aa2ff;color:#fff;border:0;border-radius:10px;padding:6px 12px;font:inherit;font-size:.82em;font-weight:600;cursor:pointer}
.rvBtn.ghost{background:transparent;border:1px solid var(--line,#272d3a);color:var(--fg,#f3f5f9);font-weight:500}
.rvEmpty{color:var(--muted,#8f98ad);font-size:.9em;padding:8px 0}
`;document.head.append(s);}
function wait(fn,ms){return new Promise(r=>{const t0=Date.now();(function f(){let v=null;try{v=fn();}catch(e){}if(v)return r(v);if(Date.now()-t0>(ms||120000))return r(null);setTimeout(f,250);})();});}
async function get(id){const {data,error}=await window.sb.from("docs").select("data").eq("collection","rivals").eq("id",id).maybeSingle();if(error)throw error;return data&&data.data;}
async function load(){
  const [latest,cities,chains,handles]=await Promise.all([get("latest"),get("cities"),get("chains"),get("handles")]);
  S.latest=latest;S.cities=cities;S.chains=chains;S.handles=handles;
  S.feed=latest&&latest.id?await get(latest.id):null;
}
async function saveHandles(mut){const d=(await get("handles"))||{items:[]};mut(d);d.updatedAt=new Date().toISOString();
  const r=await window.sb.from("docs").upsert({collection:"rivals",id:"handles",data:d},{onConflict:"collection,id"});if(r.error)throw r.error;S.handles=d;}
const tab=(k,t)=>{const b=el("button","rvTab",t);b.type="button";b.setAttribute("aria-pressed",String(S.tab===k));b.onclick=()=>{S.tab=k;render();};return b;};
function news(body){
  const f=S.feed;
  if(!f){body.append(el("div","rvEmpty","لسا ما طلع أول تقرير. Raqeeb AI يجهّزه كل صباح الساعة ٨:٢٠ (السبت–الخميس)."));return;}
  const c=el("div","rvCard");c.append(el("div","rvSum",f.summary||""));
  c.append(el("div","rvMeta",`تقرير ${f.date||""} · فحص ${AR(f.postsScanned||0)} منشور و${AR(f.webChanges||0)} تغيير بالمواقع`+((f.pending||[]).length?` · ما اكتمل: ${f.pending.join("، ")}`:"")));body.append(c);
  const ch=el("div","rvChips");[["top","المهم"],["city","مدن وريد"],["all","الكل"]].forEach(([k,t])=>{const b=el("button","rvChip",t);b.type="button";b.setAttribute("aria-pressed",String(S.f===k));b.onclick=()=>{S.f=k;render();};ch.append(b);});body.append(ch);
  let items=(f.items||[]).slice().sort((a,b)=>(b.importance||0)-(a.importance||0));
  if(S.f==="top")items=items.filter(i=>(i.importance||0)>=2);if(S.f==="city")items=items.filter(i=>i.wareedCity);
  if(!items.length){body.append(el("div","rvEmpty","ما فيه أخبار بهالفلتر اليوم."));return;}
  items.forEach(i=>{const k=el("div","rvCard rvIt");const h=el("div","h");h.append(el("b","",i.name||i.key||""));
    h.append(el("span","rvTag",TYPES[i.type]||i.type||""));if(i.city&&i.city!=="عام")h.append(el("span","rvTag city",i.city));
    if((i.importance||0)>=3)h.append(el("span","rvTag hot","مهم"));if(i.candidate)h.append(el("span","rvTag cand","حساب غير معتمد"));
    k.append(h);k.append(el("div","").appendChild(el("b","",i.headline||"")).parentNode);
    if(i.detail)k.append(el("div","d",i.detail));if(i.price)k.append(el("div","rvMeta","السعر: "+i.price));
    const m=el("div","rvMeta",(PL[i.platform]||i.platform||"")+(i.date?" · "+String(i.date).slice(0,10):""));k.append(m);
    if(i.url&&/^https?:\/\//.test(i.url)){const a=el("a","","فتح المصدر ↗");a.href=i.url;a.target="_blank";a.rel="noopener";k.append(a);}
    body.append(k);});
}
function cities(body){
  const cs=(S.cities&&S.cities.items)||[];if(!cs.length){body.append(el("div","rvEmpty","ما فيه بيانات مدن."));return;}
  body.append(el("div","rvHint","المرجع شيت «قوائم المؤسسات الصحية والمنافسين». التقييم من البحث إثراء فقط، وأي مختبر طلع بالبحث وما هو بالشيت معلَّم «غير مؤكد»."));
  const regs=["الكل",...new Set(cs.map(c=>c.region))];const ch=el("div","rvChips");
  regs.forEach(r=>{const b=el("button","rvChip",r);b.type="button";b.setAttribute("aria-pressed",String(S.reg===r));b.onclick=()=>{S.reg=r;render();};ch.append(b);});body.append(ch);
  cs.filter(c=>S.reg==="الكل"||c.region===S.reg).sort((a,b)=>b.total-a.total).forEach(c=>{
    const d=el("details","rvCard rvCity");const s=el("summary");s.append(el("b","",c.city));s.append(el("span","rvTag",c.region));s.append(el("span","rvTag",AR(c.total)+" فرع منافس"));
    if((c.unconfirmed||[]).length)s.append(el("span","rvTag hot",AR(c.unconfirmed.length)+" غير مؤكد"));d.append(s);
    if(!c.competitors.length)d.append(el("div","rvEmpty","ما فيه منافس خاص مسجّل بالشيت."));
    c.competitors.forEach(x=>{const r=el("div","rvRow");r.append(el("div","n",x.name+(x.chain?" ·  من الثمانية":"")));r.append(el("div","c",AR(x.branches)));
      const rr=x.research&&x.research.rating?"⭐ "+x.research.rating+(x.research.where?" · "+x.research.where:""):"";r.append(el("div","r",x.raw.join(" · ")+(rr?" — "+rr:"")));d.append(r);});
    if((c.unconfirmed||[]).length)d.append(el("div","rvWarn","غير مؤكد (من البحث، مو بالشيت): "+c.unconfirmed.map(u=>u.name).join("، ")));
    body.append(d);});
}
function accounts(body){
  body.append(el("div","rvHint","هذي الحسابات اللي يسحبها Raqeeb AI. «مؤكد» = من الموقع الرسمي. «مرشّح» = اجتهاد Claude، يدخل السحب ويتعلّم بأخباره لين تعتمده أو ترفضه."));
  const ch=(S.chains&&S.chains.items)||[];const hs=(S.handles&&S.handles.items)||[];
  ch.forEach(c=>{const k=el("div","rvCard");k.append(el("b","",c.name_ar));
    ["instagram","x","tiktok","snapchat"].forEach(p=>{const v=c[p];const extra=hs.find(h=>h.key===c.key&&h.platform===p);
      const row=el("div","rvRow");row.append(el("div","n",(PL[p]||"سناب")+": "+(v?"@"+String(v).replace(/^@/,""):extra?"@"+extra.handle:"—")));
      const st=v?"مؤكد":extra?(extra.status==="approved"?"معتمد":extra.status==="rejected"?"مرفوض":"مرشّح"):"";row.append(el("div","c",st));
      if(extra&&extra.evidence)row.append(el("div","r",extra.evidence));
      if(extra&&extra.status==="candidate"){const bx=el("div","r");const ok=el("button","rvBtn","اعتماد");ok.type="button";const no=el("button","rvBtn ghost","رفض");no.type="button";no.style.marginInlineStart="6px";
        const act=st2=>async()=>{ok.disabled=no.disabled=true;try{await saveHandles(d=>{const t=(d.items||[]).find(h=>h.key===extra.key&&h.platform===extra.platform);if(t){t.status=st2;t.decidedAt=new Date().toISOString();}});render();}catch(e){ok.disabled=no.disabled=false;alert("ما انحفظ: "+(e.message||e));}};
        ok.onclick=act("approved");no.onclick=act("rejected");bx.append(ok,no);row.append(bx);}
      k.append(row);});
    body.append(k);});
}
function render(){const body=document.getElementById("rvBody");if(!body)return;body.replaceChildren();
  const t=el("div","rvTabs");t.append(tab("news","أخبار اليوم"),tab("cities","المنافسين بالمدن"),tab("acc","الحسابات"));body.append(t);
  if(S.tab==="news")news(body);else if(S.tab==="cities")cities(body);else accounts(body);
  const sec=document.getElementById("rvSec");if(sec){const n=((S.feed&&S.feed.items)||[]).filter(i=>(i.importance||0)>=3).length;sec.dataset.n=String(n);}
}
async function init(){
  css();
  const wrap=await wait(()=>window.sb&&document.querySelector(".wrap"));if(!wrap)return;
  let user=null;for(let i=0;i<60&&!user;i++){try{const r=await window.sb.auth.getUser();user=r&&r.data&&r.data.user;}catch(e){}if(!user)await new Promise(r=>setTimeout(r,1000));}
  if(!user)return;
  try{await load();}catch(e){return;}
  if(!S.cities)return; // ما عنده صلاحية (المجموعة لأبو راكان بس)
  const sec=el("section","kpisec rvsec");sec.id="rvSec";sec.hidden=true;
  const hd=el("div","kpihead");hd.append(el("h1","","المنافسين"));sec.append(hd);
  sec.append(el("p","rvHint","Raqeeb AI · رصد يومي لحسابات المنافسين ومواقعهم (انستقرام، X، تيك توك، المواقع) — يتحدث كل صباح الساعة ٨:٢٠، السبت إلى الخميس."));
  const body=el("div");body.id="rvBody";sec.append(body);
  const anchor=document.getElementById("hcSec")||document.getElementById("bizSec");if(anchor&&anchor.parentNode===wrap)anchor.after(sec);else wrap.append(sec);
  sec.hidden=false;render();
  document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="visible"){try{await load();render();}catch(e){}}});
}
if(location.hash!=="#voice")init();
window.__rv={reload:async()=>{await load();render();}};
})();
