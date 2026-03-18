import { useState } from 'react';
import './App.css';
import { type WordList, defaultWordLists } from './data/wordLists';
import Home from './components/Home';
import Game from './components/Game';
import GameOver from './components/GameOver';

type AppState = 'HOME' | 'PLAYING' | 'GAME_OVER';

function App() {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [selectedList, setSelectedList] = useState<WordList | null>(null);

  const startGame = (list: WordList) => {
    setSelectedList(list);
    setAppState('PLAYING');
  };

  const handleGameOver = () => {
    setAppState('GAME_OVER');
  };

  const playAgain = () => {
    setSelectedList(null);
    setAppState('HOME');
  };

  return (
    <div className="app-container">
      <h1 className="title">Devinettes</h1>
      
      {appState === 'HOME' && (
        <Home 
          lists={defaultWordLists} 
          onStartGame={startGame} 
        />
      )}
      
      {appState === 'PLAYING' && selectedList && (
        <Game 
          wordList={selectedList} 
          onGameOver={handleGameOver} 
          onQuit={playAgain}
        />
      )}
      
      {appState === 'GAME_OVER' && selectedList && (
        <GameOver 
          wordList={selectedList} 
          onPlayAgain={playAgain} 
        />
      )}
    </div>
  );
}

export default App;
