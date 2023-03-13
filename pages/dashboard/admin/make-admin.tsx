import DashboardLayout from '@/layouts/DashboardLayout';

import { User } from '@/db/models/auth/User';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';
import Box from '@/components/common/box/Box';
import MakeAdminForm from '@/components/dashboard/admin/make-admin/MakeAdminForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export interface DashboardMakeAdminPageProps {
  user: User;
};

const DashboardMakeAdminPage = ({ user }: DashboardMakeAdminPageProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <DashboardLayout user={user}>
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

export default DashboardMakeAdminPage;
