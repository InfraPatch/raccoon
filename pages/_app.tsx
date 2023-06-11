import '@/styles/base.scss';

import { Provider as AuthProvider } from 'next-auth/client';
import { UserProvider } from '@/components/providers/CurrentUserProvider';
import { appWithTranslation } from 'next-i18next';

import Router from 'next/router';
import NProgress from 'nprogress';

import ToastContainer from '@/components/common/toasts/ToastContainer';
import CookieConsent from '@/components/common/cookie-consent/CookieConsent';

Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

const App = ({ Component, pageProps }) => {
  return (
    <AuthProvider session={pageProps.session}>
      <UserProvider>
        <main className="app">
          <Component {...pageProps} />
          <ToastContainer />
          <CookieConsent />
        </main>
      </UserProvider>
    </AuthProvider>
  );
};

export default appWithTranslation(App);
