console.log('APPJS');
const url = window.location.href;
const API = `http://localhost:3000/api`;
let swLocation='/reportes/sw.js';
if(navigator.serviceWorker){// este objet navigator va a ver si existe el serviceworker en el navegador que se esta usando
    if(url.includes('localhost')|| url.includes('127.0.0.1')){
        swLocation = '/sw.js';
    }
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register(swLocation).then((redg)=>{
            //Code
        }); 
    });
    
}