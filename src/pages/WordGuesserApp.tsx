import { useState } from 'react';
import '../App.css';
import type { WordList } from '../data/wordLists';
import { useWordLists } from '../hooks/useWordLists';
import ThemeSelector from '../components/ThemeSelector';
import Game from '../components/Game';
import GameOver from '../components/GameOver';
import AppHeader from '../components/AppHeader';
import ManageWords from '../components/ManageWords';

type AppState = 'HOME' | 'PLAYING' | 'GAME_OVER' | 'MANAGE_WORDS';

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
              <button
                className="manage-btn primary-btn"
                onClick={() => setAppState('MANAGE_WORDS')}
                style={{ marginTop: '2rem', backgroundColor: '#646cff' }}
              >
                Gérer les Mots et Thèmes
              </button>
            </div>
          )}

          {appState === 'MANAGE_WORDS' && (
            <ManageWords
              wordLists={wordLists}
              onBack={() => setAppState('HOME')}
              onDataChanged={loadLists}
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
        </>
      )}
    </div>
  );
}

export default WordGuesserApp;
