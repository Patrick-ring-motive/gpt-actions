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
    return res.end(await searchfetch(req.url.split('/searchfetch/')[1]));
  }
  if(req.url.startsWith('/googlesearch/')){
    return res.end(await googlesearch(req.url.split('/googlesearch/')[1]));
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
  if(req.url.startsWith('/js-interpret')){
    let code = req.url.replace('/js-interpret/','/js-interpret').split('/js-interpret')[1];

    if((!code)||(code.trim()=='')){
      code='';
      req.on('readable',_=>{code+=req.read()||'';});
      await new Promise(resolve=>{req.on('end',resolve);});
    }
    
    return res.end(await interpretCode(code));
  }

return res.end('done');
}
