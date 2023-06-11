import * as bcrypt from 'bcryptjs';

export const hash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then(resolve)
      .catch(reject);
  });
};

export const verify = (attempt: string, actual: string): Promise<boolean> => {
  return bcrypt.compare(attempt, actual);
};
