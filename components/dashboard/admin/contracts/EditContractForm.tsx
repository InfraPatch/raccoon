import { useState } from 'react';
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { UpdateContractAPIResponse } from '@/services/apis/contracts/ContractAPIService';
import * as NewContractFormValidator from '@/validators/NewContractFormValidator';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'react-i18next';
import { Contract } from 'db/models/contracts/Contract';
import Box from '@/components/common/box/Box';

interface EditContractFormRequest {
  friendlyName: string;
  description: string;
}

interface EditContractFormProps {
  contractProp: Contract;
}

const EditContractForm = ({ contractProp } : EditContractFormProps) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const [ file, setFile ] = useState<File | null>(null);
  const [ contract, setContract ] = useState<Contract>(contractProp);

  const handleFormSubmit = async ({ friendlyName, description }: EditContractFormRequest, { setSubmitting }: FormikHelpers<EditContractFormRequest>) => {
    try {
      const response : UpdateContractAPIResponse = await apiService.contracts.updateContract({ id: contract.id, friendlyName, description, file });

      setContract(response.contract);
      toaster.success(t('dashboard:admin.edit-contract.success'));
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
    <Box title={`${t('dashboard:admin.edit-contract:title')}: ${contract.friendlyName}`}>
      <Formik
        initialValues={{ friendlyName: contract.friendlyName, description: contract.description }}
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
              <label htmlFor="file">{ t('dashboard:admin.new-contract.file-field') }&nbsp;
                <a href={contract.filename} target="_blank">{ t('dashboard:admin.edit-contract.file-preview-link') }</a>
              </label>
              <input name="file" type="file" id="file" onChange={e => setFile(e.currentTarget.files[0])} />
            </div>

            <div className="form-field">
              <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
                { t('dashboard:admin.edit-contract.submit') }
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditContractForm;
