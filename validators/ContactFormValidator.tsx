import { IContactFormFields, IContactFormValidationErrors } from '@/components/contact-form/IContactFormFields';
import { TFunction } from 'next-i18next';

import EmailValidator from 'email-validator';

const validate = (t: TFunction): ((fields: IContactFormFields) => IContactFormValidationErrors) => {
  return fields => {
    const errors: IContactFormValidationErrors = {};

    if (fields.name.length < 2) {
      errors.name = t(`errors:contact.NAME_TOO_SHORT`, { min: 2 });
    }

    if (!EmailValidator.validate(fields.email)) {
      errors.email = t('errors:contact.INVALID_EMAIL');
    }

    if (fields.subject.length < 5) {
      errors.subject = t('errors:contact.SUBJECT_TOO_SHORT', { min: 5 });
    }

    if (fields.message.length < 10) {
      errors.message = t('errors:contact.MESSAGE_TOO_SHORT', { min: 10 });
    }

    return errors;
  };
};

export {
  validate
};
