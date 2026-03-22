import { useState } from 'react';
import '../App.css';
import type { WordList } from '../data/wordLists';
import { useWordLists } from '../hooks/useWordLists';
import ThemeSelector from '../components/ThemeSelector';
import Game from '../components/Game';
import GameOver from '../components/GameOver';
import AppHeader from '../components/AppHeader';

type AppState = 'HOME' | 'PLAYING' | 'GAME_OVER';

function WordGuesserApp() {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [selectedList, setSelectedList] = useState<WordList | null>(null);

  const { wordLists, isLoading, error, loadLists } = useWordLists();

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
      <AppHeader title="Devinettes" />

      {isLoading ? (
        <div className="loading-container">
          <h2>Chargement des données...</h2>
        </div>
      ) : error ? (
        <div className="error-container">
          <h2>{error}</h2>
          <button onClick={loadLists}>Réessayer</button>
        </div>
      ) : (
        <>
          {appState === 'HOME' && (
            <div className="home-container">
              <ThemeSelector
                lists={wordLists}
                onStartGame={startGame}
              />
            </div>
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
        </>
      )}
    </div>
  );
}

export default WordGuesserApp;
