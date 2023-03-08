const path = require('path');
const { i18n } = require('./next-i18next.config');

const withImages = require('next-images');

module.exports = withImages({
  sassOptions: {
    includePaths: [
      path.join(__dirname, 'styles')
    ]
  },

  i18n
});
