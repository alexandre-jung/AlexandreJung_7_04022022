export function arraysEqual(array1, array2) {
  if (array1.length != array2.length) return false;
  for (let i = array1.length ; i >= 0 ; i --) {
    if (array1[i] != array2[i]) return false;
  }
  return true;
}
