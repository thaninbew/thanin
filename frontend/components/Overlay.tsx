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
            <div className={styles.sectionLabel}>LIBRARY</div>
            <div className={styles.sidebarItem}>
              <span>Home</span>
              <div className={styles.sidebarItemDescription}>Folder ✦ 4 Playlists</div>
            </div>
            <div className={styles.sidebarItem}>
              <span>About</span>
              <div className={styles.sidebarItemDescription}>Playlist ✦ bew</div>
            </div>
            <div className={styles.sidebarItem}>
              <span>Experiences</span>
              <div className={styles.sidebarItemDescription}>Playlist ✦ 4 songs</div>
            </div>
            <div className={styles.sidebarItem}>
              <span>Projects</span>
              <div className={styles.sidebarItemDescription}>Playlist ✦ 3 songs</div>
            </div>
            <div className={styles.sidebarItem}>
              <span>Contact Me</span>
              <div className={styles.sidebarItemDescription}>Playlist ✦ bew</div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.sectionLabel}>LYRICS</div>
            <p>Hello!</p>
            <p>
              I’m <strong><u>Thanin Kongkiatsophon</u></strong>, also known as Bew
            </p>
            <p>
              Software Engineer, Full-Stack Developer, and Current student in Boston, MA
            </p>
            <p>
              Bringing ideas to life with scalable, user-friendly, and creative software solutions.
            </p>
            <p>
              <i>↜ See how my experiences and projects combine creativity with technical expertise.</i>
            </p>
          </div>

          {/* Thanin's Radio Section */}
          <div className={styles.radioSection}>
            <div className={styles.sectionLabel}>Thanin’s Radio</div>
            <div className={styles.radioContent}>
              <div className={styles.imagePlaceholder}></div>
              <h4 className={styles.songName}>Portfolio</h4>
              <p className={styles.artistName}>Thanin Kongkiatsophon</p>
            </div>
            <div className={styles.about}>
              <div className={styles.sectionLabel}>About the developer</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}></div>
      </div>
    </>
  );
};

export default Overlay;
