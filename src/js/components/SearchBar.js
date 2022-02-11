export default class SearchBar {
  constructor(minLength) {
    this.minLength = minLength;
    this.previousValue = '';
    this.searchBar = document.querySelector('#main-search');
    if (!this.searchBar) throw Error('SearchBar not found');
    this.searchInput = this.searchBar.elements['search'];
    if (!this.searchInput) throw Error('SearchInput not found');
  }

  set onChange(fn) {
    if (this._onChange) this.searchInput.removeEventListener('input', this._onChange);
    this._onChange = () => {
      const value = this.searchInput.value;
      const eventValue = value.length > 2 ? value : '';
      if (eventValue != this.previousValue) {
        fn(eventValue);
        this.previousValue = eventValue;
      };
    };
    this.searchInput.addEventListener('input', this._onChange);
  }
}
