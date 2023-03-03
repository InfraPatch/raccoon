const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'hu',
    locales: ['en', 'hu'],
  },

  localePath: path.join(__dirname, 'public/i18n')
};
