import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { Item } from '@/db/models/items/Item';
import ItemBox from '@/components/dashboard/items/ItemBox';
import { useTranslation } from 'next-i18next';
import Meta from '@/components/common/Meta';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

const DashboardItemsPage = () => {
  const { t } = useTranslation(['dashboard', 'errors']);

  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState('');

  const loadItems = async () => {
    setItems(null);
    setError('');

    try {
      const res = await apiService.items.getItems();
      setItems(res.items);
    } catch (err) {
      console.error(err);
      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <DashboardLayout>
      <Meta title={t('dashboard:pages.my-items')} url="/dashboard/inventory" />

      <h1 className="font-normal text-2xl mb-6">
        {t('dashboard:pages.my-items')}
      </h1>

      <Columns>
        <Column>
          {items && items.map((item, idx) => <ItemBox item={item} key={idx} />)}
        </Column>

        <Column />
      </Columns>

      {!items && !error && <Loading />}

      {error && error.length && <DangerMessage>{error}</DangerMessage>}
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'dashboard',
        'errors',
      ])),
    },
  };
};

export default DashboardItemsPage;
