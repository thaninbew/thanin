import React from 'react';
import styles from '../styles/Experiences.module.css';
import ExperiencesPlayer from './ExperiencesPlayer';

interface ExperienceItem {
  id: string;
  imageUrl?: string;  // Optional as we'll use placeholder for now
  name: string;
  role: string;
  dateRange: string;
}

// Example data - this would come from an API in the real implementation
const sampleExperiences: ExperienceItem[] = [
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

const ExperienceItem: React.FC<ExperienceItem> = ({ imageUrl, name, role, dateRange }) => {
  return (
    <div className={styles.experienceItem}>
      <div className={styles.experienceImagePlaceholder}></div>
      <div className={styles.experienceInfo}>
        <h3 className={styles.experienceName}>{name}</h3>
        <p className={styles.experienceRole}>{role}</p>
        <p className={styles.experienceDateRange}>{dateRange}</p>
      </div>
    </div>
  );
};

const Experiences: React.FC = () => {
  return (
    <div className={styles.experiencesContainer}>
      <div className={styles.experiences}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerImagePlaceholder}></div>
          <h1 className={styles.title}>Experiences</h1>
        </div>

        {/* Experience Items List */}
        <div className={styles.experiencesList}>
          {sampleExperiences.map((experience) => (
            <ExperienceItem
              key={experience.id}
              {...experience}
            />
          ))}
        </div>
      </div>
      <ExperiencesPlayer />
    </div>
  );
};

export default Experiences; 