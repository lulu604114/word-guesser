import React, { useState, useEffect, useRef } from 'react';
import type { WordItem } from '../data/wordLists';

type WordGuessProps = {
  wordItem: WordItem;
  onCorrectGuess: () => void;
};

const WordGuess: React.FC<WordGuessProps> = ({ wordItem, onCorrectGuess }) => {
  const [cluesRevealed, setCluesRevealed] = useState<number>(1);
  const [guess, setGuess] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when the word changes
  useEffect(() => {
    setCluesRevealed(1);
    setGuess('');
    setIsError(false);
    
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
        <input
          ref={inputRef}
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Entrez votre réponse..."
          className={`guess-input ${isError ? 'shake' : ''}`}
          autoComplete="off"
        />
        <button type="submit" className="submit-btn" disabled={!guess.trim()}>
          Valider
        </button>
      </form>
    </div>
  );
};

export default WordGuess;
