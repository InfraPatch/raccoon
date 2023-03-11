import { HTMLAttributes } from 'react';

import HomeHero from '@/assets/images/home-hero.svg';

import PrivacyPolicy from '@/assets/images/privacy-policy.svg';
import Terms from '@/assets/images/terms.svg';
import Contact from '@/assets/images/contact.svg';

import NotFound from '@/assets/images/not-found.svg';
import ServerError from '@/assets/images/server-error.svg';

import clsx from 'clsx';

type IllustrationWrapperProps = {
  image: string;
  center?: boolean;
} & HTMLAttributes<HTMLDivElement>;

type P = { center?: boolean } & HTMLAttributes<HTMLDivElement>;

const IllustrationWrapper = ({ image, center, ...props }: IllustrationWrapperProps) => {
  return (
    <div className={clsx({ 'text-center': center })} {...props}>
      <img src={image} />
    </div>
  );
};

const Illustration = {
  HomeHero: (props: P) => <IllustrationWrapper image={HomeHero} {...props} />,

  PrivacyPolicy: (props: P) => <IllustrationWrapper image={PrivacyPolicy} {...props} />,
  Terms: (props: P) => <IllustrationWrapper image={Terms} {...props} />,
  Contact: (props: P) => <IllustrationWrapper image={Contact} {...props} />,

  NotFound: (props: P) => <IllustrationWrapper image={NotFound} {...props} />,
  ServerError: (props: P) => <IllustrationWrapper image={ServerError} {...props} />
};

export default Illustration;
