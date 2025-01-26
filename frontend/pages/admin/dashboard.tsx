import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

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
  updatedAt: string;
}

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
  updatedAt: string;
}

type Item = Project | Experience;

interface ProjectForm {
  name: string;
  role: string;
  description: string;
  shortDesc: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string;
  learningOutcomes: string;
  dateRange: string;
  published: boolean;
}

interface ExperienceForm {
  name: string;
  role: string;
  description: string;
  shortDesc: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string;
  learningOutcomes: string;
  dateRange: string;
  published: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'experiences'>('projects');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({ 
    open: false, 
    message: '', 
    type: 'success' 
  });

  const [projectForm, setProjectForm] = useState<ProjectForm>({
    name: '',
    role: '',
    description: '',
    shortDesc: '',
    githubUrl: '',
    liveUrl: '',
    technologies: '',
    learningOutcomes: '',
    dateRange: '',
    published: false,
  });

  const [experienceForm, setExperienceForm] = useState<ExperienceForm>({
    name: '',
    role: '',
    description: '',
    shortDesc: '',
    githubUrl: '',
    liveUrl: '',
    technologies: '',
    learningOutcomes: '',
    dateRange: '',
    published: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [gifFile, setGifFile] = useState<File | null>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      fetchItems();
    }
  }, [router]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const [projectsRes, experiencesRes] = await Promise.all([
        fetch('http://localhost:3001/api/projects'),
        fetch('http://localhost:3001/api/experiences'),
      ]);

      const projectsData = await projectsRes.json();
      const experiencesData = await experiencesRes.json();

