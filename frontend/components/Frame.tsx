import React from 'react';
import styles from '../styles/Frame.module.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.frameContainer}>
      <div className={styles.header}>
        <a 
          href="https://github.com/thaninbew" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <FaGithub size={24} className={styles.icon} />
        </a>
        <a 
          href="https://linkedin.com/in/thaninbew" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.iconLink}
        >
          <FaLinkedin size={24} className={styles.icon} />
        </a>
        <a 
          href="mailto:bewxtt@gmail.com"
          className={styles.iconLink}
        >
          <FaEnvelope size={24} className={styles.icon} />
        </a>
      </div>
      {children}
      <div className={styles.footer}></div>
    </div>
  );
};

export default Frame;
