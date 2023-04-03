import Link from 'next/link';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { IFilledItem } from '@/db/models/items/FilledItem';
import Box from '@/components/common/box/Box';
import { ArrowRight } from 'react-feather';

import { useTranslation } from 'react-i18next';

interface FilledItemBoxProps {
  slug: string;
  filledItem: IFilledItem;
};

const FilledItemBox = ({ slug, filledItem }: FilledItemBoxProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <Link href={`/dashboard/inventory/${slug}/${filledItem.id}`}>
      <a className="text-foreground">
        <Box>
          <div className="flex justify-between items-center gap-4">
            <div>
              <h2 className="text-xl">{ filledItem.friendlyName }</h2>
            </div>

            <Button size={ButtonSize.MEDIUM}>
              <span className="inline-block mr-1 align-middle">
                { t('items.home.view') }
              </span>

              <ArrowRight className="inline-block align-middle" />
            </Button>
          </div>
        </Box>
      </a>
    </Link>
  );
};

export default FilledItemBox;
