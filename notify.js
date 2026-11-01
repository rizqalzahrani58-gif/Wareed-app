/* إشعارات المدراء — يرسلها أبو راكان وروان ود. ناصر، وتظهر في «ملفي» + تنبيه على الجوال
   ٢٥ أكتوبر: التنبيهات إجبارية لكل الزملاء (شاشة تقفل التطبيق لين تتفعل) + إشعار جوال لكل مهمة تنضاف للمسؤول (task-push)
   ١ نوفمبر: «وصلني» و«المرسلة» انشالت من الملف — كل إشعار يتحوّل مهمة تلقائياً للمستلم (trigger notices_to_task في قاعدة البيانات) */
(function(){
  const FN = 'https://zymsuvxoylpxowkhycuv.supabase.co/functions/v1/notify';
  let sb, me, notices = [], reads = new Set(), people = [], readsAll = [], replies = [];
  const SEENK = 'ntSeenReplies'; let seenAt = (() => { try { return localStorage.getItem(SEENK) || ''; } catch(e){ return ''; } })();
  const nameOf = id => (people.find(p => p.id === id) || {}).name || '؟';
  const $e = (t, a, ...k) => { const n = document.createElement(t); for(const x in (a||{})){ if(x === 'class') n.className = a[x]; else if(x.startsWith('on')) n[x] = a[x]; else if(a[x] != null) n.setAttribute(x, a[x]); } k.flat().forEach(c => c != null && n.append(c)); return n; };
  const canSend = () => me && (me.role === 'owner' || me.role === 'trusted');
  const canDel = n => me && ((me.role === 'owner' && !me.legacy_id) || n.sender_id === me.id);
  const forMe = n => n.sender_id !== me.id && (n.targets.includes(me.id) || (n.target_all && me.role === 'manager'));
  const ago = d => { const m = Math.round((Date.now() - new Date(d)) / 60000); if(m < 1) return 'الحين'; if(m < 60) return 'قبل ' + m + ' د'; const h = Math.round(m / 60); if(h < 24) return 'قبل ' + h + ' س'; return new Date(d).toLocaleDateString('ar-SA-u-nu-latn', { day: 'numeric', month: 'short' }); };

  async function token(){ const { data } = await sb.auth.getSession(); return data.session && data.session.access_token; }
  async function call(body){ const r = await fetch(FN, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + await token() }, body: JSON.stringify(body) }); return r.json(); }

  /* ---------- تنبيهات الجهاز (Web Push) ---------- */
  const pushOK = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent), standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const b64 = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); s += '='.repeat((4 - s.length % 4) % 4); return Uint8Array.from(atob(s), c => c.charCodeAt(0)); };
  async function pushState(){ if(!pushOK()) return 'na'; if(Notification.permission === 'denied') return 'denied'; const reg = await navigator.serviceWorker.getRegistration(); const s = reg && await reg.pushManager.getSubscription(); return s ? 'on' : 'off'; }
  async function enablePush(){
    const perm = await Notification.requestPermission(); if(perm !== 'granted') return false;
    const reg = await navigator.serviceWorker.register('sw.js?v=4'); await navigator.serviceWorker.ready;
    const { publicKey } = await call({ action: 'key' });
    let s = await reg.pushManager.getSubscription();
    if(!s) s = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(publicKey) });
    const j = s.toJSON(); await sb.from('push_subs').upsert({ endpoint: j.endpoint, user_id: me.id, sub: j, ua: navigator.userAgent.slice(0, 200) });
    return true;
  }
  async function syncSub(){ try { if(await pushState() !== 'on') return; const reg = await navigator.serviceWorker.getRegistration(); const s = await reg.pushManager.getSubscription(); const j = s.toJSON(); await sb.from('push_subs').upsert({ endpoint: j.endpoint, user_id: me.id, sub: j, ua: navigator.userAgent.slice(0, 200) }); } catch(e){} }


  /* ---------- التنبيهات إجبارية (٢٥ أكتوبر) + إشعار المهام ---------- */
  const TP = 'https://zymsuvxoylpxowkhycuv.supabase.co/functions/v1/task-push';
  let sweepT = null;
  function sweep(){ clearTimeout(sweepT); sweepT = setTimeout(async () => { try { await fetch(TP, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + await token() }, body: JSON.stringify({ action: 'sweep' }) }); } catch(e){} }, 1500); }
  let gate = null;
  async function enforce(){
    const st = await pushState().catch(() => 'na');
    if(st === 'on'){ if(gate){ gate.remove(); gate = null; document.documentElement.classList.remove('wdGate'); } return; }
    if(!gate){ gate = $e('div', { id: 'wdPushGate', dir: 'rtl', role: 'dialog', 'aria-modal': 'true' }); document.body.append(gate); document.documentElement.classList.add('wdGate'); }
    const icon = $e('div', { class: 'pgIco' }, '🔔');
    const h = $e('h2', {}, 'فعّل التنبيهات عشان تكمل');
    const p = $e('p', {}, 'تنبيهات وريد إجبارية لكل الزملاء: أي مهمة تنضاف لك يوصلك إشعارها على جوالك فوراً حتى لو التطبيق مقفل.');
    const msg = $e('p', { class: 'pgMsg' });
    let act = null;
    if(st === 'off'){
      act = $e('button', { type: 'button', class: 'pgBtn' }, 'فعّل التنبيهات');
      act.onclick = async () => { act.disabled = true; act.textContent = 'جاري التفعيل…'; msg.textContent = '';
        try { const ok = await enablePush(); if(!ok){ msg.textContent = 'لازم تضغط «سماح» عشان تقدر تدخل التطبيق.'; } } catch(e){ msg.textContent = 'ما قدرت أفعّلها: ' + (e.message || e); }
        await enforce(); paintPush(); if(act){ act.disabled = false; act.textContent = 'فعّل التنبيهات'; } };
    } else if(st === 'denied'){
      p.textContent = 'التنبيهات مقفلة لهالتطبيق. افتحها من الإعدادات وارجع اضغط «تحقق»:';
      msg.replaceChildren($e('span', {}, isIOS ? 'الآيفون: الإعدادات ← الإشعارات ← وريد ← السماح بالإشعارات.' : 'المتصفح: اضغط القفل 🔒 جنب الرابط ← الإشعارات ← سماح.'));
      act = $e('button', { type: 'button', class: 'pgBtn' }, 'تحقق'); act.onclick = () => location.reload();
    } else if(isIOS && !standalone){
      p.textContent = 'على الآيفون التنبيهات تشتغل بس لو فتحت وريد من أيقونة الشاشة الرئيسية:';
      msg.replaceChildren($e('span', {}, '١) من سفاري اضغط زر المشاركة ⬆️  ٢) «إضافة إلى الشاشة الرئيسية»  ٣) افتح وريد من الأيقونة الجديدة وفعّل التنبيهات.'));
    } else {
      p.textContent = isIOS ? 'حدّث نظام الآيفون (iOS 16.4 أو أحدث) عشان تشتغل التنبيهات.' : 'هالمتصفح ما يدعم التنبيهات. افتح وريد من Chrome أو Safari محدّث.';
    }
    gate.replaceChildren($e('div', { class: 'pgBox' }, icon, h, p, msg, act));
  }
  function openTask(id){ const go = (n) => { if(window.__hub){ try { window.__hub.openSec('tasks'); } catch(e){} setTimeout(() => { const el = document.querySelector('[data-id="' + CSS.escape(id) + '"]') || document.getElementById('tasks'); if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 500); history.replaceState(null, '', location.pathname); } else if(n < 40) setTimeout(() => go(n + 1), 500); }; go(0); }

  /* ---------- بيانات ---------- */
  async function load(){
    const [{ data: n }, { data: r }, { data: rp }] = await Promise.all([
      sb.from('notices').select('*').order('created_at', { ascending: false }).limit(200),
      sb.from('notice_reads').select('notice_id,user_id,read_at'),
      sb.from('notice_replies').select('*').order('created_at', { ascending: true }).limit(2000)
    ]);
    notices = n || []; readsAll = r || []; replies = rp || []; reads = new Set(readsAll.filter(x => x.user_id === me.id).map(x => x.notice_id));
    paint();
  }
  async function markRead(id){ if(reads.has(id)) return; reads.add(id); paint(); await sb.from('notice_reads').insert({ notice_id: id, user_id: me.id }); }

  async function addReply(n, kind, body, to){
    const row = { notice_id: n.id, user_id: me.id, user_name: me.name, kind, body: body || '', to_user: to || null };
    const { data, error } = await sb.from('notice_replies').insert(row).select().single();
    if(error){ if(!/duplicate|unique/i.test(error.message)) alert('ما انرسل: ' + error.message); return false; }
    replies.push(data); if(!reads.has(n.id)) markRead(n.id); else paint();
    call({ action: 'reply', reply_id: data.id }).catch(() => {});
    return true;
  }
  /* تحويل الإشعار لمهمة في لوحة المهام */
  async function toTask(n, btn){
    const title = prompt('عنوان المهمة:', n.title); if(title == null || !title.trim()) return;
    btn.disabled = true;
    let order = 1000; try { const { data } = await sb.from('docs').select('data').eq('collection', 'tasks').limit(2000); order = Math.max(0, ...(data || []).map(d => +(d.data && d.data.order) || 0)) + 1; } catch(e){}
    const id = 'nt' + Date.now().toString(36);
    const note = 'من إشعار ' + (n.sender_name || '') + (n.body ? ': ' + n.body : '') + ' · المسؤول: ' + me.name;
    const data = { kind: 'task', title: title.trim().slice(0, 200), note: note.slice(0, 1500), status: 'open', order, via: 'إشعار', fromNotice: n.id, createdAt: new Date().toISOString(), addedById: me.legacy_id || me.id, addedName: me.name, addedPos: me.pos || '' };
    const { error } = await sb.from('docs').insert({ collection: 'tasks', id, data });
    if(error){ alert('ما قدرت أسويها مهمة: ' + error.message); btn.disabled = false; return; }
    await addReply(n, 'task', data.title);
  }
  /* ردود جديدة موجّهة لي (رد على إشعار أرسلته، أو رد المرسل علي) */
  const incoming = r => r.user_id !== me.id && (r.to_user === me.id || (!r.to_user && (notices.find(n => n.id === r.notice_id) || {}).sender_id === me.id));
  const newReplies = () => replies.filter(r => incoming(r) && r.created_at > seenAt);
  function markSeen(){ const last = replies.filter(incoming).map(r => r.created_at).sort().pop(); if(last && last > seenAt){ seenAt = last; try { localStorage.setItem(SEENK, last); } catch(e){} paintBadge(); } }
  function replyBox(onSend, ph){
    const ta = $e('textarea', { maxlength: '2000', placeholder: ph || 'اكتب ردك…', rows: '2' });
    const b = $e('button', { type: 'button', class: 'ntsend' }, 'أرسل الرد');
    const w = $e('div', { class: 'ntreplyform' }, ta, b);
    b.onclick = async e => { e.stopPropagation(); const v = ta.value.trim(); if(!v) return; b.disabled = true; if(await onSend(v)){ ta.value = ''; w.remove(); } b.disabled = false; };
    ta.onclick = e => e.stopPropagation();
    setTimeout(() => ta.focus(), 50); return w;
  }
  function bubble(r){
    const mineR = r.user_id === me.id, isNew = incoming(r) && r.created_at > seenAt;
    if(r.kind === 'task') return $e('div', { class: 'ntrp ack' + (isNew ? ' fresh' : '') }, '📋 ' + (mineR ? 'حوّلته مهمة' : (r.user_name || nameOf(r.user_id)) + ' حوّله مهمة') + ': ' + r.body, $e('span', { class: 'ntmeta' }, ' · ' + ago(r.created_at)));
    if(r.kind === 'ack') return $e('div', { class: 'ntrp ack' + (isNew ? ' fresh' : '') }, '✅ ' + (mineR ? 'أكدت الاستلام' : (r.user_name || nameOf(r.user_id)) + ' أكد الاستلام'), $e('span', { class: 'ntmeta' }, ' · ' + ago(r.created_at)));
    return $e('div', { class: 'ntrp' + (mineR ? ' me' : '') + (isNew ? ' fresh' : '') }, $e('b', {}, mineR ? 'أنت' : (r.user_name || nameOf(r.user_id))), r.to_user && !mineR ? null : (r.to_user ? $e('span', { class: 'ntmeta' }, ' ← ' + nameOf(r.to_user)) : null), $e('span', { class: 'ntmeta' }, ' · ' + ago(r.created_at)), $e('p', {}, r.body));
  }

  /* ---------- الواجهة ---------- */
  let box, inbox, sentBox, pushRow, badge;
  function unread(){ return 0; /* ١ نوفمبر: الإشعارات صارت مهام — العدّاد على أيقونة المهام */ }
  function paintBadge(){
    const av = document.querySelector('.avbtn'); if(!av) return;
    if(!badge || !badge.isConnected){ badge = $e('span', { class: 'ntbadge' }); av.append(badge); }
    const u = unread(); badge.textContent = u > 9 ? '9+' : u; badge.hidden = !u;
  }
  function card(n, mine){
    const isNew = !mine && !reads.has(n.id);
    const who = n.target_all ? 'كل المدراء' : n.targets.map(id => (people.find(p => p.id === id) || {}).name || '؟').join('، ');
    const c = $e('div', { class: 'ntcard' + (isNew ? ' new' : ''), id: 'nt-' + n.id },
      $e('div', { class: 'nthead' }, $e('b', {}, n.title), $e('span', { class: 'ntmeta' }, ago(n.created_at))),
      n.body ? $e('p', {}, n.body) : null,
      $e('div', { class: 'ntfoot' }, mine ? $e('span', {}, 'إلى: ' + who) : $e('span', {}, 'من: ' + (n.sender_name || '')), null));
    const foot = c.querySelector('.ntfoot');
    if(mine){
      const total = n.target_all ? people.filter(p => p.role === 'manager').length : n.targets.length;
      const rd = readsAll.filter(x => x.notice_id === n.id && x.user_id !== n.sender_id);
      const names = rd.map(x => (people.find(p => p.id === x.user_id) || {}).name).filter(Boolean);
      foot.append($e('span', { class: 'ntread', title: names.join('، ') }, '👁 ' + rd.length + ' من ' + total));
    }
    const th = $e('div', { class: 'ntthread' });
    if(mine){
      const rs = replies.filter(r => r.notice_id === n.id);
      const acks = rs.filter(r => r.kind === 'ack' && r.user_id !== n.sender_id);
      const total = n.target_all ? people.filter(p => p.role === 'manager').length : n.targets.length;
      foot.append($e('span', { class: 'ntack', title: acks.map(r => r.user_name || nameOf(r.user_id)).join('، ') }, '✅ ' + acks.length + ' من ' + total));
      if(acks.length) th.append($e('div', { class: 'ntacks' }, 'أكد الاستلام: ' + acks.map(r => r.user_name || nameOf(r.user_id)).join('، ')));
      rs.filter(r => r.kind === 'task' && r.user_id !== me.id).forEach(r => th.append(bubble(r)));
      /* الردود مجمّعة حسب الزميل، وتقدر ترد على كل واحد */
      const by = new Map(); rs.filter(r => r.kind === 'reply').forEach(r => { const k = r.user_id === me.id ? r.to_user : r.user_id; if(!k) return; if(!by.has(k)) by.set(k, []); by.get(k).push(r); });
      by.forEach((list, uid) => {
        const g = $e('div', { class: 'ntgroup' }, ...list.map(bubble));
        const rb = $e('button', { type: 'button', class: 'ntlink' }, '↩ رد على ' + nameOf(uid));
        rb.onclick = e => { e.stopPropagation(); if(g.querySelector('.ntreplyform')) return; g.append(replyBox(v => addReply(n, 'reply', v, uid), 'ردك على ' + nameOf(uid) + '…')); };
        g.append(rb); th.append(g);
      });
    } else {
      const rs = replies.filter(r => r.notice_id === n.id && (r.user_id === me.id || r.to_user === me.id));
      rs.forEach(r => th.append(bubble(r)));
      const acked = rs.some(r => r.kind === 'ack' && r.user_id === me.id);
      const act = $e('div', { class: 'ntactions' });
      if(!acked){ const ab = $e('button', { type: 'button', class: 'ntackbtn' }, '✅ تم الاستلام'); ab.onclick = async e => { e.stopPropagation(); ab.disabled = true; await addReply(n, 'ack'); }; act.append(ab); }
      if(!rs.some(r => r.kind === 'task' && r.user_id === me.id)){ const tb = $e('button', { type: 'button', class: 'ntlink' }, '📋 حوّلها مهمة'); tb.onclick = e => { e.stopPropagation(); toTask(n, tb); }; act.append(tb); }
      const rb = $e('button', { type: 'button', class: 'ntlink' }, '↩ رد');
      rb.onclick = e => { e.stopPropagation(); if(th.querySelector('.ntreplyform')) return; th.append(replyBox(v => addReply(n, 'reply', v))); };
      act.append(rb); c.append(act);
    }
    if(th.childNodes.length) c.insertBefore(th, c.querySelector('.ntactions'));
    if(canSend() && canDel(n)) foot.append($e('button', { type: 'button', class: 'ntdel', onclick: async e => { e.stopPropagation(); if(!confirm('تحذف هالإشعار؟')) return; await sb.from('notices').delete().eq('id', n.id); load(); } }, 'حذف'));
    if(isNew) c.onclick = () => markRead(n.id);
    return c;
  }
  function paint(){
    if(!inbox) return;
    if([...box.querySelectorAll('.ntreplyform textarea')].some(t => t.value.trim())){ paintBadge(); return; }
    const mineIn = notices.filter(forMe);
    inbox.replaceChildren(...(mineIn.length ? mineIn.map(n => card(n, false)) : [$e('p', { class: 'hint' }, 'ما عندك إشعارات.')]));
    if(sentBox){ const sent = notices.filter(n => !forMe(n)); sentBox.replaceChildren(...(sent.length ? sent.slice(0, 40).map(n => card(n, true)) : [$e('p', { class: 'hint' }, 'ما أُرسل شي للحين.')])); }
    paintBadge();
  }
  async function paintPush(){
    if(!pushRow) return; const st = await pushState();
    let txt, btn = null;
    if(st === 'on'){ txt = '🔔 التنبيهات شغّالة على هذا الجهاز'; }
    else if(st === 'denied'){ txt = 'التنبيهات مقفلة من إعدادات المتصفح/الجوال. افتحها من الإعدادات للموقع.'; }
    else if(st === 'na' && isIOS && !standalone){ txt = 'عشان توصلك تنبيهات على الآيفون: من سفاري اضغط زر المشاركة ← «إضافة إلى الشاشة الرئيسية»، وافتح وريد من الأيقونة.'; }
    else if(st === 'na'){ txt = 'هالمتصفح ما يدعم التنبيهات. الإشعارات تظهر هنا في ملفك.'; }
    else { txt = 'فعّل التنبيهات عشان يوصلك الإشعار على الجوال حتى لو التطبيق مقفل.'; btn = $e('button', { type: 'button', class: 'ntpush', onclick: async () => { btn.disabled = true; btn.textContent = 'جاري التفعيل…'; try { const ok = await enablePush(); if(!ok) alert('ما تم السماح بالتنبيهات.'); } catch(e){ alert('ما قدرت أفعّل التنبيهات: ' + (e.message || e)); } paintPush(); } }, 'فعّل التنبيهات'); }
    pushRow.replaceChildren($e('span', {}, txt), btn);
  }
  function composer(){
    const mgrs = people.filter(p => p.id !== me.id).sort((a, b) => (a.role === 'manager' ? 0 : 1) - (b.role === 'manager' ? 0 : 1) || (a.name || '').localeCompare(b.name || '', 'ar'));
    const sel = new Set(); let all = true;
    const allChip = $e('button', { type: 'button', class: 'ntchip on' }, 'كل المدراء');
    const chips = mgrs.map(p => { const b = $e('button', { type: 'button', class: 'ntchip', title: p.pos || '' }, p.name || p.email); b.onclick = () => { all = false; allChip.classList.remove('on'); sel.has(p.id) ? sel.delete(p.id) : sel.add(p.id); b.classList.toggle('on', sel.has(p.id)); if(!sel.size){ all = true; allChip.classList.add('on'); } }; return b; });
    allChip.onclick = () => { all = true; sel.clear(); allChip.classList.add('on'); chips.forEach(c => c.classList.remove('on')); };
    const t = $e('input', { maxlength: '120', placeholder: 'عنوان الإشعار' }), body = $e('textarea', { maxlength: '2000', placeholder: 'نص الإشعار (اختياري)' }), msg = $e('p', { class: 'pmsg' });
    const send = $e('button', { type: 'button', class: 'ntsend' }, 'أرسل');
    send.onclick = async () => {
      const title = t.value.trim(); if(!title){ msg.textContent = 'اكتب عنوان.'; return; }
      send.disabled = true; msg.className = 'pmsg'; msg.textContent = 'جاري الإرسال…';
      const { data, error } = await sb.from('notices').insert({ title, body: body.value.trim(), target_all: all, targets: all ? [] : [...sel], sender_id: me.id, sender_name: me.name }).select().single();
      if(error){ msg.textContent = 'ما انرسل: ' + error.message; send.disabled = false; return; }
      let r = {}; try { r = await call({ notice_id: data.id }); } catch(e){}
      msg.className = 'pmsg ok'; msg.textContent = 'انرسل ✓' + (all ? '' : ' وصار مهمة للمستلم') + ' ' + (r.recipients != null ? '(' + r.recipients + ' مستلم، ' + (r.reached || 0) + ' منهم وصلهم تنبيه على الجوال)' : '');
      t.value = ''; body.value = ''; send.disabled = false; load();
    };
    return $e('div', { class: 'ntcomp' }, $e('h3', {}, 'أرسل إشعار'), $e('div', { class: 'ntchips' }, allChip, chips), t, body, msg, send);
  }
  function build(sec){
    box = $e('div', { class: 'ntbox', id: 'ntBox' });
    pushRow = $e('div', { class: 'ntpushrow' });
    inbox = $e('div', { class: 'ntlist' });
    box.append($e('h2', {}, '🔔 الإشعارات'), pushRow);
    /* ١ نوفمبر: بدون «وصلني» و«المرسلة» — الإشعار يتحوّل مهمة وتلقاه في بوابة المهام */
    if(canSend()) box.append(composer(), $e('p', { class: 'hint' }, 'أي إشعار ترسله أو يوصلك يتحوّل مهمة تلقائياً في بوابة المهام.'));
    inbox = null;
    const prof = sec.querySelector('.prof'); sec.insertBefore(box, prof ? prof.nextSibling : null);
    paintPush(); paint();
    try { new IntersectionObserver(es => { if(es.some(x => x.isIntersecting)) setTimeout(markSeen, 2500); }).observe(box); } catch(e){}
  }

  async function start(){
    sb = window.sb; if(!sb) return;
    const { data: s } = await sb.auth.getSession(); if(!s.session) return setTimeout(start, 1500);
    const { data: p } = await sb.from('profiles').select('*').eq('id', s.session.user.id).maybeSingle(); if(!p) return setTimeout(start, 1500);
    me = p;
    try { const st = document.createElement('style'); st.textContent = "/* التنبيهات إجبارية (٢٥ أكتوبر) */\nhtml.wdGate,html.wdGate body{overflow:hidden!important}\n#wdPushGate{position:fixed;inset:0;z-index:2147483000;background:radial-gradient(120% 80% at 50% 0%,#17203a 0%,#0b0d12 62%);display:flex;align-items:center;justify-content:center;padding:max(1.2em,env(safe-area-inset-top)) 1.2em max(1.2em,env(safe-area-inset-bottom));font-family:\"IBM Plex Sans Arabic\",\"Readex Pro\",system-ui,sans-serif;color:#f3f5f9}\n#wdPushGate .pgBox{width:100%;max-width:23em;background:#161a23;border:1px solid #272d3a;border-radius:22px;padding:1.8em 1.4em;display:flex;flex-direction:column;gap:.8em;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}\n#wdPushGate .pgIco{font-size:2.6em;line-height:1}\n#wdPushGate h2{margin:0;font-size:1.3em;font-weight:700}\n#wdPushGate p{margin:0;line-height:1.7;color:#c9d0de}\n#wdPushGate .pgMsg{font-size:.92em;color:#ffb38a}#wdPushGate .pgMsg:empty{display:none}\n#wdPushGate .pgBtn{font:inherit;font-size:1.05em;font-weight:600;background:#5aa2ff;color:#fff;border:0;border-radius:12px;padding:.85em 1.2em;cursor:pointer}#wdPushGate .pgBtn:disabled{opacity:.55}\n"; document.head.append(st); } catch(e){}
    enforce(); document.addEventListener('visibilitychange', () => { if(!document.hidden) enforce(); });
    const { data: ppl } = await sb.from('profiles').select('id,name,role,pos,email'); people = ppl || [];
    const wait = () => { const sec = document.getElementById('profSec'); if(sec && document.querySelector('.avbtn')){ build(sec); } else setTimeout(wait, 500); };
    wait();
    await load(); syncSub(); sweep();
    sb.channel('tasks-push').on('postgres_changes', { event: '*', schema: 'public', table: 'docs', filter: 'collection=eq.tasks' }, () => sweep()).subscribe();
    const tq = new URLSearchParams(location.search).get('t'); if(tq) openTask(tq);
    sb.channel('notices-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, async pl => {
      await load();
      const n = pl.new; if(pl.eventType === 'INSERT' && n && forMe(n)) toast(n);
    }).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notice_replies' }, async pl => {
      const r = pl.new; await load();
      if(r && incoming(r)){ const n = notices.find(x => x.id === r.notice_id) || {}; toast({ id: n.id, title: ({ ack: '✅ ', task: '📋 ', reply: '↩️ ' })[r.kind] + (r.user_name || '') + ({ ack: ' استلم', task: ' حوّله مهمة', reply: ' رد' })[r.kind], sender_name: '', body: (n.title || '') + (r.body ? ': ' + r.body : '') }, true); }
    }).subscribe();
    const q = new URLSearchParams(location.search).get('n');
    if(q){ markRead(q); openTask('nt' + q.replace(/-/g, '')); }
    setInterval(() => { load(); sweep(); }, 120000);
  }
  function toast(n, raw){
    const t = $e('div', { class: 'nttoast', onclick: () => { t.remove(); if(n.id) openTask('nt' + String(n.id).replace(/-/g, '')); if(!raw) markRead(n.id); } }, $e('b', {}, (raw ? '' : '🔔 ') + n.title), $e('span', {}, (n.sender_name ? n.sender_name + ': ' : '') + (n.body || '').slice(0, 120)));
    document.body.append(t); setTimeout(() => t.remove(), 9000);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 800)); else setTimeout(start, 800);
})();
