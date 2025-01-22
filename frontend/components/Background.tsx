import React from 'react';
import styles from '../styles/Background.module.css';

const BackgroundLayers: React.FC = () => {
  return (
    <div className={styles.backgroundLayer}>
      {/* Layer 1: Video Background */}
      <video
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        src="/videos/bgloop.mp4" /* Replace with your video path */
      ></video>

      {/* Layer 2: Radial Gradient with 20% Fill and Blur */}
      <div className={styles.middleLayer}></div>

      {/* Layer 3: Transparent Layer with Both Blurs */}
      <div className={styles.topLayer}></div>
    </div>
  );
};

export default BackgroundLayers;
