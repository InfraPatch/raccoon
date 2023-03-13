const path = require('path');
const { i18n } = require('./next-i18next.config');

const withImages = require('next-images');
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
});

module.exports = withImages(withMDX({
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
  }
}));
