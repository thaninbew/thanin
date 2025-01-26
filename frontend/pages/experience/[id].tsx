import { useRouter } from 'next/router';
import styles from '../../styles/DetailPage.module.css';

interface Experience {
  id: string;
  name: string;
  role: string;
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
  experience: Experience;
}

export async function getStaticPaths() {
  try {
    const res = await fetch('http://localhost:3000/api/experiences');
    if (!res.ok) throw new Error('Failed to fetch experiences');
    const experiences = await res.json();

    const paths = experiences
      .filter((experience: Experience) => experience.published)
      .map((experience: Experience) => ({
        params: { id: experience.id.toString() }
      }));

    return {
      paths,
      fallback: true
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return { paths: [], fallback: true };
  }
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`http://localhost:3000/api/experiences/${params.id}`);
    if (!res.ok) throw new Error('Failed to fetch experience');
    const experience = await res.json();

    return {
      props: { experience },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}

export default function ExperienceDetail({ experience }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading experience...</div>;
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        Back
      </button>
      <div className={styles.content}>
        {experience.imageUrl && (
          <img src={experience.imageUrl} alt={experience.name} className={styles.mainImage} />
        )}
        <h1 className={styles.title}>{experience.name}</h1>
        <h2 className={styles.subtitle}>{experience.role}</h2>
        <p className={styles.date}>{experience.dateRange}</p>
        <p className={styles.description}>{experience.description}</p>
        
        <div className={styles.links}>
          {experience.githubUrl && (
            <a href={experience.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {experience.liveUrl && (
            <a href={experience.liveUrl} target="_blank" rel="noopener noreferrer">
              Live Demo
            </a>
          )}
        </div>

        {experience.technologies.length > 0 && (
          <div className={styles.section}>
            <h3>Technologies</h3>
            <ul>
              {experience.technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        {experience.learningOutcomes.length > 0 && (
          <div className={styles.section}>
            <h3>Learning Outcomes</h3>
            <ul>
              {experience.learningOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        )}

        {experience.gifUrl && (
          <div className={styles.gifContainer}>
            <img src={experience.gifUrl} alt={`${experience.name} demo`} className={styles.gif} />
          </div>
        )}
      </div>
    </div>
  );
} 