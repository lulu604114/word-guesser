import React, { useState } from 'react';
import { Box, Flex, Heading, Text, IconButton, ButtonGroup, Button, Divider, Progress, Icon } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(229, 62, 62, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
`;

const MicrophoneIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.39-.9.88 0 2.76-2.24 5-5.01 5s-5.01-2.24-5.01-5c0-.49-.41-.88-.9-.88s-.9.39-.9.88c0 3.31 2.45 6.04 5.61 6.46V21h-3c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1h-3v-2.66c3.16-.42 5.61-3.15 5.61-6.46 0-.49-.41-.88-.9-.88z" />
  </Icon>
);

const StopIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M6 6h12v12H6z" />
  </Icon>
);

export interface ProsodyResult {
  phrase: string;
  isValidated: boolean;
  audioUrl?: string | null;
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

  const {
    audioUrl,
    isRecording,
    isInitializingMic,
    startRecording,
    stopRecording,
    discardAudio,
    resetAudio,
  } = useAudioRecorder();

  // Phrases de la difficulté sélectionnée
  const currentDifficultyPhrases = phrases.filter(p => getDifficultyInfo(p).id === selectedDifficulty);

  // Phrases non encore jouées dans cette difficulté
  const unplayedPhrases = currentDifficultyPhrases.filter(p => !results.some(r => r.phrase === p));
  const currentPhrase = unplayedPhrases.length > 0 ? unplayedPhrases[0] : null;

  const handleValidation = (isValidated: boolean) => {
    if (!currentPhrase) return;
    
    // Save current audioUrl before resetting UI
    const currentAudioUrl = audioUrl;

    // Reset audio avant de passer à la phrase suivante
    resetAudio();

    const newResult = {
      phrase: currentPhrase,
      isValidated,
      audioUrl: currentAudioUrl
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

      <Box minH="200px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" mb={10} w="100%">
        {currentPhrase ? (
          <>
            <Heading
              as="h2"
              size="2xl"
              textAlign="center"
              color="gray.800"
              lineHeight="1.4"
              mb={8}
            >
              {currentPhrase}
            </Heading>

            {/* Audio Recording Section */}
            <Flex direction="column" align="center" minH="80px">
              {!audioUrl ? (
                <Button
                  colorScheme={isRecording ? 'red' : 'brand'}
                  size="lg"
                  borderRadius="full"
                  w="64px"
                  h="64px"
                  isLoading={isInitializingMic}
                  onClick={isRecording ? stopRecording : startRecording}
                  animation={isRecording ? `${pulseAnimation} 1.5s infinite` : undefined}
                >
                  {isRecording ? <StopIcon boxSize={6} /> : <MicrophoneIcon boxSize={6} />}
                </Button>
              ) : (
                <Flex align="center" gap={4} bg="gray.50" p={2} pr={4} borderRadius="full" border="1px solid" borderColor="gray.200">
                  <IconButton
                    aria-label="Recommencer l'enregistrement"
                    icon={<DeleteIcon />}
                    colorScheme="gray"
                    variant="ghost"
                    isRound
                    onClick={discardAudio}
                  />
                  <audio controls src={audioUrl} style={{ height: '40px' }} />
                </Flex>
              )}
            </Flex>
          </>
        ) : (
          <Text fontSize="xl" color="gray.500" textAlign="center" fontStyle="italic">
            Vous avez terminé toutes les phrases de cette difficulté.<br />
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
