import { makeKey, capitalize } from 'js/utils/string';

export const KEYWORD_TYPES = Object.freeze({
  ingredient: 'ingredient',
  appliance: 'appliance',
  utensil: 'utensil',
});

export function getAllIngredients(recipes) {
  const addedKeywordIds = new Set();
  const result = [];
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach(({ ingredient }) => {
      const key = makeKey(ingredient);
      const id = `ingredient.${key}`;
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
    const key = makeKey(appliance);
    const id = `appliance.${key}`;
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
      const key = makeKey(utensil);
      const id = `utensil.${key}`;
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
