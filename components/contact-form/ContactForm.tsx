import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import Button, { ButtonSize } from '../common/button/Button';
import { SuccessMessage } from '../common/message-box/SuccessMessage';
import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import * as ContactFormValidator from '@/validators/ContactFormValidator';
import { IContactFormFields } from './IContactFormFields';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';

const ContactForm = () => {
  const [ displayForm, setDisplayForm ] = useState(true);

  const { t } = useTranslation([ 'contact', 'errors' ]);

  const handleFormSubmit = async ({ name, email, subject, message }: IContactFormFields, { setSubmitting }: FormikHelpers<IContactFormFields>) => {
    try {
      await apiService.contact.sendEmail({ name, email, subject, message });
      setDisplayForm(false);
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:contact.${message}`, { ...err.response.data.details }));
          return;
        }
      }

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {displayForm && (
        <Formik
          initialValues={{ name: '', email: '', subject: '', message: '' }}
          validate={ContactFormValidator.validate(t)}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-field">
                <label htmlFor="name">{ t('contact:form.name') }</label>
                <Field name="name" />
                <ErrorMessage name="name" component={CompactDangerMessage} />
              </div>

              <div className="form-field">
                <label htmlFor="email">{ t('contact:form.email') }</label>
                <Field name="email" type="email" />
                <ErrorMessage name="email" component={CompactDangerMessage} />
              </div>

              <div className="form-field">
                <label htmlFor="subject">{ t('contact:form.subject') }</label>
                <Field name="subject" />
                <ErrorMessage name="subject" component={CompactDangerMessage} />
              </div>

              <div className="form-field">
                <label htmlFor="message">{ t('contact:form.message') }</label>
                <Field name="message" as="textarea" />
                <ErrorMessage name="message" component={CompactDangerMessage} />
              </div>

              <div className="form-field text-center">
                <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
                  { t('contact:form.submit') }
                </Button>
              </div>

            </Form>
          )}
        </Formik>
      )}

      {!displayForm && <SuccessMessage>{ t('contact:success') }</SuccessMessage>}
    </>
  );
};

export default ContactForm;
