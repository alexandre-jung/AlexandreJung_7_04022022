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
    this.hideClearButton();
  }

  add(filter) {
    if (this.filters.has(filter.key)) return;
    const [filterElement, { filter: filterHandle, removeHandle }] = this.factory.create(filter);
    this.container.append(filterElement);
    this.filters.set(filter.key, { ...filter, handle: filterHandle });
    if (removeHandle) removeHandle.addEventListener('click', () => this.remove(filter.key));
    this.notifyAdd(filter);
    this.notifyChange();
    this.showClearButton();
  }

  remove(key) {
    const filter = this.filters.get(key);
    filter?.handle.remove();
    this.filters.delete(key);
    this.notifyRemove(filter);
    this.notifyChange();
    if (!this.filters.size) {
      this.notifyClear();
      this.hideClearButton();
    }
  }

  clear = () => {
    if (!this.filters.size) return;
    this.filters.forEach((filter) => filter.handle.remove());
    this.filters.clear();
    this.notifyClear();
    this.hideClearButton();
    this.notifyChange();
  };

  notifyAdd(filter) {
    if (this.onAdd) this.onAdd(filter, this.filters);
  }

  notifyRemove(filter) {
    if (this.onRemove) this.onRemove(filter, this.filters);
  }

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
