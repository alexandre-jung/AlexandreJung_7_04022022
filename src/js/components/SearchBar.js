export default class SearchBar {
  constructor() {
    this.searchBar = document.querySelector('#main-search');
    if (!this.searchBar) throw Error('SearchBar not found');
    this.searchInput = this.searchBar.elements['search'];
    if (!this.searchInput) throw Error('SearchInput not found');
  }

  set onChange(fn) {
    if (this._onChange) this.searchInput.removeEventListener('input', this._onChange);
    this._onChange = () => fn(this.searchInput.value);
    this.searchInput.addEventListener('input', this._onChange);
  }
}
