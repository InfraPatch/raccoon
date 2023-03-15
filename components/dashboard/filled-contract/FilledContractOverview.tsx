import { IFilledContract } from '@/db/models/contracts/FilledContract';

import { useTranslation } from 'react-i18next';

export interface FilledContractOverviewProps {
  contract: IFilledContract;
  isBuyer?: boolean;
};

const FilledContractOverview = ({ contract, isBuyer }: FilledContractOverviewProps) => {
  const { t } = useTranslation('dashboard');

  const sellerDetails = contract.options.filter(o => o.option.isSeller);
  const buyerDetails = contract.options.filter(o => !o.option.isSeller);

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
            {contract.sellerSignedAt && <span>{contract.sellerSignedAt}</span>}
          </div>

          <div>
            <strong>{t('dashboard:contracts.list.buyer-signed-at')}: </strong>
            {!contract.buyerSignedAt && <span className="text-danger">{t('dashboard:contracts.list.not-signed-yet')}</span>}
            {contract.buyerSignedAt && <span>{contract.buyerSignedAt}</span>}
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
                {detail.value}
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
                  {detail.value}
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
