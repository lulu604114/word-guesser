import React, { useState } from 'react';
import { Box, Button, Text, Textarea, Flex, Wrap, WrapItem } from '@chakra-ui/react';
import type { WordItem } from '../data/wordLists';

type SentenceStepProps = {
  words: WordItem[];
  onContinue: (sentence: string) => void;
};

const SentenceStep: React.FC<SentenceStepProps> = ({ words, onContinue }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [sentence, setSentence] = useState('');

  const toggleWord = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  return (
    <Box>
      <Box mb={6} textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="brand.600" mb={2}>À vous de jouer !</Text>
        <Text color="gray.600" fontSize="lg">
          Sélectionnez au moins un mot ci-dessous et écrivez une phrase originale qui l'utilise.
        </Text>
      </Box>
      
      <Wrap spacing={3} justify="center" mb={6}>
        {words.map(w => (
          <WrapItem key={w.id}>
            <Button 
              size="md"
              borderRadius="full"
              variant={selectedWords.includes(w.word) ? "solid" : "outline"}
              colorScheme={selectedWords.includes(w.word) ? "brand" : "gray"}
              onClick={() => toggleWord(w.word)}
              bg={selectedWords.includes(w.word) ? undefined : "whiteAlpha.500"}
              px={6}
            >
              {w.word}
            </Button>
          </WrapItem>
        ))}
      </Wrap>

      <Textarea 
        variant="glass"
        placeholder="Écrivez votre phrase ici..."
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        rows={4}
        size="lg"
        mb={6}
      />

      <Flex justify="center">
        <Button 
          size="lg"
          colorScheme="brand" 
          onClick={() => onContinue(sentence)}
          isDisabled={selectedWords.length === 0 || sentence.trim() === ''}
          px={10}
          borderRadius="full"
        >
          Continuer la partie
        </Button>
      </Flex>
    </Box>
  );
};

export default SentenceStep;
