import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/DetailPage.module.css';
import { Project, Experience } from '../../types';

export default function DetailPage() {
  const router = useRouter();
  const { type, id } = router.query;
  const [data, setData] = useState<Project | Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && type) {
      // In a real app, this would be an API call
      fetchData();
    }
  }, [id, type]);

  const fetchData = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/${type}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!data) return <div className={styles.error}>No data found</div>;

  const isProject = type === 'project';
  const title = isProject ? (data as Project).name : (data as Experience).companyName;
  const subtitle = isProject ? 'Project Details' : (data as Experience).role;

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <h2 className={styles.subtitle}>{subtitle}</h2>
        </div>

        {data.imageUrl && (
          <div className={styles.imageContainer}>
            <img src={data.imageUrl} alt={title} className={styles.image} />
          </div>
        )}

        <div className={styles.details}>
          <div className={styles.description}>
            {data.longDescription || data.description}
          </div>

          {isProject && (
            <div className={styles.links}>
              {(data as Project).githubUrl && (
                <a href={(data as Project).githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  View on GitHub
                </a>
              )}
              {(data as Project).liveUrl && (
                <a href={(data as Project).liveUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  View Live Demo
                </a>
              )}
            </div>
          )}

          <div className={styles.technologies}>
            <h3>Technologies Used</h3>
            <div className={styles.techList}>
              {data.technologies.map((tech, index) => (
                <span key={index} className={styles.techItem}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {!isProject && (
            <div className={styles.achievements}>
              <h3>Key Achievements</h3>
              <ul>
                {(data as Experience).achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 