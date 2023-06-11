import Meta from '@/components/common/Meta';
import AuthPageLayout from '@/layouts/AuthPageLayout';
import LoginForm from '@/components/auth/LoginForm';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const LoginPage = () => {
  const { t } = useTranslation('common');

  return (
    <AuthPageLayout>
      <Meta title={t('log-in')} url="/login" />

      <LoginForm />
    </AuthPageLayout>
  );
};

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth', 'errors'])),
    },
  };
};

export default LoginPage;
