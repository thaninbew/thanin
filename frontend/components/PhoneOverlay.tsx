import React, { useState, useEffect } from 'react';
import styles from '../styles/PhoneOverlay.module.css';
import { FaGithub, FaLinkedin, FaEnvelope, FaBuilding, FaCode } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Experience {
  id: string;
  name: string;
  role: string;
  description: string;
  shortDesc: string;
  imageUrl?: string;
  dateRange: string;
  position: number;
  published: boolean;
}

interface Project {
  id: string;
  name: string;
  shortDesc: string;
  imageUrl?: string;
  dateRange: string;
  position: number;
  published: boolean;
}

const PhoneExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${backendUrl}/api/experiences`);
        if (!res.ok) throw new Error('Failed to fetch experiences');
        const data = await res.json();
        const publishedExperiences = data
          .filter((exp: Experience) => exp.published && exp.id)
          .sort((a: Experience, b: Experience) => a.position - b.position);
        setExperiences(publishedExperiences);
      } catch (err) {
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleExperienceClick = (experienceId: string) => {
    router.push(`/experience/${experienceId}`, { scroll: false });
  };

  if (loading) return <div>Loading experiences...</div>;

  return (
    <div className={styles.experienceList}>
      {experiences.map((exp) => (
        <div 
          key={exp.id}
          className={styles.experienceItem}
          onClick={() => handleExperienceClick(exp.id)}
        >
          <div className={styles.experienceIcon}>
            {exp.imageUrl ? (
              <img src={exp.imageUrl} alt={exp.name} className={styles.itemImage} />
            ) : (
              <FaBuilding size={20} />
            )}
          </div>
          <div className={styles.itemInfo}>
            <h3>{exp.name}</h3>
            <p className={styles.itemRole}>{exp.role}</p>
          </div>
          <span className={styles.itemDate}>{exp.dateRange}</span>
        </div>
      ))}
    </div>
  );
};

const PhoneProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const res = await fetch(`${backendUrl}/api/projects`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        const publishedProjects = data
          .filter((proj: Project) => proj.published && proj.id)
          .sort((a: Project, b: Project) => a.position - b.position);
        setProjects(publishedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`, { scroll: false });
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className={styles.projectList}>
      {projects.map((proj) => (
        <div 
          key={proj.id}
          className={styles.projectItem}
          onClick={() => handleProjectClick(proj.id)}
        >
          <div className={styles.projectIcon}>
            {proj.imageUrl ? (
              <img src={proj.imageUrl} alt={proj.name} className={styles.itemImage} />
            ) : (
              <FaCode size={20} />
            )}
          </div>
          <div className={styles.itemInfo}>
            <h3>{proj.name}</h3>
            <p className={styles.itemDescription}>{proj.shortDesc}</p>
          </div>
          <span className={styles.itemDate}>{proj.dateRange}</span>
        </div>
      ))}
    </div>
  );
};

const PhoneContact = () => (
  <div className={styles.contactInfo}>
    <a href="mailto:bewxtt@gmail.com" className={styles.contactItem}>
      <FaEnvelope />
      <span>bewxtt@gmail.com</span>
    </a>
    <a href="https://github.com/thaninbew" className={styles.contactItem}>
      <FaGithub />
      <span>github.com/thaninbew</span>
    </a>
    <a href="https://linkedin.com/in/thaninbew" className={styles.contactItem}>
      <FaLinkedin />
      <span>linkedin.com/in/thaninbew</span>
    </a>
  </div>
);

const PhoneOverlay = () => {
  return (
    <div className={styles.wrapper}>
      {/* Floating Header */}
      <header className={styles.header}>
        <div className={styles.iconContainer}>
          <a href="https://github.com/thaninbew" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com/in/thaninbew" target="_blank" rel="noopener noreferrer" className={styles.iconLink}>
            <FaLinkedin size={20} />
          </a>
          <a href="mailto:bewxtt@gmail.com" className={styles.iconLink}>
            <FaEnvelope size={20} />
          </a>
        </div>
      </header>

      <div className={styles.container}>
        {/* Main Content */}
        <section className={styles.mainContent}>
          <div className={styles.sectionLabel}>LYRICS</div>
          <div className={styles.mainText}>
            <p>
              I'm{' '}
              <strong>
                <u>Thanin Kongkiatsophon</u>
              </strong>
              , also known as Bew
            </p>
            <p>
              Software Engineer, Full-Stack Developer, and Current student in
              Boston, MA
            </p>
            <p>
            I bring ideas to life through scalable, efficient, and creative software solutions.
            </p>
            <p>
              <i>
              The desktop version of this site has 100% more animations and a 200% increase in buzzwords per second!
              </i>
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>ABOUT</div>
          <div className={styles.content}>
            <div className={styles.expandedImagePlaceholder}>
              <img src="https://res.cloudinary.com/dez4qkb8z/image/upload/v1738030646/bewsmile_b8rxkj.jpg" alt="Profile" />
            </div>
            <p><strong>I'm a software engineer, producer, and musician</strong> who thrives at the intersection of logic and creativity.</p>

            <p>I build <strong>full-stack apps</strong>, <strong>scalable backends</strong>, and explore <strong>AI/ML in music production</strong>. Over the past year, I've dived deep into <strong>web development, backend architecture, and machine learning</strong>, constantly learning and improving.</p>

            <p>With a strong foundation in <strong>OOP and algorithms</strong> from <strong>Northeastern University</strong>, I write <strong>clean, scalable code</strong> and adapt quickly—because <em>if not now, then when?</em></p>

            <p>Currently focused on <strong>AI-powered SaaS</strong> and pushing the boundaries of <strong>AI in music production</strong>.</p>
          </div>
        </section>

        {/* Experiences Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>EXPERIENCES</div>
          <PhoneExperience />
        </section>

        {/* Projects Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>PROJECTS</div>
          <PhoneProjects />
        </section>

        {/* Contact Section */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>CONTACT</div>
          <PhoneContact />
        </section>
      </div>
    </div>
  );
};

export default PhoneOverlay; 