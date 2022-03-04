import { slugify } from 'utils/string.js';
import { arrayIntersect } from 'utils/array.js';
import { mapListProxify } from 'utils/proxies';
import { compareString, compareStringStart } from 'utils/string';

export default class RecipeIndex {
  constructor(recipes, keywordMinLength = 1, exclude) {
    this.regex = new RegExp(`\\p{LC}{${keywordMinLength},}`, 'gu');
    this.applianceIndex = new Map();
    this.utensilIndex = new Map();
    this.ingredientIndex = new Map();
    this.buildIndex(recipes, keywordMinLength, new Set(exclude));
  }

  search({ search, keywords: { appliances, utensils, ingredients } }) {
    const mainSearchMatches = search.map((word) => {
      const matchingEntries = this.findEntries(word);
      if (!matchingEntries) return null;
      return matchingEntries
        .map((entry) => entry[1])
        .flat()
        .sort((a, b) => a - b);
    });

    const applianceMatch = appliances[0] && this.applianceIndex.get(appliances[0]);

    // TODO this can be factorized.
    const ingredientMatches = ingredients.length
      ? ingredients.map((ingredient) => {
          return this.ingredientIndex.get(ingredient);
        })
      : null;

    // TODO this can be factorized.
    const utensilMatches = utensils.length
      ? utensils.map((utensil) => {
          return this.utensilIndex.get(utensil);
        })
      : null;

    const allMatchingIds = [];
    if (mainSearchMatches.length) allMatchingIds.push(...mainSearchMatches);
    if (applianceMatch) allMatchingIds.push(applianceMatch);
    if (ingredientMatches?.length) allMatchingIds.push(...ingredientMatches);
    if (utensilMatches?.length) allMatchingIds.push(...utensilMatches);

    return arrayIntersect(...allMatchingIds);
  }

  findEntries(keyword) {
    const _search = (start, end) => {
      if (start > end) return null;

      const middle = Math.floor((end - start) / 2) + start;
      const pivotItem = this.mainIndex[middle];

      if (compareStringStart(keyword, pivotItem[0]) < 0) return _search(start, middle - 1);
      else if (compareStringStart(keyword, pivotItem[0]) > 0) return _search(middle + 1, end);
      return middle;
    };

    // Get a match or return null.
    const matchIndex = _search(0, this.mainIndex.length - 1);
    if (Object.is(matchIndex, null)) return null;

    // Move backward until we find a non-matching item
    // or the start of the list.
    let firstIndex = matchIndex;
    while (firstIndex >= 0 && compareStringStart(keyword, this.mainIndex[firstIndex][0]) == 0) {
      firstIndex--;
    }
    // Replace index to the first matching item.
    firstIndex++;

    // Move forward until we find a non-matching item
    // or the end of the list.
    let lastIndex = matchIndex;
    while (lastIndex < this.mainIndex.length && compareStringStart(keyword, this.mainIndex[lastIndex][0]) == 0) {
      lastIndex++;
    }

    return this.mainIndex.slice(firstIndex, lastIndex);
  }

  buildIndex(recipes, minLength, exclude) {
    const searchIndex = new Map();
    const searchIndexProxy = mapListProxify(searchIndex, slugify);
    const ingredientIndexProxy = mapListProxify(this.ingredientIndex, slugify);
    const applianceIndexProxy = mapListProxify(this.applianceIndex, slugify);
    const utensilIndexProxy = mapListProxify(this.utensilIndex, slugify);

    recipes.forEach((recipe) => {
      const recipeKeywords = RecipeIndex.extractKeywordsFromRecipe(recipe, this.regex);
      recipeKeywords.forEach((keyword) => {
        if (keyword.length < minLength || exclude.has(keyword)) return;
        searchIndexProxy.append(keyword, recipe.id);
      });

      applianceIndexProxy.append(recipe.appliance, recipe.id);

      recipe.utensils.forEach((utensil) => {
        utensilIndexProxy.append(utensil, recipe.id);
      });

      recipe.ingredients.forEach(({ ingredient }) => {
        ingredientIndexProxy.append(ingredient, recipe.id);
      });
    });
    this.mainIndex = Array.from(searchIndex).sort(([a], [b]) => compareString(a, b));
    this.applianceIndex.forEach((ids) => ids.sort());
    this.utensilIndex.forEach((ids) => ids.sort());
    this.ingredientIndex.forEach((ids) => ids.sort());
  }

  static extractKeywordsFromRecipe(recipe, regex) {
    const { name, ingredients, description } = recipe;
    const keywords = new Set([
      ...RecipeIndex.extractKeywordsFromString(name, regex),
      ...RecipeIndex.extractKeywordsFromString(description, regex),
      ...ingredients.map(({ ingredient }) => RecipeIndex.extractKeywordsFromString(ingredient, regex)).flat(),
    ]);
    return Array.from(keywords);
  }

  static extractKeywordsFromString(string, regex) {
    return string.match(regex)?.map((kw) => slugify(kw)) ?? [];
  }
}
