import React, { useState } from 'react';
import { Box, Flex, Text, Button, Progress, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton, Badge, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import type { WordList } from '../data/wordLists';
import WordGuess from './WordGuess';
import SentenceStep from './SentenceStep';

type GameProps = {
  wordList: WordList;
  onGameOver: () => void;
  onQuit: () => void;
};

const Game: React.FC<GameProps> = ({ wordList, onGameOver, onQuit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSentenceStep, setShowSentenceStep] = useState(false);
  const [skippedWords, setSkippedWords] = useState<string[]>([]);

  const advanceToNext = () => {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < wordList.words.length) {
      if (nextIndex % 5 === 0) {
        setShowSentenceStep(true);
      }
      setCurrentIndex(nextIndex);
    } else {
      if (nextIndex % 5 === 0) {
        setShowSentenceStep(true);
        setCurrentIndex(nextIndex);
      } else {
        onGameOver();
      }
    }
  };

  const handleCorrectGuess = () => {
    advanceToNext();
  };

  const handleSkipGuess = () => {
    setSkippedWords(prev => [...prev, wordList.words[currentIndex].id]);
    advanceToNext();
  };

  const handleSentenceContinue = (sentence: string) => {
    console.log("Phrase créée :", sentence);
    setShowSentenceStep(false);
    if (currentIndex >= wordList.words.length) {
      onGameOver();
    }
  };

  const currentWord = wordList.words[currentIndex];
  // Calculate Progress Percent - Fixed type arithmetic
  const progressPercent = ((currentIndex) / wordList.words.length) * 100;
  
  const allPlayedWords = wordList.words.slice(0, currentIndex);
  const foundWordsCount = allPlayedWords.filter(w => !skippedWords.includes(w.id)).length;

  if (showSentenceStep) {
    const recentWords = allPlayedWords.slice(-5);
    return (
      <Box layerStyle="glass">
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontWeight="bold" color="brand.600">Création de phrase...</Text>
          <Button variant="ghost" colorScheme="red" size="sm" onClick={onQuit}>
            Quitter la partie
          </Button>
        </Flex>
        <SentenceStep words={recentWords} onContinue={handleSentenceContinue} />
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Box layerStyle="glass">
        <Flex justify="space-between" align="center" mb={4}>
          <Box flex="1" mr={4}>
            <Text fontWeight="bold" color="brand.600" mb={2}>
              Mot {currentIndex + 1} sur {wordList.words.length}
            </Text>
            <Progress value={progressPercent} size="sm" colorScheme="brand" borderRadius="full" bg="blackAlpha.200" />
          </Box>
          <Button variant="ghost" colorScheme="red" size="sm" onClick={onQuit}>
            Quitter la partie
          </Button>
        </Flex>

        <WordGuess 
          key={currentWord.id}
          wordItem={currentWord} 
          onCorrectGuess={handleCorrectGuess} 
          onSkipGuess={handleSkipGuess}
        />
      </Box>

      <Box position="fixed" bottom={{ base: 4, md: 8 }} right={{ base: 4, md: 8 }} zIndex={10}>
        <Popover placement="top-end">
          <PopoverTrigger>
            <Button 
              size="lg" 
              colorScheme="yellow" 
              boxShadow="xl" 
              borderRadius="full" 
              w="64px" 
              h="64px" 
              fontSize="2xl"
              position="relative"
            >
              🏆
              <Badge 
                position="absolute" 
                top="-2" 
                right="-2" 
                colorScheme="red" 
                borderRadius="full" 
                fontSize="0.8em"
                px={2}
              >
                {foundWordsCount}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent layerStyle="glass" p={0} border="none" w="300px">
            <PopoverArrow bg="rgba(255,255,255,0.7)" />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="bold" color="brand.600" borderBottomWidth="0">
              Mots devinés ({foundWordsCount})
            </PopoverHeader>
            <PopoverBody maxH="300px" overflowY="auto">
              {allPlayedWords.length === 0 ? (
                <Text color="gray.500" fontSize="sm">Aucun mot joué pour le moment.</Text>
              ) : (
                <List spacing={2}>
                  {allPlayedWords.map((item) => {
                    const isSkipped = skippedWords.includes(item.id);
                    return (
                      <ListItem key={item.id} color={isSkipped ? "gray.400" : "gray.700"}>
                        <ListIcon as={isSkipped ? CloseIcon : CheckCircleIcon} color={isSkipped ? "red.400" : "green.500"} />
                        <Text as="span" textDecoration={isSkipped ? "line-through" : "none"}>
                          {item.word}
                        </Text>
                      </ListItem>
                    )
                  })}
                </List>
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Box>
  );
};

export default Game;
