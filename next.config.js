const path = require('path');
const { i18n } = require('./next-i18next.config');

const withImages = require('next-images');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});
const withTM = require('next-transpile-modules')([
  '@sindresorhus/slugify',
  '@sindresorhus/transliterate'
]);

module.exports = withImages(withMDX(withTM({
  pageExtensions: [ 'js', 'ts', 'jsx', 'tsx', 'md', 'mdx' ],

  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles')
    ]
  },

  i18n,

  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        permanent: true
      },

      {
        source: '/docs/admin',
        destination: '/docs/admin/getting-started',
        permanent: true
      }
    ];
  },

  async rewrites() {
    return [
      {
        source: '/avatars/:key',
        destination: '/api/avatars/:key'
      },
      {
        source: '/templates/:key',
        destination: '/api/templates/:key'
      },
      {
        source: '/documents/:id',
        destination: '/api/filled-contracts/:id/download'
      }
    ]
  }
})));
