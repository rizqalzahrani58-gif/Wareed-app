/* مناقشة وتعليم الوكلاء لعبدالرحمن — مدير التسويق (قرار أبو راكان ٢٠ أكتوبر ٢٠٢٦)
   يناقش ويعلّم كل الوكلاء ما عدا Rizq AI وRawan AI: المستشار، أخصائي المنتجات، شريان، Raqeeb AI.
   - يكتب توجيه أو سؤال ← يجاوبونه بالترتيب (أو وكيل واحد يختاره) ويبنون على أجوبة بعض.
   - المحادثة كاملة: council/onboard-abdulrahman-dir-<اليوم> (له، وأبو راكان وروان يقرونها).
   - الدرس (كلامه هو بس بدون ردود الوكلاء): council/lesson-abdulrahman — ينحقن في الوكلاء الأربعة عند كل الزملاء، وما يوصل Rizq AI ولا Rawan AI.
   الدخول من «مجلس الوكلاء» في منصة الوكلاء. */
(function(){"use strict";if(window.__teachLoaded)return;window.__teachLoaded=true;
const AGS=[["mst","المستشار","#7aa8ff"],["ps","أخصائي المنتجات","#56d6a8"],["shiryan","شريان","#ff6b8a"],["raqeeb","Raqeeb AI","#ffb547"]];
const NM=Object.fromEntries(AGS.map(a=>[a[0],a[1]]));
const FROM="عبدالرحمن";
const day=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Riyadh",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const AR=s=>String(s).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const MON=["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const dLabel=s=>{const m=String(s||"").match(/(\d{4})-(\d{2})-(\d{2})/);return m?AR(+m[3])+" "+MON[+m[2]-1]:"";};
const tm=t=>{try{return new Intl.DateTimeFormat("ar-SA",{timeZone:"Asia/Riyadh",hour:"numeric",minute:"2-digit"}).format(new Date(t));}catch(e){return"";}};
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=String(txt);return e;};
const S={on:false,docs:[],target:"all",busy:false,built:false};

async function sess(){try{const r=await window.sb.auth.getSession();return r&&r.data&&r.data.session;}catch(e){return null;}}
async function allowed(){const s=await sess();const em=String((s&&s.user&&s.user.email)||"").toLowerCase();return em==="abdulrahman@wareed.com.sa";}

function css(){if(document.getElementById("tchCss"))return;const s=el("style");s.id="tchCss";s.textContent=`
#tchWin{position:fixed;inset:0;z-index:2147483000;display:none;flex-direction:column;background:#0f1320;color:#eef2ff;direction:rtl;font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif;height:100dvh}
#tchWin.on{display:flex}#tchWin *{box-sizing:border-box}
#tchWin .tTop{display:flex;align-items:center;gap:10px;padding:calc(env(safe-area-inset-top) + 10px) 16px 10px;border-bottom:1px solid #232a3b;background:#121726}
#tchWin .tTop b{display:block;font-family:"Readex Pro",system-ui;font-size:1.02em;font-weight:600}
#tchWin .tTop small{display:block;color:#8f98ad;font-size:.76em;margin-top:2px}
#tchWin .tTop .x{margin-inline-start:auto;background:#1e2433;border:1px solid #2b3347;color:#eef2ff;border-radius:12px;width:38px;height:38px;font-size:1em;cursor:pointer}
#tchWin .tChips{display:flex;gap:6px;overflow-x:auto;padding:10px 16px;scrollbar-width:none;border-bottom:1px solid #1c2232}
#tchWin .tChips::-webkit-scrollbar{display:none}
#tchWin .tChip{flex:0 0 auto;border:1px solid #2b3347;background:#171c2a;color:#c9d0de;border-radius:999px;padding:6px 12px;font:inherit;font-size:.84em;cursor:pointer}
#tchWin .tChip.on{background:var(--c,#3ed0b8);border-color:transparent;color:#0b0f19;font-weight:600}
#tchWin .tLog{flex:1;overflow-y:auto;padding:14px 16px 8px;-webkit-overflow-scrolling:touch}
#tchWin .tDay{text-align:center;color:#8f98ad;font-size:.76em;margin:10px 0}
#tchWin .tMsg{max-width:88%;margin:0 0 10px;padding:10px 12px;border-radius:16px;line-height:1.65;font-size:.93em;white-space:pre-wrap;word-break:break-word}
#tchWin .tMsg.me{margin-inline-start:auto;background:#2a3b6b;border-bottom-left-radius:6px}
#tchWin .tMsg.ag{background:#181e2d;border:1px solid #242c3f;border-bottom-right-radius:6px}
#tchWin .tMsg .w{display:flex;align-items:center;gap:6px;font-size:.78em;font-weight:600;margin-bottom:4px;color:var(--c,#c9d0de)}
#tchWin .tMsg .w i{width:8px;height:8px;border-radius:50%;background:var(--c,#c9d0de)}
#tchWin .tMsg .t{font-size:.72em;color:#8f98ad;margin-top:4px}
#tchWin .tMsg.wait .b{opacity:.6}
#tchWin .tEmpty{color:#8f98ad;font-size:.88em;line-height:1.8;padding:18px 4px}
#tchWin form{display:flex;align-items:flex-end;gap:8px;padding:10px 12px calc(env(safe-area-inset-bottom) + 10px);border-top:1px solid #232a3b;background:#121726}
#tchWin textarea{flex:1;resize:none;max-height:120px;min-height:44px;background:#1a2030;color:#eef2ff;border:1px solid #2b3347;border-radius:14px;padding:11px 12px;font:inherit;font-size:16px;line-height:1.4}
#tchWin form button{flex:0 0 44px;height:44px;border-radius:50%;border:0;background:#3ed0b8;color:#0b0f19;font-size:1.15em;font-weight:700;cursor:pointer}
#tchWin form button:disabled{opacity:.45}
`;document.head.append(s);}

function build(){if(S.built)return;S.built=true;css();
  const w=el("div");w.id="tchWin";w.setAttribute("role","dialog");w.setAttribute("aria-label","مناقشة وتعليم الوكلاء");
  const top=el("div","tTop");const tt=el("div");tt.append(el("b","","مجلس الوكلاء · مناقشة وتعليم"),el("small","","المستشار، أخصائي المنتجات، شريان، Raqeeb AI · كل توجيه منك ينحفظ درس عندهم"));
  const x=el("button","x","✕");x.type="button";x.setAttribute("aria-label","إغلاق");x.onclick=close;top.append(tt,x);
  const chips=el("div","tChips");[["all","الكل","#3ed0b8"],...AGS].forEach(([k,n,c])=>{const b=el("button","tChip"+(k===S.target?" on":""),n);b.type="button";b.style.setProperty("--c",c);b.dataset.k=k;
    b.onclick=()=>{S.target=k;chips.querySelectorAll(".tChip").forEach(z=>z.classList.toggle("on",z.dataset.k===k));ta.placeholder=k==="all"?"ناقش أو علّم الوكلاء الأربعة…":"ناقش أو علّم "+NM[k]+"…";};chips.append(b);});
  const log=el("div","tLog");
  const fm=el("form");const ta=el("textarea");ta.rows=1;ta.placeholder="ناقش أو علّم الوكلاء الأربعة…";ta.setAttribute("enterkeyhint","send");
  const sb=el("button","","↑");sb.type="submit";sb.setAttribute("aria-label","إرسال");fm.append(ta,sb);
  ta.addEventListener("input",()=>{ta.style.height="auto";ta.style.height=Math.min(120,ta.scrollHeight)+"px";});
  ta.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&!/iPhone|iPad|Android/i.test(navigator.userAgent)){e.preventDefault();fm.requestSubmit();}});
  fm.addEventListener("submit",e=>{e.preventDefault();send(ta,sb);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&w.classList.contains("on"))close();});
  w.append(top,chips,log,fm);document.body.append(w);S.win=w;S.log=log;
}
const bottom=()=>{const l=S.log;if(l)requestAnimationFrame(()=>{l.scrollTop=l.scrollHeight;});};
const colorOf=n=>{const a=AGS.find(z=>z[1]===n);return a?a[2]:"#c9d0de";};
function bubble(m){const me=m.who===FROM;const b=el("div","tMsg "+(me?"me":"ag")+(m.wait?" wait":""));
  if(!me){const w=el("div","w");w.style.setProperty("--c",colorOf(m.who));w.append(el("i"),document.createTextNode(m.who));b.append(w);}
  else if(m.to&&m.to!=="all"){const w=el("div","w");w.style.setProperty("--c","#cfe0ff");w.textContent="إلى "+(NM[m.to]||"");b.append(w);}
  b.append(el("div","b",m.text));if(m.at&&!m.wait)b.append(el("div","t",tm(m.at)));return b;}
