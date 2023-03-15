import { Field, Form, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import apiService from '@/services/apis';
import { NewFilledContractAPIParams } from '@/services/apis/contracts/FilledContractAPIService';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import toaster from '@/lib/toaster';

export interface NewFilledContractFormProps {
  id: number;
};

const NewFilledContractForm = ({ id }: NewFilledContractFormProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const router = useRouter();

  const handleFormSubmit = async ({ friendlyName, buyerEmail }: NewFilledContractAPIParams, { setSubmitting }: FormikHelpers<NewFilledContractAPIParams>) => {
    try {
      await apiService.filledContracts.createFilledContract({
        contractId: id,
        friendlyName,
        buyerEmail
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

  return (
    <Formik
      initialValues={{ friendlyName: '', buyerEmail: '', contractId: id }}
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
