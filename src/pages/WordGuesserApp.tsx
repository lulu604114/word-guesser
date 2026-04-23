import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { WordList } from '../data/wordLists';
import { useWordLists } from '../hooks/useWordLists';
import ThemeSelector from '../components/ThemeSelector';
import Game from '../components/Game';
import GameOver from '../components/GameOver';
import AppHeader from '../components/AppHeader';
import { Box, Flex, Spinner, Heading, Center, Button } from '@chakra-ui/react';

function WordGuesserApp() {
  const navigate = useNavigate();
  const { themeId } = useParams<{ themeId: string }>();
  const [isGameOver, setIsGameOver] = useState(false);

  const { wordLists, isLoading, error, loadLists } = useWordLists();

  const selectedList = themeId ? wordLists.find((l) => l.id === themeId) : null;

  useEffect(() => {
    // If the list finished loading and themeId is provided but not found, redirect to /word-guesser
    if (!isLoading && themeId && !selectedList) {
      navigate('/word-guesser', { replace: true });
    }
  }, [themeId, selectedList, isLoading, navigate]);

  // Reset game over state if themeId changes
  useEffect(() => {
    setIsGameOver(false);
  }, [themeId]);

  const startGame = (list: WordList) => {
    navigate(`/word-guesser/${list.id}`);
  };

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const playAgain = () => {
    navigate(-1);
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
          {!themeId && (
            <ThemeSelector
              lists={wordLists}
              onStartGame={startGame}
            />
          )}

          {themeId && selectedList && !isGameOver && (
            <Game
              wordList={selectedList}
              onGameOver={handleGameOver}
              onQuit={playAgain}
            />
          )}

          {themeId && selectedList && isGameOver && (
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
