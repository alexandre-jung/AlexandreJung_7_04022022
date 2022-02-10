import SearchBar from 'components/SearchBar';
import { Filter, FilterList } from 'components/Filter';
import Dropdown from 'components/Dropdown';
import RecipeList from 'components/Recipes';
import { getKeywords } from 'api';
import recipes from 'mock/recipes';

const mainSearch = new SearchBar();
const filterList = new FilterList();
const recipeList = new RecipeList(recipes);
const ingredientsDropdown = new Dropdown(document.querySelector('#ingredients-dropdown'), 'Ingrédients');
const appliancesDropdown = new Dropdown(document.querySelector('#appliances-dropdown'), 'Appareils');
const utensilsDropdown = new Dropdown(document.querySelector('#utensils-dropdown'), 'Ustensiles');

// Setup events on main search and filter dropdowns.
mainSearch.onChange = (value) => {
  if (value.length > 2) console.log(`Search by '${value}'`);
};
filterList.onAdd = (filter, newValue) => {
  console.log(`+ Filter added: ${filter.label}`, filter, newValue);
};
filterList.onRemove = (filter, newValue) => console.log(`- Filter removed: ${filter.label}`, filter, newValue);
filterList.onClear = () => console.log('x Filters cleared');

// Get all keywords.
const { ingredients, appliances, utensils } = getKeywords(recipes);

// Fill dropdowns with keywords.
ingredientsDropdown.fill(ingredients);
appliancesDropdown.fill(appliances);
utensilsDropdown.fill(utensils);

// Update filter list when clicking a filter.
ingredientsDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.blue });
appliancesDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.green });
utensilsDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.red });

// Update filters on recipe list change.
// Comment this block to be able to select any existing filter.
recipeList.onChange = (filteredRecipes) => {
  // Get all keywords from currently displayed recipes.
  const { ingredients, appliances, utensils } = getKeywords(filteredRecipes);
  const allKeywords = [...ingredients, ...appliances, ...utensils];

  // Update filter dropdowns.
  ingredientsDropdown.filterEntries(ingredients);
  appliancesDropdown.filterEntries(appliances);
  utensilsDropdown.filterEntries(utensils);

  // Fade unused filters.
  filterList.fadeUnusedFilters(allKeywords);
};

// Filter the recipe list.
// Comment to display all recipes.
// recipeList.filterByIds([8, 44, 15]);

// When updating recipe list, if some filters are now unused, display then faded.
// This should not happen as dropdowns are updated on recipe list change.
filterList.onChange = () => {
  const { ingredients, appliances, utensils } = getKeywords(recipeList.filteredRecipes);
  const allKeywords = [...ingredients, ...appliances, ...utensils];
  filterList.fadeUnusedFilters(allKeywords);
};
