import { useSession } from 'next-auth/client';
import { useTranslation } from 'next-i18next';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Button, { ButtonSize } from '../button/Button';
import HeaderLink from './HeaderLink';

const TheHeader = () => {
  const { t } = useTranslation('common');

  const router = useRouter();
  const [ session, _ ] = useSession();

  const handleDashboardClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="w-full flex justify-between items-center py-8">
      <div className="text-accent text-2xl">
        Project Raccoon
      </div>

      <nav className="flex items-center gap-1">
        <div className="mr-10">
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

        <Button size={ButtonSize.SMALL} onClick={handleDashboardClick}>
          { t(session ? 'dashboard' : 'log-in') }
        </Button>
      </nav>
    </header>
  );
};

export default TheHeader;
