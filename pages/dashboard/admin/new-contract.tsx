import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';
import Box from '@/components/common/box/Box';
import NewContractForm from '@/components/dashboard/admin/contracts/NewContractForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import Meta from '@/components/common/Meta';

const DashboardNewContractPage = () => {
  const { t } = useTranslation('dashboard');

  return (
    <DashboardLayout>
      <Meta
        title={ t('dashboard:pages.new-contract') }
        url="/dashboard/admin/new-contract"
      />
      <Columns>
        <Column>
          <Box title={t('pages.new-contract')}>
            <NewContractForm />
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
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardNewContractPage;
