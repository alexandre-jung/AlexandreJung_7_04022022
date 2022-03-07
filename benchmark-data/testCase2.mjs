import recipes from './recipes.mjs';

function arrayIntersect(...arrays) {
  if (!Array.isArray(arrays)) return null;

  const arraysStartLength = arrays.length;
  if (arraysStartLength == 0) return [];

  const a = arrays.pop() ?? [];
  const b = arrays.pop() ?? [];

  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw Error('Arguments must be any[], null or undefined');
  }

  if (arraysStartLength == 1)
    return a.reduce((accumulator, current) => {
      if (current != accumulator[accumulator.length - 1]) accumulator.push(current);
      return accumulator;
    }, []);

  let result = [];
  let aIndex = 0;
  let bIndex = 0;
  while (aIndex < a.length && bIndex < b.length) {
    if (a[aIndex] < b[bIndex]) aIndex++;
    else if (a[aIndex] > b[bIndex]) bIndex++;
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

function mapAppend(target, transformKey) {
  return function (key, value) {
    const _key = transformKey ? transformKey(key) : key;
    if (target.has(_key)) target.get(_key).push(value);
    else target.set(_key, [value]);
    return target;
  };
}

function mapSortValues(target) {
  return function (predicate) {
    target.forEach((value) => value.sort(predicate));
    return target;
  };
}

function mapListProxify(map, transformKey) {
  return new Proxy(map, {
    get: function (target, property) {
      switch (property) {
        case 'append':
          return mapAppend(target, transformKey);
        case 'sort':
          return mapSortValues(target);
      }
      const prop = Reflect.get(target, property);
      return typeof prop == 'function' ? prop.bind(target) : prop;
    },
  });
}

function compareString(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function compareStringStart(a, b) {
  const _b = b.slice(0, a.length);
  return a < _b ? -1 : a > _b ? 1 : 0;
}

function findMatches(indexMap, kwList) {
  return kwList.length ? kwList.map((kw) => indexMap.get(kw)) : null;
}

class RecipeIndex {
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

    console.log(mainSearchMatches);

    const applianceMatch = appliances[0] && this.applianceIndex.get(appliances[0]);
    const ingredientMatches = findMatches(this.ingredientIndex, ingredients);
    const utensilMatches = findMatches(this.utensilIndex, utensils);

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

    const matchIndex = _search(0, this.mainIndex.length - 1);
    if (Object.is(matchIndex, null)) return null;

    let firstIndex = matchIndex;
    while (firstIndex >= 0 && compareStringStart(keyword, this.mainIndex[firstIndex][0]) == 0) {
      firstIndex--;
    }
    firstIndex++;

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
    ingredientIndexProxy.sort();
    applianceIndexProxy.sort();
    utensilIndexProxy.sort();
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

const index = new RecipeIndex(recipes);

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
const matches = index.search(searchTerms);
