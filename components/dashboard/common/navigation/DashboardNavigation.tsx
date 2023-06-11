import NavigationLink, {
  NavigationLinkProps,
} from '@/components/dashboard/common/navigation/NavigationLink';
import NavigationTitle, {
  NavigationTitleProps,
} from '@/components/dashboard/common/navigation/NavigationTitle';

export type NavigationSeparator = number;

export interface DashboardNavigationProps {
  items: (NavigationLinkProps | NavigationTitleProps | NavigationSeparator)[];
}

const DashboardNavigation = ({ items }: DashboardNavigationProps) => {
  return (
    <nav>
      {items.map((item, idx) => {
        if (typeof item === 'number') {
          return <hr key={idx} />;
        }

        if ('title' in item) {
          return <NavigationTitle {...item} key={idx} />;
        }

        return <NavigationLink {...item} key={idx} />;
      })}
    </nav>
  );
};

export default DashboardNavigation;
