import fetch from 'node-fetch';
import './modules/duofetch.mjs';
import http from 'http';
import './link-resolver-import.mjs';
import './ecmascript.mjs';
import './ecmascript-xml.mjs';
import './en.json.mjs';
import './modules/cse-fetch.mjs';
import './modules/google-search.mjs';
import './modules/jsdomdoc.mjs';
await import('./modules/interpreter.cjs');

process.on('uncaughtException',e=>console.log(e));


http.createServer(onRequest).listen(3000);





async function onRequest(req, res) {

  if (req.url == '/ping') {
    res.statusCode = 200;
    return res.end();
  }
  if(req.url.startsWith('/searchfetch/')){
    let query = req.url.replace('/searchfetch/','/searchfetch').split('/searchfetch')[1].replace('?query=','');
    return res.end(await searchfetch(query));
  }
  if(req.url.startsWith('/googlesearch/')){
    let query = req.url.replace('/googlesearch/','/googlesearch').split('/googlesearch')[1].replace('?query=','');
    return res.end(await googlesearch(query));
  }
  if(req.url.startsWith('/corsFetch/')){
    let apiURLString = req.url.split('/corsFetch/');
    apiURLString=apiURLString[apiURLString.length-1]
                       .replace('/corsFetch/','')
                       .replace('/','//')
                       .replace('///','//');
    console.log(apiURLString);
    return webscrapeFetch(apiURLString,res);
  }

  if(req.url.startsWith('/wiki/')){
  let wikiURLString = 'https://script.google.com/macros/s/AKfycbxC7sB6VHSpH4CxY49wSioMqK65WvEvWEVXL-AAZ38RJ4d-vSPa5vgdks6RIdr1t1KGFA/exec'+req.url.replace('/wiki/','');
    console.log(wikiURLString);
    return wikiscrapeFetch(wikiURLString,res);
  }

  
  if(req.url.startsWith('/js-interpret')){
    let code = req.url.replace('/js-interpret/','/js-interpret').split('/js-interpret')[1].replace('?code=','');

    if((!code)||(code.trim()=='')){
      code='';
      req.on('readable',_=>{code+=req.read()||'';});
      await new Promise(resolve=>{req.on('end',resolve);});
    }
    
    return res.end(await interpretCode(code));
  }

return res.end('done');
}
