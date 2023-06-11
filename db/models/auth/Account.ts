import { createHash } from 'crypto';

import Adapters from 'next-auth/adapters';

export class Account {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  compoundId: string;
  userId: number;
  providerId: string;
  providerType: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  accessTokenExpires: Date | null;

  constructor(
    userId: number,
    providerId: string,
    providerType: string,
    providerAccountId: string,
    refreshToken: string | null,
    accessToken: string | null,
    accessTokenExpires: Date | null,
  ) {
    this.compoundId = createHash('sha256')
      .update(`${providerId}:${providerAccountId}`)
      .digest('hex');
    this.userId = userId;
    this.providerType = providerType;
    this.providerId = providerId;
    this.providerAccountId = providerAccountId;
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
    this.accessTokenExpires = accessTokenExpires;
  }
}

export const AccountSchema = {
  ...Adapters.TypeORM.Models.Account.schema,
  target: Account,
};
