import { getSession } from 'next-auth/client';
import { redirectIfAnonymous } from '@/lib/redirects';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

import { User } from '@/db/models/auth/User';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType, getPartyType } from '@/db/models/contracts/PartyType';

import apiService from '@/services/apis';

import DashboardLayout from '@/layouts/DashboardLayout';
import Columns from '@/components/common/columns/Columns';
import Column from '@/components/common/columns/Column';
import Box from '@/components/common/box/Box';
import Loading from '@/components/common/Loading';
import { DangerMessage } from '@/components/common/message-box/DangerMessage';

import FilledContractFieldsForm from '@/components/dashboard/filled-contract/FilledContractFieldsForm';
import FilledContractActions from '@/components/dashboard/filled-contract/FilledContractActions';
import FilledContractOverview from '@/components/dashboard/filled-contract/FilledContractOverview';
import FilledContractWitnesses from '@/components/dashboard/filled-contract/FilledContractWitnesses';
import Attachments from '@/components/dashboard/attachments/Attachments';
import Meta from '@/components/common/Meta';
import { IAttachment, IAttachmentProps } from '@/db/common/Attachment';
import { IFilledContractAttachment } from '@/db/models/contracts/FilledContractAttachment';

export interface DashboardContractsPageProps {
  user: User;
  id: number;
};


const DashboardContractsPage = ({ user, id }: DashboardContractsPageProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const [ contract, setContract ] = useState<IFilledContract | null>(null);
  const [ partyType, setPartyType ] = useState(PartyType.BUYER);
  const [ title, setTitle ] = useState('...');
  const [ error, setError ] = useState('');

  const loadContract = async () => {
    setContract(null);
    setError('');

    try {
      const res = await apiService.filledContracts.getFilledContract(id);
      const contract = res.filledContract;

      setContract(contract);
      setTitle(contract.friendlyName);
      setPartyType(getPartyType(user.id, contract));
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          setError(t(`errors:contracts.${message}`));
          return;
        }
      }

      setError(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  const deleteAttachment = async (attachment: IAttachment) => {
    return await apiService.filledContractAttachments.deleteFilledContractAttachment(attachment.id);
  };

  const uploadAttachment = async (file: File, friendlyName: string) => {
    return await apiService.filledContractAttachments.createFilledContractAttachment({ file, friendlyName, filledContractId: contract.id });
  };

  const canDeleteAttachment = (attachment: IAttachment) : boolean => {
    const filledAttachment = attachment as IFilledContractAttachment;

    // We can delete the attachment if it was created by the seller and we are the seller
    if (filledAttachment.isSeller && !contract.sellerSignedAt && user.id === contract.userId) {
      return true;
    }

    // We can delete the attachment if it was created by the buyer and we are the buyer
    if (!filledAttachment.isSeller && contract.accepted && !contract.buyerSignedAt && user.id === contract.buyerId) {
      return true;
    }

    // We cannot delete the attachment.
    return false;
  };

  const canUploadAttachment = () : boolean => {
    return (user.id === contract.userId && !contract.sellerSignedAt) || (user.id === contract.buyerId && contract.accepted && !contract.buyerSignedAt);
  };

  useEffect(() => {
    loadContract();
  }, []);

  const isSeller = (partyType === PartyType.SELLER);
  const isBuyer = (partyType === PartyType.BUYER);

  return (
    <DashboardLayout user={user}>
      <Meta
        title={`${t('dashboard:pages.contract')}: ${title}`}
        url={`/dashboard/contracts/${id}`}
      />
      {!error && contract !== null && (
        <Columns>
          <Column>
            <Box title={ t('dashboard:contracts.data.overview') }>
              <FilledContractOverview
                contract={contract}
                partyType={partyType}
              />
            </Box>

            {contract.witnessSignatures.length !== 0 && (
              <Box title={ t('dashboard:contracts.data.witnesses') }>
                <FilledContractWitnesses
                  contract={contract}
                  onChange={loadContract}
                  partyType={partyType}
                  user={user}
                />
              </Box>
            )}

            {(contract.attachments?.length > 0 || canUploadAttachment()) && (
              <Box title={ t('dashboard:contracts.data.attachments') }>
                <Attachments
                  attachments={contract.attachments}
                  onChange={loadContract}
                  deleteAttachment={deleteAttachment}
                  uploadAttachment={uploadAttachment}
                  canUpload={canUploadAttachment}
                  canDelete={canDeleteAttachment}
                  translationKey='contract-attachments'
                />
              </Box>
            )}

            <Box title={ t('dashboard:contracts.data.actions') }>
              <FilledContractActions
                filledContract={contract}
                onChange={loadContract}
                partyType={partyType}
                user={user}
              />
            </Box>
          </Column>

          <Column>
            {((isSeller && !contract.sellerSignedAt) || (isBuyer && contract.accepted && !contract.buyerSignedAt)) && (
              <Box title={ t('dashboard:contracts.data.my-details') }>
                <FilledContractFieldsForm
                  filledContract={contract}
                  onChange={loadContract}
                  partyType={partyType}
                />
              </Box>
            )}
          </Column>
        </Columns>
      )}

      {!error && contract === null && <Loading />}

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

  if (await redirectIfAnonymous(res, session)) {
    return { props: { user: null } };
  }

  const id = parseInt(Array.isArray(query.id) ? query.id[0] : query.id);

  return {
    props: {
      id,
      user: session.user,
      ...await serverSideTranslations(locale, [ 'common', 'dashboard', 'errors' ])
    }
  };
};

export default DashboardContractsPage;
