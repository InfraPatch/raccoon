import NavigationLink, { NavigationLinkProps } from '@/components/dashboard/common/navigation/NavigationLink';

import { Edit3, Home } from 'react-feather';

const DashboardNavigation = () => {
  const items: NavigationLinkProps[] = [
    {
      href: '/dashboard',
      icon: <Home />,
      label: 'Home'
    },

    {
      href: '/dashboard/contracts',
      icon: <Edit3 />,
      label: 'My Contracts'
    }
  ];

  return (
    <nav>
      {items.map((item, idx) => <NavigationLink {...item} key={idx} />)}
    </nav>
  );
};

export default DashboardNavigation;
