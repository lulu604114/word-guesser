import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import type { WordItem } from '../data/wordLists';

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

type WordGuessProps = {
  wordItem: WordItem;
  onCorrectGuess: () => void;
  onSkipGuess: () => void;
};

const WordGuess: React.FC<WordGuessProps> = ({ wordItem, onCorrectGuess, onSkipGuess }) => {
  const [cluesRevealed, setCluesRevealed] = useState<number>(1);
  const [guess, setGuess] = useState('');
  const [isError, setIsError] = useState(false);
  const [matchState, setMatchState] = useState<'guessing' | 'revealed' | 'success'>('guessing');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && matchState === 'guessing') {
      inputRef.current.focus();
    }
  }, [matchState]);

  const handleRevealClue = () => {
    if (cluesRevealed < wordItem.clues.length) {
      setCluesRevealed(prev => prev + 1);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalize = (str: string) => 
      str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (normalize(guess) === normalize(wordItem.word)) {
      setMatchState('success');
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 500);
    }
  };

  if (matchState !== 'guessing') {
    return (
      <VStack spacing={6} p={4} textAlign="center">
        {matchState === 'success' ? (
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="green.500" mb={1}>Bonne réponse ! 🎉</Text>
            <Text color="gray.500">Le mot était bien :</Text>
          </Box>
        ) : (
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="brand.600" mb={1}>Découverte du mot</Text>
            <Text color="gray.500">Le mot à trouver était :</Text>
          </Box>
        )}
        <Text fontSize="3xl" fontWeight="black" color="brand.500" letterSpacing="widest" textTransform="uppercase">
          {wordItem.word}
        </Text>
        <Box w="100%">
          {matchState === 'success' ? (
            <Button colorScheme="green" size="lg" onClick={onCorrectGuess} borderRadius="full" px={12} mt={2}>
              Continuer
            </Button>
          ) : (
            <>
              <Text color="gray.500" mb={4}>L'aviez-vous trouvé par vous-même ?</Text>
              <Flex gap={4} justify="center" direction={{ base: 'column', sm: 'row' }}>
                <Button colorScheme="green" size="lg" onClick={onCorrectGuess} borderRadius="full" px={8}>
                  Oui, trouvé !
                </Button>
                <Button colorScheme="red" variant="outline" size="lg" onClick={onSkipGuess} borderRadius="full" px={8}>
                  Pas trouvé
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </VStack>
    );
  }

  return (
    <Box>
      <VStack spacing={3} align="stretch" mb={cluesRevealed < wordItem.clues.length ? 4 : 8}>
        {wordItem.clues.slice(0, cluesRevealed).map((clue, index) => (
          <Box key={index} p={4} bg="brand.50" borderRadius="12px" borderLeft="4px solid" borderColor="brand.500">
            <Text fontSize="xs" fontWeight="bold" color="brand.400" textTransform="uppercase" mb={1}>
              Indice {index + 1}
            </Text>
            <Text color="gray.700" fontSize="lg">{clue}</Text>
          </Box>
        ))}
      </VStack>

      {cluesRevealed < wordItem.clues.length && (
        <Button 
          variant="ghost" 
          colorScheme="brand" 
          onClick={handleRevealClue}
          mb={8}
          w="100%"
          borderStyle="dashed"
          borderWidth="2px"
          borderColor="brand.200"
        >
          + Révéler un indice
        </Button>
      )}

      <form onSubmit={handleSubmit}>
        <Flex gap={2} mb={4} direction={{ base: 'column', sm: 'row' }}>
          <Input
            ref={inputRef}
            variant="glass"
            size="lg"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Entrez votre réponse..."
            autoComplete="off"
            animation={isError ? `${shakeAnimation} 0.5s ease-in-out` : undefined}
            borderColor={isError ? "red.400" : "whiteAlpha.400"}
            _focus={{ borderColor: isError ? "red.400" : "brand.500" }}
          />
          <Button type="submit" colorScheme="brand" size="lg" px={8} disabled={!guess.trim()}>
            Valider
          </Button>
        </Flex>
        <Button 
          type="button" 
          variant="link" 
          colorScheme="gray" 
          size="sm" 
          w="100%" 
          onClick={() => setMatchState('revealed')}
        >
          Découvrir le mot
        </Button>
      </form>
    </Box>
  );
};

export default WordGuess;
