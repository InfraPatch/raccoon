import clsx from 'clsx';
import { useSession } from 'next-auth/client';
import { useTranslation } from 'next-i18next';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Menu, X } from 'react-feather';

import Button, { ButtonSize } from '../button/Button';
import HeaderLink from './HeaderLink';

const TheHeader = () => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const [ session, _ ] = useSession();

  const [ menuOpen, setMenuOpen ] = useState(false);

  const handleDashboardClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const toggleMenu = () => setMenuOpen(currentState => !currentState);

  useEffect(() => {
    setMenuOpen(false);
  }, [ router.pathname ]);

  const navigationWrapperClasses = clsx('md:block', { hidden: !menuOpen });

  return (
    <header className="block w-full md:flex justify-between items-center p-3 md:p-0 md:py-8 mb-4 md:mb-0">
      <div className="text-accent text-2xl mb-3 md:mb-0">
        Project Raccoon
      </div>

      <div className={navigationWrapperClasses}>
        <nav className="md:flex items-center gap-1">
          <div className="text-center md:mr-4 md:text-left">
            <Link href="/">
              <HeaderLink>{ t('home') }</HeaderLink>
            </Link>

            <Link href="/docs">
              <HeaderLink>{ t('how-it-works') }</HeaderLink>
            </Link>

            <Link href="/contact">
              <HeaderLink>{ t('contact') }</HeaderLink>
            </Link>
          </div>

          <div className="text-center">
            <Button size={ButtonSize.SMALL} onClick={handleDashboardClick} className="text-center">
              { t(session ? 'dashboard' : 'log-in') }
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
