import clsx from 'clsx';

import { IUser } from '@/db/models/auth/User';
import UserProfilePicture, {
  UserProfilePictureSize,
} from '@/components/dashboard/common/UserProfilePicture';

export interface ChatBubbleProps {
  message: string;
  user: IUser;
  isSelf: boolean;
}

const ChatBubble = ({ message, user, isSelf }: ChatBubbleProps) => {
  return (
    <div className={clsx('flex gap-2', { 'flex-row-reverse': isSelf })}>
      <div className="pt-5">
        <UserProfilePicture user={user} size={UserProfilePictureSize.SMALL} />
      </div>

      <div className="flex flex-col gap-1">
        <div
          className={clsx('opacity-50 text-xs font-bold', {
            'text-right': isSelf,
          })}
        >
          {user.name ?? 'User'}
        </div>

        <div
          className={clsx(
            {
              'bg-field': !isSelf,
              'bg-accent': isSelf,
              'text-white': isSelf,
            },
            'px-4',
            'py-2',
            'rounded-lg',
            'shadow',
          )}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
