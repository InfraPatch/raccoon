import Meta from '@/components/common/Meta';
import PageLayout from '@/layouts/PageLayout';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Illustration from '@/components/common/illustrations/Illustration';
import Button, { ButtonSize } from '@/components/common/button/Button';

import router from 'next/router';
import { useSession } from 'next-auth/client';
import Box from '@/components/common/box/Box';
import HomeBox from '@/components/home/HomeBox';

const Home = () => {
  const { t } = useTranslation('home');
  const [session, _] = useSession();

  const handleCTAClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <PageLayout>
      <Meta description={t('hero-slogan')} url="/" />

      <section className="text-center py-10 px-4 md:px-0">
        <div className="max-w-xl mx-auto mb-10">
          <h1 className="text-5xl mb-10 font-bold text-accent">
            {t('hero-slogan')}
          </h1>

          <p className="text-xl mb-10">{t('hero-description')}</p>

          <div className="text-xl">
            <Button size={ButtonSize.MEDIUM} onClick={handleCTAClick}>
              {t('hero-cta')}
            </Button>
          </div>
        </div>

        <Illustration.HomeHero className="max-w-2xl mx-auto" />
      </section>

      <div className="text-5xl text-center p-3 my-6 font-bold">
        {t('hero-steps')}
      </div>

      <div className="max-w-7xl mx-auto">
        <HomeBox
          illustration={<Illustration.OnlineCollaboration />}
          step={1}
          title={t('steps.create.title')}
          description={t('steps.create.description')}
        />

        <HomeBox
          illustration={<Illustration.Forms />}
          step={2}
          reverse
          title={t('steps.fill.title')}
          description={t('steps.fill.description')}
        />

        <HomeBox
          illustration={<Illustration.Download />}
          step={3}
          title={t('steps.download.title')}
          description={t('steps.download.description')}
        />
      </div>

      <div className="my-6 p-3 text-center">
        <Button size={ButtonSize.MEDIUM} onClick={handleCTAClick}>
          {t('hero-cta')}
        </Button>
      </div>
    </PageLayout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home'])),
    },
  };
};

export default Home;
