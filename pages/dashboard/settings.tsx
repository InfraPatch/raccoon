import { useEffect, useState } from 'react';

import DashboardLayout from '@/layouts/DashboardLayout';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

import { redirectIfAnonymous } from '@/lib/redirects';

import { User } from '@/db/models/auth/User';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Loading from '@/components/common/Loading';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getSession } from 'next-auth/client';

import apiService from '@/services/apis';
import UserSettingsForm from '@/components/dashboard/settings/UserSettingsForm';
import UserPasswordSettingsForm from '@/components/dashboard/settings/UserPasswordSettingsForm';
import UserIdentificationSettingsForm from '@/components/dashboard/settings/UserIdentificationSettingsForm';

import { useTranslation } from 'react-i18next';

export interface DashboardSettingsPageProps {
  user: User;
};

const DashboardSettingsPage = ({ user }: DashboardSettingsPageProps) => {
  const [ userWithDetails, setUserWithDetails ] = useState<User | null>(null);
  const [ error, setError ] = useState('');

  const { t } = useTranslation([ 'dashboard', 'common', 'errors' ]);

  useEffect(() => {
    const loadUser = async () => {
      setError('');

      try {
        const res = await apiService.users.getLoggedInUser();
        setUserWithDetails(res.user);
      } catch (err) {
        console.error(err);
        setError(t('errors:INTERNAL_SERVER_ERROR'));
      };
    };

    loadUser();
  }, []);

  return (
    <DashboardLayout user={user}>
      {userWithDetails && (
        <Columns>
          <Column>
            <Box title={t('dashboard:settings.user-settings')}>
              <UserSettingsForm user={userWithDetails} />
            </Box>

            <Box title={t('dashboard:settings.password')}>
              <UserPasswordSettingsForm user={userWithDetails} />
            </Box>
          </Column>

          <Column>
            <Box title={t('dashboard:settings.id-settings')}>
              <UserIdentificationSettingsForm user={userWithDetails} />
            </Box>
          </Column>
        </Columns>
      )}

      {!userWithDetails && error.length === 0 && (
        <div className="text-center">
          <Loading />
        </div>
      )}

      {error && error.length > 0 && (
        <DangerMessage>
          {error}
        </DangerMessage>
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
      user: session.user,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardSettingsPage;
