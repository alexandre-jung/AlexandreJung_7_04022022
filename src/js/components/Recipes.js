import Template from 'utils/template';

export default class RecipeList {
  onChange = null;

  constructor(recipes) {
    const recipeTemplate = new Template(document.querySelector('#recipe-template').content);
    const ingredientTemplate = new Template(document.querySelector('#recipe-ingredient-template').content);
    this.recipeContainer = document.querySelector('#recipes');
    this.allRecipesMap = new Map();
    this._filteredRecipes = new Set();

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
      this._filteredRecipes.add(recipe.id);
      this.allRecipesMap.set(recipe.id, recipe);
    });
  }

  filterByIds = (ids) => {
    let updated = false;
    for (const recipe of this.recipeContainer.children) {
      if (ids.includes(Number(recipe.dataset.id))) {
        updated = updated || recipe.classList.contains('hidden');
        recipe.classList.remove('hidden');
        this._filteredRecipes.add(Number(recipe.dataset.id));
      } else {
        updated = updated || !recipe.classList.contains('hidden');
        recipe.classList.add('hidden');
        this._filteredRecipes.delete(Number(recipe.dataset.id));
      }
    }
    if (this.onChange && updated) this.onChange(this.filteredRecipes);
  };

  clearFilter() {
    let updated = false;
    for (const recipe of this.recipeContainer.children) {
      updated = updated || recipe.classList.contains('hidden');
      recipe.classList.remove('hidden');
      this._filteredRecipes.add(Number(recipe.dataset.id));
    }
    if (this.onChange && updated) this.onChange(this.filteredRecipes);
  }

  /**
   * Get displayed recipes.
   */
  get filteredRecipes() {
    return Array.from(this.allRecipesMap)
      .filter(([id]) => this._filteredRecipes.has(id))
      .map(([, recipe]) => recipe);
  }
}
