import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('projects');
  const [file, setFile] = useState<File | null>(null);
  
  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    shortDesc: '',
    githubUrl: '',
    liveUrl: '',
    technologies: '',
    dateRange: '',
  });

  // Experience form state
  const [experienceForm, setExperienceForm] = useState({
    name: '',
    role: '',
    description: '',
    shortDesc: '',
    dateRange: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Convert technologies string to array
    const technologiesArray = projectForm.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    // Add all fields except technologies
    Object.entries(projectForm).forEach(([key, value]) => {
      if (key !== 'technologies') {
        formData.append(key, value);
      }
    });
    
    // Add properly formatted technologies
    formData.append('technologies', JSON.stringify(technologiesArray));
    
    if (file) {
      formData.append('image', file);
    }

    try {
      const res = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create project');
      alert('Project created successfully!');
      setProjectForm({
        name: '',
        description: '',
        shortDesc: '',
        githubUrl: '',
        liveUrl: '',
        technologies: '',
        dateRange: '',
      });
      setFile(null);
    } catch (error) {
      alert('Error creating project');
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(experienceForm).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (file) {
      formData.append('image', file);
    }

    try {
      const res = await fetch('http://localhost:3001/api/experiences', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create experience');
      alert('Experience created successfully!');
      setExperienceForm({
        name: '',
        role: '',
        description: '',
        shortDesc: '',
        dateRange: '',
      });
      setFile(null);
    } catch (error) {
      alert('Error creating experience');
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <button
          className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'experiences' ? styles.active : ''}`}
          onClick={() => setActiveTab('experiences')}
        >
          Experiences
        </button>
      </nav>

      {activeTab === 'projects' ? (
        <form onSubmit={handleProjectSubmit} className={styles.form}>
          <h2>Add New Project</h2>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea
              value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Short Description:</label>
            <input
              type="text"
              value={projectForm.shortDesc}
              onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>GitHub URL:</label>
            <input
              type="url"
              value={projectForm.githubUrl}
              onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Live URL:</label>
            <input
              type="url"
              value={projectForm.liveUrl}
              onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Technologies (comma-separated):</label>
            <input
              type="text"
              value={projectForm.technologies}
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Date Range:</label>
            <input
              type="text"
              value={projectForm.dateRange}
              onChange={(e) => setProjectForm({ ...projectForm, dateRange: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Image:</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*"
            />
          </div>
          <button type="submit" className={styles.button}>Add Project</button>
        </form>
      ) : (
        <form onSubmit={handleExperienceSubmit} className={styles.form}>
          <h2>Add New Experience</h2>
          <div className={styles.formGroup}>
            <label>Company Name:</label>
            <input
              type="text"
              value={experienceForm.name}
              onChange={(e) => setExperienceForm({ ...experienceForm, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Role:</label>
            <input
              type="text"
              value={experienceForm.role}
              onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea
              value={experienceForm.description}
              onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Short Description:</label>
            <input
              type="text"
              value={experienceForm.shortDesc}
              onChange={(e) => setExperienceForm({ ...experienceForm, shortDesc: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Date Range:</label>
            <input
              type="text"
              value={experienceForm.dateRange}
              onChange={(e) => setExperienceForm({ ...experienceForm, dateRange: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Image:</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*"
            />
          </div>
          <button type="submit" className={styles.button}>Add Experience</button>
        </form>
      )}
    </div>
  );
} 