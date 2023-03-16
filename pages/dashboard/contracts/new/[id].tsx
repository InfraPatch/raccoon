import DashboardLayout from '@/layouts/DashboardLayout';

import { User } from '@/db/models/auth/User';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import NewFilledContractForm from '@/components/dashboard/new-filled-contract/NewFilledContractForm';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Meta from '@/components/common/Meta';

export interface DashboardNewContractPageProps {
  user: User;
  contractId: number;
};

const DashboardNewContractPage = ({ user, contractId }: DashboardNewContractPageProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <DashboardLayout user={user}>
      <Meta
        title={ t('dashboard:pages.new-contract') }
        url={`/dashboard/contracts/new/${contractId}`}
      />
      <Columns>
        <Column>
          <Box title={ t('new-contract.title') }>
            <NewFilledContractForm id={contractId} />
          </Box>
        </Column>

        <Column />
      </Columns>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  const { id } = query;

  return {
    props: {
      user: session.user,
      contractId: parseInt(Array.isArray(id) ? id[0] : id),
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardNewContractPage;
