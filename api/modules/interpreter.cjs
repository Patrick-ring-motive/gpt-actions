globalThis.interpretCode = async function(code) {

  let output ='';
  let log = '';
  try{
    console.backuplog=console.log;
    console.log = function(){log+=`${arguments}`;}
    output = await `${await eval(`
    (async function(){
      try{
        return ${decodeURIComponent(code)};
      }catch(e){
        return e.message;
      }
    })();
  `)}`;
  }catch(e){
    output = e.message;
  }
  return 'return: '+output+'|log: '+log;
}