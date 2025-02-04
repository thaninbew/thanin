import React from 'react';
import styles from '../styles/MobileOverlay.module.css';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Experiences from './Experiences';
import Projects from './Projects';
import Contact from './Contact';

const MobileOverlay = () => {
  return (
    <div className={styles.wrapper}>
      {/* Floating Header */}
      <header className={styles.header}>
        <div className={styles.iconContainer}>
          <a 
            href="https://github.com/thaninbew" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <FaGithub size={24} />
          </a>
          <a 
            href="https://linkedin.com/in/thaninbew" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.iconLink}
          >
            <FaLinkedin size={24} />
          </a>
          <a 
            href="mailto:bewxtt@gmail.com"
            className={styles.iconLink}
          >
            <FaEnvelope size={24} />
          </a>
        </div>
      </header>

      <div className={styles.container}>
        {/* Main Content */}
        <section className={styles.mainContent}>
          <div className={styles.sectionLabel}>LYRICS</div>
          <div className={styles.mainText}>
            <p>Hello!</p>
            <p>
              I'm{' '}
              <strong>
                <u>Thanin Kongkiatsophon</u>
              </strong>
              , also known as Bew
            </p>
            <p>
              Software Engineer, Full-Stack Developer, and Current student in
              Boston, MA
            </p>
            <p>
              I bring ideas to life through scalable, efficient, and creative software solutions.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>About the developer</div>
          <div className={styles.profileImage}>
            <img 
              src="https://res.cloudinary.com/dez4qkb8z/image/upload/v1738030646/bewsmile_b8rxkj.jpg" 
              alt="Profile"
            />
          </div>
          <div className={styles.content}>
            <p><strong>I'm a software engineer, producer, and musician</strong> who thrives at the intersection of logic and creativity.</p>
            <p>I build <strong>full-stack apps</strong>, <strong>scalable backends</strong>, and explore <strong>AI/ML in music production</strong>. Over the past year, I've dived deep into <strong>web development, backend architecture, and machine learning</strong>, constantly learning and improving.</p>
            <p>With a strong foundation in <strong>OOP and algorithms</strong> from <strong>Northeastern University</strong>, I write <strong>clean, scalable code</strong> and adapt quickly—because <em>if not now, then when?</em></p>
            <p>Currently focused on <strong>AI-powered SaaS</strong> and pushing the boundaries of <strong>AI in music production</strong>.</p>
          </div>
        </section>

        {/* Experiences Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Experiences</div>
          <div className={styles.content}>
            <Experiences />
          </div>
        </section>

        {/* Projects Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Projects</div>
          <div className={styles.content}>
            <Projects />
          </div>
        </section>

        {/* Contact Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Contact Me</div>
          <div className={styles.content}>
            <Contact />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MobileOverlay; 