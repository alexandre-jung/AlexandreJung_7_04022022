import SearchBar from 'js/components/SearchBar';
import { FilterList } from 'js/components/Filter';

import recipes from 'mock/recipes';
import filters from 'mock/filters';

console.log(recipes);

const search = new SearchBar();
search.onChange = (value) => console.log(value);

const filterList = new FilterList();

filters.forEach(filter => {
  filterList.add(filter);
});

filterList.onAdd = (key, newValue) => console.log(`Added ${key}`, newValue);
filterList.onRemove = (key, newValue) => console.log(`Removed ${key}`, newValue);
filterList.onClear = () => console.log('Cleared');
