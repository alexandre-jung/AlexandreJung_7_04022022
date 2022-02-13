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

/**
 * A Vite plugin to set HTTP headers so the document is isolated.
 * This is required by Firefox to enable high-precision time measurement.
 * 
 * For more explanations, see:
 * https://github.com/vitejs/vite/issues/3909#issuecomment-934044912
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
 */
const isolateDocument = {
  name: 'configure-response-headers',
  configureServer: (server) => {
    server.middlewares.use((_req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
      next();
    });
  },
};

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
  plugins: [isolateDocument],
};
