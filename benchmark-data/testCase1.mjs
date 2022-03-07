import recipes from './recipes.mjs';

export function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function slugify(str, separator = '_') {
  return removeDiacritics(str).toLocaleLowerCase().replace(/ /g, separator);
}

function normalizedContains(needle, haystack) {
  const regexp = new RegExp(removeDiacritics(needle), 'gi');
  return regexp.test(removeDiacritics(haystack));
}

function normalizedEquals(string1, string2) {
  return slugify(string1) == slugify(string2);
}

function normalizedArrayIncludes(needle, haystack) {
  for (const haystackItem of haystack) {
    if (normalizedEquals(needle, haystackItem)) return true;
  }
  return false;
}

function search(recipes, filteredRecipes, search, keywords) {
  return recipes
    .filter(({ name, description, ingredients, appliance, utensils }) => {
      return (
        search
          .map((searchWord) => {
            return (
              normalizedContains(searchWord, name) ||
              normalizedContains(searchWord, ingredients.map(({ ingredient }) => ingredient).join(' ')) ||
              normalizedContains(searchWord, description)
            );
          })
          .every((v) => v) &&
        keywords.ingredients
          .map((ingredient) =>
            normalizedArrayIncludes(
              ingredient,
              ingredients.map(({ ingredient }) => ingredient)
            )
          )
          .every((v) => v) &&
        keywords.appliances.map((_appliance) => normalizedEquals(_appliance, appliance)).every((v) => v) &&
        keywords.utensils.map((utensil) => normalizedArrayIncludes(utensil, utensils)).every((v) => v)
      );
    })
    .map(({ id }) => id);
}

const searchTerms = {
  search: ['coco'],
  keywords: {
    ingredients: [],
    appliances: [],
    utensils: [],
  },
};

/*
 * Test case
 */
const matches = search(recipes, null, searchTerms.search, searchTerms.keywords);
