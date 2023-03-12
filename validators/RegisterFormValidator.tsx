import { CredentialsRegisterAPIRequest } from '@/services/apis/auth/CredentialsAuthAPIService';
import { TFunction } from 'next-i18next';

import EmailValidator from 'email-validator';

export type IRegisterFormValidationErrors = {
  [key in keyof CredentialsRegisterAPIRequest]?: string;
};

export const validate = (t: TFunction): ((fields: CredentialsRegisterAPIRequest) => IRegisterFormValidationErrors) => {
  return fields => {
    const errors: IRegisterFormValidationErrors = {};

    if (fields.name.length < 2) {
      errors.name = t('errors:register.NAME_TOO_SHORT', { min: 2 });
    }

    if (!EmailValidator.validate(fields.email)) {
      errors.email = t('errors:register.INVALID_EMAIL');
    }

    if (fields.password.length < 8) {
      errors.password = t('errors:register.PASSWORD_TOO_WEAK');
    }

    if (fields.password !== fields.password2) {
      errors.password2 = t('errors:register.PASSWORD_DONT_MATCH');
    }

    return errors;
  };
};
