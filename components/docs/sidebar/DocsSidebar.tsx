import Box from '@/components/common/box/Box';
import DocsNavigation, {
  NavigationSeparator,
} from '../common/navigation/DocsNavigation';
import { NavigationLinkProps } from '../common/navigation/NavigationLink';

import { useTranslation } from 'next-i18next';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const SEPARATOR: NavigationSeparator = 0;

const DocsSidebar = () => {
  const { t } = useTranslation('docs');
  const [currentUser, _] = useCurrentUser();

  const navigation: (NavigationLinkProps | NavigationSeparator)[] = [
    {
      href: '/docs/getting-started',
      label: t('getting-started'),
    },
  ];

  navigation.push({
    href: '/docs/properties',
    label: t('properties'),
  });

  navigation.push({
    href: '/docs/contracts',
    label: t('contracts'),
  });

  if (currentUser?.isAdmin) {
    navigation.push(SEPARATOR);

    navigation.push({
      href: '/docs/admin/getting-started',
      label: t('admin.getting-started'),
    });

    navigation.push({
      href: '/docs/admin/templates',
      label: t('admin.templates'),
    });

    navigation.push({
      href: '/docs/admin/properties',
      label: t('admin.properties'),
    });
  }

  return (
    <div className="md:w-80">
      <Box>
        <DocsNavigation items={navigation} />
      </Box>
    </div>
  );
};

export default DocsSidebar;
