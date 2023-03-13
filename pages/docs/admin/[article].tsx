import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';

import { DocsArticlePageProps } from '@/pages/docs/[article]';

import matter from 'gray-matter';

import DocsPageLayout from '@/layouts/DocsPageLayout';
import NotFoundPage from '@/pages/404';

import * as fs from 'fs';
import * as path from 'path';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';

const AdminDocsArticlePage = ({ source, meta }: DocsArticlePageProps) => {
  if (!source || !meta) {
    return <NotFoundPage />;
  }

  const content = hydrate(source);

  return (
    <DocsPageLayout title={meta.title} description={meta.description} url={meta.url}>
      <h1>{meta.title}</h1>
      {content}
    </DocsPageLayout>
  );
};

export const getServerSideProps = async ({ req, res, params, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfNotAdmin(req, session)) {
    return { props: { content: null } };
  }

  const key = params.article;

  const translations = await serverSideTranslations(locale, [ 'common', 'errors', 'docs' ]);

  const localizedArticlePath = path.join(process.cwd(), 'content/docs', locale, 'admin', `${key}.mdx`);
  const fallbackArticlePath = path.join(process.cwd(), 'content/docs/hu/admin', `${key}.mdx`);

  let fileContent: string | null = null;

  if (fs.existsSync(localizedArticlePath)) {
    fileContent = fs.readFileSync(localizedArticlePath, { encoding: 'utf8' });
  }

  if (!fileContent && fs.existsSync(fallbackArticlePath)) {
    fileContent = fs.readFileSync(fallbackArticlePath, { encoding: 'utf8' });
  }

  if (!fileContent) {
    res.statusCode = 404;
    return {
      props: {
        ...translations
      }
    };
  }

  const { content, data } = matter(fileContent);
  const mdxSource = await renderToString(content, { scope: data });
  return {
    props: {
      ...translations,
      source: mdxSource,
      meta: data
    }
  };
};

export default AdminDocsArticlePage;
