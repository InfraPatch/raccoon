import { FormEvent, useState } from 'react';

import { csrfToken } from 'next-auth/client';
import toaster from '@/lib/toaster';
import Button, { ButtonSize } from '../common/button/Button';

import apiService from '@/services/apis';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const { t } = useTranslation([ 'common', 'errors', 'auth' ]);
  const router = useRouter();

  const [ sending, setSending ] = useState(false);

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);

    try {
      const token = await csrfToken();

      const response = await apiService.credentialsAuth.signIn({
        csrfToken: token,
        email,
        password
      });

      toaster.success(t('auth:signin-success', response?.user?.name));
      router.push('/dashboard');
    } catch (err) {
      if (err.response?.data?.error) {
        toaster.danger(t(`errors:users.${err.response.data.error}`));
        return;
      }

      console.error(err);
      toaster.danger(t('errors:INTERNAL_SERVER_ERROR'));
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-field">
        <label htmlFor="email">{ t('auth:fields.email') }</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={e => setEmail(e.currentTarget.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">{ t('auth:fields.password') }</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={e => setPassword(e.currentTarget.value)}
        />
      </div>

      <div className="form-field text-center">
        <Button
          size={ButtonSize.MEDIUM}
          type="submit"
          disabled={sending}
        >{ t('common:log-in') }</Button>
      </div>
    </form>
  );
};

export default LoginForm;
