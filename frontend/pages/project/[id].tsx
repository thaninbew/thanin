import { useRouter } from 'next/router';
import styles from '../../styles/DetailPage.module.css';

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

interface Props {
  project: Project;
}

export async function getStaticPaths() {
  try {
    const res = await fetch('http://localhost:3000/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const projects = await res.json();

    const paths = projects
      .filter((project: Project) => project.published)
      .map((project: Project) => ({
        params: { id: project.id.toString() }
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
    const res = await fetch(`http://localhost:3000/api/projects/${params.id}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    const project = await res.json();

    return {
      props: { project },
      revalidate: 60
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}

export default function ProjectDetail({ project }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading project...</div>;
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton}>
        Back
      </button>
      <div className={styles.content}>
        {project.imageUrl && (
          <img src={project.imageUrl} alt={project.name} className={styles.mainImage} />
        )}
        <h1 className={styles.title}>{project.name}</h1>
        {project.role && <h2 className={styles.subtitle}>{project.role}</h2>}
        <p className={styles.date}>{project.dateRange}</p>
        <p className={styles.description}>{project.description}</p>
        
        <div className={styles.links}>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Live Demo
            </a>
          )}
        </div>

        {project.technologies.length > 0 && (
          <div className={styles.section}>
            <h3>Technologies</h3>
            <ul>
              {project.technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        )}

        {project.learningOutcomes.length > 0 && (
          <div className={styles.section}>
            <h3>Learning Outcomes</h3>
            <ul>
              {project.learningOutcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        )}

        {project.gifUrl && (
          <div className={styles.gifContainer}>
            <img src={project.gifUrl} alt={`${project.name} demo`} className={styles.gif} />
          </div>
        )}
      </div>
    </div>
  );
} 