import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import Box from '@/components/common/box/Box';
import NewItemForm from '@/components/dashboard/admin/items/NewItemForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Meta from '@/components/common/Meta';

const DashboardNewItemPage = () => {
  const { t } = useTranslation('dashboard');

  return (
    <DashboardLayout>
      <Meta
        title={t('dashboard:pages.new-item')}
        url="/dashboard/admin/property-categories/new"
      />
      <Columns>
        <Column>
          <Box title={t('pages.new-item')}>
            <NewItemForm />
          </Box>
        </Column>

        <Column />
      </Columns>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ locale }) => {
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

export default DashboardNewItemPage;
