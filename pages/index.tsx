import Meta from '@/components/common/Meta';
import PageLayout from '@/layouts/PageLayout';

import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Illustration from '@/components/common/illustrations/Illustration';
import Button, { ButtonSize } from '@/components/common/button/Button';

import router from 'next/router';
import { useSession } from 'next-auth/client';

const Home = () => {
  const { t } = useTranslation('home');
  const [ session, _ ] = useSession();

  const handleCTAClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <PageLayout>
      <Meta
        description={ t('hero-slogan') }
        url="/"
      />

      <div className="text-center py-10 px-4 md:px-0">
        <div className="max-w-xl mx-auto mb-10">
          <h1 className="text-5xl mb-10 font-bold text-accent">
            { t('hero-slogan') }
          </h1>

          <p className="text-xl mb-10">
            { t('hero-description') }
          </p>

          <div className="text-xl">
            <Button size={ButtonSize.MEDIUM} onClick={handleCTAClick}>{ t('hero-cta') }</Button>
          </div>
        </div>

        <Illustration.HomeHero className="max-w-2xl mx-auto" />
      </div>
    </PageLayout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'home' ])
    }
  };
};

export default Home;
