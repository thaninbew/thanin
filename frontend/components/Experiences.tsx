import React, { useState, useEffect } from 'react';
import styles from '../styles/Experiences.module.css';
import { FaBuilding } from 'react-icons/fa';
import ContentPlayer from './ContentPlayer';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${backendUrl}/api/experiences`);
        if (!res.ok) throw new Error('Failed to fetch experiences');
        const data = await res.json();
        const publishedExperiences = data
          .filter((experience: Experience) => experience.published && experience.id)
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

  const handleExperienceClick = (experienceId: string | undefined) => {
    if (!experienceId || experienceId === 'null') return;
    router.push(`/experience/${experienceId}`, { scroll: false });
  };

  const renderExperience = (experience: Experience, isActive: boolean) => {
    if (!experience?.id) return null;
    
    return (
      <div 
        className={`${styles.experienceItem} ${isActive ? styles.active : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => experience.id && handleExperienceClick(experience.id)}
        onKeyDown={(e) => e.key === 'Enter' && experience.id && handleExperienceClick(experience.id)}
        aria-label={`View ${experience.name} experience details`}
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
      </div>
    );
  };

  if (loading) return <div>Loading experiences...</div>;
  if (error) return <div>{error}</div>;
  if (!experiences.length) return <div>No experiences available.</div>;

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