import Template from 'js/utils/template';

export default class RecipeList {
  constructor(recipes) {
    const recipeTemplate = new Template(document.querySelector('#recipe-template').content);
    const ingredientTemplate = new Template(document.querySelector('#recipe-ingredient-template').content);
    this.recipeContainer = document.querySelector('#recipes');

    recipes.sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

    recipes.forEach((recipe) => {
      const [recipeElement, { ingredientsHandle }] = recipeTemplate.render(recipe);
      this.recipeContainer.append(recipeElement);
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

  filterByIds = (ids) => {
    for (const recipe of this.recipeContainer.children) {
      if (ids.includes(Number(recipe.dataset.id))) {
        recipe.classList.remove('hidden');
      } else {
        recipe.classList.add('hidden');
      }
    }
  }
}
