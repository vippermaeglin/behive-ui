export const zipMask = value => {
    return value
      .replace(/\D/g, '') //Remove tudo o que não é dígito
      .replace(/(\d{5})(\d)/,'$1-$2') //Coloca hífen entre o quinto e o sexto dígitos
  }