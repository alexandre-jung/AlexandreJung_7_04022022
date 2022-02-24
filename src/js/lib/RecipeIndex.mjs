import { slugify } from '../utils/string.js';
import { arrayIntersect } from '../utils/array.js';

function compareString(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Compares the string A with the beginning of B.
 * The return value has the same meaning as with String#localeCompare.
 */
function compareStart(a, b) {
  const _b = b.slice(0, a.length);
  return a < _b ? -1 : a > _b ? 1 : 0;
}

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

    const applianceMatch = appliances[0] && this.applianceIndex.get(appliances[0]).sort(compareString);

    // TODO this can be factorized.
    const ingredientMatches = ingredients.length
      ? ingredients.map((ingredient) => {
          return this.ingredientIndex.get(ingredient).sort(compareString);
        })
      : null;

    // TODO this can be factorized.
    const utensilMatches = utensils.length
      ? utensils.map((utensil) => {
          return this.utensilIndex.get(utensil).sort(compareString);
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

      if (compareStart(keyword, pivotItem[0]) < 0) return _search(start, middle - 1);
      else if (compareStart(keyword, pivotItem[0]) > 0) return _search(middle + 1, end);
      return middle;
    };

    // Get a match or return null.
    const matchIndex = _search(0, this.mainIndex.length - 1);
    if (Object.is(matchIndex, null)) return null;

    // Move backward until we find a non-matching item
    // or the start of the list.
    let firstIndex = matchIndex;
    while (firstIndex >= 0 && compareStart(keyword, this.mainIndex[firstIndex][0]) == 0) {
      firstIndex--;
    }
    // Replace index to the first matching item.
    firstIndex++;

    // Move forward until we find a non-matching item
    // or the end of the list.
    let lastIndex = matchIndex;
    while (lastIndex < this.mainIndex.length && compareStart(keyword, this.mainIndex[lastIndex][0]) == 0) {
      lastIndex++;
    }

    return this.mainIndex.slice(firstIndex, lastIndex);
  }

  buildIndex(recipes, minLength, exclude) {
    const searchIndex = new Map();
    recipes.forEach((recipe) => {
      const recipeKeywords = RecipeIndex.extractKeywordsFromRecipe(recipe, this.regex);
      recipeKeywords.forEach((keyword) => {
        if (keyword.length < minLength || exclude.has(keyword)) return;

        // TODO this can be factorized.
        if (!searchIndex.has(keyword)) {
          searchIndex.set(keyword, [recipe.id]);
        } else {
          searchIndex.get(keyword).push(recipe.id);
        }
      });

      // TODO this can be factorized.
      const appliance = slugify(recipe.appliance);
      if (!this.applianceIndex.has(appliance)) {
        this.applianceIndex.set(appliance, [recipe.id]);
      } else {
        this.applianceIndex.get(appliance).push(recipe.id);
      }

      // TODO this can be factorized.
      recipe.utensils.forEach((utensil) => {
        const utensilSlug = slugify(utensil);
        if (!this.utensilIndex.has(utensilSlug)) {
          this.utensilIndex.set(utensilSlug, [recipe.id]);
        } else {
          this.utensilIndex.get(utensilSlug).push(recipe.id);
        }
      });

      // TODO this can be factorized.
      recipe.ingredients.forEach(({ ingredient }) => {
        const ingredientSlug = slugify(ingredient);
        if (!this.ingredientIndex.has(ingredientSlug)) {
          this.ingredientIndex.set(ingredientSlug, [recipe.id]);
        } else {
          this.ingredientIndex.get(ingredientSlug).push(recipe.id);
        }
      });
    });
    this.mainIndex = Array.from(searchIndex).sort(([a], [b]) => compareString(a, b));

    // FIXME other index arrays are ordered because
    // recipes are already ordered by ID, otherwise
    // we should order them manually.
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
