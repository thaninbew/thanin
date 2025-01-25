import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Projects.module.css';
import { Project } from '../types';
import { IoPlayBackOutline, IoPlayForwardOutline, IoPlayOutline } from 'react-icons/io5';

// Example data - this would come from an API in the real implementation
const sampleProjects = [
  {
    id: '1',
    name: 'AI Music Generator',
    description: 'An AI-powered music generation tool',
    technologies: ['Python', 'TensorFlow', 'React'],
    githubUrl: 'https://github.com/example/ai-music',
    dateRange: '2023'
  },
  {
    id: '2',
    name: 'Portfolio Website',
    description: 'Personal portfolio with Spotify-inspired design',
    technologies: ['Next.js', 'TypeScript', 'CSS Modules'],
    liveUrl: 'https://portfolio.example.com',
    dateRange: '2023'
  },
  {
    id: '3',
    name: 'ML Research Paper',
    description: 'Research on advanced language models',
    technologies: ['PyTorch', 'Transformers', 'CUDA'],
    githubUrl: 'https://github.com/example/ml-research',
    dateRange: '2022'
  }
];

export default function Projects() {
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projects}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerImagePlaceholder}></div>
            <h1 className={styles.title}>Projects</h1>
          </div>
          <p className={styles.description}>
            A collection of my notable projects and contributions
          </p>
        </div>

        <div className={styles.separator}></div>

        <div className={styles.projectsList}>
          {sampleProjects.map((project) => (
            <div 
              key={project.id} 
              className={styles.projectItem}
              onClick={() => handleProjectClick(project.id)}
            >
              <div className={styles.projectImagePlaceholder}></div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
              </div>
              <span className={styles.projectDateRange}>{project.dateRange}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.projectsPlayer}>
        <div className={styles.sectionLabel}>Now Playing</div>
        <div className={styles.playerContent}>
          <div className={styles.playerImagePlaceholder}></div>
          <h2 className={styles.playerTitle}>Selected Project</h2>
          <p className={styles.playerSubtitle}>Click a project to view details</p>
          
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