import { ReactNode } from 'react';

import TheHeader from '@/components/common/the-header/TheHeader';
import TheFooter from '@/components/common/the-footer/TheFooter';

import SocialLogin, { AllowedProvider } from '@/components/auth/SocialLogin';

export interface AuthPageLayoutProps {
  providers: AllowedProvider[];
  children: ReactNode;
};

const AuthPageLayout = ({ providers, children }: AuthPageLayoutProps) => {
  return (
    <div className="bg-primary">
      <section className="container">
        <TheHeader />

        <div className="max-w-4xl bg-secondary rounded shadow-md mx-auto my-8 px-8 py-6 flex items-center">
          <div className="flex-1">
            {children}
          </div>

          <div className="flex-1 text-center">
            <SocialLogin providers={providers} />
          </div>
        </div>

        <TheFooter />
      </section>
    </div>
  );
};

export default AuthPageLayout;
