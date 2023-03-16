import { ErrorMessage, Form, Field, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '../common/button/Button';
import { CompactDangerMessage } from '../common/message-box/DangerMessage';

import * as RegisterFormValidator from '@/validators/RegisterFormValidator';
import { CredentialsRegisterAPIRequest } from '@/services/apis/auth/CredentialsAuthAPIService';

import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import toaster from '@/lib/toaster';
import apiService from '@/services/apis';

const RegisterForm = () => {
  const { t } = useTranslation([ 'common', 'auth', 'errors' ]);

  const router = useRouter();

  const handleFormSubmit = async ({ name, email, password, password2 }: CredentialsRegisterAPIRequest, { setSubmitting }: FormikHelpers<CredentialsRegisterAPIRequest>) => {
    try {
      await apiService.credentialsAuth.register({ name, email, password, password2 });
      toaster.success(t('auth:signin-success', { name }));
      router.push('/login');
    } catch (err) {
      const message = err.response?.data?.error;

      if (message && message !== 'INTERNAL_SERVER_ERROR') {
        toaster.danger(t(`errors:users.${message}`, { ...err.response.data.details }));
        return;
      }

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ name: '', email: '', password: '', password2: '' }}
        validate={RegisterFormValidator.validate(t)}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-field">
              <label htmlFor="name">{ t('auth:fields.name') }</label>
              <Field name="name" />
              <ErrorMessage name="name" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="email">{ t('auth:fields.email') }</label>
              <Field name="email" />
              <ErrorMessage name="email" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="password">{ t('auth:fields.password') }</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component={CompactDangerMessage} />
            </div>

            <div className="form-field">
              <label htmlFor="password2">{ t('auth:fields.password2') }</label>
              <Field name="password2" type="password" />
              <ErrorMessage name="password2" component={CompactDangerMessage} />
            </div>

            <div className="form-field text-center">
              <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
                { t('common:register') }
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default RegisterForm;
