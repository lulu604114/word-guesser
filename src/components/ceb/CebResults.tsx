import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Divider,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import type { CebQuestion, UserAnswer } from '../../types/ceb';

interface CebResultsProps {
  questions: CebQuestion[];
  answers: Record<string, UserAnswer>;
  onRestart: () => void;
  onChangeText: () => void;
}

const CebResults: React.FC<CebResultsProps> = ({
  questions,
  answers,
  onRestart,
  onChangeText,
}) => {
  const autoCorrectableTypes = ['qcm', 'multiple', 'vrai_faux', 'fermee'];

  const scored = questions.filter(q => autoCorrectableTypes.includes(q.type));
  const openQuestions = questions.filter(q => q.type === 'ouverte');

  let correctCount = 0;
  const scoredResults = scored.map(q => {
    const ans = answers[q.id];
    let isCorrect = false;

    if (ans?.type === 'qcm') {
      const opt = q.options.find(o => o.id === ans.value);
      isCorrect = opt?.is_correct ?? false;
    } else if (ans?.type === 'multiple') {
      const correctIds = new Set(q.options.filter(o => o.is_correct).map(o => o.id));
      const selectedIds = new Set(ans.value);
      isCorrect =
        correctIds.size === selectedIds.size &&
        [...correctIds].every(id => selectedIds.has(id));
    } else if (ans?.type === 'vrai_faux') {
      const correctOption = q.options.find(o => o.is_correct);
      isCorrect = correctOption?.option_text.toLowerCase() === ans.value;
    } else if (ans?.type === 'fermee') {
      const correctOption = q.options.find(o => o.is_correct);
      isCorrect = correctOption?.option_text.toLowerCase() === ans.value;
    }

    if (isCorrect) correctCount++;
    return { question: q, answer: ans, isCorrect };
  });

  const percentage = scored.length > 0 ? Math.round((correctCount / scored.length) * 100) : 0;

  const progressColor =
    percentage >= 80 ? 'green.400' : percentage >= 50 ? 'orange.400' : 'red.400';

  const getMessage = () => {
    if (percentage === 100) return '🎉 Parfait ! Bravo !';
    if (percentage >= 80) return '😊 Très bien !';
    if (percentage >= 50) return '🙂 Pas mal !';
    return '💪 Continue tes efforts !';
  };

  return (
    <Box layerStyle="glass">
      <VStack spacing={6} align="stretch">
        {/* Score header */}
        <Flex direction="column" align="center" py={4}>
          <CircularProgress
            value={percentage}
            size="120px"
            thickness="8px"
            color={progressColor}
            trackColor="gray.100"
          >
            <CircularProgressLabel>
              <Text fontSize="2xl" fontWeight="800" color="gray.800">
                {correctCount}/{scored.length}
              </Text>
            </CircularProgressLabel>
          </CircularProgress>

          <Heading as="h2" size="lg" mt={4} color="gray.800">
            {getMessage()}
          </Heading>
          <Text color="gray.500" mt={1}>
            {percentage}% de bonnes réponses
            {openQuestions.length > 0 && ` (${openQuestions.length} question${openQuestions.length > 1 ? 's' : ''} ouverte${openQuestions.length > 1 ? 's' : ''} non comptée${openQuestions.length > 1 ? 's' : ''})`}
          </Text>
        </Flex>

        <Divider borderColor="rgba(0,0,0,0.08)" />

        {/* Scored questions detail */}
        {scoredResults.length > 0 && (
          <Box>
            <Heading size="sm" color="gray.600" mb={3}>
              Détail des réponses
            </Heading>
            <VStack align="stretch" spacing={3}>
              {scoredResults.map(({ question, isCorrect }, i) => (
                <Box
                  key={question.id}
                  p={4}
                  borderRadius="12px"
                  bg={isCorrect ? 'rgba(22,163,74,0.07)' : 'rgba(239,68,68,0.07)'}
                  border="1px solid"
                  borderColor={isCorrect ? 'green.200' : 'red.200'}
                >
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="sm" fontWeight="600" color="gray.600">
                      Question {i + 1}
                    </Text>
                    <Badge colorScheme={isCorrect ? 'green' : 'red'} borderRadius="8px">
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" mb={2}>
                    {question.question_text}
                  </Text>
                  {!isCorrect && (
                    <Text fontSize="xs" color="green.600" fontStyle="italic">
                      Bonne réponse :{' '}
                      {question.options.filter(o => o.is_correct).map(o => o.option_text).join(', ')}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Open questions review */}
        {openQuestions.length > 0 && (
          <Box>
            <Divider borderColor="rgba(0,0,0,0.08)" mb={4} />
            <Heading size="sm" color="gray.600" mb={3}>
              Questions ouvertes — à corriger avec un adulte
            </Heading>
            <VStack align="stretch" spacing={3}>
              {openQuestions.map((q, i) => {
                const ans = answers[q.id];
                const userText = ans?.type === 'ouverte' ? ans.value : '(pas de réponse)';
                return (
                  <Box
                    key={q.id}
                    p={4}
                    borderRadius="12px"
                    bg="rgba(99,102,241,0.05)"
                    border="1px solid rgba(99,102,241,0.2)"
                  >
                    <Text fontSize="sm" fontWeight="600" color="brand.600" mb={1}>
                      Question ouverte {i + 1}
                    </Text>
                    <Text fontSize="sm" color="gray.700" fontWeight="500" mb={2}>
                      {q.question_text}
                    </Text>
                    <Box
                      p={3}
                      bg="white"
                      borderRadius="8px"
                      border="1px solid rgba(0,0,0,0.08)"
                    >
                      <Text fontSize="xs" color="gray.400" mb={1}>Ta réponse :</Text>
                      <Text fontSize="sm" color="gray.700" fontStyle={userText === '(pas de réponse)' ? 'italic' : 'normal'}>
                        {userText}
                      </Text>
                    </Box>
                    {q.draft_answer && (
                      <Box mt={2} p={3} bg="rgba(99,102,241,0.07)" borderRadius="8px" borderLeft="3px solid" borderColor="brand.400">
                        <Text fontSize="xs" color="brand.500" fontWeight="700" mb={1} textTransform="uppercase">
                          Ébauche de réponse
                        </Text>
                        <Text fontSize="sm" color="gray.700">{q.draft_answer}</Text>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </VStack>
          </Box>
        )}

        {/* Action buttons */}
        <Flex gap={3} pt={2}>
          <Button variant="outline" colorScheme="gray" onClick={onChangeText} flex={1}>
            Changer de texte
          </Button>
          <Button colorScheme="brand" onClick={onRestart} flex={1}>
            Recommencer
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default CebResults;
