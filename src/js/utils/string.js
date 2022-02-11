export function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function slugify(str, separator = '_') {
  return removeDiacritics(str).toLocaleLowerCase().replace(/ /g, separator);
}

export function capitalize(str) {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
}
