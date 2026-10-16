/* غرفة الوكلاء — الشريط العلوي الزجاجي (v12)
   يشتغل فوق native.js: يستبدل بطاقتي Rizq AI وRawan AI بغرفة زجاجية وحدة لأبو راكان وروان،
   ويعرض غرفة مقفلة لأي زميل ما عنده وكيل. البيانات من collection council وsettings/agents.
   v12: البيئة التعليمية بنفس شكل الغرفة: فيها Rizq AI وRawan AI وكل وكيل جديد (أولهم د. ناصر AI)،
   يشوفها أبو راكان وروان ود. ناصر، وتبويب «من في البيئة» يعرض مين يعلّم ومين يتعلم.
   غرفة الوكلاء تبقى لـ Rizq AI وRawan AI فقط. */
(function(){
  'use strict';
  if (window.__agentRoomLoaded) return; window.__agentRoomLoaded = true;

  const $ = id => document.getElementById(id);
  const SVG = {
    chev: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
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
  const personaOf = who => { const w = String(who || ''); if (/rawan/i.test(w)) return 'rawan'; if (/nasser|ناصر/i.test(w)) return 'nasser'; if (/rizq/i.test(w)) return 'rizq'; return 'guest'; };
  const AGENT_DEFAULTS = [
    { id: 'rizq', name: 'Rizq AI', room: 'room', role: 'السوبر إيجنت ومنسّق اللوحة' },
    { id: 'rawan', name: 'Rawan AI', room: 'room', role: 'المساعدة التنفيذية الخاصة بروان العنزي' }
  ];

  function privileged() {
    const b = document.body.dataset;
    return b.role === 'owner' || !!b.rawan || !!window.__isBoss;
  }
  function isNasser() { return !!document.body.dataset.nasser; }
  function rizqImgSrc() {
    const im = document.querySelector('#homeHead .hav img, #homeHead img');
    return im && im.getAttribute('src') ? im.getAttribute('src') : '';
  }
  function avatar(cls, who, label) {
    const a = el('div', cls + ' ' + who);
    const src = who === 'rizq' ? rizqImgSrc() : '';
    if (src) { const im = document.createElement('img'); im.src = src; im.alt = ''; a.appendChild(im); }
    else a.textContent = label || (who === 'nasser' ? 'N' : (who === 'rawan' ? 'R' : (who === 'rizq' ? 'R' : 'A')));
    return a;
  }
  function agentInitial(ag) { if (ag.id === 'rizq' || ag.id === 'rawan') return 'R'; if (ag.id === 'nasser' || /nasser|ناصر/i.test(String(ag.name || ''))) return 'N'; const m = String(ag.name || '').replace(/\bAI\b/g, '').match(/[A-Za-z]/); return m ? m[0].toUpperCase() : 'A'; }
  function openChat(persona, prefill) {
    try {
      if (typeof window.__setPersonaUI === 'function') window.__setPersonaUI(persona, true);
      else if (typeof window.__openAI === 'function') window.__openAI(true);
      else { const h = persona === 'rawan' ? $('homeHead2') : $('homeHead'); if (h) h.click(); }
      if (prefill) { const q = $('aiQ'); if (q) { q.value = prefill; q.dispatchEvent(new Event('input', { bubbles: true })); } }
    } catch (e) {}
  }

  /* ---------- state ---------- */
  const S = { docs: [], tab: 'night', sheet: null, card: null, mode: 'room', agents: AGENT_DEFAULTS.slice(), classId: null, learn: null };
  const agentList = () => (Array.isArray(S.agents) && S.agents.length ? S.agents : AGENT_DEFAULTS);
  const teachers = () => agentList().filter(a => a.id === 'rizq' || a.id === 'rawan');
  const learners = () => agentList().filter(a => a.id !== 'rizq' && a.id !== 'rawan' && String(a.room || 'classroom') === 'classroom' && String(a.status || 'active') !== 'pending');
  const isClassDoc = d => String(d.room || '') === 'classroom' || /^onboard-/.test(String(d.id || '')) || !!d.agent;
  const classDocs = () => sorted().filter(isClassDoc);
  const classSessions = () => { const c = classDocs(); return c.length ? c : sorted().filter(d => String(d.phase) === '0'); };
  const currentClass = () => { const list = classSessions(); if (!list.length) return null; return (S.classId && list.find(d => d.id === S.classId)) || list[0]; };
  const sorted = () => S.docs.slice().sort((a, b) => String(b.createdAt || b.date || b.id).localeCompare(String(a.createdAt || a.date || a.id)));
  const latestNight = () => sorted().find(d => String(d.phase) === '1' && Array.isArray(d.recs) && d.recs.length) || sorted().find(d => String(d.phase) === '1') || sorted().find(d => Array.isArray(d.recs) && d.recs.length) || null;
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
    /* بيئة تعليم الوكيل الجديد (الشريحة الثانية): نفس شكل الغرفة، فيها المعلّمين والوكيل اللي يتعلم */
    const learn = buildLearnCard();
    const deck = el('div'); deck.id = 'agentDeck';
    const track = el('div', 'adTrack'); track.append(card, learn);
    const dots = el('div', 'adDots'); const d1 = el('i', 'on'), d2 = el('i'); dots.append(d1, d2);
    track.addEventListener('scroll', () => { const second = Math.abs(track.scrollLeft) > track.clientWidth * 0.45; d1.classList.toggle('on', !second); d2.classList.toggle('on', second); }, { passive: true });
    deck.append(track, dots);
    S.card = { card, link, pb, ps };
    const h1 = $('homeHead'), h2 = $('homeHead2');
    if (h1) { h1.hidden = true; h1.classList.add('arHide'); } if (h2) { h2.hidden = true; h2.classList.add('arHide'); }
    const anchor = $('homeMeta') || $('hub');
    if (anchor && anchor.parentNode === wrap) wrap.insertBefore(deck, anchor); else wrap.prepend(deck);
    paintCard();
  }
  function buildLearnCard() {
    const learn = el('div'); learn.id = 'agentLearn'; learn.setAttribute('role', 'button'); learn.tabIndex = 0;
    const lin = el('div', 'alIn');
    const ltop = el('div', 'alTop');
    const dot = el('span', 'alDot');
    const ltitle = el('div', 'alTitle', SVG.room); ltitle.append(txt('span', '', 'البيئة التعليمية'));
    const lcount = txt('span', 'alTag', '');
    ltop.append(dot, ltitle, lcount);
    const seats = el('div', 'alSeats');
    const lbody = el('div', 'alBody');
    const ltxt = el('div', 'alTxt'); const lb = el('b'); const lp = el('p'); ltxt.append(lb, lp);
    lbody.append(ltxt);
    const lbtn = txt('button', 'alBtn', 'افتح البيئة التعليمية'); lbtn.type = 'button';
    const openLearn = () => openSheet('class');
    lbtn.addEventListener('click', e => { e.stopPropagation(); openLearn(); });
    learn.addEventListener('click', openLearn);
    learn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLearn(); } });
    lin.append(ltop, seats, lbody, lbtn);
    learn.append(lin);
    S.learn = { learn, dot, lcount, seats, lb, lp };
    paintLearn();
    return learn;
  }
  function seatFor(ag, role) {
    const b = el('button', 'alSeat ' + (role || '')); b.type = 'button'; b.setAttribute('aria-label', ag.name);
    const who = ag.id === 'rizq' || ag.id === 'rawan' || ag.id === 'nasser' ? ag.id : 'guest';
    b.append(avatar('alAv', who, agentInitial(ag)), txt('div', 'alName', ag.name), txt('div', 'alRole', role === 'learner' ? 'يتعلم' : 'يعلّم'));
    b.addEventListener('click', e => { e.stopPropagation(); S.tab = 'who'; openSheet('class'); });
    return b;
  }
  function paintLearn() {
    if (!S.learn) return;
    const { learn, dot, lcount, seats, lb, lp } = S.learn;
    const L = learners(), T = teachers();
    const sessions = classSessions();
    const cur = sessions[0];
    const live = !!(cur && String(cur.date || '') === todayRiyadh());
    learn.classList.toggle('live', live);
    seats.innerHTML = '';
    T.forEach(a => seats.append(seatFor(a, 'teacher')));
    if (L.length) { seats.append(el('div', 'alArrow', SVG.chev)); L.forEach(a => seats.append(seatFor(a, 'learner'))); }
    else { const empty = el('div', 'alSeat empty', '<div class="alAv dashed"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3ed0b8" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div>'); empty.append(txt('div', 'alName', 'وكيل جديد'), txt('div', 'alRole', 'بانتظاره')); seats.append(empty); }
    const names = L.map(a => a.name).join(' و');
    if (L.length) { lb.textContent = names + (L.length === 1 ? ' يتعلم هنا' : ' يتعلمون هنا'); lp.textContent = 'Rizq AI وRawan AI يعلّمانه مراحله هنا، ويبقى في البيئة التعليمية لين ينقله أبو راكان لغرفة الوكلاء.'; }
    else { lb.textContent = 'ما فيه وكيل جديد بعد'; lp.textContent = 'يوم يُخلق وكيل، يدخل هنا، وRizq AI وRawan AI يعلّمانه ويستلم معلومات الوكلاء اللي سمح أبو راكان بنقلها.'; }
    const n = sessions.length;
    lcount.textContent = (L.length ? AR(L.length) + (L.length === 1 ? ' وكيل يتعلم' : ' وكلاء يتعلمون') : 'جاهزة') + (n ? ' · ' + AR(n) + (n === 1 ? ' جلسة' : ' جلسات') : '');
  }
  /* د. ناصر: شريط فيه البيئة التعليمية بس (بدون غرفة الوكلاء) */
  function buildNasserDeck(wrap) {
    const learn = buildLearnCard();
    const deck = el('div'); deck.id = 'agentDeck'; deck.classList.add('classOnly');
    const track = el('div', 'adTrack'); track.append(learn);
    deck.append(track);
    const anchor = $('homeMeta') || $('hub');
    if (anchor && anchor.parentNode === wrap) wrap.insertBefore(deck, anchor); else wrap.prepend(deck);
  }
  function paintCard() {
    paintLearn();
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
    const req = txt('button', 'arBtn primary', 'اطلب وكيل ذكاء اصطناعي'); req.type = 'button';
    req.addEventListener('click', () => openChat('rizq', 'أبي أطلب من أبو راكان وكيل ذكاء اصطناعي خاص فيني لقسمي.'));
    const btn = txt('button', 'arBtn', 'اسأل Rizq AI'); btn.type = 'button';
    btn.addEventListener('click', () => openChat('rizq'));
    row.append(req, btn);
    inn.append(ghost, top, lock, row);
    card.append(inn);
    const h1 = $('homeHead'); if (h1) { h1.hidden = true; h1.classList.add('arHide'); }
    const anchor = $('homeMeta') || $('hub');
    if (anchor && anchor.parentNode === wrap) wrap.insertBefore(card, anchor); else wrap.prepend(card);
  }

  /* ---------- الغرفة المفتوحة ---------- */
  function buildSheet() {
    const sh = el('div'); sh.id = 'agentSheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', 'غرفة الوكلاء');
    const bg = el('div', 'asBg'); bg.addEventListener('click', closeSheet);
    const frame = el('div', 'asFrame');
    const inn = el('div', 'asIn');
    const grip = el('div', 'asGrip', '<i></i>'); grip.setAttribute('aria-hidden', 'true');
    grip.addEventListener('click', closeSheet);
    inn.append(grip);
    const head = el('div', 'asHead');
    const who = el('div', 'asWho');
    const avs = el('div', 'asAvs');
    const t = el('div', 'asT'); const tb = el('b'); const tsp = el('span'); t.append(tb, tsp);
    who.append(avs, t);
    const close = el('button', 'asClose'); close.type = 'button'; close.setAttribute('aria-label', 'إغلاق الغرفة');
    close.append(txt('span', 'asX', '✕'));
    close.addEventListener('click', e => { e.stopPropagation(); closeSheet(); });
    head.append(who, close);
    const tabs = el('div', 'asTabs');
    const TABS = [['night', 'الليلة', 'room'], ['zero', 'المرحلة صفر', 'room'], ['recs', 'التوصيات', 'room'], ['lessons', 'الدروس', 'both'], ['sess', 'الجلسة', 'class'], ['who', 'من في البيئة', 'class']];
    const tabEls = {}, tabMode = {};
    TABS.forEach(([k, label, m]) => { const b = txt('button', 'asTab', label); b.type = 'button'; b.addEventListener('click', () => { S.tab = k; paintSheet(); }); tabs.append(b); tabEls[k] = b; tabMode[k] = m; });
    const when = el('div', 'asWhen'); const wi1 = el('i'), wi2 = el('i'); const ws = el('span'); when.append(wi1, ws, wi2);
    const log = el('div', 'asLog');
    const foot = el('div', 'asFoot');
    const pin = el('div', 'asPin'); pin.setAttribute('role', 'button'); pin.tabIndex = 0;
    const pinT = el('div'); const pinS = txt('small', '', 'أهم توصية مشتركة لأبو راكان'); const pinB = el('b'); pinT.append(pinS, pinB);
    pin.append(pinT, el('span', '', SVG.chev));
    pin.addEventListener('click', () => { S.tab = 'recs'; paintSheet(); });
    const ask = el('div', 'asAsk');
    const inp = document.createElement('input'); inp.type = 'text'; inp.placeholder = 'اسأل الوكيلتين أو وجّه الجلسة…'; inp.setAttribute('aria-label', 'اسأل الوكلاء');
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

    /* v11: سحب الغرفة لتحت يقفلها (من الرأس أو التبويبات، أو من المحتوى لما يكون في أوله) */
    let y0 = null, dy = 0, dragging = false;
    const canDrag = tgt => {
      if (!tgt || !tgt.closest) return true;
      if (tgt.closest('.asFoot') || tgt.closest('.asClose')) return false;
      if (tgt.closest('.asLog')) return log.scrollTop <= 0;
      return true;
    };
    frame.addEventListener('touchstart', e => {
      if (e.touches.length !== 1 || !canDrag(e.target)) { y0 = null; return; }
      y0 = e.touches[0].clientY; dy = 0; dragging = false;
    }, { passive: true });
    frame.addEventListener('touchmove', e => {
      if (y0 == null) return;
      dy = e.touches[0].clientY - y0;
      if (!dragging && dy > 8) { dragging = true; frame.style.transition = 'none'; }
      if (dragging) { if (e.cancelable) e.preventDefault(); frame.style.transform = 'translateY(' + Math.max(0, dy - 8) + 'px)'; }
    }, { passive: false });
    const endDrag = () => {
      if (y0 == null) return;
      y0 = null; frame.style.transition = '';
      if (dragging && dy > 110) closeSheet(); else frame.style.transform = '';
      dragging = false;
    };
    frame.addEventListener('touchend', endDrag); frame.addEventListener('touchcancel', endDrag);

    S.sheet = { sh, frame, tabEls, tabMode, ws, log, pin, pinB, tabs, avs, tb, tsp, inp };
  }
  function openSheet(mode) {
    if (!S.sheet) buildSheet();
    S.mode = mode === 'class' ? 'class' : 'room';
    const tm = S.sheet.tabMode[S.tab];
    if (S.mode === 'class' && !(tm === 'class' || tm === 'both')) S.tab = 'sess';
    if (S.mode === 'room' && !(tm === 'room' || tm === 'both')) S.tab = 'night';
    S.sheet.frame.style.transform = ''; paintSheet(); S.sheet.sh.classList.add('open'); document.body.classList.add('arsheet');
  }
  function closeSheet() { if (!S.sheet) return; S.sheet.sh.classList.remove('open'); document.body.classList.remove('arsheet'); S.sheet.frame.style.transform = ''; }

  function turnRow(t) {
    const p = personaOf(t && t.who);
    const row = el('div', 'asMsg ' + p);
    const av = avatar('mav', p, p === 'guest' ? agentInitial({ name: t.who }) : undefined);
    const mb = el('div', 'mb');
    mb.append(txt('div', 'mn', p === 'rawan' ? 'Rawan AI' : (p === 'rizq' ? 'Rizq AI' : String(t.who || ''))), txt('div', 'mt', t.text || ''));
    const tm = fmtTime(t.at); if (tm) mb.append(txt('div', 'mw', tm));
    row.append(av, mb);
    return row;
  }
  function paintHead() {
    const { sh, avs, tb, tsp, inp } = S.sheet;
    const cls = S.mode === 'class';
    sh.classList.toggle('classroom', cls);
    sh.setAttribute('aria-label', cls ? 'البيئة التعليمية' : 'غرفة الوكلاء');
    avs.innerHTML = '';
    if (cls) {
      teachers().forEach(a => avs.append(avatar('asAv', a.id)));
      learners().forEach(a => avs.append(avatar('asAv', a.id === 'nasser' ? 'nasser' : 'guest', agentInitial(a))));
      const L = learners();
      tb.textContent = 'البيئة التعليمية';
      tsp.textContent = (L.length ? 'Rizq AI وRawan AI يعلّمان ' + L.map(a => a.name).join(' و') : 'Rizq AI وRawan AI · ما فيه وكيل جديد بعد') + ' · يشوفها أبو راكان وروان ود. ناصر';
      inp.placeholder = 'وجّه الجلسة التعليمية…';
    } else {
      avs.append(avatar('asAv', 'rizq'), avatar('asAv', 'rawan'));
      tb.textContent = 'غرفة الوكلاء';
      tsp.textContent = 'Rizq AI و Rawan AI · تشوفها أنت وروان بس';
      inp.placeholder = 'اسأل الوكيلتين أو وجّه الجلسة…';
    }
  }
  function roomLabel(ag) { return String(ag.room || 'classroom') === 'room' ? 'غرفة الوكلاء' : 'البيئة التعليمية'; }
  function paintClass() {
    const { tabEls, ws, log, pin } = S.sheet;
    const sessions = classSessions();
    const cur = currentClass();
    pin.hidden = true;
    const L = learners();
    tabEls.who.textContent = 'من في البيئة ' + AR(agentList().length);
    if (S.tab === 'who') {
      ws.textContent = 'الوكلاء ومكان كل واحد · النقل من البيئة التعليمية لغرفة الوكلاء بيد أبو راكان';
      const box = el('div', 'asBox');
      box.append(txt('b', '', 'موجودين الحين في البيئة التعليمية'));
      box.append(txt('p', '', (teachers().map(a => a.name).join(' و') || 'Rizq AI وRawan AI') + ' يعلّمان' + (L.length ? '، و' + L.map(a => a.name).join(' و') + (L.length === 1 ? ' يتعلم.' : ' يتعلمون.') : '، وما فيه وكيل جديد بعد.')));
      log.append(box);
      agentList().forEach(a => {
        const who = a.id === 'rizq' || a.id === 'rawan' || a.id === 'nasser' ? a.id : 'guest';
        const card = el('div', 'asAgent ' + who);
        card.append(avatar('aav', who, agentInitial(a)));
        const body = el('div', 'ab');
        const nm = el('div', 'an'); nm.append(txt('b', '', a.name));
        const isT = a.id === 'rizq' || a.id === 'rawan';
        nm.append(txt('span', 'tag ' + (isT ? 'teach' : 'learn'), isT ? 'يعلّم' : (String(a.status || '') === 'pending' ? 'بانتظار التفعيل' : 'يتعلم · نشط')));
        body.append(nm);
        if (a.role) body.append(txt('p', '', a.role));
        const where = el('p', 'aw'); where.append(txt('span', 'k', 'مكانه: ')); where.append(document.createTextNode(roomLabel(a))); body.append(where);
        if (a.stage) { const p = el('p', 'aw'); p.append(txt('span', 'k', 'المرحلة: ')); p.append(document.createTextNode(a.stage)); body.append(p); }
        if (a.access) { const p = el('p', 'aw'); p.append(txt('span', 'k', 'صلاحيته: ')); p.append(document.createTextNode(a.access)); body.append(p); }
        card.append(body);
        log.append(card);
      });
      return;
    }
    if (!cur) {
      ws.textContent = 'ما فيه جلسة تعليم بعد';
      log.append(txt('div', 'asEmpty', 'أول ما يدخل وكيل جديد، Rizq AI وRawan AI يعلّمانه هنا وتنكتب الجلسة تلقائياً.'));
      return;
    }
    ws.textContent = (cur.title || 'جلسة تعليم') + ' · ' + fmtDate(cur.date) + (cur.createdAt ? ' · ' + fmtTime(cur.createdAt) : '');
    if (sessions.length > 1) {
      const pick = el('div', 'asPick');
      sessions.slice(0, 8).forEach(d => { const b = txt('button', 'asChip' + (d.id === cur.id ? ' on' : ''), (d.title || d.id).replace(/^المرحلة\s*/, '').slice(0, 34) + ' · ' + fmtDate(d.date)); b.type = 'button'; b.addEventListener('click', () => { S.classId = d.id; paintSheet(); }); pick.append(b); });
      log.append(pick);
    }
    if (S.tab === 'lessons') {
      const ls = Array.isArray(cur.lessons) ? cur.lessons : [];
      if (!ls.length) log.append(txt('div', 'asEmpty', 'ما فيه دروس في هالجلسة.'));
      ls.forEach((l, i) => { const b = el('div', 'asBox lesson'); b.append(txt('b', '', 'درس ' + AR(i + 1))); b.append(txt('p', '', l)); log.append(b); });
      return;
    }
    const turns = Array.isArray(cur.turns) ? cur.turns : [];
    if (cur.intro) { const b = el('div', 'asBox'); b.append(txt('p', '', cur.intro)); log.append(b); }
    if (!turns.length) log.append(txt('div', 'asEmpty', 'ما فيه رسائل في هالجلسة.'));
    turns.forEach(t => log.append(turnRow(t)));
  }
  function paintSheet() {
    if (!S.sheet) return;
    const { tabEls, tabMode, ws, log, pin, pinB } = S.sheet;
    paintHead();
    Object.keys(tabEls).forEach(k => { const m = tabMode[k]; tabEls[k].hidden = !(m === 'both' || m === S.mode); tabEls[k].classList.toggle('on', k === S.tab); });
    log.innerHTML = '';
    if (S.mode === 'class') { paintClass(); log.scrollTop = 0; return; }
    const night = latestNight(), zero = latestZero(), any = latestAny();
    const src = S.tab === 'zero' ? zero : (night || any);
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
    const hint = sec.querySelector('p.hint'); if (hint) hint.textContent = 'البيئة التعليمية في أعلى اللوحة: فيها Rizq AI وRawan AI وكل وكيل جديد يتعلم، ويبقى فيها لين ينقله أبو راكان لغرفة الوكلاء.';
    const note = el('div', 'arNote'); note.setAttribute('role', 'button'); note.tabIndex = 0;
    note.append(txt('span', '', 'افتح البيئة التعليمية (الشريط العلوي)'), el('span', '', SVG.chev));
    note.addEventListener('click', () => { openSheet('class'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    (hint || h || sec).after(note);
    const mark = () => sec.querySelectorAll('details.cday').forEach(d => { const b = d.querySelector('summary b'); if (b && /^مجلس اليوم/.test(b.textContent.trim())) d.classList.add('arDaily'); });
    mark(); new MutationObserver(mark).observe(sec, { childList: true, subtree: true });
  }

  /* ---------- تشغيل ---------- */
  function waitFor(fn, ms) { return new Promise(res => { const t0 = Date.now(); (function p() { let v = null; try { v = fn(); } catch (e) {} if (v) return res(v); if (Date.now() - t0 > (ms || 600000)) return res(null); setTimeout(p, 200); })(); }); }

  function deepFind(id, root) {
    root = root || document;
    try { const d = root.getElementById ? root.getElementById(id) : root.querySelector('#' + id); if (d) return d; } catch (e) {}
    const all = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (const n of all) { if (n.shadowRoot) { const f = deepFind(id, n.shadowRoot); if (f) return f; } }
    return null;
  }
  (async () => {
    try { console.log('[agentRoom] v12 loaded'); } catch (e) {}
    const wrap = await waitFor(() => { const h = $('homeHead') || deepFind('homeHead'); return h && h.parentNode ? h.parentNode : null; });
    if (!wrap) { try { console.warn('[agentRoom] homeHead not found'); } catch (e) {} return; }
    await waitFor(() => document.body.dataset.role || window.__isBoss || document.body.dataset.rawan || document.body.dataset.nasser, 8000);
    const nasser = isNasser();
    if (!nasser && !privileged()) { buildLocked(wrap); return; }
    if (nasser) buildNasserDeck(wrap); else buildCard(wrap);
    waitFor(() => $('councilSec'), 30000).then(s => { if (s) adaptCouncil(); });
    waitFor(() => { const hub = $('hub'); if (!hub) return null; const leaf = Array.from(hub.querySelectorAll('*')).find(n => n.children.length === 0 && /مجلس\s*الوكلاء/.test(n.textContent || '')); return leaf || null; }, 60000).then(leaf => { if (!leaf) return; let t = leaf; const hub = $('hub'); while (t && t.parentNode && t.parentNode !== hub && !(t.parentNode.children.length > 6)) t = t.parentNode; t.classList.add('arHideTile'); });
    try {
      const merge = list => { const m = {}; S.docs.forEach(d => { m[d.id] = d; }); list.forEach(d => { m[d.id] = d; }); S.docs = Object.keys(m).map(k => m[k]); paintCard(); if (S.sheet && S.sheet.sh.classList.contains('open')) paintSheet(); };
      const setAgents = d => { if (d && Array.isArray(d.agents) && d.agents.length) { S.agents = d.agents.map(a => Object.assign({}, a)); paintCard(); if (S.sheet && S.sheet.sh.classList.contains('open')) paintSheet(); } };
      if (window.sb && window.sb.from) {
        try { const { data } = await window.sb.from('docs').select('id,data').eq('collection', 'council'); if (Array.isArray(data)) merge(data.map(r => Object.assign({}, r.data || {}, { id: r.id }))); } catch (e) {}
        try { const { data } = await window.sb.from('docs').select('data').eq('collection', 'settings').eq('id', 'agents').maybeSingle(); if (data && data.data) setAgents(data.data); } catch (e) {}
      }
      const db = window.claude && window.claude.use ? await window.claude.use('db') : null;
      if (db) {
        db.collection('council').onSnapshot(sn => { try { merge((sn.docs || []).map(x => Object.assign({}, (typeof x.data === 'function' ? x.data() : x.data) || {}, { id: x.id }))); } catch (e) {} }, () => {});
        try { db.collection('settings').doc('agents').onSnapshot(sn => { try { const d = sn && sn.exists ? (typeof sn.data === 'function' ? sn.data() : sn.data) : null; setAgents(d); } catch (e) {} }, () => {}); } catch (e) {}
      }
    } catch (e) {}
  })();
})();
