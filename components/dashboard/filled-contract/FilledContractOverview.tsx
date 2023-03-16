import { ContractOptionType } from '@/db/models/contracts/ContractOption';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { IFilledContractOption } from '@/db/models/contracts/FilledContractOption';
import { formatDate } from '@/lib/formatDate';
import { getPersonalIdentifierTypeString } from '@/lib/getPersonalIdentifierTypeString';

import { useTranslation } from 'react-i18next';

export interface FilledContractOverviewProps {
  contract: IFilledContract;
  isBuyer?: boolean;
};

const FilledContractOverview = ({ contract, isBuyer }: FilledContractOverviewProps) => {
  const { t } = useTranslation('dashboard');

  const sellerDetails = contract.options.filter(o => o.option.isSeller);
  const buyerDetails = contract.options.filter(o => !o.option.isSeller);

  const getValueString = (filledOption: IFilledContractOption): string => {
    switch (filledOption.option.type) {
      case ContractOptionType.DATE:
        return formatDate(filledOption.value);
      case ContractOptionType.PERSONAL_IDENTIFIER:
        return getPersonalIdentifierTypeString(parseInt(filledOption.value), t);
      default:
        return filledOption.value;
    }
  };

  return (
    <div className="my-4">
      <div className="mb-6">
        <h2 className="font-normal text-xl">{ t('contracts.data.contract-details') }</h2>

        <div className="my-2">
          <div>
            <strong>{t('dashboard:contracts.list.contract-type')}:</strong> {contract.contract.friendlyName} (<a
              href={`/templates/${contract.contract.filename.replace('/templates/', '')}`}
            >{t('dashboard:contracts.list.preview')}</a>)
          </div>

          {!isBuyer && (<div>
            <strong>{t('dashboard:contracts.list.buyer-accepted')}: </strong>
            {contract.accepted && <span className="text-success">{t('dashboard:contracts.list.yes')}</span>}
            {!contract.accepted && <span className="text-danger">{t('dashboard:contracts.list.no')}</span>}
          </div>)}

          <div>
            <strong>{t('dashboard:contracts.list.seller-signed-at')}: </strong>
            {!contract.sellerSignedAt && <span className="text-danger">{t('dashboard:contracts.list.not-signed-yet')}</span>}
            {contract.sellerSignedAt && <span>{formatDate(contract.sellerSignedAt, false)}</span>}
          </div>

          <div>
            <strong>{t('dashboard:contracts.list.buyer-signed-at')}: </strong>
            {!contract.buyerSignedAt && <span className="text-danger">{t('dashboard:contracts.list.not-signed-yet')}</span>}
            {contract.buyerSignedAt && <span>{formatDate(contract.buyerSignedAt, false)}</span>}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-normal text-xl">{ t('contracts.data.seller-details') }</h2>

        <div className="my-2">
          {sellerDetails.map(detail => (
            <div key={detail.id}>
              <strong>
                {detail.option.friendlyName}:&nbsp;
              </strong>

              <span>
                {getValueString(detail)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {contract.accepted && (
        <div>
          <h2 className="font-normal text-xl">{ t('contracts.data.buyer-details') }</h2>

          <div className="my-2">
            {buyerDetails.map(detail => (
              <div key={detail.id}>
                <strong>
                  {detail.option.friendlyName}:&nbsp;
                </strong>

                <span>
                  {getValueString(detail)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilledContractOverview;
