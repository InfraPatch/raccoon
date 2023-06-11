import { useTranslation } from 'next-i18next';

import Link from 'next/link';
import LanguageSwitcher from '../language-switcher/LanguageSwitcher';
import ThemeSwitcher from '../theme-switcher/ThemeSwitcher';

const TheFooter = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="block md:flex justify-between text-xs px-4 md:px-0 py-10 mt-10 border-t-2 border-accent text-center md:text-left">
      <div className="mb-4 md:mb-0">{t('copyright')}</div>

      <nav className="block md:flex items-center gap-10">
        <Link href="/terms" className="block md:inline-block py-2 md:py-0">
          {t('tos')}
        </Link>
        <Link href="/privacy" className="block md:inline-block py-2 md:py-0">
          {t('privacy')}
        </Link>
        <Link href="/contact" className="block md:inline-block py-2 md:py-0">
          {t('contact')}
        </Link>

        <div className="inline-block mx-auto my-4 md:my-0">
          <div className="flex justify-center items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </footer>
  );
};

export default TheFooter;
