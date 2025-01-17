import React from 'react';
import styles from '../styles/Overlay.module.css';

const Overlay: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.outerFrame}>
        <div className={styles.glassEffect}></div>
        <div className={styles.icons}>
          <div className={styles.iconWrapper}>
            <img
              className={styles.icon}
              src="https://c.animaapp.com/BCw7hWIC/img/---icon--github-@2x.png"
              alt="GitHub Icon"
            />
          </div>

          <div className={styles.iconWrapper}>
            <img
              className={styles.icon}
              src="https://c.animaapp.com/BCw7hWIC/img/---icon--linkedin-in-@2x.png"
              alt="LinkedIn Icon"
            />
          </div>

          <div className={styles.iconWrapper}>
            <img
              className={styles.icon}
              src="https://c.animaapp.com/BCw7hWIC/img/---icon--envelope-closed-@2x.png"
              alt="Mail Icon"
            />
          </div>

          <div className={styles.iconWrapper}>
            <img
              className={styles.icon}
              src="https://c.animaapp.com/BCw7hWIC/img/---icon--spotify-@2x.png"
              alt="Spotify Icon"
            />
          </div>
        </div>
      </div>
      <div className={styles.innerContent}>
        {/* Main website content goes here */}
        <p>Your website content goes here.</p>
      </div>
    </div>
  );
};

export default Overlay;
