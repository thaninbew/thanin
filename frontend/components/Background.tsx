import React from 'react';
import styles from '../styles/Background.module.css';
import { useSettings } from '../hooks/useSettings';

const BackgroundLayers: React.FC = () => {
  const { settings } = useSettings();
  return (
    <div className={styles.backgroundLayer}>
      {/* Layer 1: video Background */}
      <video
        className={styles.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        src={settings.background_video}
      >
        <source 
          src={settings.background_video} 
          type="video/mp4" 
        />
      </video>

      {/* Layer 2: radial gradient with 20% fill & blur */}
      <div className={styles.middleLayer}></div>

      {/* Layer 3: transparent layer with both blurs */}
      <div className={styles.topLayer}></div>
    </div>
  );
};

export default BackgroundLayers;
