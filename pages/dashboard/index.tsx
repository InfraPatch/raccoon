import { getSession, signOut } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { User } from '@/db/models/auth/User';
import Button, { ButtonSize } from '@/components/common/button/Button';

export interface DashboardHomePageProps {
  user: User;
}

const DashboardHomePage = ({ user }: DashboardHomePageProps) => {
  const handleSignoutClick = async (e) => {
    e.preventDefault();
    await signOut();
  };

  return (
    <div>
      it works! welcome, { user.name }

      <Button size={ButtonSize.SMALL} onClick={handleSignoutClick}>
        Log out
      </Button>
    </div>
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
