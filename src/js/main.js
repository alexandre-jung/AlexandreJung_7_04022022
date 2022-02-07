import SearchBar from 'js/components/SearchBar';
import { Filter, FilterList } from 'js/components/Filter';
import Dropdown from 'js/components/dropdown';
import RecipeList from 'js/components/Recipes';
import { getKeywords } from 'js/api';
import recipes from 'mock/recipes';

const mainSearch = new SearchBar();

const filterList = new FilterList();
const ingredientsDropdown = new Dropdown(document.querySelector('#ingredients-dropdown'), 'Ingrédients');
const appliancesDropdown = new Dropdown(document.querySelector('#appliances-dropdown'), 'Appareils');
const utensilsDropdown = new Dropdown(document.querySelector('#utensils-dropdown'), 'Ustensiles');

mainSearch.onChange = (value) => {
  if (value.length < 3) return;
  console.log(`Search by '${value}'`);
};
filterList.onAdd = (filter, newValue) => console.log(`+ Filter added: ${filter.label}`, filter, newValue);
filterList.onRemove = (filter, newValue) => console.log(`- Filter removed: ${filter.label}`, filter, newValue);
filterList.onClear = () => console.log('x Filters cleared');

const {
  ingredients,
  appliances,
  utensils,
} = getKeywords(recipes);

ingredientsDropdown.fill(ingredients);
appliancesDropdown.fill(appliances);
utensilsDropdown.fill(utensils);

ingredientsDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.blue });
appliancesDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.green });
utensilsDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.red });

const recipeList = new RecipeList();
