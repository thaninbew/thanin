import React from 'react';
import styles from '../styles/Background.module.css';

const BackgroundLayers: React.FC = () => {
  return (
    <div className={styles.backgroundLayer}>
      {/* Layer 1: video Background */}
      <video
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        src="https://res.cloudinary.com/dez4qkb8z/video/upload/v1738030613/bgloop_kjjfvz.mp4" 
      ></video>

      {/* Layer 2: radial gradient with 20% fill & blur */}
      <div className={styles.middleLayer}></div>

      {/* Layer 3: transparent layer with both blurs */}
      <div className={styles.topLayer}></div>
    </div>
  );
};

export default BackgroundLayers;
