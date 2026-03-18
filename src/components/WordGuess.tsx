import React, { useState, useEffect, useRef } from 'react';
import type { WordItem } from '../data/wordLists';

type WordGuessProps = {
  wordItem: WordItem;
  onCorrectGuess: () => void;
  onSkipGuess: () => void;
};

const WordGuess: React.FC<WordGuessProps> = ({ wordItem, onCorrectGuess, onSkipGuess }) => {
  const [cluesRevealed, setCluesRevealed] = useState<number>(1);
  const [guess, setGuess] = useState('');
  const [isError, setIsError] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when the word changes
  useEffect(() => {
    setCluesRevealed(1);
    setGuess('');
    setIsError(false);
    setIsRevealed(false);
    
    // Focus the input to keep the flow smooth
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [wordItem]);

  const handleRevealClue = () => {
    if (cluesRevealed < 3) {
      setCluesRevealed(prev => prev + 1);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean strings for comparison (remove spaces, lowercase, accents)
    const normalize = (str: string) => 
      str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (normalize(guess) === normalize(wordItem.word)) {
      onCorrectGuess();
    } else {
      // Trigger error animation
      setIsError(true);
      setTimeout(() => setIsError(false), 500); // Remove class after animation
    }
  };

  if (isRevealed) {
    return (
      <div className="word-guess-container word-revealed-panel" style={{ textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Découverte du mot</h3>
        <p style={{ color: 'var(--text-muted)' }}>Le mot à trouver était :</p>
        <div className="revealed-word-text">{wordItem.word}</div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>L'aviez-vous trouvé par vous-même ?</p>
        <div className="action-buttons">
          <button className="submit-btn" onClick={onCorrectGuess}>
            Oui, trouvé !
          </button>
          <button className="skip-btn" onClick={onSkipGuess}>
            Pas trouvé
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="word-guess-container">
      <div className="clues-container">
        {wordItem.clues.slice(0, cluesRevealed).map((clue, index) => (
          <div key={index} className="clue-box">
            <span className="clue-label">Indice {index + 1}</span>
            {clue}
          </div>
        ))}
      </div>

      {cluesRevealed < 3 && (
        <button 
          className="reveal-btn" 
          onClick={handleRevealClue}
          style={{ marginBottom: '2rem' }}
        >
          + Révéler un indice
        </button>
      )}

      <form onSubmit={handleSubmit} className="guess-form">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Entrez votre réponse..."
            className={`guess-input ${isError ? 'shake' : ''}`}
            autoComplete="off"
          />
          <button type="submit" className="submit-btn input-submit-btn" disabled={!guess.trim()}>
            Valider
          </button>
        </div>
        <button type="button" className="reveal-word-btn" onClick={() => setIsRevealed(true)}>
          Découvrir le mot
        </button>
      </form>
    </div>
  );
};

export default WordGuess;
