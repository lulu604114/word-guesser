import React from 'react';
import type { WordList } from '../data/wordLists';

type GameOverProps = {
  wordList: WordList;
  onPlayAgain: () => void;
};

const GameOver: React.FC<GameOverProps> = ({ wordList, onPlayAgain }) => {
  return (
    <div className="glass-panel game-over-container">
      <h2>Félicitations ! 🎉</h2>
      <p>
        Vous avez deviné tous les mots du thème <strong>{wordList.title}</strong> !
      </p>
      
      <button className="play-again-btn" onClick={onPlayAgain}>
        Rejouer une partie
      </button>
    </div>
  );
};

export default GameOver;
