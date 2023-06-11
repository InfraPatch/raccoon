import { randomBytes } from 'crypto';

import Adapters from 'next-auth/adapters';

export class Session {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  expires: Date;
  sessionToken?: string;
  accessToken?: string;

  constructor(
    userId: number,
    expires: Date,
    sessionToken?: string,
    accessToken?: string,
  ) {
    this.userId = userId;
    this.expires = expires;
    this.sessionToken = sessionToken || randomBytes(32).toString('hex');
    this.accessToken = accessToken || randomBytes(32).toString('hex');
  }
}

export const SessionSchema = {
  ...Adapters.TypeORM.Models.Session.schema,
  target: Session,
};