function render(){const l=S.log;if(!l)return;l.innerHTML="";
  const all=S.docs.slice().sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  if(!all.some(d=>(d.turns||[]).length)){l.append(el("div","tEmpty","هنا تناقش الوكلاء الأربعة وتعلّمهم مع بعض: اكتب معلومة تسويقية تبيهم يعرفونها (حملة، قناة، عرض، منتج…) أو اسألهم سؤال، ويجاوبونك واحد ورا الثاني ويبنون على كلام بعض.\nتقدر تختار وكيل واحد من فوق. كل اللي تكتبه ينحفظ درس يطبّقونه في شغلهم مع كل الزملاء."));return;}
  all.forEach(d=>{if(!(d.turns||[]).length)return;l.append(el("div","tDay",d.date===day()?"اليوم":dLabel(d.date)));(d.turns||[]).forEach(m=>l.append(bubble(m)));});bottom();}
async function load(){try{const {data}=await window.sb.from("docs").select("id,data").eq("collection","council").like("id","onboard-abdulrahman-dir-%").order("id",{ascending:false}).limit(4);
  S.docs=(data||[]).map(r=>Object.assign({id:r.id},r.data||{}));}catch(e){S.docs=S.docs||[];}
  render();}
function todayDoc(){const id="onboard-abdulrahman-dir-"+day();let d=S.docs.find(x=>x.id===id);if(!d){d={id,date:day(),room:"classroom",agent:"abdulrahman-teach",title:"مناقشة وتعليم عبدالرحمن (التسويق) · "+dLabel(day()),turns:[]};S.docs.unshift(d);}return d;}
async function saveDoc(d){const data=Object.assign({},d);delete data.id;data.turns=(data.turns||[]).filter(m=>!m.wait).slice(-120);data.updatedAt=new Date().toISOString();
  const r=await window.sb.from("docs").upsert({collection:"council",id:d.id,data},{onConflict:"collection,id"});if(r.error)throw r.error;}
