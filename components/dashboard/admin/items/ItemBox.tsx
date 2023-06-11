import Link from 'next/link';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { useTranslation } from 'next-i18next';
import { Item } from '@/db/models/items/Item';
import Box from '@/components/common/box/Box';

interface DashboardItemBoxProps {
  item: Item;
}

const ItemBox = ({ item }: DashboardItemBoxProps) => {
  const { t } = useTranslation(['dashboard']);

  return (
    <Box title={item.friendlyName}>
      <span className="py-3">
        {t('dashboard:admin.items.last-updated')}: {item.updatedAt}
      </span>
      <h1 className="py-3">
        {item.description || t('dashboard:admin.items.default-description')}
      </h1>
      <Link href={`/dashboard/admin/property-categories/${item.slug}`}>
        <Button size={ButtonSize.MEDIUM} type="submit">
          {t('dashboard:admin.items.edit-item')}
        </Button>
      </Link>
    </Box>
  );
};

export default ItemBox;
