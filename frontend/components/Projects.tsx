import React, { useState, useCallback } from 'react';
import styles from '../styles/Projects.module.css';
import { FaCode } from 'react-icons/fa';
import ContentPlayer from './ContentPlayer';
import { useRouter } from 'next/navigation';
import { usePreloader } from '../utils/usePreloader';

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
  const [clickedId, setClickedId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await fetch(`${backendUrl}/api/projects`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    return data
      .filter((project: Project) => project.published && project.id)
      .sort((a: Project, b: Project) => a.position - b.position);
  }, []);

  const { data: projects, loading, error } = usePreloader<Project[]>(fetchProjects);

  const handleProjectClick = (projectId: string | undefined) => {
    if (!projectId || projectId === 'null') return;
    setClickedId(projectId);
    router.push(`/project/${projectId}`, { scroll: false });
  };

  const renderProject = (project: Project, isActive: boolean) => {
    if (!project?.id) return null;
    
    const isClicked = project.id === clickedId;
    
    return (
      <div 
        className={`${styles.projectItem} ${isActive ? styles.active : ''} ${isClicked ? styles.clicked : ''}`}
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
              loading="eager" // Force immediate loading
            />
          ) : (
            <FaCode size={24} />
          )}
        </div>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectName}>
            {isClicked ? 'Loading...' : project.name}
          </h3>
          <p className={styles.projectDescription}>{project.shortDesc}</p>
        </div>
        <span className={styles.projectDateRange}>{project.dateRange}</span>
      </div>
    );
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>{error}</div>;
  if (!projects?.length) return <div>No projects available.</div>;

  return (
    <ContentPlayer
      items={projects}
      onItemClick={handleProjectClick}
      onHoverChange={() => {}}
      renderItem={renderProject}
      title="Projects"
      description="A collection of my notable projects and contributions. Click on a project to learn more."
      className={styles.projectsContainer}
    />
  );
} 