import { ReactNode } from 'react';

import TheHeader from '@/components/common/the-header/TheHeader';
import TheFooter from '@/components/common/the-footer/TheFooter';

import { useTranslation } from 'next-i18next';

export interface AuthPageLayoutProps {
  children: ReactNode;
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-primary">
      <a href="#content" className="skip-to-content">
        {t('skip-to-content')}
      </a>

      <section className="container" id="content">
        <TheHeader />

        <div className="max-w-4xl bg-secondary rounded shadow-md mx-auto my-8 px-8 py-6 md:flex items-center">
          <div className="flex-1">{children}</div>
        </div>

        <TheFooter />
      </section>
    </div>
  );
};

export default AuthPageLayout;
