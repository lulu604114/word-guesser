import React, { useState } from 'react';
import {
  Box,
  Text,
  Button,
  Textarea,
  VStack,
  HStack,
  Collapse,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import type { CebQuestion, UserAnswer } from '../../types/ceb';

interface QuestionCardProps {
  question: CebQuestion;
  answer: UserAnswer | undefined;
  onChange: (answer: UserAnswer) => void;
  isSubmitted: boolean;
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
  qcm: 'QCM',
  multiple: 'Choix multiples',
  vrai_faux: 'Vrai / Faux',
  ouverte: 'Question ouverte',
  fermee: 'Question fermée',
};

const QUESTION_TYPE_COLORS: Record<string, string> = {
  qcm: 'purple',
  multiple: 'blue',
  vrai_faux: 'orange',
  ouverte: 'green',
  fermee: 'teal',
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  onChange,
  isSubmitted,
}) => {
  const [showDraft, setShowDraft] = useState(false);

  const isCorrectOption = (optionId: string) => {
    const opt = question.options.find(o => o.id === optionId);
    return opt?.is_correct ?? false;
  };

  const getAnswerResult = (): 'correct' | 'incorrect' | 'open' | null => {
    if (!isSubmitted || !answer) return null;
    if (answer.type === 'ouverte') return 'open';
    if (answer.type === 'qcm') {
      return isCorrectOption(answer.value) ? 'correct' : 'incorrect';
    }
    if (answer.type === 'vrai_faux') {
      const correctOption = question.options.find(o => o.is_correct);
      return correctOption?.option_text.toLowerCase() === answer.value ? 'correct' : 'incorrect';
    }
    if (answer.type === 'fermee') {
      const correctOption = question.options.find(o => o.is_correct);
      return correctOption?.option_text.toLowerCase() === answer.value ? 'correct' : 'incorrect';
    }
    if (answer.type === 'multiple') {
      const correctIds = new Set(question.options.filter(o => o.is_correct).map(o => o.id));
      const selectedIds = new Set(answer.value);
      const perfect =
        correctIds.size === selectedIds.size &&
        [...correctIds].every(id => selectedIds.has(id));
      return perfect ? 'correct' : 'incorrect';
    }
    return null;
  };

  const result = getAnswerResult();

  const resultBorderColor =
    result === 'correct'
      ? 'rgba(22, 163, 74, 0.6)'
      : result === 'incorrect'
      ? 'rgba(239, 68, 68, 0.6)'
      : result === 'open'
      ? 'rgba(99, 102, 241, 0.4)'
      : 'rgba(255, 255, 255, 0.6)';

  const resultBg =
    result === 'correct'
      ? 'rgba(22, 163, 74, 0.05)'
      : result === 'incorrect'
      ? 'rgba(239, 68, 68, 0.05)'
      : result === 'open'
      ? 'rgba(99, 102, 241, 0.03)'
      : 'rgba(255, 255, 255, 0.4)';

  return (
    <Box
      bg={resultBg}
      border={`2px solid ${resultBorderColor}`}
      borderRadius="16px"
      p={6}
      transition="border-color 0.3s"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Badge
          colorScheme={QUESTION_TYPE_COLORS[question.type]}
          borderRadius="8px"
          px={3}
          py={1}
          fontSize="xs"
          textTransform="none"
        >
          {QUESTION_TYPE_LABELS[question.type]}
        </Badge>

        {isSubmitted && result === 'correct' && (
          <Badge colorScheme="green" borderRadius="8px" px={3} py={1}>✓ Correct</Badge>
        )}
        {isSubmitted && result === 'incorrect' && (
          <Badge colorScheme="red" borderRadius="8px" px={3} py={1}>✗ Incorrect</Badge>
        )}
        {isSubmitted && result === 'open' && (
          <Badge colorScheme="purple" borderRadius="8px" px={3} py={1}>À corriger</Badge>
        )}
      </Flex>

      {/* Question text */}
      <Text fontSize="lg" fontWeight="600" color="gray.800" mb={5} lineHeight="1.6">
        {question.question_text}
      </Text>

      {/* Answer input area */}
      {question.type === 'qcm' && (
        <VStack align="stretch" spacing={3}>
          {question.options.map(option => {
            const isSelected = answer?.type === 'qcm' && answer.value === option.id;
            const showCorrect = isSubmitted && option.is_correct;
            const showWrong = isSubmitted && isSelected && !option.is_correct;

            return (
              <Box
                key={option.id}
                onClick={() => !isSubmitted && onChange({ type: 'qcm', value: option.id })}
                cursor={isSubmitted ? 'default' : 'pointer'}
                px={4}
                py={3}
                borderRadius="12px"
                border="2px solid"
                borderColor={
                  showCorrect
                    ? 'green.400'
                    : showWrong
                    ? 'red.400'
                    : isSelected
                    ? 'brand.400'
                    : 'rgba(255,255,255,0.6)'
                }
                bg={
                  showCorrect
                    ? 'rgba(22,163,74,0.1)'
                    : showWrong
                    ? 'rgba(239,68,68,0.1)'
                    : isSelected
                    ? 'rgba(99,102,241,0.1)'
                    : 'rgba(255,255,255,0.4)'
                }
                transition="all 0.2s"
                _hover={!isSubmitted ? { bg: 'rgba(99,102,241,0.08)', borderColor: 'brand.300' } : {}}
              >
                <HStack>
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="50%"
                    border="2px solid"
                    borderColor={isSelected ? 'brand.500' : 'gray.300'}
                    bg={isSelected ? 'brand.500' : 'transparent'}
                    flexShrink={0}
                    transition="all 0.2s"
                  />
                  <Text fontSize="md" color="gray.700">{option.option_text}</Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}

      {question.type === 'multiple' && (
        <VStack align="stretch" spacing={3}>
          <Text fontSize="xs" color="gray.400" fontStyle="italic">Plusieurs réponses possibles</Text>
          {question.options.map(option => {
            const currentAnswer = answer?.type === 'multiple' ? answer.value : [];
            const isSelected = currentAnswer.includes(option.id);
            const showCorrect = isSubmitted && option.is_correct;
            const showWrong = isSubmitted && isSelected && !option.is_correct;

            const toggle = () => {
              if (isSubmitted) return;
              const newVal = isSelected
                ? currentAnswer.filter(id => id !== option.id)
                : [...currentAnswer, option.id];
              onChange({ type: 'multiple', value: newVal });
            };

            return (
              <Box
                key={option.id}
                onClick={toggle}
                cursor={isSubmitted ? 'default' : 'pointer'}
                px={4}
                py={3}
                borderRadius="12px"
                border="2px solid"
                borderColor={
                  showCorrect
                    ? 'green.400'
                    : showWrong
                    ? 'red.400'
                    : isSelected
                    ? 'brand.400'
                    : 'rgba(255,255,255,0.6)'
                }
                bg={
                  showCorrect
                    ? 'rgba(22,163,74,0.1)'
                    : showWrong
                    ? 'rgba(239,68,68,0.1)'
                    : isSelected
                    ? 'rgba(99,102,241,0.1)'
                    : 'rgba(255,255,255,0.4)'
                }
                transition="all 0.2s"
                _hover={!isSubmitted ? { bg: 'rgba(99,102,241,0.08)', borderColor: 'brand.300' } : {}}
              >
                <HStack>
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="4px"
                    border="2px solid"
                    borderColor={isSelected ? 'brand.500' : 'gray.300'}
                    bg={isSelected ? 'brand.500' : 'transparent'}
                    flexShrink={0}
                    transition="all 0.2s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {isSelected && <Text color="white" fontSize="10px" fontWeight="bold">✓</Text>}
                  </Box>
                  <Text fontSize="md" color="gray.700">{option.option_text}</Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}

      {question.type === 'vrai_faux' && (
        <HStack spacing={4}>
          {(['vrai', 'faux'] as const).map(val => {
            const isSelected = answer?.type === 'vrai_faux' && answer.value === val;
            const correctOption = question.options.find(o => o.is_correct);
            const isCorrectVal = correctOption?.option_text.toLowerCase() === val;
            const showCorrect = isSubmitted && isCorrectVal;
            const showWrong = isSubmitted && isSelected && !isCorrectVal;

            return (
              <Button
                key={val}
                flex={1}
                size="lg"
                variant={isSelected ? 'solid' : 'outline'}
                colorScheme={
                  showCorrect ? 'green' : showWrong ? 'red' : isSelected ? 'brand' : 'gray'
                }
                onClick={() => !isSubmitted && onChange({ type: 'vrai_faux', value: val })}
                isDisabled={isSubmitted}
                textTransform="capitalize"
                borderRadius="12px"
                fontSize="lg"
              >
                {val === 'vrai' ? '✓ Vrai' : '✗ Faux'}
              </Button>
            );
          })}
        </HStack>
      )}

      {question.type === 'fermee' && (
        <HStack spacing={4}>
          {(['oui', 'non'] as const).map(val => {
            const isSelected = answer?.type === 'fermee' && answer.value === val;
            const correctOption = question.options.find(o => o.is_correct);
            const isCorrectVal = correctOption?.option_text.toLowerCase() === val;
            const showCorrect = isSubmitted && isCorrectVal;
            const showWrong = isSubmitted && isSelected && !isCorrectVal;

            return (
              <Button
                key={val}
                flex={1}
                size="lg"
                variant={isSelected ? 'solid' : 'outline'}
                colorScheme={
                  showCorrect ? 'green' : showWrong ? 'red' : isSelected ? 'brand' : 'gray'
                }
                onClick={() => !isSubmitted && onChange({ type: 'fermee', value: val })}
                isDisabled={isSubmitted}
                textTransform="capitalize"
                borderRadius="12px"
                fontSize="lg"
              >
                {val === 'oui' ? '👍 Oui' : '👎 Non'}
              </Button>
            );
          })}
        </HStack>
      )}

      {question.type === 'ouverte' && (
        <Textarea
          value={answer?.type === 'ouverte' ? answer.value : ''}
          onChange={e => onChange({ type: 'ouverte', value: e.target.value })}
          isReadOnly={isSubmitted}
          placeholder="Écris ta réponse ici..."
          rows={4}
          resize="vertical"
          bg="rgba(255,255,255,0.6)"
          border="2px solid rgba(255,255,255,0.7)"
          borderRadius="12px"
          fontSize="md"
          _focus={{
            borderColor: 'brand.400',
            bg: 'rgba(255,255,255,0.9)',
            boxShadow: '0 0 0 4px rgba(99,102,241,0.15)',
          }}
          _readOnly={{ opacity: 0.8, cursor: 'default' }}
        />
      )}

      {/* Draft answer (ébauche) — shown for all question types, collapsible */}
      {question.draft_answer && (
        <Box mt={5}>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="gray"
            leftIcon={showDraft ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setShowDraft(v => !v)}
            fontSize="sm"
            color="gray.500"
            _hover={{ color: 'brand.600', bg: 'rgba(99,102,241,0.06)' }}
          >
            {showDraft ? 'Masquer l\'ébauche de réponse' : 'Voir l\'ébauche de réponse'}
          </Button>
          <Collapse in={showDraft} animateOpacity>
            <Box
              mt={3}
              p={4}
              bg="rgba(99,102,241,0.07)"
              borderLeft="4px solid"
              borderColor="brand.400"
              borderRadius="0 12px 12px 0"
            >
              <Text fontSize="xs" fontWeight="700" color="brand.500" mb={1} textTransform="uppercase" letterSpacing="0.05em">
                Ébauche de réponse
              </Text>
              <Text fontSize="md" color="gray.700" lineHeight="1.7">
                {question.draft_answer}
              </Text>
            </Box>
          </Collapse>
        </Box>
      )}
    </Box>
  );
};

export default QuestionCard;
