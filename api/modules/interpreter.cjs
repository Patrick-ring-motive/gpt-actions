const util = require('node:util'); 

const fs = require('fs');

async function writeCodeAsync(code) {
  let id = new Date().getTime();
  globalThis[`console${id}`]={};
  globalThis[`log${id}`] ='';
  globalThis[`console${id}`].log=function(){for(let i=0;i<arguments.length;i++){globalThis[`log${id}`]+=util.inspect(arguments[i]);}}
  try {
    fs.writeFileSync(`module${id}.mjs`, code.replaceAll('console.log',`globalThis.console${id}.log`));
    console.log('File written successfully');
  } catch (e) {
    console.log('Error writing file:', error);
  }

  return id;
}




globalThis.interpretCode = async function(code,options) {

  let output ='';
  let log = '';


    if(!(console.backuplog))
    {console.backuplog=console.log;}
    console.log = function(){for(let i=0;i<arguments.length;i++){log+=util.inspect(arguments[i]);}}

let strict = '';

  if(options?.strict){
    strict = '"use ' + 'strict";';
  }



    try{
      if(options?.module){
        try{
       output = await import(`data:text/javascript,${strict}${decodeURIComponent(code)}`);
        }catch(e){
         let id = await writeCodeAsync(decodeURIComponent(code));
          output = await import(`module${id}.mjs`);
          log += globalThis[`log${id}`];
          log += fs.readFileSync(`module${id}.mjs`, 'utf-8');
        }
      } else{ 
        if(options?.async){
        output = await eval(`${strict}${decodeURIComponent(code)}`);
        }else{
          output = eval(`${strict}${decodeURIComponent(code)}`);
        }
      }
    }catch(e){
      log += util.inspect(e);
      if(!output){
        output = e;
      }
    }

  console.log = console.backuplog;
try{
  if(`${output}`=='[object Object]'){
    if((output.value)&&(!(`${output.value}`.startsWith('code=')))){
      output=output.value;
    }else{
      output = util.inspect(output);
    }
  }
}catch(e){
  try{output = util.inspect(output);}catch(e){console.log(e.message);}
    console.log(e.message);
}
  output = `${output}`;
  if(log.trim().length==0){
  return 'return: '+output+'\nlog: '+log;
  }
  if((output.trim().length==0)||(output.includes('value: undefined'))||(`${output}`=='undefined')){

    if((!log)||(`${log}`=='undefined')){
      return "No valid values logged or returned. Try loggin output to the console.";
    }
  return log;
  }
  return 'return: '+output+'\nlog: '+log;
}


