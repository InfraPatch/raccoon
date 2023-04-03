import { FormEvent, useState } from 'react';

import { csrfToken } from 'next-auth/client';
import toaster from '@/lib/toaster';

import Button, { ButtonSize } from '../common/button/Button';
import Link from 'next/link';

import apiService from '@/services/apis';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const LoginForm = () => {
  const { t } = useTranslation([ 'common', 'errors', 'auth' ]);
  const router = useRouter();

  const [ sending, setSending ] = useState(false);

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const [ _, setUser ] = useCurrentUser();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);

    try {
      const token = await csrfToken();

      await apiService.credentialsAuth.signIn({
        csrfToken: token,
        email,
        password
      });

      const response = await apiService.users.getLoggedInUser();
      setUser(response.user);

      toaster.success(t('auth:signin-success', { name: response.user.name }));
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

      <div className="my-5 text-center">
        { t('auth:not-registered-yet') } <Link href="/register">{ t('auth:register-now') }</Link>
      </div>
    </form>
  );
};

export default LoginForm;
