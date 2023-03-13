import { signOut } from 'next-auth/client';

import { User } from '@/db/models/auth/User';

import { Book, LogOut, Star, Layout } from 'react-feather';

import UserProfilePicture, { UserProfilePictureSize } from '../common/UserProfilePicture';
import DashboardNavigation, { NavigationSeparator } from '../common/navigation/DashboardNavigation';
import { NavigationLinkProps } from '@/components/dashboard/common/navigation/NavigationLink';
import { NavigationTitleProps } from '@/components/dashboard/common/navigation/NavigationTitle';
import { Edit3, Home } from 'react-feather';

import { useTranslation } from 'next-i18next';

export interface DashboardSidebarProps {
  user: User;
};

const SEPARATOR: NavigationSeparator = 0;

const DashboardSidebar = ({ user }: DashboardSidebarProps) => {
  const handleSignoutClick = async () => await signOut();
  const { t } = useTranslation('dashboard');

  const navigation: ( NavigationLinkProps | NavigationTitleProps | NavigationSeparator )[] = [
    {
      href: '/dashboard',
      icon: <Home />,
      label: t('pages.home')
    },

    {
      href: '/dashboard/contracts',
      icon: <Edit3 />,
      label: t('pages.my-contracts')
    },

    {
      href: '/docs',
      icon: <Book />,
      label: t('pages.docs'),
      newtab: true
    }
  ];

  if (user.isAdmin) {
    navigation.push(SEPARATOR);

    navigation.push({
      title: t('pages.admin')
    });

    navigation.push(SEPARATOR);

    navigation.push({
      href: '/dashboard/admin/make-admin',
      icon: <Star />,
      label: t('pages.make-admin')
    });

    navigation.push({
      href: '/docs/admin',
      icon: <Book />,
      label: t('pages.admin-docs'),
      newtab: true
    });

    navigation.push(SEPARATOR);

    navigation.push({
      href: '/dashboard/admin/new-contract',
      icon: <Star />,
      label: t('pages.new-contract')
    });

    navigation.push({
      href: '/dashboard/admin/contracts',
      icon: <Layout />,
      label: t('pages.contracts')
    });
  }

  return (
    <aside className="overflow-y-auto flex flex-col w-64 bg-secondary shadow-lg py-6 px-5">
      <div className="text-accent text-2xl text-center mb-5">
        Project Raccoon
      </div>

      <div className="flex-1">
        <DashboardNavigation items={navigation} />
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
