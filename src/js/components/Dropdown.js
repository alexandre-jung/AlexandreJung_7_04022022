import Template from 'js/utils/template';
import { makeKey } from 'js/utils/string';

export default class Dropdown {
  onClick = null;

  constructor(dropdown, label) {
    if (!dropdown) throw Error('Dropdown element is undefined');
    this.dropdown = dropdown;
    this.label = label;
    this.searchInput = dropdown.querySelector('.dropdown-search-input');
    this.itemList = dropdown.querySelector('.list');
    this.template = new Template(document.querySelector('#dropdown-item-template').content);
    this.items = [];
    this.itemsMap = new Map();
    this.setupEvents();
  }

  setupEvents() {
    this.searchInput.addEventListener('focus', () => {
      this.searchInput.closest('.dropdown').classList.add('expanded');
      this.searchInput.value = '';
    });

    this.searchInput.addEventListener('blur', () => {
      this.searchInput.closest('.dropdown').classList.remove('expanded');
      this.searchInput.value = this.label;
      this.showAll();
    });

    // Catch mousedown events because it occurs before blur, unlike click.
    this.itemList.addEventListener('mousedown', (ev) => {
      if (ev.button == 0 && ev.target.classList.contains('item') && this.onClick) {
        this.onClick(this.itemsMap.get(ev.target.dataset.id));
      }
    });

    this.searchInput.addEventListener('input', this.filterByInputValue);
  }

  add(item) {
    const [itemElement, { handle }] = this.template.render(item);
    this.itemList.append(itemElement);
    this.items.push({ ...item, handle });
    this.itemsMap.set(item.id, item);
  }

  fill(items) {
    items.forEach((item) => {
      this.add(item);
    });
  }

  showAll() {
    this.items.forEach((item) => {
      item.handle.style.display = 'inline';
    });
  }

  filterByInputValue = () => {
    const value = this.searchInput.value;
    const words = value.split(' ');

    this.items.forEach((item) => {
      // Find out wether every typed word matches the current item.
      // Ignore case and accents.
      const it = words.values();
      let nextWord = it.next();
      let match = true;
      while (!nextWord.done && match) {
        const word = makeKey(nextWord.value);
        if (!item.key.includes(word)) match = false;
        nextWord = it.next();
      }

      // Display items that matches.
      if (match) item.handle.style.display = 'inline';
      else item.handle.style.display = 'none';
    });
  };
}
