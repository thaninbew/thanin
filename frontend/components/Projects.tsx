import React, { useState, useEffect } from 'react';
import styles from '../styles/Projects.module.css';
import { FaCode } from 'react-icons/fa';
import ContentPlayer from './ContentPlayer';
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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        const publishedProjects = data
          .filter((project: Project) => project.published && project.id)
          .sort((a: Project, b: Project) => a.position - b.position);
        setProjects(publishedProjects);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string | undefined) => {
    if (!projectId) return;
    router.push(`/project/${projectId}`);
  };

  const renderProject = (project: Project, isActive: boolean) => {
    if (!project?.id) return null;
    
    return (
      <div 
        className={`${styles.projectItem} ${isActive ? styles.active : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => project.id && handleProjectClick(project.id)}
        onKeyDown={(e) => e.key === 'Enter' && project.id && handleProjectClick(project.id)}
        aria-label={`View ${project.name} project details`}
      >
        <div className={styles.projectIcon}>
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.name}
              className={styles.projectImage}
            />
          ) : (
            <FaCode size={24} />
          )}
        </div>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectName}>{project.name}</h3>
          <p className={styles.projectDescription}>{project.shortDesc}</p>
        </div>
        <span className={styles.projectDateRange}>{project.dateRange}</span>
      </div>
    );
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;
  if (!projects.length) return <div>No projects available.</div>;

  return (
    <ContentPlayer
      items={projects}
      onItemClick={handleProjectClick}
      onHoverChange={() => {}}
      renderItem={renderProject}
      title="Projects"
      description="A collection of my notable projects and contributions"
      className={styles.projectsContainer}
    />
  );
} 