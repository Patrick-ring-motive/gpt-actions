globalThis.interpretCode = async function(code) {

  let output = eval(`

  ${code}
  
  `);
  return output;
}