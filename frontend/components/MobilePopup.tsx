import React, { useState, useEffect } from 'react';
import styles from '../styles/MobilePopup.module.css';

const MobilePopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      return;
    }

    const hasSeenPopup = localStorage.getItem('hasSeenMobilePopup');
    if (!hasSeenPopup) {
      setIsVisible(true);
      localStorage.setItem('hasSeenMobilePopup', 'true');
    } else {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Add a small delay before actually closing to show the animation
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`${styles.popupOverlay} ${isClosing ? styles.closing : ''}`}>
      <div className={`${styles.popup} ${isClosing ? styles.closing : ''}`}>
        <p>
          <strong>Hello!</strong> Welcome to the compact version of my portfolio. 
          For the best experience, <strong>view on a desktop or zoom out (browser zoom).</strong>
        </p>
        <button 
          className={`${styles.closeButton} ${isClosing ? styles.closing : ''}`}
          onClick={handleClose}
          aria-label="Close popup"
          disabled={isClosing}
        >
          {isClosing ? 'Closing...' : '✕'}
        </button>
      </div>
    </div>
  );
};

export default MobilePopup; 