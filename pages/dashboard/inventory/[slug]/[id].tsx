import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Box from '@/components/common/box/Box';
import Attachments from '@/components/dashboard/attachments/Attachments';

import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import apiService from '@/services/apis';

import { Item } from '@/db/models/items/Item';
import { IFilledItem } from '@/db/models/items/FilledItem';
import { IAttachment } from '@/db/common/Attachment';

import Meta from '@/components/common/Meta';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';
import FilledItemEditForm from '@/components/dashboard/filled-item/FilledItemEditForm';

import { redirectIfNotReady, useCurrentUser } from '@/hooks/useCurrentUser';
import Link from 'next/link';

import idFromQueryParam from '@/lib/idFromQueryParam';

export interface DashboardFilledItemPageProps {
  slug: string;
  id: number;
};

const DashboardFilledItemPage = ({ slug, id }: DashboardFilledItemPageProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ item, setItem ] = useState<Item | null>(null);
  const [ filledItem, setFilledItem ] = useState<IFilledItem | null>(null);
  const [ error, setError ] = useState('');
  const [ user ] = useCurrentUser();

  // Redirect user if they haven't filled out their details yet
  redirectIfNotReady(user);

  const loadFilledItem = async () => {
    setItem(null);
    setFilledItem(null);
    setError('');

    try {
      const itemRes = await apiService.items.getItem({ slug });
      setItem(itemRes.item);

      const filledItemRes = await apiService.filledItems.getFilledItem(id);
      setFilledItem(filledItemRes.filledItem);
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
    loadFilledItem();
  }, []);

  const deleteAttachment = async (attachment: IAttachment) => {
    return await apiService.filledItemAttachments.deleteFilledItemAttachment(attachment.id);
  };

  const uploadAttachment = async (file: File, friendlyName: string) => {
    return await apiService.filledItemAttachments.createFilledItemAttachment({ file, friendlyName, filledItemId: filledItem.id });
  };

  const canDeleteAttachment = (attachment: IAttachment): boolean => {
    return user.id === filledItem.userId;
  };

  const canUploadAttachment = (): boolean => {
    return user.id === filledItem.userId;
  };


  return (
    <DashboardLayout>
      <Meta
        title={ `${filledItem ? filledItem.friendlyName : '...'} - ${t('dashboard:pages.my-items')}` }
        url={`/dashboard/inventory/${slug}/${id}`}
      />

      {user && item && filledItem && (
        <>
          <h1 className="font-normal text-2xl mb-3">
            {filledItem.friendlyName}
          </h1>

          <div className="mb-4">
            <Link href={`/dashboard/inventory/${slug}`}>
              <a>
                &laquo; { item.friendlyName }
              </a>
            </Link>
          </div>

          <Columns>
            <Column>
              {item && (
                <FilledItemEditForm
                  filledItem={filledItem}
                  loadFilledItem={loadFilledItem}
                  item={item}
                />
              )}
            </Column>

            <Column>
              {(filledItem.attachments?.length > 0 || canUploadAttachment()) && (
                <Box title={ t('dashboard:items.data.attachments') }>
                  <Attachments
                    attachments={filledItem.attachments}
                    onChange={loadFilledItem}
                    deleteAttachment={deleteAttachment}
                    uploadAttachment={uploadAttachment}
                    canUpload={canUploadAttachment}
                    canDelete={canDeleteAttachment}
                    modelName="items"
                    translationKey='item-attachments'
                  />
                </Box>
              )}
            </Column>
          </Columns>
        </>
      )}

      {(!item || !filledItem) && !error && <Loading />}
      {error && error.length > 0 && <DangerMessage>{error}</DangerMessage>}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query, locale }) => {
  const session = await getSession({ req });

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  const { slug, id } = query;

  return {
    props: {
      slug: Array.isArray(slug) ? slug[0] : slug,
      id: idFromQueryParam(id),
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardFilledItemPage;
