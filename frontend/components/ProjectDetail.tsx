'use client';

import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../styles/DetailPage.module.css';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  name: string;
  role?: string;
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

interface Props {
  project: Project;
}

export default function ProjectDetail({ project }: Props) {
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
              {project.imageUrl && (
                <img 
                  src={project.imageUrl} 
                  alt={project.name} 
                  className={styles.mainImage}
                />
              )}
              <div className={styles.titleSection}>
                <h1 className={styles.title}>{project.name}</h1>
                {project.role && <h2 className={styles.role}>{project.role}</h2>}
                <p className={styles.dateRange}>{project.dateRange}</p>
              </div>
            </div>
            <div className={styles.links}>
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <FaGithub size={24} />
                  <span>View on GitHub</span>
                </a>
              )}
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <FaExternalLinkAlt size={20} />
                  <span>View Live Demo</span>
                </a>
              )}
            </div>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.leftColumn}>
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Description</h3>
                <p className={styles.description}>{project.description}</p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Technologies</h3>
                <div className={styles.tags}>
                  {project.technologies.map((tech, index) => (
                    <span key={index} className={styles.tag}>{tech}</span>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Learning Outcomes</h3>
                <ul className={styles.learningOutcomes}>
                  {project.learningOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className={styles.rightColumn}>
              {project.gifUrl && (
                <div className={styles.gifContainer}>
                  <img 
                    src={project.gifUrl} 
                    alt={`${project.name} demo`} 
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