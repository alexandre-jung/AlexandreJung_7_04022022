import Template from 'js/utils/template';
import recipes from 'mock/recipes';

export default class RecipeList {
  constructor() {
    const recipeTemplate = new Template(document.querySelector('#recipe-template').content);
    const ingredientTemplate = new Template(document.querySelector('#recipe-ingredient-template').content);
    const recipeContainer = document.querySelector('#recipes');

    recipes.sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

    recipes.forEach((recipe) => {
      const [recipeElement, { ingredientsHandle }] = recipeTemplate.render(recipe);
      recipeContainer.append(recipeElement);
      recipe.ingredients.forEach(({ ingredient, quantity, unit }) => {
        const [ingredientElement, { handle }] = ingredientTemplate.render({
          ingredient,
          quantity: `${quantity ? ` ${quantity}` : ''}${unit ? ` ${unit}` : ''}`,
        });
        if (quantity) handle.classList.add('has-quantity');
        ingredientsHandle.append(ingredientElement);
      });
    });
  }
}
