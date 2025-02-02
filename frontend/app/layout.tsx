import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Thanin K. Portfolio',
  description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
  metadataBase: new URL('https://thanin.dev'),
  icons: {
    icon: 'https://res.cloudinary.com/dez4qkb8z/image/upload/v1738440450/portfolio/projects/images/uq5znpvme1w3gbzwgxlr.png',
  },
  openGraph: {
    title: 'Thanin K. Portfolio',
    description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
    images: ['https://res.cloudinary.com/dez4qkb8z/image/upload/v1738440450/portfolio/projects/images/uq5znpvme1w3gbzwgxlr.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thanin K. Portfolio',
    description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
    images: ['https://res.cloudinary.com/dez4qkb8z/image/upload/v1738440450/portfolio/projects/images/uq5znpvme1w3gbzwgxlr.png'],
  },
};

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
      <body>{children}</body>
    </html>
  );
} 