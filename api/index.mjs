import fetch from 'node-fetch';
import './modules/duofetch.mjs';
import http from 'http';
import './link-resolver-import.mjs';
import './ecmascript.mjs';
import './ecmascript-xml.mjs';
import './en.json.mjs';
import './modules/cse-fetch.mjs';
import './modules/jsdomdoc.mjs';

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
  if(req.url.startsWith('/corsFetch/')){
    let apiURLString = req.url.split('/corsFetch/');
    apiURLString=apiURLString[apiURLString.length-1]
                       .replace('/corsFetch/','')
                       .replace('/','//')
                       .replace('///','//');
    console.log(apiURLString);
    return webscrapeFetch(apiURLString,res);
  }


return res.end('done');
}
