'use client';

import { useEffect, useState } from 'react';
import Overlay from '../components/Overlay';
import MobileOverlay from '../components/MobileOverlay';
import PhoneOverlay from '../components/PhoneOverlay';
import Background from '../components/Background';

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'phone'>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setDeviceType('phone');
      } else if (width <= 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceType;
};

export default function Home() {
  const deviceType = useDeviceType();

  return (
    <main>
      <Background />
      {deviceType === 'phone' ? (
        <PhoneOverlay />
      ) : deviceType === 'tablet' ? (
        <MobileOverlay />
      ) : (
        <Overlay />
      )}
    </main>
  );
} 