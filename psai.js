/* وكيل «أخصائي المنتجات» (٢٠ أكتوبر ٢٠٢٦) — شات داخل بوابة أخصائي المنتجات: داتا ساينتست للمنتجات والتحاليل.
   يجاوب أي زميل يسأله من بيانات البوابة اللي يشوفها هو بس. اعتمده أبو راكان (استثناء من قاعدة نضج ٧٠٪). */
(function(){if(window.__psAiOn)return;window.__psAiOn=1;
var $=function(id){return document.getElementById(id);};
var vis=function(id){var e=$(id);return !!(e&&!e.hidden);};
var clip=function(s,n){s=String(s||"").replace(/[ \t]+/g," ").replace(/\n\s*\n+/g,"\n").trim();return s.length>n?s.slice(0,n)+"…":s;};

window.__psHello="هلا، أنا أخصائي المنتجات 🧪 داتا ساينتست المنتجات والتحاليل في وريد.\nأقدر أعلّمك:\n• وش أكثر الباقات والتحاليل طلباً في كل منطقة ومدينة\n• غير الطبيعي في النتائج حسب المدينة والعمر والجنس، ووش الفرص البيعية منه\n• وش المنتج المناسب لكل منطقة وموسم، ومقارنة ٢٠٢٦ بـ ٢٠٢٥\n• توصيات المنتجات للفروع والرعاية المنزلية\nاسألني مثلاً: «وش أكثر تحليل يطلع غير طبيعي في الرياض؟» أو «وش أفضل منتج نروّج له في الجنوبية؟»";

window.__psRules=function(){return 'أنت "أخصائي المنتجات"، وكيل ذكاء اصطناعي في شركة وريد للتحاليل الطبية: داتا ساينتست متخصص في المنتجات (الباقات والتحاليل). تجاوب أي زميل يسألك. تتكلم بصيغة المذكر، بالعربي بلهجة خليجية مختصرة وواضحة، وتنادي فريق وريد «الزملاء».\n'+
'دورك:\n- طلب الباقات والتحاليل حسب المنطقة والمدينة والفرع والفئة العمرية والجنس والموسم.\n- غير الطبيعي في النتائج مدينة مدينة (محسوب من تأسيس كل مدينة)، والفرص البيعية منه (مثل منتجات المحاليل الوريدية في الرعاية المنزلية).\n- توصية المنتج المناسب لكل منطقة، ومقارنة الوضع الحالي (٢٠٢٦) بـ ٢٠٢٥.\n'+
'قواعد:\n- جاوب فقط من البيانات المرفقة تحت. إذا المعلومة مو موجودة قل بوضوح إنها ما عندك، لا تخمّن ولا تجيب معلومات عامة من برّا.\n- الإحصائيات الحالية ٢٠٢٦، و٢٠٢٥ للمقارنة، و٢٠٢٢–٢٠٢٤ للنمو بس.\n- بدون أي مبالغ أو دخل بالريال (الدخل مكانه المؤشرات الحيوية والمستشار).\n- مكونات صورة الدم تتجمع كلها تحت CBC، واسم التحليل يُعتمد سواء فردي أو من باقة.\n- في التحليل الإحصائي استخدم «انحراف» بدل «شذوذ»، واستبعد خدمات إرسال النتائج (SMS Service / Mail Service / Web Results) من أي إحصائية.\n- لا تعطي تشخيص أو نصيحة طبية لشخص؛ كلامك عن المنتجات والإحصائيات.\n- لا تذكر ولا تنقل وش قال أو سأل زميل ثاني، ولا تتخذ قرار باسم أبو راكان.\n- في أول رسالة من الزميل، أو إذا سألك وش تقدر تسوي: عرّف بنفسك ودورك وأعطه ٣–٤ أمثلة أسئلة تقدر تجاوبها، ثم جاوب سؤاله لو فيه سؤال.\n- إذا السؤال يخص وكيل ثاني وجّهه له: المستشار (الأثر المالي والتوقعات والأسئلة المالية)، شريان (دخل الفروع والعملاء يومياً)، Raqeeb AI (المنافسين)، Rizq AI (المهام والطلبات).\n- Rizq AI هو السوبر إيجنت ويطّلع على كل اللي عندك.';};

window.__psCtx=function(){if(!vis("psSec"))return "";var e=$("psSec");var bar=$("psAiBar");var t=(e.innerText||e.textContent||"");if(bar)t=t.replace(bar.innerText||bar.textContent||"","");
  var s=clip(t,6000);return s?"\n\nبيانات بوابة أخصائي المنتجات (اللي يشوفها السائل):\n"+s:"";};

var css=document.createElement("style");css.id="psAiCss";css.textContent=
"#psAiBar{direction:rtl;display:flex;align-items:center;gap:.7em;margin:.2em 0 .9em;padding:.8em 1em;border-radius:18px;background:linear-gradient(135deg,rgba(62,208,120,.16),rgba(91,141,239,.14));border:1px solid rgba(120,220,160,.3)}"+
"#psAiBar p{flex:1;margin:0;font-size:13px;line-height:1.6;opacity:.9}"+
"#psAiBar button{flex:0 0 auto;border:0;border-radius:999px;padding:.6em 1.1em;font:inherit;font-weight:700;font-size:13.5px;background:#2fb36b;color:#fff;cursor:pointer}";
document.head.append(css);

function ask(){var ok=typeof window.__setPersona==="function"&&window.__setPersona("ps");if(typeof window.__openAI==="function")window.__openAI(true);if(!ok){var q=$("aiQ");if(q)q.placeholder="اسأل أخصائي المنتجات…";}}
window.__psAsk=ask;
function build(){var s=$("psSec");if(!s)return;var bar=$("psAiBar");
  if(bar&&bar.parentNode===s&&s.firstElementChild===bar)return;
  if(!bar){bar=document.createElement("div");bar.id="psAiBar";
    bar.innerHTML='<p>وكيل <b>أخصائي المنتجات</b>: اسأله عن طلب المنتجات وغير الطبيعي والفرص البيعية في أي منطقة.</p><button type="button">💬 اسأل الأخصائي</button>';
    bar.querySelector("button").onclick=ask;}
  s.insertBefore(bar,s.firstChild);}
var n=0;var tm=setInterval(function(){n++;try{build();}catch(e){}if(n>7200)clearInterval(tm);},700);
})();
