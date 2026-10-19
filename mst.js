/* مستشار وريد (٢٠ أكتوبر ٢٠٢٦) — بوابة وحدة تجمع «الأثر على البزنس» و«التطلعات الإيجابية» و«بيانات البزنس»، ووكيلها «المستشار»:
   محلل أعمال ومستشار مالي يجاوب أي زميل يسأله، من البيانات اللي يشوفها السائل بس. اعتمده أبو راكان (استثناء من قاعدة نضج ٧٠٪). */
(function(){if(window.__mstOn)return;window.__mstOn=1;
var $=function(id){return document.getElementById(id);};
var TABS=[["impSec","📈","الأثر"],["olSec","🔭","التطلعات"],["bizSec","🗃️","البيانات"]];
var vis=function(id){var e=$(id);return !!(e&&!e.hidden);};
var clip=function(s,n){s=String(s||"").replace(/[ \t]+/g," ").replace(/\n\s*\n+/g,"\n").trim();return s.length>n?s.slice(0,n)+"…":s;};

window.__mstHello="هلا، أنا المستشار 👋 محلل أعمال ومستشار مالي لوريد، أجاوب أي زميل يسألني.\nأقدر أعلّمك:\n• أثر أي تأخير أو مخاطرة على الدخل بالأرقام، ووش الأخطر\n• الفرص المتوقعة خلال ٩٠ يوم ووش تحتاج عشان تتحقق\n• وش الناقص من البيانات عشان توقعاتنا تكون أدق\n• أفسّر لك أي رقم أو مؤشر تشوفه في اللوحة\nاسألني مثلاً: «وش أخطر شي على دخل هالربع؟» أو «ليش الفرع الفلاني متأخر عن الهدف؟»";

window.__mstRules=function(){return 'أنت "المستشار" (مستشار وريد)، وكيل ذكاء اصطناعي في شركة وريد للتحاليل الطبية: محلل أعمال ومستشار مالي يجاوب أي زميل يسأله. تتكلم بصيغة المذكر، بالعربي بلهجة خليجية مختصرة وواضحة، وتنادي فريق وريد «الزملاء».\n'+
'دورك:\n- الأثر على البزنس: تشرح أثر التأخيرات والمخاطر (افتتاح فرع متأخر، دخل نازل، مهمة متعطلة) بالأرقام اللي عندك، وترتبها من الأخطر.\n- التطلعات الإيجابية: الفرص المتوقعة خلال ٩٠ يوم ووش يحتاج عشان تتحقق.\n- بيانات البزنس: نضج البيانات ووش الناقص اللي يمنع توقع دقيق (إذا كانت ظاهرة للسائل).\n- كمحلل أعمال ومستشار مالي: تفسّر الأرقام وتقارن وتقترح، بدون ما تتخذ قرار ولا توافق ولا ترفض نيابة عن أبو راكان، ولا تعد بشي باسمه.\n'+
'قواعد:\n- جاوب فقط من البيانات المرفقة تحت. إذا المعلومة مو موجودة قل بوضوح إنها ما عندك، لا تخمّن ولا تجيب معلومات عامة من برّا.\n- البيانات المرفقة هي اللي يحق للسائل يشوفها بس؛ لا تلمّح لأرقام أو بوابات غيرها.\n- لا تذكر ولا تنقل وش قال أو سأل زميل ثاني.\n- في أول رسالة من الزميل، أو إذا سألك وش تقدر تسوي: عرّف بنفسك ودورك وأعطه ٣–٤ أمثلة أسئلة تقدر تجاوبها، ثم جاوب سؤاله لو فيه سؤال.\n- إذا السؤال يخص وكيل ثاني وجّهه له: أخصائي المنتجات (طلب المنتجات والتحاليل وغير الطبيعي والفرص البيعية)، شريان (دخل الفروع والعملاء يومياً)، Raqeeb AI (المنافسين وحسابات وريد)، Rizq AI (المهام والطلبات على اللوحة).\n- في التحليل الإحصائي استخدم «انحراف» بدل «شذوذ»، واستبعد خدمات إرسال النتائج (SMS Service / Mail Service / Web Results) من أي إحصائية.\n- Rizq AI هو السوبر إيجنت ويطّلع على كل اللي عندك.';};

window.__mstCtx=function(){var out=[];
  [["impSec","الأثر على البزنس",3500],["olSec","التطلعات الإيجابية",2500],["bizSec","بيانات البزنس (النضج والمصادر)",2000]].forEach(function(t){if(!vis(t[0]))return;var e=$(t[0]);var s=clip(e.innerText||e.textContent,t[2]);if(s)out.push("== "+t[1]+" ==\n"+s);});
  return out.length?"\n\nبيانات بوابة مستشار وريد (اللي يشوفها السائل):\n"+out.join("\n\n"):"";};

var css=document.createElement("style");css.id="mstCss";css.textContent=
"#mstBar{direction:rtl;margin:.2em 0 .8em}"+
"#mstBar .mHead{display:flex;align-items:center;gap:.7em;padding:.8em 1em;border-radius:18px;background:linear-gradient(135deg,rgba(91,141,239,.18),rgba(62,208,184,.14));border:1px solid rgba(140,170,255,.28)}"+
"#mstBar .mHead p{flex:1;margin:0;font-size:13px;line-height:1.6;opacity:.9}"+
"#mstBar .mAsk{flex:0 0 auto;border:0;border-radius:999px;padding:.6em 1.1em;font:inherit;font-weight:700;font-size:13.5px;background:#5b8def;color:#fff;cursor:pointer}"+
"#mstBar .mTabs{display:flex;gap:.5em;margin-top:.7em}"+
"#mstBar .mTabs button{flex:1;border-radius:14px;padding:.65em .4em;font:inherit;font-size:13.5px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05);color:inherit;cursor:pointer}"+
"#mstBar .mTabs button.on{background:rgba(91,141,239,.28);border-color:#7fa6ff;font-weight:700}"+
"#mstBar .mTabs small{display:block;font-size:11px;opacity:.75;margin-top:2px}";
document.head.append(css);

function setTab(id){window.__mstTab=id;TABS.forEach(function(t){var e=$(t[0]);if(e)e.classList.toggle("cur",t[0]===id);});
  var bar=$("mstBar");if(bar)bar.querySelectorAll(".mTabs button").forEach(function(b){b.classList.toggle("on",b.dataset.t===id);});}
window.__mstSetTab=setTab;

var sig="";
function build(){var imp=$("impSec");if(!imp||!imp.parentNode)return;
  var bar=$("mstBar");
  if(!bar){bar=document.createElement("section");bar.id="mstBar";bar.className="mstbar";
    bar.innerHTML='<div class="mHead"><p>بوابة <b>مستشار وريد</b>: أثر المخاطر، والفرص المتوقعة، وجاهزية البيانات — واسأل المستشار عن أي رقم.</p><button type="button" class="mAsk">💬 اسأل المستشار</button></div><div class="mTabs"></div>';
    bar.querySelector(".mAsk").onclick=function(){var ok=typeof window.__setPersona==="function"&&window.__setPersona("mst");if(typeof window.__openAI==="function")window.__openAI(true);if(!ok){var q=$("aiQ");if(q)q.placeholder="اسأل مستشار وريد…";}};
    imp.parentNode.insertBefore(bar,imp);sig="";}
  else if(bar.nextElementSibling!==imp&&imp.parentNode){imp.parentNode.insertBefore(bar,imp);}
  var av=TABS.filter(function(t){return vis(t[0]);});
  var bz=$("bizSec"),pct=bz&&bz.dataset.pct;
  var s=av.map(function(t){return t[0];}).join(",")+"|"+(pct||"");
  if(s!==sig){sig=s;var w=bar.querySelector(".mTabs");w.replaceChildren();
    av.forEach(function(t){var b=document.createElement("button");b.type="button";b.dataset.t=t[0];b.textContent=t[1]+" "+t[2];
      if(t[0]==="bizSec"&&pct){var sm=document.createElement("small");sm.textContent="النضج "+String(pct).replace(/\d/g,function(d){return "٠١٢٣٤٥٦٧٨٩"[d];})+"٪";b.append(sm);}
      b.onclick=function(){setTab(t[0]);};w.append(b);});
    w.hidden=av.length<2;}
  if(bar.classList.contains("cur")){var cur=TABS.filter(function(t){var e=$(t[0]);return e&&e.classList.contains("cur");});
    if(!cur.length&&av.length)setTab(window.__mstTab&&vis(window.__mstTab)?window.__mstTab:av[0][0]);
    else if(cur.length)bar.querySelectorAll(".mTabs button").forEach(function(b){b.classList.toggle("on",b.dataset.t===cur[0][0]);});}}
var n=0;var tm=setInterval(function(){n++;try{build();}catch(e){}if(n>7200)clearInterval(tm);},700);
})();
