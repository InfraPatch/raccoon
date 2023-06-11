import { UpdateUserAPIRequest } from '@/services/apis/users/UserAPIService';
import { TFunction } from 'next-i18next';

export const validate = (
  t: TFunction,
): ((fields: UpdateUserAPIRequest) => Partial<UpdateUserAPIRequest>) => {
  return (fields) => {
    const errors: Partial<UpdateUserAPIRequest> = {};

    if (fields.name && fields.name.length < 2) {
      errors.name = t('errors:users.NAME_TOO_SHORT', { min: 2 });
    }

    if (fields.password && fields.password.length > 0) {
      if (fields.password.length < 8) {
        errors.password = t('errors:users.PASSWORD_TOO_WEAK', { min: 8 });
      }

      if (fields.password2 !== fields.password) {
        errors.password2 = t('errors:users.PASSWORDS_DONT_MATCH');
      }
    }

    if (fields.motherBirthDate && fields.motherBirthDate >= new Date()) {
      errors.motherBirthDate = t('errors:users.INVALID_MOTHER_BIRTH_DATE');
    }

    if (
      fields.birthDate &&
      (fields.birthDate <= fields.motherBirthDate ||
        fields.birthDate >= new Date())
    ) {
      errors.birthDate = t('errors:users.INVALID_BIRTH_DATE');
    }

    return errors;
  };
};
