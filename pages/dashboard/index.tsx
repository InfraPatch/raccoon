import DashboardLayout from '@/layouts/DashboardLayout';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Illustration from '@/components/common/illustrations/Illustration';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Meta from '@/components/common/Meta';
import { redirectIfNotReady, useCurrentUser } from '@/hooks/useCurrentUser';

const DashboardHomePage = () => {
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

  const handleItemsClick = (e) => {
    e.preventDefault();
    router.push('/dashboard/inventory');
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    router.push('/dashboard/settings');
  };

  const [ user ] = useCurrentUser();

  // Redirect user if they haven't filled out their details yet
  redirectIfNotReady(user);

  return (
    <DashboardLayout>
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

      <Columns>
        <Column>
          <Box>
            <div className="text-center">
              <Illustration.Properties className="h-72 max-w-full mx-auto" />

              <div className="text-2xl my-4">
                { t('home.items-title') }
              </div>

              <Button size={ButtonSize.MEDIUM} onClick={handleItemsClick}>
                { t('home.items-button') }
              </Button>
            </div>
          </Box>
        </Column>

        <Column>
          <Box>
            <div className="text-center">
              <Illustration.Profile className="h-72 max-w-full mx-auto" />

              <div className="text-2xl my-4">
                { t('home.profile-title') }
              </div>

              <Button size={ButtonSize.MEDIUM} onClick={handleSettingsClick}>
                { t('home.profile-button') }
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
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardHomePage;
