export function mapListProxify(map, transformKey) {
  return new Proxy(map, {
    get: function (target, property) {
      if (property == 'append') {
        return function (key, value) {
          const _key = transformKey ? transformKey(key) : key;
          if (target.has(_key)) target.get(_key).push(value);
          else target.set(_key, [value]);
          return target;
        };
      }
      const prop = Reflect.get(target, property);
      return typeof prop == 'function' ? prop.bind(target) : prop;
    },
  });
}
