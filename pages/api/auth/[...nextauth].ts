import NextAuth from 'next-auth';
import Providers, { DefaultProviders, Provider } from 'next-auth/providers';
import Adapters from 'next-auth/adapters';

import config from '@/config';

import { baseConnectionOptions } from '@/services/db';

import { User, UserSchema } from '@/db/models/auth/User';
import { Account, AccountSchema } from '@/db/models/auth/Account';
import { VerificationRequest, VerificationRequestSchema } from '@/db/models/auth/VerificationRequest';
import { Session, SessionSchema } from '@/db/models/auth/Session';

const providers: Array<Provider | ReturnType<DefaultProviders[keyof DefaultProviders]>> = [
  Providers.Email({
    server: {
      host: config.mailgun.host,
      port: config.mailgun.port,
      auth: {
        user: config.mailgun.username,
        pass: config.mailgun.password
      }
    },

    from: config.mailgun.emailFrom
  })
];

if (config.auth.facebook) {
  providers.push(
    Providers.Facebook({
      clientId: config.auth.facebook.clientId,
      clientSecret: config.auth.facebook.clientSecret
    })
  );
}

if (config.auth.google) {
  providers.push(
    Providers.Google({
      clientId: config.auth.google.clientId,
      clientSecret: config.auth.google.clientSecret
    })
  );
}

if (config.auth.twitter) {
  providers.push(
    Providers.Twitter({
      clientId: config.auth.twitter.clientId,
      clientSecret: config.auth.twitter.clientSecret
    })
  );
}

export default NextAuth({
  providers,

  adapter: Adapters.TypeORM.Adapter({
    ...baseConnectionOptions
  }, {
    models: {
      User: {
        model: User,
        schema: UserSchema
      },

      Account: {
        model: Account,
        schema: AccountSchema
      },

      VerificationRequest: {
        model: VerificationRequest,
        schema: VerificationRequestSchema
      },

      Session: {
        model: Session,
        schema: SessionSchema
      }
    }
  })
});
