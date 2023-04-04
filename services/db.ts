import { ConnectionOptions, EntitySchema, createConnection, getConnection, getManager, getRepository } from 'typeorm';
import config from '../config';
import { CamelCaseNamingStrategy } from '../lib/namingStrategies';

import { AccountSchema } from '../db/models/auth/Account';
import { SessionSchema } from '../db/models/auth/Session';
import { UserSchema } from '../db/models/auth/User';
import { VerificationRequestSchema } from '../db/models/auth/VerificationRequest';

import { Contract } from '../db/models/contracts/Contract';
import { ContractOption } from '../db/models/contracts/ContractOption';
import { FilledContract } from '../db/models/contracts/FilledContract';
import { FilledContractOption } from '../db/models/contracts/FilledContractOption';
import { FilledContractAttachment } from '../db/models/contracts/FilledContractAttachment';

import { Item } from '../db/models/items/Item';
import { ItemOption } from '../db/models/items/ItemOption';
import { FilledItem } from '../db/models/items/FilledItem';
import { FilledItemOption } from '../db/models/items/FilledItemOption';
import { FilledItemAttachment } from '../db/models/items/FilledItemAttachment';

import { WitnessSignature } from '../db/models/contracts/WitnessSignature';

import transform from '../node_modules/next-auth/dist/adapters/typeorm/lib/transform';

const baseConnectionOptions: ConnectionOptions = {
  type: config.database.dialect as any,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,

  extra: {
    charset: 'utf8mb4_unicode_ci'
  },

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

const Account = new EntitySchema(authModels.Account.schema);
const Session = new EntitySchema(authModels.Session.schema);
const User = new EntitySchema(authModels.User.schema as any); // idk
const VerificationRequest = new EntitySchema(authModels.VerificationRequest.schema);

const connectionOptions: ConnectionOptions = {
  ...baseConnectionOptions,
  entities: [
    Account,
    Session,
    User,
    VerificationRequest,

    Contract,
    ContractOption,
    FilledContract,
    FilledContractOption,
    FilledContractAttachment,

    Item,
    ItemOption,
    FilledItem,
    FilledItemOption,
    FilledItemAttachment,

    WitnessSignature
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
  connectionOptions,

  Account,
  Session,
  User,
  VerificationRequest
};
