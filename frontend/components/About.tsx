import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/About.module.css';

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
    const triggerStart = elementTop - viewportHeight * 0.6;
    const expandDuration = 400;
    const fixedDuration = 800;
    const expandEnd = triggerStart + expandDuration;
    const fixedEnd = expandEnd + fixedDuration;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2;

    if (scrollY < triggerStart) {
      return { phase: 'initial', progress: 0, expandEnd };
    } else if (scrollY < expandEnd) {
      const rawProgress = (scrollY - triggerStart) / expandDuration;
      // Use easeOut instead of cosine
      const progress = easeOut(rawProgress, 5); // Adjust power (3) to control the curve
      return { phase: 'expanding', progress, expandEnd };
    } else if (scrollY < fixedElementPosition) {
      return { phase: 'fixed', progress: 1, expandEnd };
    } else {
      return { phase: 'exit', progress: 1, expandEnd };
    }
  };

  const { phase, progress, expandEnd } = getAnimationState();

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

  // Compute inline styles
  const getStyles = (): React.CSSProperties => {
    // For pinnedDistance in "exit" phase
    const fixedEnd = expandEnd + 800;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2;
    const pinnedDistance = fixedElementPosition - expandEnd;

    // Dimensions
    const initialWidth = 44;  // vh
    const finalWidth = 160;   // vh (expanded to cover most of the width)
    const initialHeight = 30; // vh
    const finalHeight = 75;   // vh (viewport height minus header/footer with small margins)

    // Text scaling
    const initialTextSize = 1.2;  // rem
    const finalTextSize = 1.8;    // rem
    const currentTextSize = initialTextSize + (finalTextSize - initialTextSize) * progress;

    // final transform shift - adjusted to expand rightward
    const finalX = -69; // reduced leftward shift
    const finalY = 0;

    // Base styles
    const baseStyles: React.CSSProperties = {
      width: `${initialWidth}vh`,
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
      width: `${finalWidth}vh`,
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
        const width = initialWidth + (finalWidth - initialWidth) * progress;
        const height = initialHeight + (finalHeight - initialHeight) * progress;
        const transform = `translateX(${finalX * progress}%) translateY(${finalY * progress}%)`;

        return {
          ...baseStyles,
          width: `${width}vh`,
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

  return (
    <div ref={aboutRef} className={styles.about} style={getStyles()}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionLabel}>About the developer</div>
        <div className={styles.description}>
          <p>
          I'm a software engineer, producer, and musician who combines technical expertise with creative artistry.
           I’ve worked on analyzing large datasets with machine learning frameworks and fine-tuning AI language models to enhance 
           their performance and usability.</p>
           <p>
           I’m passionate about driving innovation in AI-powered SaaS and exploring how AI can revolutionize music production workflows. 
          </p>
        </div>
      </div>
      {showImagePlaceholder && (
        <div className={styles.expandedImagePlaceholder}></div>
      )}
    </div>
  );
};

export default About;
