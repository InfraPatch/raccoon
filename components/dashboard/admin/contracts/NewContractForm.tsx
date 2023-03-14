import { useState } from 'react';
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { NewContractAPIRequest } from '@/services/apis/contracts/ContractAPIService';
import * as NewContractFormValidator from '@/validators/NewContractFormValidator';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'react-i18next';

interface NewContractFormRequest {
  friendlyName: string;
  description: string;
}

const NewContractForm = () => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const [ file, setFile ] = useState<File | null>(null);

  const handleFormSubmit = async ({ friendlyName, description }: NewContractFormRequest, { setSubmitting }: FormikHelpers<NewContractFormRequest>) => {
    try {
      await apiService.contracts.newContract({ friendlyName, description, file });
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
            <label htmlFor="file">{ t('dashboard:admin.new-contract.file-field') }</label>
            <input name="file" type="file" id="file" onChange={e => setFile(e.currentTarget.files[0])} required />
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
