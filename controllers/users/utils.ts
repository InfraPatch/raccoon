import { IUser } from '@/db/models/auth/User';

export const isUserFilledOut = (user: IUser): boolean => {
  if (!user) {
    return false;
  }

  if (
    user.motherName &&
    user.motherBirthDate &&
    user.nationality &&
    user.personalIdentifier &&
    user.phoneNumber &&
    user.birthDate &&
    user.birthPlace
  ) {
    return true;
  }

  return false;
};
