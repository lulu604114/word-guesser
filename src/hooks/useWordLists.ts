import { useState, useEffect } from 'react';
import { fetchWordLists, type DbWordList } from '../data/wordListsManager';

export function useWordLists() {
  const [wordLists, setWordLists] = useState<DbWordList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const lists = await fetchWordLists();
      setWordLists(lists);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  return { wordLists, isLoading, error, loadLists };
}
