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
    'pages/offline.html'
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

//Por medio de una estrategia de cache y el evento fetch mostrar en pantalla
//la pagina offline cuando se solicite el recurso page2.html y no haya internet


self.addEventListener('fetch',(e)=>{
   /*  console.log(e.request);
    if(e.request.url.includes('avenue.jpg'))
    e.respondWith(fetch('img/flowers.jpg'));
    else e.respondWith(fetch(e.request)); */
    //1. Cache Only toda la app es servida por el cache
    // e.respondWith(caches.match(e.request));
    //2. Cache with network fallback si el recurso no lo encuentra en el cache lo busca en internet 
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
    //3 Networkwith cache fallback siempre va estar actualizado mientras tenga internet sino utiliza el cache
    const source = fetch(e.request).then(res =>{
        if(!res) throw Error('Not Found');
        //Checar si el recurso ya existe en algún cache
        caches.open(DYNAMIC).then(cache=>{
            cache.put(e.request,res);
        })
        return res.clone();
    }).catch(errr=>{
        if(/page2\.html/gi.test(e.request.url))
            return caches.match('pages/offline.html')
        return caches.match(e.request);
    });
    e.respondWith(source);
    //4. Cache with network update
    // la aplicacion simpre va estara actulizada sino esta en el cache lo va agregar y si hay uno actualizado devulve el actual y lo actualiza
    //rendimiento critico si el rendimiento es bajo 
    //desventaja toda la app esta un paso atras 
    // al momento de cambiar cualquier archivo lo va arrojar desde cache
    /* if(e.request.url.includes('bootstrap'))
    return e.respondWith(caches.match(e.request));
   const source = caches.open(STATIC).then(cache=>{
    fetch(e.request).then(res=>{
        cache.put(e.request,res);
    });
    return cache.match(e.request);
   });
   e.respondWith(source); */

   //5. Cache and network race
   // Se mandan las dos peticiones y la primera que conteste es la que va a mostrar
   /* const source = new Promise((resolve,reject)=>{
    let rejected = false; // esta es nuestra bandera
    //validar en caso de que los dos recursos no esten disponibles
    const failsOnce =() => {
        if(rejected){
            if(/page2\.html/i.test(e.request.url)){  //expresion regular para ver que vengan imagenes
                resolve(caches.match('pages/offline.html'));

            }if(e.request.url.includes('page2.html')){
                resolve(caches.match('pages/offline.html));
            }
            
            else{
                reject("SourceNotFound");
            }
        }else{
            rejected = true;
        }
    };
    // se manda como en una carrera tanto al cache como al internet 
    fetch(e.request).then(res=>{
        res.ok ? resolve(res) : failsOnce();
    }).catch(failsOnce());
    caches.match(e.request).then(cacheRes =>{
        cacheRes.ok ? resolve(cacheRes) : failsOnce();
    }).catch(failsOnce());

   });

    e.respondWith(source);
}) */

/* self.addEventListener('push',(e)=>{
    console.log("Notificación push");
});

self.addEventListener('sync',(e)=>{
console.log('Sync Event');
}); */
});