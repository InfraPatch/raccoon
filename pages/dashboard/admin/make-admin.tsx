import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import Box from '@/components/common/box/Box';
import MakeAdminForm from '@/components/dashboard/admin/make-admin/MakeAdminForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Meta from '@/components/common/Meta';

const DashboardMakeAdminPage = () => {
  const { t } = useTranslation('dashboard');

  return (
    <DashboardLayout>
      <Meta
        title={t('dashboard:pages.make-admin')}
        url="/dashboard/admin/make-admin"
      />
      <Columns>
        <Column>
          <Box title={t('pages.make-admin')}>
            <MakeAdminForm />
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

export default DashboardMakeAdminPage;
