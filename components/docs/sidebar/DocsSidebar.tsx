import Box from '@/components/common/box/Box';
import DocsNavigation, { NavigationSeparator } from '../common/navigation/DocsNavigation';
import { NavigationLinkProps } from '../common/navigation/NavigationLink';

import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/client';

const SEPARATOR: NavigationSeparator = 0;

const DocsSidebar = () => {
  const { t } = useTranslation('docs');
  const [ session, _ ] = useSession();

  const navigation: ( NavigationLinkProps | NavigationSeparator )[] = [
    {
      href: '/docs/getting-started',
      label: t('getting-started')
    }
  ];

  if (session?.user?.isAdmin) {
    navigation.push(SEPARATOR);

    navigation.push({
      href: '/docs/admin/getting-started',
      label: t('admin.getting-started')
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
