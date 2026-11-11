/* وريد — Service Worker v6 (١٢ نوفمبر ٢٠٢٦): يخزّن ملفات التطبيق من GitHub Pages ومن Supabase Storage (site/) معاً.
   الشبكة أولاً (مع مهلة ١٠ ثواني)، وإذا تعطّلت أو تأخرت يرجع للنسخة المخزّنة — عشان اللوحة تفتح حتى لو الشبكة ضعيفة.
   v5: أزرار الإشعارات (خلصت / أبي تمديد) — من ١٢ نوفمبر تفتح محادثة Rizq AI على المهمة (لمّاح اندمج فيه).
   v6: تحديث إجباري — أول ما تتفعّل النسخة الجديدة تمسح الكاش القديم وتعيد تحميل كل نوافذ التطبيق المفتوحة. */
const V='wareed-v6';const SCOPE=self.registration.scope;
const SITE='https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/';
const ours=u=>u.startsWith(SCOPE)||u.startsWith(SITE);
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  .then(()=>self.clients.matchAll({type:'window',includeUncontrolled:true})).then(cs=>Promise.all(cs.filter(c=>c.url.startsWith(SCOPE)).map(c=>c.navigate(c.url).catch(()=>{}))))));});
self.addEventListener('fetch',e=>{const u=e.request.url;if(e.request.method!=='GET'||!ours(u))return;
  e.respondWith((async()=>{const c=await caches.open(V);
    const net=(async()=>{const r=await fetch(e.request);if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone()).catch(()=>{});return r;})();
    const timer=new Promise(res=>setTimeout(()=>res(null),10000));
    try{const r=await Promise.race([net,timer]);if(r)return r;}catch(_){}
    const hit=await c.match(e.request,{ignoreVary:true});if(hit)return hit;
    try{return await net;}catch(err){return new Response('',{status:504,statusText:'offline'});}})());});
/* إشعارات وريد — sticky (مهمة جديدة، قرار ٢٦ أكتوبر): يبقى الإشعار ظاهر لين يُضغط */
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{};}catch(_){d={title:'وريد',body:e.data&&e.data.text()};}
  const o={body:d.body||'',tag:d.id||'wareed',dir:'rtl',lang:'ar',data:{url:d.url||'./'},
    icon:'https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/icon-192.png?v=2',badge:'https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/icon-192.png?v=2'};
  if(d.sticky){o.requireInteraction=true;o.renotify=true;o.vibrate=[300,150,300,150,300];}
  if(Array.isArray(d.actions)&&d.actions.length)o.actions=d.actions.slice(0,2).map(a=>({action:String(a.action||''),title:String(a.title||'')}));
  e.waitUntil(self.registration.showNotification(d.title||'وريد',o).then(()=>self.registration.update()).catch(()=>{}));});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=new URL((e.notification.data&&e.notification.data.url)||'./',SCOPE);
  if(e.action&&/^(done|ext|stuck)$/.test(e.action))u.searchParams.set('a',e.action);const url=u.href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.startsWith(SCOPE)){c.navigate(url).catch(()=>{});return c.focus();}}return self.clients.openWindow(url);}));});
