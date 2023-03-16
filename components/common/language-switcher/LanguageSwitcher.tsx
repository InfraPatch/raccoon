import hu from '@/assets/flags/hu.svg';
import en from '@/assets/flags/en.svg';

import { useRouter } from 'next/router';
import Link from 'next/link';

const LanguageSwitcher = () => {
  const router = useRouter();

  return (
    <div className="flex gap-1">
      {router.locale !== 'hu' && (<Link  href={{ pathname: router.pathname, query: router.query }} locale="hu">
        <a>
          <img className="h-3" src={hu} alt="Magyar" title="Magyar" />
        </a>
      </Link>)}

      {router.locale !== 'en' && (<Link href={{ pathname: router.pathname, query: router.query }} locale="en">
        <a>
          <img className="h-3" src={en} alt="English" title="English" />
        </a>
      </Link>)}
    </div>
  );
};

export default LanguageSwitcher;
