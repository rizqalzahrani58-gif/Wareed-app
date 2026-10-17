/* بيانات البزنس (١٨ أكتوبر ٢٠٢٦) — الأصل الأول للأجنتك، مبني على الـRFP
   (Wareed Sovereign Agentic AI Operations Center · S1 + القسم ٨).
   يظهر لأبو راكان ود. ناصر (owner) وروان (trusted) بس — المجموعة biz وbucket biz محميين بالـRLS.
   بطاقة النضج: متوسط موزون لبنود الـRFP (biz/maturity)، وبوابة بناء الوكلاء ٧٠٪.
   البنود: biz/it-<key> مقسومة على ٤ موجات؛ كل بند فيه معلومات/روابط/ملفات وحالته ومسؤوله. */
(function(){"use strict";if(window.__bizLoaded)return;window.__bizLoaded=true;
const BOSS="reqooo@hotmail.com";
const AR=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=String(txt);return e;};
const fmtT=s=>{try{return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-arab",{timeZone:"Asia/Riyadh",day:"numeric",month:"short",hour:"numeric",minute:"2-digit"}).format(new Date(s));}catch(e){return "";}};
const ST={missing:["ناقص","miss"],partial:["جزئي","part"],done:["مكتمل","done"],stale:["يحتاج تحديث","stale"]};
const WAVES=[[1,"الموجة ١","الأساس"],[2,"الموجة ٢","حلقة الدخل"],[3,"الموجة ٣","التشغيل"],[4,"الموجة ٤","الأمن والسيادة"]];
const S={me:null,role:"",items:[],mat:null,wave:1,open:false};

function css(){if(document.getElementById("bizCss"))return;const s=el("style");s.id="bizCss";s.textContent=`
#bizSec{font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif}
#bizSec *,.bzOv *{box-sizing:border-box}
#bizSec [hidden],.bzOv [hidden]{display:none!important}
.bzHint{color:var(--muted,#8f98ad);font-size:.88em;line-height:1.6;margin:.2em 0 .9em}
.bzMat{background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:16px;padding:14px;width:100%}
.bzMatTop{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.bzPct{font-family:"Readex Pro",system-ui,sans-serif;font-size:2.4em;font-weight:700;line-height:1}
.bzPct small{font-size:.42em;color:var(--muted,#8f98ad);font-weight:500;margin-inline-start:6px}
.bzGateTxt{font-size:.85em;color:var(--muted,#8f98ad);text-align:left}
.bzGateTxt b{color:var(--warn,#ffc83d);font-weight:600}
.bzBar{position:relative;height:10px;border-radius:99px;background:rgba(255,255,255,.07);margin:12px 0 6px;overflow:visible}
.bzBar i{position:absolute;inset-block:0;right:0;border-radius:99px;background:linear-gradient(90deg,#5aa2ff,#7cc4ff)}
.bzBar u{position:absolute;top:-5px;bottom:-5px;width:2px;background:var(--warn,#ffc83d);border-radius:2px;text-decoration:none}
.bzBar u::after{content:"٧٠٪ بوابة الوكلاء";position:absolute;top:18px;transform:translateX(50%);right:0;white-space:nowrap;font-size:10px;color:var(--warn,#ffc83d)}
.bzNote{font-size:.78em;color:var(--muted,#8f98ad);margin-top:18px;line-height:1.5}
.bzTog{margin-top:10px;width:100%;background:transparent;border:1px solid var(--line,#272d3a);color:var(--fg,#f3f5f9);border-radius:12px;padding:9px;font:inherit;font-size:.9em;cursor:pointer}
.bzAreas{display:flex;flex-direction:column;gap:10px;margin-top:12px}
.bzA{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.06)}
.bzA:last-child{border-bottom:0}
.bzA .n{font-weight:600;font-size:.92em}.bzA .n span{color:var(--muted,#8f98ad);font-weight:400;font-size:.85em;margin-inline-start:6px}
.bzA .s{font-family:"Readex Pro",system-ui;font-weight:600;font-size:.92em}
.bzA .mb{grid-column:1/-1;height:5px;border-radius:9px;background:rgba(255,255,255,.07);position:relative;margin:4px 0}
.bzA .mb i{position:absolute;inset-block:0;right:0;border-radius:9px;background:#5aa2ff}
.bzA .mb.zero i{background:transparent}
.bzA .d{grid-column:1/-1;font-size:.8em;color:var(--muted,#8f98ad);line-height:1.55}
.bzA .d b{color:var(--fg,#f3f5f9);font-weight:500}
.bzWaves{display:flex;gap:6px;overflow-x:auto;margin:16px 0 10px;padding-bottom:2px;scrollbar-width:none}
.bzWaves::-webkit-scrollbar{display:none}
.bzW{flex:0 0 auto;border:1px solid var(--line,#272d3a);background:transparent;color:var(--fg,#f3f5f9);border-radius:999px;padding:7px 13px;font:inherit;font-size:.85em;cursor:pointer;white-space:nowrap}
.bzW small{color:var(--muted,#8f98ad);margin-inline-start:4px}
.bzW.on{background:#5aa2ff;border-color:#5aa2ff;color:#fff}.bzW.on small{color:rgba(255,255,255,.85)}
.bzWsum{font-size:.84em;color:var(--muted,#8f98ad);margin:0 2px 10px}
.bzList{display:flex;flex-direction:column;gap:8px;width:100%}
.bzI{display:flex;align-items:center;gap:11px;width:100%;text-align:right;background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:14px;padding:11px 12px;color:var(--fg,#f3f5f9);font:inherit;cursor:pointer}
.bzI .dot{flex:0 0 10px;height:10px;border-radius:50%}
.bzI .tx{flex:1;min-width:0}.bzI .t{font-weight:600;font-size:.95em}
.bzI .o{font-size:.8em;color:var(--muted,#8f98ad);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bzChip{flex:0 0 auto;font-size:.75em;border-radius:999px;padding:3px 9px;border:1px solid}
.miss .dot,.dot.miss{background:#ff5c5c}.part .dot,.dot.part{background:#ffc83d}.done .dot,.dot.done{background:#3ddc84}.stale .dot,.dot.stale{background:#ff8a5b}
.bzChip.miss{color:#ff8a8a;border-color:rgba(255,92,92,.4)}.bzChip.part{color:#ffd76a;border-color:rgba(255,200,61,.4)}.bzChip.done{color:#5fe39b;border-color:rgba(61,220,132,.4)}.bzChip.stale{color:#ffa57d;border-color:rgba(255,138,91,.4)}
.bzOv{position:fixed;inset:0;z-index:960;background:rgba(5,7,12,.6);display:flex;align-items:flex-end;justify-content:center}
.bzSh{width:100%;max-width:560px;max-height:90vh;max-height:90dvh;overflow-y:auto;-webkit-overflow-scrolling:touch;background:var(--panel,#161a23);border:1px solid var(--line,#272d3a);border-bottom:0;border-radius:20px 20px 0 0;padding:14px 16px calc(16px + env(safe-area-inset-bottom,0px));color:var(--fg,#f3f5f9);font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif}
.bzShH{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.bzShH h2{margin:0;font-family:"Readex Pro",system-ui;font-size:1.15em}
.bzX{background:rgba(255,255,255,.07);border:0;color:var(--fg,#f3f5f9);border-radius:50%;width:32px;height:32px;font-size:16px;cursor:pointer;flex:0 0 32px}
.bzWhy{color:var(--muted,#8f98ad);font-size:.88em;line-height:1.6;margin:6px 0 10px}
.bzMeta{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.bzMeta span{font-size:.75em;color:var(--muted,#8f98ad);border:1px solid var(--line,#272d3a);border-radius:999px;padding:3px 9px}
.bzLbl{font-size:.8em;color:var(--muted,#8f98ad);margin:12px 0 6px}
.bzSeg{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
.bzSeg button{border:1px solid var(--line,#272d3a);background:transparent;color:var(--fg,#f3f5f9);border-radius:10px;padding:8px 2px;font:inherit;font-size:.78em;cursor:pointer}
.bzSeg button.on.miss{background:rgba(255,92,92,.18);border-color:#ff5c5c}.bzSeg button.on.part{background:rgba(255,200,61,.18);border-color:#ffc83d}.bzSeg button.on.done{background:rgba(61,220,132,.18);border-color:#3ddc84}.bzSeg button.on.stale{background:rgba(255,138,91,.18);border-color:#ff8a5b}
.bzIn,.bzTa{width:100%;font:inherit;font-size:16px;color:var(--fg,#f3f5f9);background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:12px;padding:10px 12px}
.bzTa{min-height:88px;resize:vertical;line-height:1.6}
.bzIn:focus,.bzTa:focus{outline:0;border-color:#5aa2ff}
.bzIn.ltr{direction:ltr;text-align:left}
.bzIn.ltr:placeholder-shown{direction:rtl;text-align:right}
.bzRow{display:flex;gap:8px;margin-top:8px;align-items:center}
.bzFile{flex:1;font-size:.82em;color:var(--muted,#8f98ad);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bzBtn{border:0;border-radius:12px;padding:10px 16px;font:inherit;font-weight:600;cursor:pointer;background:#5aa2ff;color:#fff}
.bzBtn.ghost{background:transparent;border:1px solid var(--line,#272d3a);color:var(--fg,#f3f5f9);font-weight:500}
.bzBtn:disabled{opacity:.5}
.bzMsg{font-size:.82em;min-height:1.2em;margin-top:6px;color:var(--muted,#8f98ad)}
.bzMsg.err{color:#ff8a5b}
.bzEnts{display:flex;flex-direction:column;gap:8px}
.bzE{background:var(--panel2,#1e2330);border:1px solid var(--line,#272d3a);border-radius:12px;padding:10px 12px;font-size:.9em;line-height:1.6}
.bzE .h{display:flex;justify-content:space-between;gap:8px;font-size:.75em;color:var(--muted,#8f98ad);margin-bottom:4px}
.bzE .tx{white-space:pre-wrap;word-break:break-word}
.bzE a,.bzE button.f{display:inline-block;margin-top:6px;color:#7cc4ff;background:none;border:0;padding:0;font:inherit;font-size:.9em;cursor:pointer;text-decoration:underline;word-break:break-all;text-align:right}
.bzE .del{background:none;border:0;color:#ff8a5b;font:inherit;font-size:1em;cursor:pointer;padding:0}
.bzEmpty{font-size:.85em;color:var(--muted,#8f98ad);padding:6px 0}
`;document.head.append(s);}

function wait(fn,ms){return new Promise(r=>{const t0=Date.now();(function f(){let v=null;try{v=fn();}catch(e){}if(v)return r(v);if(Date.now()-t0>(ms||120000))return r(null);setTimeout(f,250);})();});}
const canEdit=()=>S.role==="owner"||S.role==="trusted";
const isBoss=()=>S.me&&String(S.me.email||"").toLowerCase()===BOSS;

async function load(){
  const {data,error}=await window.sb.from("docs").select("id,data").eq("collection","biz");
  if(error)throw error;
  S.items=[];S.mat=null;
  (data||[]).forEach(r=>{if(r.id==="maturity")S.mat=r.data;else if(r.id.startsWith("it-"))S.items.push(r.data);});
  S.items.sort((a,b)=>(a.wave-b.wave)||((a.order||0)-(b.order||0)));
}
function pct(){const a=(S.mat&&S.mat.areas)||[];let w=0,s=0;a.forEach(x=>{w+=+x.weight||0;s+=(+x.weight||0)*(+x.score||0);});return w?Math.round(s/w):0;}

function render(){
  const sec=document.getElementById("bizSec");if(!sec)return;const body=document.getElementById("bizBody");body.replaceChildren();
  const p=pct(),gate=(S.mat&&S.mat.gate)||70;sec.dataset.pct=String(p);
  /* بطاقة النضج */
  const m=el("div","bzMat");const top=el("div","bzMatTop");const pc=el("div","bzPct",AR(p)+"٪");pc.append(el("small","","نضج اللوحة"));
  const g=el("div","bzGateTxt");if(p>=gate){g.textContent="البوابة مفتوحة ✓";}else{g.append(document.createTextNode("باقي "));g.append(el("b","",AR(gate-p)+"٪"));g.append(document.createTextNode(" على بناء الوكلاء"));}
  top.append(pc,g);const bar=el("div","bzBar");const fill=el("i");fill.style.width=Math.min(100,p)+"%";const mk=el("u");mk.style.right=gate+"%";bar.append(fill,mk);
  m.append(top,bar);
  const note=el("div","bzNote",((S.mat&&S.mat.note)||"")+(S.mat&&S.mat.updatedAt?" · آخر تحديث "+fmtT(S.mat.updatedAt):""));m.append(note);
  const areas=el("div","bzAreas");areas.hidden=!S.open;
  ((S.mat&&S.mat.areas)||[]).slice().sort((a,b)=>(b.weight||0)-(a.weight||0)).forEach(a=>{const r=el("div","bzA");const n=el("div","n",a.name);n.append(el("span","",a.rfp+" · وزن "+AR(a.weight)));
    const sc=el("div","s",AR(a.score)+"٪");const mb=el("div","mb"+(a.score?"":" zero"));const f=el("i");f.style.width=Math.min(100,a.score)+"%";mb.append(f);
    const d=el("div","d");d.append(el("b","","الحين: "),document.createTextNode(a.now||"—"));d.append(el("br"));d.append(el("b","","الخطوة الجاية: "),document.createTextNode(a.next||"—"));
    r.append(n,sc,mb,d);areas.append(r);});
  const tog=el("button","bzTog",S.open?"إخفاء التفاصيل":"تفاصيل بنود الـRFP ("+AR(((S.mat&&S.mat.areas)||[]).length)+")");tog.type="button";
  tog.onclick=()=>{S.open=!S.open;render();};m.append(tog,areas);body.append(m);
  /* الموجات */
  const wv=el("div","bzWaves");WAVES.forEach(([n,l,s])=>{const its=S.items.filter(i=>i.wave===n);const dn=its.filter(i=>i.status==="done").length;
    const b=el("button","bzW"+(S.wave===n?" on":""),l);b.type="button";b.append(el("small","",s+" · "+AR(dn)+"/"+AR(its.length)));b.onclick=()=>{S.wave=n;render();};wv.append(b);});
  body.append(wv);
  const its=S.items.filter(i=>i.wave===S.wave);const cnt=k=>its.filter(i=>(i.status||"missing")===k).length;
  body.append(el("div","bzWsum",AR(cnt("done"))+" مكتمل · "+AR(cnt("partial"))+" جزئي · "+AR(cnt("missing"))+" ناقص"+(cnt("stale")?" · "+AR(cnt("stale"))+" يحتاج تحديث":"")));
  const list=el("div","bzList");its.forEach(it=>{const st=ST[it.status]||ST.missing;const b=el("button","bzI "+st[1]);b.type="button";b.dataset.fp="biz-"+it.key+"-"+(it.status||"missing");
    const tx=el("div","tx");tx.append(el("div","t",it.title));const n=(it.entries||[]).length;tx.append(el("div","o",(it.owner?"المسؤول: "+it.owner:"بدون مسؤول")+(n?" · "+AR(n)+" إضافة":"")));
    b.append(el("span","dot"),tx,el("span","bzChip "+st[1],st[0]));b.onclick=()=>sheet(it.key);list.append(b);});
  body.append(list);
  try{window.dispatchEvent(new Event("bizrender"));}catch(e){}
}

async function save(key,mut){
  const id="it-"+key;const {data,error}=await window.sb.from("docs").select("data").eq("collection","biz").eq("id",id).maybeSingle();
  if(error)throw error;const d=(data&&data.data)||{};mut(d);d.updatedAt=new Date().toISOString();d.updatedBy=(S.me&&S.me.name)||"";
  const r=await window.sb.from("docs").upsert({collection:"biz",id,data:d},{onConflict:"collection,id"});if(r.error)throw r.error;
  const i=S.items.findIndex(x=>x.key===key);if(i>=0)S.items[i]=d;return d;
}

function sheet(key){
  const it=S.items.find(x=>x.key===key);if(!it)return;
  document.querySelectorAll(".bzOv").forEach(e=>e.remove());
  const ov=el("div","bzOv");const sh=el("div","bzSh");sh.setAttribute("role","dialog");sh.setAttribute("aria-label",it.title);ov.append(sh);
  const close=()=>{ov.remove();render();};ov.addEventListener("click",e=>{if(e.target===ov)close();});
  const draw=()=>{const cur=S.items.find(x=>x.key===key)||it;sh.replaceChildren();
    const h=el("div","bzShH");h.append(el("h2","",cur.title));const x=el("button","bzX","✕");x.type="button";x.setAttribute("aria-label","إغلاق");x.onclick=close;h.append(x);sh.append(h);
    sh.append(el("div","bzWhy",cur.why||""));
    const meta=el("div","bzMeta");meta.append(el("span","","الـRFP: "+(cur.rfp||"—")));meta.append(el("span","",(WAVES.find(w=>w[0]===cur.wave)||[0,""])[1]));if(cur.updatedAt)meta.append(el("span","","آخر تحديث "+fmtT(cur.updatedAt)+(cur.updatedBy?" · "+cur.updatedBy:"")));sh.append(meta);
    /* الحالة */
    sh.append(el("div","bzLbl","الحالة"));const seg=el("div","bzSeg");Object.entries(ST).forEach(([k,[l,c]])=>{const b=el("button",c+((cur.status||"missing")===k?" on":""),l);b.type="button";b.disabled=!canEdit();
      b.onclick=async()=>{try{await save(key,d=>{d.status=k;});draw();}catch(e){msg.textContent="ما انحفظ: "+(e.message||e);msg.className="bzMsg err";}};seg.append(b);});sh.append(seg);
    /* المسؤول */
    sh.append(el("div","bzLbl","المسؤول عن توفيره"));const own=el("input","bzIn");own.value=cur.owner||"";own.placeholder="اسم الزميل أو القسم";own.disabled=!canEdit();
    own.addEventListener("change",async()=>{try{await save(key,d=>{d.owner=own.value.trim();});msg.textContent="انحفظ المسؤول";msg.className="bzMsg";}catch(e){msg.textContent="ما انحفظ: "+(e.message||e);msg.className="bzMsg err";}});sh.append(own);
    /* إضافة */
    sh.append(el("div","bzLbl","أضف معلومة أو رابط أو ملف"));
    const ta=el("textarea","bzTa");ta.placeholder="اكتب المعلومة… (أرقام، توضيح، قرار)";const ln=el("input","bzIn ltr");ln.type="url";ln.placeholder="رابط (شيت، ملف، مستند) — اختياري";ln.style.marginTop="8px";
    const fi=el("input");fi.type="file";fi.hidden=true;const fname=el("span","bzFile","");const pick=el("button","bzBtn ghost","📎 ملف");pick.type="button";pick.onclick=()=>fi.click();
    fi.onchange=()=>{fname.textContent=fi.files&&fi.files[0]?fi.files[0].name:"";};
    const add=el("button","bzBtn","أضف");add.type="button";const row=el("div","bzRow");row.append(pick,fname,add);
    const msg=el("div","bzMsg","");
    add.onclick=async()=>{const t=ta.value.trim(),l=ln.value.trim(),f=fi.files&&fi.files[0];if(!t&&!l&&!f){msg.textContent="اكتب شي أو أرفق رابط أو ملف";msg.className="bzMsg err";return;}
      if(l&&!/^https?:\/\//i.test(l)){msg.textContent="الرابط لازم يبدأ بـ https://";msg.className="bzMsg err";return;}
      add.disabled=true;msg.textContent="أحفظ…";msg.className="bzMsg";
      try{let file=null;if(f){if(f.size>25*1024*1024)throw new Error("الملف أكبر من ٢٥ ميقا");const safe=f.name.replace(/[^\w.\-]+/g,"_").slice(-80)||"file";const path=key+"/"+Date.now()+"-"+safe;
          const up=await window.sb.storage.from("biz").upload(path,f,{upsert:false,contentType:f.type||"application/octet-stream"});if(up.error)throw up.error;file={path,name:f.name,size:f.size};}
        await save(key,d=>{d.entries=Array.isArray(d.entries)?d.entries:[];d.entries.push({id:Date.now().toString(36),at:new Date().toISOString(),by:(S.me&&S.me.name)||"",byId:(S.me&&S.me.id)||"",text:t,link:l,file});if(!d.status||d.status==="missing")d.status="partial";});
        draw();}catch(e){add.disabled=false;msg.textContent="ما انحفظ: "+(e.message||e);msg.className="bzMsg err";}};
    if(canEdit()){sh.append(ta,ln,row);}sh.append(msg);
    /* السجل */
    const ents=(cur.entries||[]).slice().reverse();sh.append(el("div","bzLbl","المضاف ("+AR(ents.length)+")"));const box=el("div","bzEnts");
    if(!ents.length)box.append(el("div","bzEmpty","ما انضاف شي للحين."));
    ents.forEach(en=>{const e=el("div","bzE");const hh=el("div","h");hh.append(el("span","",(en.by||"")+" · "+fmtT(en.at)));
      if(isBoss()){const dl=el("button","del","حذف");dl.type="button";dl.onclick=async()=>{if(!confirm("تحذف هالإضافة؟"))return;try{if(en.file&&en.file.path)await window.sb.storage.from("biz").remove([en.file.path]);await save(key,d=>{d.entries=(d.entries||[]).filter(z=>z.id!==en.id);});draw();}catch(er){msg.textContent="ما انحذف: "+(er.message||er);msg.className="bzMsg err";}};hh.append(dl);}
      e.append(hh);if(en.text)e.append(el("div","tx",en.text));
      if(en.link){const a=el("a","",en.link);a.href=en.link;a.target="_blank";a.rel="noopener noreferrer";e.append(a);}
      if(en.file&&en.file.path){const fb=el("button","f","📎 "+(en.file.name||"ملف"));fb.type="button";fb.onclick=async()=>{const w=window.open("","_blank");try{const r=await window.sb.storage.from("biz").createSignedUrl(en.file.path,600);if(r.error)throw r.error;if(w)w.location=r.data.signedUrl;else location.href=r.data.signedUrl;}catch(er){if(w)w.close();msg.textContent="ما انفتح الملف: "+(er.message||er);msg.className="bzMsg err";}};e.append(el("br"),fb);}
      box.append(e);});
    sh.append(box);};
  draw();document.body.append(ov);
}

async function init(){
  css();
  const wrap=await wait(()=>window.sb&&document.querySelector(".wrap"));if(!wrap)return;
  let user=null;for(let i=0;i<60&&!user;i++){try{const r=await window.sb.auth.getUser();user=r&&r.data&&r.data.user;}catch(e){}if(!user)await new Promise(r=>setTimeout(r,1000));}
  if(!user)return;
  const pr=await window.sb.from("profiles").select("id,name,role,email").eq("id",user.id).maybeSingle();
  S.me=pr.data||{id:user.id,email:user.email};S.role=(pr.data&&pr.data.role)||"";
  if(!canEdit())return;
  const sec=el("section","kpisec bizsec");sec.id="bizSec";sec.hidden=true;
  const hd=el("div","kpihead");hd.append(el("h1","","بيانات البزنس"));sec.append(hd);
  sec.append(el("p","bzHint","الأصل الأول للأجنتك: كل بند هنا يتعلم منه Rizq AI وRawan AI. ما نبني وكلاء جدد قبل ما توصل النسبة ٧٠٪."));
  const body=el("div");body.id="bizBody";body.append(el("div","bzEmpty","أحمّل…"));sec.append(body);
  const anchor=document.getElementById("shSec");if(anchor&&anchor.parentNode===wrap)anchor.after(sec);else wrap.append(sec);
  try{await load();sec.hidden=false;render();}catch(e){body.replaceChildren(el("div","bzMsg err","ما قدرت أحمّل بيانات البزنس: "+(e.message||e)));sec.hidden=false;}
  document.addEventListener("visibilitychange",async()=>{if(document.visibilityState==="visible"&&!document.querySelector(".bzOv")){try{await load();render();}catch(e){}}});
}
if(location.hash!=="#voice")init();
window.__biz={reload:async()=>{await load();render();},pct};
})();
