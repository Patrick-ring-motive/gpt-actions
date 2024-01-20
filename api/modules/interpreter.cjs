const util = require('node:util'); 




globalThis.interpretCode = async function(code,options) {
  code = code.replace(/%2F%2F%.*%0A/g,'');
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
          log += e.message;
          output = await import(`data:text/javascript;base64,${btoa(decodeURIComponent(code))}`);
        }
      } else{ 
        if(options?.async){
        output = await eval(`${strict}${decodeURIComponent(code)}`);
        }else{
          output = eval(`${strict}${decodeURIComponent(code)}`);
        }
      }
    }catch(e){
      log += e.message;
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
  try{output = util.inspect(output);}catch(e){}
    console.log(e.message);
}
  output = `${output}`;
  if(log.trim().length==0){
  return output;
  }
  if((output.trim().length==0)||(output.includes('value: undefined'))){

    if((!log)||(`${log}`=='undefined')){
      return "No valid values logged or returned. Try loggin output to the console.";
    }
  return log;
  }
  return 'return: '+output+'\nlog: '+log;
}


