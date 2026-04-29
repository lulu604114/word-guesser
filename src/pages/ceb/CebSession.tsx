import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  HStack,
  Badge,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons';
import TextReader from '../../components/ceb/TextReader';
import QuestionCard from '../../components/ceb/QuestionCard';
import CebResults from '../../components/ceb/CebResults';
import type { CebText, UserAnswer, AnswersMap } from '../../types/ceb';

interface CebSessionProps {
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

const CebSession: React.FC<CebSessionProps> = ({ text, onExit }) => {
  // Highlighting state — persisted across tab switches (managed here, not in TextReader)
  const [highlightedWords, setHighlightedWords] = useState<Set<number>>(new Set());

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Question navigation
  const questions = text.questions ?? [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleToggleHighlight = (index: number) => {
    setHighlightedWords(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleAnswer = (answer: UserAnswer) => {
    if (isSubmitted) return;
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: answer }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setShowResults(false);
    setHighlightedWords(new Set());
    setActiveTab(0);
  };

  const currentQuestion = questions[currentIdx];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = Object.keys(answers).length;

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
          <Badge colorScheme={LEVEL_COLORS[text.level]} borderRadius="8px" mt={1}>
            {LEVEL_LABELS[text.level]}
          </Badge>
        </VStack>
        <Box w="80px" /> {/* spacer */}
      </Flex>

      {/* Main tabs */}
      <Tabs
        index={activeTab}
        onChange={setActiveTab}
        variant="enclosed"
        isFitted
      >
        <TabList
          bg="rgba(255,255,255,0.4)"
          borderRadius="16px 16px 0 0"
          border="1px solid rgba(255,255,255,0.6)"
          p={1}
          gap={1}
        >
          <Tab
            borderRadius="12px"
            fontWeight="600"
            _selected={{
              bg: 'white',
              color: 'brand.600',
              boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
            }}
            _hover={{ bg: 'rgba(255,255,255,0.6)' }}
          >
            📖 Texte
            {highlightedWords.size > 0 && (
              <Badge ml={2} colorScheme="yellow" borderRadius="full" fontSize="10px">
                {highlightedWords.size}
              </Badge>
            )}
          </Tab>
          <Tab
            borderRadius="12px"
            fontWeight="600"
            _selected={{
              bg: 'white',
              color: 'brand.600',
              boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
            }}
            _hover={{ bg: 'rgba(255,255,255,0.6)' }}
          >
            ✏️ Questions
            {questions.length > 0 && (
              <Badge ml={2} colorScheme="brand" borderRadius="full" fontSize="10px">
                {answeredCount}/{questions.length}
              </Badge>
            )}
          </Tab>
        </TabList>

        <TabPanels>
          {/* TEXT TAB */}
          <TabPanel
            bg="rgba(255,255,255,0.5)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255,255,255,0.6)"
            borderRadius="0 0 20px 20px"
            boxShadow="0 8px 32px rgba(31,38,135,0.07)"
            p={8}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Text fontSize="sm" color="gray.400" fontStyle="italic">
                Clique sur les mots pour les surligner
              </Text>
              {highlightedWords.size > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => setHighlightedWords(new Set())}
                >
                  Effacer surlignages
                </Button>
              )}
            </Flex>
            <TextReader
              content={text.content}
              highlightedWords={highlightedWords}
              onToggleHighlight={handleToggleHighlight}
            />
            {questions.length > 0 && (
              <Flex justify="center" mt={8}>
                <Button
                  colorScheme="brand"
                  size="lg"
                  onClick={() => setActiveTab(1)}
                  rightIcon={<ArrowForwardIcon />}
                >
                  Aller aux questions
                </Button>
              </Flex>
            )}
          </TabPanel>

          {/* QUESTIONS TAB */}
          <TabPanel
            bg="rgba(255,255,255,0.5)"
            backdropFilter="blur(16px)"
            border="1px solid rgba(255,255,255,0.6)"
            borderRadius="0 0 20px 20px"
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
                {/* Progress bar */}
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

                {/* Quick nav dots */}
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
                        bg={
                          isCurrent
                            ? 'brand.500'
                            : isAnswered
                            ? 'brand.200'
                            : 'gray.200'
                        }
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CebSession;
