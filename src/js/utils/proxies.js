function mapAppend(target, transformKey) {
  return function (key, value) {
    const _key = transformKey ? transformKey(key) : key;
    if (target.has(_key)) target.get(_key).push(value);
    else target.set(_key, [value]);
    return target;
  };
}

function mapSortValues(target) {
  return function (predicate) {
    target.forEach((value) => value.sort(predicate));
    return target;
  };
}

export function mapListProxify(map, transformKey) {
  return new Proxy(map, {
    get: function (target, property) {
      switch (property) {
        case 'append':
          return mapAppend(target, transformKey);
        case 'sort':
          return mapSortValues(target);
      }
      const prop = Reflect.get(target, property);
      return typeof prop == 'function' ? prop.bind(target) : prop;
    },
  });
}
