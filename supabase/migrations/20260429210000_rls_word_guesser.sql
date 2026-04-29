-- Add RLS to word-guesser tables (themes, words, clues)
-- Follows the same pattern as the prosody_admin migration

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE words  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clues  ENABLE ROW LEVEL SECURITY;

-- Read-only for everyone (public game)
CREATE POLICY "Public read themes" ON themes FOR SELECT USING (true);
CREATE POLICY "Public read words"  ON words  FOR SELECT USING (true);
CREATE POLICY "Public read clues"  ON clues  FOR SELECT USING (true);

-- Write only for authenticated users (admin)
CREATE POLICY "Auth insert themes" ON themes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update themes" ON themes FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "Auth delete themes" ON themes FOR DELETE USING    (auth.role() = 'authenticated');

CREATE POLICY "Auth insert words"  ON words  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update words"  ON words  FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "Auth delete words"  ON words  FOR DELETE USING    (auth.role() = 'authenticated');

CREATE POLICY "Auth insert clues"  ON clues  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update clues"  ON clues  FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "Auth delete clues"  ON clues  FOR DELETE USING    (auth.role() = 'authenticated');
