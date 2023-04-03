import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import DashboardSidebar from '@/components/dashboard/sidebar/DashboardSidebar';
import { Menu, X } from 'react-feather';

import clsx from 'clsx';

export interface DashboardLayoutProps {
  children: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [ sidebarOpen, setSidebarOpen ] = useState(true);
  const { t } = useTranslation('common');

  const handleHamburgerClick = () => setSidebarOpen(currentState => !currentState);

  const sidebarWrapperClassnames = clsx(
    'md:block',
    'md:h-full',
    'fixed', 'top-0', 'left-0', 'bottom-0', 'md:static',
    'transition-[left]', 'duration-200', 'ease-linear',
    {
      'left-[-100vw]': !sidebarOpen,
      'left-0': sidebarOpen
    }
  );

  const router = useRouter();

  useEffect(() => {
    setSidebarOpen(false);
  }, [ router.pathname ]);

  return (
    <section className="md:flex h-screen">
      <a href="#content" className="skip-to-content">
        { t('skip-to-content') }
      </a>

      <div className={sidebarWrapperClassnames}>
        <DashboardSidebar />
      </div>

      <div className="flex-1 overflow-y-auto py-10 px-4 md:px-14" id="content">
        {children}
      </div>

      <div className="fixed bottom-0 right-0 p-4 bg-secondary md:hidden" onClick={handleHamburgerClick}>
        {!sidebarOpen && <Menu />}
        {sidebarOpen && <X />}
      </div>
    </section>
  );
};

export default DashboardLayout;
