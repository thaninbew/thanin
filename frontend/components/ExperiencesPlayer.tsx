import React from 'react';
import styles from '../styles/Experiences.module.css';
import { TbPlayerSkipBack, TbPlayerSkipForward } from 'react-icons/tb';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';

const ExperiencesPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  return (
    <div className={styles.experiencesPlayer}>
      <div className={styles.sectionLabel}>Now Playing</div>
      <div className={styles.playerContent}>
        <div className={styles.playerImagePlaceholder}></div>
        <h3 className={styles.playerTitle}>Cursor</h3>
        <p className={styles.playerSubtitle}>Software Engineer Intern</p>
        
        <div className={styles.playerControls}>
          <div className={styles.progressBar}>
            <div className={styles.progress}></div>
          </div>
          <div className={styles.controlButtons}>
            <button className={styles.controlButton}>
              <TbPlayerSkipBack size={28} />
            </button>
            <button 
              className={`${styles.controlButton} ${styles.playButton}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 
                <BsPauseFill size={26} /> : 
                <BsPlayFill size={26} style={{ marginLeft: "2px" }} />
              }
            </button>
            <button className={styles.controlButton}>
              <TbPlayerSkipForward size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesPlayer;
