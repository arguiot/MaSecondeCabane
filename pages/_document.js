import Document, { Html, Head, Main, NextScript } from 'next/document'
import { CssBaseline } from '@geist-ui/react'
import { GA_TRACKING_ID } from '../lib/gtag'
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = CssBaseline.flush()

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    }
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Cloudflare Analytics */}
          {/* <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "bba464b62c9b4d8a812bf178cfc276c3", "spa": true}'></script> */}
          <script
            async
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument