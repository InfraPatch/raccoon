import Head from 'next/head';

import { useTheme } from '@/hooks/useTheme';

import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Home = () => {
  const [ currentTheme, toggleTheme ] = useTheme();

  const { t } = useTranslation('common');

  return (
    <div>
      <Head>
        <title>Raccoon</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        {t('welcome')}
      </div>

      <div onClick={toggleTheme}>toggle theme (current theme: {currentTheme})</div>
    </div>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common' ])
    }
  };
};

export default Home;
