import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Projects.module.css';
import { FaCode } from 'react-icons/fa';
import ContentPlayer from './ContentPlayer';

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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/projects');
        const data = await res.json();
        // Filter only published projects and sort by position
        const publishedProjects = data
          .filter((project: Project) => project.published)
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

  const handleProjectClick = (projectId: string) => {
    if (!projectId) return;
    window.location.href = `/project/${projectId}`;
  };

  const renderProject = (project: Project, isActive: boolean) => {
    if (!project || !project.id) return null;
    
    return (
      <Link 
        href={`/project/${project.id}`}
        className={`${styles.projectItem} ${isActive ? styles.active : ''}`}
        role="button"
        tabIndex={0}
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
      </Link>
    );
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;
  if (projects.length === 0) return <div>No projects available.</div>;

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