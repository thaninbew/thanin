import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Experiences.module.css';
import { FaBuilding } from 'react-icons/fa';
import ContentPlayer from './ContentPlayer';

interface Experience {
  id: string;
  name: string;
  role: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  gifUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  learningOutcomes: string[];
  dateRange: string;
  position: number;
  published: boolean;
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/experiences');
        const data = await res.json();
        // Filter only published experiences and sort by position
        const publishedExperiences = data
          .filter((experience: Experience) => experience.published)
          .sort((a: Experience, b: Experience) => a.position - b.position);
        setExperiences(publishedExperiences);
      } catch (err) {
        setError('Failed to load experiences');
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleExperienceClick = (experienceId: string) => {
    if (!experienceId) return;
    window.location.href = `/experience/${experienceId}`;
  };

  const renderExperience = (experience: Experience, isActive: boolean) => {
    if (!experience || !experience.id) return null;
    
    return (
      <Link 
        href={`/experience/${experience.id}`}
        className={`${styles.experienceItem} ${isActive ? styles.active : ''}`}
        role="button"
        tabIndex={0}
      >
        <div className={styles.experienceIcon}>
          {experience.imageUrl ? (
            <img 
              src={experience.imageUrl} 
              alt={experience.name}
              className={styles.experienceImage}
            />
          ) : (
            <FaBuilding size={24} />
          )}
        </div>
        <div className={styles.experienceInfo}>
          <h3 className={styles.experienceName}>{experience.name}</h3>
          <p className={styles.experienceRole}>{experience.role}</p>
        </div>
        <span className={styles.experienceDateRange}>{experience.dateRange}</span>
      </Link>
    );
  };

  if (loading) return <div>Loading experiences...</div>;
  if (error) return <div>{error}</div>;
  if (experiences.length === 0) return <div>No experiences available.</div>;

  return (
    <ContentPlayer
      items={experiences}
      onItemClick={handleExperienceClick}
      onHoverChange={() => {}}
      renderItem={renderExperience}
      title="Experience"
      description="My professional journey and achievements"
      className={styles.experiencesContainer}
    />
  );
} 