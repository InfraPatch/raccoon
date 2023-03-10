import ContentPageLayout from '@/layouts/ContentPageLayout';
import Illustration from '@/components/common/illustrations/Illustration';

import Head from 'next/head';

import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ServerErrorPage = () => {
  const { t } = useTranslation('errors');

  return (
    <ContentPageLayout title={ t('pages.server-error.title') } narrow>
      <Head>
        <title>{ t('pages.server-error.title') }</title>
      </Head>

      <div className="text-2xl text-center mb-10">
        { t('pages.server-error.content') }
      </div>

      <Illustration.ServerError className="max-w-lg mx-auto" />
    </ContentPageLayout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'errors' ])
    }
  };
};

export default ServerErrorPage;
