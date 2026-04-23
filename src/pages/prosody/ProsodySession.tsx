import React, { useState } from 'react';
import { Box, Flex, Heading, Text, IconButton, ButtonGroup, Button, Divider, Progress } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

export interface ProsodyResult {
  phrase: string;
  isValidated: boolean;
}

interface ProsodySessionProps {
  phrases: string[];
  onFinish: (results: ProsodyResult[]) => void;
}

type DifficultyId = 'short' | 'medium' | 'long';

export const getDifficultyInfo = (phrase: string): { id: DifficultyId; label: string; colorScheme: string } => {
  const wordCount = phrase.trim().split(/\s+/).filter(word => word.match(/[a-zA-ZÀ-ÿ0-9]/)).length;
  if (wordCount <= 3) return { id: 'short', label: 'Courte', colorScheme: 'green' };
  if (wordCount <= 6) return { id: 'medium', label: 'Moyenne', colorScheme: 'orange' };
  return { id: 'long', label: 'Longue', colorScheme: 'red' };
};

const ProsodySession: React.FC<ProsodySessionProps> = ({ phrases, onFinish }) => {
  const [results, setResults] = useState<ProsodyResult[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('short');

  // Phrases de la difficulté sélectionnée
  const currentDifficultyPhrases = phrases.filter(p => getDifficultyInfo(p).id === selectedDifficulty);
  
  // Phrases non encore jouées dans cette difficulté
  const unplayedPhrases = currentDifficultyPhrases.filter(p => !results.some(r => r.phrase === p));
  const currentPhrase = unplayedPhrases.length > 0 ? unplayedPhrases[0] : null;

  const handleValidation = (isValidated: boolean) => {
    if (!currentPhrase) return;
    
    const newResult = {
      phrase: currentPhrase,
      isValidated
    };
    
    const nextResults = [...results, newResult];
    setResults(nextResults);
    
    // Auto-switch to next difficulty if current is empty
    const currentDiffRemaining = phrases.filter(p => getDifficultyInfo(p).id === selectedDifficulty && !nextResults.some(r => r.phrase === p)).length;
    
    if (currentDiffRemaining === 0) {
      const difficulties: DifficultyId[] = ['short', 'medium', 'long'];
      const currentIndex = difficulties.indexOf(selectedDifficulty);
      
      for (let i = currentIndex + 1; i < difficulties.length; i++) {
        const nextDiff = difficulties[i];
        const nextRemaining = phrases.filter(p => getDifficultyInfo(p).id === nextDiff && !nextResults.some(r => r.phrase === p)).length;
        if (nextRemaining > 0) {
          setSelectedDifficulty(nextDiff);
          break;
        }
      }
    }
  };

  const handleFinish = () => {
    onFinish(results);
  };

  const progress = (results.length / phrases.length) * 100;

  const getDifficultyCount = (diff: DifficultyId) => {
    return phrases.filter(p => getDifficultyInfo(p).id === diff).length;
  };

  const getRemainingCount = (diff: DifficultyId) => {
    return phrases.filter(p => getDifficultyInfo(p).id === diff && !results.some(r => r.phrase === p)).length;
  };

  return (
    <Flex direction="column" align="center" justify="center" w="100%" maxW="800px" mx="auto" layerStyle="glass" p={8} overflow="hidden">
      {/* Header section: Text, Progress Bar, and Difficulty Selector */}
      <Box w="100%" mb={8}>
        <Flex w="100%" align="flex-end" justify="space-between" gap={8} direction={{ base: 'column', md: 'row' }}>
          <Box flex="1" w="100%">
            <Text color="gray.500" fontWeight="bold" textAlign="center" mb={2}>
              {results.length} phrase(s) travaillée(s)
            </Text>
            <Progress value={progress} size="sm" colorScheme="brand" borderRadius="full" bg="blackAlpha.200" />
          </Box>
          
          <ButtonGroup size="sm" isAttached variant="outline" flexShrink={0}>
            <Button 
              isActive={selectedDifficulty === 'short'} 
              onClick={() => setSelectedDifficulty('short')}
              isDisabled={getDifficultyCount('short') === 0}
              colorScheme={selectedDifficulty === 'short' ? 'green' : 'gray'}
            >
              Courtes ({getRemainingCount('short')})
            </Button>
            <Button 
              isActive={selectedDifficulty === 'medium'} 
              onClick={() => setSelectedDifficulty('medium')}
              isDisabled={getDifficultyCount('medium') === 0}
              colorScheme={selectedDifficulty === 'medium' ? 'orange' : 'gray'}
            >
              Moyennes ({getRemainingCount('medium')})
            </Button>
            <Button 
              isActive={selectedDifficulty === 'long'} 
              onClick={() => setSelectedDifficulty('long')}
              isDisabled={getDifficultyCount('long') === 0}
              colorScheme={selectedDifficulty === 'long' ? 'red' : 'gray'}
            >
              Longues ({getRemainingCount('long')})
            </Button>
          </ButtonGroup>
        </Flex>
      </Box>

      <Box minH="200px" display="flex" alignItems="center" justifyContent="center" mb={10} w="100%">
        {currentPhrase ? (
          <Heading 
            as="h2" 
            size="2xl" 
            textAlign="center" 
            color="gray.800"
            lineHeight="1.4"
          >
            {currentPhrase}
          </Heading>
        ) : (
          <Text fontSize="xl" color="gray.500" textAlign="center" fontStyle="italic">
            Vous avez terminé toutes les phrases de cette difficulté.<br/>
            Sélectionnez une autre difficulté ou terminez l'exercice.
          </Text>
        )}
      </Box>

      <Flex gap={8} w="100%" justify="center" mb={8}>
        <Flex direction="column" align="center" gap={3}>
          <IconButton
            aria-label="Ne pas valider"
            icon={<CloseIcon boxSize={8} />}
            colorScheme="red"
            size="xl"
            w="80px"
            h="80px"
            borderRadius="full"
            isDisabled={!currentPhrase}
            onClick={() => handleValidation(false)}
            boxShadow="0 10px 20px rgba(229, 62, 62, 0.3)"
            _hover={currentPhrase ? { transform: 'translateY(-2px)', boxShadow: '0 12px 24px rgba(229, 62, 62, 0.4)' } : undefined}
            transition="all 0.2s"
          />
          <Text color="red.500" fontWeight="bold" opacity={!currentPhrase ? 0.5 : 1}>À revoir</Text>
        </Flex>

        <Flex direction="column" align="center" gap={3}>
          <IconButton
            aria-label="Valider"
            icon={<CheckIcon boxSize={8} />}
            colorScheme="green"
            size="xl"
            w="80px"
            h="80px"
            borderRadius="full"
            isDisabled={!currentPhrase}
            onClick={() => handleValidation(true)}
            boxShadow="0 10px 20px rgba(56, 161, 105, 0.3)"
            _hover={currentPhrase ? { transform: 'translateY(-2px)', boxShadow: '0 12px 24px rgba(56, 161, 105, 0.4)' } : undefined}
            transition="all 0.2s"
          />
          <Text color="green.500" fontWeight="bold" opacity={!currentPhrase ? 0.5 : 1}>Validé</Text>
        </Flex>
      </Flex>

      <Divider mb={6} />
      
      <Button 
        colorScheme="brand" 
        variant={results.length > 0 ? 'solid' : 'ghost'} 
        size="lg" 
        w="100%" 
        maxW="300px"
        onClick={handleFinish}
        isDisabled={results.length === 0}
      >
        Terminer l'exercice
      </Button>
    </Flex>
  );
};

export default ProsodySession;
