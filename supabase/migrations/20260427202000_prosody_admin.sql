-- Prosody themes table
CREATE TABLE prosody_themes (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  short_id    text UNIQUE NOT NULL,
  title       text NOT NULL,
  description text NOT NULL DEFAULT ''
);

-- Prosody phrases table (no order_index — insertion order is enough)
CREATE TABLE prosody_phrases (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id   uuid REFERENCES prosody_themes(id) ON DELETE CASCADE,
  phrase     text NOT NULL
);

-- Enable RLS
ALTER TABLE prosody_themes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE prosody_phrases ENABLE ROW LEVEL SECURITY;

-- Read-only for everyone (public game)
CREATE POLICY "Public read prosody_themes"  ON prosody_themes  FOR SELECT USING (true);
CREATE POLICY "Public read prosody_phrases" ON prosody_phrases FOR SELECT USING (true);

-- Write only for authenticated users (admin)
CREATE POLICY "Auth insert prosody_themes"  ON prosody_themes  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update prosody_themes"  ON prosody_themes  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete prosody_themes"  ON prosody_themes  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert prosody_phrases" ON prosody_phrases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update prosody_phrases" ON prosody_phrases FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete prosody_phrases" ON prosody_phrases FOR DELETE USING (auth.role() = 'authenticated');

-- ── Seed data (from static prosodyThemes.ts + prosodyData.ts) ─────────────────

INSERT INTO prosody_themes (short_id, title, description) VALUES
  ('phrases-interrogatives', 'Phrases interrogatives', 'Entraînement sur l''intonation des questions.'),
  ('phrases-exclamatives',   'Phrases exclamatives',   'Travail sur l''expressivité et l''émotion.'),
  ('phrases-neutres',        'Phrases neutres',         'Maîtrise de l''intonation déclarative classique.'),
  ('phrases-melangees',      'Phrases mélangées',       'Alternance entre différents types de phrases.'),
  ('textes-evolutifs',       'Textes évolutifs',        'Lecture de textes avec difficulté progressive.'),
  ('virelangues',            'Virelangues',             'Exercices d''articulation et de rythme.'),
  ('expression-faciale',     'Expression faciale',      'Lien entre prosodie et mimiques.'),
  ('automatisme',            'Automatisme',             'Réflexes prosodiques sur des structures courantes.'),
  ('variation-de-voix',      'Variation de voix',       'Exploration des paramètres vocaux (hauteur, intensité).');

INSERT INTO prosody_phrases (theme_id, phrase)
SELECT t.id, p.phrase
FROM prosody_themes t
JOIN (VALUES
  ('phrases-interrogatives', 'Est-ce que tu viens avec nous ?'),
  ('phrases-interrogatives', 'Où as-tu mis les clés ?'),
  ('phrases-interrogatives', 'Pourquoi tu pleures ?'),
  ('phrases-interrogatives', 'Comment tu t''appelles ?'),
  ('phrases-interrogatives', 'Quand est-ce qu''on mange ?'),
  ('phrases-interrogatives', 'Qui a mangé la dernière part de gâteau ?'),
  ('phrases-interrogatives', 'À quelle heure le train arrive-t-il ?'),
  ('phrases-interrogatives', 'Tu aimes le chocolat ?'),
  ('phrases-exclamatives',   'Quelle belle journée !'),
  ('phrases-exclamatives',   'C''est incroyable !'),
  ('phrases-exclamatives',   'Attention à la marche !'),
  ('phrases-exclamatives',   'Je suis tellement content !'),
  ('phrases-neutres',        'Le chat dort sur le canapé.'),
  ('phrases-neutres',        'Il pleut aujourd''hui.'),
  ('phrases-neutres',        'Je vais à la boulangerie.'),
  ('phrases-neutres',        'Nous avons une réunion à dix heures.')
) AS p(short_id, phrase) ON t.short_id = p.short_id;
