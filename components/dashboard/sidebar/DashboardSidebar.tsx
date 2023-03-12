import { signOut } from 'next-auth/client';

import { User } from '@/db/models/auth/User';

import { LogOut } from 'react-feather';

import UserProfilePicture, { UserProfilePictureSize } from '../common/UserProfilePicture';
import DashboardNavigation from '../common/navigation/DashboardNavigation';

export interface DashboardSidebarProps {
  user: User;
};

const DashboardSidebar = ({ user }: DashboardSidebarProps) => {
  const handleSignoutClick = async () => await signOut();

  return (
    <aside className="overflow-y-auto flex flex-col w-64 bg-secondary shadow-lg py-6 px-5">
      <div className="text-accent text-2xl text-center mb-5">
        Project Raccoon
      </div>

      <div className="flex-1">
        <DashboardNavigation />
      </div>

      <div className="flex gap-2 items-center">
        <UserProfilePicture size={UserProfilePictureSize.SMALL} user={user} />

        <div className="flex-1 truncate" title={user.name}>
          {user.name}
        </div>

        <div>
          <LogOut onClick={handleSignoutClick} className="cursor-pointer" />
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
