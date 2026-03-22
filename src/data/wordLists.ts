export type WordItem = {
  id: string;
  word: string;
  clues: string[];
};

export type WordList = {
  id: string;
  title: string;
  words: WordItem[];
};
