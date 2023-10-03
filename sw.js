const STATIC = 'staticv1';
const STATIC_LIMIT=15;
const INMUTABLE ='inmutablev1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30;
//Todos los recursos propios de la aplicación
const APP_SHELL = [
    '/' ,
    '/index.html',
    'css/styles.css',
    'img/avenue.jpg',
    'js/app.js',
];

//Todos aquellos recursos que nunca cambian
const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];


console.log('Service Worker');
self.addEventListener('install',(e)=>{
    //e.skipWaiting();  forma de evitar el skipWaiting
    const staticCache = caches.open(STATIC).then((cache)=>{
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE).then((cache)=>{
        cache.addAll(APP_SHELL_INMUTABLE);
    });
    e.waitUntil(Promise.all([staticCache,inmutableCache]));
})

self.addEventListener('activate',(e)=>{
    console.log('activado');
})
self.addEventListener('fetch',(e)=>{
   /*  console.log(e.request);
    if(e.request.url.includes('avenue.jpg'))
    e.respondWith(fetch('img/flowers.jpg'));
    else e.respondWith(fetch(e.request)); */
    //1. Cache Only
    // e.respondWith(caches.match(e.request));
    //2. Cache with network falback
   /*  const source = caches.match(e.request).then((res)=>{
        if(res) return res;
        return fetch(e.request).then(resFetch=>{
            caches.open(DYNAMIC).then(cache =>{
                cache.put(e.request,resFetch);
            });
            return resFetch.clone();
        });
    });
    e.respondWith(source); */
    //3 Networkwith cache fallback
   /*  const source = fetch(e.request).then(res =>{
        if(!res) throw Error('Not Found');
        //Checar si el recurso ya existe en algún cache
        caches.open(DYNAMIC).then(cache=>{
            cache.put(e.request,res);
        })
        return res.clone();
    }).catch(errr=>{
        return caches.match(e.request);
    });
    e.respondWith(source); */
    //4. Cache with network update
    // la aplicacion simpre va estara ctulizada sino esta en el cache lo va agregar y si hay uno actualizado devulve el actual y lo actualiza
    //rendimiento critico si el rendimiento es bajo 
    //desventaja toda la app esta un paso atras 
    // al momento de cambiar cualquier archivo lo va arrojar desde cache
    if(e.request.url.includes('bootstrap'))
    return e.respondWith(caches.match(e.request));
   const source = caches.open(STATIC).then(cache=>{
    fetch(e.request).then(res=>{
        cache.put(e.request,res);
    });
    return cache.match(e.request);
   });
   e.respondWith(source);

    
})

/* self.addEventListener('push',(e)=>{
    console.log("Notificación push");
});

self.addEventListener('sync',(e)=>{
console.log('Sync Event');
}); */