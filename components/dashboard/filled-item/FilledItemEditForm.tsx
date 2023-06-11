import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import { useTranslation } from 'next-i18next';

import { IItem } from '@/db/models/items/Item';
import { IFilledItem } from '@/db/models/items/FilledItem';

import FilledItemForm, {
  FilledItemFormFields,
} from '@/components/dashboard/common/filled-item-form/FilledItemForm';

export interface FilledItemEditFormProps {
  item: IItem;
  filledItem: IFilledItem;
  loadFilledItem(): Promise<void>;
}

const FilledItemEditForm = ({
  item,
  filledItem,
  loadFilledItem,
}: FilledItemEditFormProps) => {
  const { t } = useTranslation(['dashboard', 'errors']);

  const handleFormSubmit = async ({
    friendlyName,
    options,
  }: FilledItemFormFields) => {
    try {
      await apiService.filledItems.updateFilledItem(filledItem.id, {
        friendlyName,
        options,
      });

      toaster.success(t('dashboard:items.data.success'));
      await loadFilledItem();
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:items.${message}`, { min: 2 }));
          return;
        }
      }

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  return (
    <FilledItemForm
      item={item}
      filledItem={filledItem}
      onSubmit={handleFormSubmit}
      submitButtonText={t('dashboard:items.data.submit')}
    />
  );
};

export default FilledItemEditForm;
