import { supabase } from '../supabaseClient';

export interface ProsodyTheme {
  id: string;       // uuid (db PK)
  short_id: string;
  title: string;
  description: string;
}

export interface ProsodyPhrase {
  id: string;       // uuid (db PK)
  theme_id: string;
  phrase: string;
}

// ── Fetch ──────────────────────────────────────────────────────────────────

export const fetchProsodyThemes = async (): Promise<ProsodyTheme[]> => {
  const { data, error } = await supabase.from('prosody_themes').select('*');
  if (error) {
    console.error('Error fetching prosody_themes:', error);
    return [];
  }
  return data as ProsodyTheme[];
};

export const fetchProsodyPhrases = async (): Promise<ProsodyPhrase[]> => {
  const { data, error } = await supabase.from('prosody_phrases').select('*');
  if (error) {
    console.error('Error fetching prosody_phrases:', error);
    return [];
  }
  return data as ProsodyPhrase[];
};

// ── Themes CRUD ────────────────────────────────────────────────────────────

export const addProsodyTheme = async (shortId: string, title: string, description: string) => {
  const { data, error } = await supabase
    .from('prosody_themes')
    .insert({ short_id: shortId, title, description })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProsodyTheme = async (
  id: string,
  shortId: string,
  title: string,
  description: string
) => {
  const { error } = await supabase
    .from('prosody_themes')
    .update({ short_id: shortId, title, description })
    .eq('id', id);
  if (error) throw error;
};

export const deleteProsodyTheme = async (id: string) => {
  // ON DELETE CASCADE will remove associated phrases
  const { error } = await supabase.from('prosody_themes').delete().eq('id', id);
  if (error) throw error;
};

// ── Phrases CRUD ───────────────────────────────────────────────────────────

export const addProsodyPhrase = async (themeId: string, phrase: string) => {
  const { data, error } = await supabase
    .from('prosody_phrases')
    .insert({ theme_id: themeId, phrase })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProsodyPhrase = async (id: string, phrase: string) => {
  const { error } = await supabase
    .from('prosody_phrases')
    .update({ phrase })
    .eq('id', id);
  if (error) throw error;
};

export const deleteProsodyPhrase = async (id: string) => {
  const { error } = await supabase.from('prosody_phrases').delete().eq('id', id);
  if (error) throw error;
};
