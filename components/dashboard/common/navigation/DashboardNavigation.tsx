import NavigationLink, { NavigationLinkProps } from '@/components/dashboard/common/navigation/NavigationLink';

export type NavigationSeparator = number;

export interface DashboardNavigationProps {
  items: ( NavigationLinkProps | NavigationSeparator )[];
};

const DashboardNavigation = ({ items }: DashboardNavigationProps) => {
  return (
    <nav>
      {items.map((item, idx) => {
        if (typeof item === 'number') {
          return <hr key={idx} />;
        }

        return <NavigationLink {...item} key={idx} />;
      })}
    </nav>
  );
};

export default DashboardNavigation;
