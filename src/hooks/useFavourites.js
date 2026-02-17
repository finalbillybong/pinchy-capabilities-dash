import { useState, useCallback } from 'react';

const STORAGE_KEY = 'pinchy-favourites';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavourites() {
  const [favourites, setFavourites] = useState(load);

  const toggle = useCallback((capName) => {
    setFavourites((prev) => {
      const next = prev.includes(capName)
        ? prev.filter((n) => n !== capName)
        : [...prev, capName];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFav = useCallback((capName) => favourites.includes(capName), [favourites]);

  return { favourites, toggle, isFav };
}
