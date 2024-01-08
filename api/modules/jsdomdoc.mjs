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
    initDOM(text);
    let links = document.querySelectorAll('a');
    let links_length = links.length;
    for(let i=0;i<links_length;i++){
      a.innerHTML = a.href+' : '+a.innerHTML +'\n';
    }
    let useless = document.querySelectorAll('style,script');
    const useless_length = useless.length;
    for(let i=0;i<useless_length;i++){
      useless[i].remove();
    }
    text = `${document.body.textContent}`;
    text=text.slice(0,32000);
    res.setHeader('content-type','text/plain')


  res.setHeader('Acces-Control-Allow-Origin','*');

  return res.end(text);

}