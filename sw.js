console.log('Service Worker');
self.addEventListener('install',(e)=>{
    console.log('instalado')
})

self.addEventListener('activate',(e)=>{
    console.log('activado');
})
self.addEventListener('fetch',(e)=>{
    console.log(e.request);
    if(e.request.url.includes('avenue.jpg'))
    e.respondWith(fetch('img/flowers.jpg'));
    else e.respondWith(fetch(e.request));
})

self.addEventListener('push',(e)=>{
    console.log("Notificación push");
});

self.addEventListener('sync',(e)=>{
console.log('Sync Event');
});