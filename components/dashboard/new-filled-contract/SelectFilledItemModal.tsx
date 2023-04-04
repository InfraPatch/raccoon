import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

import { IFilledItem } from '@/db/models/items/FilledItem';

import apiService from '@/services/apis';

import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export interface SelectFilledItemModalProps {
  itemSlug: string;
  filledItem: IFilledItem | null;
  setFilledItem(filledItem: IFilledItem): void;
}

const SelectFilledItemModal = ({ itemSlug, filledItem, setFilledItem }: SelectFilledItemModalProps) => {
  const [ filledItems, setFilledItems ] = useState<IFilledItem[] | null>(null);
  const [ currentItem, setCurrentItem ] = useState<IFilledItem | null>(filledItem || null);
  const [ error, setError ] = useState('');

  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const loadFilledItems = async () => {
    setFilledItems(null);
    setError('');

    try {
      const res = await apiService.filledItems.listFilledItems(itemSlug);
      setFilledItems(res.filledItems.filter(item => !item.locked));
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          setError(t(`errors:items.${message}`));
          return;
        }
      }

      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadFilledItems();
  }, [ filledItem ]);

  const generateClassNames = (item: IFilledItem): string => {
    const isSelected = item.id === currentItem?.id;

    return clsx('flex', 'px-3', 'py-2', 'cursor-pointer', {
      'hover:bg-[#f4f4f4]': !isSelected,
      'bg-accent': isSelected,
      'text-white': isSelected
    });
  };

  const handleItemClick = (item: IFilledItem) => {
    setFilledItem(item);
    setCurrentItem(item);
  };

  return (
    <div>
      {filledItems && filledItems.map(item => (
        <div key={item.id} className="mb-1">
          <div className={generateClassNames(item)} onClick={() => handleItemClick(item)} role="button">
            {item.friendlyName}
          </div>
        </div>
      ))}

      {!filledItems && !error && <Loading />}
      {error && error.length > 0 && <DangerMessage>{error}</DangerMessage>}
    </div>
  );
};

export default SelectFilledItemModal;
