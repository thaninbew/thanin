import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/About.module.css';
import Experiences from './Experiences';
import Projects from './Projects';
import Contact from './Contact';

interface AboutProps {
  scrollY: number;
}

const About: React.FC<AboutProps> = ({ scrollY }) => {
  const aboutRef = useRef<HTMLDivElement>(null);

  // Track dynamic measurements
  const [elementTop, setElementTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // We'll store pinnedTopPx once, the FIRST time we hit expandEnd
  // and reuse it for all subsequent fixed phases
  const [pinnedTopPx, setPinnedTopPx] = useState<number | null>(null);

  // For detecting threshold crossing
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track if we should show Projects and Contact
  const [showProjects, setShowProjects] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Add this before getAnimationState
  const easeOut = (x: number, power: number = 3): number => {
    return 1 - Math.pow(1 - x, power);
  };

  // Measure element position & viewport size
  useEffect(() => {
    const updatePositions = () => {
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        setElementTop(rect.top + window.scrollY);
        setViewportHeight(window.innerHeight);
      }
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    window.addEventListener('scroll', updatePositions);

    // Re-measure after a short delay
    const timeout = setTimeout(updatePositions, 100);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      clearTimeout(timeout);
    };
  }, []);

  // Keep track of last known scroll position
  useEffect(() => {
    setLastScrollY(scrollY);
  }, [scrollY]);

  // Calculate our "phases"
  const getAnimationState = () => {
    // Start animation when the element is 20% from the top of the viewport
    const triggerStart = Math.max(elementTop - (viewportHeight * 0.9), 0);
    const expandDuration = viewportHeight * 0.4;
    const fixedDuration = viewportHeight * 0.8;
    const expandEnd = triggerStart + expandDuration;
    const fixedEnd = expandEnd + fixedDuration;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2;

    // Add debug logging to help track the values
    console.log({
      elementTop,
      viewportHeight,
      triggerStart,
      scrollY,
      phase: scrollY < triggerStart ? 'initial' : 
             scrollY < expandEnd ? 'expanding' :
             scrollY < fixedElementPosition ? 'fixed' : 'exit'
    });

    if (scrollY < triggerStart) {
      return { phase: 'initial', progress: 0, expandEnd };
    } else if (scrollY < expandEnd) {
      const rawProgress = (scrollY - triggerStart) / expandDuration;
      const progress = easeOut(rawProgress, 5);
      return { phase: 'expanding', progress, expandEnd };
    } else if (scrollY < fixedElementPosition) {
      return { phase: 'fixed', progress: 1, expandEnd };
    } else {
      return { phase: 'exit', progress: 1, expandEnd };
    }
  };

  const { phase, progress, expandEnd } = getAnimationState();

  // Projects appears after scrolling an additional viewport height after experiences
  const projectsThreshold = expandEnd + viewportHeight * 1.7;
  // Contact appears slightly after Projects
  const contactThreshold = projectsThreshold + viewportHeight * 0.65;

  /**
   * Measure pinnedTopPx only ONCE — the first time we cross from < expandEnd to >= expandEnd.
   * If pinnedTopPx is already set, don't overwrite it again.
   */
  useEffect(() => {
    if (pinnedTopPx == null && lastScrollY < expandEnd && scrollY >= expandEnd) {
      // We haven't measured yet, so measure now
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
        // rect.top is how far from top of viewport in px
        // We'll store that so the 'fixed' phase uses exactly that for 'top'
        setPinnedTopPx(rect.top);
      }
    }
  }, [scrollY, lastScrollY, expandEnd, pinnedTopPx]);

  useEffect(() => {
    const handleAnimations = () => {
      // Projects animation
      if (scrollY > projectsThreshold && !showProjects) {
        setShowProjects(true);
      } else if (scrollY <= projectsThreshold - viewportHeight * 0.1 && showProjects) {
        setShowProjects(false);
      }

      // Contact animation
      if (scrollY > contactThreshold && !showContact) {
        setShowContact(true);
      } else if (scrollY <= contactThreshold - viewportHeight * 0.1 && showContact) {
        setShowContact(false);
      }
    };

    handleAnimations();
  }, [scrollY, projectsThreshold, contactThreshold, showProjects, showContact, viewportHeight]);

  // Compute inline styles
  const getStyles = (): React.CSSProperties => {
    // For pinnedDistance in "exit" phase
    const fixedEnd = expandEnd + 800;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2;
    const pinnedDistance = fixedElementPosition - expandEnd;

    // Dimensions - width based on parent container percentage
    const initialWidth = 89;  // % of parent container
    const finalWidth = 80;    // vw of viewport width
    const initialHeight = 30; // vh
    const finalHeight = 75;   // vh

    // Text scaling
    const initialTextSize = 1.2;  // rem
    const finalTextSize = 1.8;    // rem
    const currentTextSize = initialTextSize + (finalTextSize - initialTextSize) * progress;

    // final transform shift - based on percentage
    const finalX = -69; // percentage shift relative to element width
    const finalY = 2;

    // Base styles
    const baseStyles: React.CSSProperties = {
      width: `${initialWidth}%`,
      height: `${initialHeight}vh`,
      transform: 'translateX(0) translateY(0)',
      position: 'relative',
      opacity: 1,
      transition: 'all 0.3s ease',
      marginTop: 0,
      fontSize: `${initialTextSize}rem`,
    };

    // Common expanded styles for both fixed and exit phases
    const expandedStyles = {
      width: `${finalWidth}vw`,
      height: `${finalHeight}vh`,
      transform: `translateX(${finalX}%) translateY(${finalY}%)`,
      fontSize: `${finalTextSize}rem`,
      display: 'flex',
      gap: '2rem',
    };

    switch (phase) {
      case 'initial':
        return baseStyles;

      case 'expanding': {
        const width = progress < 0.5 
          ? `${initialWidth}%`  // Use % for first half of animation
          : `${finalWidth}vw`;  // Switch to vw for second half
        const height = initialHeight + (finalHeight - initialHeight) * progress;
        const transform = `translateX(${finalX * progress}%) translateY(${finalY * progress}%)`;

        return {
          ...baseStyles,
          width,
          height: `${height}vh`,
          transform,
          fontSize: `${currentTextSize}rem`,
          display: 'flex',
          gap: '2rem',
        };
      }

      case 'fixed': {
        return {
          ...expandedStyles,
          position: 'fixed',
          top: '7.5vh',
          opacity: 1,
          transition: 'none',
        };
      }

      case 'exit': {
        return {
          ...expandedStyles,
          position: 'relative',
          marginTop: `${pinnedDistance}px`,
          opacity: 1,
          transition: 'none',
        };
      }
    }
  };

  const showImagePlaceholder = phase === 'fixed' || phase === 'exit';
  const showExperiences = phase === 'exit';

  return (
    <div className={styles.aboutContainer}>
      <div ref={aboutRef} className={styles.about} style={getStyles()}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionLabel}>About the developer</div>
          <div className={styles.description}>
            <p>
              I'm a software engineer, producer, and musician who combines technical expertise with creative artistry.
              I've worked on analyzing large datasets with machine learning frameworks and fine-tuning AI language models to enhance 
              their performance and usability.
            </p>
            <p>
              I'm passionate about driving innovation in AI-powered SaaS and exploring how AI can revolutionize music production workflows. 
            </p>
          </div>
        </div>
        {showImagePlaceholder && (
          <div className={styles.expandedImagePlaceholder}></div>
        )}
      </div>
      <div className={`${styles.experiencesWrapper} ${showExperiences ? styles.visible : ''}`}>
        <div className={styles.sectionWrapper}>
          <Experiences />
        </div>
        <div className={`${styles.sectionWrapper} ${showProjects ? styles.fadeIn : ''}`}>
          <Projects />
        </div>
        <div className={`${styles.sectionWrapper} ${showContact ? styles.fadeIn : ''}`}>
          <Contact />
        </div>
        <div className={`${styles.easterEggWrapper} ${styles.fadeIn}`} data-section="easter-egg">
        <div className={styles.easterEgg}>
          <h2 className={styles.easterEggTitle}>Congrats on scrolling this far! You’ve unlocked debug mode.</h2>
          <p className={styles.easterEggText}>
           Press ↑↑↓↓ B A or click me to return to the top.
          </p>
        </div>
      </div>
      </div>

      
    </div>
  );
};

export default About;
