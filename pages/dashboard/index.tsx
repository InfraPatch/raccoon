import DashboardLayout from '@/layouts/DashboardLayout';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { getSession, signOut } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { User } from '@/db/models/auth/User';
import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export interface DashboardHomePageProps {
  user: User;
}

const DashboardHomePage = ({ user }: DashboardHomePageProps) => {
  const handleSignoutClick = async (e) => {
    e.preventDefault();
    await signOut();
  };

  return (
    <DashboardLayout user={user}>
      <Columns>
        <Column>
          <Box>
            it works! welcome, { user.name }

            <Button size={ButtonSize.SMALL} onClick={handleSignoutClick}>
              Log out
            </Button>
          </Box>

          <Box>
            one more box here as well
          </Box>
        </Column>

        <Column>
          <Box>
            another box
          </Box>

          <Box>
            yet another box
          </Box>

          <Box>
            one more box
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
