/* وريد · لوحة المفاتيح (١٧ أكتوبر — النسخة ٢): شات كل الوكلاء (Rizq AI / Rawan AI) يصير شاشة شات حقيقية:
   - شريط الكتابة داخل نافذة المحادثة نفسها، آخر شي تحت، فوق الكيبورد مباشرة (بدون حسابات ارتفاع الكيبورد اللي كانت ترفعه فوق)
   - النافذة تغطي التطبيق كامل، فما تبان الأيقونات ولا الداشبورد وراها
   الطريقة: النافذة تاخذ الجزء الظاهر من الشاشة (visualViewport) وتكون عمود: الهيدر ← الرسايل ← شريط الكتابة. */
(function(){
  const vv = window.visualViewport;
  const R = document.documentElement;
  const BG = '#0b0d12';
  const css =
    /* غطاء كامل ورا الشات: يخفي التطبيق كله وقت المحادثة */
    'body.aiopen::before{content:"";position:fixed;left:0;right:0;top:-100vh;bottom:-100vh;background:' + BG + ';z-index:840;pointer-events:auto}' +
    'body.aiopen #appRoot{visibility:hidden}' +
    'html:has(body.aiopen){overflow:hidden;background:' + BG + '}' +
    /* النافذة = الجزء الظاهر فوق الكيبورد بالضبط */
    'body.aiopen #aiSheet{inset:auto;top:var(--vvt,0px);left:0;right:0;height:var(--vvh,100dvh);z-index:850;background:' + BG + ';display:flex;flex-direction:column}' +
    '#aiSheet .shead{flex:none}' +
    '#aiSheet .sbody{flex:1 1 auto;min-height:0;padding-bottom:.8em!important}' +
    /* شريط الكتابة داخل النافذة، آخر عنصر تحت */
    '#aiSheet #aiBar{position:relative!important;left:auto;right:auto;bottom:auto!important;top:auto;z-index:1;flex:none;display:block;transition:none;' +
      'background:' + BG + ';border-top:1px solid rgba(255,255,255,.06);padding:.5em 12px calc(.6em + env(safe-area-inset-bottom,0px))}' +
    'body.kbup #aiSheet #aiBar{padding-bottom:.5em}' +
    /* شاشة تغذية Rawan AI */
    '#rkbSheet{inset:auto!important;top:var(--vvt,0px)!important;left:0!important;right:0!important;height:var(--vvh,100%)!important}' +
    '#rkbSheet .rb{max-height:100%}' +
    'body.kbup #rkbSheet .rb{height:100%;border-radius:0}' +
    'body.kbup #rkbSheet .cp{padding-bottom:.6em!important}' +
    /* منع تكبير iOS للخانة (يصير لما الخط أصغر من 16px) */
    '#aiForm input#aiQ,#rkbIn,.nt-reply textarea{font-size:16px!important}';
  const st = document.createElement('style'); st.id = 'wdKbCss'; st.textContent = css; document.head.append(st);

  /* ننقل شريط الكتابة داخل نافذة المحادثة (مرة وحدة، أول ما يجهزون) */
  function dock(){
    const sh = document.getElementById('aiSheet'), bar = document.getElementById('aiBar');
    if(!sh || !bar) return false;
    if(bar.parentNode !== sh || sh.lastElementChild !== bar) sh.append(bar);
    return true;
  }

  let wasUp = false;
  function scrollEnd(){
    const sb = document.querySelector('#aiSheet .sbody'), L = document.getElementById('aiLog');
    if(sb && L && document.body.classList.contains('aiopen')) sb.scrollTop = Math.max(0, L.offsetTop + L.offsetHeight - sb.clientHeight + 24);
    const ch = document.querySelector('#rkbSheet .ch'); if(ch) ch.scrollTop = ch.scrollHeight;
  }
  function upd(){
    if(!document.body) return;
    const h = vv ? vv.height : window.innerHeight, t = vv ? Math.max(0, vv.offsetTop) : 0;
    const base = Math.max(R.clientHeight, window.innerHeight);
    R.style.setProperty('--vvh', h + 'px'); R.style.setProperty('--vvt', t + 'px');
    const up = (base - h) > 80 || (screen.height - h) > 300 && document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    document.body.classList.toggle('kbup', !!up);
    if(up !== wasUp){ wasUp = up; setTimeout(scrollEnd, 30); }
    /* iOS أحياناً يزحلق الصفحة لما تفتح الكيبورد — نرجعها مكانها وقت الشات */
    if(document.body.classList.contains('aiopen') && window.scrollY) window.scrollTo(0, 0);
  }
  if(vv){ vv.addEventListener('resize', upd); vv.addEventListener('scroll', upd); }
  window.addEventListener('resize', upd);
  window.addEventListener('orientationchange', () => setTimeout(upd, 300));
  document.addEventListener('focusin', () => { setTimeout(upd, 50); setTimeout(upd, 350); });
  document.addEventListener('focusout', () => setTimeout(upd, 120));

  /* «تم» يسكّر الكيبورد مع النافذة */
  document.addEventListener('click', e => { if(e.target.closest && e.target.closest('#aiSheet .done, #rkbSheet .x')){ const a = document.activeElement; if(a && a.blur) a.blur(); } }, true);

  /* أول ما تنفتح المحادثة: الشريط تحت، والخانة جاهزة والمؤشر فيها */
  function watch(){
    upd();
    new MutationObserver(() => {
      if(!dock.ok) dock.ok = dock();
      const open = document.body.classList.contains('aiopen');
      if(open){ dock(); }
      if(open && !watch.o){ const q = document.getElementById('aiQ'); if(q && document.activeElement !== q){ try { q.focus({ preventScroll: true }); } catch(e){} } setTimeout(upd, 60); setTimeout(scrollEnd, 120); }
      watch.o = open;
    }).observe(document.body, { attributes: true, attributeFilter: ['class'], childList: true });
    dock.ok = dock();
  }
  if(document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})();
