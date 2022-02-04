import SearchBar from 'js/components/SearchBar';
import recipes from 'mock/recipes';

console.log(recipes);

const search = new SearchBar();
search.onChange = (value) => console.log(value);
