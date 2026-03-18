import React, { useState } from 'react';
import type { WordItem } from '../data/wordLists';

type SentenceStepProps = {
  words: WordItem[];
  onContinue: (sentence: string) => void;
};

const SentenceStep: React.FC<SentenceStepProps> = ({ words, onContinue }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [sentence, setSentence] = useState('');

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  return (
    <div className="sentence-step-container">
      <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>À vous de jouer !</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
        Sélectionnez au moins un mot ci-dessous et écrivez une phrase originale qui l'utilise.
      </p>
      
      <div className="word-pills">
        {words.map(w => (
          <button 
            key={w.id}
            className={`word-pill ${selectedWords.includes(w.word) ? 'selected' : 'unselected'}`}
            onClick={() => toggleWord(w.word)}
          >
            {w.word}
          </button>
        ))}
      </div>

      <textarea 
        className="sentence-input"
        placeholder="Écrivez votre phrase ici..."
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        rows={4}
      />

      <button 
        className="submit-btn" 
        style={{ marginTop: '1.5rem' }}
        onClick={() => onContinue(sentence)}
        disabled={selectedWords.length === 0 || sentence.trim() === ''}
      >
        Continuer la partie
      </button>
    </div>
  );
};

export default SentenceStep;
