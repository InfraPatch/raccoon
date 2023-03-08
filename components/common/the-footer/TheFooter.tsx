import { useTranslation } from 'next-i18next';

import Link from 'next/link';
import ThemeSwitcher from '../theme-switcher/ThemeSwitcher';

const TheFooter = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="flex justify-between text-xs py-10 mt-10 border-t-2 border-accent">
      <div>
        { t('copyright') }
      </div>

      <nav className="flex items-center gap-10">
        <Link href="/terms"><a>{ t('tos') }</a></Link>
        <Link href="/privacy"><a>{ t('privacy') }</a></Link>
        <Link href="/contact"><a>{t('contact')}</a></Link>

        <ThemeSwitcher />
      </nav>
    </footer>
  );
};

export default TheFooter;
