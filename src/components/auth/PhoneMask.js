//https://medium.com/@igorrozani/criando-uma-express%C3%A3o-regular-para-telefone-fef7a8f98828
// "\(\d{2}\)\s\d{4,5}\-\d{4}"
//http://wbruno.com.br/expressao-regular/mascara-campo-de-telefone-em-javascript-com-regex-nono-digito-telefones-sao-paulo/
export const phoneMask = value => {
    return value
      .replace(/\D/g, '') //Remove tudo o que não é dígito
      .replace(/(\d{2})(\d)/,'($1) $2') //Coloca parênteses em volta dos dois primeiros dígitos
      .replace(/(\d)(\d{4})$/,'$1-$2') //Coloca hífen entre o quinto e o sexto dígitos
  }