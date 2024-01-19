const util = require('node:util'); 
let ifTryPromise = import('./iftry.mjs');
globalThis.interpretCode = async function(code) {
  if(!globalThis.ifTry){
    await ifTryPromise;
  }
  let output ='';
  let log = '';
 
  
    if(!(console.backuplog))
    {console.backuplog=console.log;}
    console.log = function(){for(let i=0;i<arguments.length;i++){log+=arguments[i];}}
  
    try{
      output = await eval(`${decodeURIComponent(code)}`);
    }catch(e){
      if(!output){
        output = e;
      }
    }
 
  console.log = console.backuplog;
  if(`${output}`=='[object Object]'){
    if((output.value)&&(!(`${output.value}`.startsWith('code=')))){
      output=output.value;
    }else{
      output = util.inspect(output);
    }
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