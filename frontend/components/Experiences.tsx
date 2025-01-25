import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Experiences.module.css';
import { Experience } from '../types';
import { IoPlayBackOutline, IoPlayForwardOutline, IoPlayOutline } from 'react-icons/io5';

// Example data - this would come from an API in the real implementation
const sampleExperiences = [
  {
    id: '1',
    name: 'Cursor',
    role: 'Software Engineer Intern',
    dateRange: '05/2023 - 08/2023'
  },
  {
    id: '2',
    name: 'Anthropic',
    role: 'Machine Learning Engineer',
    dateRange: '01/2023 - 04/2023'
  },
  {
    id: '3',
    name: 'Google',
    role: 'Software Engineer',
    dateRange: '06/2022 - Present'
  }
];

export default function Experiences() {
  const router = useRouter();

  const handleExperienceClick = (experienceId: string) => {
    router.push(`/experience/${experienceId}`);
  };

  return (
    <div className={styles.experiencesContainer}>
      <div className={styles.experiences}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerImagePlaceholder}></div>
            <h1 className={styles.title}>Experience</h1>
          </div>
          <p className={styles.description}>
            My professional journey and achievements
          </p>
        </div>

        <div className={styles.separator}></div>

        <div className={styles.experiencesList}>
          {sampleExperiences.map((experience) => (
            <div 
              key={experience.id} 
              className={styles.experienceItem}
              onClick={() => handleExperienceClick(experience.id)}
            >
              <div className={styles.experienceImagePlaceholder}></div>
              <div className={styles.experienceInfo}>
                <h3 className={styles.experienceName}>{experience.name}</h3>
                <p className={styles.experienceRole}>{experience.role}</p>
              </div>
              <span className={styles.experienceDateRange}>{experience.dateRange}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.experiencesPlayer}>
        <div className={styles.sectionLabel}>Now Playing</div>
        <div className={styles.playerContent}>
          <div className={styles.playerImagePlaceholder}></div>
          <h2 className={styles.playerTitle}>Selected Experience</h2>
          <p className={styles.playerSubtitle}>Click an experience to view details</p>
          
          <div className={styles.playerControls}>
            <div className={styles.progressBar}>
              <div className={styles.progress}></div>
            </div>
            <div className={styles.controlButtons}>
              <button className={styles.controlButton}>
                <IoPlayBackOutline size={33} />
              </button>
              <button className={`${styles.playButton} ${styles.circular}`}>
                <IoPlayOutline size={33} />
              </button>
              <button className={styles.controlButton}>
                <IoPlayForwardOutline size={33} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 