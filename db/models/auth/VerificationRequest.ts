import Adapters, { TypeORMVerificationRequestModel } from 'next-auth/adapters';

export class VerificationRequest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  identifier?: string;
  token?: string;
  expires?: Date;

  constructor(identifier?: string, token?: string, expires?: Date) {
    if (identifier) {
      this.identifier = identifier;
    }

    if (token) {
      this.token = token;
    }

    if (expires) {
      this.expires = expires;
    }
  }
}

export const VerificationRequestSchema = {
  ...Adapters.TypeORM.Models.VerificationRequest.schema,
  target: VerificationRequest
};
