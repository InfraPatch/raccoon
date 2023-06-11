import { HTMLAttributes } from 'react';

import HomeHero from '@/assets/images/home-hero.svg';
import Forms from '@/assets/images/forms.svg';
import Download from '@/assets/images/download.svg';
import OnlineCollaboration from '@/assets/images/online-collaboration.svg';

import Contract from '@/assets/images/contract.svg';
import Agreement from '@/assets/images/agreement.svg';
import Profile from '@/assets/images/profile.svg';
import Properties from '@/assets/images/properties.svg';

import PrivacyPolicy from '@/assets/images/privacy-policy.svg';
import Terms from '@/assets/images/terms.svg';
import Contact from '@/assets/images/contact.svg';

import NotFound from '@/assets/images/not-found.svg';
import ServerError from '@/assets/images/server-error.svg';

import ZDS from '@/assets/images/zds.svg';

import clsx from 'clsx';

type IllustrationWrapperProps = {
  image: string;
  center?: boolean;
} & HTMLAttributes<HTMLDivElement>;

type P = { center?: boolean } & HTMLAttributes<HTMLDivElement>;

const IllustrationWrapper = ({
  image,
  center,
  ...props
}: IllustrationWrapperProps) => {
  return (
    <div className={clsx({ 'text-center': center })} {...props}>
      <img src={image} className="mx-auto max-h-full" />
    </div>
  );
};

const Illustration = {
  HomeHero: (props: P) => (
    <IllustrationWrapper image={HomeHero.src} {...props} />
  ),
  Forms: (props: P) => <IllustrationWrapper image={Forms.src} {...props} />,
  Download: (props: P) => (
    <IllustrationWrapper image={Download.src} {...props} />
  ),
  OnlineCollaboration: (props: P) => (
    <IllustrationWrapper image={OnlineCollaboration.src} {...props} />
  ),

  Contract: (props: P) => (
    <IllustrationWrapper image={Contract.src} {...props} />
  ),
  Agreement: (props: P) => (
    <IllustrationWrapper image={Agreement.src} {...props} />
  ),
  Profile: (props: P) => <IllustrationWrapper image={Profile.src} {...props} />,
  Properties: (props: P) => (
    <IllustrationWrapper image={Properties.src} {...props} />
  ),

  PrivacyPolicy: (props: P) => (
    <IllustrationWrapper image={PrivacyPolicy.src} {...props} />
  ),
  Terms: (props: P) => <IllustrationWrapper image={Terms.src} {...props} />,
  Contact: (props: P) => <IllustrationWrapper image={Contact.src} {...props} />,

  NotFound: (props: P) => (
    <IllustrationWrapper image={NotFound.src} {...props} />
  ),
  ServerError: (props: P) => (
    <IllustrationWrapper image={ServerError.src} {...props} />
  ),

  ZDS: (props: P) => <IllustrationWrapper image={ZDS.src} {...props} />,
};

export default Illustration;
