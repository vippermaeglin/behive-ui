
export const crefMask = value => {
    return value
      .replace(/-G\//g, '') // remove o separador G para evitar dupicidade
      .replace(/(^.{6})(.)/, '$1-G/$2') // adiciona "-G/" após 6 digitos
      .replace(/(-\d{4})\d+?$/, '$1') // captura 4 chars seguidos de um traço e não deixa ser digitado mais nada
      .toUpperCase()
  }