const util = require('node:util'); 
globalThis.interpretCode = async function(code) {

  let output ='';
  let log = '';
  try{
    if(!(console.backuplog))
    {console.backuplog=console.log;}
    console.log = function(){for(let i=0;i<arguments.length;i++){log+=arguments[i];}}
    
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
    output = e.message;
  }
  console.log = console.backuplog;
  /*if(`${output}`=='[object Object]'){
    output = util.inspect(output);
  }*/
  output = `${output}`;
  if(log.trim().length==0){
  return output;
  }
  if(output.trim().length==0){
  return log;
  }
  return 'return: '+output+'|log: '+log;
}