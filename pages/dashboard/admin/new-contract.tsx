import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';
import Box from '@/components/common/box/Box';
import NewContractForm from '@/components/dashboard/admin/contracts/NewContractForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Meta from '@/components/common/Meta';
import { useEffect, useState } from 'react';

import { Item } from '@/db/models/items/Item';
import apiService from '@/services/apis';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

const DashboardNewContractPage = () => {
  const { t } = useTranslation('dashboard');

  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState('');

  const loadItems = async () => {
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
      <Meta
        title={t('dashboard:pages.new-contract')}
        url="/dashboard/admin/new-contract"
      />
      <Columns>
        <Column>
          <Box title={t('pages.new-contract')}>
            {items && <NewContractForm items={items} />}
            {!items && !error && <Loading />}
            {error && error.length > 0 && (
              <DangerMessage>{error}</DangerMessage>
            )}
          </Box>
        </Column>

        <Column />
      </Columns>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfNotAdmin(res, session)) {
    return { props: { user: null } };
  }

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

export default DashboardNewContractPage;
