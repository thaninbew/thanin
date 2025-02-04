import React from 'react';
import styles from '../styles/PhoneOverlay.module.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

// Simplified versions of the components for phones
const PhoneExperience = () => (
  <div className={styles.experienceList}>
    <div className={styles.experienceItem}>
      <h3>Full Stack Developer</h3>
      <p className={styles.duration}>2023 - Present</p>
      <p className={styles.company}>Northeastern University</p>
      <p className={styles.description}>
        Building full-stack applications and exploring AI integration in web development.
      </p>
    </div>
    <div className={styles.experienceItem}>
      <h3>Software Engineer</h3>
      <p className={styles.duration}>2022 - 2023</p>
      <p className={styles.company}>Previous Company</p>
      <p className={styles.description}>
        Developed scalable backend solutions and microservices architecture.
      </p>
    </div>
  </div>
);

const PhoneProjects = () => (
  <div className={styles.projectList}>
    <div className={styles.projectItem}>
      <h3>AI Music Generator</h3>
      <p className={styles.tech}>Python • TensorFlow • Web Audio API</p>
      <p className={styles.description}>
        Machine learning powered music composition tool.
      </p>
    </div>
    <div className={styles.projectItem}>
      <h3>Portfolio Website</h3>
      <p className={styles.tech}>Next.js • React • TypeScript</p>
      <p className={styles.description}>
        Responsive personal portfolio with custom animations.
      </p>
    </div>
  </div>
);

const PhoneContact = () => (
  <div className={styles.contactInfo}>
    <a href="mailto:bewxtt@gmail.com" className={styles.contactItem}>
      <FaEnvelope />
      <span>bewxtt@gmail.com</span>
    </a>
    <a href="https://github.com/thaninbew" className={styles.contactItem}>
      <FaGithub />
      <span>github.com/thaninbew</span>
    </a>
    <a href="https://linkedin.com/in/thaninbew" className={styles.contactItem}>
      <FaLinkedin />
      <span>linkedin.com/in/thaninbew</span>
    </a>
  </div>
);

const PhoneOverlay = () => {
  return (
    <div className={styles.wrapper}>
      {/* Floating Header */}
      <header className={styles.header}>
        <div className={styles.iconContainer}>
          <a href="https://github.com/thaninbew" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com/in/thaninbew" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
            <FaLinkedin size={20} />
          </a>
          <a href="mailto:bewxtt@gmail.com" className={styles.iconLink}>
            <FaEnvelope size={20} />
          </a>
        </div>
      </header>

      <div className={styles.container}>
        {/* Main Content */}
        <section className={styles.mainContent}>
          <div className={styles.sectionLabel}>Hello!</div>
          <div className={styles.mainText}>
            <h1>Thanin Kongkiatsophon</h1>
            <p className={styles.subtitle}>Full-Stack Developer & AI Enthusiast</p>
          </div>
        </section>

        {/* About Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>About</div>
          <div className={styles.content}>
            <p><strong>Software engineer combining technical expertise with creative passion.</strong></p>
            <p>Building full-stack apps and exploring AI/ML in music production at Northeastern University.</p>
          </div>
        </section>

        {/* Experiences Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Experience</div>
          <PhoneExperience />
        </section>

        {/* Projects Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Projects</div>
          <PhoneProjects />
        </section>

        {/* Contact Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Contact</div>
          <PhoneContact />
        </section>
      </div>
    </div>
  );
};

export default PhoneOverlay; 