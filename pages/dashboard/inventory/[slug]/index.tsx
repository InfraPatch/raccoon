import DashboardLayout from '@/layouts/DashboardLayout';

import { IFilledItem } from '@/db/models/items/FilledItem';
import { IItem } from '@/db/models/items/Item';

import Box from '@/components/common/box/Box';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

import apiService from '@/services/apis';
import FilledItemList from '@/components/dashboard/filled-item-list/FilledItemList';
import ZeroDataState from '@/components/common/zero-data-state/ZeroDataState';
import Meta from '@/components/common/Meta';

export interface DashboardFilledItemsPageProps {
  slug: string;
};

const DashboardFilledItemsPage = ({ slug }: DashboardFilledItemsPageProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ searchQuery, setSearchQuery ] = useState('');
  const [ item, setItem ] = useState<IItem | null>();
  const [ filledItems, setFilledItems ] = useState<IFilledItem[] | null>(null);
  const [ filteredFilledItems, setFilteredFilledItems ] = useState<IFilledItem[] | null>(null);
  const [ error, setError ] = useState('');

  const loadItems = async () => {
    setSearchQuery('');
    setItem(null);
    setFilledItems(null);
    setError('');

    try {
      const itemRes = await apiService.items.getItem({ slug });
      setItem(itemRes.item);

      const filledItemsRes = await apiService.filledItems.listFilledItems(slug);
      setFilledItems(filledItemsRes.filledItems);
      setFilteredFilledItems(filledItemsRes.filledItems);
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          setError(t(`errors:items.${message}`));
          return;
        }
      }

      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (filledItems === null) {
      return;
    }

    const newFilteredFilledItems = filledItems
      .slice(0)
      .filter(item => item.friendlyName.toLowerCase().trim().includes(searchQuery.toLowerCase().trim()));

    setFilteredFilledItems(newFilteredFilledItems);
  }, [ searchQuery ]);

  return (
    <DashboardLayout>
      <Meta
        title={`${item ? item.friendlyName : '...'} - ${t('dashboard:pages.my-items')}`}
        url={`/dashboard/inventory/${slug}`}
      />

      {item && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-normal text-2xl flex-1">
            {item.friendlyName}
          </h1>

          <div className="text-right flex-1">
            <div className="form-field max-w-sm ml-auto">
              <input
                id="search"
                type="search"
                name="search"
                onChange={e => setSearchQuery(e.currentTarget.value)}
                disabled={filteredFilledItems === null}
                placeholder={t('dashboard:items.list.search')}
                className="w-full border-foreground"
              />
            </div>
          </div>
        </div>
      )}

      {filteredFilledItems && filteredFilledItems.length === 0 && (
        <Columns>
          <Column>
            <Box>
              <ZeroDataState />
            </Box>
          </Column>
          <Column />
        </Columns>
      )}

      {filteredFilledItems && filteredFilledItems.length > 0 && (
        <FilledItemList filledItems={filteredFilledItems} slug={slug} />
      )}

      {!filteredFilledItems && !error && <Loading />}

      {error && error.length > 0 && (
        <DangerMessage>
          {error}
        </DangerMessage>
      )}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query, locale }) => {
  const session = await getSession({ req });

  const { slug } = query;

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  return {
    props: {
      slug: Array.isArray(slug) ? slug[0] : slug,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardFilledItemsPage;
