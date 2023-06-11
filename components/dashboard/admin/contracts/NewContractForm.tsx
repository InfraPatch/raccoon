import { useState } from 'react';
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { NewContractAPIResponse } from '@/services/apis/contracts/ContractAPIService';
import * as NewContractFormValidator from '@/validators/NewContractFormValidator';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { Item } from '@/db/models/items/Item';

export interface NewContractFormRequest {
  friendlyName: string;
  description: string;
  itemSlug: string;
}

interface NewContractFormProps {
  items: Item[];
}

const NewContractForm = ({ items }: NewContractFormProps) => {
  const { t } = useTranslation(['dashboard', 'errors']);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFormSubmit = async (
    { friendlyName, description, itemSlug }: NewContractFormRequest,
    { setSubmitting }: FormikHelpers<NewContractFormRequest>,
  ) => {
    try {
      const response: NewContractAPIResponse =
        await apiService.contracts.newContract({
          friendlyName,
          description,
          itemSlug,
          file,
        });
      toaster.success(t('dashboard:admin.new-contract.success'));
      router.push(`/dashboard/admin/contracts/${response.contract.id}`);
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
      initialValues={{ friendlyName: '', description: '', itemSlug: '' }}
      validate={NewContractFormValidator.validate(t)}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="friendlyName">
              {t('dashboard:admin.new-contract.name-field')}
            </label>
            <Field name="friendlyName" type="friendlyName" />
            <ErrorMessage
              name="friendlyName"
              component={CompactDangerMessage}
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">
              {t('dashboard:admin.new-contract.description-field')}
            </label>
            <Field name="description" type="description" />
            <ErrorMessage name="description" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <label htmlFor="itemSlug">
              {t('dashboard:admin.new-contract.item-field')}
            </label>
            <Field as="select" name="itemSlug">
              <option value="">
                {t('dashboard:admin.new-contract.item-field-none')}
              </option>

              {items.map((item) => (
                <option value={item.slug} key={item.slug}>
                  {item.friendlyName}
                </option>
              ))}
            </Field>
          </div>

          <div className="form-field">
            <label htmlFor="file">
              {t('dashboard:admin.new-contract.file-field')}
            </label>
            <input
              name="file"
              type="file"
              id="file"
              onChange={(e) => setFile(e.currentTarget.files[0])}
              required
            />
          </div>

          <div className="form-field">
            <Button
              size={ButtonSize.MEDIUM}
              type="submit"
              disabled={isSubmitting}
            >
              {t('dashboard:admin.new-contract.submit')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewContractForm;
