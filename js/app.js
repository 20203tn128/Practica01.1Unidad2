console.log('APPJS');
if(navigator.serviceWorker){// este objet navigator va a ver si existe el serviceworker en el navegador que se esta usando
    navigator.serviceWorker.register('sw.js'); 
}