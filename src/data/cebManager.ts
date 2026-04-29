import { supabase } from '../supabaseClient';
import type { CebText, CebQuestion, CebOption } from '../types/ceb';

// ── Fetch ──────────────────────────────────────────────────────────────────

export const fetchCebTexts = async (): Promise<CebText[]> => {
  const { data, error } = await supabase
    .from('ceb_texts')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching ceb_texts:', error);
    return [];
  }
  return data as CebText[];
};

export const fetchCebQuestions = async (): Promise<CebQuestion[]> => {
  const { data, error } = await supabase
    .from('ceb_questions')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) {
    console.error('Error fetching ceb_questions:', error);
    return [];
  }
  return data as CebQuestion[];
};

export const fetchCebOptions = async (): Promise<CebOption[]> => {
  const { data, error } = await supabase
    .from('ceb_options')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) {
    console.error('Error fetching ceb_options:', error);
    return [];
  }
  return data as CebOption[];
};

// ── CebTexts CRUD ─────────────────────────────────────────────────────────

export const addCebText = async (
  title: string,
  level: 'court' | 'moyen' | 'long',
  content: string
) => {
  const { data, error } = await supabase
    .from('ceb_texts')
    .insert({ title, level, content })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCebText = async (
  id: string,
  title: string,
  level: 'court' | 'moyen' | 'long',
  content: string
) => {
  const { error } = await supabase
    .from('ceb_texts')
    .update({ title, level, content })
    .eq('id', id);
  if (error) throw error;
};

export const deleteCebText = async (id: string) => {
  const { error } = await supabase.from('ceb_texts').delete().eq('id', id);
  if (error) throw error;
};

// ── CebQuestions CRUD ─────────────────────────────────────────────────────

export const addCebQuestion = async (
  textId: string,
  orderIndex: number,
  type: CebQuestion['type'],
  questionText: string,
  draftAnswer: string
) => {
  const { data, error } = await supabase
    .from('ceb_questions')
    .insert({
      text_id: textId,
      order_index: orderIndex,
      type,
      question_text: questionText,
      draft_answer: draftAnswer,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCebQuestion = async (
  id: string,
  orderIndex: number,
  type: CebQuestion['type'],
  questionText: string,
  draftAnswer: string
) => {
  const { error } = await supabase
    .from('ceb_questions')
    .update({
      order_index: orderIndex,
      type,
      question_text: questionText,
      draft_answer: draftAnswer,
    })
    .eq('id', id);
  if (error) throw error;
};

export const deleteCebQuestion = async (id: string) => {
  const { error } = await supabase.from('ceb_questions').delete().eq('id', id);
  if (error) throw error;
};

// ── CebOptions CRUD ───────────────────────────────────────────────────────

export const addCebOption = async (
  questionId: string,
  orderIndex: number,
  optionText: string,
  isCorrect: boolean
) => {
  const { data, error } = await supabase
    .from('ceb_options')
    .insert({
      question_id: questionId,
      order_index: orderIndex,
      option_text: optionText,
      is_correct: isCorrect,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateCebOption = async (
  id: string,
  optionText: string,
  isCorrect: boolean,
  orderIndex: number
) => {
  const { error } = await supabase
    .from('ceb_options')
    .update({ option_text: optionText, is_correct: isCorrect, order_index: orderIndex })
    .eq('id', id);
  if (error) throw error;
};

export const deleteCebOption = async (id: string) => {
  const { error } = await supabase.from('ceb_options').delete().eq('id', id);
  if (error) throw error;
};
