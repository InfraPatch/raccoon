import { useState, useEffect } from 'react';

import Link from 'next/link';
import Button, { ButtonSize } from '../button/Button';

import { useTranslation } from 'next-i18next';

const CookieConsent = () => {
  const { t } = useTranslation('common');
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('cookies-accepted') !== 'yes') {
      setAccepted(false);
    }
  }, []);

  const acceptCookies = () => {
    setAccepted(true);
    localStorage.setItem('cookies-accepted', 'yes');
  };

  return (
    <div>
      {!accepted && (
        <div
          className="fixed left-0 right-0 bottom-0 bg-secondary px-4 py-3"
          style={{ boxShadow: '-10px 5px 15px rgba(0, 0, 0, .8)' }}
        >
          <div className="sm:flex max-w-5xl mx-auto justify-between items-center gap-3">
            <div className="sm:text-left text-center">
              {t('cookie-consent.text')}{' '}
              <Link href="/privacy">
                {t('cookie-consent.privacy-policy-link')}
              </Link>
              .
            </div>

            <div className="sm:py-0 py-4 sm:text-left text-center">
              <Button size={ButtonSize.SMALL} onClick={acceptCookies}>
                {t('cookie-consent.ok')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
