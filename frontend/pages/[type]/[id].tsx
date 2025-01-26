import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../../styles/DetailPage.module.css';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

interface Item {
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

export default function DetailPage() {
  const router = useRouter();
  const { type, id } = router.query;
  const [data, setData] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && type) {
      fetchData();
    }
  }, [id, type]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/${type}s/${id}`);
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

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              {data.imageUrl && (
                <img 
                  src={data.imageUrl} 
                  alt={data.name} 
                  className={styles.mainImage}
                />
              )}
              <div className={styles.titleSection}>
                <h1 className={styles.title}>{data.name}</h1>
                {data.role && <h2 className={styles.role}>{data.role}</h2>}
                <p className={styles.dateRange}>{data.dateRange}</p>
              </div>
            </div>
            <div className={styles.links}>
              {data.githubUrl && (
                <a 
                  href={data.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <FaGithub size={24} />
                  <span>View on GitHub</span>
                </a>
              )}
              {data.liveUrl && (
                <a 
                  href={data.liveUrl} 
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
                <p className={styles.description}>{data.description}</p>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Technologies</h3>
                <div className={styles.tags}>
                  {data.technologies.map((tech, index) => (
                    <span key={index} className={styles.tag}>{tech}</span>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Learning Outcomes</h3>
                <ul className={styles.learningOutcomes}>
                  {data.learningOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </section>
            </div>

            <div className={styles.rightColumn}>
              {data.gifUrl && (
                <div className={styles.gifContainer}>
                  <img 
                    src={data.gifUrl} 
                    alt={`${data.name} demo`} 
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