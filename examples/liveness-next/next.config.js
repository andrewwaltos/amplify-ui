const path = require('path');
const { patchWebpackConfig } = require('next-global-css');

module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'page.ts'],
  basePath: '/liveness-next-example',
  webpack: (config, options) => {
    // allows importing of css files inside modules
    patchWebpackConfig(config, options);

    // resolve react and react-dom from project node_modules
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    };

    return config;
  },
};
