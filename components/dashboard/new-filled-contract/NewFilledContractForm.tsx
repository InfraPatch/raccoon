import { Field, Form, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import apiService from '@/services/apis';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import toaster from '@/lib/toaster';

import { Contract } from '@/db/models/contracts/Contract';
import { FormEvent, useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SelectFilledItemModal from './SelectFilledItemModal';

import { IFilledItem } from '@/db/models/items/FilledItem';

const MySwal = withReactContent(Swal);

export interface NewFilledContractFormProps {
  contract: Contract;
};

interface NewFilledContractFormFields {
  friendlyName: string;
  buyerEmail: string;
};

const NewFilledContractForm = ({ contract }: NewFilledContractFormProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const router = useRouter();

  const [ filledItem, setFilledItem ] = useState<IFilledItem | null>(null);

  const handleFormSubmit = async ({ friendlyName, buyerEmail }: NewFilledContractFormFields, { setSubmitting }: FormikHelpers<NewFilledContractFormFields>) => {
    try {
      await apiService.filledContracts.createFilledContract({
        contractId: contract.id,
        friendlyName,
        buyerEmail,
        filledItemId: filledItem ? filledItem.id : undefined
      });

      toaster.success(t('dashboard:new-contract.success'));
      router.push('/dashboard/contracts');
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`, { min: 2 }));
          return;
        }
      }

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleItemSelectClick = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await MySwal.fire({
      title: t('dashboard:new-contract.filled-item-modal.title'),
      html: (
        <SelectFilledItemModal
          itemSlug={contract.item.slug}
          filledItem={filledItem}
          setFilledItem={setFilledItem}
        />
      ),
      confirmButtonText: t('dashboard:new-contract.filled-item-modal.confirm')
    });
  };

  return (
    <Formik
      initialValues={{ friendlyName: '', buyerEmail: '' }}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="friendlyName">{ t('dashboard:new-contract.fields.friendlyName') }:</label>
            <Field name="friendlyName" />
          </div>

          <div className="form-field">
            <label htmlFor="buyerEmail">{ t('dashboard:new-contract.fields.buyerEmail') }:</label>
            <Field name="buyerEmail" type="email" />
          </div>

          {contract.item && (
            <div className="form-fields">
              <div className="mb-2">
                <strong>{ t('dashboard:new-contract.fields.filled-item') } ({contract.item.friendlyName}):</strong> {filledItem ? filledItem.friendlyName : t('dashboard:new-contract.fields.filled-item-none')}
              </div>

              <Button size={ButtonSize.SMALL} onClick={handleItemSelectClick}>
                { t('dashboard:new-contract.fields.filled-item-select') }
              </Button>
            </div>
          )}

          <div className="form-field">
            <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
              { t('dashboard:new-contract.submit') }
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewFilledContractForm;
