import { useState, useEffect } from 'react';
import { fetchCebTexts, fetchCebQuestions, fetchCebOptions } from '../data/cebManager';
import type { CebText, CebQuestion, CebOption } from '../types/ceb';

export interface CebAdminData {
  texts: CebText[];
  questions: CebQuestion[];
  options: CebOption[];
}

export function useCebAdmin() {
  const [data, setData] = useState<CebAdminData>({ texts: [], questions: [], options: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [texts, questions, options] = await Promise.all([
        fetchCebTexts(),
        fetchCebQuestions(),
        fetchCebOptions(),
      ]);
      setData({ texts, questions, options });
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données CEB.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Build enriched texts with nested questions and options
  const enrichedTexts = data.texts.map(text => {
    const textQuestions = data.questions
      .filter(q => q.text_id === text.id)
      .sort((a, b) => a.order_index - b.order_index)
      .map(q => ({
        ...q,
        options: data.options
          .filter(o => o.question_id === q.id)
          .sort((a, b) => a.order_index - b.order_index),
      }));
    return { ...text, questions: textQuestions };
  });

  return {
    ...data,
    enrichedTexts,
    isLoading,
    error,
    load,
  };
}
