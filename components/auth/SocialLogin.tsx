import { Facebook, Twitter } from 'react-feather';
import { Google } from '@/components/icons/Google';

import Button, { ButtonSize } from '../common/button/Button';
import { useTranslation } from 'react-i18next';
import { signIn } from 'next-auth/client';

export type AllowedProvider = 'credentials' | 'facebook' | 'twitter' | 'google';

export interface SocialLoginProps {
  providers: AllowedProvider[];
};

const SocialLogin = ({ providers }: SocialLoginProps) => {
  const { t } = useTranslation('auth');

  return (
    <div>
      <div className="mb-5">
        { t('social-network-prompt') }
      </div>

      {providers.includes('facebook') && (
        <Button
          size={ButtonSize.MEDIUM}
          className="mb-4 bg-facebook hover:bg-facebook-hover"
          onClick={() => signIn('facebook')}
        >
          <Facebook className="inline mr-2" />
          { t('log-in-via.facebook') }
        </Button>
      )}

      {providers.includes('twitter') && (
        <Button
          size={ButtonSize.MEDIUM}
          className="mb-4 bg-twitter hover:bg-twitter-hover"
          onClick={() => signIn('twitter')}
        >
          <Twitter className="inline mr-2" />
          { t('log-in-via.twitter') }
        </Button>
      )}

      {providers.includes('google') && (
        <Button
          size={ButtonSize.MEDIUM}
          className="bg-google hover:bg-google-hover"
          onClick={() => signIn('google')}
        >
          <Google className="inline mr-2" />
          { t('log-in-via.google') }
        </Button>
      )}
    </div>
  );
};

export default SocialLogin;
