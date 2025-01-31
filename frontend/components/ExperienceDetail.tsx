'use client';

import styles from '../styles/DetailPage.module.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ColorThief from 'colorthief/dist/color-thief.mjs';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { marked } from 'marked';

interface LearningOutcome {
  id?: string;
  header: string;
  description: string;
  position: number;
}

interface Experience {
  id: string;
  name: string;
  role: string;
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
  experience: Experience;
}

export default function ExperienceDetail({ experience }: Props) {
  const router = useRouter();
  const [dominantColor, setDominantColor] = useState<[number, number, number]>([0, 0, 0]);
  const [textColor, setTextColor] = useState('white');

  useEffect(() => {
    if (experience.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = experience.imageUrl;

      img.onload = () => {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setDominantColor(color);
        
        // Calculate brightness to determine text color
        const [r, g, b] = color;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setTextColor(brightness > 128 ? '#000000' : '#ffffff');
      };
    }
  }, [experience.imageUrl]);

  const handleBack = () => {
    // Store a flag in sessionStorage to indicate we're returning from experiences
    sessionStorage.setItem('returnTo', 'experiences');
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
      <button 
        className={styles.backButton}
        onClick={handleBack}
        aria-label="Go back"
        style={{ color: textColor }}
      >
        ← Back
      </button>

      <div className={styles.headerContainer}>
        <div className={styles.containerContent}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {experience.imageUrl && (
                <img 
                  src={experience.imageUrl} 
                  alt={experience.name} 
                  className={styles.mainImage}
                />
              )}
              <div className={styles.titleSection}>
                <h1 className={styles.title}>{experience.name}</h1>
                <h2 className={styles.role}>{experience.role}</h2>
                <p className={styles.dateRange}>{experience.dateRange}</p>
              </div>
            </div>
            <div className={styles.links}>
              {experience.githubUrl && (
                <a 
                  href={experience.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                  style={{ borderColor: textColor + '20' }}
                >
                  <FaGithub size={24} />
                  <span>View on GitHub</span>
                </a>
              )}
              {experience.liveUrl && (
                <a 
                  href={experience.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                  style={{ borderColor: textColor + '20' }}
                >
                  <FaExternalLinkAlt size={20} />
                  <span>Link</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.technologiesContainer}>
        <div className={styles.containerContent}>
          <div className={styles.tags}>
            {experience.technologies.map((tech, index) => (
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
                dangerouslySetInnerHTML={{ __html: marked(experience.description) }}
              />
            </div>
          </div>

          <div className={styles.learningContainer}>
            <div className={styles.containerContent}>
              <h3 className={styles.sectionTitle}>Learning Outcomes</h3>
              <div className={styles.learningOutcomes}>
                {experience.learningOutcomes?.map((outcome, index) => (
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
          {experience.gifUrl && (
            <div className={styles.gifContainer}>
              <div className={styles.containerContent}>
                <img 
                  src={experience.gifUrl} 
                  alt={`${experience.name} demo`} 
                  className={styles.gif}
                />
              </div>
            </div>
          )}
          
          {experience.extraImages && experience.extraImages.length > 0 && (
            <div className={styles.extraImagesContainer}>
              {experience.extraImages.map((imageUrl, index) => (
                <div key={index} className={styles.imageContainer}>
                  <div className={styles.containerContent}>
                    <img 
                      src={imageUrl} 
                      alt={`${experience.name} additional view ${index + 1}`} 
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