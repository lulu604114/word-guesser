-- CEB Interactive module tables

-- Main text table
CREATE TABLE ceb_texts (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title      text NOT NULL,
  level      text NOT NULL CHECK (level IN ('court', 'moyen', 'long')),
  content    text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Questions table
CREATE TABLE ceb_questions (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  text_id        uuid REFERENCES ceb_texts(id) ON DELETE CASCADE,
  order_index    integer NOT NULL DEFAULT 0,
  type           text NOT NULL CHECK (type IN ('qcm', 'multiple', 'vrai_faux', 'ouverte', 'fermee')),
  question_text  text NOT NULL,
  draft_answer   text NOT NULL DEFAULT ''
);

-- Options table (for qcm, multiple, vrai_faux, fermee)
CREATE TABLE ceb_options (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id  uuid REFERENCES ceb_questions(id) ON DELETE CASCADE,
  option_text  text NOT NULL,
  is_correct   boolean NOT NULL DEFAULT false,
  order_index  integer NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE ceb_texts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceb_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceb_options   ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read ceb_texts"     ON ceb_texts     FOR SELECT USING (true);
CREATE POLICY "Public read ceb_questions" ON ceb_questions FOR SELECT USING (true);
CREATE POLICY "Public read ceb_options"   ON ceb_options   FOR SELECT USING (true);

-- Auth write (admin only)
CREATE POLICY "Auth insert ceb_texts"  ON ceb_texts  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update ceb_texts"  ON ceb_texts  FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "Auth delete ceb_texts"  ON ceb_texts  FOR DELETE USING    (auth.role() = 'authenticated');

CREATE POLICY "Auth insert ceb_questions" ON ceb_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update ceb_questions" ON ceb_questions FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "Auth delete ceb_questions" ON ceb_questions FOR DELETE USING    (auth.role() = 'authenticated');

CREATE POLICY "Auth insert ceb_options" ON ceb_options FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update ceb_options" ON ceb_options FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "Auth delete ceb_options" ON ceb_options FOR DELETE USING    (auth.role() = 'authenticated');
