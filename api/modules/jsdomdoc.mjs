import jsdom from 'jsdom';
import { JSDOM } from 'jsdom'; 


globalThis.initDOM=function(str){
const dom = new JSDOM(str);
globalThis.window=dom.window;
globalThis.document=window.document;
return document;
}

globalThis.webscrapeFetch=async function(url,res){
  let response = await fetch(url,{headers:{"user-agent":"banana"}});


    let text = await response.text();
    if(text.includes('<body')){
      text = '<body'+text.split('<body')[1].split('</html>')[0].split('</HTML>')[0];
    }
    text=text.slice(0,32000);
    res.setHeader('content-type','text/plain')


  response.setHeader('Acces-Control-Allow-Origin','*');

  return res.end(text);

}