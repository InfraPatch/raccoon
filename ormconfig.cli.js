require('ts-node').register({
  transpileOnly: true,
});

const { connectionOptions } = require('./services/db');

const ormconfig = {
  ...connectionOptions,

  migrations: ['db/migrations/**/*.ts'],

  cli: {
    migrationsDir: 'db/migrations',
  },
};

module.exports = ormconfig;
