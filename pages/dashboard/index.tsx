import DashboardLayout from '@/layouts/DashboardLayout';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { getSession, signOut } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { User } from '@/db/models/auth/User';
import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Illustration from '@/components/common/illustrations/Illustration';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Meta from '@/components/common/Meta';

export interface DashboardHomePageProps {
  user: User;
}

const DashboardHomePage = ({ user }: DashboardHomePageProps) => {
  const router = useRouter();
  const { t } = useTranslation('dashboard');

  const handleNewContract = (e) => {
    e.preventDefault();
    router.push("/dashboard/contracts/new");
  };

  const handleMyContract = (e) => {
    e.preventDefault();
    router.push("/dashboard/contracts");
  };

  return (
    <DashboardLayout user={user}>
      <Meta
        title={ t('dashboard:pages.home') }
        url="/dashboard"
      />
      <Columns>
        <Column>
          <Box>
            <div className="text-center">
              <Illustration.Contract className="md:h-72 max-w-full mx-auto" />

              <div className="text-2xl my-4">
                { t('home.create-title') }
              </div>

              <Button size={ButtonSize.MEDIUM} onClick={handleNewContract}>
                { t('home.create-button') }
              </Button>
            </div>
          </Box>
        </Column>

        <Column>
          <Box>
            <div className="text-center">
              <Illustration.Agreement className="h-72 max-w-full mx-auto" />

              <div className="text-2xl my-4">
                { t('home.list-title') }
              </div>

              <Button size={ButtonSize.MEDIUM} onClick={handleMyContract}>
                { t('home.list-button') }
              </Button>
            </div>
          </Box>
        </Column>
      </Columns>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  return {
    props: {
      user: session.user,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardHomePage;
