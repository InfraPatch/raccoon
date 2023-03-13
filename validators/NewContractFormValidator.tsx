import { NewContractAPIRequest } from '@/services/apis/contracts/ContractAPIService';
import { TFunction } from 'next-i18next';

export const validate = (t: TFunction): ((fields: NewContractAPIRequest) => Partial<NewContractAPIRequest>) => {
  return fields => {
    const errors: Partial<NewContractAPIRequest> = {};

    if (!fields.friendlyName || fields.friendlyName.length < 2) {
      errors.friendlyName = t('errors:contracts.NAME_TOO_SHORT', { min: 2 });
    }

    if (!fields.description || fields.description.length < 2) {
      errors.description = t('errors:contracts.DESCRIPTION_TOO_SHORT', { min: 2 });
    }

    return errors;
  };
};
