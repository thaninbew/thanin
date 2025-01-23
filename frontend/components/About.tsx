import React from 'react';
import styles from '../styles/About.module.css';

const About: React.FC = () => {
  return (
    <div className={styles.about}>
      <div className={styles.sectionLabel}>About the developer</div>
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
  );
};

export default About;
