/* وريد · لوحة المفاتيح (١٧ أكتوبر): خانة الكتابة في شات كل الوكلاء (Rizq AI / Rawan AI / Nasser AI) وشاشة تغذية Rawan AI
   تطلع فوق الكيبورد مباشرة أول ما تنفتح المحادثة — بدون ما يضغط ✓ ويدوّر عليها تحت.
   الطريقة: نتابع visualViewport (الجزء الظاهر فوق الكيبورد) ونثبّت النافذة وشريط الكتابة عليه. */
(function(){
  const vv = window.visualViewport;
  const R = document.documentElement;
  const css =
    /* نافذة المحادثة تاخذ الجزء الظاهر بس، والشريط يقعد فوق الكيبورد */
    'body.aiopen #aiSheet{inset:auto;top:var(--vvt,0px);left:0;right:0;height:var(--vvh,100%)}' +
    'body.aiopen #aiBar{bottom:var(--kb,0px);transition:bottom .12s ease-out}' +
    'body.kbup #aiBar{padding-bottom:.5em}' +
    /* شاشة تغذية Rawan AI */
    '#rkbSheet{inset:auto!important;top:var(--vvt,0px)!important;left:0!important;right:0!important;height:var(--vvh,100%)!important}' +
    '#rkbSheet .rb{max-height:100%}' +
    'body.kbup #rkbSheet .rb{height:100%;border-radius:0}' +
    'body.kbup #rkbSheet .cp{padding-bottom:.6em!important}' +
    /* منع تكبير iOS للخانة (يصير لما الخط أصغر من 16px) */
    '#aiForm input#aiQ,#rkbIn,.nt-reply textarea{font-size:16px!important}';
  const st = document.createElement('style'); st.id = 'wdKbCss'; st.textContent = css; document.head.append(st);

  let wasUp = false;
  function scrollEnd(){
    const sb = document.querySelector('#aiSheet .sbody'), L = document.getElementById('aiLog');
    if(sb && L && document.body.classList.contains('aiopen')) sb.scrollTop = Math.max(0, L.offsetTop + L.offsetHeight - sb.clientHeight + 24);
    const ch = document.querySelector('#rkbSheet .ch'); if(ch) ch.scrollTop = ch.scrollHeight;
  }
  function upd(){
    if(!vv || !document.body) return;
    const base = Math.max(R.clientHeight, window.innerHeight);
    const h = vv.height, t = Math.max(0, vv.offsetTop);
    const kb = Math.max(0, Math.round(base - h - t));
    R.style.setProperty('--vvh', h + 'px'); R.style.setProperty('--vvt', t + 'px'); R.style.setProperty('--kb', kb + 'px');
    const up = kb > 80; document.body.classList.toggle('kbup', up);
    if(up !== wasUp){ wasUp = up; setTimeout(scrollEnd, 30); }
  }
  if(vv){ vv.addEventListener('resize', upd); vv.addEventListener('scroll', upd); }
  window.addEventListener('orientationchange', () => setTimeout(upd, 300));
  document.addEventListener('focusin', () => { setTimeout(upd, 50); setTimeout(upd, 350); });
  document.addEventListener('focusout', () => setTimeout(upd, 120));

  /* «تم» يسكّر الكيبورد مع النافذة */
  document.addEventListener('click', e => { if(e.target.closest && e.target.closest('#aiSheet .done, #rkbSheet .x')){ const a = document.activeElement; if(a && a.blur) a.blur(); } }, true);

  /* أول ما تنفتح المحادثة: الخانة جاهزة والمؤشر فيها */
  function watch(){
    upd();
    new MutationObserver(() => {
      const open = document.body.classList.contains('aiopen');
      if(open && !watch.o){ const q = document.getElementById('aiQ'); if(q && document.activeElement !== q){ try { q.focus({ preventScroll: true }); } catch(e){} } setTimeout(upd, 60); setTimeout(scrollEnd, 120); }
      watch.o = open;
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  if(document.body) watch(); else document.addEventListener('DOMContentLoaded', watch);
})();
