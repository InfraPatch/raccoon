import { Field, Form, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { MakeLawyerAPIRequest } from '@/services/apis/users/UserAPIService';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'next-i18next';

const MakeLawyerForm = () => {
  const { t } = useTranslation(['dashboard', 'errors']);

  const handleFormSubmit = async (
    { email }: MakeLawyerAPIRequest,
    { setSubmitting }: FormikHelpers<MakeLawyerAPIRequest>,
  ) => {
    try {
      await apiService.users.makeLawyer({ email });
      toaster.success(t('dashboard:admin.make-lawyer.success'));
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:users.${message}`));
          return;
        }
      }

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={{ email: '' }} onSubmit={handleFormSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="email">
              {t('dashboard:admin.make-lawyer.email-field')}
            </label>
            <Field name="email" type="email" />
          </div>

          <div className="form-field">
            <Button
              size={ButtonSize.MEDIUM}
              type="submit"
              disabled={isSubmitting}
            >
              {t('dashboard:admin.make-lawyer.submit')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MakeLawyerForm;
