import { useState } from 'react';
import type { WordList } from '../data/wordLists';
import { useWordLists } from '../hooks/useWordLists';
import ThemeSelector from '../components/ThemeSelector';
import Game from '../components/Game';
import GameOver from '../components/GameOver';
import AppHeader from '../components/AppHeader';
import { Box, Flex, Spinner, Heading, Center, Button } from '@chakra-ui/react';

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
    <Flex direction="column" align="center" w="100%" p={8} maxW="1280px" mx="auto">
      <AppHeader title="Devinettes" />

      {isLoading ? (
        <Center h="50vh" flexDir="column" gap={4}>
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Heading size="md" color="brand.600">Chargement des données...</Heading>
        </Center>
      ) : error ? (
        <Center h="50vh" flexDir="column" gap={4}>
          <Heading size="md" color="error.500">{error}</Heading>
          <Button onClick={loadLists} colorScheme="brand">Réessayer</Button>
        </Center>
      ) : (
        <Box w="100%" maxW="800px" mt={8}>
          {appState === 'HOME' && (
            <ThemeSelector
              lists={wordLists}
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
        </Box>
      )}
    </Flex>
  );
}

export default WordGuesserApp;
