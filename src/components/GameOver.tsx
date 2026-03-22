import React from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import type { WordList } from '../data/wordLists';

type GameOverProps = {
  wordList: WordList;
  onPlayAgain: () => void;
};

const GameOver: React.FC<GameOverProps> = ({ wordList, onPlayAgain }) => {
  return (
    <Box layerStyle="glass" textAlign="center" py={12}>
      <VStack spacing={6}>
        <Heading as="h2" size="2xl" color="brand.500">
          Félicitations ! 🎉
        </Heading>
        <Text fontSize="xl" color="gray.600">
          Vous avez deviné tous les mots du thème <Text as="strong" color="brand.600">{wordList.title}</Text> !
        </Text>

        <Button 
          colorScheme="brand" 
          size="lg" 
          mt={8} 
          px={10} 
          borderRadius="full"
          onClick={onPlayAgain}
          shadow="lg"
          _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
        >
          Rejouer une partie
        </Button>
      </VStack>
    </Box>
  );
};

export default GameOver;
