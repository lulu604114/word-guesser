import { supabase } from '../supabaseClient';
import type { CestPourItem } from '../types/cestpour';

export const fetchCestPourItems = async (): Promise<CestPourItem[]> => {
  const { data, error } = await supabase
    .from('cestpour_items')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) { console.error(error); return []; }
  return data as CestPourItem[];
};

export const addCestPourItem = async (
  objectName: string,
  imageUrl: string,
  correctAnswer: string,
  wrongAnswer: string,
  orderIndex: number
) => {
  const { data, error } = await supabase
    .from('cestpour_items')
    .insert({ object_name: objectName, image_url: imageUrl, correct_answer: correctAnswer, wrong_answer: wrongAnswer, order_index: orderIndex })
    .select().single();
  if (error) throw error;
  return data;
};

export const updateCestPourItem = async (
  id: string,
  objectName: string,
  imageUrl: string,
  correctAnswer: string,
  wrongAnswer: string,
  orderIndex: number
) => {
  const { error } = await supabase
    .from('cestpour_items')
    .update({ object_name: objectName, image_url: imageUrl, correct_answer: correctAnswer, wrong_answer: wrongAnswer, order_index: orderIndex })
    .eq('id', id);
  if (error) throw error;
};

export const deleteCestPourItem = async (id: string) => {
  const { error } = await supabase.from('cestpour_items').delete().eq('id', id);
  if (error) throw error;
};
