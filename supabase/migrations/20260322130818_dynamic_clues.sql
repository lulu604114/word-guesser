CREATE TABLE clues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  clue_text text NOT NULL,
  order_index integer NOT NULL
);

-- Migration des données existantes
INSERT INTO clues (word_id, clue_text, order_index) SELECT id, clue1, 1 FROM words;
INSERT INTO clues (word_id, clue_text, order_index) SELECT id, clue2, 2 FROM words;
INSERT INTO clues (word_id, clue_text, order_index) SELECT id, clue3, 3 FROM words;

-- Suppression des vieilles colonnes
ALTER TABLE words 
  DROP COLUMN clue1, 
  DROP COLUMN clue2, 
  DROP COLUMN clue3;
