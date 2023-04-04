import { ReactNode } from 'react';

import TheHeader from '@/components/common/the-header/TheHeader';
import TheFooter from '@/components/common/the-footer/TheFooter';

import { useTranslation } from 'react-i18next';

const PageLayout = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation('common');

  return (
    <section className="container px-3">
      <a href="#content" className="skip-to-content">
        { t('skip-to-content') }
      </a>

      <TheHeader />

      <main id="content">
        {children}
      </main>

      <TheFooter />
    </section>
  );
};

export default PageLayout;
