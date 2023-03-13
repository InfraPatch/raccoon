import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';
import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { User } from '@/db/models/auth/User';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';

import { useTranslation } from 'react-i18next';

import * as UserSettingsValidator from '@/validators/UserSettingsValidator';

import { UpdateUserPasswordAPIRequest } from '@/services/apis/users/UserAPIService';

export interface UserPasswordSettingsFormProps {
  user: User;
};

const UserPasswordSettingsForm = ({ user }: UserPasswordSettingsFormProps) => {
  const { t } = useTranslation([ 'common', 'dashboard', 'errors' ]);

  const handleFormSubmit = async ({ password, password2, oldPassword }: UpdateUserPasswordAPIRequest, { setSubmitting, resetForm }: FormikHelpers<UpdateUserPasswordAPIRequest>) => {
    try {
      await apiService.users.updateUser({ password, password2, oldPassword });
      toaster.success(t('dashboard:settings.success'));
      resetForm();
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
    <Formik
      initialValues={{ password: '', password2: '', oldPassword: '' }}
      validate={UserSettingsValidator.validate(t)}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="password">{ t('dashboard:user-fields.new-password') }:</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <label htmlFor="password2">{ t('dashboard:user-fields.new-password2') }:</label>
            <Field name="password2" type="password" />
            <ErrorMessage name="password2" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <label htmlFor="oldPassword">{ t('dashboard:user-fields.old-password') }:</label>
            <Field name="oldPassword" type="password" />
          </div>

          <div className="form-field">
            <Button size={ButtonSize.MEDIUM} type="submit" disabled={isSubmitting}>
              { t('common:save') }
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserPasswordSettingsForm;
