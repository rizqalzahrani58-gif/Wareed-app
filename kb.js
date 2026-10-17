/* وريد · لوحة المفاتيح (١٧ أكتوبر — النسخة ٥: الكيبورد يطلع بالجوال من أول لمسة)
   النسخة ٤: شات كل الوكلاء (Rizq AI / Rawan AI) شاشة شات حقيقية:
   - الشريط داخل نافذة المحادثة، آخر شي تحت
   - الكيبورد مسكّر: النافذة ملء الشاشة (ما نعتمد على أرقام الآيفون اللي تعلق بعد ما يتسكّر الكيبورد وتخلي فراغ تحت)
   - الكيبورد مفتوح: النافذة تنتهي عند الكيبورد بالضبط، ولو الآيفون ما بلّغ عن الكيبورد نقدّر ارتفاعه
   - غطاء يخفي التطبيق وراه، وبدون أسئلة مقترحة
   - النسخة ٤: نلغي قواعد الكيبورد القديمة في room.js (كانت تقصّر النافذة ٨٤ وتحرّك الشريط وترجّع الأسئلة المقترحة) */
(function(){
  const vv = window.visualViewport;
  const R = document.documentElement;
  const BG = '#0b0d12';
  const css =
    'body.aiopen::before{content:"";position:fixed;left:0;right:0;top:-100vh;bottom:-100vh;background:' + BG + ';z-index:840;pointer-events:auto}' +
    'body.aiopen #appRoot{visibility:hidden}' +
    'html:has(body.aiopen){overflow:hidden;background:' + BG + '}' +
    /* الكيبورد مسكّر: ملء الشاشة (html قدام عشان تغلب قواعد room.js القديمة) */
    'html body.aiopen #aiSheet{position:fixed!important;inset:0!important;height:auto!important;z-index:850;background:' + BG + ';display:flex!important;flex-direction:column}' +
    /* الكيبورد مفتوح: من أعلى الجزء الظاهر لين الكيبورد بالضبط */
    'html body.aiopen.kbup #aiSheet{top:var(--vvt,0px)!important;bottom:auto!important;height:var(--vvh,100%)!important}' +
    '#aiSheet .shead{flex:none}' +
    'html body.aiopen #aiSheet .sbody{flex:1 1 auto;min-height:0;padding-bottom:.8em!important}' +
    'html body #aiSheet #aiBar{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;top:auto!important;transform:none!important;transition:none!important;z-index:1;flex:none;display:block;' +
      'background:' + BG + '!important;border-top:1px solid rgba(255,255,255,.06);padding:.5em 12px calc(.6em + env(safe-area-inset-bottom,0px))!important}' +
    'html body.kbup #aiSheet #aiBar{padding-bottom:.5em!important}' +
    /* بدون أسئلة مقترحة */
    'html body #aiQuick,html body #aiSheet #aiBar .aiquick{display:none!important}' +
    /* شاشة تغذية Rawan AI */
    '#rkbSheet{inset:auto!important;top:var(--vvt,0px)!important;left:0!important;right:0!important;height:var(--vvh,100%)!important}' +
    '#rkbSheet .rb{max-height:100%}' +
    'body.kbup #rkbSheet .rb{height:100%;border-radius:0}' +
    'body.kbup #rkbSheet .cp{padding-bottom:.6em!important}' +
    '#aiForm input#aiQ,#aiForm textarea,#rkbIn,.nt-reply textarea{font-size:16px!important}';
  const st = document.createElement('style'); st.id = 'wdKbCss'; st.textContent = css; document.head.append(st);

  function dock(){
    const sh = document.getElementById('aiSheet'), bar = document.getElementById('aiBar');
    if(!sh || !bar) return false;
    if(bar.parentNode !== sh || sh.lastElementChild !== bar) sh.append(bar);
    return true;
  }

  function typing(){
    const a = document.activeElement;
    return !!(a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.closest && a.closest('#aiSheet,#rkbSheet') && (!touch || a.__wdTapped || (vv && vv.height < Math.max(R.clientHeight, window.innerHeight) * 0.85)));
  }

  let wasUp = false;
  function scrollEnd(){
    const sb = document.querySelector('#aiSheet .sbody'), L = document.getElementById('aiLog');
    if(sb && L && document.body.classList.contains('aiopen')) sb.scrollTop = Math.max(0, L.offsetTop + L.offsetHeight - sb.clientHeight + 24);
    const ch = document.querySelector('#rkbSheet .ch'); if(ch) ch.scrollTop = ch.scrollHeight;
  }
  function upd(){
    if(!document.body) return;
    const sh = screen.height || 900;
    const full = Math.max(R.clientHeight, window.innerHeight);
    const vh = vv ? vv.height : window.innerHeight, vt = vv ? Math.max(0, vv.offsetTop) : 0;
    const up = typing();
    let h = vh, t = vt;
    if(up && vh > full * 0.85){ /* الآيفون ما بلّغ عن الكيبورد: نقدّره (كيبورد + شريط ✓) */
      h = Math.round(Math.min(full, sh) - sh * 0.425); t = 0;
    }
    /* نحدّث بس لو تغيّر فعلاً (أكثر من ٢px) عشان ما يرجف المؤشر وقت الكتابة */
    if(Math.abs(h - (upd.h || 0)) > 2 || Math.abs(t - (upd.t || 0)) > 2){ upd.h = h; upd.t = t; R.style.setProperty('--vvh', h + 'px'); R.style.setProperty('--vvt', t + 'px'); }
    if(document.body.classList.contains('kbup') !== up) document.body.classList.toggle('kbup', up);
    if(up !== wasUp){ wasUp = up; setTimeout(scrollEnd, 30); }
  }
  if(vv){ vv.addEventListener('resize', upd); vv.addEventListener('scroll', upd); }
  window.addEventListener('resize', upd);
  window.addEventListener('orientationchange', () => setTimeout(upd, 300));
  document.addEventListener('focusin', () => { upd(); setTimeout(upd, 60); setTimeout(upd, 350); setTimeout(upd, 700); });
  document.addEventListener('focusout', () => { setTimeout(upd, 30); setTimeout(upd, 400); });


  /* النسخة ٥: بالجوال الآيفون يرفض يفتح الكيبورد لو الخانة انمسكت برمجياً (مو بلمسة) — تصير الخانة "ماسكة" بدون كيبورد،
     والنافذة تنكمش على كيبورد ما ظهر، واللمسة عليها بعدين ما تفتحه. الحل: ما نمسك الخانة تلقائياً بالجوال،
     ولو انمسكت بدون كيبورد نفكّها، ولمسة الخانة نفسها تعيد المسك داخل اللمسة فيطلع الكيبورد. */
  const touch = !!(window.matchMedia && matchMedia('(pointer:coarse)').matches) || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
  const CHAT = '#aiSheet,#agentSheet,#rkbSheet,.nt-reply';
  const isField = el => !!(el && el.matches && el.matches('input:not([type=button]):not([type=submit]):not([type=file]):not([type=checkbox]):not([type=radio]),textarea') && el.closest(CHAT));
  const kbShown = () => { if(!vv) return true; const full = Math.max(R.clientHeight, window.innerHeight); return vv.height < full * 0.85; };
  function dropGhost(){ const a = document.activeElement; if(isField(a) && !kbShown() && !a.__wdTapped){ try { a.blur(); } catch(e){} upd(); } }
  if(touch){
    /* أي مسك برمجي بدون لمسة: نفكّه لو الكيبورد ما طلع */
    document.addEventListener('focusin', e => { if(!isField(e.target)) return; const t = e.target; if(t.__wdTapAt && Date.now() - t.__wdTapAt < 900) { t.__wdTapped = true; return; } t.__wdTapped = false; setTimeout(dropGhost, 650); }, true);
    document.addEventListener('focusout', e => { if(e.target) e.target.__wdTapped = false; }, true);
    /* اللمسة على الخانة: نمسكها داخل اللمسة نفسها (هذا اللي يخلي الآيفون يطلّع الكيبورد) */
    let sx = 0, sy = 0;
    document.addEventListener('touchstart', e => { const t = e.target; if(isField(t)){ t.__wdTapAt = Date.now(); const p = e.touches[0]; sx = p.clientX; sy = p.clientY; } }, { capture: true, passive: true });
    document.addEventListener('touchend', e => {
      const t = e.target; if(!isField(t) || t.disabled || t.readOnly) return;
      const p = e.changedTouches && e.changedTouches[0]; if(p && (Math.abs(p.clientX - sx) > 10 || Math.abs(p.clientY - sy) > 10)) return; /* سحب مو لمسة */
      t.__wdTapAt = Date.now();
      if(document.activeElement === t && !kbShown()){ try { t.blur(); } catch(_){} }
      t.__wdTapped = true;
      if(document.activeElement !== t){ try { t.focus({ preventScroll: true }); } catch(_){ try { t.focus(); } catch(__){} } }
      setTimeout(upd, 60); setTimeout(upd, 400);
    }, { capture: true, passive: true });
  }

  document.addEventListener('click', e => { if(e.target.closest && e.target.closest('#aiSheet .done, #rkbSheet .x')){ const a = document.activeElement; if(a && a.blur) a.blur(); } }, true);

  function watch(){
    upd();
    new MutationObserver(() => {
      if(!dock.ok) dock.ok = dock();
      const open = document.body.classList.contains('aiopen');
      if(open) dock();
      if(open && !watch.o){ const q = document.getElementById('aiQ'); if(!touch && q && document.activeElement !== q){ try { q.focus({ preventScroll: true }); } catch(e){} } setTimeout(upd, 60); setTimeout(scrollEnd, 120); if(touch) setTimeout(dropGhost, 650); }
      watch.o = open;
    }).observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true });
    dock.ok = dock();
  }
  if(document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})();
