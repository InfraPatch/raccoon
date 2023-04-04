import { Field, Form, Formik, FormikHelpers, ErrorMessage } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { NewItemAPIRequest, NewItemAPIResponse } from '@/services/apis/items/ItemAPIService';
import * as NewItemFormValidator from '@/validators/NewItemFormValidator';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import slugify from '@sindresorhus/slugify';

import { useState } from 'react';

const NewItemForm = () => {
  const { t } = useTranslation([ 'dashboard', 'errors' ]);
  const router = useRouter();

  const [ slug, setSlug ] = useState('');

  const updateSlug = (input: string, nonStrictEndings: boolean = false) => {
    let slugifiedString = slugify(input);

    if (nonStrictEndings && input[input.length - 1] === ' ') {
      slugifiedString += '-';
    }

    setSlug(slugifiedString.toLowerCase());
  };

  const handleFormSubmit = async ({ friendlyName, description }: NewItemAPIRequest, { setSubmitting }: FormikHelpers<NewItemAPIRequest>) => {
    try {
      const response : NewItemAPIResponse = await apiService.items.newItem({ friendlyName, slug, description });
      toaster.success(t('dashboard:admin.new-item.success'));
      router.push(`/dashboard/admin/property-categories/${response.item.slug}`);
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:items.${message}`));
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
      validate={NewItemFormValidator.validate(t)}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="friendlyName">{ t('dashboard:admin.new-item.name-field') }</label>
            <Field name="friendlyName" type="friendlyName" onKeyUp={e => updateSlug(e.currentTarget.value)} />
            <ErrorMessage name="friendlyName" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <label htmlFor="slug">{ t('dashboard:admin.new-item.slug-field') }</label>
            <input id="slug" name="slug" type="slug" value={slug} onChange={e => updateSlug(e.currentTarget.value, true)} />
          </div>

          <div className="form-field">
            <label htmlFor="description">{ t('dashboard:admin.new-item.description-field') }</label>
            <Field name="description" type="description" />
            <ErrorMessage name="description" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
              { t('dashboard:admin.new-item.submit') }
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewItemForm;
