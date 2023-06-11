import Illustration from '@/components/common/illustrations/Illustration';

import { useTranslation } from 'next-i18next';

const ZeroDataState = () => {
  const { t } = useTranslation('common');

  return (
    <div className="text-center my-4">
      <Illustration.ZDS className="max-w-sm mx-auto mb-4" />

      <div className="text-xl">{t('no-data')}</div>
    </div>
  );
};

export default ZeroDataState;
