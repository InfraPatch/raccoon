import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import { IItem } from '@/db/models/items/Item';
import { IFilledItem } from '@/db/models/items/FilledItem';

import FilledItemForm, { FilledItemFormFields } from '@/components/dashboard/common/filled-item-form/FilledItemForm';

export interface FilledItemEditFormProps {
  item: IItem;
  filledItem: IFilledItem;
};

const FilledItemEditForm = ({ item, filledItem }: FilledItemEditFormProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const router = useRouter();

  const handleFormSubmit = async ({ friendlyName, options }: FilledItemFormFields) => {
    try {
      const res = await apiService.filledItems.updateFilledItem(filledItem.id, {
        friendlyName,
        options
      });

      toaster.success(t('dashboard:update.success'));
      router.push(`/dashboard/inventory/${item.slug}/${res.filledItem.id}`);
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
      submitButtonText={t('dashboard:update.submit')}
    />
  );
};

export default FilledItemEditForm;
