import React, { useState, useEffect } from 'react';
import styles from '../styles/MobilePopup.module.css';

const MobilePopup = () => {
  const [isVisible, setIsVisible] = useState(true);

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

  if (!isVisible) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <p>
          <strong>Hello!</strong> Welcome to the mobile version of my portfolio. 
          For the best experience, <strong>please visit on a desktop!</strong>
        </p>
        <button 
          className={styles.closeButton}
          onClick={() => setIsVisible(false)}
          aria-label="Close popup"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MobilePopup; 