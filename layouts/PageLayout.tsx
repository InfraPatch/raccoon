import { ReactNode } from 'react';

import TheHeader from '@/components/common/the-header/TheHeader';
import TheFooter from '@/components/common/the-footer/TheFooter';

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="container">
      <TheHeader />
      {children}
      <TheFooter />
    </section>
  );
};

export default PageLayout;
