import { useState } from 'react';

import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { IWitnessSignature } from '@/db/models/contracts/WitnessSignature';
import { PartyType } from '@/db/models/contracts/PartyType';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { formatDate } from '@/lib/formatDate';

import { Eye, UserCheck } from 'react-feather';
import { useTranslation } from 'next-i18next';

import Swal from 'sweetalert2';
import { User } from '@/db/models/auth/User';

export interface FilledContractWitnessesProps {
  contract: IFilledContract;
  onChange: () => Promise<void>;
  partyType?: PartyType;
  user: User;
}

const FilledContractWitnesses = ({
  contract,
  onChange,
  partyType,
  user,
}: FilledContractWitnessesProps) => {
  const { t } = useTranslation('dashboard');

  const [saving, setSaving] = useState(false);

  const sellerWitnesses: IWitnessSignature[] = contract.witnessSignatures
    .filter((o) => o.isSeller)
    .sort((a, b) => Number(b.isLawyer) - Number(a.isLawyer));
  const buyerWitnesses: IWitnessSignature[] = contract.witnessSignatures
    .filter((o) => !o.isSeller)
    .sort((a, b) => Number(b.isLawyer) - Number(a.isLawyer));

  const dataContainerClassNames = 'mb-6 bg-field shadow rounded-md';
  const dataRowClassNames = 'flex items-center gap-2 my-1';
  const dataContainerTitleClassNames =
    'text-xl px-4 py-3 bg-accent text-secondary rounded-md rounded-b-none';

  const removeWitness = async (witness: IWitnessSignature) => {
    setSaving(true);

    try {
      const type = witness.isLawyer ? 'lawyer' : 'witness';

      await apiService.witnessSignatures.deleteWitnessSignature(witness.id);
      toaster.success(
        t(`dashboard:contracts.actions.witness.delete-${type}-success`),
      );
      await onChange();
      setSaving(false);
    } catch (err) {
      setSaving(false);

      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(
            t(`errors:contracts.${message}`, err.response.data.details),
          );
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  const handleRemoveWitnessClick = async (witness: IWitnessSignature) => {
    if (saving) {
      return;
    }

    const type = witness.isLawyer ? 'lawyer' : 'witness';
    const result = await Swal.fire({
      title: t('dashboard:contracts.actions.confirm-action'),
      text: t(
        `dashboard:contracts.actions.witness.delete-${type}-confirmation`,
      ),
      showCancelButton: true,
      confirmButtonText: t('dashboard:contracts.actions.yes'),
      cancelButtonText: t('dashboard:contracts.actions.no'),
    });

    if (result.isConfirmed) {
      await removeWitness(witness);
    }
  };

  const createWitnesses = (witnesses: IWitnessSignature[], title: string) => {
    if (witnesses.length === 0) {
      // There are no witnesses to display.
      return <></>;
    }

    const isWitness = partyType === PartyType.WITNESS;
    const isSeller = partyType === PartyType.SELLER;

    return (
      <div className={dataContainerClassNames}>
        <h2 className={dataContainerTitleClassNames}>{t(title)}</h2>

        <div className="px-4 py-3 text-sm">
          {witnesses.map((witness: IWitnessSignature, idx: number) => {
            return (
              <div className={dataRowClassNames} key={idx}>
                {witness.isLawyer ? (
                  <>
                    <UserCheck />
                    <strong>
                      <span className="text-info">
                        {t('dashboard:pages.lawyer')}
                      </span>
                    </strong>
                  </>
                ) : (
                  <>
                    <Eye />
                    <strong>
                      <span className="text-warning">
                        {t('dashboard:pages.witness')}
                      </span>
                    </strong>
                  </>
                )}

                <span>
                  <strong>{witness.witnessName}</strong>{' '}
                  {t('dashboard:contracts.list.signed-at')}:
                </span>

                {witness.signedAt ? (
                  <span>{formatDate(witness.signedAt, false)}</span>
                ) : (
                  <span className="text-danger">
                    {t('dashboard:contracts.list.not-signed-yet')}
                  </span>
                )}

                {!witness.signedAt &&
                  ((isWitness && witness.id === user.id) ||
                    (!isWitness && witness.isSeller === isSeller)) && (
                    <strong>
                      <a
                        className="text-danger"
                        href="#"
                        onClick={() => handleRemoveWitnessClick(witness)}
                      >
                        (
                        {t(
                          'dashboard:contracts.actions.witness.remove-from-contract',
                        )}
                        )
                      </a>
                    </strong>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <article className="my-4">
      <div className={dataContainerClassNames}>
        {createWitnesses(sellerWitnesses, 'contracts.data.seller-witnesses')}
        {createWitnesses(buyerWitnesses, 'contracts.data.buyer-witnesses')}
      </div>
    </article>
  );
};

export default FilledContractWitnesses;
