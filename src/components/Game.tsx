import React, { useState } from 'react';
import type { WordList } from '../data/wordLists';
import WordGuess from './WordGuess';
import SentenceStep from './SentenceStep';

type GameProps = {
  wordList: WordList;
  onGameOver: () => void;
  onQuit: () => void;
};

const Game: React.FC<GameProps> = ({ wordList, onGameOver, onQuit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopover, setShowPopover] = useState(false);
  const [showSentenceStep, setShowSentenceStep] = useState(false);
  const [skippedWords, setSkippedWords] = useState<string[]>([]);

  const advanceToNext = () => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < wordList.words.length) {
      if (nextIndex % 5 === 0) {
        setShowSentenceStep(true);
      }
      setCurrentIndex(nextIndex);
    } else {
      if (nextIndex % 5 === 0) {
        setShowSentenceStep(true);
        setCurrentIndex(nextIndex);
      } else {
        onGameOver();
      }
    }
  };

  const handleCorrectGuess = () => {
    advanceToNext();
  };

  const handleSkipGuess = () => {
    setSkippedWords(prev => [...prev, wordList.words[currentIndex].id]);
    advanceToNext();
  };

  const handleSentenceContinue = (sentence: string) => {
    console.log("Phrase créée :", sentence);
    setShowSentenceStep(false);
    if (currentIndex >= wordList.words.length) {
      onGameOver();
    }
  };

  const currentWord = wordList.words[currentIndex];

  const progressPercent = ((currentIndex) / wordList.words.length) * 100;
  
  const allPlayedWords = wordList.words.slice(0, currentIndex);
  const foundWordsCount = allPlayedWords.filter(w => !skippedWords.includes(w.id)).length;

  if (showSentenceStep) {
    const recentWords = allPlayedWords.slice(-5);
    return (
      <div className="glass-panel game-container">
        <div className="game-header">
          <div className="progress-wrapper">
            <span className="progress-text">Création de phrase...</span>
          </div>
          <button className="quit-btn" onClick={onQuit}>
            Quitter la partie
          </button>
        </div>
        <SentenceStep words={recentWords} onContinue={handleSentenceContinue} />
      </div>
    );
  }

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
        onSkipGuess={handleSkipGuess}
      />
      </div>

      <div className="guessed-floating-btn-container">
        {showPopover && (
          <div className="guessed-popover glass-panel">
            <h4>Mots devinés ({foundWordsCount})</h4>
            {allPlayedWords.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>Aucun mot joué pour le moment.</p>
            ) : (
              <ul className="guessed-list">
                {allPlayedWords.map((item, idx) => {
                  const isSkipped = skippedWords.includes(item.id);
                  return (
                    <li key={item.id} className={isSkipped ? 'skipped-word' : ''}>
                      <span style={{ color: 'var(--text-muted)', marginRight: '8px' }}>{idx + 1}.</span> 
                      {item.word} {isSkipped && '❌'}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
        
        <button 
          className="guessed-floating-btn"
          onClick={() => setShowPopover(!showPopover)}
          title={`${foundWordsCount} mot(s) deviné(s)`}
        >
          🏆
          <span className="badge">{foundWordsCount}</span>
        </button>
      </div>
    </>
  );
};

export default Game;
