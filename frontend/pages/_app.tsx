import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import '../styles/globals.css'; // Import global CSS
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      // Save scroll position for current page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          `scroll_${window.location.href}`,
          JSON.stringify({ x: window.scrollX, y: window.scrollY })
        );
      }
    };

    const handleRouteComplete = (url: string) => {
      // Restore scroll position for new page
      if (typeof window !== 'undefined') {
        const savedScroll = sessionStorage.getItem(`scroll_${url}`);
        if (savedScroll) {
          const { x, y } = JSON.parse(savedScroll);
          setTimeout(() => window.scrollTo(x, y), 0);
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [router]);

  return <Component {...pageProps} />;
}