import Link from 'next/link';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { Item } from '@/db/models/items/Item';
import Box from '@/components/common/box/Box';
import { ArrowRight } from 'react-feather';

import { useTranslation } from 'next-i18next';

interface DashboardItemBoxProps {
  item: Item;
}

const ItemBox = ({ item }: DashboardItemBoxProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <Link
      href={`/dashboard/inventory/${item.slug}`}
      className="text-foreground"
    >
      <Box>
        <div className="flex justify-between items-center gap-4">
          <div>
            <h2 className="text-xl">{item.friendlyName}</h2>

            {item.description?.length > 0 && <p>{item.description}</p>}
          </div>

          <Button size={ButtonSize.MEDIUM}>
            <span className="inline-block mr-1 align-middle">
              {t('items.home.view')}
            </span>

            <ArrowRight className="inline-block align-middle" />
          </Button>
        </div>
      </Box>
    </Link>
  );
};

export default ItemBox;
