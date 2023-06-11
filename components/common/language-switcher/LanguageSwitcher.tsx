import hu from '@/assets/flags/hu.svg';
import en from '@/assets/flags/en.svg';

import { useRouter } from 'next/router';
import Link from 'next/link';

const LanguageSwitcher = () => {
  const router = useRouter();

  return (
    <div className="flex gap-1">
      {router.locale !== 'hu' && (
        <Link
          href={{ pathname: router.pathname, query: router.query }}
          locale="hu"
        >
          <img className="h-3" src={hu.src} alt="Magyar" title="Magyar" />
        </Link>
      )}

      {router.locale !== 'en' && (
        <Link
          href={{ pathname: router.pathname, query: router.query }}
          locale="en"
        >
          <img className="h-3" src={en.src} alt="English" title="English" />
        </Link>
      )}
    </div>
  );
};

export default LanguageSwitcher;
