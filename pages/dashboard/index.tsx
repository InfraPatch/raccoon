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

export interface DashboardHomePageProps {
  user: User;
}

const DashboardHomePage = ({ user }: DashboardHomePageProps) => {
  const router = useRouter()
  const handleNewContract = (e) => {
    e.preventDefault()
    router.push("/dashboard/contracts/new")
  };
  const handleMyContract = (e) => {
    e.preventDefault()
    router.push("/dashboard/contracts")
  };

  return (
    <DashboardLayout user={user}>
      <Columns>
        <Column>
          <Box>
            <div className="text-center">
              <Illustration.Contract className="max-w-1/2 max-h-500 mx-auto mb-10" />
            
              <div className="text-lg">
                Create a new contract<br/><br/>
              </div>
              <Button size={ButtonSize.SMALL} onClick={handleNewContract}>
                New Contract
              </Button>
            </div>
          </Box>
        </Column>

        <Column>
          <Box>
            <div className="text-center">
              <Illustration.Agreement className="max-w-1/2 max-h-500 mx-auto mb-10" />
              
              <div className="text-lg">
                Check out your contracts<br/><br/>
              </div>
              <Button size={ButtonSize.SMALL} onClick={handleMyContract}>
                My Contracts
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
