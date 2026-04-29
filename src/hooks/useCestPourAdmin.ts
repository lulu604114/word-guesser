import { useState, useEffect } from 'react';
import { fetchCestPourItems } from '../data/cestpourManager';
import type { CestPourItem } from '../types/cestpour';

export function useCestPourAdmin() {
  const [items, setItems] = useState<CestPourItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setItems(await fetchCestPourItems());
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des items "C\'est pour".');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { items, isLoading, error, load };
}
