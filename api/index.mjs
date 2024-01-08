import fetch from 'node-fetch';
import './modules/duofetch.mjs';
import http from 'http';
import './link-resolver-import.mjs';
import './ecmascript.mjs';
import './ecmascript-xml.mjs';
import './en.json.mjs';
import './modules/cse-fetch.mjs';

process.on('uncaughtException',e=>console.log(e));

const hostTarget = 'nodejs.org';

http.createServer(onRequest).listen(3000);



let skipHeaders=['content-length','content-encoding'];

async function onRequest(req, res) {
 /* console.log(req.url)*/
  let localhost = req.headers['Host'];
  
  if (req.url == '/ping') {
    res.statusCode = 200;
    return res.end();
  }
  if(req.url.startsWith('/searchfetch/')){
    return res.end(await searchfetch(req.url.split('/searchfetch/')[1]));
  }
  if(req.url.startsWith('/_root/')){req.url=req.url.replace('/_root/','/');}
  else if(req.url.startsWith('/_root')){req.url=req.url.replace('/_root','/');}

  //req.url=req.url.replace('index.json','en.json');


  let path = req.url.replace('*', '')
    .replace('.jsml','.json')
    .replace('.whtml','.html');

  

  let reqHeaders = {}
  for (const property in req.headers) {
    try {
      if (!skipHeaders.includes(property.toLowerCase())) {
        reqHeaders[property.toLowerCase()] = req.headers[property].replace(localhost,hostTarget);
      }
} catch (e) { continue; }
  }
  
  reqHeaders.host = hostTarget;
  reqHeaders.referer = 'https://'+hostTarget;

  

  let bdy = "";
  req.on('readable',_=>{bdy+=req.read()||'';});
  await new Promise(resolve=>{req.on('end',resolve);});

    /* finish reading the body of the request*/

    /* start copying over the other parts of the request */
    let options = {
      method: req.method,
      headers: reqHeaders
    };
    /* fetch throws an error if you send a body with a GET request even if it is empty */
    if ((req.method != 'GET') && (req.method != 'HEAD') && (bdy.length > 0)) {
      options = {
        method: req.method,
        headers: reqHeaders,
        body: bdy
      };
    }
    /* finish copying over the other parts of the request */

    /* fetch from your desired target */
    let response = await duofetch('https://' + hostTarget + path, options);

    /* if there is a problem try redirecting to the original */
    if (response.status > 399) {
      res.setHeader('location', 'https://' + hostTarget + path);
      res.statusCode = 302;
      return res.end();
    }

    /* copy over response headers  */
  for (let [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }
  for (let [key, value] of response.headers.keys()) {
    try {
      if (key.length > 1) {
        res.removeHeader(key);
        res.setHeader(key, value);
      }
    } catch (e) { continue; }
  }
  res.removeHeader('content-encoding');
  res.removeHeader('content-length');

    /* check to see if the response is not a text format */
    let ct = response.headers.get('content-type');
if(ct){
res.setHeader('content-type',ct+';charset=UTF-8');
}
    if ((ct) && (!ct.includes('image')) && (!ct.includes('video')) && (!ct.includes('audio'))) {
      let resBody = response.text();
if(req.url.includes('.json')){
        res.setHeader('content-type','application/json;charset=UTF-8');
      }

if(req.url.includes('.jsml')){
  res.setHeader('content-type','text/html;charset=UTF-8');
}

      if(req.url.includes('.whtml')){
        res.setHeader('content-type','text/html;charset=windows-1252');
      }

      if(req.url.includes('.mac')){
        res.setHeader('content-type','text/html;charset=Mac OS Roman');
      }
      if(req.url.includes('.htm16')){
        res.setHeader('content-type','text/html;charset=UTF-16');
      }

      if(req.url.includes('.text')){
        res.setHeader('content-type','text/plain;charset=UTF-8');
      }
      
      /* Copy over target response and return */
       resBody = await resBody;
      if(!(req.url.includes('/api'))){
      resBody = resBody.replaceAll('index.json','en.json');
      }
        resBody = resBody.replaceAll('HEAD','GET')
        .replace('<head>', `<head>
        <style>*{font-family:sans-serif;letter-spacing: -0.01em;}</style>`+`<script src="/sw.js"></script>`+
        /*`<link rel="stylesheet" href="/_next/static/css/eb2d2164875b4d4b.css" data-n-g="" backup>`+*/globalThis['link-resolver-import']+
                globalThis.ecmascriptx+
                  globalThis.ecmascript)
        .replace('<body','<head></head><body')
        //.replaceAll('/*','\n/*')
        .replaceAll(' * ',' /* ');

      if(resBody.includes('</body>')){
        let resBody2=resBody.split('</body>')[0]+'</body>';
        if(!(resBody2.includes('<main'))){
          resBody2=resBody2
            .replaceAll('body>','main>')
            .replaceAll('<body','<main');
        }
        resBody='<html>'+resBody+resBody2.replace(' id="main"',' id="main2"')
          .replaceAll('<script','<noscript')
          .replaceAll('/script>','/noscript>')
          +'<style> a[href*="/api/all."]{display:none !important;} main:nth-of-type(n + 2),footer:nth-of-type(n + 2),html[window-location*="/docs/api"]>body>main{display:none;} html{filter:hue-rotate(45deg);}</style></html>';
      }

      if(req.url.includes('noscript')){
        resBody=resBody
          .replaceAll('<script','<noscript')
        .replaceAll('/script>','/noscript>');
      }
    
      return res.end(resBody);


    } else {

      /* if not a text response then redirect straight to target */
      res.setHeader('location', 'https://' + hostTarget + path);
      res.statusCode = 302;
      return res.end();

    }



}
