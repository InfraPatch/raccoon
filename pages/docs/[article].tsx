import { MDXRemoteSerializeResult, MDXRemote } from 'next-mdx-remote';

import DocsPageLayout from '@/layouts/DocsPageLayout';
import NotFoundPage from '@/pages/404';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { renderMarkdown } from '@/lib/renderMarkdown';

export interface DocsArticlePageProps {
  source?: MDXRemoteSerializeResult;
}

const DocsArticlePage = ({ source }: DocsArticlePageProps) => {
  if (!source) {
    return <NotFoundPage />;
  }

  return (
    <DocsPageLayout
      title={source.frontmatter.title as string}
      description={source.frontmatter.description as string}
      url={source.frontmatter.url as string}
    >
      <h1>{source.frontmatter.title as string}</h1>
      <MDXRemote {...source} />
    </DocsPageLayout>
  );
};

export const getServerSideProps = async ({ req, res, params, locale }) => {
  const key = params.article;

  const translations = await serverSideTranslations(locale, [
    'common',
    'errors',
    'docs',
  ]);
  const source = await renderMarkdown(locale, `docs/${key}`);

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

export default DocsArticlePage;
