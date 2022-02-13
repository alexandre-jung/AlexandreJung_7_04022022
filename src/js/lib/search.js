/* eslint-disable no-unused-vars */
import { removeDiacritics, slugify } from 'utils/string';

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

export default {
  /**
   * Initialize the search algorithm.
   */
  init(recipes) {
    // Can be used to build any type of index(es) to speed up search.
    // TODO initialize if needed.
  },

  /**
   * Return IDs of the recipes to display in an array.
   * Return null/nothing to clear search and display them all.
   */
  search(recipes, filteredRecipes, search, keywords) {
    /**
     * recipes/filteredRecipes: see mock/recipes,
     * search: key[],
     * keywords: {
     *   ingredients: key[],
     *   appliances: key[],
     *   utensils: key[],
     * },
     */
    // TODO write search algorithm here.

    /**
     * Algorithm:
     *
     * Based on filter(), map() and every() to check if a recipe fulfills requirements.
     * Comparisons are case-insensitive and ignore accents.
     *
     * 1. Filter all recipes.
     *    A recipe matches if:
     *      - All search words appear either in recipe name, ingredients or description.
     *        This is an inclusion test, so 'chocolat' matches with 'chocolat', 'chocolat au lait', 'chocolat noir', ...
     *        -> Main search is more permissive than keyword filtering.
     *      - All keywords appear in their corresponding category (ingredients, appliance, utensils).
     *        This is an equality test, so 'chocolat' matches only the exact string 'chocolat'.
     *        -> Keyword filtering is more restrictive than main search.
     *    If search is empty, all recipes matches. See the note below.
     * 2. Map the result to return an array of IDs.
     *
     * ❗ Using every() in checks works because it returns true on empty arrays.
     * This allows to keep all recipes when there is no search or keywords.
     */

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
  },
};

/* eslint-enable no-unused-vars */
