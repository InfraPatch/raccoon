import db from '@/services/db';
import { User } from '@/db/models/auth/User';

import * as passwords from '@/lib/passwords';

export interface UserAuthorizationFields {
  email: string;
  password: string;
}

export class UserAuthorizationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'UserAuthorizationError';
    this.code = code;
  }
}

export const authorizeUser = async ({
  email,
  password,
}: UserAuthorizationFields): Promise<User> => {
  await db.prepare();
  const userRepository = db.getRepository(User);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new UserAuthorizationError('USER_NOT_FOUND');
  }

  if (!(await passwords.verify(password, user.password))) {
    throw new UserAuthorizationError('INVALID_PASSWORD');
  }

  return user;
};
