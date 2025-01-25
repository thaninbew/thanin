import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Overlay.module.css';
import Frame from './Frame';
import About from './About';
import Contact from './Contact';

const Overlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScroll = container.scrollTop;
      setScrollY(currentScroll);

      // Update sidebar items position
      const sidebarItems = container.querySelectorAll(`.${styles.sidebarItem}`);
      const viewportHeight = window.innerHeight;
      const maxScroll = container.scrollHeight - viewportHeight;
      const isScrollingUp = currentScroll < lastScrollY;
      
      const itemsArray = Array.from(sidebarItems);
      if (isScrollingUp) {
        itemsArray.reverse();
      }
      
      itemsArray.forEach((item, index) => {
        const element = item as HTMLElement;
        const delay = index * 0.1; // 50ms delay between each item
        element.style.transitionDelay = `${delay}s`;
        element.style.transform = `translateY(${currentScroll}px)`;
      });

      setLastScrollY(currentScroll);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <Frame>
      <div ref={containerRef} className={styles.container}>
        {/* Content Wrapper */}
        <div className={styles.contentWrapper}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sectionLabel}>LIBRARY</div>
            <div className={styles.sidebarItem}>
              <span>Home</span>
              <div className={styles.sidebarItemDescription}>
                Folder ✦ 4 Playlists
              </div>
            </div>
            <div className={styles.sidebarItem}>
              <span>About</span>
              <div className={styles.sidebarItemDescription}>
                Playlist ✦ bew
              </div>
            </div>
            <div className={styles.sidebarItem}>
              <span>Experiences</span>
              <div className={styles.sidebarItemDescription}>
                Playlist ✦ 4 songs
              </div>
            </div>
            <div className={styles.sidebarItem}>
              <span>Projects</span>
              <div className={styles.sidebarItemDescription}>
                Playlist ✦ 3 songs
              </div>
            </div>
            <div className={styles.sidebarItem}>
              <span>Contact Me</span>
              <div className={styles.sidebarItemDescription}>
                Playlist ✦ bew
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <div className={styles.sectionLabel}>LYRICS</div>
            <p>Hello!</p>
            <p>
              I'm{' '}
              <strong>
                <u>Thanin Kongkiatsophon</u>
              </strong>
              , also known as Bew
            </p>
            <p>
              Software Engineer, Full-Stack Developer, and Current student in
              Boston, MA
            </p>
            <p>
              Bringing ideas to life with scalable, user-friendly, and creative
              software solutions.
            </p>
            <p>
              <i>
                ↜ See how my experiences and projects combine creativity with
                technical expertise.
              </i>
            </p>
          </div>

          {/* Thanin's Radio Section */}
          <div className={styles.radioSection}>
            <div className={styles.sectionLabel}>Thanin's Radio</div>
            <div className={styles.radioContent}>
              <div className={styles.imagePlaceholder}></div>
              <h4 className={styles.songName}>Portfolio</h4>
              <p className={styles.artistName}>Thanin Kongkiatsophon</p>
              <About scrollY={scrollY} />
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

export default Overlay;
