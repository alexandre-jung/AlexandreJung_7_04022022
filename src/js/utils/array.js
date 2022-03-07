export function arraysEqual(array1, array2) {
  if (array1.length != array2.length) return false;
  for (let i = array1.length; i >= 0; i--) {
    if (array1[i] != array2[i]) return false;
  }
  return true;
}

// TODO write an iterative version.
// FIXME under certain circumstances, null/undefined values
// are not completely ignored.
/**
 * Find all common values in any number of sorted arrays
 * in a recursive, non-destructive way.
 *
 * Arguments must be any[], null or undefined,
 * null and undefined are considered like empty arrays.
 *
 * Returns a sorted array where all values are unique.
 * If called without arguments, returns [].
 * If called with one array, returns the same.
 *
 * ⚠️ If input arrays are not sorted,
 *    it will lead to undetermined behaviors.
 */
export function arrayIntersect(...arrays) {
  if (!Array.isArray(arrays)) return null;

  const arraysStartLength = arrays.length;
  if (arraysStartLength == 0) return [];

  const a = arrays.pop() ?? [];
  const b = arrays.pop() ?? [];

  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw Error('Arguments must be any[], null or undefined');
  }

  // Only one array -> deduplicate its values and return.
  if (arraysStartLength == 1)
    return a.reduce((accumulator, current) => {
      if (current != accumulator[accumulator.length - 1]) accumulator.push(current);
      return accumulator;
    }, []);

  let result = [];
  let aIndex = 0;
  let bIndex = 0;
  while (aIndex < a.length && bIndex < b.length) {
    // If a value is lower than the other,
    // move the corresponding index forward.
    if (a[aIndex] < b[bIndex]) aIndex++;
    else if (a[aIndex] > b[bIndex]) bIndex++;
    // Both values are equal: add it once and move indexes.
    else {
      if (a[aIndex] != result[result.length - 1]) {
        result.push(a[aIndex]);
      }
      aIndex++;
      bIndex++;
    }
  }

  return arrayIntersect(result, ...arrays);
}
