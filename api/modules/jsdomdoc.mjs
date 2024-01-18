import nodeFetch  from 'node-fetch';
import { JSDOM } from 'jsdom'; 

function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

globalThis.initDOM=function(str){
const dom = new JSDOM(str);
globalThis.window=dom.window;
globalThis.document=window.document;
return document;
}

globalThis.webscrapeFetch=async function(url,res){
  let response = await fetch(url,{headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}});


    let text = await response.text();
    if(text.includes('<body')){
      text = '<body'+text.split('<body')[1].split('</html>')[0].split('</HTML>')[0];
    }
    initDOM(text);
    let links = document.querySelectorAll('a');
    let links_length = links.length;
    for(let i=0;i<links_length;i++){
      if(links[i].href.startsWith('http')){
      links[i].innerHTML = links[i].href+' : '+links[i].innerHTML +'\n';
      }
    }
    let useless = document.querySelectorAll('style,script');
    const useless_length = useless.length;
    for(let i=0;i<useless_length;i++){
      useless[i].remove();
    }
    text = `${document.body.textContent}`.replaceAll('\t',' ');
    text=text.replaceAll('\n ','\n');

    let count = 0;
    let text2=text.replace(/ +/g,' ');
    while((text2!=text)&&(count<100)){
    text=text2;
     text2 = text.replaceAll('  ',' ');
      count++;
    }
    text=text2.replaceAll('\n ','\n');

    count = 0;
    text2=text.replaceAll('\n\n','\n');
    while((text2!=text)&&(count<100)){
      text=text2;
     text2 = text.replaceAll('\n\n','\n');
      count++;
    }
    text=text2;
  
    text=text.slice(0,32000);
    res.setHeader('content-type','text/plain')


  res.setHeader('Acces-Control-Allow-Origin','*');

  return res.end(text);

}


globalThis.wikiscrapeFetch=async function(url,res){
  let response = await fetch(url,{headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}});


    let text = await response.text();
   if(text.includes('id="mw-content-text"')){
      text = text.split('id="mw-content-text"')[1];
      }
    if(text.includes('<main')){
      text = '<main'+text.split('<main')[1].split('</main>')[0];
    }
    text = text.replace(/<style.*\/style>/g,'')
      .replace(/<script.*\/script>/g,'')
      .replace(/<[^>]*>/g,'');
   // text = await Promise.race([timeoutDOM(text)],stripDOM(text));
  text=stripDOM(text);
  
    text=text.slice(0,50000);
    res.setHeader('content-type','text/plain')


  res.setHeader('Acces-Control-Allow-Origin','*');

  return res.end(text);

}


async function stripDOM(text){

 /* initDOM(text);
  let links = document.querySelectorAll('a');
  let links_length = links.length;
  for(let i=0;i<links_length;i++){
    if(links[i].href.startsWith('http')){
     links[i].innerHTML = links[i].href+' : '+links[i].innerHTML +'\n';
    }
  }
  let useless = document.querySelectorAll('style,script');
  const useless_length = useless.length;
  for(let i=0;i<useless_length;i++){
   useless[i].remove();
  }
  text = `${document.body.textContent}`.replaceAll('\t',' ');*/
  text = text.replaceAll('\t',' ');
  text=text.replaceAll('\n ','\n');

  let count = 0;
  let text2=text.replace(/ +/g,' ');
  while((text2!=text)&&(count<100)){
  text=text2;
   text2 = text.replaceAll('  ',' ');
    count++;
  }
  text=text2.replaceAll('\n ','\n');

  count = 0;
  text2=text.replaceAll('\n\n','\n');
  while((text2!=text)&&(count<100)){
    text=text2;
   text2 = text.replaceAll('\n\n','\n');
    count++;
  }
  text=text2;
  return text;
}

async function timeoutDOM(text){

await sleep(2000);
  return text;

  
}