      setProjects(projectsData);
      setExperiences(experiencesData);
    } catch (error) {
      showNotification('Error fetching items', 'error');
    }
    setLoading(false);
  };

  const handleMoveItem = async (id: string, direction: 'up' | 'down') => {
    const items = activeTab === 'projects' ? [...projects] : [...experiences];
    const index = items.findIndex(item => item.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    // Update local state first for immediate feedback
    if (activeTab === 'projects') {
      setProjects(newItems as Project[]);
    } else {
      setExperiences(newItems as Experience[]);
    }

    try {
      const orderedIds = newItems.map(item => item.id);
      console.log('Attempting to reorder with IDs:', orderedIds);

      const res = await fetch(`http://localhost:3001/api/${activeTab}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ orderedIds }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Server error response:', data);
        throw new Error(data.error || 'Failed to update order');
      }

      console.log('Reorder success:', data);
      showNotification('Order updated successfully', 'success');
    } catch (error) {
      console.error('Full reorder error:', error);
      
      // Revert local state on error
      if (activeTab === 'projects') {
        setProjects([...projects]);
      } else {
        setExperiences([...experiences]);
      }
      
      showNotification(
        error instanceof Error 
          ? `Error updating order: ${error.message}` 
          : 'Error updating order',
        'error'
      );
    }
  };

  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    const commonFields = {
      name: item.name,
      description: item.description,
      shortDesc: item.shortDesc,
      dateRange: item.dateRange,
      published: item.published,
      technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : '',
      learningOutcomes: Array.isArray(item.learningOutcomes) ? item.learningOutcomes.join(', ') : '',
      githubUrl: item.githubUrl || '',
      liveUrl: item.liveUrl || '',
    };

    if ('technologies' in item && Array.isArray(item.technologies)) {
      // It's a Project
      setProjectForm({
        ...commonFields,
        role: item.role || '',
      });
    } else if ('role' in item) {
      // It's an Experience
      setExperienceForm({
        ...commonFields,
        role: item.role,
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/${activeTab}/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete item');
      
      showNotification('Item deleted successfully', 'success');
      fetchItems();
    } catch (error) {
      showNotification('Error deleting item', 'error');
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    const currentForm = activeTab === 'projects' ? projectForm : experienceForm;
    
    // Handle basic fields
    formData.append('name', currentForm.name);
    formData.append('description', currentForm.description);
    formData.append('shortDesc', currentForm.shortDesc);
    formData.append('dateRange', currentForm.dateRange);
    formData.append('published', currentForm.published.toString());
    
    // Handle role (required for experiences, optional for projects)
    if (activeTab === 'experiences' || (activeTab === 'projects' && currentForm.role)) {
      formData.append('role', currentForm.role);
    }

    // Handle URLs
    if (currentForm.githubUrl) formData.append('githubUrl', currentForm.githubUrl);
    if (currentForm.liveUrl) formData.append('liveUrl', currentForm.liveUrl);

    // Handle technologies and learning outcomes
    const technologies = currentForm.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    formData.append('technologies', JSON.stringify(technologies));

    const learningOutcomes = currentForm.learningOutcomes
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    formData.append('learningOutcomes', JSON.stringify(learningOutcomes));

    // Handle files
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (gifFile) {
      formData.append('gif', gifFile);
    }

    try {
      const url = `http://localhost:3001/api/${activeTab}${editingItem ? `/${editingItem.id}` : ''}`;
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save item');
      
      showNotification(`Item ${editingItem ? 'updated' : 'created'} successfully`, 'success');
      setIsModalOpen(false);
      resetForm();
      fetchItems();
    } catch (error) {
      showNotification(`Error ${editingItem ? 'updating' : 'creating'} item`, 'error');
      console.error('Save error:', error);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFile(null);
    setEditingItem(null);
    if (activeTab === 'projects') {
      setProjectForm({
        name: '',
        role: '',
        description: '',
        shortDesc: '',
        githubUrl: '',
        liveUrl: '',
        technologies: '',
        learningOutcomes: '',
        dateRange: '',
        published: false,
      });
    } else {
      setExperienceForm({
        name: '',
        role: '',
        description: '',
        shortDesc: '',
        githubUrl: '',
        liveUrl: '',
        technologies: '',
        learningOutcomes: '',
        dateRange: '',
        published: false,
      });
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ open: true, message, type });
  };

  const renderTable = () => {
    const items = activeTab === 'projects' ? projects : experiences;
    
    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Order</th>
              <th>Image</th>
              <th>Name</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.orderButtons}>
                    <button
                      className={`${styles.orderButton} ${index === 0 ? styles.disabled : ''}`}
                      onClick={() => handleMoveItem(item.id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      className={`${styles.orderButton} ${index === items.length - 1 ? styles.disabled : ''}`}
                      onClick={() => handleMoveItem(item.id, 'down')}
                      disabled={index === items.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className={styles.thumbnail}
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={item.published}
                      onChange={async () => {
                        try {
                          const formData = new FormData();
                          formData.append('published', (!item.published).toString());
                          
                          const res = await fetch(`http://localhost:3001/api/${activeTab}/${item.id}`, {
                            method: 'PUT',
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                            },
                            body: formData,
                          });

                          if (!res.ok) throw new Error('Failed to update published state');
                          
                          showNotification(`Item ${item.published ? 'unpublished' : 'published'} successfully`, 'success');
                          fetchItems();
                        } catch (error) {
                          showNotification('Error updating published state', 'error');
                          console.error('Update error:', error);
                        }
                      }}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={`${styles.iconButton} ${styles.editButton}`}
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
        <button
          className={`${styles.button} ${styles.addButton}`}
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          Add New {activeTab === 'projects' ? 'Project' : 'Experience'}
        </button>
      </nav>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        renderTable()
      )}

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingItem ? 'Edit' : 'Add'} {activeTab === 'projects' ? 'Project' : 'Experience'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={activeTab === 'projects' ? projectForm.name : experienceForm.name}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, name: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, name: e.target.value });
                    }
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role:</label>
                <input
                  type="text"
                  value={activeTab === 'projects' ? projectForm.role : experienceForm.role}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, role: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, role: e.target.value });
                    }
                  }}
                  required={activeTab === 'experiences'}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  value={activeTab === 'projects' ? projectForm.description : experienceForm.description}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, description: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, description: e.target.value });
                    }
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Short Description:</label>
                <input
                  type="text"
                  value={activeTab === 'projects' ? projectForm.shortDesc : experienceForm.shortDesc}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, shortDesc: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, shortDesc: e.target.value });
                    }
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>GitHub URL:</label>
                <input
                  type="url"
                  value={activeTab === 'projects' ? projectForm.githubUrl : experienceForm.githubUrl}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, githubUrl: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, githubUrl: e.target.value });
                    }
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Live URL:</label>
                <input
                  type="url"
                  value={activeTab === 'projects' ? projectForm.liveUrl : experienceForm.liveUrl}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, liveUrl: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, liveUrl: e.target.value });
                    }
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Technologies (comma-separated):</label>
                <input
                  type="text"
                  value={activeTab === 'projects' ? projectForm.technologies : experienceForm.technologies}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, technologies: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, technologies: e.target.value });
                    }
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Learning Outcomes (comma-separated):</label>
                <textarea
                  value={activeTab === 'projects' ? projectForm.learningOutcomes : experienceForm.learningOutcomes}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, learningOutcomes: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, learningOutcomes: e.target.value });
                    }
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Date Range:</label>
                <input
                  type="text"
                  value={activeTab === 'projects' ? projectForm.dateRange : experienceForm.dateRange}
                  onChange={(e) => {
                    if (activeTab === 'projects') {
                      setProjectForm({ ...projectForm, dateRange: e.target.value });
                    } else {
                      setExperienceForm({ ...experienceForm, dateRange: e.target.value });
                    }
                  }}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Image:</label>
                {editingItem?.imageUrl && (
                  <div className={styles.previewImage}>
                    <img src={editingItem.imageUrl} alt="Current" />
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  accept="image/*"
                />
              </div>
              <div className={styles.formGroup}>
                <label>GIF:</label>
                {editingItem?.gifUrl && (
                  <div className={styles.previewImage}>
                    <img src={editingItem.gifUrl} alt="Current GIF" />
                  </div>
                )}
                <input
                  type="file"
                  onChange={(e) => setGifFile(e.target.files?.[0] || null)}
                  accept="image/gif"
                />
              </div>
            </form>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles.saveButton}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Confirm Delete</h2>
              <button
                className={styles.closeButton}
                onClick={() => setDeleteConfirmOpen(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              Are you sure you want to delete this item?
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`${styles.button} ${styles.deleteButton}`}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.open && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.message}
          <button
            className={styles.closeButton}
            onClick={() => setNotification({ ...notification, open: false })}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
} 