async function saveLesson(line){try{const {data}=await window.sb.from("docs").select("data").eq("collection","council").eq("id","lesson-abdulrahman").maybeSingle();
  const cur=(data&&data.data&&data.data.lesson&&data.data.lesson.content)||"";const content=((cur?cur+"\n":"")+line).slice(-6000);
  await window.sb.from("docs").upsert({collection:"council",id:"lesson-abdulrahman",data:{lesson:{title:"دروس عبدالرحمن (مدير التسويق) للوكلاء",by:"عبدالرحمن",to:AGS.map(a=>a[0]),at:new Date().toISOString(),content}}},{onConflict:"collection,id"});
  try{window.__clsRefresh&&window.__clsRefresh();}catch(e){}}catch(e){}}

async function send(ta,sb){const t=ta.value.trim();if(!t||S.busy)return;if(typeof window.__agentAsk!=="function")return;
  S.busy=true;sb.disabled=true;ta.value="";ta.style.height="auto";
  const d=todayDoc();const target=S.target;const order=target==="all"?AGS.map(a=>a[0]):[target];
  d.turns.push({who:FROM,to:target,text:t,at:new Date().toISOString()});render();
  try{await saveDoc(d);}catch(e){}
  const got=[];
  for(const k of order){const m={who:NM[k],text:"يفكّر…",wait:true};d.turns.push(m);render();
    const prev=got.length?{who:"",text:got.map(g=>g.who+": "+g.text.slice(0,700)).join("\n\n")}:null;let a="";
    try{a=String(await window.__agentAsk(k,t,prev)||"").trim();}catch(e){a="";}
    m.text=a||"ما قدرت أجاوب الحين. جرّب مرة ثانية.";m.at=new Date().toISOString();delete m.wait;if(a)got.push({who:NM[k],text:a});render();}
  try{await saveDoc(d);}catch(e){}
  await saveLesson("• عبدالرحمن (مدير التسويق) → "+(target==="all"?"كل الوكلاء":NM[target])+" · "+day()+": "+t.slice(0,600));
  S.busy=false;sb.disabled=false;bottom();}

function open(){build();S.win.classList.add("on");document.documentElement.style.overflow="hidden";load();}
function close(){if(S.win)S.win.classList.remove("on");document.documentElement.style.overflow="";}

async function init(){if(!window.sb||!window.sb.auth){setTimeout(init,700);return;}
  if(!(await allowed()))return;
  window.__teachOn=true;window.__teachOpen=open;}
setTimeout(init,1200);
})();
