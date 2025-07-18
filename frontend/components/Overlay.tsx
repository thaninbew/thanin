'use client';

import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import styles from '../styles/Overlay.module.css';
import Frame from './Frame';
import About from './About';
import Contact from './Contact';

const Overlay = forwardRef((props, ref) => {
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

  const positionsRef = useRef(sectionScrollPositions);

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

      setLastScrollY(currentScroll);
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const returnTo = sessionStorage.getItem('returnTo');
    if (returnTo) {
      scrollToSection(returnTo as any);
      sessionStorage.removeItem('returnTo');
    }
  }, []);

  const handleSectionPositionsChange = useCallback((positions: {
    about: number;
    experiences: number;
    projects: number;
    contact: number;
  }) => {
    positionsRef.current = {
      ...positionsRef.current,
      ...positions
    };
    setSectionScrollPositions(prev => ({
      ...prev,
      ...positions
    }));
  }, []);

  const scrollToSection = (section: 'home' | 'about' | 'experiences' | 'projects' | 'contact') => {
    if (!containerRef.current) return;
    
    // Get viewport height
    const viewportHeight = window.innerHeight;
    
    // Get current positions from About component
    const position = positionsRef.current[section];
    if (position !== null) {
      // Apply the same viewport-based offset as the sidebar buttons
      const offset = viewportHeight * 0.1;
      containerRef.current.scrollTo({
        top: position - offset,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useImperativeHandle(ref, () => ({
    scrollToSection
  }));

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
            <p><strong>Hello!</strong></p>

<p>
  I'm <strong><u>Thanin Kongkiatsophon</u></strong>, also known as Bew.
</p>

<p>
  <strong>Software Engineer with experience in Digital Signal Processing and Web Development, currently a co-op at Bose Professional near Boston, MA.</strong>
</p>

<p>
  I create and transform innovative ideas into <strong>scalable, efficient, and creative software solutions.</strong>
</p>

<p>
  <i>↜ Explore my experiences and projects to see how I blend creativity with technical expertise. Feel free to also just scroll! ⤵</i>
</p>

          </div>

          {/* Thanin's Radio Section */}
          <div className={styles.radioSection}>
            <div className={styles.sectionLabel}>Thanin's Radio</div>
            <div className={styles.radioContent}>
              <div className={styles.imagePlaceholder}>
                <img src="https://res.cloudinary.com/dez4qkb8z/image/upload/v1738030646/bewsmile_b8rxkj.jpg"/>
              </div>
              <h4 className={styles.songName}>Portfolio</h4>
              <p className={styles.artistName}>Thanin Kongkiatsophon</p>
              <About 
                scrollY={scrollY} 
                onSectionPositionsChange={handleSectionPositionsChange}
                onScrollToTop={handleScrollToTop}
              />
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
});

export default Overlay;
