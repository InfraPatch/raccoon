import ContentPageLayout from '@/layouts/ContentPageLayout';
import Illustration from '@/components/common/illustrations/Illustration';

import Head from 'next/head';

import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import TermsEN from '@/content/en/terms.mdx';
import TermsHU from '@/content/hu/terms.mdx';

const TermsPage = ({ locale }: { locale: string }) => {
  const { t } = useTranslation('terms');

  return (
    <ContentPageLayout title={ t('title') } subtitle={ t('subtitle') } narrow>
      <Head>
        <title>{ t('title') }</title>
      </Head>

      <Illustration.Terms className="max-w-lg mx-auto mb-10" />

      {locale === 'hu' && <TermsHU />}
      {locale === 'en' && <TermsEN />}
    </ContentPageLayout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'terms' ]),
      locale
    }
  };
};

export default TermsPage;
