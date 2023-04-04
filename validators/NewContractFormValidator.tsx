import { NewContractFormRequest } from '@/components/dashboard/admin/contracts/NewContractForm';
import { TFunction } from 'next-i18next';

export const validate = (t: TFunction): ((fields: NewContractFormRequest) => Partial<NewContractFormRequest>) => {
  return fields => {
    const errors: Partial<NewContractFormRequest> = {};

    if (!fields.friendlyName || fields.friendlyName.length < 2) {
      errors.friendlyName = t('errors:contracts.NAME_TOO_SHORT', { min: 2 });
    }

    if (!fields.description || fields.description.length < 2) {
      errors.description = t('errors:contracts.DESCRIPTION_TOO_SHORT', { min: 2 });
    }

    return errors;
  };
};
