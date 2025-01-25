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

  // Store scroll positions where sections become visible
  const [sectionScrollPositions, setSectionScrollPositions] = useState({
    home: 0,
    about: null as number | null,
    experiences: null as number | null,
    projects: null as number | null,
    contact: null as number | null
  });

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
        const delay = index * 0.1;
        element.style.transitionDelay = `${delay}s`;
        element.style.transform = `translateY(${currentScroll}px)`;
      });

      // Check for sections becoming visible
      const aboutSection = container.querySelector('.aboutFixed');
      const projectsSection = container.querySelector('.projectsVisible');
      const contactSection = container.querySelector('.contactVisible');

      // Store positions when sections are fully visible
      if (aboutSection && !sectionScrollPositions.about) {
        setSectionScrollPositions(prev => ({ ...prev, about: currentScroll }));
      }
      if (projectsSection && !sectionScrollPositions.projects) {
        setSectionScrollPositions(prev => ({ ...prev, projects: currentScroll }));
      }
      if (contactSection && !sectionScrollPositions.contact) {
        setSectionScrollPositions(prev => ({ ...prev, contact: currentScroll }));
      }

      setLastScrollY(currentScroll);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, sectionScrollPositions]);

  const scrollToSection = (section: 'home' | 'about' | 'experiences' | 'projects' | 'contact') => {
    if (!containerRef.current) return;

    // Use stored positions if available, otherwise use viewport-based fallback
    const position = sectionScrollPositions[section];
    if (position !== null) {
      containerRef.current.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    } else {
      // Fallback for initial load before positions are stored
      const vh = window.innerHeight;
      let fallbackPosition;
      switch (section) {
        case 'home':
          fallbackPosition = 0;
          break;
        case 'about':
          fallbackPosition = vh * 1;
          break;
        case 'experiences':
          fallbackPosition = vh * 2.5;
          break;
        case 'projects':
          fallbackPosition = vh * 3.5;
          break;
        case 'contact':
          fallbackPosition = vh * 4.2;
          break;
      }
      containerRef.current.scrollTo({
        top: fallbackPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Frame>
      <div ref={containerRef} className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.sectionLabel}>LIBRARY</div>
            <div 
              className={styles.sidebarItem} 
              onClick={() => scrollToSection('home')}
            >
              <span>Home</span>
              <div className={styles.sidebarItemDescription}>
                Folder ✦ 4 Playlists
              </div>
            </div>
            <div 
              className={styles.sidebarItem}
              onClick={() => scrollToSection('about')}
            >
              <span>About</span>
              <div className={styles.sidebarItemDescription}>
                Playlist ✦ bew
              </div>
            </div>
            <div 
              className={styles.sidebarItem}
              onClick={() => scrollToSection('experiences')}
            >
              <span>Experiences</span>
              <div className={styles.sidebarItemDescription}>
                Playlist ✦ 4 songs
              </div>
            </div>
            <div 
              className={styles.sidebarItem}
              onClick={() => scrollToSection('projects')}
            >
              <span>Projects</span>
              <div className={styles.sidebarItemDescription}>
                Playlist ✦ 3 songs
              </div>
            </div>
            <div 
              className={styles.sidebarItem}
              onClick={() => scrollToSection('contact')}
            >
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
