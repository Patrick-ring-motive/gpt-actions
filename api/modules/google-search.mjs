


import './duofetch.mjs';
globalThis.googlesearch = async function (query){
let cx = 'a1e5f54f854494cd5';
let cxurl = 'https://cse.google.com/cse.js?hpg=1&cx=' + cx;


if(!globalThis.cse_tok){
let script_raw = await fetchText(cxurl);
globalThis.google_cse_tok = JSONExtract(script_raw, "cse_token");
}


let cse_url = `https://cse.google.com/cse/element/v1?rsz=10&num=10&hl=en&source=gcsc&gss=.com&cx=${cx}&q=${query}&safe=off&cse_tok=${google_cse_tok}&lr=&cr=&gl=&filter=1&sort=&as_oq=&as_sitesearch=&exp=csqr%2Ccc&oq=${query}&cseclient=hosted-page-client&callback=google.search.cse.api`;

return fetchText(cse_url);
}

async function fetchText(url, options) {
  let txt = "";
  try {
    txt = await (await duofetch(url, options)).text();
  } catch (e) {
    txt = e.message;
  }
  return txt;
}


function JSONExtract(raw, key) {

  let json_key = '"' + key + '"';
  let json_val = raw.split(json_key)[1].split('"')[1];

  return json_val;


}
