import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Meta tags */}
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="description" content="AI-powered churn analytics dashboard for Ontop" />
      </Head>
      <body className="bg-gradient-to-br from-navy-dark via-navy-main to-navy-light min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

