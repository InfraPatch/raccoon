import Head from 'next/head';
import PageLayout from '@/layouts/PageLayout';

import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Illustration from '@/components/common/illustrations/Illustration';
import Button, { ButtonSize } from '@/components/common/button/Button';

import toaster from '@/lib/toaster';

const Home = () => {
  const { t } = useTranslation('home');

  const handleCTAClick = () => {
    toaster.create('info', 'Work in progress!');
  };

  return (
    <div>
      <Head>
        <title>Raccoon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <div className="text-center py-10">
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
    </div>
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
