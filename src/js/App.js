import SearchBar from 'components/SearchBar';
import { Filter, FilterList } from 'components/Filter';
import Dropdown from 'components/Dropdown';
import RecipeList from 'components/Recipes';
import { getKeywords } from 'api';
import { arraysEqual } from 'utils/array';
import recipes from 'mock/recipes';
import Search from 'lib/search';
import { KEYWORD_TYPES } from 'api';

export default class App {
  constructor() {
    this.setupUI();
    this.setupEvents();

    this.currentSearchWords = App.searchStringToArray(this.mainSearch.value);
    this.currentKeywords = {
      [KEYWORD_TYPES.ingredient]: [],
      [KEYWORD_TYPES.appliance]: [],
      [KEYWORD_TYPES.utensil]: [],
    };

    // Initialize search algorithm.
    Search.init(recipes);

    // Update search.
    this.previousSearchWords = [];
    this.updateRecipesByMainSearch(this.mainSearch.value);
    this.previousSearchWords = this.currentSearchWords;
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
    this.currentSearchWords = App.searchStringToArray(value);
    if (!arraysEqual(this.currentSearchWords, this.previousSearchWords)) {
      console.log(`Search by '${value}'`, this.currentSearchWords);
      this.previousSearchWords = this.currentSearchWords;
      this.applySearch();
    }
  };

  /**
   * Handle filters changes.
   */
  updateRecipesByKeywords = (keywordsMap) => {
    let keywords = {
      [KEYWORD_TYPES.ingredient]: [],
      [KEYWORD_TYPES.appliance]: [],
      [KEYWORD_TYPES.utensil]: [],
    };
    Array.from(keywordsMap.values()).forEach(({ key, type }) => keywords[type].push(key));

    console.log(`Filter by '${JSON.stringify(keywords, null, 2)}'`);
    this.currentKeywords = keywords;
    this.applySearch();
  };

  /**
   * Update filters and dropdowns to match displayed recipes data.
   */
  updateFilters = (filteredRecipes) => {
    // Get all keywords from currently displayed recipes.
    const { ingredients, appliances, utensils } = getKeywords(filteredRecipes);
    const filterRecipesKeywords = [...ingredients, ...appliances, ...utensils];

    // Update filter dropdowns.
    this.ingredientsDropdown.filterEntries(ingredients);
    this.appliancesDropdown.filterEntries(appliances);
    this.utensilsDropdown.filterEntries(utensils);

    // Fade unused filters.
    this.filterList.fadeUnusedFilters(filterRecipesKeywords);
  };

  /**
   * Run the search algorithm, then display valid recipes.
   */
  applySearch() {
    /**
     * Run search algorithm to get IDs of recipes to display using:
     * - this.currentSearchWords
     * - this.currentKeywords
     *
     * Then either filter recipes or reset filters with:
     * - this.recipeList.filterByIds([...ids]);
     * - this.recipeList.clearFilter()
     *
     * Return nothing.
     */
    const startTime = performance.now();
    const recipeIds = Search.search(
      recipes,
      this.recipeList.filteredRecipes,
      this.currentSearchWords,
      this.currentKeywords
    );
    const endTime = performance.now();

    // Format and log execution time.
    const ellapsedTime = endTime - startTime;
    App.logTime('Filtering time', ellapsedTime);

    if (Array.isArray(recipeIds)) this.recipeList.filterByIds(recipeIds);
    else this.recipeList.clearFilter();
  }

  static searchStringToArray(str) {
    return str.split(' ').filter((v) => v);
  }

  static logTime(description, time) {
    const formatter = new Intl.NumberFormat('en', { style: 'decimal' });
    const formattedTime = formatter.format(time);
    console.log(`${description}: ${formattedTime} ms`);
  }
}
