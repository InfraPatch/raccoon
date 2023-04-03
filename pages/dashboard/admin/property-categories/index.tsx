import { useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { Item } from '@/db/models/items/Item';
import ItemBox from '@/components/dashboard/admin/items/ItemBox';
import Meta from '@/components/common/Meta';
import { useTranslation } from 'react-i18next';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';
import Loading from '@/components/common/Loading';

const DashboardItemsPage = () => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ rows, setRows ] = useState<Item[][] | null>(null);
  const [ error, setError ] = useState('');

  const loadItems = async () => {
    setRows(null);
    setError('');

    try {
      const res = await apiService.items.getItems();
      const items = res.items;

      const rows: Item[][] = [];

      for (let i : number = 0; i < items.length; i += 2) {
        rows.push(items.slice(i, i + 2));
      }

      setRows(rows);
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
      <Meta
        title={ t('dashboard:pages.item-categories') }
        url="/dashboard/admin/property-categories"
      />

      {rows && rows.map((row, index) => {
        let columns = [];

        for (let i : number = 0; i < row.length; ++i) {
          let item : Item = row[i];

          columns.push(
            <Column key={'item-' + item.id}>
              <ItemBox item={item} />
            </Column>
          );
        }

        return <Columns key={'column-' + index}>{columns}</Columns>;
      })}

      {!rows && !error && <Loading />}

      {error && error.length && <DangerMessage>{error}</DangerMessage>}
    </DashboardLayout>
  );
};

export const getServerSideProps : GetServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfNotAdmin(res, session)) {
    return { props: { user: null } };
  }

  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardItemsPage;
