import nodeFetch  from 'node-fetch';


globalThis.duofetch = function(){
const flip=Math.floor(Math.random() *2);
let primeFetch=fetch;
let secFetch=nodeFetch;
  if(flip){
    primeFetch=nodeFetch;
    secFetch=fetch;
  }
  try{
    return primeFetch(...arguments);
  }catch(e){
    return secFetch(...arguments);
  }


};