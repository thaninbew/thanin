import React from 'react';
import styles from '../styles/Overlay.module.css';

const Overlay: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        {/* Header */}
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

        {/* Content Wrapper */}
        <div className={styles.contentWrapper}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarItem}>Home</div>
            <div className={styles.sidebarItem}>About</div>
            <div className={styles.sidebarItem}>Experiences</div>
            <div className={styles.sidebarItem}>Projects</div>
            <div className={styles.sidebarItem}>Contact Me</div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <h1>Hello!</h1>
            <p>
              I’m <strong>Thanin Kongkiatsophon</strong>, also known as Bew.
            </p>
            <p>
              Software Engineer, Full-Stack Developer, and Current student in
              Boston, MA.
            </p>
            <p>
              Bringing ideas to life with scalable, user-friendly, and creative
              software solutions.
            </p>
            <p>
              <i>
                ~ See how my experiences and projects combine creativity with
                technical expertise.
              </i>
            </p>
          </div>

          {/* Thanin's Radio Section */}
          <div className={styles.radioSection}>
            <h3>Thanin’s Radio</h3>
            <p>Portfolio</p>
            <p>About the developer</p>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}></div>
      </div>
    </>
  );
};

export default Overlay;
