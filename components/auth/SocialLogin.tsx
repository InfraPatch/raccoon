import { Facebook, Twitter } from 'react-feather';
import { Google } from '@/components/icons/Google';

import Button, { ButtonSize } from '../common/button/Button';
import { useTranslation } from 'react-i18next';

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

      <Button size={ButtonSize.MEDIUM} className="mb-4">
        <Facebook className="inline mr-2" />
        { t('log-in-via.facebook') }
      </Button>

      <Button size={ButtonSize.MEDIUM} className="mb-4">
        <Twitter className="inline mr-2" />
        { t('log-in-via.twitter') }
      </Button>

      <Button size={ButtonSize.MEDIUM}>
        <Google className="inline mr-2" />
        { t('log-in-via.google') }
      </Button>
    </div>
  );
};

export default SocialLogin;
