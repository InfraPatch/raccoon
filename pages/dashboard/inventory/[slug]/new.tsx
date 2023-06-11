import { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { Item } from '@/db/models/items/Item';
import Meta from '@/components/common/Meta';
import { useTranslation } from 'next-i18next';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';
import NewFilledItemForm from '@/components/dashboard/new-filled-item/NewFilledItemForm';
import Link from 'next/link';

export interface DashboardNewFilledItemPageProps {
  slug: string;
}

const DashboardNewFilledItemPage = ({
  slug,
}: DashboardNewFilledItemPageProps) => {
  const { t } = useTranslation(['dashboard', 'errors']);

  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState('');

  const loadItem = async () => {
    setItem(null);
    setError('');

    try {
      const res = await apiService.items.getItem({ slug });
      setItem(res.item);
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
    loadItem();
  }, []);

  return (
    <DashboardLayout>
      <Meta
        title={t('dashboard:pages.new-filled-item')}
        url={`/dashboard/inventory/${slug}/new`}
      />

      <h1 className="font-normal text-2xl mb-3">
        {t('dashboard:pages.new-filled-item')} (
        {item ? item.friendlyName : '...'})
      </h1>

      <div className="mb-4">
        <Link href={`/dashboard/inventory/${slug}`}>
          &laquo; {t('dashboard:new-item.back')}
        </Link>
      </div>

      <Columns>
        <Column>
          {item && <NewFilledItemForm item={item} />}
          {!item && !error && <Loading />}
          {error && error.length > 0 && <DangerMessage>{error}</DangerMessage>}
        </Column>

        <Column />
      </Columns>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ query, locale }) => {
  const { slug } = query;

  return {
    props: {
      slug: Array.isArray(slug) ? slug[0] : slug,
      ...(await serverSideTranslations(locale, [
        'common',
        'dashboard',
        'errors',
      ])),
    },
  };
};

export default DashboardNewFilledItemPage;
