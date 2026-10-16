/* إشعارات المدراء — يرسلها أبو راكان وروان ود. ناصر، وتظهر في «ملفي» + تنبيه على الجوال */
(function(){
  const FN = 'https://zymsuvxoylpxowkhycuv.supabase.co/functions/v1/notify';
  let sb, me, notices = [], reads = new Set(), people = [], readsAll = [];
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
    const reg = await navigator.serviceWorker.register('sw.js?v=3'); await navigator.serviceWorker.ready;
    const { publicKey } = await call({ action: 'key' });
    let s = await reg.pushManager.getSubscription();
    if(!s) s = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(publicKey) });
    const j = s.toJSON(); await sb.from('push_subs').upsert({ endpoint: j.endpoint, user_id: me.id, sub: j, ua: navigator.userAgent.slice(0, 200) });
    return true;
  }
  async function syncSub(){ try { if(await pushState() !== 'on') return; const reg = await navigator.serviceWorker.getRegistration(); const s = await reg.pushManager.getSubscription(); const j = s.toJSON(); await sb.from('push_subs').upsert({ endpoint: j.endpoint, user_id: me.id, sub: j, ua: navigator.userAgent.slice(0, 200) }); } catch(e){} }

  /* ---------- بيانات ---------- */
  async function load(){
    const [{ data: n }, { data: r }] = await Promise.all([
      sb.from('notices').select('*').order('created_at', { ascending: false }).limit(200),
      sb.from('notice_reads').select('notice_id,user_id,read_at')
    ]);
    notices = n || []; readsAll = r || []; reads = new Set(readsAll.filter(x => x.user_id === me.id).map(x => x.notice_id));
    paint();
  }
  async function markRead(id){ if(reads.has(id)) return; reads.add(id); paint(); await sb.from('notice_reads').insert({ notice_id: id, user_id: me.id }); }

  /* ---------- الواجهة ---------- */
  let box, inbox, sentBox, pushRow, badge;
  function unread(){ return notices.filter(n => forMe(n) && !reads.has(n.id)).length; }
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
    if(canSend() && canDel(n)) foot.append($e('button', { type: 'button', class: 'ntdel', onclick: async e => { e.stopPropagation(); if(!confirm('تحذف هالإشعار؟')) return; await sb.from('notices').delete().eq('id', n.id); load(); } }, 'حذف'));
    if(isNew) c.onclick = () => markRead(n.id);
    return c;
  }
  function paint(){
    if(!inbox) return;
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
      msg.className = 'pmsg ok'; msg.textContent = 'انرسل ✓ ' + (r.recipients != null ? '(' + r.recipients + ' مستلم، ' + (r.reached || 0) + ' منهم وصلهم تنبيه على الجوال)' : '');
      t.value = ''; body.value = ''; send.disabled = false; load();
    };
    return $e('div', { class: 'ntcomp' }, $e('h3', {}, 'أرسل إشعار'), $e('div', { class: 'ntchips' }, allChip, chips), t, body, msg, send);
  }
  function build(sec){
    box = $e('div', { class: 'ntbox', id: 'ntBox' });
    pushRow = $e('div', { class: 'ntpushrow' });
    inbox = $e('div', { class: 'ntlist' });
    box.append($e('h2', {}, '🔔 الإشعارات'), pushRow);
    if(canSend()){ sentBox = $e('div', { class: 'ntlist' }); box.append(composer(), $e('h3', {}, 'وصلني'), inbox, $e('h3', {}, 'المرسلة'), sentBox); }
    else box.append(inbox);
    const prof = sec.querySelector('.prof'); sec.insertBefore(box, prof ? prof.nextSibling : null);
    paintPush(); paint();
  }

  async function start(){
    sb = window.sb; if(!sb) return;
    const { data: s } = await sb.auth.getSession(); if(!s.session) return setTimeout(start, 1500);
    const { data: p } = await sb.from('profiles').select('*').eq('id', s.session.user.id).maybeSingle(); if(!p) return setTimeout(start, 1500);
    me = p;
    const { data: ppl } = await sb.from('profiles').select('id,name,role,pos,email'); people = ppl || [];
    const wait = () => { const sec = document.getElementById('profSec'); if(sec && document.querySelector('.avbtn')){ build(sec); } else setTimeout(wait, 500); };
    wait();
    await load(); syncSub();
    sb.channel('notices-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, async pl => {
      await load();
      const n = pl.new; if(pl.eventType === 'INSERT' && n && forMe(n)) toast(n);
    }).subscribe();
    const q = new URLSearchParams(location.search).get('n');
    if(q){ const go = () => { if(window.__hub && document.getElementById('nt-' + q)){ window.__hub.openSec('profSec'); document.getElementById('nt-' + q).scrollIntoView({ block: 'center' }); markRead(q); history.replaceState(null, '', location.pathname); } else setTimeout(go, 600); }; go(); }
    setInterval(load, 120000);
  }
  function toast(n){
    const t = $e('div', { class: 'nttoast', onclick: () => { t.remove(); window.__hub && window.__hub.openSec('profSec'); markRead(n.id); } }, $e('b', {}, '🔔 ' + n.title), $e('span', {}, (n.sender_name ? n.sender_name + ': ' : '') + (n.body || '').slice(0, 120)));
    document.body.append(t); setTimeout(() => t.remove(), 9000);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 800)); else setTimeout(start, 800);
})();
