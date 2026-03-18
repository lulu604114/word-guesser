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

  const handleCorrectGuess = () => {
    if (currentIndex < wordList.words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onGameOver();
    }
  };

  const currentWord = wordList.words[currentIndex];

  return (
    <div className="glass-panel game-container">
      <div className="game-header">
        <div className="progress">
          Mot {currentIndex + 1} / {wordList.words.length}
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
  );
};

export default Game;
