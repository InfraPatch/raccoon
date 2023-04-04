import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonymous } from '@/lib/redirects';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Loading from '@/components/common/Loading';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getSession } from 'next-auth/client';

import UserSettingsForm from '@/components/dashboard/settings/UserSettingsForm';
import UserPasswordSettingsForm from '@/components/dashboard/settings/UserPasswordSettingsForm';
import UserIdentificationSettingsForm from '@/components/dashboard/settings/UserIdentificationSettingsForm';

import { useTranslation } from 'react-i18next';
import Meta from '@/components/common/Meta';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { isUserFilledOut } from '@/controllers/users/utils';

const DashboardSettingsPage = () => {
  const [ userWithDetails, setUserWithDetails ] = useCurrentUser();

  const { t } = useTranslation([ 'dashboard', 'common', 'errors' ]);
  const userReady: boolean = isUserFilledOut(userWithDetails);

  return (
    <DashboardLayout>
      <Meta
        title={ t('dashboard:pages.user-settings') }
        url="/dashboard/settings"
      />

      {userWithDetails && !userReady && (
        <Box>
          <div className="text-center">
            <span className="text-xl font-bold">{ t('dashboard:settings.welcome') }</span>
          </div>
        </Box>
      )}

      {userWithDetails && (
        <Columns>
          <Column>
            <Box title={t('dashboard:settings.user-settings')}>
              <UserSettingsForm user={userWithDetails} setUser={setUserWithDetails} />
            </Box>

            <Box title={t('dashboard:settings.password')}>
              <UserPasswordSettingsForm user={userWithDetails} />
            </Box>
          </Column>

          <Column>
            <Box title={t('dashboard:settings.id-settings')}>
              <UserIdentificationSettingsForm user={userWithDetails} setUser={setUserWithDetails} />
            </Box>
          </Column>
        </Columns>
      )}

      {!userWithDetails && (
        <div className="text-center">
          <Loading />
        </div>
      )}
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

export default DashboardSettingsPage;
