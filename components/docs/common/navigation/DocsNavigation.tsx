import NavigationLink, {
  NavigationLinkProps,
} from '@/components/docs/common/navigation/NavigationLink';

export type NavigationSeparator = number;

export interface DocsNavigationProps {
  items: (NavigationLinkProps | NavigationSeparator)[];
}

const DocsNavigation = ({ items }: DocsNavigationProps) => {
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

export default DocsNavigation;
