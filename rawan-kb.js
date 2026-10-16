/* وريد · ذاكرة Rawan AI: روان تغذي وكيلتها بأي معلومة (نص طويل، ملف نصي، صورة عبر المحادثة) · v2 (الدايرة صارت شات مباشر)
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

  /* ---------- الواجهة: دايرة «ذاكرة Rawan AI» كشات مباشر · v2 ---------- */
  const css = '#rkbSheet{position:fixed;inset:0;z-index:900;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55);font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif;color:#f3f5f9}' +
    '#rkbSheet[hidden]{display:none!important}' +
    '#rkbSheet .rb{width:100%;max-width:40em;height:92vh;height:92dvh;display:flex;flex-direction:column;background:#161a23;border:1px solid #272d3a;border-bottom:0;border-radius:22px 22px 0 0;box-sizing:border-box;overflow:hidden}' +
    '#rkbSheet .hd{display:flex;align-items:center;gap:.6em;padding:.9em 1em .7em;border-bottom:1px solid #272d3a}' +
    '#rkbSheet .av{width:2.3em;height:2.3em;border-radius:50%;display:grid;place-items:center;background:#2a2244;font-size:1.15em;flex:none}' +
    '#rkbSheet .hd h3{margin:0;font-size:1.05em}#rkbSheet .hd .s{color:#8f98ad;font-size:.76em}#rkbSheet .hd .tt{flex:1;min-width:0}' +
    '#rkbSheet .x{background:transparent;border:0;color:#f3f5f9;font-size:1.5em;padding:0 .3em;cursor:pointer}' +
    '#rkbSheet .ch{flex:1;overflow-y:auto;padding:1em .9em;display:flex;flex-direction:column;gap:.55em;-webkit-overflow-scrolling:touch}' +
    '#rkbSheet .hint{align-self:center;text-align:center;color:#8f98ad;font-size:.84em;line-height:1.7;max-width:22em;margin:auto 0}' +
    '#rkbSheet .day{align-self:center;color:#8f98ad;font-size:.72em;background:#1e2330;border-radius:999px;padding:.2em .8em;margin:.3em 0}' +
    '#rkbSheet .bw{display:flex;flex-direction:column;align-items:flex-start;max-width:86%}#rkbSheet .bw.ai{align-self:flex-end;align-items:flex-end}' +
    '#rkbSheet .bb{background:#6d4fd8;color:#fff;border-radius:18px 18px 18px 6px;padding:.6em .85em;white-space:pre-wrap;word-break:break-word;line-height:1.65;font-size:.93em;cursor:pointer}' +
    '#rkbSheet .bw.ai .bb{background:#1e2330;color:#dfe3ee;border-radius:18px 18px 6px 18px;cursor:default;font-size:.85em}' +
    '#rkbSheet .bb.lng{max-height:14em;overflow:hidden;position:relative}#rkbSheet .bb.lng.op{max-height:none}' +
    '#rkbSheet .bb .fn{display:block;font-size:.78em;opacity:.8;margin-bottom:.25em}' +
    '#rkbSheet .mt{color:#8f98ad;font-size:.7em;margin-top:.2em;padding:0 .3em}' +
    '#rkbSheet .ac{display:none;gap:.4em;margin-top:.3em}#rkbSheet .bw.sel .ac{display:flex}' +
    '#rkbSheet .ac button{font:inherit;font-size:.78em;border:0;border-radius:999px;padding:.3em .9em;background:#272d3a;color:#f3f5f9;cursor:pointer}#rkbSheet .ac button.dl{color:#fca5a5}' +
    '#rkbSheet .ed{display:none;align-items:center;gap:.5em;padding:.45em 1em;background:#1e2330;border-top:1px solid #272d3a;font-size:.8em;color:#c4b5fd}#rkbSheet .ed.on{display:flex}#rkbSheet .ed span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#rkbSheet .ed button{background:transparent;border:0;color:#8f98ad;font:inherit;cursor:pointer}' +
    '#rkbSheet .cp{display:flex;align-items:flex-end;gap:.45em;padding:.6em .7em calc(.6em + env(safe-area-inset-bottom,0px));border-top:1px solid #272d3a;background:#161a23}' +
    '#rkbSheet textarea{flex:1;font:inherit;font-size:16px;min-height:2.6em;max-height:9em;resize:none;box-sizing:border-box;background:#1e2330;color:#f3f5f9;border:1px solid #272d3a;border-radius:20px;padding:.6em .9em;line-height:1.5;outline:none}' +
    '#rkbSheet .cb{flex:none;width:2.6em;height:2.6em;border-radius:50%;border:0;display:grid;place-items:center;cursor:pointer;font-size:1.05em;background:#272d3a;color:#f3f5f9}#rkbSheet .cb.go{background:#a78bfa;color:#140f24;font-weight:700}#rkbSheet .cb:disabled{opacity:.45}';
  const st = document.createElement('style'); st.textContent = css; document.head.append(st);

  const $ = id => document.getElementById(id);
  const allowed = () => { const b = document.body.dataset; return !b.nasser && (b.role === 'owner' || b.role === 'trusted' || !!b.rawan); };
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  let editId = null, cache = [], busy = false;

  async function readDoc(){ const { data, error } = await window.sb.from('docs').select('data').eq('collection', 'rawanmem').eq('id', RID).maybeSingle(); if(error) throw error; return (data && data.data) || {}; }
  async function writeKb(fn){ const d = await readDoc(); const kb = fn(Array.isArray(d.kb) ? d.kb.slice() : []).slice(-300); const { error } = await window.sb.from('docs').upsert({ collection: 'rawanmem', id: RID, data: { ...d, by: RID, kb, updatedAt: new Date().toISOString() } }, { onConflict: 'collection,id' }); if(error) throw error; cache = kb; return kb; }

  function el(t, a, ...k){ const e = document.createElement(t); if(a) for(const x in a){ if(x === 'class') e.className = a[x]; else if(x.startsWith('on')) e[x] = a[x]; else e.setAttribute(x, a[x]); } k.forEach(c => c != null && e.append(c)); return e; }
  function by(){ return document.body.dataset.role === 'owner' ? 'أبو راكان' : 'روان'; }
  function tm(iso){ try{ return new Date(iso).toLocaleTimeString('ar-SA-u-ca-gregory', { hour: 'numeric', minute: '2-digit' }); }catch(e){ return ''; } }
  function dy(iso){ try{ return new Date(iso).toLocaleDateString('ar-SA-u-ca-gregory', { weekday: 'long', day: 'numeric', month: 'long' }); }catch(e){ return String(iso || '').slice(0, 10); } }
  function grow(){ const t = $('rkbIn'); t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 144) + 'px'; $('rkbGo').disabled = busy || !t.value.trim(); }

  function build(){
    if($('rkbSheet')) return;
    const s = el('div', { id: 'rkbSheet', hidden: '' });
    s.addEventListener('click', e => { if(e.target === s) s.hidden = true; });
    const fi = el('input', { type: 'file', accept: '.txt,.md,.csv,.json,text/plain', hidden: '' });
    fi.onchange = () => { const f = fi.files && fi.files[0]; if(!f) return; const r = new FileReader(); r.onload = () => { const c = String(r.result || '').trim(); if(c) send(c, f.name.replace(/\.[^.]+$/, ''), f.name); }; r.readAsText(f); fi.value = ''; };
    const ta = el('textarea', { id: 'rkbIn', rows: '1', placeholder: 'اكتبي المعلومة لـ Rawan AI…', maxlength: '20000' });
    ta.addEventListener('input', grow);
    s.append(el('div', { class: 'rb' },
      el('div', { class: 'hd' },
        el('div', { class: 'av', 'aria-hidden': 'true' }, '🧠'),
        el('div', { class: 'tt' }, el('h3', {}, 'ذاكرة Rawan AI'), el('div', { class: 's', id: 'rkbS' }, 'تشوفها روان وأبو راكان بس')),
        el('button', { type: 'button', class: 'x', 'aria-label': 'إغلاق', onclick: () => { s.hidden = true; } }, '×')),
      el('div', { class: 'ch', id: 'rkbCh' }),
      el('div', { class: 'ed', id: 'rkbEd' }, el('span', { id: 'rkbEdT' }), el('button', { type: 'button', onclick: cancelEdit }, 'إلغاء')),
      el('div', { class: 'cp' },
        el('button', { type: 'button', class: 'cb', 'aria-label': 'رفع ملف نصي', title: 'رفع ملف نصي', onclick: () => fi.click() }, '📎'),
        ta,
        el('button', { type: 'button', class: 'cb go', id: 'rkbGo', 'aria-label': 'إرسال', disabled: '', onclick: () => send($('rkbIn').value.trim()) }, '↑')),
      fi));
    document.body.append(s);
  }

  function cancelEdit(){ editId = null; $('rkbEd').classList.remove('on'); $('rkbIn').value = ''; grow(); }

  async function send(c, title, fname){
    if(!c || busy) return;
    busy = true; grow();
    const old = editId ? cache.find(k => k.id === editId) : null;
    const it = { id: editId || ('k' + Date.now()), title: (title || (old && old.title) || c.split('\n')[0]).slice(0, 120), content: c.slice(0, 20000), topic: old ? (old.topic || '') : '', at: new Date().toISOString(), by: by() };
    if(fname) it.file = fname.slice(0, 120);
    try{
      await writeKb(kb => { const x = kb.findIndex(k => k.id === it.id); if(x >= 0) kb.splice(x, 1); kb.push(it); return kb; });
      if(!fname || editId){ $('rkbIn').value = ''; }
      editId = null; $('rkbEd').classList.remove('on');
      render(it.id, old ? 'عدّلتها ✓ وصرت أعتمد على النسخة الجديدة.' : 'حفظتها ✓');
    }catch(e){ render(null, null, 'ما انحفظت: ' + (e && e.message ? e.message : 'خطأ في الاتصال') + '. جربي مرة ثانية.'); }
    busy = false; grow();
  }

  function bubble(k, ack){
    const long = (k.content || '').length > 600 || (k.content || '').split('\n').length > 10;
    const bb = el('div', { class: 'bb' + (long ? ' lng' : '') }, k.file ? el('span', { class: 'fn' }, '📄 ' + k.file) : null, k.content || '');
    const w = el('div', { class: 'bw' }, bb,
      el('div', { class: 'mt' }, [k.by, tm(k.at)].filter(Boolean).join(' · ')),
      el('div', { class: 'ac' },
        long ? el('button', { type: 'button', onclick: e => { e.stopPropagation(); bb.classList.toggle('op'); } }, 'عرض كامل') : null,
        el('button', { type: 'button', onclick: e => { e.stopPropagation(); editId = k.id; $('rkbEdT').textContent = 'تعديل: ' + (k.title || ''); $('rkbEd').classList.add('on'); const t = $('rkbIn'); t.value = k.content || ''; grow(); t.focus(); } }, 'تعديل'),
        el('button', { type: 'button', class: 'dl', onclick: async e => { e.stopPropagation(); if(!confirm('تحذفين هالمعلومة من ذاكرة Rawan AI؟')) return; try{ await writeKb(kb => kb.filter(x => x.id !== k.id)); if(editId === k.id) cancelEdit(); render(null, null, 'حذفتها من ذاكرتي.'); }catch(er){ render(null, null, 'ما انحذفت، جربي مرة ثانية.'); } } }, 'حذف')));
    bb.onclick = () => { const on = w.classList.contains('sel'); document.querySelectorAll('#rkbCh .bw.sel').forEach(x => x.classList.remove('sel')); if(!on) w.classList.add('sel'); };
    const out = [w];
    if(ack) out.push(el('div', { class: 'bw ai' }, el('div', { class: 'bb' }, ack), el('div', { class: 'mt' }, 'Rawan AI')));
    return out;
  }

  function render(ackId, ackTxt, sysTxt){
    const C = $('rkbCh'); if(!C) return; C.replaceChildren();
    $('rkbS').textContent = cache.length ? ('المحفوظ ' + ar(cache.length) + ' معلومة · تشوفها روان وأبو راكان بس') : 'تشوفها روان وأبو راكان بس';
    if(!cache.length) C.append(el('div', { class: 'hint' }, 'اكتبي لي أي معلومة تبيني أعرفها، بأي طول، وأرسليها. أحفظها كاملة وأعتمد عليها.\nتقدرين بعد ترفعين ملف نصي من 📎، أو ترسلين صورة في محادثتي وتقولين «احفظيها».\nاضغطي على أي رسالة لتعديلها أو حذفها.'));
    let last = '';
    cache.forEach(k => {
      const d = String(k.at || '').slice(0, 10);
      if(d !== last){ last = d; C.append(el('div', { class: 'day' }, dy(k.at))); }
      bubble(k, k.id === ackId ? ackTxt : null).forEach(n => C.append(n));
    });
    if(sysTxt) C.append(el('div', { class: 'bw ai' }, el('div', { class: 'bb' }, sysTxt), el('div', { class: 'mt' }, 'Rawan AI')));
    requestAnimationFrame(() => { C.scrollTop = C.scrollHeight; });
  }

  async function open(){
    build(); $('rkbSheet').hidden = false; cancelEdit();
    const C = $('rkbCh'); C.replaceChildren(el('div', { class: 'hint' }, '…'));
    try{ const d = await readDoc(); cache = Array.isArray(d.kb) ? d.kb.slice().sort((a, b) => String(a.at).localeCompare(String(b.at))) : []; render(); }
    catch(e){ C.replaceChildren(el('div', { class: 'hint' }, 'ما قدرت أحمّل الذاكرة. تأكدي من النت وافتحيها مرة ثانية.')); }
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
