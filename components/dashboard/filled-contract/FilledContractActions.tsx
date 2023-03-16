import { useState } from 'react';

import Button, { ButtonSize } from '@/components/common/button/Button';
import { IFilledContract } from '@/db/models/contracts/FilledContract';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import Swal from 'sweetalert2';

export interface FilledContractActionsProps {
  filledContract: IFilledContract;
  onChange: () => Promise<void>;
  isBuyer?: boolean;
};

const FilledContractActions = ({ filledContract, onChange, isBuyer }: FilledContractActionsProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const router = useRouter();

  const [ saving, setSaving ] = useState(false);

  const acceptOrDecline = async (action: 'accept' | 'decline') => {
    const request = action === 'accept'
      ? apiService.filledContracts.acceptFilledContract
      : apiService.filledContracts.declineFilledContract;

    setSaving(true);

    try {
      await request(filledContract.id);
      toaster.success(t(`dashboard:contracts.actions.${action}-success`));
      setSaving(false);
      await onChange();
    } catch (err) {
      setSaving(false);

      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`, err.response.data.details));
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  const signContract = async () => {
    setSaving(true);

    try {
      await apiService.filledContracts.signFilledContract(filledContract.id);
      toaster.success(t('dashboard:contracts.actions.sign-success'));
      await onChange();
      setSaving(false);
    } catch (err) {
      setSaving(false);

      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`, err.response.data.details));
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  const deleteContract = async () => {
    setSaving(true);

    try {
      await apiService.filledContracts.deleteFilledContract(filledContract.id);
      toaster.success(t('dashboard:contracts.actions.delete-success'));
      router.push('/dashboard/contracts');
    } catch (err) {
      setSaving(false);

      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`, err.response.data.details));
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    }
  };

  const downloadContract = async () => {
    window.location.href = `/documents/${filledContract.id}`;
  };

  const handleAcceptOrDeclineClick = async (action: 'accept' | 'decline') => {
    const result = await Swal.fire({
      title: t('dashboard:contracts.actions.confirm-action'),
      text: t(`dashboard:contracts.actions.${action}-confirmation`),
      showCancelButton: true,
      confirmButtonText: t('dashboard:contracts.actions.yes'),
      cancelButtonText: t('dashboard:contracts.actions.no')
    });

    if (result.isConfirmed) {
      await acceptOrDecline(action);
    }
  };

  const handleSignClick = async () => {
    const result = await Swal.fire({
      title: t('dashboard:contracts.actions.confirm-action'),
      text: t('dashboard:contracts.actions.sign-confirmation'),
      showCancelButton: true,
      confirmButtonText: t('dashboard:contracts.actions.yes'),
      cancelButtonText: t('dashboard:contracts.actions.no')
    });

    if (result.isConfirmed) {
      await signContract();
    }
  };

  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: t('dashboard:contracts.actions.confirm-action'),
      text: t('dashboard:contracts.actions.delete-confirmation'),
      showCancelButton: true,
      confirmButtonText: t('dashboard:contracts.actions.yes'),
      cancelButtonText: t('dashboard:contracts.actions.no')
    });

    if (result.isConfirmed) {
      await deleteContract();
    }
  };

  return (
    <div className="flex flex-wrap gap-4 my-4">
      {isBuyer && !filledContract.accepted && (
        <>
          <Button
            size={ButtonSize.SMALL}
            disabled={saving}
            onClick={() => handleAcceptOrDeclineClick('accept')}
          >{ t('dashboard:contracts.actions.accept') }</Button>

          <Button
            size={ButtonSize.SMALL}
            disabled={saving}
            onClick={() => handleAcceptOrDeclineClick('decline')}
          >{ t('dashboard:contracts.actions.reject') }</Button>
        </>
      )}

      {isBuyer && filledContract.accepted && (
        <Button
          size={ButtonSize.SMALL}
          disabled={saving}
          onClick={handleSignClick}
        >{ t('dashboard:contracts.actions.sign') }</Button>
      )}

      {!isBuyer && (
        <>
          <Button
            size={ButtonSize.SMALL}
            disabled={saving}
            onClick={handleSignClick}
          >{ t('dashboard:contracts.actions.sign') }</Button>

          <Button
            size={ButtonSize.SMALL}
            disabled={saving}
            onClick={handleDeleteClick}
          >{ t('dashboard:contracts.actions.delete')}</Button>
        </>
      )}

      {filledContract.sellerSignedAt && filledContract.buyerSignedAt && (
        <Button
          size={ButtonSize.SMALL}
          disabled={saving}
          onClick={downloadContract}
        >{ t('dashboard:contracts.actions.download')}</Button>
      )}
    </div>
  );
};

export default FilledContractActions;
