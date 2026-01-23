'use client';

import { useDeviceType } from '../utils/deviceDetection';
import Overlay from '../components/Overlay';
import PhoneOverlay from '../components/PhoneOverlay';
import Background from '../components/Background';
import MobilePopup from '../components/MobilePopup';

export default function Home() {
  const deviceType = useDeviceType();
  const isMobileDevice = deviceType === 'phone' || deviceType === 'tablet';

  return (
    <main>
      <Background />
      {isMobileDevice && <MobilePopup />}
      {isMobileDevice ? <PhoneOverlay /> : <Overlay />}
    </main>
  );
} 