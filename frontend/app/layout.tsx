import type { Metadata } from 'next';
import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/next';
import { generateMetadata } from '../lib/getMetadata';

export async function metadata(): Promise<Metadata> {
  return generateMetadata();
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
} 