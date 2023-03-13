import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';
import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { User } from '@/db/models/auth/User';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'react-i18next';

import { UpdateUserProfileAPIRequest } from '@/services/apis/users/UserAPIService';

import * as UserSettingsValidator from '@/validators/UserSettingsValidator';

export interface UserSettingsFormProps {
  user: User;
};

const UserSettingsForm = ({ user }: UserSettingsFormProps) => {
  const { t } = useTranslation([ 'common', 'dashboard', 'errors' ]);

  const handleFormSubmit = async ({ name, image }: UpdateUserProfileAPIRequest, { setSubmitting }: FormikHelpers<UpdateUserProfileAPIRequest>) => {
    try {
      await apiService.users.updateUser({ name, image });
      toaster.success(t('dashboard:settings.success'));
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
      initialValues={{ name: user.name }}
      validate={UserSettingsValidator.validate(t)}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="name">{ t('dashboard:user-fields.name') }:</label>
            <Field name="name" />
            <ErrorMessage name="name" component={CompactDangerMessage} />
          </div>

          <div className="form-field">
            <label htmlFor="image">{ t('dashboard:user-fields.image') }:</label>
            <Field type="file" name="image" />
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

export default UserSettingsForm;
