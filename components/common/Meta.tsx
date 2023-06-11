import buildUrl from '@/lib/buildUrl';
import Head from 'next/head';
import favicon from '@/assets/icons/favicon.ico';

export interface IMetaProps {
  title?: string;
  description?: string;
  url: string;
  noAppendSiteName?: boolean;
}

const Meta = ({ title, description, url, noAppendSiteName }: IMetaProps) => {
  if (title && !noAppendSiteName) {
    title = `${title} - Project Raccoon`;
  }

  if (!title) {
    title = 'Project Raccoon';
  }

  url = buildUrl(url);

  return (
    <Head>
      <title>{title}</title>

      <meta name="title" content={title} />
      {description && <meta name="description" content={description} />}

      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}

      <meta property="og:url" content={url} />

      <link rel="icon" href={favicon.src} />
    </Head>
  );
};

export default Meta;
