import { IConfig, StorageStrategyIdentifier } from '@/config/IConfig';

const getStorageStrategyIdentifier = (env: string): StorageStrategyIdentifier => {
  if ([ 'file', 's3', 'firebase' ].includes(env)) {
    return env as StorageStrategyIdentifier;
  }

  return 'file';
};

const config: IConfig = {
  app: {
    protocol: process.env.PROTOCOL,
    domain: process.env.DOMAIN,
    port: process.env.PORT && parseInt(process.env.PORT, 10),
    nextauthUrl: process.env.NEXTAUTH_URL,
    maxPayloadSize: process.env.MAX_PAYLOAD_SIZE || '10mb',
    serverSideProxy: process.env.SERVER_SIDE_PROXY
  },

  database: {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT && parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME
  },

  storage: {
    strategy: getStorageStrategyIdentifier(process.env.STORAGE_STRATEGY)
  },

  email: {
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT && parseInt(process.env.SMTP_PORT, 10),
    emailFrom: process.env.EMAIL_FROM,
    contactEmail: process.env.CONTACT_EMAIL
  },

  avdh: {
    key: process.env.AVDH_KEY_BASE64,
    password: process.env.AVDH_KEY_PASSWORD
  },

  auth: {}
};

const {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET
} = process.env;

if (FACEBOOK_CLIENT_ID?.length && FACEBOOK_CLIENT_SECRET?.length) {
  config.auth.facebook = {
    clientId: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET
  };
}

if (GOOGLE_CLIENT_ID?.length && GOOGLE_CLIENT_SECRET?.length) {
  config.auth.google = {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET
  };
}

if (TWITTER_CLIENT_ID?.length && TWITTER_CLIENT_SECRET?.length) {
  config.auth.twitter = {
    clientId: TWITTER_CLIENT_ID,
    clientSecret: TWITTER_CLIENT_SECRET
  };
}

switch (config.storage.strategy) {
  case 'file':
    config.storage.file = {
      location: process.env.FILE_STORAGE_LOCATION
    };
    break;

  case 'firebase':
    config.storage.firebase = {
      serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
      bucket: process.env.FIREBASE_BUCKET
    };
    break;

  case 's3':
    config.storage.s3 = {
      endpoint: process.env.S3_ENDPOINT,
      key: process.env.S3_KEY,
      secret: process.env.S3_SECRET,
      bucket: process.env.S3_BUCKET
    };
    break;
}

export default config;
