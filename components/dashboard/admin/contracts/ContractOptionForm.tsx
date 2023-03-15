import { useState } from 'react';
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { NewContractOptionAPIRequest, NewContractOptionAPIResponse } from '@/services/apis/contracts/ContractOptionAPIService';
import * as ContractOptionFormValidator from '@/validators/ContractOptionFormValidator';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'react-i18next';
import { Contract } from '@/db/models/contracts/Contract';
import { ContractOption } from '@/db/models/contracts/ContractOption';
import Box from '@/components/common/box/Box';
import { GetContractAPIResponse } from '@/services/apis/contracts/ContractAPIService';

export interface NewContractOptionFormRequest {
  type: number;
  priority: number;
  friendlyName: string;
  longDescription: string;
  hint: string;
  replacementString: string;
  minimumValue?: number;
  maximumValue?: number;
  isSeller: string;
};

interface ContractOptionFormData {
  contract: Contract;
  contractOption?: ContractOption;
  setContract: (contract: Contract) => void;
};

const ContractOptionForm = ({ contract, contractOption, setContract }: ContractOptionFormData) => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);

  const handleFormSubmit = async (data: NewContractOptionFormRequest, { setSubmitting }: FormikHelpers<NewContractOptionFormRequest>) => {
    const commonFields : NewContractOptionAPIRequest = {
      contractId: contract.id,
      ...data,
      type: parseInt(Array.isArray(data.type) ? data.type[0] : data.type),
      isSeller: data.isSeller === "1"
    };

    try {
      if (contractOption) {
        await apiService.contractOptions.updateContractOption({
          id: contractOption.id,
          ...commonFields
        });
        toaster.success(t('dashboard:admin.update-contract-option.success'));
      } else {
        await apiService.contractOptions.newContractOption(commonFields);
        toaster.success(t('dashboard:admin.new-contract-option.success'));
      }

      const newContract : GetContractAPIResponse = await apiService.contracts.getContract({ id : contract.id});
      setContract(newContract.contract);
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contract-options.${message}`));
          return;
        }
      }

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  let initialValues : NewContractOptionFormRequest;

  if (contractOption) {
    initialValues = {
      ...contractOption,
      longDescription: contractOption.longDescription || '',
      hint: contractOption.hint || '',
      isSeller: contractOption.isSeller ? '1' : '0',
    };
  } else {
    initialValues = {
      type: 0,
      priority: 0,
      friendlyName: '',
      longDescription: '',
      hint: '',
      replacementString: '',
      minimumValue: -1,
      maximumValue: -1,
      isSeller: '0'
    };
  }

  const key : string = contractOption ? 'update-contract-option' : 'new-contract-option';

  return (
    <Box title={ t(`dashboard:admin.${key}.title`) }>
      <Formik
        initialValues={initialValues}
        validate={ContractOptionFormValidator.validate(t)}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-field">
              <label htmlFor="type">{ t('dashboard:admin.new-contract-option.type-field') }</label>
              <Field name="type" id="type" as="select">
                <option value="0">{ t('dashboard:admin.new-contract-option.string-type') }</option>
                <option value="1">{ t('dashboard:admin.new-contract-option.number-type') }</option>
                <option value="2">{ t('dashboard:admin.new-contract-option.identifier-type') }</option>
                <option value="3">{ t('dashboard:admin.new-contract-option.state-type') }</option>
                <option value="4">{ t('dashboard:admin.new-contract-option.country-type') }</option>
                <option value="5">{ t('dashboard:admin.new-contract-option.phone-type') }</option>
                <option value="6">{ t('dashboard:admin.new-contract-option.email-type') }</option>
                <option value="7">{ t('dashboard:admin.new-contract-option.url-type') }</option>
                <option value="8">{ t('dashboard:admin.new-contract-option.date-type') }</option>
              </Field>
              <ErrorMessage name="type" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="priority">{ t('dashboard:admin.new-contract-option.priority-field') }</label>
              <Field name="priority" id="priority" type="number" min="0" />
              <ErrorMessage name="priority" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="friendlyName">{ t('dashboard:admin.new-contract-option.name-field') }</label>
              <Field name="friendlyName" id="friendlyName" />
              <ErrorMessage name="friendlyName" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="longDescription">{ t('dashboard:admin.new-contract-option.description-field') }</label>
              <Field name="longDescription" id="longDescription" />
              <ErrorMessage name="longDescription" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="hint">{ t('dashboard:admin.new-contract-option.hint-field') }</label>
              <Field name="hint" id="hint" />
              <ErrorMessage name="hint" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="replacementString">{ t('dashboard:admin.new-contract-option.replacement-field') }</label>
              <Field name="replacementString" id="replacementString" />
              <ErrorMessage name="replacementString" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="minimumValue">{ t('dashboard:admin.new-contract-option.minimum-value-field') }</label>
              <Field name="minimumValue" id="minimumValue" type="number" min="-1" />
              <ErrorMessage name="minimumValue" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="maximumValue">{ t('dashboard:admin.new-contract-option.maximum-value-field') }</label>
              <Field name="maximumValue" id="maximumValue" type="number" min="-1" />
              <ErrorMessage name="maximumValue" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="isSeller">{ t('dashboard:admin.new-contract-option.seller-field') }</label>
              <Field name="isSeller" id="isSeller" as="select">
                <option value="0">{ t('dashboard:admin.new-contract-option.buyer-type') }</option>
                <option value="1">{ t('dashboard:admin.new-contract-option.seller-type') }</option>
              </Field>
              <ErrorMessage name="isSeller" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
                { t(`dashboard:admin.${key}.submit`) }
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ContractOptionForm;
