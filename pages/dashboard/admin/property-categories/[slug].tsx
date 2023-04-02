import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

import { User } from '@/db/models/auth/User';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';

import { getSession } from 'next-auth/client';
import { redirectIfNotAdmin } from '@/lib/redirects';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { Item } from '@/db/models/items/Item';
import { ItemOption } from '@/db/models/items/ItemOption';
import EditItemForm from '@/components/dashboard/admin/items/EditItemForm';
import ItemOptionForm from '@/components/dashboard/admin/items/ItemOptionForm';
import Meta from '@/components/common/Meta';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

export interface DashboardItemPageProps {
  user: User;
  slug: string;
};

const DashboardItemPage = ({ user, slug }: DashboardItemPageProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ item, setItem ] = useState<Item | null>(null);
  const [ rows, setRows ] = useState<ItemOption[][]>([]);

  const [ error, setError ] = useState('');

  const rerenderOptions = (item: Item) => {
    const rows: ItemOption[][] = [];

    for (let i : number = 0; i < item.options.length; i += 3) {
      rows.push(item.options.slice(i, i + 3));
    }

    setRows(rows);
  };

  const loadItem = async () => {
    setItem(null);
    setRows(null);

    setError('');

    try {
      const res = await apiService.items.getItem({ slug });
      setItem(res.item);
      rerenderOptions(res.item);
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
    loadItem();
  }, []);

  return (
    <DashboardLayout user={user}>
      <Meta
        title={`${t('dashboard:pages.item-categories')}: ${item?.friendlyName || '...'}`}
        url={`/dashboard/admin/property-categories/${slug}`}
      />

      {item && (
        <>
          <Columns>
            <Column key={'item-' + item.id}>
              <EditItemForm itemProp={item} />
            </Column>
          </Columns>

          {rows && rows.map((row, index) => {
            let columns = [];

            for (let i : number = 0; i < row.length; ++i) {
              let itemOption : ItemOption = row[i];

              columns.push(
                <Column key={'itemOption-' + itemOption.id}>
                  <ItemOptionForm
                    item={item}
                    itemOption={itemOption}
                    setItem={rerenderOptions}
                  />
                </Column>
              );
            }

            return <Columns key={'column-' + index}>{columns}</Columns>;
          })}
          <Columns>
            <Column>
              <ItemOptionForm
                item={item}
                setItem={rerenderOptions} />
            </Column>
          </Columns>
        </>
      )}

      {!item && !error && <Loading />}

      {error && error.length && <DangerMessage>{error}</DangerMessage>}
    </DashboardLayout>
  );
};

export const getServerSideProps : GetServerSideProps = async ({ req, res, locale, query }) => {
  const session = await getSession({ req });

  if (await redirectIfNotAdmin(res, session)) {
    return { props: { user: null } };
  }

  const { slug } = query;

  return {
    props: {
      user: session.user,
      slug,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardItemPage;
