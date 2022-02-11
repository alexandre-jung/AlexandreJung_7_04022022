import { slugify, capitalize } from 'utils/string';

export const KEYWORD_TYPES = Object.freeze({
  ingredient: 'ingredients',
  appliance: 'appliances',
  utensil: 'utensils',
});

export function getAllIngredients(recipes) {
  const addedKeywordIds = new Set();
  const result = [];
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach(({ ingredient }) => {
      const key = slugify(ingredient);
      const id = `${KEYWORD_TYPES.ingredient}.${key}`;
      if (addedKeywordIds.has(id)) return;
      result.push({
        id,
        key,
        label: capitalize(ingredient),
        type: KEYWORD_TYPES.ingredient,
      });
      addedKeywordIds.add(id);
    });
  });
  return result;
}

export function getAllAppliances(recipes) {
  const addedKeywordIds = new Set();
  const result = [];
  recipes.forEach(({ appliance }) => {
    const key = slugify(appliance);
    const id = `${KEYWORD_TYPES.appliance}.${key}`;
    if (addedKeywordIds.has(id)) return;
    result.push({
      id,
      key,
      label: capitalize(appliance),
      type: KEYWORD_TYPES.appliance,
    });
    addedKeywordIds.add(id);
  });
  return result;
}

export function getAllUtensils(recipes) {
  const addedKeywordIds = new Set();
  const result = [];
  recipes.forEach((recipe) => {
    recipe.utensils.forEach((utensil) => {
      const key = slugify(utensil);
      const id = `${KEYWORD_TYPES.utensil}.${key}`;
      if (addedKeywordIds.has(id)) return;
      result.push({
        id,
        key,
        label: capitalize(utensil),
        type: KEYWORD_TYPES.utensil,
      });
      addedKeywordIds.add(id);
    });
  });
  return result;
}

export function getKeywords(recipes) {
  return {
    ingredients: getAllIngredients(recipes).sort(({ key: keyA }, { key: keyB }) => keyA.localeCompare(keyB)),
    appliances: getAllAppliances(recipes).sort(({ key: keyA }, { key: keyB }) => keyA.localeCompare(keyB)),
    utensils: getAllUtensils(recipes).sort(({ key: keyA }, { key: keyB }) => keyA.localeCompare(keyB)),
  };
}
