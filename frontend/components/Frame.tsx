import React, { useState, useEffect, useCallback } from 'react';
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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll progress
  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    setScrollProgress(Math.min(scrollPercent, 100));
  }, []);

  // Auto-scroll functionality with smoother scrolling
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    const scrollStep = 2; // Increased scroll step for smoother movement

    if (isPlaying) {
      scrollInterval = setInterval(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const currentScroll = window.scrollY;

        // Check if we're near the bottom
        if (windowHeight + currentScroll >= documentHeight - 10) {
          setIsPlaying(false);
          return;
        }

        window.scrollBy({
          top: scrollStep,
          behavior: 'auto' // Changed to auto for smoother continuous scrolling
        });
      }, 20); // Decreased interval for smoother animation
    }

    return () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
    };
  }, [isPlaying]);

  // Track scroll progress
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Navigation functions
  const scrollToNextSection = () => {
    const sections = Array.from(document.querySelectorAll('section, [data-section]'));
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Find the next section
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top > 10) { // Small offset to handle rounding
        window.scrollTo({
          top: currentScroll + rect.top,
          behavior: 'smooth'
        });
        return;
      }
    }
    
    // If no next section found, scroll one viewport height
    window.scrollTo({
      top: currentScroll + windowHeight,
      behavior: 'smooth'
    });
  };

  const scrollToPrevSection = () => {
    const sections = Array.from(document.querySelectorAll('section, [data-section]'));
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    let prevSectionTop = 0;
    
    // Find the previous section
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top >= -10) { // Small offset to handle rounding
        window.scrollTo({
          top: currentScroll + prevSectionTop,
          behavior: 'smooth'
        });
        return;
      }
      prevSectionTop = rect.top;
    }
    
    // If no previous section found, scroll one viewport height up
    window.scrollTo({
      top: Math.max(0, currentScroll - windowHeight),
      behavior: 'smooth'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsPlaying(false);
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight - window.innerHeight,
      behavior: 'smooth'
    });
    setIsPlaying(false);
  };

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
            onClick={scrollToTop}
            title="Skip to start"
          >
            <IoPlaySkipBackOutline size={28} />
          </button>
          <button 
            className={styles.controlButton} 
            onClick={scrollToPrevSection}
            title="Previous section"
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
            onClick={scrollToNextSection}
            title="Next section"
          >
            <IoPlayForwardOutline size={28} />
          </button>
          <button 
            className={styles.controlButton} 
            onClick={scrollToBottom}
            title="Skip to end"
          >
            <IoPlaySkipForwardOutline size={28} />
          </button>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progress} 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Frame;
