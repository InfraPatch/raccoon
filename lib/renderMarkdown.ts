import path from 'path';
import fs from 'fs';

import buildUrl from '@/lib/buildUrl';

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';

const renderMarkdown = async (
  locale: string,
  documentPath: string,
): Promise<MDXRemoteSerializeResult | null> => {
  const attemptedLocales = [locale, 'hu'];
  let fileContent: string | null = null;

  for (const locale of attemptedLocales) {
    const articlePath = path.join(
      process.cwd(),
      'content',
      locale,
      `${documentPath}.mdx`,
    );

    if (fs.existsSync(articlePath)) {
      fileContent = fs.readFileSync(articlePath, { encoding: 'utf8' });
      break;
    }
  }

  if (!fileContent) {
    return null;
  }

  const websiteUrl = buildUrl('/');
  const source = await serialize(fileContent, {
    parseFrontmatter: true,
    mdxOptions: { remarkPlugins: [remarkGfm] },
    scope: { websiteUrl },
  });

  return source;
};

export { renderMarkdown };
