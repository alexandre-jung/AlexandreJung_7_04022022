export function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function slugify(str, separator = '_') {
  return removeDiacritics(str).toLocaleLowerCase().replace(/ /g, separator);
}

export function capitalize(str) {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
}

/**
 * Compares two strings.
 */
export function compareString(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Compares the string A with the beginning of B.
 * The return value has the same meaning as with String#localeCompare.
 */
export function compareStringStart(a, b) {
  const _b = b.slice(0, a.length);
  return a < _b ? -1 : a > _b ? 1 : 0;
}
