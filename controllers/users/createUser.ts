import db from '@/services/db';
import { User } from '@/db/models/auth/User';

import * as EmailValidator from 'email-validator';
import * as passwords from '@/lib/passwords';

export interface UserCreatorFields {
  name?: string;
  email?: string;
  password?: string;
  password2?: string;
};

export class UserCreationError extends Error {
  public code: string;

  constructor(code: string) {
    super();
    this.name = 'UserCreationError';
    this.code = code;
  }
}

export const createUser = async ({ name, email, password, password2 }: UserCreatorFields): Promise<User> => {
  await db.prepare();
  const userRepository = db.getRepository(User);

  if (!name || name.trim().length < 2) {
    throw new UserCreationError('NAME_TOO_SHORT');
  }

  if (!EmailValidator.validate(email)) {
    throw new UserCreationError('INVALID_EMAIL');
  }

  if (!password || password.trim().length < 8) {
    throw new UserCreationError('PASSWORD_TOO_WEAK');
  }

  if (password.trim() !== password2?.trim()) {
    throw new UserCreationError('PASSWORDS_DONT_MATCH');
  }

  const userCount = await userRepository.count({ where: { email } });
  if (userCount !== 0) {
    throw new UserCreationError('USER_ALREADY_EXISTS');
  }

  password = await passwords.hash(password);

  const user = userRepository.create({ name, email, password });
  await userRepository.insert(user);
  return user;
};
