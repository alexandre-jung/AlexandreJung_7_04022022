import Template from 'utils/template';

export class FilterFactory {
  constructor() {
    const filterTemplate = document.querySelector('#filter-template');
    this.template = new Template(filterTemplate.content);
  }

  create({ color, ...otherProps }) {
    return this.template.render({
      ...otherProps,
      class: `filter filter-${color}`,
    });
  }
}

export const Filter = Object.freeze({
  red: 'red',
  green: 'green',
  blue: 'blue',
});

export class FilterList {
  onChange = null;

  constructor() {
    this.filters = new Map();
    this.container = document.querySelector('#filters');
    this.factory = new FilterFactory();

    this.clearBtn = this.container.querySelector('#clear-filters');
    this.clearBtn.addEventListener('click', this.clear);
    this.hideClearButton();
  }

  add(filter) {
    if (this.filters.has(filter.id)) return;
    const [filterElement, { filter: filterHandle, removeHandle }] = this.factory.create(filter);
    this.container.append(filterElement);
    this.filters.set(filter.id, { ...filter, handle: filterHandle });
    if (removeHandle) removeHandle.addEventListener('click', () => this.remove(filter.id));
    this.notifyChange();
    this.showClearButton();
  }

  remove(id) {
    const filter = this.filters.get(id);
    filter?.handle.remove();
    this.filters.delete(id);
    this.notifyChange();
    if (!this.filters.size) this.hideClearButton();
  }

  clear = () => {
    if (!this.filters.size) return;
    this.filters.forEach((filter) => filter.handle.remove());
    this.filters.clear();
    this.hideClearButton();
    this.notifyChange();
  };

  notifyChange() {
    if (this.onChange) this.onChange(this.filters);
  }

  showClearButton() {
    if (this.clearBtn) this.clearBtn.style.display = 'inline';
  }

  hideClearButton() {
    if (this.clearBtn) this.clearBtn.style.display = 'none';
  }

  fadeUnusedFilters(filterList) {
    const filterIds = filterList?.map((item) => item.id) ?? null;
    this.filters.forEach(filter => {
      if (filterIds.includes(filter.id))
        filter.handle.classList.remove('faded');
      else filter.handle.classList.add('faded');
    });
  }
}
