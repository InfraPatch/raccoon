import Button, { ButtonSize } from '@/components/common/button/Button';
import { IFilledContract } from '@/db/models/contracts/FilledContract';

import { formatDate } from '@/lib/formatDate';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export interface FilledContractListItemProps {
  contract: IFilledContract;
  onChange: () => Promise<void>;
  isBuyer?: boolean;
};

const FilledContractListItem = ({ contract, onChange, isBuyer }: FilledContractListItemProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const acceptOrDecline = async (action: 'accept' | 'decline') => {
    const request = action === 'accept'
      ? apiService.filledContracts.acceptFilledContract
      : apiService.filledContracts.declineFilledContract;

    try {
      await request(contract.id);
      toaster.success(t(`dashboard:contracts.list.${action}-success`));
      await onChange();
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`));
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  return (
    <article className="px-4 py-3 mb-4 bg-field shadow rounded-md">
      <Link href={`/dashboard/contracts/${contract.id}`}>
        <a>
          <h2 className="text-xl inline-block mb-2">{contract.friendlyName}</h2>
        </a>
      </Link>

      <div>
        <strong>{ t('dashboard:contracts.list.contract-type') }:</strong> {contract.contract.friendlyName} (<a
          href={`/templates/${contract.contract.filename.replace('/templates/', '')}`}
        >{ t('dashboard:contracts.list.preview') }</a>)
      </div>

      {!isBuyer && (<div>
        <strong>{ t('dashboard:contracts.list.buyer-accepted') }: </strong>
        {contract.accepted && <span className="text-success">{ t('dashboard:contracts.list.yes') }</span>}
        {!contract.accepted && <span className="text-danger">{ t('dashboard:contracts.list.no') }</span>}
      </div>)}

      <div>
        <strong>{ t('dashboard:contracts.list.seller-signed-at') }: </strong>
        {!contract.sellerSignedAt && <span className="text-danger">{ t('dashboard:contracts.list.not-signed-yet') }</span>}
        {contract.sellerSignedAt && <span>{formatDate(contract.sellerSignedAt, false)}</span>}
      </div>

      <div>
        <strong>{ t('dashboard:contracts.list.buyer-signed-at') }: </strong>
        {!contract.buyerSignedAt && <span className="text-danger">{ t('dashboard:contracts.list.not-signed-yet') }</span>}
        {contract.buyerSignedAt && <span>{formatDate(contract.buyerSignedAt, false)}</span>}
      </div>

      {isBuyer && !contract.accepted && (
        <div className="flex gap-2 my-3">
          <Button size={ButtonSize.SMALL} onClick={() => acceptOrDecline('accept')}>
            { t('dashboard:contracts.list.accept') }
          </Button>

          <Button size={ButtonSize.SMALL} onClick={() => acceptOrDecline('decline')}>
            { t('dashboard:contracts.list.decline') }
          </Button>
        </div>
      )}
    </article>
  );
};

export default FilledContractListItem;
