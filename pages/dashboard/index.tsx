import Button, { ButtonSize } from '@/components/common/button/Button';
import DashboardLayout from '@/layouts/DashboardLayout';

import { getSession, signOut } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { User } from '@/db/models/auth/User';
import Box from '@/components/common/box/Box';

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
      <Box>
        it works! welcome, { user.name }

        <Button size={ButtonSize.SMALL} onClick={handleSignoutClick}>
          Log out
        </Button>
      </Box>

      <Box>
        another box
      </Box>
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  return {
    props: {
      user: session.user
    }
  };
};

export default DashboardHomePage;
