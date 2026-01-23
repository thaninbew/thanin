import { useState, useMemo } from 'react';
import styles from '../styles/Admin.module.css';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

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

interface TextSetting {
  key: string;
  label: string;
  description: string;
  type: 'text';
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
    key: 'projects_placeholder',
    label: 'Projects Placeholder Image',
    description: 'Default image for projects without custom images',
    type: 'image',
    accept: 'image/*'
  },
  {
    key: 'experience_placeholder',
    label: 'Experience Placeholder Image',
    description: 'Default image for experiences without custom images',
    type: 'image',
    accept: 'image/*'
  }
];

const TEXT_SETTINGS: TextSetting[] = [
  {
    key: 'lyrics',
    label: 'Lyrics',
    description: 'Your favorite lyrics or quote',
    type: 'text'
  },
  {
    key: 'about_developer',
    label: 'About the Developer',
    description: 'Information about yourself',
    type: 'text'
  }
];

export default function ImageSettings({ onClose }: ImageSettingsProps) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedImages, setExpandedImages] = useState(false);
  const [expandedText, setExpandedText] = useState(false);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`);
      
      if (!response.ok) {
        console.error('Failed to load settings:', response.status);
        return;
      }
      
      const data = await response.json();
      setSettings(data);
      
      // Set text values from loaded settings
      const textVals: Record<string, string> = {};
      TEXT_SETTINGS.forEach(setting => {
        textVals[setting.key] = data[setting.key] || '';
      });
      setTextValues(textVals);
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
      setMessage(`❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleToggleImages = () => {
    if (!expandedImages) {
      loadSettings();
    }
    setExpandedImages(!expandedImages);
  };

  const handleToggleText = () => {
    if (!expandedText) {
      loadSettings();
    }
    setExpandedText(!expandedText);
  };

  const handleSaveText = async () => {
    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setMessage('❌ No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(textValues)
      });

      if (response.status === 401) {
        setMessage('❌ Session expired');
        localStorage.removeItem('adminToken');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to save text settings');
      }

      setMessage('✅ Text settings updated!');
      setSettings(prev => ({ ...prev, ...textValues }));
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setMessage(`❌ Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const mdeOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: 'Enter markdown text...',
    status: false,
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', '|',
      'preview', 'side-by-side', 'fullscreen', '|',
      'guide'
    ]
  }), []);

  return (
    <div className={styles.imageSettingsContainer}>
      {/* Images Section */}
      <div className={styles.imageSettings}>
        <div 
          className={styles.imageSettingsHeader}
          onClick={handleToggleImages}
        >
          <h3>🖼️ Image Settings</h3>
          <span className={styles.toggleIcon}>
            {expandedImages ? '▼' : '▶'}
          </span>
        </div>

        {expandedImages && (
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

      {/* Text Settings Section */}
      <div className={styles.imageSettings}>
        <div 
          className={styles.imageSettingsHeader}
          onClick={handleToggleText}
        >
          <h3>✏️ Text Settings</h3>
          <span className={styles.toggleIcon}>
            {expandedText ? '▼' : '▶'}
          </span>
        </div>

        {expandedText && (
          <div className={styles.imageSettingsContent}>
            {messagSimpleMDE
                    value={textValues[config.key] || ''}
                    onChange={(value) => setTextValues(prev => ({ ...prev, [config.key]: value }))}
                    options={mdeOptions
            <div className={styles.textSettingsGrid}>
              {TEXT_SETTINGS.map(config => (
                <div key={config.key} className={styles.textSettingCard}>
                  <label htmlFor={`text-${config.key}`}>
                    <h4>{config.label}</h4>
                    <p>{config.description}</p>
                  </label>
                  <textarea
                    id={`text-${config.key}`}
                    value={textValues[config.key] || ''}
                    onChange={(e) => setTextValues(prev => ({ ...prev, [config.key]: e.target.value }))}
                    placeholder={`Enter ${config.label.toLowerCase()}...`}
                    className={styles.textInput}
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={handleSaveText}
              disabled={saving}
              className={styles.saveTextButton}
            >
              {saving ? 'Saving...' : 'Save Text Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
