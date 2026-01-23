import React, { useState } from 'react';
import styles from '../styles/Frame.module.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { 
  IoPlayCircleOutline, 
  IoPauseCircleOutline, 
  IoPlaySkipBackOutline, 
  IoPlaySkipForwardOutline,
  IoPlayBackOutline,
  IoPlayForwardOutline
} from 'react-icons/io5';

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={styles.frameContainer}>
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <a 
            href="https://github.com/thaninbew" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <FaGithub size={28} />
          </a>
          <a 
            href="https://linkedin.com/in/thaninbew" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <FaLinkedin size={28} />
          </a>
          <a 
            href="mailto:bewxtt@gmail.com"
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <FaEnvelope size={28} />
          </a>
        </div>
      </div>
      {children}
      <div className={styles.footer}>
        <div className={styles.playerControls}>
          <button 
            className={styles.controlButton} 
            title="Previous track"
          >
            <IoPlaySkipBackOutline size={28} />
          </button>
          <button 
            className={styles.controlButton} 
            title="Rewind"
          >
            <IoPlayBackOutline size={28} />
          </button>
          <button 
            className={`${styles.controlButton} ${styles.playButton}`}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? 
              <IoPauseCircleOutline size={36} /> : 
              <IoPlayCircleOutline size={36} />
            }
          </button>
          <button 
            className={styles.controlButton} 
            title="Fast forward"
          >
            <IoPlayForwardOutline size={28} />
          </button>
          <button 
            className={styles.controlButton} 
            title="Next track"
          >
            <IoPlaySkipForwardOutline size={28} />
          </button>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progress} 
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Frame;
