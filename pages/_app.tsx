import '@/styles/base.scss';

import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as AuthProvider } from 'next-auth/client';
import { appWithTranslation } from 'next-i18next';

import Router from 'next/router';
import NProgress from 'nprogress';

const queryClient = new QueryClient();

Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

const App = ({ Component, pageProps }) => {
  return (
    <AuthProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default appWithTranslation(App);
