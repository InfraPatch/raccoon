import { useState } from 'react';

import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType } from '@/db/models/contracts/PartyType';

import { useTranslation } from 'react-i18next';

import Box from '@/components/common/box/Box';

export interface FilledContractSignaturesProps {
  contract: IFilledContract;
};

export interface IFilledContractSignature {
  id: number;
  name: string;
  type: PartyType;
};

const FilledContractSignatures = ({ contract }: FilledContractSignaturesProps) => {
  const { t } = useTranslation('dashboard');

  let signatures : IFilledContractSignature[] = [];
  const [ loadedSignatures, setLoadedSignatures ] = useState<number[]>([]);

  if (contract.sellerSignedAt) {
    signatures.push({ id: contract.userId, name: contract.user.name, type: PartyType.SELLER });
  }

  if (contract.buyerSignedAt) {
    signatures.push({ id: contract.buyerId, name: contract.buyer.name, type: PartyType.BUYER });
  }

  for (const witness of contract.witnessSignatures) {
    if (witness.signedAt) {
      signatures.push({ id: witness.witnessId, name: witness.witnessName, type: PartyType.WITNESS });
    }
  }

  if (!signatures) {
    // No signatures left to render.
    return <></>;
  }

  let containerClassName = 'my-4';

  if (!loadedSignatures.length) {
    // Hide the entire container if there are no loaded signatures
    containerClassName += ' hidden';
  }

  const dataContainerClassNames = 'mb-6 bg-field shadow rounded-md';

  return (
    <article className={containerClassName}>
      <div className={dataContainerClassNames}>
        <Box title={t('dashboard:contracts.data.signatures')}>
          <div className="text-sm flex flex-wrap overflow-hidden justify-center text-center items-center -mx-3">
            {signatures.map((signature : IFilledContractSignature, idx : number) => {
              const onLoad = () => {
                setLoadedSignatures([...loadedSignatures, signature.id]);
              };

              let className = 'py-3 px-3 w-1/3 overflow-hidden';

              if (!loadedSignatures.includes(signature.id)) {
                // Hide this signature if it's not loaded yet
                className += ' hidden';
              }

              const type = signature.type === PartyType.BUYER ? "buyer" : (signature.type === PartyType.SELLER ? "seller" : "witness");

              return (
                <div key={signature.id} className={className}>
                  <article className="rounded-lg shadow-xl bg-field">
                    <img className="block h-auto w-full" src={`/api/filled-contracts/${contract.id}/signatures/${signature.id}`} onLoad={onLoad} />
                    <p className="font-bold overflow-ellipsis overflow-hidden">{signature.name}</p>
                    <p className="pb-2">{ t(`dashboard:contracts.list.${type}-field`) }</p>
                  </article>
                </div>
              );
            })}
          </div>
        </Box>
      </div>
    </article>
  );
};

export default FilledContractSignatures;
