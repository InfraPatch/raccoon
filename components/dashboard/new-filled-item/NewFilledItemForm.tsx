import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { IItem } from '@/db/models/items/Item';

import FilledItemForm, {
  FilledItemFormFields,
} from '@/components/dashboard/common/filled-item-form/FilledItemForm';

export interface NewFilledItemFormProps {
  item: IItem;
}

const NewFilledItemForm = ({ item }: NewFilledItemFormProps) => {
  const { t } = useTranslation(['dashboard', 'errors']);
  const router = useRouter();

  const handleFormSubmit = async ({
    friendlyName,
    itemSlug,
    options,
  }: FilledItemFormFields) => {
    try {
      const res = await apiService.filledItems.createFilledItem({
        friendlyName,
        itemSlug,
        options,
      });

      toaster.success(t('dashboard:new-item.success'));
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
      onSubmit={handleFormSubmit}
      submitButtonText={t('dashboard:new-item.submit')}
    />
  );
};

export default NewFilledItemForm;
