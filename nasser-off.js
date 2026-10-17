/* وريد · حذف وكيل د. ناصر (Nasser AI) بقرار أبو راكان ١٧ أكتوبر ٢٠٢٦: ينشال من التطبيق، ود. ناصر يبقى يدخل ويشوف اللوحة بصلاحياته بدون وكيل خاص.
   ينضاف بعد rawan-class.js */
(function(){
  const P = window.__wdPatch = window.__wdPatch || { app: [] }; P.app = P.app || []; P.native = P.native || [];
  P.native.push(
    ["const head3 = isNasser ?", "const head3 = false ?"],
    ["const ptog = isNasser ?", "const ptog = false ?"],
    ["if(isNasser) waitFor(() => window.__setPersona).then(() => setPersona('nasser'));", ""]
  );
  P.app.push(
    ["د. ناصر الدوسري هو أبو صافي، وله وكيل «د. ناصر AI» في البيئة التعليمية.",
     "د. ناصر الدوسري هو أبو صافي، وما عنده وكيل خاص (وكيله انحذف بقرار أبو راكان ١٧ أكتوبر ٢٠٢٦)."],
    ["وقولي لها بسطر إنك علّمتي Rizq AI ود. ناصر AI وأي وكيل جديد، ولخّصي ردودهم بسطر.",
     "وقولي لها بسطر مين تعلّمها من الوكلاء، ولخّصي ردودهم بسطر."]
  );
  /* وصف أداة teach_agents بدون د. ناصر AI */
  const orig = window.__rawanClassTools;
  if(typeof orig === 'function') window.__rawanClassTools = (o) => orig(o).map(t => t.name === 'teach_agents' ? { ...t, description: t.description.replace('(Rizq AI ود. ناصر AI وأي وكيل جديد)', '(Rizq AI وأي وكيل في البيئة التعليمية)') } : t);
})();
