import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Progress,
  IconButton,
  Center,
  Tooltip,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  CheckIcon,
} from '@chakra-ui/icons';
import QuestionCard from '../../components/ceb/QuestionCard';
import CebResults from '../../components/ceb/CebResults';
import type { CebText, UserAnswer, AnswersMap } from '../../types/ceb';

interface CebOralSessionProps {
  text: CebText;
  onExit: () => void;
}

const LEVEL_LABELS: Record<string, string> = {
  court: 'Texte court',
  moyen: 'Texte moyen',
  long: 'Texte long',
};

const LEVEL_COLORS: Record<string, string> = {
  court: 'green',
  moyen: 'blue',
  long: 'purple',
};

type TtsState = 'idle' | 'playing' | 'paused' | 'done';

const CebOralSession: React.FC<CebOralSessionProps> = ({ text, onExit }) => {
  const questions = text.questions ?? [];

  // TTS state
  const [ttsState, setTtsState] = useState<TtsState>('idle');
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Split text into sentences for progress display
  const sentences = text.content
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);

  // Question navigation
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getFrenchVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang.startsWith('fr')) ?? voices[0] ?? null
    );
  };

  const handlePlay = useCallback(() => {
    if (ttsState === 'paused') {
      window.speechSynthesis.resume();
      setTtsState('playing');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.content);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    const voice = getFrenchVoice();
    if (voice) utterance.voice = voice;

    // Track sentence progress via boundary events
    let charIdx = 0;
    utterance.onboundary = (event) => {
      if (event.name === 'sentence') {
        charIdx = event.charIndex;
        // Find which sentence we're in
        let cumLen = 0;
        for (let i = 0; i < sentences.length; i++) {
          cumLen += sentences[i].length + 1; // +1 for space
          if (charIdx < cumLen) {
            setCurrentSentenceIdx(i);
            break;
          }
        }
      }
    };

    utterance.onstart = () => {
      setTtsState('playing');
      setCurrentSentenceIdx(0);
    };

    utterance.onend = () => {
      setTtsState('done');
      setCurrentSentenceIdx(-1);
    };

    utterance.onerror = () => {
      setTtsState('idle');
      setCurrentSentenceIdx(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text.content, ttsState, sentences]);

  const handlePause = () => {
    window.speechSynthesis.pause();
    setTtsState('paused');
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setTtsState('idle');
    setCurrentSentenceIdx(-1);
  };

  const handleReplay = () => {
    window.speechSynthesis.cancel();
    setTtsState('idle');
    setCurrentSentenceIdx(-1);
    setTimeout(() => handlePlay(), 100);
  };

  // Question handlers
  const handleAnswer = (answer: UserAnswer) => {
    if (isSubmitted) return;
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: answer }));
  };

  const handleSubmit = () => setIsSubmitted(true);
  const handleFinish = () => setShowResults(true);

  const handleRestart = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setShowResults(false);
    setShowQuestions(false);
    handleStop();
  };

  const currentQuestion = questions[currentIdx];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = Object.keys(answers).length;

  // ── Results ──────────────────────────────────────────────
  if (showResults) {
    return (
      <Box>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          colorScheme="gray"
          mb={6}
          onClick={onExit}
        >
          Retour aux textes
        </Button>
        <CebResults
          questions={questions}
          answers={answers}
          onRestart={handleRestart}
          onChangeText={onExit}
        />
      </Box>
    );
  }

  // ── Questions panel ───────────────────────────────────────
  if (showQuestions) {
    return (
      <Box w="100%">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            colorScheme="gray"
            size="sm"
            onClick={() => {
              setShowQuestions(false);
              handleStop();
            }}
          >
            Réécouter
          </Button>
          <VStack spacing={0} align="center">
            <Heading as="h2" size="md" color="gray.800">
              {text.title}
            </Heading>
            <HStack mt={1}>
              <Badge colorScheme={LEVEL_COLORS[text.level]} borderRadius="8px">
                {LEVEL_LABELS[text.level]}
              </Badge>
              <Badge colorScheme="orange" borderRadius="8px">🎧 Oral</Badge>
            </HStack>
          </VStack>
          <Box w="80px" />
        </Flex>

        {/* Questions */}
        <Box
          bg="rgba(255,255,255,0.5)"
          backdropFilter="blur(16px)"
          border="1px solid rgba(255,255,255,0.6)"
          borderRadius="20px"
          boxShadow="0 8px 32px rgba(31,38,135,0.07)"
          p={8}
        >
          {questions.length === 0 ? (
            <Flex direction="column" align="center" py={12}>
              <Text fontSize="xl" color="gray.400" fontStyle="italic">
                Aucune question pour ce texte.
              </Text>
            </Flex>
          ) : (
            <VStack align="stretch" spacing={6}>
              {/* Progress */}
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.500" fontWeight="600">
                    Question {currentIdx + 1} sur {questions.length}
                  </Text>
                  <Text fontSize="sm" color="brand.500" fontWeight="600">
                    {answeredCount} répondu{answeredCount > 1 ? 's' : ''}
                  </Text>
                </Flex>
                <Progress
                  value={((currentIdx + 1) / questions.length) * 100}
                  colorScheme="brand"
                  borderRadius="full"
                  size="sm"
                  bg="rgba(99,102,241,0.1)"
                />
              </Box>

              {/* Question card */}
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  answer={currentAnswer}
                  onChange={handleAnswer}
                  isSubmitted={isSubmitted}
                />
              )}

              {/* Navigation */}
              <HStack justify="space-between">
                <IconButton
                  aria-label="Question précédente"
                  icon={<ArrowBackIcon />}
                  isDisabled={currentIdx === 0}
                  onClick={() => {
                    setCurrentIdx(i => i - 1);
                    setIsSubmitted(false);
                  }}
                  variant="outline"
                  colorScheme="gray"
                  borderRadius="12px"
                />

                <HStack spacing={2}>
                  {!isSubmitted && currentAnswer !== undefined && (
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      onClick={handleSubmit}
                      leftIcon={<CheckIcon />}
                      borderRadius="12px"
                    >
                      Valider
                    </Button>
                  )}
                  {currentIdx < questions.length - 1 ? (
                    <Button
                      colorScheme="brand"
                      rightIcon={<ArrowForwardIcon />}
                      onClick={() => {
                        setCurrentIdx(i => i + 1);
                        setIsSubmitted(false);
                      }}
                      borderRadius="12px"
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      colorScheme="green"
                      onClick={handleFinish}
                      leftIcon={<CheckIcon />}
                      borderRadius="12px"
                    >
                      Terminer
                    </Button>
                  )}
                </HStack>

                <IconButton
                  aria-label="Question suivante"
                  icon={<ArrowForwardIcon />}
                  isDisabled={currentIdx === questions.length - 1}
                  onClick={() => {
                    setCurrentIdx(i => i + 1);
                    setIsSubmitted(false);
                  }}
                  variant="outline"
                  colorScheme="gray"
                  borderRadius="12px"
                />
              </HStack>

              {/* Dots nav */}
              <Flex justify="center" gap={2} flexWrap="wrap">
                {questions.map((q, i) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = i === currentIdx;
                  return (
                    <Box
                      key={q.id}
                      w="10px"
                      h="10px"
                      borderRadius="50%"
                      cursor="pointer"
                      bg={isCurrent ? 'brand.500' : isAnswered ? 'brand.200' : 'gray.200'}
                      border={isCurrent ? '2px solid' : '1px solid'}
                      borderColor={isCurrent ? 'brand.600' : 'transparent'}
                      transition="all 0.2s"
                      onClick={() => {
                        setCurrentIdx(i);
                        setIsSubmitted(false);
                      }}
                      _hover={{ transform: 'scale(1.3)' }}
                      title={`Question ${i + 1}`}
                    />
                  );
                })}
              </Flex>
            </VStack>
          )}
        </Box>
      </Box>
    );
  }

  // ── TTS Listening panel ───────────────────────────────────
  const playbackProgress =
    currentSentenceIdx >= 0 && sentences.length > 0
      ? ((currentSentenceIdx + 1) / sentences.length) * 100
      : ttsState === 'done'
      ? 100
      : 0;

  return (
    <Box w="100%">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          colorScheme="gray"
          size="sm"
          onClick={onExit}
        >
          Textes
        </Button>
        <VStack spacing={0} align="center">
          <Heading as="h2" size="md" color="gray.800">
            {text.title}
          </Heading>
          <HStack mt={1}>
            <Badge colorScheme={LEVEL_COLORS[text.level]} borderRadius="8px">
              {LEVEL_LABELS[text.level]}
            </Badge>
            <Badge colorScheme="orange" borderRadius="8px">🎧 Oral</Badge>
          </HStack>
        </VStack>
        <Box w="80px" />
      </Flex>

      {/* Listening card */}
      <Box
        bg="rgba(255,255,255,0.5)"
        backdropFilter="blur(16px)"
        border="1px solid rgba(255,255,255,0.6)"
        borderRadius="20px"
        boxShadow="0 8px 32px rgba(31,38,135,0.07)"
        p={{ base: 6, md: 10 }}
      >
        <VStack spacing={8} align="stretch">
          {/* Icon + instruction */}
          <Center flexDir="column" gap={3}>
            <Box
              fontSize="5xl"
              animation={ttsState === 'playing' ? 'pulse 1.5s ease-in-out infinite' : 'none'}
              sx={{
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.15)', opacity: 0.75 },
                },
              }}
            >
              🎧
            </Box>
            <Heading as="h3" size="md" color="gray.700" textAlign="center">
              {ttsState === 'idle' && 'Écoute bien le texte !'}
              {ttsState === 'playing' && 'Lecture en cours…'}
              {ttsState === 'paused' && 'Lecture en pause'}
              {ttsState === 'done' && 'Lecture terminée !'}
            </Heading>
            <Text fontSize="sm" color="gray.400" textAlign="center" maxW="400px">
              {ttsState === 'idle' && "Appuie sur ▶️ pour écouter le texte. Tu peux l'écouter autant de fois que tu veux avant de répondre aux questions."}
              {ttsState === 'playing' && 'Écoute attentivement…'}
              {ttsState === 'paused' && 'Appuie sur ▶️ pour reprendre la lecture.'}
              {ttsState === 'done' && 'Tu peux réécouter ou passer aux questions quand tu es prêt(e).'}
            </Text>
          </Center>

          {/* Progress bar */}
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontSize="xs" color="gray.400">Progression</Text>
              {currentSentenceIdx >= 0 && (
                <Text fontSize="xs" color="brand.500">
                  Phrase {currentSentenceIdx + 1} / {sentences.length}
                </Text>
              )}
            </Flex>
            <Progress
              value={playbackProgress}
              colorScheme="brand"
              borderRadius="full"
              size="md"
              bg="rgba(99,102,241,0.1)"
              transition="value 0.3s"
            />
          </Box>

          {/* TTS controls */}
          <HStack justify="center" spacing={4}>
            <Tooltip label="Arrêter" placement="bottom">
              <IconButton
                aria-label="Arrêter la lecture"
                icon={<Text fontSize="lg">⏹</Text>}
                isDisabled={ttsState === 'idle'}
                onClick={handleStop}
                variant="outline"
                colorScheme="red"
                borderRadius="full"
                size="lg"
                w="56px"
                h="56px"
              />
            </Tooltip>

            {ttsState === 'playing' ? (
              <Tooltip label="Pause" placement="bottom">
                <IconButton
                  aria-label="Pause"
                  icon={<Text fontSize="xl">⏸</Text>}
                  onClick={handlePause}
                  colorScheme="brand"
                  borderRadius="full"
                  size="xl"
                  w="72px"
                  h="72px"
                  fontSize="2xl"
                  boxShadow="0 4px 20px rgba(99,102,241,0.35)"
                />
              </Tooltip>
            ) : (
              <Tooltip
                label={ttsState === 'done' ? 'Réécouter' : 'Écouter'}
                placement="bottom"
              >
                <IconButton
                  aria-label={ttsState === 'done' ? 'Réécouter' : 'Écouter'}
                  icon={<Text fontSize="xl">{ttsState === 'done' ? '🔁' : '▶️'}</Text>}
                  onClick={ttsState === 'done' ? handleReplay : handlePlay}
                  colorScheme="brand"
                  borderRadius="full"
                  size="xl"
                  w="72px"
                  h="72px"
                  boxShadow="0 4px 20px rgba(99,102,241,0.35)"
                />
              </Tooltip>
            )}

            <Tooltip label="Réécouter depuis le début" placement="bottom">
              <IconButton
                aria-label="Réécouter depuis le début"
                icon={<Text fontSize="lg">⏮</Text>}
                isDisabled={ttsState === 'idle'}
                onClick={handleReplay}
                variant="outline"
                colorScheme="gray"
                borderRadius="full"
                size="lg"
                w="56px"
                h="56px"
              />
            </Tooltip>
          </HStack>

          {/* Go to questions */}
          <Center pt={2}>
            <Button
              colorScheme="brand"
              size="lg"
              rightIcon={<ArrowForwardIcon />}
              onClick={() => {
                handleStop();
                setShowQuestions(true);
              }}
              isDisabled={questions.length === 0}
              borderRadius="14px"
              px={8}
              boxShadow="0 4px 16px rgba(99,102,241,0.25)"
              _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}
              transition="all 0.2s"
            >
              {ttsState === 'idle'
                ? 'Passer aux questions'
                : ttsState === 'done'
                ? 'Passer aux questions'
                : "J'ai compris, passer aux questions"}
            </Button>
          </Center>

          {questions.length === 0 && (
            <Text textAlign="center" fontSize="sm" color="gray.400" fontStyle="italic">
              Aucune question pour ce texte.
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default CebOralSession;
