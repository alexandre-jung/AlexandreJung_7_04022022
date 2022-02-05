import Template from 'js/utils/template';

export class FilterFactory {
  constructor() {
    const filterTemplate = document.querySelector('#filter-template');
    this.template = new Template(filterTemplate.content);
  }

  create({ key, label, color }) {
    return this.template.render({
      key,
      label,
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
  onAdd = null;
  onRemove = null;
  onChange = null;
  onClear = null;

  constructor() {
    this.filters = new Map();
    this.container = document.querySelector('#filters');
    this.factory = new FilterFactory();

    this.clearBtn = this.container.querySelector('#clear-filters');
    this.clearBtn.addEventListener('click', this.clear);
  }

  add(filter) {
    if (this.filters.has(filter.key)) return;
    const [filterElement, { filter: filterHandle, remove }] = this.factory.create(filter);
    this.container.append(filterElement);
    this.filters.set(filter.key, { ...filter, handle: filterHandle });
    if (remove) remove.addEventListener('click', () => this.remove(filter.key));
    if (this.onAdd) this.onAdd(filter.key, this.filters);
    this.notifyChange();
  }

  remove(key) {
    const filter = this.filters.get(key);
    filter?.handle.remove();
    this.filters.delete(key);
    if (!this.filters.size) this.hideClearButton();
    if (this.onRemove) this.onRemove(filter.key, this.filters);
    if (!this.filters.size) this.onClear();
    this.notifyChange();
  }

  clear = () => {
    if (!this.filters.size) return;
    this.filters.forEach((filter) => filter.handle.remove());
    this.filters.clear();
    this.notifyClear();
    this.hideClearButton();
    this.notifyChange();
  };

  notifyChange() {
    if (this.onChange) this.onChange(this.filters);
  }

  notifyClear() {
    if (this.onClear) this.onClear();
  }

  showClearButton() {
    if (this.clearBtn) this.clearBtn.style.display = 'inline';
  }

  hideClearButton() {
    if (this.clearBtn) this.clearBtn.style.display = 'none';
  }
}
