import 'easymde/dist/easymde.min.css';
import '../styles/globals.css'; // Import global CSS
import type { AppProps } from 'next/app';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;