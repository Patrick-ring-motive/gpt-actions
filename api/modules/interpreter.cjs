globalThis.interpretCode = async function(code) {

  let output =''; 
  try{
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
  return output;
}