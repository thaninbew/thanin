import { useState, useEffect } from 'react';

export type DeviceType = 'desktop' | 'tablet' | 'phone';

const BREAKPOINTS = {
  PHONE: 768,
  TABLET: 1400
} as const;

export const detectDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  const isIPad = /iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document;

  if (isIPad) return 'tablet';
  if (width < BREAKPOINTS.PHONE) return 'phone';
  if (width >= BREAKPOINTS.PHONE && width <= BREAKPOINTS.TABLET) return 'tablet';
  return 'desktop';
};

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(detectDeviceType());
    };

    // Initial detection
    handleResize();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceType;
}; 