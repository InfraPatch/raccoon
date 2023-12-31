import { useState } from 'react';
import { User, IUser } from '@/db/models/auth/User';

import clsx from 'clsx';

export enum UserProfilePictureSize {
  SMALL,
  MEDIUM,
  LARGE,
}

export interface UserProfilePictureProps {
  user: User | IUser;
  size?: UserProfilePictureSize;
}

const UserProfilePicture = ({ user, size }: UserProfilePictureProps) => {
  const finalSize = size ?? UserProfilePictureSize.MEDIUM;
  const [imageAvailable, setImageAvailable] = useState<boolean>(true);

  const userMonogram = user.name
    .split(' ')
    .filter((component) => component.length > 2)
    .map((component) => component[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const classNames = clsx(
    {
      'w-10': finalSize === UserProfilePictureSize.SMALL,
      'h-10': finalSize === UserProfilePictureSize.SMALL,

      'w-12': finalSize === UserProfilePictureSize.MEDIUM,
      'h-12': finalSize === UserProfilePictureSize.MEDIUM,

      'w-16': finalSize === UserProfilePictureSize.LARGE,
      'h-16': finalSize === UserProfilePictureSize.MEDIUM,
    },
    'flex',
    'flex-col',
    'justify-center',
    'rounded-full',
    'bg-accent-hover',
    'text-white',
    'text-center',
    'select-none',
  );

  return (
    <div className={classNames}>
      {(imageAvailable && user.image && (
        <span>
          <img
            src={user.image}
            alt={userMonogram}
            className="w-full h-full rounded-full"
            onError={() => setImageAvailable(false)}
          />
        </span>
      )) || <span>{userMonogram}</span>}
    </div>
  );
};

export default UserProfilePicture;
