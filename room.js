/* غرفة الوكلاء — الشريط العلوي الزجاجي (v1)
   يشتغل فوق native.js: يستبدل بطاقتي Rizq AI وRawan AI بغرفة زجاجية وحدة لأبو راكان وروان،
   ويعرض غرفة مقفلة لأي زميل ما عنده وكيل. البيانات من collection council. */
(function(){
  'use strict';
  if (window.__agentRoomLoaded) return; window.__agentRoomLoaded = true;

  const $ = id => document.getElementById(id);
  const SVG = {
    chev: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    close: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f5f9" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    bulb: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f5f9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    lock: (s)=>'<svg aria-hidden="true" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="#f3f5f9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    room: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9d0de" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
    send: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    link: (live)=>'<svg aria-hidden="true" viewBox="0 0 120 36" fill="none"><defs><linearGradient id="arG" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#5aa2ff"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs><path id="arPath" d="M4 18 C 30 2, 50 34, 60 18 S 90 2, 116 18" stroke="url(#arG)" stroke-width="2" stroke-linecap="round" opacity="0.9"/><circle r="4" fill="#ffffff" opacity="0.95"><animateMotion dur="2.6s" repeatCount="'+(live?'indefinite':'1')+'" rotate="auto"><mpath href="#arPath"/></animateMotion></circle></svg>'
  };
  const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const txt = (tag, cls, s) => { const e = el(tag, cls); e.textContent = s == null ? '' : String(s); return e; };
  const todayRiyadh = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const fmtTime = iso => { try { const d = new Date(iso); if (isNaN(d)) return ''; return new Intl.DateTimeFormat('ar-SA', { timeZone: 'Asia/Riyadh', hour: 'numeric', minute: '2-digit' }).format(d); } catch (e) { return ''; } };
  const fmtDate = s => { if (!s) return ''; const m = String(s).match(/(\d{4})-(\d{2})-(\d{2})/); if (!m) return String(s); const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']; return AR(parseInt(m[3], 10)) + ' ' + months[parseInt(m[2], 10) - 1]; };
  const isRawanTurn = t => /rawan/i.test(String((t && t.who) || ''));

  function privileged() {
    const b = document.body.dataset;
    return b.role === 'owner' || !!b.rawan || !!window.__isBoss;
  }
  function rizqImgSrc() {
    const im = document.querySelector('#homeHead .hav img, #homeHead img');
    return im && im.getAttribute('src') ? im.getAttribute('src') : '';
  }
  function avatar(cls, who) {
    const a = el('div', cls + ' ' + who);
    const src = who === 'rizq' ? rizqImgSrc() : '';
    if (src) { const im = document.createElement('img'); im.src = src; im.alt = ''; a.appendChild(im); }
    else a.textContent = 'R';
    return a;
  }
  function openChat(persona, prefill) {
    try {
      if (typeof window.__setPersonaUI === 'function') window.__setPersonaUI(persona, true);
      else if (typeof window.__openAI === 'function') window.__openAI(true);
      else { const h = persona === 'rawan' ? $('homeHead2') : $('homeHead'); if (h) h.click(); }
      if (prefill) { const q = $('aiQ'); if (q) { q.value = prefill; q.dispatchEvent(new Event('input', { bubbles: true })); } }
    } catch (e) {}
  }

  /* ---------- state ---------- */
  const S = { docs: [], tab: 'night', sheet: null, card: null };
  const sorted = () => S.docs.slice().sort((a, b) => String(b.createdAt || b.date || b.id).localeCompare(String(a.createdAt || a.date || a.id)));
  const latestNight = () => sorted().find(d => String(d.phase) === '1') || null;
  const latestZero = () => sorted().find(d => String(d.phase) === '0' && /^phase0/.test(String(d.id))) || sorted().find(d => String(d.phase) === '0') || null;
  const latestAny = () => latestNight() || sorted()[0] || null;

  /* ---------- الغرفة المطوية ---------- */
  function buildCard(wrap) {
    const card = el('div'); card.id = 'agentRoom';
    card.setAttribute('role', 'button'); card.tabIndex = 0;
    const inn = el('div', 'arIn');
    const top = el('div', 'arTop');
    const dot = el('span', 'arDot');
    const chev = el('span', 'arChev', SVG.chev);
    top.append(dot, chev);
    const seats = el('div', 'arSeats');
    const s1 = el('button', 'arSeat'); s1.type = 'button'; s1.setAttribute('aria-label', 'كلّم Rizq AI');
    s1.append(avatar('arAv', 'rizq'), txt('div', 'arName', 'Rizq AI'));
    s1.addEventListener('click', e => { e.stopPropagation(); openChat('rizq'); });
    const link = el('div', 'arLink');
    const s2 = el('button', 'arSeat'); s2.type = 'button'; s2.setAttribute('aria-label', 'كلّم Rawan AI');
    s2.append(avatar('arAv', 'rawan'), txt('div', 'arName', 'Rawan AI'));
    s2.addEventListener('click', e => { e.stopPropagation(); openChat('rawan'); });
    seats.append(s1, link, s2);
    const cnt = el('div', 'arCount');
    const pill = el('div', 'arPill'); pill.innerHTML = SVG.bulb; const pb = el('b'); const ps = txt('span', '', 'توصيات'); pill.append(pb, ps);
    cnt.append(pill);
    inn.append(top, seats, cnt);
    card.append(inn);
    card.addEventListener('click', () => openSheet());
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(); } });
    S.card = { card, link, pb, ps };
    const h1 = $('homeHead'), h2 = $('homeHead2');
    if (h1) h1.hidden = true; if (h2) h2.hidden = true;
    const anchor = $('homeMeta') || $('hub');
    if (anchor && anchor.parentNode === wrap) wrap.insertBefore(card, anchor); else wrap.prepend(card);
    paintCard();
  }
  function paintCard() {
    if (!S.card) return;
    const d = latestAny();
    const live = !!(d && String(d.date || '') === todayRiyadh());
    S.card.card.classList.toggle('live', live);
    S.card.link.innerHTML = SVG.link(live);
    const n = d && Array.isArray(d.recs) ? d.recs.length : 0;
    S.card.pb.textContent = AR(n);
    S.card.ps.textContent = n === 1 ? 'توصية' : (n === 2 ? 'توصيتان' : 'توصيات');
  }

  /* ---------- الغرفة المقفلة (مدير بدون وكيل) ---------- */
  function buildLocked(wrap) {
    const card = el('div', 'locked'); card.id = 'agentRoom';
    const inn = el('div', 'arIn');
    const ghost = el('div', 'arGhost', '<div class="g1"><i style="background:#2f6fd6"></i><i style="background:#6d4fd8"></i></div><div class="g2"></div><div class="g3"></div>');
    ghost.setAttribute('aria-hidden', 'true');
    const top = el('div', 'arTop');
    const title = el('div', 'arTitle', SVG.room); title.append(txt('span', '', 'غرفة الوكلاء'));
    const tag = el('div', 'arTag', SVG.lock(12)); tag.append(txt('span', '', 'خاصة'));
    top.append(title, tag);
    const lock = el('div', 'arLock');
    const lk = el('div', 'lk', SVG.lock(24));
    lock.append(lk, txt('h3', '', 'غرفة وكلاء الذكاء الاصطناعي'), txt('p', '', 'ما عندك وكيل خاص بعد. الوكلاء وحوارهم ملك أبو راكان، ويشوفها هو وروان العنزي.'));
    const row = el('div', 'arBtnRow');
    const btn = txt('button', 'arBtn', 'اسأل Rizq AI عن مهامي'); btn.type = 'button';
    btn.addEventListener('click', () => openChat('rizq'));
    row.append(btn, txt('span', 'arMuted', 'طلب وكيل: من أبو راكان'));
    inn.append(ghost, top, lock, row);
    card.append(inn);
    const h1 = $('homeHead'); if (h1) h1.hidden = true;
    const anchor = $('homeMeta') || $('hub');
    if (anchor && anchor.parentNode === wrap) wrap.insertBefore(card, anchor); else wrap.prepend(card);
  }

  /* ---------- الغرفة المفتوحة ---------- */
  function buildSheet() {
    const sh = el('div'); sh.id = 'agentSheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', 'غرفة الوكلاء');
    const bg = el('div', 'asBg'); bg.addEventListener('click', closeSheet);
    const frame = el('div', 'asFrame');
    const inn = el('div', 'asIn');
    inn.append(el('div', 'asGrip', '<i></i>'));
    const head = el('div', 'asHead');
    const who = el('div', 'asWho');
    const avs = el('div', 'asAvs'); avs.append(avatar('asAv', 'rizq'), avatar('asAv', 'rawan'));
    const t = el('div', 'asT'); t.append(txt('b', '', 'غرفة الوكلاء'), txt('span', '', 'Rizq AI و Rawan AI · تشوفها أنت وروان بس'));
    who.append(avs, t);
    const close = el('button', 'asClose', SVG.close); close.type = 'button'; close.setAttribute('aria-label', 'إغلاق الغرفة'); close.addEventListener('click', closeSheet);
    head.append(who, close);
    const tabs = el('div', 'asTabs');
    const TABS = [['night', 'الليلة'], ['zero', 'المرحلة صفر'], ['recs', 'التوصيات'], ['lessons', 'الدروس']];
    const tabEls = {};
    TABS.forEach(([k, label]) => { const b = txt('button', 'asTab', label); b.type = 'button'; b.addEventListener('click', () => { S.tab = k; paintSheet(); }); tabs.append(b); tabEls[k] = b; });
    const when = el('div', 'asWhen'); const wi1 = el('i'), wi2 = el('i'); const ws = el('span'); when.append(wi1, ws, wi2);
    const log = el('div', 'asLog');
    const foot = el('div', 'asFoot');
    const pin = el('div', 'asPin'); pin.setAttribute('role', 'button'); pin.tabIndex = 0;
    const pinT = el('div'); const pinS = txt('small', '', 'أهم توصية مشتركة لأبو راكان'); const pinB = el('b'); pinT.append(pinS, pinB);
    pin.append(pinT, el('span', '', SVG.chev));
    pin.addEventListener('click', () => { S.tab = 'recs'; paintSheet(); });
    const ask = el('div', 'asAsk');
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'اسأل الوكيلتين أو وجّه الجلسة…'; inp.setAttribute('aria-label', 'اسأل الوكيلتين');
    const sendB = el('button', '', SVG.send); sendB.type = 'button'; sendB.setAttribute('aria-label', 'إرسال');
    const go = () => { const v = inp.value.trim(); closeSheet(); openChat('rizq', v); inp.value = ''; };
    sendB.addEventListener('click', go); inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    ask.append(inp, sendB);
    foot.append(pin, ask);
    inn.append(head, tabs, when, log, foot);
    frame.append(inn);
    sh.append(bg, el('div', 'asGlow1'), el('div', 'asGlow2'), frame);
    document.body.append(sh);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && sh.classList.contains('open')) closeSheet(); });
    S.sheet = { sh, tabEls, ws, log, pin, pinB, tabs };
  }
  function openSheet() { if (!S.sheet) buildSheet(); paintSheet(); S.sheet.sh.classList.add('open'); document.body.classList.add('arsheet'); }
  function closeSheet() { if (!S.sheet) return; S.sheet.sh.classList.remove('open'); document.body.classList.remove('arsheet'); }

  function turnRow(t) {
    const r = isRawanTurn(t);
    const row = el('div', 'asMsg ' + (r ? 'rawan' : 'rizq'));
    const av = avatar('mav', r ? 'rawan' : 'rizq');
    const mb = el('div', 'mb');
    mb.append(txt('div', 'mn', r ? 'Rawan AI' : 'Rizq AI'), txt('div', 'mt', t.text || ''));
    const tm = fmtTime(t.at); if (tm) mb.append(txt('div', 'mw', tm));
    row.append(av, mb);
    return row;
  }
  function paintSheet() {
    if (!S.sheet) return;
    const { tabEls, ws, log, pin, pinB } = S.sheet;
    Object.keys(tabEls).forEach(k => tabEls[k].classList.toggle('on', k === S.tab));
    const night = latestNight(), zero = latestZero(), any = latestAny();
    const src = S.tab === 'zero' ? zero : (night || any);
    log.innerHTML = '';
    const nRecs = night && Array.isArray(night.recs) ? night.recs.length : 0;
    tabEls.recs.textContent = nRecs ? 'التوصيات ' + AR(nRecs) : 'التوصيات';
    if (!src) {
      ws.textContent = 'ما فيه جلسة بعد';
      log.append(txt('div', 'asEmpty', 'الوكيلتان ما التقتا بعد. أول مجلس ليلي ينكتب هنا تلقائياً.'));
      pin.hidden = true;
      return;
    }
    ws.textContent = (src.title || 'جلسة') + ' · ' + fmtDate(src.date) + (src.createdAt ? ' · ' + fmtTime(src.createdAt) : '');
    if (S.tab === 'night' || S.tab === 'zero') {
      const turns = Array.isArray(src.turns) ? src.turns : [];
      if (src.intro) { const b = el('div', 'asBox'); b.append(txt('p', '', src.intro)); log.append(b); }
      if (!turns.length) log.append(txt('div', 'asEmpty', 'ما فيه رسائل في هالجلسة.'));
      turns.forEach(t => log.append(turnRow(t)));
    } else if (S.tab === 'recs') {
      const recs = Array.isArray(src.recs) ? src.recs : [];
      if (!recs.length) log.append(txt('div', 'asEmpty', 'ما فيه توصيات مشتركة في هالجلسة.'));
      recs.forEach((r, i) => {
        const b = el('div', 'asBox');
        b.append(txt('b', '', AR(i + 1) + '. ' + (r.title || '')));
        if (r.why) { const p = el('p'); p.append(txt('span', 'k', 'ليش: ')); p.append(document.createTextNode(r.why)); b.append(p); }
        if (r.owner) { const p = el('p'); p.append(txt('span', 'k', 'المالك: ')); p.append(document.createTextNode(r.owner)); b.append(p); }
        if (r.decision) { const p = el('p'); p.append(txt('span', 'k', 'القرار المطلوب: ')); p.append(document.createTextNode(r.decision)); b.append(p); }
        log.append(b);
      });
    } else {
      const ls = Array.isArray(src.lessons) ? src.lessons : [];
      if (!ls.length) log.append(txt('div', 'asEmpty', 'ما فيه دروس في هالجلسة.'));
      ls.forEach((l, i) => { const b = el('div', 'asBox lesson'); b.append(txt('b', '', 'درس ' + AR(i + 1))); b.append(txt('p', '', l)); log.append(b); });
    }
    const top = night && Array.isArray(night.recs) && night.recs[0];
    pin.hidden = !top; if (top) pinB.textContent = top.title || '';
    log.scrollTop = 0;
  }

  /* ---------- قسم مجلس الوكلاء → بيئة التعليم ---------- */
  function adaptCouncil() {
    const sec = $('councilSec'); if (!sec || sec.dataset.arDone) return;
    sec.dataset.arDone = '1';
    const h = sec.querySelector('h1'); if (h) h.textContent = 'مجلس الوكلاء · بيئة التعليم';
    const hint = sec.querySelector('p.hint'); if (hint) hint.textContent = 'هنا يُعلَّم أي وكيل جديد: أبو راكان يدخل معه، يعلّمه ويتعلم منه، وينقل له معلومات الوكلاء اللي سمح بنقلها. الحوار اليومي بين الوكلاء في غرفة الوكلاء فوق.';
    const note = el('div', 'arNote'); note.setAttribute('role', 'button'); note.tabIndex = 0;
    note.append(txt('span', '', 'المجلس الليلي والمرحلة صفر انتقلوا لغرفة الوكلاء في أعلى اللوحة'), el('span', '', SVG.chev));
    note.addEventListener('click', () => { openSheet(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    (hint || h || sec).after(note);
    const mark = () => sec.querySelectorAll('details.cday').forEach(d => { const b = d.querySelector('summary b'); if (b && /^مجلس اليوم/.test(b.textContent.trim())) d.classList.add('arDaily'); });
    mark(); new MutationObserver(mark).observe(sec, { childList: true, subtree: true });
  }

  /* ---------- تشغيل ---------- */
  function waitFor(fn, ms) { return new Promise(res => { const t0 = Date.now(); (function p() { let v = null; try { v = fn(); } catch (e) {} if (v) return res(v); if (Date.now() - t0 > (ms || 20000)) return res(null); setTimeout(p, 150); })(); }); }

  (async () => {
    const wrap = await waitFor(() => { const h = $('homeHead'); return h && h.parentNode && h.parentNode.classList && h.parentNode.classList.contains('wrap') ? h.parentNode : (h ? h.parentNode : null); });
    if (!wrap) return;
    if (!privileged()) { buildLocked(wrap); return; }
    buildCard(wrap);
    waitFor(() => $('councilSec'), 30000).then(s => { if (s) adaptCouncil(); });
    try {
      const db = window.claude && window.claude.use ? await window.claude.use('db') : null;
      if (db) {
        db.collection('council').onSnapshot(sn => { S.docs = (sn.docs || []).map(x => Object.assign({}, x.data(), { id: x.id })); paintCard(); if (S.sheet && S.sheet.sh.classList.contains('open')) paintSheet(); }, () => {});
      } else if (window.sb) {
        const { data } = await window.sb.from('docs').select('id,data').eq('collection', 'council');
        S.docs = (data || []).map(r => Object.assign({}, r.data, { id: r.id })); paintCard();
      }
    } catch (e) {}
  })();
})();
