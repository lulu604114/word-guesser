import React from 'react';
import type { WordList } from '../data/wordLists';

type ThemeSelectorProps = {
  lists: WordList[];
  onStartGame: (list: WordList) => void;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ lists, onStartGame }) => {
  return (
    <div className="glass-panel home-container">
      <h2>Choisissez un thème pour commencer</h2>
      
      <div className="list-grid">
        {lists.map((list) => (
          <div 
            key={list.id} 
            className="list-card"
            onClick={() => onStartGame(list)}
          >
            <h3>{list.title}</h3>
            <p>{list.words.length} mots à deviner</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
