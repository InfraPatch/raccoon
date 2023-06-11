import ContentPageLayout from '@/layouts/ContentPageLayout';
import Illustration from '@/components/common/illustrations/Illustration';

import Meta from '@/components/common/Meta';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const NotFoundPage = () => {
  const { t } = useTranslation('errors');

  return (
    <ContentPageLayout title={t('pages.notfound.title')} narrow>
      <Meta title={t('pages.notfound.title')} url="/" />

      <div className="text-2xl text-center mb-10">
        {t('pages.notfound.content')}
      </div>

      <Illustration.NotFound className="max-w-lg mx-auto" />
    </ContentPageLayout>
  );
};

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'errors'])),
    },
  };
};

export default NotFoundPage;
