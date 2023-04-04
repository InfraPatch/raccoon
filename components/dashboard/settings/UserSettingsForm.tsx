import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';
import { CompactDangerMessage } from '@/components/common/message-box/DangerMessage';

import { User } from '@/db/models/auth/User';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { UpdateUserProfileAPIRequest } from '@/services/apis/users/UserAPIService';

import * as UserSettingsValidator from '@/validators/UserSettingsValidator';
import { useRouter } from 'next/router';

export interface UserSettingsFormProps {
  user: User;
  setUser: (user: User) => void;
};

const UserSettingsForm = ({ user, setUser }: UserSettingsFormProps) => {
  const router = useRouter();
  const { t } = useTranslation([ 'common', 'dashboard', 'errors' ]);

  const [ image, setImage ] = useState<File | null>(null);

  const handleFormSubmit = async ({ name }: UpdateUserProfileAPIRequest, { setSubmitting }: FormikHelpers<UpdateUserProfileAPIRequest>) => {
    try {
      const res = await apiService.users.updateUser({ name, image });

      setUser(res.user);
      toaster.success(t('dashboard:settings.success'));
    } catch (err) {
      if (err.response?.data?.message) {
        const message = err.response.data.message[router.locale] || err.response.data.error || t('errors:users.AVDH_FAILED');
        toaster.danger(message);
        return;
      } else if (err.response?.data?.error) {
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
            <input
              name="image"
              id="image"
              type="file"
              onChange={e => setImage(e.currentTarget.files[0])}
            />
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
