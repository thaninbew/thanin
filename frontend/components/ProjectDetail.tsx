'use client';

import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from '../styles/DetailPage.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ColorThief from 'colorthief/dist/color-thief.mjs';
import { marked } from 'marked';

interface LearningOutcome {
  id?: string;
  header: string;
  description: string;
  position: number;
}

interface Project {
  id: string;
  name: string;
  role?: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  gifUrl?: string;
  extraImages?: string[];
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  learningOutcomes: LearningOutcome[];
  dateRange: string;
  position: number;
  published: boolean;
}

interface Props {
  project: Project;
}

export default function ProjectDetail({ project }: Props) {
  const router = useRouter();
  const [dominantColor, setDominantColor] = useState<[number, number, number]>([0, 0, 0]);
  const [textColor, setTextColor] = useState('white');

  useEffect(() => {
    if (project.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = project.imageUrl;

      img.onload = () => {
        const colorThief = new ColorThief();
        try {
          const color = colorThief.getColor(img);
          setDominantColor(color);
          
          // Calculate brightness
          const [r, g, b] = color;
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          setTextColor(brightness > 128 ? '#000000' : '#ffffff');
        } catch (error) {
          console.error('Color extraction failed:', error);
          setDominantColor([0, 0, 0]);
          setTextColor('#ffffff');
        }
      };
    }
  }, [project.imageUrl]);

  const handleBack = () => {
    // Store a flag in sessionStorage to indicate we're returning from projects
    sessionStorage.setItem('returnTo', 'projects');
    router.back();
  };

  const rgbaBackground = `rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.3)`;
  const rgbaBackgroundDarker = `rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, 0.8)`;

  return (
    <div 
      className={styles.pageWrapper}
      style={{
        background: `radial-gradient(circle at center, ${rgbaBackground} 0%, ${rgbaBackgroundDarker} 100%)`,
        color: textColor
      }}
    >
      {project.imageUrl && (
        <div style={{ display: 'none' }}>
          <img src={project.imageUrl} alt="" />
        </div>
      )}

      <button 
        className={styles.backButton}
        onClick={handleBack}
        aria-label="Go back"
        style={{ color: textColor }}
      >
        ← Back
      </button>

     
        <div className={styles.containerContent}>
          <div className={styles.headerContent}>
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
                  style={{ borderColor: textColor + '20' }}
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
                  style={{ borderColor: textColor + '20' }}
                >
                  <FaExternalLinkAlt size={20} />
                  <span>View Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>

      <div className={styles.technologiesContainer}>
        <div className={styles.containerContent}>
          <div className={styles.tags}>
            {project.technologies.map((tech, index) => (
              <span 
                key={index} 
                className={styles.tag}
                style={{ borderColor: textColor }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.contentLayout}>
        <div className={styles.contentLeft}>
          <div className={styles.descriptionContainer}>
            <div className={styles.containerContent}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <div 
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: marked(project.description) }}
              />
            </div>
          </div>

          <div className={styles.learningContainer}>
            <div className={styles.containerContent}>
              <h3 className={styles.sectionTitle}>Learning Outcomes</h3>
              <div className={styles.learningOutcomes}>
                {project.learningOutcomes?.map((outcome, index) => (
                  <div key={index} className={styles.learningOutcome}>
                    <h4 className={styles.learningHeader}>{outcome.header}</h4>
                    <div 
                      className={styles.learningDescription}
                      dangerouslySetInnerHTML={{ __html: marked(outcome.description) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightContent}>
          {project.gifUrl && (
            <div className={styles.gifContainer}>
              <div className={styles.containerContent}>
                <img 
                  src={project.gifUrl} 
                  alt={`${project.name} demo`} 
                  className={styles.gif}
                />
              </div>
            </div>
          )}
          
          {project.extraImages && project.extraImages.length > 0 && (
            <div className={styles.extraImagesContainer}>
              {project.extraImages.map((imageUrl, index) => (
                <div key={index} className={styles.imageContainer}>
                  <div className={styles.containerContent}>
                    <img 
                      src={imageUrl} 
                      alt={`${project.name} additional view ${index + 1}`} 
                      className={styles.extraImage}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 