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
    if(code.includes('return')){
    output = await eval(`
    (async function*(){
      try{
        do{
         ${decodeURIComponent(code)};
        }while('');
      }catch(e){
        return e.message;
      }
    })().next();
  `);
    }else{
      try{
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
      }catch(e){
        output = await eval(`
        (async function*(){
          try{
            do{
            return eval(\`${decodeURIComponent(code)}\`);
            }while('');
          }catch(e){
            return e.message;
          }
        })().next();
        `);
      }
    }
  }catch(e){
    try{
      output = await eval(`
        (async function*(){
          try{
            do{
            return eval(\`${decodeURIComponent(code)}\`);
            }while('');
          }catch(e){
            return e.message;
          }
        })().next();
      `);
    }catch(e){
    output = `code=${decodeURIComponent(code)}\n`+util.inspect(e);
    }
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