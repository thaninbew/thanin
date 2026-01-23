import { useState, useEffect } from 'react';

interface Settings {
  [key: string]: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        
        const data = await response.json();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set defaults/empty state
        setSettings({});
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
