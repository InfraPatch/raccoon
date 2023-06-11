import { NewContractOptionFormRequest } from '@/components/dashboard/admin/contracts/ContractOptionForm';
import { TFunction } from 'next-i18next';

export const validate = (
  t: TFunction,
): ((
  fields: NewContractOptionFormRequest,
) => Partial<NewContractOptionFormRequest>) => {
  return (fields) => {
    const errors: Partial<NewContractOptionFormRequest> = {};

    if (!fields.friendlyName || fields.friendlyName.length < 2) {
      errors.friendlyName = t('errors:contract-options.NAME_TOO_SHORT', {
        min: 2,
      });
    }

    if (!fields.replacementString || fields.replacementString.length < 2) {
      errors.replacementString = t(
        'errors:contract-options.REPLACEMENT_STRING_TOO_SHORT',
        { min: 2 },
      );
    }

    return errors;
  };
};
