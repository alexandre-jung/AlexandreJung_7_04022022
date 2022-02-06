export function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function makeKey(str) {
  return removeAccents(str).toLocaleLowerCase().replace(/ /g, '_');
}

export function capitalize(str) {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
}
