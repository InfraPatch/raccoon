import ContentPageLayout from '@/layouts/ContentPageLayout';
import Illustration from '@/components/common/illustrations/Illustration';

import Meta from '@/components/common/Meta';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { renderMarkdown } from '@/lib/renderMarkdown';
import { MDXRemoteSerializeResult, MDXRemote } from 'next-mdx-remote';

const TermsPage = ({ source }: { source: MDXRemoteSerializeResult }) => {
  const { t } = useTranslation('terms');

  return (
    <ContentPageLayout title={t('title')} subtitle={t('subtitle')} narrow>
      <Meta title={t('title')} description={t('subtitles')} url="/terms" />

      <Illustration.Terms className="max-w-lg mx-auto mb-10" />

      <MDXRemote {...source} />
    </ContentPageLayout>
  );
};

export const getServerSideProps = async ({ req, res, locale }) => {
  const translations = await serverSideTranslations(locale, [
    'common',
    'terms',
  ]);
  const source = await renderMarkdown(locale, 'terms');

  if (!source) {
    res.statusCode = 404;
  }

  return {
    props: {
      ...translations,
      source,
    },
  };
};

export default TermsPage;
