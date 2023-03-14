import { ReactNode } from 'react';

import TheHeader from '@/components/common/the-header/TheHeader';
import TheFooter from '@/components/common/the-footer/TheFooter';
import clsx from 'clsx';

export interface ContentPageLayoutProps {
  title?: string;
  subtitle?: string;
  narrow?: boolean;
  children: ReactNode;
};

const ContentPageLayout = ({ title, subtitle, narrow, children }: ContentPageLayoutProps) => {
  const wrapperClasses = clsx('w-full', 'mx-auto', 'px-4', 'md:px-0', {
    'max-w-6xl': narrow
  });

  return (
    <div className="bg-secondary">
      <section className="container">
        <TheHeader />

        <div className={wrapperClasses}>
          {title && (
            <div className="text-center px-4 py-10">
              <h1 className="text-6xl text-accent">{title}</h1>
              {subtitle && <h2 className="text-2xl mt-5 font-normal text-accent">{subtitle}</h2>}
            </div>
          )}

          <div className="content text-lg">
            {children}
          </div>
        </div>

        <TheFooter />
      </section>
    </div>
  );
};

export default ContentPageLayout;
