import React from 'react';
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import type { WordList } from '../data/wordLists';

type ThemeSelectorProps = {
  lists: WordList[];
  onStartGame: (list: WordList) => void;
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ lists, onStartGame }) => {
  return (
    <Box layerStyle="glass">
      <Heading as="h2" size="md" mb={6} color="gray.500" textAlign="center">
        Choisissez un thème pour commencer
      </Heading>
      
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
        {lists.map((list) => (
          <Box 
            key={list.id} 
            layerStyle="card"
            onClick={() => onStartGame(list)}
          >
            <Heading as="h3" size="md" mb={2} color="brand.600">
              {list.title}
            </Heading>
            <Text color="gray.600" fontSize="sm">
              {list.words.length} mots à deviner
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ThemeSelector;
