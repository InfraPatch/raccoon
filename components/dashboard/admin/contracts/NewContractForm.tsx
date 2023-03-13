import { Field, Form, Formik, FormikHelpers, ErrorMessage } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { NewContractAPIRequest } from '@/services/apis/contracts/ContractAPIService';
import * as NewContractFormValidator from '@/validators/NewContractFormValidator';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'react-i18next';

const NewContractForm = () => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const handleFormSubmit = async ({ friendlyName, description }: NewContractAPIRequest, { setSubmitting }: FormikHelpers<NewContractAPIRequest>) => {
    try {
      await apiService.contracts.newContract({ friendlyName, description });
      toaster.success(t('dashboard:admin.new-contract.success'));
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contracts.${message}`));
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
      initialValues={{ friendlyName: '', description: '' }}
      validate={NewContractFormValidator.validate(t)}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="friendlyName">{ t('dashboard:admin.new-contract.name-field') }</label>
            <Field name="friendlyName" type="friendlyName" />
            <ErrorMessage name="friendlyName" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <label htmlFor="description">{ t('dashboard:admin.new-contract.description-field') }</label>
            <Field name="description" type="description" />
            <ErrorMessage name="description" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
              { t('dashboard:admin.new-contract.submit') }
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewContractForm;
