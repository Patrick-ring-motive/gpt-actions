const util = require('node:util'); 
let ifTryPromise = import('./iftry.mjs');
globalThis.interpretCode = async function(code) {
  if(!globalThis.ifTry){
    await ifTryPromise;
  }
  let output ='';
  let log = '';
  try{
    if(!(console.backuplog))
    {console.backuplog=console.log;}
    console.log = function(){for(let i=0;i<arguments.length;i++){log+=arguments[i];}}
    await $ifTry(code.includes('return'),async then=>{
    output = await eval(`
    (async function*(){
      try{
        do{
         ${decodeURIComponent(code)};
        }while('');
      }catch(e){
        try{
          do{
           return ${decodeURIComponent(code)};
          }while('');
      }catch(e){
        return e.message;
      }
      }
    })().next();
  `);
    },async (elseCatch)=>{
      output = await eval(`
      (async function*(){
        try{
          do{
          return ${decodeURIComponent(code)};
          }while('');
        }catch(e){
          try{
            do{
             ${decodeURIComponent(code)};
            }while('');
        }catch(e){
          return e.message;
        }
        }
      })().next();
      `);
    });
  }catch(e){
    output = e.message;
  }
  console.log = console.backuplog;
  if(`${output}`=='[object Object]'){
    if(output.value){
      output=output.value;
    }else{
      output = util.inspect(output);
    }
  }
  output = `${output}`;
  if(log.trim().length==0){
  return output;
  }
  if((output.trim().length==0)||(output.includes('value: undefined'))){
  return log;
  }
  return 'return: '+output+'|log: '+log;
}