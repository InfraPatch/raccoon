import path from 'path';
import { fileURLToPath } from 'url';

const transpilePackages = [
  '@sindresorhus/slugify',
  '@sindresorhus/transliterate',
];

const dir = path.dirname(fileURLToPath(import.meta.url));

const exported = {
  pageExtensions: ['js', 'ts', 'jsx', 'tsx', 'md', 'mdx'],

  output: 'standalone',

  transpilePackages,

  sassOptions: {
    includePaths: [path.join(dir, 'styles')],
  },

  i18n: {
    defaultLocale: 'hu',
    locales: ['en', 'hu'],
  },

  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        permanent: true,
      },

      {
        source: '/docs/admin',
        destination: '/docs/admin/getting-started',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/avatars/:key',
        destination: '/api/avatars/:key',
      },
      {
        source: '/contracts/:id/download',
        destination: '/api/contracts/:id/download',
      },
      {
        source: '/contracts/:id/edit',
        destination: '/api/contracts/:id/edit',
      },
      {
        source: '/documents/:id',
        destination: '/api/filled-contracts/:id/download',
      },
      {
        source: '/contract-attachments/:id',
        destination: '/api/filled-contracts/attachments/:id/download',
      },
      {
        source: '/item-attachments/:id',
        destination: '/api/filled-items/attachments/:id/download',
      },
      {
        source: '/contracts/:id/signatures/:signId',
        destination: '/api/filled-contracts/:id/signatures/:signId',
      },
    ];
  },
};

export default exported;
