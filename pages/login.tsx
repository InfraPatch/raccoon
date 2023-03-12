import { getSession } from 'next-auth/client';
import { redirectIfAuthenticated } from '@/lib/redirects';

import Meta from '@/components/common/Meta';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import { AllowedProvider } from '@/components/auth/SocialLogin';
import LoginForm from '@/components/auth/LoginForm';

import { getProviders } from 'next-auth/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export interface LoginPageProps {
  providers: AllowedProvider[];
};

const LoginPage = ({ providers }: LoginPageProps) => {
  const { t } = useTranslation('common');

  return (
    <AuthPageLayout providers={providers}>
      <Meta
        title={ t('log-in') }
        url="/login"
      />

      <LoginForm />
    </AuthPageLayout>
  );
};

export const getServerSideProps = async ({ req, res, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAuthenticated(res, session)) {
    return { props: { providers: null } };
  }

  const providers = await getProviders();

  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'auth', 'errors' ]),
      providers: Object.keys(providers)
    }
  };
};

export default LoginPage;
