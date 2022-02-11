import path from 'path';

const root = 'src';

// Root subdirectories.
const js = path.resolve(root, 'js');
const mock = path.resolve(root, 'mock');
const styles = path.resolve(root, 'scss');

// Javascript subdirectories.
const api = path.resolve(js, 'api');
const components = path.resolve(js, 'components');
const utils = path.resolve(js, 'utils');
const lib = path.resolve(js, 'lib');

// Build directory.
const outDir = path.resolve(`${root}/..`, 'dist');

export default {
  root,
  build: { outDir },
  resolve: {
    alias: {
      '@': root,
      mock,
      styles,
      js,
      api,
      components,
      utils,
      lib,
    },
  },
};
