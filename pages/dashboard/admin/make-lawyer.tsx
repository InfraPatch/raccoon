import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import Box from '@/components/common/box/Box';
import MakeLawyerForm from '@/components/dashboard/admin/make-lawyer/MakeLawyerForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Meta from '@/components/common/Meta';

const DashboardMakeLawyerPage = () => {
  const { t } = useTranslation('dashboard');

  return (
    <DashboardLayout>
      <Meta
        title={t('dashboard:pages.make-lawyer')}
        url="/dashboard/admin/make-lawyer"
      />
      <Columns>
        <Column>
          <Box title={t('pages.make-lawyer')}>
            <MakeLawyerForm />
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

export default DashboardMakeLawyerPage;
