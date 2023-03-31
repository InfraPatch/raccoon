import DashboardLayout from '@/layouts/DashboardLayout';

import { User } from '@/db/models/auth/User';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';
import Box from '@/components/common/box/Box';
import MakeLawyerForm from '@/components/dashboard/admin/make-lawyer/MakeLawyerForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import Meta from '@/components/common/Meta';

export interface DashboardMakeLawyerPageProps {
  user: User;
};

const DashboardMakeLawyerPage = ({ user }: DashboardMakeLawyerPageProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <DashboardLayout user={user}>
      <Meta
        title={ t('dashboard:pages.make-lawyer') }
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

export const getServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfNotAdmin(res, session)) {
    return { props: { user: null } };
  }

  return {
    props: {
      user: session.user,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardMakeLawyerPage;
