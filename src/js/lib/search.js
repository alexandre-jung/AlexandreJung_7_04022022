/* eslint-disable no-unused-vars */
import RecipeIndex from './RecipeIndex';

export default {
  /**
   * Initialize the search algorithm.
   */
  init(recipes) {
    this.index = new RecipeIndex(recipes);
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

    // TODO write algorithm description.
    if (
      !search.length &&
      !keywords.appliances.length &&
      !keywords.utensils.length &&
      !keywords.ingredients.length
    )
      return null;
    return this.index.search({ search, keywords });
  },
};

/* eslint-enable no-unused-vars */
