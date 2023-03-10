import NextAuth from 'next-auth';
import Providers, { DefaultProviders, Provider } from 'next-auth/providers';
import Adapters from 'next-auth/adapters';

import config from '@/config';

import { baseConnectionOptions } from '@/services/db';

import { User, UserSchema } from '@/db/models/auth/User';
import { Account, AccountSchema } from '@/db/models/auth/Account';
import { VerificationRequest, VerificationRequestSchema } from '@/db/models/auth/VerificationRequest';
import { Session, SessionSchema } from '@/db/models/auth/Session';
import { authorizeUser, UserAuthorizationFields } from '@/controllers/users/authorizeUser';

const providers: Array<Provider | ReturnType<DefaultProviders[keyof DefaultProviders]>> = [
  Providers.Credentials({
    name: 'credentials',

    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'john@smith.ex' },
      password: { label: 'Password', type: 'password' }
    },

    async authorize(credentials): Promise<User> {
      try {
        const user = await authorizeUser({
          email: credentials.email,
          password: credentials.password
        });

        return user;
      } catch (err) {
        return null;
      }
    }
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

  session: {
    jwt: true
  },

  adapter: Adapters.TypeORM.Adapter({
    ...baseConnectionOptions
  }, {
    models: {
      User: {
        model: User,
        schema: (UserSchema as any)
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
