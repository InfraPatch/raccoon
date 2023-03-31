import { signOut } from 'next-auth/client';

import { User } from '@/db/models/auth/User';

import { Book, LogOut, Star, Layout, Edit3, Home, UserCheck, User as UserIcon } from 'react-feather';

import UserProfilePicture, { UserProfilePictureSize } from '../common/UserProfilePicture';
import DashboardNavigation, { NavigationSeparator } from '../common/navigation/DashboardNavigation';
import { NavigationLinkProps } from '@/components/dashboard/common/navigation/NavigationLink';
import { NavigationTitleProps } from '@/components/dashboard/common/navigation/NavigationTitle';
import ThemeSwitcher from '@/components/common/theme-switcher/ThemeSwitcher';
import LanguageSwitcher from '@/components/common/language-switcher/LanguageSwitcher';

import { useTranslation } from 'next-i18next';

import buildUrl from '@/lib/buildUrl';

import Link from 'next/link';

export interface DashboardSidebarProps {
  user: User;
};

const SEPARATOR: NavigationSeparator = 0;

const DashboardSidebar = ({ user }: DashboardSidebarProps) => {
  const handleSignoutClick = async () => await signOut({ callbackUrl: buildUrl('/') });
  const { t } = useTranslation('dashboard');

  const navigation: ( NavigationLinkProps | NavigationTitleProps | NavigationSeparator )[] = [
    {
      href: '/dashboard',
      icon: <Home />,
      label: t('pages.home')
    },

    {
      href: '/dashboard/contracts/new',
      icon: <Star />,
      label: t('pages.new-user-contract')
    },

    {
      href: '/dashboard/contracts',
      icon: <Edit3 />,
      label: t('pages.my-contracts')
    },

    {
      href: '/dashboard/settings',
      icon: <UserIcon />,
      label: t('pages.user-settings')
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
      href: '/dashboard/admin/make-lawyer',
      icon: <UserCheck />,
      label: t('pages.make-lawyer')
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
    <aside className="overflow-y-auto flex flex-col md:w-64 bg-secondary shadow-lg py-6 px-5 h-full">
      <Link href="/">
        <a>
          <div className="text-accent text-2xl text-center mb-5">
            Project Raccoon
          </div>
        </a>
      </Link>

      <div className="flex-1 mb-4">
        <DashboardNavigation items={navigation} />
      </div>

      <div>
        <div className="flex justify-center items-center gap-3 mb-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>

        <hr />

        <div className="flex gap-2 items-center">
          <UserProfilePicture size={UserProfilePictureSize.SMALL} user={user} />

          <div className="flex-1 truncate" title={user.name}>
            <span>{user.name}</span>

            {(user.isAdmin && user.isLawyer &&
              <div>
                <span className="text-sm text-danger">{t('pages.admin')}</span>
                <span> | </span>
                <span className="text-sm text-info">{t('pages.lawyer')}</span>
              </div>)
              || (user.isAdmin && <p className="text-sm text-danger">{t('pages.admin')}</p>)
              || (user.isLawyer && <p className="text-sm text-info">{t('pages.lawyer')}</p>)
            }
          </div>
          <div>
            <LogOut onClick={handleSignoutClick} className="cursor-pointer" />
          </div>
        </div>
      </div>

    </aside>
  );
};

export default DashboardSidebar;
