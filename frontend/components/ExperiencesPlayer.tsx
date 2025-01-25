import React from 'react';
import styles from '../styles/Experiences.module.css';

const ExperiencesPlayer: React.FC = () => {
  return (
    <div className={styles.experiencesPlayer}>
      <div className={styles.sectionLabel}>Now Playing</div>
      <div className={styles.playerContent}>
        <div className={styles.playerImagePlaceholder}></div>
        <h4 className={styles.playerTitle}>Experience</h4>
        <p className={styles.playerSubtitle}>Thanin Kongkiatsophon</p>
        
        {/* Player Controls */}
        <div className={styles.playerControls}>
          <div className={styles.progressBar}>
            <div className={styles.progress}></div>
          </div>
          <div className={styles.controlButtons}>
            <button className={styles.controlButton}>←</button>
            <button className={`${styles.controlButton} ${styles.playButton}`}>▶</button>
            <button className={styles.controlButton}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesPlayer;
