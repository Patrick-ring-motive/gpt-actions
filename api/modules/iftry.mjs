globalThis.ifTry=(bool,then,elseThen)=>{
  if(bool){
      try{
          if((typeof bool)=='function'){
              if(bool()){
                  return then();
              }else{
                  return elseThen();
              }
          }else{
              return then();
          }
      }catch(e){
          if(elseThen){
              return elseThen(e);
          }else{
              return;
          }
      }
  }else{
      if(elseThen){
          return elseThen(e);
      }else{
          return;
      }
  }
}

globalThis.$ifTry = async (bool, then, elseThen) => {
  bool = await bool;
  if (bool) {
    try {
      if (typeof bool == "function") {
        if (await bool()) {
          return await then();
        } else {
          return await elseThen(e);
        }
      } else {
        return await then();
      }
    } catch (e) {
      if (await elseThen) {
        return await (
          await elseThen
        )(e);
      } else {
        return;
      }
    }
  } else {
    if (await elseThen) {
      return await (
        await elseThen
      )(e);
    } else {
      return;
    }
  }
};