import { OptionType } from '@/db/common/OptionType';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType } from '@/db/models/contracts/PartyType';
import { IFilledContractOption } from '@/db/models/contracts/FilledContractOption';
import { IFilledItemOption } from '@/db/models/items/FilledItemOption';
import { formatDate } from '@/lib/formatDate';
import { getPersonalIdentifierTypeString } from '@/lib/getPersonalIdentifierTypeString';

import { FileText, Folder, PenTool, User, UserCheck } from 'react-feather';

import { useTranslation } from 'next-i18next';

export interface FilledContractOverviewProps {
  contract: IFilledContract;
  partyType?: PartyType;
}

const FilledContractOverview = ({
  contract,
  partyType,
}: FilledContractOverviewProps) => {
  const { t } = useTranslation('dashboard');

  const sellerDetails = contract.options.filter((o) => o.option.isSeller);
  const buyerDetails = contract.options.filter((o) => !o.option.isSeller);

  const getValueString = (
    filledOption: IFilledContractOption | IFilledItemOption,
  ): string => {
    switch (filledOption.option.type) {
      case OptionType.DATE:
        return formatDate(filledOption.value);
      case OptionType.PERSONAL_IDENTIFIER:
        return getPersonalIdentifierTypeString(parseInt(filledOption.value), t);
      default:
        return filledOption.value;
    }
  };

  const dataContainerClassNames = 'mb-6 bg-field shadow rounded-md';
  const dataRowClassNames = 'flex items-center gap-2 my-1';
  const dataContainerTitleClassNames =
    'text-xl px-4 py-3 bg-accent text-secondary rounded-md rounded-b-none';

  const isBuyer = partyType === PartyType.BUYER;
  const isSeller = partyType === PartyType.SELLER;
  const isWitness = partyType === PartyType.WITNESS;

  return (
    <article className="my-4">
      <div className={dataContainerClassNames}>
        <h2 className={dataContainerTitleClassNames}>
          {t('contracts.data.contract-details')}
        </h2>

        <div className="px-4 py-3 text-sm">
          {(isWitness || isBuyer) && (
            <div className={dataRowClassNames}>
              <User />

              <div>
                <strong>{t('dashboard:contracts.list.seller-field')}: </strong>{' '}
                <a href={`mailto:${contract.user.email}`}>
                  {contract.user.name}
                </a>
              </div>
            </div>
          )}

          {(isWitness || isSeller) && (
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
              <a href={`/contracts/${contract.contract.id}/download`}>
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
                <strong>
                  {t('dashboard:contracts.list.buyer-accepted')}:{' '}
                </strong>
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
              <strong>
                {t('dashboard:contracts.list.seller-signed-at')}:{' '}
              </strong>
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
      </div>

      {contract.filledItem && contract.filledItem?.options.length && (
        <div className={dataContainerClassNames}>
          <h2 className={dataContainerTitleClassNames}>
            {t('contracts.data.item-details')}
          </h2>

          <div className="px-4 py-3">
            {contract.filledItem.options.map((detail) => (
              <div key={detail.id}>
                <strong>{detail.option.friendlyName}:&nbsp;</strong>

                <span>{getValueString(detail)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={dataContainerClassNames}>
        <h2 className={dataContainerTitleClassNames}>
          {t('contracts.data.seller-details')}
        </h2>

        <div className="px-4 py-3">
          {sellerDetails.map((detail) => (
            <div key={detail.id}>
              <strong>{detail.option.friendlyName}:&nbsp;</strong>

              <span>{getValueString(detail)}</span>
            </div>
          ))}
        </div>
      </div>

      {contract.accepted && (
        <div className={dataContainerClassNames}>
          <h2 className={dataContainerTitleClassNames}>
            {t('contracts.data.buyer-details')}
          </h2>

          <div className="px-4 py-3">
            {buyerDetails.map((detail) => (
              <div key={detail.id}>
                <strong>{detail.option.friendlyName}:&nbsp;</strong>

                <span>{getValueString(detail)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default FilledContractOverview;
