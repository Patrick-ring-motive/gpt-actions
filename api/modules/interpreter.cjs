const util = require('node:util'); 

const fs = require('fs/promises');

async function writeCodeAsync(code) {
  let id = new Date().getTime();
  try {
    await fs.writeFile(`/tmp/module${id}.mjs`, code);
    console.log('File written successfully');
  } catch (error) {
    console.error('Error writing file:', error);
  }
  return id;
}



let ifTryPromise = import('./iftry.mjs');
globalThis.interpretCode = async function(code,options) {
  if(!globalThis.ifTry){
    await ifTryPromise;
  }
  let output ='';
  let log = '';
 
  
    if(!(console.backuplog))
    {console.backuplog=console.log;}
    console.log = function(){for(let i=0;i<arguments.length;i++){log+=arguments[i];}}

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
          output = await import(`/tmp/module${id}.mjs`);
        }
      } else{ 
        if(options?.async){
        output = await eval(`${strict}${decodeURIComponent(code)}`);
        }else{
          output = eval(`${strict}${decodeURIComponent(code)}`);
        }
      }
    }catch(e){
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
    console.log('An error occurred:', error.message);
}
  output = `${output}`;
  if(log.trim().length==0){
  return output;
  }
  if((output.trim().length==0)||(output.includes('value: undefined'))||(`${output}`=='undefined')){

    if((!log)||(`${log}`=='undefined')){
      return "No valid values logged or returned. Try loggin output to the console.";
    }
  return log;
  }
  return 'return: '+output+'\nlog: '+log;
}


