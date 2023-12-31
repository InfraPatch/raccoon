import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Menu, X } from 'react-feather';

import Button, { ButtonSize } from '../button/Button';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const TheHeader = () => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const [currentUser, _] = useCurrentUser();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleDashboardClick = () => {
    if (currentUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const toggleMenu = () => setMenuOpen((currentState) => !currentState);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  const navigationWrapperClasses = clsx('md:block', { hidden: !menuOpen });

  return (
    <header className="block w-full md:flex justify-between items-center p-3 md:p-0 md:py-8 mb-4 md:mb-0">
      <Link href="/">
        <div className="text-accent text-2xl mb-3 md:mb-0">Project Raccoon</div>
      </Link>

      <div className={navigationWrapperClasses}>
        <nav className="md:flex items-center gap-1">
          <div className="text-center md:mr-4 md:text-left">
            <Link
              href="/"
              className="block md:inline-block px-4 lg:px-10 py-2 text-foreground hover:bg-secondary rounded-3xl cursor-pointer mb-2 md:mb-0"
            >
              {t('home')}
            </Link>

            <Link
              href="/docs"
              className="block md:inline-block px-4 lg:px-10 py-2 text-foreground hover:bg-secondary rounded-3xl cursor-pointer mb-2 md:mb-0"
            >
              {t('how-it-works')}
            </Link>

            <Link
              href="/contact"
              className="block md:inline-block px-4 lg:px-10 py-2 text-foreground hover:bg-secondary rounded-3xl cursor-pointer mb-2 md:mb-0"
            >
              {t('contact')}
            </Link>
          </div>

          <div className="text-center">
            <Button
              size={ButtonSize.SMALL}
              onClick={handleDashboardClick}
              className="text-center"
            >
              {t(currentUser ? 'dashboard' : 'log-in')}
            </Button>
          </div>
        </nav>
      </div>

      <div
        className="absolute top-0 right-0 p-4 block md:hidden"
        onClick={toggleMenu}
      >
        {!menuOpen && <Menu />}
        {menuOpen && <X />}
      </div>
    </header>
  );
};

export default TheHeader;
