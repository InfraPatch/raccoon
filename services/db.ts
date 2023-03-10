import { ConnectionOptions, EntitySchema, createConnection, getConnection, getManager, getRepository } from 'typeorm';
import config from '../config';
import { CamelCaseNamingStrategy } from '../lib/namingStrategies';

import { AccountSchema } from '../db/models/auth/Account';
import { SessionSchema } from '../db/models/auth/Session';
import { UserSchema } from '../db/models/auth/User';
import { VerificationRequestSchema } from '../db/models/auth/VerificationRequest';

import transform from 'next-auth/dist/adapters/typeorm/lib/transform';

const baseConnectionOptions: ConnectionOptions = {
  type: config.database.dialect as any,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,

  namingStrategy: new CamelCaseNamingStrategy()
};

const authModels = {
  Account: { schema: AccountSchema },
  Session: { schema: SessionSchema },
  User: { schema: UserSchema },
  VerificationRequest: { schema: VerificationRequestSchema }
};

transform(baseConnectionOptions, authModels, {
  namingStrategy: baseConnectionOptions.namingStrategy
});

const connectionOptions: ConnectionOptions = {
  ...baseConnectionOptions,
  entities: [
    ...(Object.keys(authModels).map(model => new EntitySchema(authModels[model].schema)))
  ]
};

let connectionReadyPromise: Promise<void> | null = null;

const db = {
  prepare() {
    if (!connectionReadyPromise) {
      connectionReadyPromise = (async () => {
        try {
          const connection = getConnection();
          await connection.close();
        } catch (err) {}

        await createConnection(connectionOptions);
      })();
    }

    return connectionReadyPromise;
  },

  getConnection,
  getManager,
  getRepository
};

export default db;

export {
  baseConnectionOptions,
  connectionOptions
};
