import React, { useState } from 'react';
import type { WordList } from '../data/wordLists';
import WordGuess from './WordGuess';

type GameProps = {
  wordList: WordList;
  onGameOver: () => void;
  onQuit: () => void;
};

const Game: React.FC<GameProps> = ({ wordList, onGameOver, onQuit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopover, setShowPopover] = useState(false);

  const handleCorrectGuess = () => {
    if (currentIndex < wordList.words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onGameOver();
    }
  };

  const currentWord = wordList.words[currentIndex];

  const progressPercent = ((currentIndex) / wordList.words.length) * 100;
  
  const guessedWords = wordList.words.slice(0, currentIndex);

  return (
    <>
      <div className="glass-panel game-container">
      <div className="game-header">
        <div className="progress-wrapper">
          <div className="progress-text">
            Mot {currentIndex + 1} sur {wordList.words.length}
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        <button className="quit-btn" onClick={onQuit}>
          Quitter la partie
        </button>
      </div>

      <WordGuess 
        key={currentWord.id} // Re-mount component on new word
        wordItem={currentWord} 
        onCorrectGuess={handleCorrectGuess} 
      />
      </div>

      <div className="guessed-floating-btn-container">
        {showPopover && (
          <div className="guessed-popover glass-panel">
            <h4>Mots devinés ({guessedWords.length})</h4>
            {guessedWords.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Aucun mot deviné pour le moment.</p>
            ) : (
              <ul className="guessed-list">
                {guessedWords.map((item, idx) => (
                  <li key={item.id}>
                    <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>{idx + 1}.</span> 
                    {item.word}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        <button 
          className="guessed-floating-btn"
          onClick={() => setShowPopover(!showPopover)}
          title={`${guessedWords.length} mot(s) deviné(s)`}
        >
          🏆
          <span className="badge">{guessedWords.length}</span>
        </button>
      </div>
    </>
  );
};

export default Game;
