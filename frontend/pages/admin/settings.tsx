import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Admin.module.css';

interface Setting {
  key: string;
  value: string;
  description?: string;
}

const SETTINGS_CONFIG = [
  {
    key: 'site_favicon',
    label: 'Site Favicon',
    description: 'Icon shown in browser tabs',
    type: 'image',
    accept: 'image/*'
  },
  {
    key: 'og_image',
    label: 'Open Graph Image',
    description: 'Image shown when sharing site on social media',
    type: 'image',
    accept: 'image/*'
  },
  {
    key: 'profile_image',
    label: 'Profile Image',
    description: 'Your profile photo',
    type: 'image',
    accept: 'image/*'
  },
  {
    key: 'background_video',
    label: 'Background Video',
    description: 'Homepage background video',
    type: 'video',
    accept: 'video/*'
  },
  {
    key: 'experience_placeholder',
    label: 'Experience Placeholder Image',
    description: 'Default image for experiences',
    type: 'image',
    accept: 'image/*'
  }
];

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleFileUpload = async (key: string, file: File) => {
    setUploading(prev => ({ ...prev, [key]: true }));
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', SETTINGS_CONFIG.find(s => s.key === key)?.description || '');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings/upload/${key}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setSettings(prev => ({ ...prev, [key]: data.value }));
      setMessage(`✅ ${SETTINGS_CONFIG.find(s => s.key === key)?.label} updated successfully!`);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ Failed to upload ${SETTINGS_CONFIG.find(s => s.key === key)?.label}`);
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Site Settings</h1>
        <button onClick={() => router.push('/admin/dashboard')} className={styles.backButton}>
          ← Back to Dashboard
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      <div className={styles.settingsGrid}>
        {SETTINGS_CONFIG.map(config => (
          <div key={config.key} className={styles.settingCard}>
            <div className={styles.settingHeader}>
              <h3>{config.label}</h3>
              <p>{config.description}</p>
            </div>

            {settings[config.key] && (
              <div className={styles.preview}>
                {config.type === 'image' ? (
                  <img src={settings[config.key]} alt={config.label} />
                ) : (
                  <video src={settings[config.key]} controls />
                )}
              </div>
            )}

            <div className={styles.uploadSection}>
              <input
                type="file"
                accept={config.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(config.key, file);
                }}
                disabled={uploading[config.key]}
                id={`upload-${config.key}`}
                className={styles.fileInput}
              />
              <label htmlFor={`upload-${config.key}`} className={styles.uploadButton}>
                {uploading[config.key] ? 'Uploading...' : settings[config.key] ? 'Replace' : 'Upload'}
              </label>
            </div>

            {settings[config.key] && (
              <div className={styles.currentUrl}>
                <small>Current URL:</small>
                <code>{settings[config.key]}</code>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.instructions}>
        <h3>📝 Usage Instructions</h3>
        <p>After uploading assets here, update your code to use the settings API:</p>
        <pre>{`
// Fetch settings in your components
const response = await fetch('/api/settings');
const settings = await response.json();

// Use the URLs
<img src={settings.profile_image} alt="Profile" />
<video src={settings.background_video} />
        `}</pre>
      </div>
    </div>
  );
}
