import { ReactNode } from 'react';

import Box from '@/components/common/box/Box';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

export interface HomeBoxProps {
  illustration: ReactNode;
  step: number;
  reverse?: boolean;
  title: string;
  description: string;
};

const HomeBox = ({ illustration, step, reverse, title, description }: HomeBoxProps) => {
  const containerClassNames = clsx('sm:flex', 'items-center', 'gap-3', 'py-4', {
    'flex-row-reverse': reverse
  });

  const textClassNames = clsx('flex-1', 'px-4', 'py-3', {
    'sm:text-right': reverse
  });

  const { t } = useTranslation('home');

  return (
    <Box>
      <section className={containerClassNames}>
        <div className="flex-1 mb-4 sm:mb-0">
          {illustration}
        </div>

        <div className={textClassNames}>
          <div className="text-accent text-2xl font-bold">
            {t('step', { step })}
          </div>

          <h2 className="text-4xl sm:text-5xl font-normal mb-5">
            {title}
          </h2>

          <div className="text-xl">
            {description}
          </div>
        </div>
      </section>
    </Box>
  );
};

export default HomeBox;
