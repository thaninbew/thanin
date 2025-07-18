import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/About.module.css';
import Experiences from './Experiences';
import Projects from './Projects';
import Contact from './Contact';

interface AboutProps {
  scrollY: number;
  onSectionPositionsChange?: (positions: {
    about: number;
    experiences: number;
    projects: number;
    contact: number;
  }) => void;
  onScrollToTop?: () => void;
}

const About: React.FC<AboutProps> = ({ scrollY, onSectionPositionsChange, onScrollToTop }) => {
  const aboutRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright','arrowleft', 'arrowright', 'b', 'a'];

  const [elementTop, setElementTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  // store pinnedTopPx once, the FIRST time we hit expandEnd
  // and reuse it for all subsequent fixed phases
  const [pinnedTopPx, setPinnedTopPx] = useState<number | null>(null);

  // For detecting threshold crossing
  const [lastScrollY, setLastScrollY] = useState(0);

  const [showProjects, setShowProjects] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const easeOut = (x: number, power: number = 3): number => {
    return 1 - Math.pow(1 - x, power);
  };

  const [imageWidth, setImageWidth] = useState('flex: 1');

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

    const timeout = setTimeout(updatePositions, 100);

    return () => {
      window.removeEventListener('resize', updatePositions);
      window.removeEventListener('scroll', updatePositions);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    setLastScrollY(scrollY);
  }, [scrollY]);

  const getAnimationState = () => {
    // Start animation when the element is 20% from the top of the viewport
    const triggerStart = Math.max(elementTop - (viewportHeight * 0.9), 0);
    const expandDuration = viewportHeight * 0.4;
    const fixedDuration = viewportHeight * 0.8;
    const expandEnd = triggerStart + expandDuration;
    const fixedEnd = expandEnd + fixedDuration;
    const fixedElementPosition = fixedEnd + viewportHeight * 0.2;

  

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
      if (aboutRef.current) {
        const rect = aboutRef.current.getBoundingClientRect();
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

  // Calculate positions when animation phases change
  useEffect(() => {
    if (onSectionPositionsChange) {
      const positions = {
        about: expandEnd + viewportHeight * 0.2, // When About starts expanding
        experiences: expandEnd + viewportHeight * 1.7, // When About is fixed
        projects: contactThreshold,
        contact: contactThreshold + viewportHeight * 0.85
      };
      onSectionPositionsChange(positions);
    }
  }, [expandEnd, projectsThreshold, contactThreshold, viewportHeight, onSectionPositionsChange]);

  // Add Konami code detection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!event.key) return; // Add null check for event.key
      const key = event.key.toLowerCase();
      
      // Prevent default behavior for arrow keys
      if (key.startsWith('arrowleft') || key.startsWith('arrowright')) {
        event.preventDefault();
      }
      
      console.log('Key pressed:', key);
      
      setKonamiSequence(prev => {
        const newSequence = [...prev, key];
        // Only keep the last 10 keys pressed
        if (newSequence.length > 10) {
          newSequence.shift();
        }
        
        console.log('Current sequence:', newSequence);
        console.log('Target sequence:', konamiCode);
        
        // Check if the sequence matches the Konami code
        const sequenceMatches = newSequence.join(',') === konamiCode.join(',');
        console.log('Sequence matches?', sequenceMatches);
        
        if (sequenceMatches) {
          console.log('Konami code activated! Scrolling to top...');
          onScrollToTop?.();
          return [];
        }
        
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onScrollToTop, konamiCode]);

  const handleEasterEggClick = () => {
    onScrollToTop?.();
  };

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

      default:
        return baseStyles;
    }
  };

  const showImagePlaceholder = phase === 'fixed' || phase === 'exit';
  const showExperiences = phase === 'exit';

  return (
    <div className={styles.aboutContainer}>
      <div ref={aboutRef} className={styles.about} style={getStyles()}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionLabel}>About the developer</div>
          <div ref={descriptionRef} className={styles.description}>
          <p><strong>I'm a software engineer and part time music producer</strong> who thrives at the intersection of logic and creativity.</p>

<p>I build <strong>full-stack apps</strong>, <strong>DSP algorithms</strong>, and explore <strong>AI/ML in both domains</strong>. </p>

<p>With a strong foundation in <strong>OOP and algorithms</strong> from <strong>Northeastern University, aswell as experience in contributing to real-world professional audio software</strong>, I write <strong>clean, scalable code</strong> and adapt quickly.</p>

<p>I'm driven by the mindset of <strong>moving fast and making things happen—because if not now, then when?</strong></p>

<p>Currently focused on <strong>audio programming</strong> and pushing the boundaries of <strong>software in professional audio through my co-op</strong>.</p>

          </div>
        </div>

        {showImagePlaceholder && (
          <div 
            className={styles.expandedImagePlaceholder}
            style={{ flex: '0.7' }}
          >
            <img src="https://res.cloudinary.com/dez4qkb8z/image/upload/v1738030646/bewsmile_b8rxkj.jpg" alt="Profile" />
          </div>
        )}
      </div>
      <div className={`${styles.experiencesWrapper} ${showExperiences ? styles.visible : ''}`}>
        <div className={`${styles.sectionWrapper} ${phase === 'fixed' ? 'aboutFixed' : ''}`}>
          <Experiences />
        </div>
        <div className={`${styles.sectionWrapper} ${showProjects ? `${styles.fadeIn} projectsVisible` : ''}`}>
          <Projects />
        </div>
        <div className={`${styles.sectionWrapper} ${showContact ? `${styles.fadeIn} contactVisible` : ''}`}>
          <Contact />
        </div>
        <div className={`${styles.easterEggWrapper} ${styles.fadeIn}`} 
          data-section="easter-egg"
          onClick={handleEasterEggClick}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.easterEgg}>
            <h2 className={styles.easterEggTitle}>Congrats on scrolling this far! You've unlocked cheats mode.</h2>
            <p className={styles.easterEggText}>
             Press ↑↑↓↓←→←→ B A (konami code!)  or click me to return to the top.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
