'use client';

import styles from '../styles/DetailPage.module.css';
import { useRouter } from 'next/navigation';

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  gifUrl?: string;
  technologies: string[];
  learningOutcomes: string[];
  dateRange: string;
  position: number;
  published: boolean;
}

interface Props {
  experience: Experience;
}

export default function ExperienceDetail({ experience }: Props) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
    // Prevent scroll restoration
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={handleBack}
        aria-label="Go back"
      >
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              {experience.imageUrl && (
                <img 
                  src={experience.imageUrl} 
                  alt={experience.company} 
                  className={styles.mainImage}
                />
              )}
              <div className={styles.titleSection}>
                <h1 className={styles.title}>{experience.company}</h1>
                <h2 className={styles.role}>{experience.role}</h2>
                <p className={styles.dateRange}>{experience.dateRange}</p>
              </div>
            </div>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.leftColumn}>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.description}>{experience.description}</p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Technologies</h3>
                <div className={styles.tags}>
                  {experience.technologies.map((tech, index) => (
                    <span key={index} className={styles.tag}>{tech}</span>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Learning Outcomes</h3>
                <ul className={styles.learningOutcomes}>
                  {experience.learningOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className={styles.rightColumn}>
              {experience.gifUrl && (
                <div className={styles.gifContainer}>
                  <img 
                    src={experience.gifUrl} 
                    alt={`${experience.company} demo`} 
                    className={styles.gif}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 