-- "C'est pour" module

CREATE TABLE cestpour_items (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  object_name  text NOT NULL,          -- e.g. "Un couteau"
  image_url    text NOT NULL DEFAULT '',
  correct_answer text NOT NULL,        -- e.g. "couper"
  wrong_answer   text NOT NULL,        -- e.g. "dessiner"
  order_index  integer NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE cestpour_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cestpour_items"  ON cestpour_items FOR SELECT USING (true);
CREATE POLICY "Auth insert cestpour_items"  ON cestpour_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update cestpour_items"  ON cestpour_items FOR UPDATE USING    (auth.role() = 'authenticated');
CREATE POLICY "Auth delete cestpour_items"  ON cestpour_items FOR DELETE USING    (auth.role() = 'authenticated');
