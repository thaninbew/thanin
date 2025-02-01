import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Thanin Kongkiatsophon',
  description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
  icons: {
    icon: 'https://res.cloudinary.com/dez4qkb8z/image/upload/v1738383815/portfolio/projects/images/f2yubzhehwn4bqrtfedr.png',
  },
  openGraph: {
    title: 'Thanin Kongkiatsophon',
    description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
    images: ['https://res.cloudinary.com/dez4qkb8z/image/upload/v1738383815/portfolio/projects/images/f2yubzhehwn4bqrtfedr.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thanin Kongkiatsophon',
    description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
    images: ['https://res.cloudinary.com/dez4qkb8z/image/upload/v1738383815/portfolio/projects/images/f2yubzhehwn4bqrtfedr.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 