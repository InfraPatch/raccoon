import { useState } from 'react';

import Button, { ButtonSize } from '@/components/common/button/Button';
import { IFilledContract } from '@/db/models/contracts/FilledContract';
import { PartyType } from '@/db/models/contracts/PartyType';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import buildUrl from '@/lib/buildUrl';
import React from 'react';
import { CreateWitnessSignatureAPIResponse } from '@/services/apis/contracts/WitnessSignatureAPIService';
import { allPartiesSigned, hasWitnessSigned } from '@/controllers/filled-contracts/signUtils';
import { User } from '@/db/models/auth/User';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SignatureCanvas from 'react-signature-canvas';

const MySwal = withReactContent(Swal);

export interface FilledContractActionsProps {
  filledContract: IFilledContract;
  onChange: () => Promise<void>;
  partyType?: PartyType;
  user: User;
};

const FilledContractActions = ({ filledContract, onChange, partyType, user }: FilledContractActionsProps) => {
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

  const signContract = async (signatureImage: string | null) => {
    setSaving(true);

    try {
      await apiService.filledContracts.signFilledContract(filledContract.id, signatureImage);
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

  const requestWitness = async (witnessEmail: string) => {
    setSaving(true);

    try {
      const response : CreateWitnessSignatureAPIResponse = await apiService.witnessSignatures.createWitnessSignature({ witnessEmail, filledContractId: filledContract.id });
      const type : string = (response.witnessSignature.isLawyer) ? 'lawyer' : 'witness';

      toaster.success(t(`dashboard:contracts.actions.witness.request-${type}-success`));
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

  const forwardContract = async () => {
    const subject = t('dashboard:contracts.actions.forward.subject', { friendlyName: filledContract.friendlyName });
    const fullUrl = buildUrl(`/documents/${filledContract.filename}`);
    const body = `${t('dashboard:contracts.actions.forward.hello')} ${t('dashboard:contracts.actions.forward.prompt')} ${fullUrl}`;

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleAcceptOrDeclineClick = async (action: 'accept' | 'decline') => {
    const result = await MySwal.fire({
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
    let canvas : SignatureCanvas = null;

    const clearSignatureCanvas = () => {
      canvas.clear();
    };

    const result = await MySwal.fire({
      title: t('dashboard:contracts.actions.signatures.sign-action'),
      html: (
        <div className="text-center">
          <p className="text-xl font-bold pb-2">{ t('dashboard:contracts.actions.signatures.sign-here') }</p>
          <SignatureCanvas
            ref={ref => { canvas = ref; }}
            penColor="black"
            canvasProps={{className: 'border-dashed border-2 mx-auto', width: 300, height: 150}}
          />
          <button
            type="button"
            className="swal2-styled swal2-deny"
            onClick={clearSignatureCanvas}
          >{ t('dashboard:contracts.actions.signatures.clear-button') }</button>
        </div>
      ),
      showCancelButton: true,
      cancelButtonText: t('dashboard:contracts.actions.signatures.simple-sign-button'),
      confirmButtonText: t('dashboard:contracts.actions.signatures.digital-sign-button'),
      reverseButtons: true
    });

    if (result.dismiss === Swal.DismissReason.backdrop) {
      // User has cancelled the dialog by clicking on the backdrop.
      return;
    }

    let data = null;

    if (result.isConfirmed) {
      if (!canvas.isEmpty()) {
        data = canvas.toDataURL('image/png');
      } else {
        const errorResult = await MySwal.fire({
          icon: 'error',
          title: t('dashboard:contracts.actions.signatures.sign-action'),
          text: t('dashboard:contracts.actions.signatures.signature-missing'),
          showCancelButton: true,
          cancelButtonText: t('dashboard:contracts.actions.signatures.simple-sign-button'),
          confirmButtonText: t('dashboard:contracts.actions.signatures.signature-retry'),
          reverseButtons: true
        });

        if (errorResult.dismiss === Swal.DismissReason.backdrop) {
          // User has cancelled the dialog by clicking on the backdrop.
          return;
        }

        if (errorResult.isConfirmed) {
          return await handleSignClick();
        }
      }
    }

    await signContract(data);
  };

  const handleDeleteClick = async () => {
    const result = await MySwal.fire({
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

  const handleRequestWitnessClick = async () => {
    const result = await MySwal.fire({
      title: t('dashboard:contracts.actions.witness.request-witness'),
      text: t('dashboard:contracts.actions.witness.witness-confirmation'),
      input: 'text',
      showCancelButton: true,
      confirmButtonText: t('dashboard:contracts.actions.witness.request'),
      cancelButtonText: t('dashboard:contracts.actions.cancel'),
      inputPlaceholder: t('dashboard:contracts.actions.witness.witness-email')
    });

    if (result.value) {
      await requestWitness(result.value);
    }
  };

  const isBuyer = (partyType === PartyType.BUYER);
  const isSeller = (partyType === PartyType.SELLER);
  const isWitness = (partyType === PartyType.WITNESS);

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

      {filledContract.accepted && ((isSeller && !filledContract.sellerSignedAt) || (isBuyer && !filledContract.buyerSignedAt) || (isWitness && !hasWitnessSigned(user.id, filledContract))) && (
        <Button
          size={ButtonSize.SMALL}
          disabled={saving}
          onClick={handleSignClick}
        >{ t('dashboard:contracts.actions.sign') }</Button>
      )}

      {isSeller && !allPartiesSigned(filledContract) && (
        <Button
          size={ButtonSize.SMALL}
          disabled={saving}
          onClick={handleDeleteClick}
        >{ t('dashboard:contracts.actions.delete') }</Button>
      )}

      {allPartiesSigned(filledContract) ? (
        <>
          <Button
            size={ButtonSize.SMALL}
            disabled={saving}
            onClick={downloadContract}
          >{ t('dashboard:contracts.actions.download') }</Button>

          <Button
            size={ButtonSize.SMALL}
            disabled={saving}
            onClick={forwardContract}
          >{ t('dashboard:contracts.actions.forward.button')}</Button>
        </>
      ) : (!isWitness && (!isBuyer || filledContract.accepted) &&
        <Button
          size={ButtonSize.SMALL}
          disabled={saving}
          onClick={handleRequestWitnessClick}
        >{ t('dashboard:contracts.actions.witness.request-witness') }</Button>
      )}

      {isWitness && (!filledContract.accepted || (hasWitnessSigned(user.id, filledContract) && !allPartiesSigned(filledContract))) && (
        <div className="text-center text-sm flex-1">
          { t('dashboard:contracts.actions.no-actions') }
        </div>
      )}
    </div>
  );
};

export default FilledContractActions;
