import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/About.module.css';

interface AboutProps {
  scrollY: number;
}

const About: React.FC<AboutProps> = ({ scrollY }) => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Update element position and viewport height on mount and resize
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

    // Re-measure after a short delay to ensure accurate initial position
    const timeout = setTimeout(updatePositions, 100);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      clearTimeout(timeout);
    };
  }, []);

  // Update last scroll position
  useEffect(() => {
    setLastScrollY(scrollY);
  }, [scrollY]);

  // Decide which "phase" of the animation we are in
  const getAnimationState = () => {
    const triggerStart = elementTop - viewportHeight * 0.6;  // start expanding when 60% into viewport
    const expandDuration = 400;                             // expand over 400px
    const fixedDuration = 800;                              // stay fixed for 800px
    const expandEnd = triggerStart + expandDuration;
    const fixedEnd = expandEnd + fixedDuration;

    // We add 20% viewport so the element remains “fixed” a bit beyond the normal fixedEnd
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2; 

    if (scrollY < triggerStart) {
      return { phase: 'initial', progress: 0 };
    } else if (scrollY < expandEnd) {
      // Expanding from smaller size to bigger size
      const rawProgress = (scrollY - triggerStart) / expandDuration;
      // A little easing (using 1 - cos(pi/2 * t))
      const progress = 1 - Math.cos((rawProgress * Math.PI) / 2);
      return { phase: 'expanding', progress };
    } else if (scrollY < fixedElementPosition) {
      // Fully expanded and pinned/fixed
      return { phase: 'fixed', progress: 1 };
    } else {
      // Past the fixed position => "exit" phase
      return { phase: 'exit', progress: 1 };
    }
  };

  // Generate the inline styles for each animation phase
  const getStyles = () => {
    const triggerStart = elementTop - viewportHeight * 0.6;
    const expandDuration = 400;
    const fixedDuration = 800;
    const expandEnd = triggerStart + expandDuration;
    const fixedEnd = expandEnd + fixedDuration;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2;

    // The distance the page scrolls while the element is actually pinned
    // (from the end of expansion to the final "release" point).
    const pinnedDistance = fixedElementPosition - expandEnd;

    const { phase, progress } = getAnimationState();

    // Desired "fixed" size/position
    const fixedWidth = '100vh';
    const fixedHeight = '40vh';
    const fixedX = -109;      // percent to translate in X
    const fixedY = 0;         // percent to translate in Y
    const fixedTop = '20%';   // pinned 20% from top of viewport

    // Base styles
    const baseStyles = {
      width: '44vh',
      height: '30vh',
      transform: 'translateX(0) translateY(0)',
      position: 'relative' as const,
      opacity: 1,
      transition: 'all 0.3s ease'
    };

    switch (phase) {
      case 'initial':
        return baseStyles;

      case 'expanding': {
        // Expand from (44vh x 30vh) to (100vh x 40vh), also shift if needed
        const currentWidth = 44 + (100 - 44) * progress;
        const currentHeight = 30 + (40 - 30) * progress;
        return {
          width: `${currentWidth}vh`,
          height: `${currentHeight}vh`,
          transform: `translateX(${progress * fixedX}%) translateY(${progress * fixedY}%)`,
          position: 'relative' as const,
          opacity: 1,
          transition: 'all 0.3s ease'
        };
      }

      case 'fixed':
        // "Locked" in place
        return {
          width: fixedWidth,
          height: fixedHeight,
          transform: `translateX(${fixedX}%) translateY(${fixedY}%)`,
          position: 'fixed' as const,
          top: fixedTop,
          opacity: 1,
          transition: 'none'
        };

      case 'exit':
        // Return to normal flow, but offset so no jump occurs
        return {
          width: fixedWidth,
          height: fixedHeight,
          transform: `translateX(${fixedX}%) translateY(${fixedY}%)`,
          position: 'relative' as const,
          // The magic: we offset it by the distance we've scrolled while pinned
          marginTop: `${pinnedDistance}px`,
          opacity: 1,
          transition: 'none'
        };
    }
  };

  return (
    <div ref={aboutRef} className={styles.about} style={getStyles()}>
      <div className={styles.sectionLabel}>About the developer</div>
      <div className={styles.description}>
        <p>Hello!</p>
        <p>
          I'm <strong><u>Thanin Kongkiatsophon</u></strong>, also known as Bew
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
    </div>
  );
};

export default About;
