'use client';

import { useEffect, useState } from 'react';
import Overlay from '../components/Overlay';
import MobileOverlay from '../components/MobileOverlay';
import { isMobileOrTablet } from '../utils/deviceDetection';
import Background from '../components/Background';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(isMobileOrTablet());
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return (
    <main>
      <Background />
      {isMobile ? <MobileOverlay /> : <Overlay />}
    </main>
  );
} 