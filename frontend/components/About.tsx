import React from 'react';
import styles from '../styles/About.module.css';

interface AboutProps {
  scrollPosition: number;
}

const About: React.FC<AboutProps> = ({ scrollPosition }) => {
    console.log(scrollPosition);
    const finalPosition = 0.630194338127102; // The value to clamp at
    const realThreshold = 0.35; // Adjust this value to control where the animation completes
  
    // Scale scrollPosition to align with the final position
    const clampedScrollPosition =
      scrollPosition <= realThreshold
        ? (scrollPosition / realThreshold) * finalPosition
        : finalPosition;
  
    const expandedStyle = {
      width: `${44 + (100 - 44) * clampedScrollPosition}vh`, // Start at 38vh, expand to 100vh
      height: `${30 + (40 - 30) * clampedScrollPosition}vh`, // Start at 30vh, expand to 40vh
      borderRadius: `${0.9375 - 0.9375 * clampedScrollPosition}rem`, // Decrease border radius as scrollPosition increases
      transform: `translateX(${clampedScrollPosition * -215}%) translateY(${clampedScrollPosition * 50}%)`, // Move left and slightly down
      zIndex: 10,
    };

  return (
    <div className={styles.about} style={expandedStyle}>
      <div className={styles.sectionLabel}>About the developer</div>
      <div className={styles.description}>
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
    </div>
  );
};

export default About;
