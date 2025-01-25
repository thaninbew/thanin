import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Experiences.module.css';
import { FaLaptopCode, FaRobot, FaGoogle } from 'react-icons/fa';
import ContentPlayer from './ContentPlayer';

// Example data - this would come from an API in the real implementation
const sampleExperiences = [
  {
    id: '1',
    name: 'Cursor',
    role: 'Software Engineer Intern',
    description: 'Building the future of AI-powered development',
    shortDesc: 'Revolutionizing code editing with AI',
    icon: <FaLaptopCode size={24} />,
    playerGif: '/images/cursor-demo.gif', // Placeholder: IDE with AI suggestions animation
    dateRange: '05/2023 - 08/2023'
  },
  {
    id: '2',
    name: 'Anthropic',
    role: 'Machine Learning Engineer',
    description: 'Developing advanced language models',
    shortDesc: 'Pushing AI safety and capabilities forward',
    icon: <FaRobot size={24} />,
    playerGif: '/images/ai-training.gif', // Placeholder: AI model training visualization
    dateRange: '01/2023 - 04/2023'
  },
  {
    id: '3',
    name: 'Google',
    role: 'Software Engineer',
    description: 'Working on large-scale infrastructure',
    shortDesc: 'Building scalable cloud solutions',
    icon: <FaGoogle size={24} />,
    playerGif: '/images/cloud-infra.gif', // Placeholder: cloud infrastructure animation
    dateRange: '06/2022 - Present'
  }
];

export default function Experiences() {
  const router = useRouter();

  const handleExperienceClick = (experienceId: string) => {
    router.push(`/experience/${experienceId}`);
  };

  const renderExperience = (experience: typeof sampleExperiences[0], isActive: boolean) => (
    <div className={`${styles.experienceItem} ${isActive ? styles.active : ''}`}>
      <div className={styles.experienceIcon}>
        {experience.icon}
      </div>
      <div className={styles.experienceInfo}>
        <h3 className={styles.experienceName}>{experience.name}</h3>
        <p className={styles.experienceRole}>{experience.role}</p>
      </div>
      <span className={styles.experienceDateRange}>{experience.dateRange}</span>
    </div>
  );

  return (
    <ContentPlayer
      items={sampleExperiences}
      onItemClick={handleExperienceClick}
      onHoverChange={() => {}}
      renderItem={renderExperience}
      title="Experience"
      description="My professional journey and achievements"
      className={styles.experiencesContainer}
    />
  );
} 