import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Projects.module.css';
import { FaCode, FaLaptopCode, FaBrain } from 'react-icons/fa';
import ContentPlayer from './ContentPlayer';

// Example data - this would come from an API in the real implementation
const sampleProjects = [
  {
    id: '1',
    name: 'AI Music Generator',
    description: 'An AI-powered music generation tool',
    shortDesc: 'Creating the future of AI-assisted music composition',
    icon: <FaBrain size={24} />,
    playerGif: '/images/music-visualizer.gif', // Placeholder: colorful audio waveform animation
    technologies: ['Python', 'TensorFlow', 'React'],
    githubUrl: 'https://github.com/example/ai-music',
    dateRange: '2023'
  },
  {
    id: '2',
    name: 'Portfolio Website',
    description: 'Personal portfolio with Spotify-inspired design',
    shortDesc: 'A creative twist on the traditional portfolio',
    icon: <FaLaptopCode size={24} />,
    playerGif: '/images/portfolio-demo.gif', // Placeholder: smooth scrolling portfolio demo
    technologies: ['Next.js', 'TypeScript', 'CSS Modules'],
    liveUrl: 'https://portfolio.example.com',
    dateRange: '2023'
  },
  {
    id: '3',
    name: 'ML Research Paper',
    description: 'Research on advanced language models',
    shortDesc: 'Pushing the boundaries of language model capabilities',
    icon: <FaCode size={24} />,
    playerGif: '/images/neural-net.gif', // Placeholder: neural network training visualization
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

  const renderProject = (project: typeof sampleProjects[0], isActive: boolean) => (
    <div className={`${styles.projectItem} ${isActive ? styles.active : ''}`}>
      <div className={styles.projectIcon}>
        {project.icon}
      </div>
      <div className={styles.projectInfo}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
      </div>
      <span className={styles.projectDateRange}>{project.dateRange}</span>
    </div>
  );

  return (
    <ContentPlayer
      items={sampleProjects}
      onItemClick={handleProjectClick}
      onHoverChange={() => {}}
      renderItem={renderProject}
      title="Projects"
      description="A collection of my notable projects and contributions"
      className={styles.projectsContainer}
    />
  );
} 