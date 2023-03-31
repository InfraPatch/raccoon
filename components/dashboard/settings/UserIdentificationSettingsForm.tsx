import { Field, Form, Formik, FormikHelpers } from 'formik';
import Button, { ButtonSize } from '@/components/common/button/Button';

import { User } from '@/db/models/auth/User';

import apiService from '@/services/apis';
import toaster from '@/lib/toaster';
import { transformDate } from '@/lib/transformDate';

import { useTranslation } from 'react-i18next';

import { UpdateUserIdentificationDetailsAPIRequest } from '@/services/apis/users/UserAPIService';

export interface UserIdentificationSettingsFormProps {
  user: User;
};

const UserIdentificationSettingsForm = ({ user }: UserIdentificationSettingsFormProps) => {
  const { t } = useTranslation([ 'common', 'dashboard', 'errors' ]);

  const handleFormSubmit = async ({
    motherName,
    motherBirthDate,
    nationality,
    personalIdentifierType,
    personalIdentifier,
    phoneNumber,
    birthDate,
    birthPlace
  }: UpdateUserIdentificationDetailsAPIRequest, { setSubmitting }: FormikHelpers<UpdateUserIdentificationDetailsAPIRequest>) => {
    try {
      await apiService.users.updateUser({
        motherName,
        motherBirthDate: motherBirthDate && new Date(motherBirthDate),
        nationality,
        personalIdentifierType,
        personalIdentifier,
        phoneNumber,
        birthDate: birthDate && new Date(birthDate),
        birthPlace
      });
      toaster.success(t('dashboard:settings.success'));
    } catch (err) {
      if (err.response?.data?.error) {
        const message = err.response.data.error;

        if (message?.length) {
          toaster.danger(t(`errors:users.${message}`));
          return;
        }
      }

      console.error(err);

      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        motherName: user.motherName,
        motherBirthDate: transformDate(user.motherBirthDate) as any,
        nationality: user.nationality,
        personalIdentifierType: user.personalIdentifierType,
        personalIdentifier: user.personalIdentifier,
        phoneNumber: user.phoneNumber,
        birthDate: transformDate(user.birthDate) as any,
        birthPlace: user.birthPlace
      }}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-field">
            <label htmlFor="motherName">{ t('dashboard:user-fields.mother-name') }:</label>
            <Field name="motherName" />
          </div>

          <div className="form-field">
            <label htmlFor="motherBirthDate">{ t('dashboard:user-fields.mother-birthdate') }:</label>
            <Field name="motherBirthDate" type="date" />
          </div>

          <div className="form-field">
            <label htmlFor="nationality">Nationality:</label>
            <Field name="nationality" />
          </div>

          <div className="form-field">
            <label htmlFor="personalIdentifierType">{ t('dashboard:user-fields.id-doc-type') }:</label>
            <Field name="personalIdentifierType" as="select">
              <option value="0">{ t('dashboard:user-fields.id-card') }</option>
              <option value="1">{ t('dashboard:user-fields.passport') }</option>
              <option value="2">{ t('dashboard:user-fields.drivers-license') }</option>
            </Field>
          </div>

          <div className="form-field">
            <label htmlFor="personalIdentifier">{ t('dashboard:user-fields.id-doc-number') }:</label>
            <Field name="personalIdentifier" />
          </div>

          <div className="form-field">
            <label htmlFor="phoneNumber">{ t('dashboard:user-fields.phone-number') }:</label>
            <Field name="phoneNumber" />
          </div>

          <div className="form-field">
            <label htmlFor="birthDate">{ t('dashboard:user-fields.birthdate') }:</label>
            <Field name="birthDate" type="date" />
          </div>

          <div className="form-field">
            <label htmlFor="birthPlace">{ t('dashboard:user-fields.birthplace') }:</label>
            <Field name="birthPlace" />
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

export default UserIdentificationSettingsForm;
