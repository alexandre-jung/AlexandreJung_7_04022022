import path from 'path';

const root = 'src';
const outDir = path.resolve(`${root}/..`, 'dist');
const js = path.resolve(root, 'js');
const mock = path.resolve(root, 'mock');
const styles = path.resolve(root, 'scss');

export default {
  root,
  build: { outDir },
  resolve: {
    alias: {
      '@': root,
      js,
      mock,
      styles,
    },
  },
};
