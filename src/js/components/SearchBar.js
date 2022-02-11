export default class SearchBar {
  constructor(minLength) {
    this.searchBar = document.querySelector('#main-search');
    this.searchInput = this.searchBar.elements['search'];
    if (!this.searchBar) throw Error('SearchBar not found');
    if (!this.searchInput) throw Error('SearchInput not found');
    this.minLength = minLength;
    this.previousValue = this.value;
  }

  get value() {
    return this.searchInput.value.trim();
  }

  set onChange(fn) {
    if (this._onChange) this.searchInput.removeEventListener('input', this._onChange);
    this._onChange = () => {
      const eventValue = this.value.length > 2 ? this.value : '';
      if (eventValue != this.previousValue) {
        fn(eventValue);
        this.previousValue = eventValue;
      }
    };
    this.searchInput.addEventListener('input', this._onChange);
  }
}
