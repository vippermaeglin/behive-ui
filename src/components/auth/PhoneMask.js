
export const phoneMask = value => {
    return value
      .replace(/\D/g, '') //Remove tudo o que não é dígito
      .replace(/(d{2})(d)/g,'($1) $2') //Coloca parênteses em volta dos dois primeiros dígitos
      .replace(/(d)(d{5})$/,'$1-$2') //Coloca hífen entre o quinto e o sexto dígitos
  }