/* أيقونتا «التوقعات المالية» و«الأفكار التسويقية» في لوحة رزق (v1)
   تشتغل فوق native.js: تضيف بلاطتين في #hub لأبو راكان بس، وتفتح كل واحدة صفحة زجاجية.
   البيانات: collection forecast (inputs, history, current) و marketing (campaigns-history, ideas)، والافتتاحات من branches/current. */
(function(){
  'use strict';
  if (window.__fmLoaded) return; window.__fmLoaded = true;

  const $ = id => document.getElementById(id);
  const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const txt = (tag, cls, s) => { const e = el(tag, cls); e.textContent = s == null ? '' : String(s); return e; };
  const NUM = n => { if (n == null || n === '' || isNaN(Number(n))) return '—'; try { return new Intl.NumberFormat('ar-SA-u-nu-arab', { maximumFractionDigits: 0 }).format(Number(n)); } catch (e) { return String(n); } };
  const PCT = n => (n == null || isNaN(Number(n))) ? '' : AR(Math.round(Number(n))) + '٪';
  const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const fmtDate = s => { if (!s) return ''; const m = String(s).match(/(\d{4})-(\d{2})(?:-(\d{2}))?/); if (!m) return String(s); return (m[3] ? AR(parseInt(m[3], 10)) + ' ' : '') + MONTHS[parseInt(m[2], 10) - 1] + ' ' + AR(m[1]); };
  const fmtTime = iso => { try { const d = new Date(iso); if (isNaN(d)) return ''; return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-arab', { timeZone: 'Asia/Riyadh', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(d); } catch (e) { return ''; } };
  const SVG = {
    chev: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f5f9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    close: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f3f5f9" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
    forecast: (c)=>'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="'+(c||'#7ee0c3')+'" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M4 16l5-6 4 3 7-8"/><path d="M16 5h4v4"/><path d="M14 20v-4M9 20v-6M19 20v-9" opacity=".55"/></svg>',
    marketing: (c)=>'<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="'+(c||'#ffd38a')+'" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h2l6 4V5L7 9H5a2 2 0 0 0-2 2z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a8 8 0 0 1 0 11" opacity=".6"/><path d="M8 15l1 5" opacity=".7"/></svg>'
  };
  function waitFor(fn, ms) { return new Promise(res => { const t0 = Date.now(); (function p() { let v = null; try { v = fn(); } catch (e) {} if (v) return res(v); if (Date.now() - t0 > (ms || 600000)) return res(null); setTimeout(p, 200); })(); }); }
  function toast(msg) { try { const t = txt('div', '', msg); t.setAttribute('style', 'position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 90px);transform:translateX(-50%);z-index:950;padding:8px 14px;border-radius:999px;font:12px "IBM Plex Sans Arabic",system-ui,sans-serif;color:#f3f5f9;background:rgba(20,24,36,.92);border:1px solid rgba(255,255,255,.14);box-shadow:0 8px 24px rgba(0,0,0,.4);white-space:nowrap'); document.body.append(t); setTimeout(() => t.remove(), 3500); } catch (e) {} }
  function openChat(prefill) {
    try {
      if (typeof window.__setPersonaUI === 'function') window.__setPersonaUI('rizq', true);
      else if (typeof window.__openAI === 'function') window.__openAI(true);
      else { const h = $('homeHead'); if (h) h.click(); }
      if (prefill) { const q = $('aiQ'); if (q) { q.value = prefill; q.dispatchEvent(new Event('input', { bubbles: true })); } }
    } catch (e) {}
  }
  const isOwner = () => document.body.dataset.role === 'owner';

  /* ---------- state ---------- */
  const S = { fc: {}, mk: {}, branches: null, tiles: {}, sheets: {}, tab: { forecast: 'inputs', marketing: 'ideas' }, open: null };

  /* ---------- البلاطات ---------- */
  function findTemplateTile() {
    const hub = $('hub'); if (!hub) return null;
    const hidden = hub.querySelector('.arHideTile'); if (hidden) return hidden;
    const leaf = Array.from(hub.querySelectorAll('*')).find(n => n.children.length === 0 && /مجلس\s*الوكلاء/.test(n.textContent || ''));
    if (leaf) { let t = leaf; while (t && t.parentNode && t.parentNode !== hub && !(t.parentNode.children.length > 6)) t = t.parentNode; return t; }
    return hub.children.length ? hub.children[hub.children.length - 1] : null;
  }
  function stripAttrs(n) { Array.from(n.attributes || []).forEach(a => { if (/^(data-|on)/i.test(a.name) || a.name === 'href' || a.name === 'id' || a.name === 'hidden') n.removeAttribute(a.name); }); }
  function makeTile(key, label, icon) {
    const tpl = findTemplateTile(); let tile;
    if (tpl && tpl.parentNode === $('hub')) {
      tile = tpl.cloneNode(true);
      tile.classList.remove('arHideTile'); stripAttrs(tile); tile.querySelectorAll('*').forEach(stripAttrs);
      tile.style.display = '';
      const leaves = Array.from(tile.querySelectorAll('*')).filter(n => n.children.length === 0 && (n.textContent || '').trim() && n.tagName !== 'svg' && n.tagName !== 'SVG');
      let lab = leaves.find(n => /مجلس\s*الوكلاء/.test(n.textContent)) || leaves.slice().sort((a, b) => b.textContent.length - a.textContent.length)[0];
      if (lab) lab.textContent = label; else tile.append(txt('span', '', label));
      leaves.forEach(n => { if (n !== lab) n.textContent = ''; });
      const ic = tile.querySelector('svg, img, .ic, .ico, .icon, i');
      const w = el('span', 'fmIc', icon);
      if (ic && ic !== lab) ic.replaceWith(w); else tile.prepend(w);
    } else {
      tile = el('button', 'fmTileFallback'); tile.type = 'button';
      tile.append(el('span', 'fmIc', icon), txt('span', '', label));
    }
    tile.classList.add('fmTile', 'fm-' + key); tile.setAttribute('role', 'button'); tile.tabIndex = 0; tile.setAttribute('aria-label', label);
    let badge = null;
    const spare = Array.from(tile.querySelectorAll('*')).find(n => n.children.length === 0 && !n.closest('.fmIc') && !n.closest('svg') && (n.textContent || '').trim() !== label);
    if (spare) { badge = spare; badge.classList.add('fmBadge', 'inline'); } else { badge = el('span', 'fmBadge'); tile.append(badge); }
    const go = e => { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); openSheet(key); };
    tile.addEventListener('click', go, true);
    tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(e); });
    return { tile, badge };
  }
  function mountTiles() {
    const hub = $('hub'); if (!hub) return;
    if (hub.querySelector('.fm-forecast') && hub.querySelector('.fm-marketing')) return;
    hub.querySelectorAll('.fmTile').forEach(n => n.remove());
    const f = makeTile('forecast', 'التوقعات المالية', SVG.forecast());
    const m = makeTile('marketing', 'الأفكار التسويقية', SVG.marketing());
    const tpl = hub.querySelector('.arHideTile');
    if (tpl) tpl.after(f.tile, m.tile); else hub.append(f.tile, m.tile);
    S.tiles = { forecast: f, marketing: m };
    paintTiles();
  }
  function paintTiles() {
    if (S.tiles.forecast) {
      const inp = S.fc.inputs, cur = S.fc.current;
      let b = '';
      if (cur && cur.status === 'ready') b = 'جاهز';
      else if (inp && Array.isArray(inp.files)) { const got = inp.files.filter(f => f.status && f.status !== 'pending').length; b = got ? AR(got) + '/' + AR(inp.files.length) + ' ملفات' : 'بانتظار الملفات'; }
      S.tiles.forecast.badge.textContent = b;
    }
    if (S.tiles.marketing) {
      const items = (S.mk.ideas && Array.isArray(S.mk.ideas.items)) ? S.mk.ideas.items.filter(i => i.status !== 'archived') : [];
      S.tiles.marketing.badge.textContent = items.length ? AR(items.length) + (items.length === 1 ? ' فكرة' : ' أفكار') : '';
    }
  }

  /* ---------- الصفحة الزجاجية ---------- */
  const META = {
    forecast: { title: 'التوقعات المالية', sub: 'الفوركاست · لأبو راكان بس', tabs: [['inputs', 'المدخلات'], ['forecast', 'الفوركاست'], ['openings', 'الافتتاحات'], ['history', 'التاريخ'], ['method', 'المنهجية']], icon: SVG.forecast('#7ee0c3') },
    marketing: { title: 'الأفكار التسويقية', sub: 'أفكار Rizq AI مبنية على الحملات السابقة · لأبو راكان بس', tabs: [['ideas', 'الأفكار'], ['history', 'الحملات السابقة'], ['add', 'أضف فكرة']], icon: SVG.marketing('#ffd38a') }
  };
  function buildSheet(key) {
    const m = META[key];
    const sh = el('div', 'fmSheet ' + key); sh.id = 'fmSheet-' + key; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', m.title);
    const bg = el('div', 'asBg'); bg.addEventListener('click', closeSheet);
    const frame = el('div', 'asFrame'); const inn = el('div', 'asIn');
    inn.append(el('div', 'asGrip', '<i></i>'));
    const head = el('div', 'asHead'); const who = el('div', 'asWho');
    const ico = el('div', 'asIcon', m.icon); ico.querySelector('svg').setAttribute('width', '22'); ico.querySelector('svg').setAttribute('height', '22');
    const t = el('div', 'asT'); t.append(txt('b', '', m.title), txt('span', '', m.sub));
    who.append(ico, t);
    const close = el('button', 'asClose', SVG.close); close.type = 'button'; close.setAttribute('aria-label', 'إغلاق'); close.addEventListener('click', closeSheet);
    head.append(who, close);
    const tabs = el('div', 'asTabs'); const tabEls = {};
    m.tabs.forEach(([k, label]) => { const b = txt('button', 'asTab', label); b.type = 'button'; b.addEventListener('click', () => { S.tab[key] = k; paintSheet(key); }); tabs.append(b); tabEls[k] = b; });
    const when = el('div', 'asWhen'); const ws = el('span'); when.append(el('i'), ws, el('i'));
    const log = el('div', 'asLog');
    const foot = el('div', 'asFoot');
    const ask = el('div', 'asAsk');
    const inp = document.createElement('input'); inp.type = 'text';
    inp.placeholder = key === 'forecast' ? 'اسأل Rizq AI عن الفوركاست أو الافتتاحات…' : 'اسأل Rizq AI عن فكرة أو حملة…';
    inp.setAttribute('aria-label', inp.placeholder);
    const sendB = el('button', key === 'forecast' ? 'forecast' : '', SVG.send); sendB.type = 'button'; sendB.setAttribute('aria-label', 'إرسال');
    const go = () => { const v = inp.value.trim(); if (!v) return; closeSheet(); openChat(v); inp.value = ''; };
    sendB.addEventListener('click', go); inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    ask.append(inp, sendB); foot.append(ask);
    inn.append(head, tabs, when, log, foot); frame.append(inn);
    sh.append(bg, el('div', 'asGlow1'), el('div', 'asGlow2'), frame);
    document.body.append(sh);
    S.sheets[key] = { sh, tabEls, ws, log };
  }
  function openSheet(key) { if (!S.sheets[key]) buildSheet(key); S.open = key; paintSheet(key); S.sheets[key].sh.classList.add('open'); document.body.classList.add('arsheet'); }
  function closeSheet() { Object.keys(S.sheets).forEach(k => S.sheets[k].sh.classList.remove('open')); S.open = null; document.body.classList.remove('arsheet'); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.open) closeSheet(); });

  const box = (title, lines) => { const b = el('div', 'asBox'); if (title) b.append(txt('b', '', title)); (lines || []).forEach(l => { if (!l) return; if (Array.isArray(l)) { const p = el('p'); p.append(txt('span', 'k', l[0] + ': ')); p.append(document.createTextNode(l[1])); b.append(p); } else b.append(txt('p', '', l)); }); return b; };
  const empty = s => txt('div', 'asEmpty', s);

  function paintSheet(key) {
    const sheet = S.sheets[key]; if (!sheet) return;
    const tab = S.tab[key]; Object.keys(sheet.tabEls).forEach(k => sheet.tabEls[k].classList.toggle('on', k === tab));
    const log = sheet.log; log.innerHTML = '';
    if (key === 'forecast') paintForecast(tab, sheet); else paintMarketing(tab, sheet);
    log.scrollTop = 0;
  }

  /* ---------- التوقعات المالية ---------- */
  function paintForecast(tab, sheet) {
    const { log, ws } = sheet; const inp = S.fc.inputs, hist = S.fc.history, cur = S.fc.current;
    const upd = (cur && cur.updatedAt) || (inp && inp.updatedAt);
    ws.textContent = (tab === 'openings' ? 'شيت الفروع · ' + (S.branches && S.branches.date ? fmtDate(S.branches.date) : '') : 'آخر تحديث · ' + (upd ? fmtTime(upd) : '—'));
    if (tab === 'inputs') {
      if (!inp) { log.append(empty('ما وصلتني بيانات المدخلات بعد.')); return; }
      if (inp.note) log.append(box('', [inp.note]));
      const list = el('div', 'fmList');
      (inp.files || []).forEach(f => {
        const st = f.status === 'processed' ? 'processed' : (f.status === 'received' ? 'received' : 'pending');
        const r = el('div', 'fmRow ' + st); r.append(el('i'), txt('span', '', f.name), txt('small', '', st === 'processed' ? 'دخل التاريخ' : (st === 'received' ? 'وصل' : 'بانتظارك')));
        list.append(r);
      });
      log.append(txt('div', 'fmQ', 'الملفات المطلوبة'), list);
      if (Array.isArray(inp.outputs) && inp.outputs.length) log.append(box('اللي بيطلع من هالأيقونة', inp.outputs.map(o => '• ' + o)));
    } else if (tab === 'method') {
      const m = cur && cur.method;
      if (!m) { log.append(empty('المنهجية تنكتب هنا.')); return; }
      log.append(box(m.name, m.note ? [m.note] : []));
      (m.steps || []).forEach((s, i) => { const st = el('div', 'fmStep'); st.append(txt('b', '', AR(i + 1)), txt('p', '', String(s).replace(/^[٠-٩0-9]+[\.\-:]\s*/, ''))); log.append(st); });
    } else if (tab === 'history') {
      if (!hist || hist.status === 'empty' || !hist.years || !Object.keys(hist.years).length) { log.append(empty(hist && hist.note ? hist.note : 'التاريخ يُبنى من ملفات أبو راكان: دخل شهري لكل فرع ٢٠٢٥ و٢٠٢٦.')); return; }
      Object.keys(hist.years).sort().reverse().forEach(y => {
        const yr = hist.years[y] || {}; const months = yr.months || {};
        const vals = Object.keys(months).map(k => Number(months[k]) || 0); const max = Math.max.apply(null, vals.concat([1]));
        const b = el('div', 'asBox'); b.append(txt('b', '', 'سنة ' + AR(y) + (yr.total != null ? ' · ' + NUM(yr.total) : '') + (yr.audited ? ' · ' + yr.audited : '')));
        const g = el('div', 'fmMonths');
        for (let i = 1; i <= 12; i++) { const k = String(i).padStart(2, '0'); const v = months[k] != null ? months[k] : months[String(i)]; const c = el('div', 'fmMonth' + (v == null ? ' empty' : '')); c.append(txt('small', '', MONTHS[i - 1].slice(0, 5)), txt('b', '', v == null ? '—' : NUM(v))); const bar = el('div', 'fmBar'); const fi = el('i'); fi.style.width = v == null ? '0%' : Math.round((Number(v) / max) * 100) + '%'; bar.append(fi); c.append(bar); g.append(c); }
        b.append(g); if (yr.note) b.append(txt('p', '', yr.note)); log.append(b);
      });
      const br = hist.branches || {}; const names = Object.keys(br);
      if (names.length) { log.append(txt('div', 'fmQ', 'الفروع (' + AR(names.length) + ')')); names.sort((a, b) => (Number(br[b].total) || 0) - (Number(br[a].total) || 0)).slice(0, 60).forEach(n => { const r = el('div', 'fmBr'); const nn = el('div', 'n'); nn.append(txt('b', '', n), txt('small', '', (br[n].region || '') + (br[n].opened ? ' · افتتح ' + fmtDate(br[n].opened) : ''))); const d = el('div', 'd'); d.append(txt('b', '', NUM(br[n].total)), txt('small', '', br[n].months ? AR(Object.keys(br[n].months).length) + ' شهر' : '')); r.append(nn, d); log.append(r); }); }
    } else if (tab === 'forecast') {
      if (!cur || cur.status !== 'ready' || !Array.isArray(cur.horizon) || !cur.horizon.length) { log.append(empty(cur && cur.note ? cur.note : 'بانتظار التاريخ وفوركاست أبو راكان المتوقع.')); if (cur && cur.method) log.append(box('كيف بينبني', [cur.method.name])); return; }
      if (cur.intro) log.append(box('', [cur.intro]));
      log.append(txt('div', 'fmQ', 'الثلاثة شهور القادمة'));
      cur.horizon.forEach(h => {
        const b = el('div', 'asBox'); b.append(txt('b', '', h.label || fmtDate(h.month)));
        const st = el('div', 'fmStats');
        [['lo', 'متحفظ', h.low], ['', 'أساسي', h.base], ['hi', 'متفائل', h.high]].forEach(([c, l, v]) => { const s = el('div', 'fmStat ' + c); s.append(txt('small', '', l), txt('b', '', NUM(v))); st.append(s); });
        b.append(st);
        if (h.owner != null) b.append(txt('p', '', 'فوركاست أبو راكان: ' + NUM(h.owner) + (h.base ? ' (الفرق ' + PCT(((h.base - h.owner) / h.owner) * 100) + ')' : '')));
        if (h.basis) b.append(txt('p', '', h.basis));
        if (h.openings) b.append(txt('p', '', 'فروع تدخل هالشهر: ' + h.openings));
        log.append(b);
      });
      if (cur.y2027) { const y = cur.y2027; log.append(txt('div', 'fmQ', 'سنة ٢٠٢٧')); const b = el('div', 'asBox'); b.append(txt('b', '', 'الدخل المتوقع ' + (y.branches ? '· ' + AR(y.branches) + ' فرع' : ''))); const st = el('div', 'fmStats'); [['lo', 'متحفظ', y.low], ['', 'أساسي', y.base], ['hi', 'متفائل', y.high]].forEach(([c, l, v]) => { const s = el('div', 'fmStat ' + c); s.append(txt('small', '', l), txt('b', '', NUM(v))); st.append(s); }); b.append(st); if (y.note) b.append(txt('p', '', y.note)); log.append(b); }
      if (cur.backtest) log.append(box('التحقق الخلفي', [cur.backtest]));
      if (Array.isArray(cur.assumptions) && cur.assumptions.length) log.append(box('الافتراضات', cur.assumptions.map(a => '• ' + a)));
    } else if (tab === 'openings') {
      const b = S.branches;
      if (!b || !Array.isArray(b.quarters)) { log.append(empty('ما قدرت أقرأ شيت الفروع.')); return; }
      if (Array.isArray(b.totals)) { const st = el('div', 'fmStats'); b.totals.slice(0, 6).forEach(([l, v]) => { const s = el('div', 'fmStat'); s.append(txt('small', '', l), txt('b', '', AR(v))); st.append(s); }); log.append(st); }
      log.append(box('', ['كل فرع هنا يدخل الفوركاست من شهر مباشرته المتوقع على منحنى نضج الفروع الجديدة، ويتأخر تلقائياً لو تأخر موعده. المصدر: شيت متابعة افتتاح الفروع.']));
      b.quarters.forEach(q => {
        const rows = (q.rows || []).filter(r => r.st !== 'opened');
        if (!rows.length) return;
        const h = el('div', 'fmQ'); h.append(document.createTextNode(q.title || '')); h.append(txt('span', '', AR(rows.length) + ' فرع لم يفتح')); log.append(h);
        rows.forEach(r => {
          const row = el('div', 'fmBr ' + (r.st || '')); const n = el('div', 'n'); n.append(txt('b', '', r.name || ''), txt('small', '', [r.region, r.stage].filter(Boolean).join(' · ')));
          const d = el('div', 'd'); d.append(txt('b', '', r.expected ? String(r.expected) : '—'), txt('small', '', r.done != null ? AR(r.done) + '/١٠ مراحل' : ''));
          const pr = el('div', 'pr'); const pi = el('i'); pi.style.width = Math.round(((Number(r.done) || 0) / 10) * 100) + '%'; pr.append(pi); d.append(pr);
          row.append(n, d); log.append(row);
        });
      });
    }
  }

  /* ---------- الأفكار التسويقية ---------- */
  async function saveIdeas(items) {
    if (!window.sb || !window.sb.from) { toast('ما فيه اتصال بقاعدة البيانات'); return false; }
    const data = Object.assign({}, S.mk.ideas || {}, { items, updatedAt: new Date().toISOString() });
    try {
      const { error } = await window.sb.from('docs').upsert({ collection: 'marketing', id: 'ideas', data }, { onConflict: 'collection,id' });
      if (error) throw error;
      S.mk.ideas = data; paintTiles(); return true;
    } catch (e) { toast('ما قدرت أحفظ: ' + (e && e.message ? e.message : '')); return false; }
  }
  function statusLabel(s) { return s === 'approved' ? 'معتمدة' : (s === 'archived' ? 'مؤرشفة' : (s === 'owner' ? 'فكرة أبو راكان' : 'مقترحة من Rizq AI')); }
  function paintMarketing(tab, sheet) {
    const { log, ws } = sheet; const ideas = S.mk.ideas, hist = S.mk.campaigns;
    ws.textContent = 'آخر تحديث · ' + ((ideas && ideas.updatedAt) ? fmtTime(ideas.updatedAt) : '—');
    if (tab === 'ideas') {
      const items = (ideas && Array.isArray(ideas.items)) ? ideas.items.slice() : [];
      if (!items.length) { log.append(empty('ما فيه أفكار بعد. Rizq AI يضيف أفكاره هنا بناءً على الحملات السابقة، وأنت تضيف من تبويب «أضف فكرة».')); return; }
      const order = { owner: 0, approved: 1, proposed: 2, archived: 3 };
      items.sort((a, b) => (order[a.status] ?? 2) - (order[b.status] ?? 2) || String(b.at || '').localeCompare(String(a.at || '')));
      items.forEach(it => {
        const c = el('div', 'mkCard ' + (it.status || 'proposed'));
        const top = el('div', 'mkTop'); top.append(txt('b', '', it.title || ''), txt('span', 'mkChip', statusLabel(it.status))); c.append(top);
        if (it.why) { const p = el('p'); p.append(txt('span', 'k', 'ليش: ')); p.append(document.createTextNode(it.why)); c.append(p); }
        if (it.basedOn) { const p = el('p'); p.append(txt('span', 'k', 'مبنية على: ')); p.append(document.createTextNode(it.basedOn)); c.append(p); }
        if (it.owner) { const p = el('p'); p.append(txt('span', 'k', 'المالك: ')); p.append(document.createTextNode(it.owner)); c.append(p); }
        const meta = [it.by, it.at ? fmtTime(it.at) : ''].filter(Boolean).join(' · '); if (meta) c.append(txt('p', '', meta));
        if (isOwner()) {
          const act = el('div', 'mkAct');
          const setSt = async st => { const all = (S.mk.ideas.items || []).map(x => x.id === it.id ? Object.assign({}, x, { status: st, decidedAt: new Date().toISOString() }) : x); if (await saveIdeas(all)) paintSheet('marketing'); };
          if (it.status !== 'approved' && it.status !== 'archived') { const ok = txt('button', 'ok', 'اعتمدها'); ok.type = 'button'; ok.addEventListener('click', () => setSt('approved')); act.append(ok); }
          if (it.status !== 'archived') { const ar = txt('button', '', 'أرشف'); ar.type = 'button'; ar.addEventListener('click', () => setSt('archived')); act.append(ar); }
          else { const un = txt('button', 'undo', 'رجّعها'); un.type = 'button'; un.addEventListener('click', () => setSt(it.by === 'Rizq AI' ? 'proposed' : 'owner')); act.append(un); }
          const ask = txt('button', '', 'ناقشها مع Rizq AI'); ask.type = 'button'; ask.addEventListener('click', () => { closeSheet(); openChat('بخصوص فكرة «' + (it.title || '') + '» في الأفكار التسويقية: '); }); act.append(ask);
          c.append(act);
        }
        log.append(c);
      });
    } else if (tab === 'history') {
      const items = (hist && Array.isArray(hist.items)) ? hist.items : [];
      if (hist && hist.source) log.append(box('', ['المصدر: ' + hist.source]));
      if (!items.length) { log.append(empty('ما فيه حملات مسجلة بعد.')); return; }
      items.forEach(it => log.append(box(it.title, [it.result ? ['النتيجة', it.result] : null, it.lesson ? ['الدرس', it.lesson] : null, it.source ? ['المصدر', it.source] : null])));
    } else if (tab === 'add') {
      const w = el('div', 'mkAdd');
      const ta = document.createElement('textarea'); ta.placeholder = 'اكتب الفكرة أو الحملة اللي في بالك… Rizq AI يبني عليها ويقترح حولها.';
      const b = txt('button', '', 'أضف الفكرة'); b.type = 'button';
      b.addEventListener('click', async () => {
        const v = ta.value.trim(); if (!v) return; b.disabled = true;
        const item = { id: 'o' + Date.now(), title: v, status: 'owner', by: 'أبو راكان', at: new Date().toISOString() };
        const all = ((S.mk.ideas && S.mk.ideas.items) || []).concat([item]);
        if (await saveIdeas(all)) { ta.value = ''; toast('انضافت الفكرة'); S.tab.marketing = 'ideas'; paintSheet('marketing'); }
        b.disabled = false;
      });
      w.append(ta, b, txt('small', '', 'أفكارك تنحفظ هنا لك بس، وRizq AI يقرأها ويقترح حولها في المجلس الليلي ومع تحديث الحملات.'));
      log.append(w);
    }
  }

  /* ---------- البيانات ---------- */
  function absorb(rows) {
    (rows || []).forEach(r => {
      const d = Object.assign({}, r.data || {}); const c = r.collection, id = r.id;
      if (c === 'forecast') S.fc[id] = d;
      else if (c === 'marketing') { if (id === 'ideas') S.mk.ideas = d; else if (id === 'campaigns-history') S.mk.campaigns = d; }
      else if (c === 'branches' && id === 'current') S.branches = d;
    });
    paintTiles(); if (S.open && !(S.open === 'marketing' && S.tab.marketing === 'add')) paintSheet(S.open);
  }
  async function load() {
    try {
      if (window.sb && window.sb.from) {
        const { data } = await window.sb.from('docs').select('collection,id,data').in('collection', ['forecast', 'marketing']);
        if (Array.isArray(data)) absorb(data);
        const b = await window.sb.from('docs').select('collection,id,data').eq('collection', 'branches').eq('id', 'current');
        if (b && Array.isArray(b.data)) absorb(b.data);
      }
      const db = window.claude && window.claude.use ? await window.claude.use('db') : null;
      if (db) ['forecast', 'marketing'].forEach(c => { try { db.collection(c).onSnapshot(sn => { try { absorb((sn.docs || []).map(x => ({ collection: c, id: x.id, data: (typeof x.data === 'function' ? x.data() : x.data) || {} }))); } catch (e) {} }, () => {}); } catch (e) {} });
    } catch (e) {}
  }

  /* ---------- تشغيل ---------- */
  (async () => {
    await waitFor(() => $('hub') && $('hub').children.length, 600000);
    await waitFor(() => document.body.dataset.role, 8000);
    if (!isOwner()) return;
    await new Promise(r => setTimeout(r, 600));
    mountTiles();
    const hub = $('hub');
    new MutationObserver(() => { if (!hub.querySelector('.fm-forecast') || !hub.querySelector('.fm-marketing')) mountTiles(); }).observe(hub, { childList: true });
    load();
  })();
})();
