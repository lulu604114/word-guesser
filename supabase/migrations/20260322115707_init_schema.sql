CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE themes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id text UNIQUE NOT NULL,
  title text NOT NULL
);

CREATE TABLE words (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id uuid REFERENCES themes(id) ON DELETE CASCADE,
  word text NOT NULL,
  clue1 text NOT NULL,
  clue2 text NOT NULL,
  clue3 text NOT NULL
);
