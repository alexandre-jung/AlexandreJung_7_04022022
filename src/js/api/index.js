import recipes from '/mock/recipes';
import { makeKey, capitalize } from 'js/utils/string';

export function getAllIngredients() {
  const result = new Map();
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach(({ ingredient }) => {
      const key = `ingredient.${makeKey(ingredient)}`;
      if (result.has(key)) return;
      result.set(key, capitalize(ingredient));
    });
  });
  return result;
}

export function getAllAppliances() {
  const result = new Map();
  recipes.forEach(({ appliance }) => {
    const key = `appliance.${makeKey(appliance)}`;
    if (result.has(key)) return;
    result.set(key, capitalize(appliance));
  });
  return result;
}

export function getAllUtensils() {
  const result = new Map();
  recipes.forEach((recipe) => {
    recipe.utensils.forEach((utensil) => {
      const key = `utensil.${makeKey(utensil)}`;
      if (result.has(key)) return;
      result.set(key, capitalize(utensil));
    });
  });
  return result;
}
