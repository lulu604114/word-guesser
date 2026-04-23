export interface ProsodyTheme {
  id: string;
  title: string;
  description: string;
}

export const prosodyThemes: ProsodyTheme[] = [
  { id: 'phrases-interrogatives', title: 'Phrases interrogatives', description: 'Entraînement sur l\'intonation des questions.' },
  { id: 'phrases-exclamatives', title: 'Phrases exclamatives', description: 'Travail sur l\'expressivité et l\'émotion.' },
  { id: 'phrases-neutres', title: 'Phrases neutres', description: 'Maîtrise de l\'intonation déclarative classique.' },
  { id: 'phrases-melangees', title: 'Phrases mélangées', description: 'Alternance entre différents types de phrases.' },
  { id: 'textes-evolutifs', title: 'Textes évolutifs', description: 'Lecture de textes avec difficulté progressive.' },
  { id: 'virelangues', title: 'Virelangues', description: 'Exercices d\'articulation et de rythme.' },
  { id: 'expression-faciale', title: 'Expression faciale', description: 'Lien entre prosodie et mimiques.' },
  { id: 'automatisme', title: 'Automatisme', description: 'Réflexes prosodiques sur des structures courantes.' },
  { id: 'variation-de-voix', title: 'Variation de voix', description: 'Exploration des paramètres vocaux (hauteur, intensité).' },
];
