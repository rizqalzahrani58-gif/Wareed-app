/* ٣١ أكتوبر: أبو راكان شال تبويب «البيانات» (نضج اللوحة ٧٠٪ وبوابة الوكلاء) — الوكلاء يتعلمون لين يقرر هو إنهم نضجوا.
   النسخة السابقة محفوظة في Supabase Storage: site/backup-1031/biz-github-prebizdrop.js */

/* ٢ نوفمبر (قرار أبو راكان): روان العنزي تدخل التطبيق حتى لو جوالها ما يدعم التنبيهات (iOS أقدم من 16.4) أو التنبيهات مقفلة.
   بوابة التنبيهات في notify.js تبقى إجبارية لباقي الزملاء. لو جوالها يدعم ولسه ما فعّلت، تطلع لها البوابة عادي بزر «فعّل». */
(function(){
  const EX = ['038edc42-e5e9-4464-b6a3-a2ae5d61821c'];
  const can = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  let uid = null, busy = false;
  async function who(){ try { if(!window.sb) return null; const { data } = await window.sb.auth.getSession(); return data.session && data.session.user.id; } catch(e){ return null; } }
  async function check(){
    if(busy || !document.getElementById('wdPushGate')) return; busy = true;
    try {
      if(!uid) uid = await who();
      if(uid && EX.includes(uid) && !(can() && Notification.permission === 'default')){
        const g = document.getElementById('wdPushGate'); if(g) g.remove();
        document.documentElement.classList.remove('wdGate');
      }
    } finally { busy = false; }
  }
  new MutationObserver(check).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(check, 3000);
})();
