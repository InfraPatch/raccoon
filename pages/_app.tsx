import '@/styles/base.scss';

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
    <UserProvider>
      <main className="app">
        <Component {...pageProps} />
        <ToastContainer />
        <CookieConsent />
      </main>
    </UserProvider>
  );
};

export default appWithTranslation(App);
