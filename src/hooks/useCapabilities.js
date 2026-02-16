import { useState, useEffect, useCallback } from 'react';

const DATA_URL = '/data/capabilities.json';
const POLL_INTERVAL = 60_000;

export function useCapabilities() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${DATA_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Poll every 60 seconds
    const interval = setInterval(fetchData, POLL_INTERVAL);

    // Refresh on window focus
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') fetchData();
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}
