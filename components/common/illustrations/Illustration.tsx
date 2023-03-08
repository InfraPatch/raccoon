import HomeHero from '@/assets/images/home-hero.svg';
import { HTMLAttributes } from 'react';

type IllustrationWrapperProps = { image: string } & HTMLAttributes<HTMLDivElement>;

const IllustrationWrapper = ({ image, ...props }: IllustrationWrapperProps) => {
  return (
    <div {...props}>
      <img src={image} />
    </div>
  );
};

const Illustration = {
  HomeHero: (props: HTMLAttributes<HTMLDivElement> ) => <IllustrationWrapper image={HomeHero} {...props} />
};

export default Illustration;
