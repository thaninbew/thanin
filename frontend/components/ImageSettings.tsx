import { useState } from 'react';
import styles from '../styles/Admin.module.css';

interface ImageSettingsProps {
  onClose?: () => void;
}

interface ImageSetting {
  key: string;
  label: string;
  description: string;
  type: 'image' | 'video';
  accept: string;
}

const IMAGE_SETTINGS: ImageSetting[] = [
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

export default function ImageSettings({ onClose }: ImageSettingsProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`);
      
      if (!response.ok) {
        console.error('Failed to load settings:', response.status);
        return;
      }
      
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
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setMessage('❌ No authentication token found');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

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

      if (response.status === 401) {
        setMessage('❌ Session expired');
        localStorage.removeItem('adminToken');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setSettings(prev => ({ ...prev, [key]: data.value }));
      setMessage(`✅ ${IMAGE_SETTINGS.find(s => s.key === key)?.label} updated!`);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ Upload failed`);
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Load settings when expanded
  const handleToggle = () => {
    if (!expanded) {
      loadSettings();
    }
    setExpanded(!expanded);
  };

  return (
    <div className={styles.imageSettings}>
      <div 
        className={styles.imageSettingsHeader}
        onClick={handleToggle}
      >
        <h3>🖼️ Image Settings</h3>
        <span className={styles.toggleIcon}>
          {expanded ? '▼' : '▶'}
        </span>
      </div>

      {expanded && (
        <div className={styles.imageSettingsContent}>
          {message && (
            <div className={`${styles.message} ${message.includes('✅') ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          <div className={styles.imageSettingsGrid}>
            {IMAGE_SETTINGS.map(config => (
              <div key={config.key} className={styles.imageSettingCard}>
                <div className={styles.imageSettingInfo}>
                  <h4>{config.label}</h4>
                  <p>{config.description}</p>
                </div>

                {settings[config.key] && (
                  <div className={styles.imagePreview}>
                    {config.type === 'image' ? (
                      <img src={settings[config.key]} alt={config.label} />
                    ) : (
                      <video src={settings[config.key]} controls />
                    )}
                  </div>
                )}

                <div className={styles.imageUploadSection}>
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
