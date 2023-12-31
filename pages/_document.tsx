import Document, { Html, Head, Main, NextScript } from 'next/document';

class RaccoonFrontend extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en" className="theme-light">
        <Head>
          <script src="/theme.js" async></script>
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default RaccoonFrontend;
