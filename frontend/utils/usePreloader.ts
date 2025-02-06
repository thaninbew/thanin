import { useState, useEffect } from 'react';

export const usePreloader = <T>(fetchFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const result = await fetchFn();
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load data');
          setLoading(false);
        }
      }
    };

    // Start loading immediately but don't block
    loadData();

    return () => {
      mounted = false;
    };
  }, [fetchFn]);

  return { data, loading, error };
}; 