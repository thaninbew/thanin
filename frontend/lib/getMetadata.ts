import type { Metadata } from 'next';

const DEFAULT_FAVICON = 'https://res.cloudinary.com/dez4qkb8z/image/upload/v1738440450/portfolio/projects/images/uq5znpvme1w3gbzwgxlr.png';
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dez4qkb8z/image/upload/v1738440450/portfolio/projects/images/uq5znpvme1w3gbzwgxlr.png';

async function fetchSettings(): Promise<Record<string, string>> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/settings`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings for metadata:', error);
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  
  const favicon = settings.site_favicon || DEFAULT_FAVICON;
  const ogImage = settings.og_image || DEFAULT_OG_IMAGE;

  return {
    title: 'Thanin K. Portfolio',
    description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
    metadataBase: new URL('https://thanin.dev'),
    icons: {
      icon: favicon,
    },
    openGraph: {
      title: 'Thanin K. Portfolio',
      description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Thanin K. Portfolio',
      description: 'Personal portfolio website of Thanin (Bew) Kongkiatsophon showcasing projects and experiences',
      images: [ogImage],
    },
  };
}
