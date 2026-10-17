# تطبيق وريد

## البنية (من ١٧ أكتوبر ٢٠٢٦)
- الكود الأساسي مدموج ومنشور في Supabase Storage: `site/v2/app.js`، `site/v2/native.js`، `site/v2/fm.js`، `site/v2/room.js`.
  تعديلات `__wdPatch` القديمة (٤٩ لـ app و١١ لـ native) صارت جزء من الملفات نفسها، وما عاد تنطبق وقت التحميل.
- `index.html` يحمّل ملفات v2 مباشرة. `window.__wdPatch` فاضي وما ينقرأ.
- السكربتات الباقية (`wd-patch5.js`، `rawan-privacy.js`، `rawan-kb.js`، `rawan-class.js`، `nasser-off.js`) تحمّل لأن فيها دوال تشغيل يحتاجها الكود المدموج (`__wdRoll`، `__rkbCtx`، `__rawanClassTools`، `__clsCtx`، واجهة ذاكرة Rawan AI). أجزاء التعديلات اللي فيها ما عاد لها أثر.
- `wd-patch.js` و`rawan-ceo.js` و`room.js` هنا نسخ قديمة مرجعية بس (ما تتحمّل).

## النشر
دالة `site-deploy` (Supabase Edge Function) محمية برمز `settings/deploy_token`. تاخذ لكل ملف: المصدر (`src`)، واستبدالات حرفية دقيقة (كل وحدة لازم تنطبق مرة وحدة بالضبط وإلا يوقف بدون نشر)، ومكان النشر (`out`). `dry: true` يحسب بدون نشر.
أي تعديل جديد: ينطبق على ملف v2 نفسه ويننشر بنسخة جديدة (`?v=`)، وما نضيف سكربتات تعديل جديدة.
