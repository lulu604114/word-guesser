import { supabase } from '../supabaseClient';
import { type WordList } from './wordLists';

export type DbWordList = WordList & { db_id: string };

export const fetchWordLists = async (): Promise<DbWordList[]> => {
  const { data: themes, error: themeError } = await supabase.from('themes').select('*');
  if (themeError) {
    console.error('Error fetching themes:', themeError);
    return [];
  }

  // Fetch words with their associated clues via foreign key
  const { data: words, error: wordError } = await supabase.from('words').select('*, clues(clue_text, order_index)');
  if (wordError) {
    console.error('Error fetching words:', wordError);
    return [];
  }

  return themes.map(theme => {
    const themeWords = words
      .filter(w => w.theme_id === theme.id)
      .map(w => {
        // Sort the clues by their original order_index and grab only the text
        // Note: Supabase types clues as an array when selecting ONE-TO-MANY
        const cluesArr = (w.clues as { clue_text: string, order_index: number }[]) || [];
        const mappedClues = cluesArr.sort((a, b) => a.order_index - b.order_index).map(c => c.clue_text);

        return {
          id: w.id, 
          word: w.word,
          clues: mappedClues
        };
      });

    return {
      db_id: theme.id,
      id: theme.short_id,
      title: theme.title,
      words: themeWords
    };
  });
};



export const addWordToTheme = async (themeDbId: string, word: string, clues: string[]) => {
  const { data: wordData, error: wordError } = await supabase
    .from('words')
    .insert({
      theme_id: themeDbId,
      word
    })
    .select()
    .single();
    
  if (wordError || !wordData) throw wordError;

  const cluesToInsert = clues.map((clueText, idx) => ({
    word_id: wordData.id,
    clue_text: clueText,
    order_index: idx + 1
  }));

  if (cluesToInsert.length > 0) {
    const { error: cluesError } = await supabase.from('clues').insert(cluesToInsert);
    if (cluesError) throw cluesError;
  }

  return wordData;
};

export const updateWord = async (wordDbId: string, word: string, clues: string[]) => {
  // Update the word string
  const { error: wordError } = await supabase
    .from('words')
    .update({ word })
    .eq('id', wordDbId);
    
  if (wordError) throw wordError;

  // Clear existing clues
  const { error: deleteError } = await supabase
    .from('clues')
    .delete()
    .eq('word_id', wordDbId);
  if (deleteError) throw deleteError;

  // Insert updated clues
  const cluesToInsert = clues.map((clueText, idx) => ({
    word_id: wordDbId,
    clue_text: clueText,
    order_index: idx + 1
  }));

  if (cluesToInsert.length > 0) {
    const { error: insertError } = await supabase.from('clues').insert(cluesToInsert);
    if (insertError) throw insertError;
  }
};

export const deleteWord = async (wordDbId: string) => {
  // ON DELETE CASCADE will automatically delete associated clues
  const { error } = await supabase.from('words').delete().eq('id', wordDbId);
  if (error) throw error;
};

export const addTheme = async (shortId: string, title: string) => {
  const { data, error } = await supabase
    .from('themes')
    .insert({ short_id: shortId, title })
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateTheme = async (themeDbId: string, shortId: string, title: string) => {
  const { error } = await supabase
    .from('themes')
    .update({ short_id: shortId, title })
    .eq('id', themeDbId);
    
  if (error) throw error;
};

export const deleteTheme = async (themeDbId: string) => {
  const { error } = await supabase
    .from('themes')
    .delete()
    .eq('id', themeDbId);
    
  if (error) throw error;
};
