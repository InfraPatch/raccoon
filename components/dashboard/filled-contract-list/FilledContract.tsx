import Button, { ButtonSize } from '@/components/common/button/Button';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType } from '@/db/models/contracts/PartyType';

import { formatDate } from '@/lib/formatDate';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import Link from 'next/link';
import { FileText, Folder, PenTool, User, UserCheck } from 'react-feather';

import { useTranslation } from 'next-i18next';

export interface FilledContractListItemProps {
  contract: IFilledContract;
  onChange: () => Promise<void>;
  partyType?: PartyType;
}

const FilledContractListItem = ({
  contract,
  onChange,
  partyType,
}: FilledContractListItemProps) => {
  const { t } = useTranslation(['dashboard', 'errors']);

  const acceptOrDecline = async (action: 'accept' | 'decline') => {
    const request =
      action === 'accept'
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

  const dataRowClassNames = 'flex items-center gap-2 my-1';
  const isBuyer = partyType === PartyType.BUYER;
  const isSeller = partyType === PartyType.SELLER;

  return (
    <article className="my-4 bg-field shadow rounded-md">
      <Link href={`/dashboard/contracts/${contract.id}`}>
        <h2 className="text-xl block px-4 py-3 bg-accent text-secondary rounded-md rounded-b-none">
          {contract.friendlyName}
        </h2>
      </Link>

      <div className="px-4 py-3 text-sm">
        {!isSeller && contract.user?.email && (
          <div className={dataRowClassNames}>
            <User />

            <div>
              <strong>{t('dashboard:contracts.list.seller-field')}: </strong>{' '}
              <a href={`mailto:${contract.user.email}`}>{contract.user.name}</a>
            </div>
          </div>
        )}

        {!isBuyer && contract.buyer?.email && (
          <div className={dataRowClassNames}>
            <User />

            <div>
              <strong>{t('dashboard:contracts.list.buyer-field')}: </strong>{' '}
              <a href={`mailto:${contract.buyer.email}`}>
                {contract.buyer.name}
              </a>
            </div>
          </div>
        )}

        <div className={dataRowClassNames}>
          <FileText />

          <div>
            <strong>{t('dashboard:contracts.list.contract-type')}:</strong>{' '}
            {contract.contract.friendlyName} (
            <a href={`/contracts/${contract.contract.id}`}>
              {t('dashboard:contracts.list.preview')}
            </a>
            )
          </div>
        </div>

        {contract.filledItem && (
          <div className={dataRowClassNames}>
            <Folder />

            <div>
              <strong>{t('dashboard:contracts.list.item')}:</strong>{' '}
              {contract.filledItem.friendlyName}
            </div>
          </div>
        )}

        {isSeller && (
          <div className={dataRowClassNames}>
            <UserCheck />

            <div>
              <strong>{t('dashboard:contracts.list.buyer-accepted')}: </strong>
              {contract.accepted && (
                <span className="text-success">
                  {t('dashboard:contracts.list.yes')}
                </span>
              )}
              {!contract.accepted && (
                <span className="text-danger">
                  {t('dashboard:contracts.list.no')}
                </span>
              )}
            </div>
          </div>
        )}

        <div className={dataRowClassNames}>
          <PenTool />

          <div>
            <strong>{t('dashboard:contracts.list.seller-signed-at')}: </strong>
            {!contract.sellerSignedAt && (
              <span className="text-danger">
                {t('dashboard:contracts.list.not-signed-yet')}
              </span>
            )}
            {contract.sellerSignedAt && (
              <span>{formatDate(contract.sellerSignedAt, false)}</span>
            )}
          </div>
        </div>

        <div className={dataRowClassNames}>
          <PenTool />

          <div>
            <strong>{t('dashboard:contracts.list.buyer-signed-at')}: </strong>
            {!contract.buyerSignedAt && (
              <span className="text-danger">
                {t('dashboard:contracts.list.not-signed-yet')}
              </span>
            )}
            {contract.buyerSignedAt && (
              <span>{formatDate(contract.buyerSignedAt, false)}</span>
            )}
          </div>
        </div>
      </div>

      {isBuyer && !contract.accepted && (
        <div className="flex gap-2 pb-3 px-4">
          <Button
            size={ButtonSize.SMALL}
            onClick={() => acceptOrDecline('accept')}
          >
            {t('dashboard:contracts.list.accept')}
          </Button>

          <Button
            size={ButtonSize.SMALL}
            onClick={() => acceptOrDecline('decline')}
          >
            {t('dashboard:contracts.list.decline')}
          </Button>
        </div>
      )}
    </article>
  );
};

export default FilledContractListItem;
