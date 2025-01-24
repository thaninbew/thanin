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

  // Determine animation phase
  const getAnimationState = () => {
    const triggerStart = elementTop - viewportHeight * 0.6;  // start expanding ~60% into viewport
    const expandDuration = 400;
    const fixedDuration = 800;
    const expandEnd = triggerStart + expandDuration;
    const fixedEnd = expandEnd + fixedDuration;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2; // remain pinned 20% beyond fixedEnd

    if (scrollY < triggerStart) {
      return { phase: 'initial', progress: 0 };
    } else if (scrollY < expandEnd) {
      // Expanding from smaller to bigger
      const rawProgress = (scrollY - triggerStart) / expandDuration;
      const progress = 1 - Math.cos((rawProgress * Math.PI) / 2); // easing
      return { phase: 'expanding', progress };
    } else if (scrollY < fixedElementPosition) {
      // Fully expanded + pinned
      return { phase: 'fixed', progress: 1 };
    } else {
      // Exit phase
      return { phase: 'exit', progress: 1 };
    }
  };

  // Compute inline styles for each phase
  const getStyles = () => {
    const triggerStart = elementTop - viewportHeight * 0.6;
    const expandDuration = 400;
    const fixedDuration = 800;
    const expandEnd = triggerStart + expandDuration;
    const fixedEnd = expandEnd + fixedDuration;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2;
    const pinnedDistance = fixedElementPosition - expandEnd;

    const { phase, progress } = getAnimationState();

    // Initial & final dimensions
    const initialWidth = 44;
    const finalWidth = 100;
    const initialHeight = 30;
    const finalHeight = 40;

    // Final transform shifts
    const finalX = -109;
    const finalY = 0;

    // This sets the pinned top to 10% of the viewport (since 0.6/6 = 0.1 = 10%)
    const dynamicTopPx = (viewportHeight * 0.6) / 3;

    const baseStyles = {
      width: `${initialWidth}vh`,
      height: `${initialHeight}vh`,
      transform: 'translateX(0) translateY(0)',
      position: 'relative' as const,
      opacity: 1,
      transition: 'all 0.3s ease',
    };

    switch (phase) {
      case 'initial':
        return baseStyles;

      case 'expanding': {
        const width = initialWidth + (finalWidth - initialWidth) * progress;
        const height = initialHeight + (finalHeight - initialHeight) * progress;
        // gradually move from X=0% → X=-109%, Y=0% → Y=0%
        const transform = `translateX(${finalX * progress}%) translateY(${finalY * progress}%)`;

        return {
          width: `${width}vh`,
          height: `${height}vh`,
          transform,
          position: 'relative' as const,
          opacity: 1,
          transition: 'all 0.3s ease',
        };
      }

      case 'fixed':
        // Lock in place at top=10% of the viewport
        return {
          width: `${finalWidth}vh`,
          height: `${finalHeight}vh`,
          transform: `translateX(${finalX}%) translateY(${finalY}%)`,
          position: 'fixed' as const,
          top: `${dynamicTopPx}px`, // pinned top
          opacity: 1,
          transition: 'none',
        };

      case 'exit':
        // Move back into normal flow without shrinking
        return {
          width: `${finalWidth}vh`,
          height: `${finalHeight}vh`,
          transform: `translateX(${finalX}%) translateY(${finalY}%)`,
          position: 'relative' as const,
          marginTop: `${pinnedDistance}px`, // avoids a jump
          opacity: 1,
          transition: 'none',
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
