/* وريد · ذاكرة Rawan AI: روان تغذي وكيلتها بأي معلومة (نص طويل، ملف نصي، صورة عبر المحادثة) · v1
   - أداة teach_rawan لـ Rawan AI تحفظ المعلومة كاملة في rawanmem.kb
   - كل المعلومات تدخل سياق Rawan AI (الأحدث أولاً، بحد ٤٠ ألف حرف)
   - دايرة «ذاكرة Rawan AI» لروان وأبو راكان: تضيف، تعدّل، تحذف، وترفع ملف نصي
   - إصلاح: remember_private كان يمسح أسئلة Rizq AI المعلقة لما يحفظ ملاحظة */
(function(){
  const RID = 'u_ljAyXyu3KmVFdNx2ZkPf3w';
  const BUDGET = 40000;

  /* ---------- سياق Rawan AI ---------- */
  window.__rkbCtx = function(kb){
    try{
      const items = (Array.isArray(kb) ? kb : []).slice().reverse();
      if(!items.length) return '';
      let used = 0; const full = [], rest = [];
      for(const k of items){
        const c = String(k.content || '');
        if(used + c.length <= BUDGET){ used += c.length; full.push({ id: k.id, العنوان: k.title || undefined, الموضوع: k.topic || undefined, المحتوى: c, التاريخ: String(k.at || '').slice(0, 10), من: k.by || undefined }); }
        else rest.push({ id: k.id, العنوان: k.title || '', التاريخ: String(k.at || '').slice(0, 10) });
      }
      return '\n\nمعلومات علّمتها روان لـ Rawan AI (مرجعك الأساسي، اعتمدي عليها بالحرف؛ ما تطلع لأي أحد غير روان وأبو راكان):\n' + JSON.stringify(full) +
        (rest.length ? '\nمعلومات أقدم محفوظة بس ما انعرض محتواها هنا لطولها (اذكري لروان عناوينها إذا سألت):\n' + JSON.stringify(rest) : '');
    }catch(e){ return ''; }
  };

  /* ---------- تعديلات app.js وقت التحميل ---------- */
  const TOOL = '{name:"teach_rawan",description:"يحفظ معلومة أو مرجع تعلّمه روان لـ Rawan AI بالكامل وبدون اختصار: نص طويل، إجراءات، أرقام، معلومات عن زملاء أو موردين أو عملاء أو فروع، محتوى ملف أو صورة. استخدميه كل ما قالت روان احفظي أو تعلّمي أو خذي هالمعلومة أو هذي معلومة لك. لتحديث معلومة محفوظة مرري replace_id.",' +
    'inputSchema:{type:"object",properties:{title:{type:"string",description:"عنوان قصير للمعلومة"},content:{type:"string",description:"المعلومة كاملة بكلام روان أو نص الملف/الصورة كامل"},topic:{type:"string",description:"الموضوع، مثل: زملاء، موردين، إجراءات، أبو راكان"},replace_id:{type:"string",description:"id معلومة محفوظة تبين تستبدلينها (اختياري)"}},required:["title","content"]},' +
    'execute:async(i)=>{const c=String(i.content||"").trim().slice(0,12000);if(!c)throw new Error("المعلومة فاضية");const ref=db.collection("rawanmem").doc(rawanDocId);const cur=await ref.get();const d=cur.exists?cur.data():{};let kb=Array.isArray(d.kb)?d.kb.slice():[];' +
    'const it={id:"k"+Date.now(),title:String(i.title||"").slice(0,120),content:c,topic:String(i.topic||"").slice(0,40),at:new Date().toISOString(),by:isOwner?"أبو راكان":"روان"};' +
    'const x=i.replace_id?kb.findIndex(k=>k.id===String(i.replace_id)):-1;if(x>=0){it.id=kb[x].id;kb[x]=it;}else kb.push(it);kb=kb.slice(-300);' +
    'await ref.set({...d,by:rawanDocId,kb,updatedAt:new Date().toISOString()});rawanCtx.kb=kb;return{ok:true,id:it.id,count:kb.length};}},';

  const RULE = '- روان تقدر تغذيك بأي معلومة تبيها، بأي طول: تكتبها، أو تلصق نص، أو ترسل صورة أو لقطة شاشة. احفظيها كاملة بأداة teach_rawan (عنوان + المحتوى كامل بدون اختصار، ولو صورة انسخي كل اللي فيها نص)، وأكدي لها بسطر وش حفظتي. المعلومات المحفوظة تلقينها في بيانات اللوحة تحت "معلومات علّمتها روان"، اعتمدي عليها وقدميها على أي مصدر ثاني، ولو تعارضت مع معلومة أحدث منها اسألي روان أي وحدة الصح وحدّثيها بـ replace_id.\n- تحفظين ملاحظاتها الخاصة بأداة remember_private';

  const P = window.__wdPatch = window.__wdPatch || {};
  P.app = (P.app || []).concat([
    ['rawanCtx.ask=(d&&Array.isArray(d.askRawan))?d.askRawan:[];', 'rawanCtx.ask=(d&&Array.isArray(d.askRawan))?d.askRawan:[];rawanCtx.kb=(d&&Array.isArray(d.kb))?d.kb:[];'],
    ['await ref.set({by:rawanDocId,notes,updatedAt:new Date().toISOString()});', 'await ref.set({...d,by:rawanDocId,notes,updatedAt:new Date().toISOString()});'],
    ['return base.concat([', 'return base.concat([' + TOOL],
    ['function rawanExtra(){', 'function rawanExtra(){return rawanExtra0()+(window.__rkbCtx?window.__rkbCtx(rawanCtx.kb):"");}function rawanExtra0(){'],
    ['- تحفظين ملاحظاتها الخاصة بأداة remember_private', RULE]
  ]);

  /* ---------- الواجهة: دايرة «ذاكرة Rawan AI» ---------- */
  const css = '#rkbSheet{position:fixed;inset:0;z-index:900;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55);font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif;color:#f3f5f9}' +
    '#rkbSheet[hidden]{display:none!important}#rkbSheet .rb{width:100%;max-width:40em;max-height:92vh;overflow:auto;background:#161a23;border:1px solid #272d3a;border-radius:22px 22px 0 0;padding:1.1em 1em calc(1.2em + env(safe-area-inset-bottom,0px));box-sizing:border-box}' +
    '#rkbSheet h3{margin:0 0 .2em;font-size:1.15em}#rkbSheet .sub{margin:0 0 .9em;color:#8f98ad;font-size:.88em;line-height:1.6}' +
    '#rkbSheet input,#rkbSheet textarea{font:inherit;width:100%;box-sizing:border-box;background:#1e2330;color:#f3f5f9;border:1px solid #272d3a;border-radius:12px;padding:.65em .8em;margin-bottom:.55em}#rkbSheet textarea{min-height:8em;resize:vertical;line-height:1.6}' +
    '#rkbSheet .row{display:flex;gap:.5em;flex-wrap:wrap;align-items:center;margin-bottom:.8em}#rkbSheet button{font:inherit;border:0;border-radius:12px;padding:.6em 1.1em;cursor:pointer;background:#272d3a;color:#f3f5f9}#rkbSheet button.pri{background:#a78bfa;color:#140f24;font-weight:600}#rkbSheet button:disabled{opacity:.5}' +
    '#rkbSheet .it{border:1px solid #272d3a;border-radius:14px;padding:.7em .8em;margin-bottom:.55em;background:#1a1f2a}#rkbSheet .it b{display:block;margin-bottom:.25em}#rkbSheet .it .m{color:#8f98ad;font-size:.78em;margin-bottom:.35em}#rkbSheet .it p{margin:0;white-space:pre-wrap;line-height:1.6;font-size:.9em;max-height:9em;overflow:auto}' +
    '#rkbSheet .it .act{display:flex;gap:.4em;margin-top:.5em}#rkbSheet .it .act button{padding:.35em .8em;font-size:.82em}#rkbSheet .msg{color:#c4b5fd;font-size:.85em;min-height:1.2em;margin:0 0 .6em}#rkbSheet .x{float:left;background:transparent;font-size:1.3em;padding:0 .3em}';
  const st = document.createElement('style'); st.textContent = css; document.head.append(st);

  const $ = id => document.getElementById(id);
  const allowed = () => { const b = document.body.dataset; return !b.nasser && (b.role === 'owner' || b.role === 'trusted' || !!b.rawan); };
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  let editId = null, cache = [];

  async function readDoc(){ const { data, error } = await window.sb.from('docs').select('data').eq('collection', 'rawanmem').eq('id', RID).maybeSingle(); if(error) throw error; return (data && data.data) || {}; }
  async function writeKb(fn){ const d = await readDoc(); const kb = fn(Array.isArray(d.kb) ? d.kb.slice() : []).slice(-300); const { error } = await window.sb.from('docs').upsert({ collection: 'rawanmem', id: RID, data: { ...d, by: RID, kb, updatedAt: new Date().toISOString() } }, { onConflict: 'collection,id' }); if(error) throw error; cache = kb; return kb; }

  function el(t, a, ...k){ const e = document.createElement(t); if(a) for(const x in a){ if(x === 'class') e.className = a[x]; else if(x.startsWith('on')) e[x] = a[x]; else e.setAttribute(x, a[x]); } k.forEach(c => c != null && e.append(c)); return e; }

  function build(){
    if($('rkbSheet')) return;
    const s = el('div', { id: 'rkbSheet', hidden: '' });
    s.addEventListener('click', e => { if(e.target === s) s.hidden = true; });
    const fi = el('input', { type: 'file', accept: '.txt,.md,.csv,.json,text/plain', hidden: '' });
    fi.onchange = () => { const f = fi.files && fi.files[0]; if(!f) return; const r = new FileReader(); r.onload = () => { $('rkbC').value = String(r.result || '').slice(0, 20000); if(!$('rkbT').value) $('rkbT').value = f.name.replace(/\.[^.]+$/, ''); msg('انقرأ الملف، راجعيه واضغطي حفظ.'); }; r.readAsText(f); fi.value = ''; };
    s.append(el('div', { class: 'rb' },
      el('button', { type: 'button', class: 'x', 'aria-label': 'إغلاق', onclick: () => { s.hidden = true; } }, '×'),
      el('h3', {}, 'ذاكرة Rawan AI'),
      el('p', { class: 'sub' }, 'اكتبي أو الصقي أي معلومة تبين Rawan AI تعرفها، أو ارفعي ملف نصي. تقدرين بعد ترسلين لها صورة في المحادثة وتقولين «احفظيها». المعلومات تشوفها Rawan AI بس، ومعها روان وأبو راكان.'),
      el('input', { id: 'rkbT', placeholder: 'العنوان (مثال: إجراء طلبات الصيانة)', maxlength: '120' }),
      el('input', { id: 'rkbP', placeholder: 'الموضوع (اختياري): زملاء، موردين، إجراءات…', maxlength: '40' }),
      el('textarea', { id: 'rkbC', placeholder: 'المعلومة كاملة…', maxlength: '20000' }),
      el('p', { class: 'msg', id: 'rkbM' }),
      el('div', { class: 'row' },
        el('button', { type: 'button', class: 'pri', id: 'rkbSave', onclick: save }, 'حفظ'),
        el('button', { type: 'button', onclick: () => fi.click() }, 'رفع ملف نصي'),
        el('button', { type: 'button', id: 'rkbCancel', hidden: '', onclick: reset }, 'إلغاء التعديل')),
      fi,
      el('div', { id: 'rkbList' })));
    document.body.append(s);
  }
  function msg(t){ const m = $('rkbM'); if(m) m.textContent = t || ''; }
  function reset(){ editId = null; $('rkbT').value = ''; $('rkbP').value = ''; $('rkbC').value = ''; $('rkbCancel').hidden = true; $('rkbSave').textContent = 'حفظ'; }
  function by(){ return document.body.dataset.role === 'owner' ? 'أبو راكان' : 'روان'; }

  async function save(){
    const c = $('rkbC').value.trim(), t = $('rkbT').value.trim();
    if(!c){ msg('اكتبي المعلومة أول.'); return; }
    const b = $('rkbSave'); b.disabled = true; msg('');
    try{
      const it = { id: editId || ('k' + Date.now()), title: (t || c.split('\n')[0]).slice(0, 120), content: c.slice(0, 20000), topic: $('rkbP').value.trim().slice(0, 40), at: new Date().toISOString(), by: by() };
      await writeKb(kb => { const x = kb.findIndex(k => k.id === it.id); if(x >= 0) kb[x] = it; else kb.push(it); return kb; });
      reset(); render(); msg('انحفظت، وRawan AI صارت تعرفها.');
    }catch(e){ msg('ما انحفظت: ' + (e && e.message ? e.message : 'خطأ')); }
    b.disabled = false;
  }

  function render(){
    const L = $('rkbList'); if(!L) return; L.replaceChildren();
    L.append(el('p', { class: 'sub' }, cache.length ? ('المحفوظ: ' + ar(cache.length) + ' معلومة') : 'ما فيه معلومات محفوظة لسا.'));
    cache.slice().reverse().forEach(k => {
      L.append(el('div', { class: 'it' },
        el('b', {}, k.title || 'بدون عنوان'),
        el('div', { class: 'm' }, [k.topic, k.by, String(k.at || '').slice(0, 10)].filter(Boolean).join(' · ')),
        el('p', {}, k.content || ''),
        el('div', { class: 'act' },
          el('button', { type: 'button', onclick: () => { editId = k.id; $('rkbT').value = k.title || ''; $('rkbP').value = k.topic || ''; $('rkbC').value = k.content || ''; $('rkbCancel').hidden = false; $('rkbSave').textContent = 'حفظ التعديل'; $('rkbSheet').querySelector('.rb').scrollTop = 0; } }, 'تعديل'),
          el('button', { type: 'button', onclick: async () => { if(!confirm('تحذفين «' + (k.title || '') + '» من ذاكرة Rawan AI؟')) return; try{ await writeKb(kb => kb.filter(x => x.id !== k.id)); render(); msg('انحذفت.'); }catch(e){ msg('ما انحذفت.'); } } }, 'حذف'))));
    });
  }

  async function open(){
    build(); $('rkbSheet').hidden = false; msg('…');
    try{ const d = await readDoc(); cache = Array.isArray(d.kb) ? d.kb : []; msg(''); }catch(e){ msg('ما قدرت أحمّل الذاكرة.'); }
    render();
  }

  function tile(){
    const H = $('hub'); if(!H || !allowed() || H.querySelector('.rkbTile')) return;
    const b = el('button', { type: 'button', class: 'hubc rkbTile', 'aria-label': 'ذاكرة Rawan AI', onclick: open },
      el('span', { class: 'ic', 'aria-hidden': 'true' }, '🧠'), el('span', { class: 'lb' }, 'ذاكرة Rawan AI'));
    H.append(b);
  }

  const wait = setInterval(() => {
    const H = $('hub');
    if(!H || !H.children.length || !document.body.dataset.role || !window.sb) return;
    clearInterval(wait);
    if(!allowed()) return;
    tile();
    new MutationObserver(tile).observe(H, { childList: true });
  }, 700);
})();
