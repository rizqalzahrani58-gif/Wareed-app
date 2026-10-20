/* وريد — Service Worker v4 (٢٠ أكتوبر): يخزّن ملفات التطبيق من GitHub Pages ومن Supabase Storage (site/) معاً.
   الشبكة أولاً (مع مهلة ١٠ ثواني)، وإذا تعطّلت أو تأخرت يرجع للنسخة المخزّنة — عشان اللوحة تفتح حتى لو الشبكة ضعيفة. */
const V='wareed-v4';const SCOPE=self.registration.scope;
const SITE='https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/';
const ours=u=>u.startsWith(SCOPE)||u.startsWith(SITE);
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=e.request.url;if(e.request.method!=='GET'||!ours(u))return;
  e.respondWith((async()=>{const c=await caches.open(V);
    const net=(async()=>{const r=await fetch(e.request);if(r&&(r.ok||r.type==='opaque'))c.put(e.request,r.clone()).catch(()=>{});return r;})();
    const timer=new Promise(res=>setTimeout(()=>res(null),10000));
    try{const r=await Promise.race([net,timer]);if(r)return r;}catch(_){}
    const hit=await c.match(e.request,{ignoreVary:true});if(hit)return hit;
    try{return await net;}catch(err){return new Response('',{status:504,statusText:'offline'});}})());});
/* إشعارات وريد */
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{};}catch(_){d={title:'وريد',body:e.data&&e.data.text()};}
  e.waitUntil(self.registration.showNotification(d.title||'وريد',{body:d.body||'',tag:d.id||'wareed',dir:'rtl',lang:'ar',data:{url:d.url||'./'},
    icon:'https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/icon-192.png?v=2',badge:'https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/icon-192.png?v=2'}));});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=new URL((e.notification.data&&e.notification.data.url)||'./',SCOPE).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.startsWith(SCOPE)){c.navigate(url).catch(()=>{});return c.focus();}}return self.clients.openWindow(url);}));});
