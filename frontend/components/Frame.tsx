import React from 'react';
import styles from '../styles/Frame.module.css';

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.frameContainer}>
      <div className={styles.header}>
        <img
          className={styles.icon}
          src="https://c.animaapp.com/BCw7hWIC/img/---icon--github-@2x.png"
          alt="GitHub Icon"
        />
        <img
          className={styles.icon}
          src="https://c.animaapp.com/BCw7hWIC/img/---icon--linkedin-in-@2x.png"
          alt="LinkedIn Icon"
        />
        <img
          className={styles.icon}
          src="https://c.animaapp.com/BCw7hWIC/img/---icon--envelope-closed-@2x.png"
          alt="Mail Icon"
        />
      </div>
      {children}
      <div className={styles.footer}></div>
    </div>
  );
};

export default Frame;
