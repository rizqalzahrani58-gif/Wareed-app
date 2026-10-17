/* وريد · لوحة المفاتيح (١٧ أكتوبر — النسخة ٣): شات كل الوكلاء (Rizq AI / Rawan AI) شاشة شات حقيقية:
   - الشريط داخل نافذة المحادثة، آخر شي تحت
   - الكيبورد مسكّر: النافذة ملء الشاشة (ما نعتمد على أرقام الآيفون اللي تعلق بعد ما يتسكّر الكيبورد وتخلي فراغ تحت)
   - الكيبورد مفتوح: النافذة تنتهي عند الكيبورد بالضبط، ولو الآيفون ما بلّغ عن الكيبورد نقدّر ارتفاعه
   - غطاء يخفي التطبيق وراه، وبدون أسئلة مقترحة
   - سطر قياس صغير مؤقت تحت اسم الوكيل (للتشخيص، ينشال بعدين) */
(function(){
  const vv = window.visualViewport;
  const R = document.documentElement;
  const BG = '#0b0d12';
  const css =
    'body.aiopen::before{content:"";position:fixed;left:0;right:0;top:-100vh;bottom:-100vh;background:' + BG + ';z-index:840;pointer-events:auto}' +
    'body.aiopen #appRoot{visibility:hidden}' +
    'html:has(body.aiopen){overflow:hidden;background:' + BG + '}' +
    /* الكيبورد مسكّر: ملء الشاشة */
    'body.aiopen #aiSheet{position:fixed;inset:auto;top:0;left:0;right:0;height:100lvh;z-index:850;background:' + BG + ';display:flex;flex-direction:column}' +
    /* الكيبورد مفتوح: لين الكيبورد */
    'body.aiopen.kbup #aiSheet{top:var(--vvt,0px);height:var(--vvh,100lvh)}' +
    '#aiSheet .shead{flex:none}' +
    '#aiSheet .sbody{flex:1 1 auto;min-height:0;padding-bottom:.8em!important}' +
    '#aiSheet #aiBar{position:relative!important;left:auto;right:auto;bottom:auto!important;top:auto;z-index:1;flex:none;display:block;transition:none;' +
      'background:' + BG + ';border-top:1px solid rgba(255,255,255,.06);padding:.5em 12px calc(.6em + env(safe-area-inset-bottom,0px))}' +
    'body.kbup #aiSheet #aiBar{padding-bottom:.5em}' +
    /* بدون أسئلة مقترحة */
    '#aiQuick,.aiquick{display:none!important}' +
    '#kbdbg{display:block;font:10px/1.3 ui-monospace,monospace;color:#5d6578;direction:ltr;text-align:left;margin-top:2px}' +
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
    if(!document.getElementById('kbdbg')){ const s = sh.querySelector('.shead .st'); if(s){ const d = document.createElement('small'); d.id = 'kbdbg'; s.append(d); } }
    return true;
  }

  function typing(){
    const a = document.activeElement;
    return !!(a && /^(INPUT|TEXTAREA)$/.test(a.tagName) && a.closest && a.closest('#aiSheet,#rkbSheet'));
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
    let h = vh, t = vt, est = false;
    if(up && vh > full * 0.85){ /* الآيفون ما بلّغ عن الكيبورد: نقدّره (كيبورد + شريط ✓) */
      h = Math.round(Math.min(full, sh) - sh * 0.425); t = 0; est = true;
    }
    R.style.setProperty('--vvh', h + 'px'); R.style.setProperty('--vvt', t + 'px');
    document.body.classList.toggle('kbup', up);
    if(up !== wasUp){ wasUp = up; setTimeout(scrollEnd, 30); }
    const d = document.getElementById('kbdbg');
    if(d) d.textContent = 'vv ' + Math.round(vh) + '/' + Math.round(vt) + ' · in ' + window.innerHeight + ' · cl ' + R.clientHeight + ' · sc ' + sh + ' · sy ' + Math.round(window.scrollY) + ' · z ' + (vv ? vv.scale.toFixed(2) : '-') + ' · ' + (up ? 'KB' : '--') + (est ? ' est' : '');
  }
  if(vv){ vv.addEventListener('resize', upd); vv.addEventListener('scroll', upd); }
  window.addEventListener('resize', upd);
  window.addEventListener('orientationchange', () => setTimeout(upd, 300));
  document.addEventListener('focusin', () => { upd(); setTimeout(upd, 60); setTimeout(upd, 350); setTimeout(upd, 700); });
  document.addEventListener('focusout', () => { setTimeout(upd, 30); setTimeout(upd, 400); });

  document.addEventListener('click', e => { if(e.target.closest && e.target.closest('#aiSheet .done, #rkbSheet .x')){ const a = document.activeElement; if(a && a.blur) a.blur(); } }, true);

  function watch(){
    upd();
    new MutationObserver(() => {
      if(!dock.ok) dock.ok = dock();
      const open = document.body.classList.contains('aiopen');
      if(open) dock();
      if(open && !watch.o){ const q = document.getElementById('aiQ'); if(q && document.activeElement !== q){ try { q.focus({ preventScroll: true }); } catch(e){} } setTimeout(upd, 60); setTimeout(scrollEnd, 120); }
      watch.o = open;
    }).observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true });
    dock.ok = dock();
  }
  if(document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})();
