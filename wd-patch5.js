/* v5 · ١٧ أكتوبر: رسائل الزملاء مع Rizq AI ما تنعرض كمحادثة (لأبو راكان وروان ود. ناصر)؛ تبقى خلفية في ذاكرة الوكيل. الحذف يوم بيومه: أي رسالة قبل اليوم (توقيت الرياض) تنتقل لذاكرة الوكيل المختصرة (mem) وتنمسح من المحادثة. يتحمّل بعد wd-patch.js */
(function(){
  const P=window.__wdPatch;if(!P||!Array.isArray(P.app))return;
  window.__wdDay=()=>new Date(Math.floor((Date.now()+3*36e5)/864e5)*864e5-3*36e5).toISOString();
  window.__wdRoll=(b)=>{b=b||{};const c=window.__wdDay();let mem=Array.isArray(b.mem)?b.mem.slice():[];const entries=[],asked=[];
    (Array.isArray(b.entries)?b.entries:[]).forEach(e=>{if(String(e&&e.at||"")<c)mem.push({q:String(e.q||"").slice(0,200),a:String(e.a||"").slice(0,250),at:e.at});else entries.push(e);});
    (Array.isArray(b.asked)?b.asked:[]).forEach(e=>{if(String(e&&e.at||"")<c)mem.push({q:String(e.q||"").slice(0,200),a:"(استفسار عابر)",at:e.at});else asked.push(e);});
    return {...b,entries,asked,mem:mem.slice(-200)};};
  window.__wdHasOld=(b)=>{const c=window.__wdDay();return [...((b&&b.entries)||[]),...((b&&b.asked)||[])].some(e=>String(e&&e.at||"")<c);};
  P.app.push(
    ['$("aiInbox").hidden=false;','$("aiInbox").hidden=true;'],
    ['window.__ailog=sn.docs.map(d=>d.data()||{});','window.__ailog=sn.docs.map(d=>d.data()||{});if(!window.__ailogSwept){window.__ailogSwept=1;sn.docs.forEach(d=>{const b=d.data()||{};if(window.__wdHasOld(b)){try{Promise.resolve(db.collection("ailog").doc(d.id).set(window.__wdRoll(b))).catch(()=>{});}catch(e){}}});}'],
    ['let entries=(Array.isArray(b.entries)?b.entries:[]).filter(keepEntry);','let entries=(Array.isArray(b.entries)?b.entries:[]);'],
    ['await ref.set({by:uid,name:(me&&me.name)||$("rq-name").value||"زميل",pos:$("rq-pos").value||"",entries,asked});','await ref.set(window.__wdRoll({by:uid,name:(me&&me.name)||$("rq-name").value||"زميل",pos:$("rq-pos").value||"",entries,asked,mem:b.mem}));'],
    ['const es=(b&&Array.isArray(b.entries))?b.entries.filter(keepEntry):[];','if(b&&window.__wdHasOld(b)){try{Promise.resolve(db.collection("ailog").doc(uid).set(window.__wdRoll(b))).catch(()=>{});}catch(e){}}const __ds=window.__wdDay();const es=(b&&Array.isArray(b.entries))?b.entries.filter(keepEntry).filter(e=>String(e.at||"")>=__ds):[];'],
    ['"\\n\\nمحادثات الزملاء مع Rizq AI (لأبو راكان بس — محفوظة = أسئلة وردود انحفظت، استفسارات_مؤقتة = أسئلة عابرة انمسحت من عند الزميل):\\n"+JSON.stringify((window.__ailog||[]).map(b=>({الزميل:b.name||"زميل",المسمى:b.pos||"",محفوظة:(b.entries||[]).slice(-40)',
     '"\\n\\nمحادثات الزملاء مع Rizq AI (خلفية في ذاكرتك بس — ما تنعرض كمحادثة؛ لو سألك عنها أبو راكان أو روان أو د. ناصر جاوب منها: محفوظة = رسائل اليوم، ذاكرة = رسائل الأيام السابقة مختصرة، استفسارات_مؤقتة = أسئلة عابرة اليوم):\\n"+JSON.stringify((window.__ailog||[]).map(b=>({الزميل:b.name||"زميل",المسمى:b.pos||"",ذاكرة:(b.mem||[]).slice(-60).map(e=>({سؤال:e.q,رد:e.a,وقت:e.at})),محفوظة:(b.entries||[]).slice(-40)']
  );
})();
