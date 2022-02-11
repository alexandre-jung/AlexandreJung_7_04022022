import SearchBar from 'components/SearchBar';
import { Filter, FilterList } from 'components/Filter';
import Dropdown from 'components/Dropdown';
import RecipeList from 'components/Recipes';
import { getKeywords } from 'api';
import recipes from 'mock/recipes';

export default class App {
  constructor() {
    this.setupUI();
    this.setupEvents();
  }

  /**
   * 1. Get DOM elements.
   * 2. Create UI objects.
   * 3. Fill filter dropdowns.
   */
  setupUI() {
    // 1. Get DOM elements.
    const DomIngredientsDropdown = document.querySelector('#ingredients-dropdown');
    const DomAppliancesDropdown = document.querySelector('#appliances-dropdown');
    const DomUtensilsDropdown = document.querySelector('#utensils-dropdown');

    // 2. Create UI objects.
    this.mainSearch = new SearchBar(3);
    this.filterList = new FilterList();
    this.recipeList = new RecipeList(recipes);
    this.ingredientsDropdown = new Dropdown(DomIngredientsDropdown, 'Ingrédients');
    this.appliancesDropdown = new Dropdown(DomAppliancesDropdown, 'Appareils');
    this.utensilsDropdown = new Dropdown(DomUtensilsDropdown, 'Ustensiles');

    // 3. Fill filter dropdowns.
    const { ingredients, appliances, utensils } = getKeywords(recipes);
    this.ingredientsDropdown.fill(ingredients);
    this.appliancesDropdown.fill(appliances);
    this.utensilsDropdown.fill(utensils);
  }

  /**
   * 1. Update recipes on search change.
   * 2. Update recipes on filters change.
   * 3. Add filter on dropdown click.
   * 4. Update displayed filters on recipe list update.
   */
  setupEvents() {
    // 1. Update recipes on search change.
    this.mainSearch.onChange = this.updateRecipesByMainSearch;

    // 2. Update recipes on filters change.
    this.filterList.onChange = this.updateRecipesByKeywords;

    // 3. Add filter on dropdown click.
    this.ingredientsDropdown.onClick = (item) => this.filterList.add({ ...item, color: Filter.blue });
    this.appliancesDropdown.onClick = (item) => this.filterList.add({ ...item, color: Filter.green });
    this.utensilsDropdown.onClick = (item) => this.filterList.add({ ...item, color: Filter.red });

    // 4. Update displayed filters on recipe list update.
    this.recipeList.onChange = this.updateFilters;
  }

  /**
   * Handle main search bar changes.
   */
  updateRecipesByMainSearch = (value) => {
    console.log(`Search by '${value}'`);
  };

  /**
   * Handle filters changes.
   */
  updateRecipesByKeywords = (keywordsMap) => {
    const keywords = Array.from(keywordsMap.values()).map((filter) => filter.key);
    console.log(`Filter by '${keywords}'`);
  };

  /**
   * Update filters and dropdowns to match displayed recipes data.
   */
  updateFilters = (filteredRecipes) => {
    // Get all keywords from currently displayed recipes.
    const { ingredients, appliances, utensils } = getKeywords(filteredRecipes);
    const allKeywords = [...ingredients, ...appliances, ...utensils];

    // Update filter dropdowns.
    this.ingredientsDropdown.filterEntries(ingredients);
    this.appliancesDropdown.filterEntries(appliances);
    this.utensilsDropdown.filterEntries(utensils);

    // Fade unused filters.
    this.filterList.fadeUnusedFilters(allKeywords);
  };
}
