import ContentPageLayout from '@/layouts/ContentPageLayout';
import Illustration from '@/components/common/illustrations/Illustration';

import Head from 'next/head';

import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import PrivacyPolicyEN from '@/content/en/privacy.mdx';
import PrivacyPolicyHU from '@/content/hu/privacy.mdx';

const PrivacyPage = ({ locale }: { locale: string }) => {
  const { t } = useTranslation('privacy');

  return (
    <ContentPageLayout title={ t('title') } subtitle={ t('subtitle') } narrow>
      <Head>
        <title>{ t('title') }</title>
      </Head>

      <Illustration.PrivacyPolicy className="max-w-lg mx-auto mb-10" />

      {locale === 'hu' && <PrivacyPolicyHU />}
      {locale === 'en' && <PrivacyPolicyEN />}
    </ContentPageLayout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...await serverSideTranslations(locale, [ 'common', 'privacy' ]),
      locale
    }
  };
};

export default PrivacyPage;
