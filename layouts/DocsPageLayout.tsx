import { ReactNode } from 'react';

import PageLayout from './PageLayout';

import Box from '@/components/common/box/Box';
import Meta from '@/components/common/Meta';
import DocsSidebar from '@/components/docs/sidebar/DocsSidebar';

export interface DocsPageLayoutProps {
  title: string;
  description: string;
  url: string;
  children: ReactNode;
};

const DocsPageLayout = ({ title, description, url, children }: DocsPageLayoutProps) => {
  return (
    <PageLayout>
      <Meta title={title} description={description} url={url} />

      <section className="block md:flex gap-6 mx-4 md:mx-0">
        <DocsSidebar />

        <article className="flex-1">
          <Box>
            <div className="content">
              {children}
            </div>
          </Box>
        </article>
      </section>
    </PageLayout>
  );
};

export default DocsPageLayout;
