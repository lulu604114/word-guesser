import { useState, useEffect } from 'react';
import {
  fetchProsodyThemes,
  fetchProsodyPhrases,
  type ProsodyTheme,
  type ProsodyPhrase,
} from '../data/prosodyManager';

export interface ProsodyAdminData {
  themes: ProsodyTheme[];
  phrases: ProsodyPhrase[];
}

export function useProsodyAdmin() {
  const [data, setData] = useState<ProsodyAdminData>({ themes: [], phrases: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [themes, phrases] = await Promise.all([
        fetchProsodyThemes(),
        fetchProsodyPhrases(),
      ]);
      setData({ themes, phrases });
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données de prosodie.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { ...data, isLoading, error, load };
}
