import { NewItemAPIRequest } from '@/services/apis/items/ItemAPIService';
import { TFunction } from 'next-i18next';

export const validate = (t: TFunction): ((fields: NewItemAPIRequest) => Partial<NewItemAPIRequest>) => {
  return fields => {
    const errors: Partial<NewItemAPIRequest> = {};

    if (!fields.friendlyName || fields.friendlyName.length < 2) {
      errors.friendlyName = t('errors:items.NAME_TOO_SHORT', { min: 2 });
    }

    if (!fields.description || fields.description.length < 2) {
      errors.description = t('errors:items.DESCRIPTION_TOO_SHORT', { min: 2 });
    }

    return errors;
  };
};
