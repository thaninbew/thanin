'use client';

import React, { useEffect, useRef } from 'react';
import Overlay from '../components/Overlay';
import BackgroundLayers from '../components/Background';

export default function Home() {
  const overlayRef = useRef<{ scrollToSection: (section: string) => void }>(null);

  useEffect(() => {
    // Check if we're returning from a detail page
    const returnTo = sessionStorage.getItem('returnTo');
    if (returnTo) {
      // Clear the flag immediately to prevent re-triggering
      sessionStorage.removeItem('returnTo');
      
      // Wait for components to mount and then scroll
      setTimeout(() => {
        overlayRef.current?.scrollToSection(returnTo);
      }, 100);
    }
  }, []);

  return (
    <div>
      <BackgroundLayers />
      <Overlay ref={overlayRef} />
    </div>
  );
} 