const V='wareed-v3';const SCOPE=self.registration.scope;
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(SCOPE))return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request)));});
/* إشعارات وريد */
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{};}catch(_){d={title:'وريد',body:e.data&&e.data.text()};}
  e.waitUntil(self.registration.showNotification(d.title||'وريد',{body:d.body||'',tag:d.id||'wareed',dir:'rtl',lang:'ar',data:{url:d.url||'./'},
    icon:'https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/icon-192.png?v=2',badge:'https://zymsuvxoylpxowkhycuv.supabase.co/storage/v1/object/public/site/icon-192.png?v=2'}));});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=new URL((e.notification.data&&e.notification.data.url)||'./',SCOPE).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.startsWith(SCOPE)){c.navigate(url).catch(()=>{});return c.focus();}}return self.clients.openWindow(url);}));});
