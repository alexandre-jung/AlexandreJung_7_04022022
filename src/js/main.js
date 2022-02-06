import SearchBar from 'js/components/SearchBar';
import { Filter, FilterList } from 'js/components/Filter';
import Dropdown from 'js/components/dropdown';
import { getAllIngredients, getAllAppliances, getAllUtensils } from 'js/api';

const search = new SearchBar();

const filterList = new FilterList();
const ingredientsDropdown = new Dropdown(document.querySelector('#ingredients-dropdown'), 'Ingrédients');
const appliancesDropdown = new Dropdown(document.querySelector('#appliances-dropdown'), 'Appareils');
const utensilsDropdown = new Dropdown(document.querySelector('#utensils-dropdown'), 'Ustensiles');

search.onChange = (value) => console.log(value);
filterList.onAdd = (filter, newValue) => console.log('Added', filter, newValue);
filterList.onRemove = (filter, newValue) => console.log('Removed', filter, newValue);
filterList.onClear = () => console.log('Cleared');

ingredientsDropdown.fill(
  Array.from(getAllIngredients())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, label]) => {
      return { key, label, type: 'ingredient' };
    })
);

appliancesDropdown.fill(
  Array.from(getAllAppliances())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, label]) => {
      return { key, label, type: 'appliance' };
    })
);

utensilsDropdown.fill(
  Array.from(getAllUtensils())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, label]) => {
      return { key, label, type: 'utensil' };
    })
);

ingredientsDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.blue });
appliancesDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.green });
utensilsDropdown.onClick = (item) => filterList.add({ ...item, color: Filter.red });
