import React, { useMemo, useState } from 'react';
import {
  Box, Flex, Heading, Text, Image, VStack,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import type { CestPourItem } from '../../types/cestpour';

interface CestPourCardProps {
  item: CestPourItem;
  existingAnswer?: string;
  onAnswer: (itemId: string, selectedWord: string) => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const CestPourCard: React.FC<CestPourCardProps> = ({ item, existingAnswer, onAnswer }) => {
  const [imgError, setImgError] = useState(false);

  // Randomize left/right placement consistently per item (same item = same layout)
  const isCorrectOnLeft = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < item.id.length; i++) hash += item.id.charCodeAt(i);
    return hash % 2 === 0;
  }, [item.id]);

  const leftWord  = isCorrectOnLeft ? item.correct_answer : item.wrong_answer;
  const rightWord = isCorrectOnLeft ? item.wrong_answer   : item.correct_answer;

  const selected = existingAnswer ?? null;
  const isAnswered = selected !== null;
  const isCorrect = selected === item.correct_answer;

  const wordButtonStyle = (word: string) => {
    const isSelected = selected === word;
    const isThisCorrect = word === item.correct_answer;

    if (!isAnswered) {
      return {
        bg: 'rgba(255,255,255,0.6)',
        border: '2.5px solid rgba(255,255,255,0.8)',
        color: 'gray.800',
        boxShadow: '0 4px 16px rgba(31,38,135,0.08)',
        _hover: {
          bg: 'rgba(255,255,255,0.9)',
          borderColor: 'brand.400',
          transform: 'scale(1.04)',
          boxShadow: '0 6px 20px rgba(99,102,241,0.18)',
        },
      };
    }
    if (isSelected && isThisCorrect) {
      return { bg: 'rgba(22,163,74,0.12)', border: '2.5px solid', borderColor: 'green.400', color: 'green.700', boxShadow: '0 4px 16px rgba(22,163,74,0.2)' };
    }
    if (isSelected && !isThisCorrect) {
      return { bg: 'rgba(239,68,68,0.08)', border: '2.5px solid', borderColor: 'red.300', color: 'red.600' };
    }
    if (!isSelected && isThisCorrect && isAnswered) {
      // Show the correct answer highlighted even if not selected
      return { bg: 'rgba(22,163,74,0.06)', border: '2.5px dashed', borderColor: 'green.300', color: 'green.600', opacity: 0.85 };
    }
    return { bg: 'rgba(255,255,255,0.3)', border: '2.5px solid', borderColor: 'gray.200', color: 'gray.400' };
  };

  const sentenceColor = !isAnswered ? 'gray.400' : isCorrect ? 'green.600' : 'orange.500';
  const sentenceWord  = selected ?? '_____________';

  return (
    <Box
      layerStyle="glass"
      maxW="560px"
      w="100%"
      mx="auto"
      p={{ base: 6, md: 10 }}
      animation={`${fadeIn} 0.35s ease`}
    >
      <VStack spacing={7} align="center">

        {/* Object name */}
        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="800"
          bgGradient="linear(to-br, #6366f1, #818cf8)"
          bgClip="text"
          textAlign="center"
          letterSpacing="-0.02em"
        >
          {item.object_name}
        </Heading>

        {/* Image */}
        <Box
          w={{ base: '180px', md: '220px' }}
          h={{ base: '180px', md: '220px' }}
          borderRadius="20px"
          overflow="hidden"
          border="3px solid rgba(255,255,255,0.8)"
          boxShadow="0 8px 32px rgba(99,102,241,0.12)"
          bg="rgba(255,255,255,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {item.image_url && !imgError ? (
            <Image
              src={item.image_url}
              alt={item.object_name}
              w="100%"
              h="100%"
              objectFit="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <VStack spacing={2} color="gray.300">
              <Text fontSize="4xl">🖼️</Text>
              <Text fontSize="xs" color="gray.400" textAlign="center" px={2}>
                {item.object_name}
              </Text>
            </VStack>
          )}
        </Box>

        {/* Arrow choice area */}
        <Box w="100%" position="relative" px={2}>
          <Flex align="center" gap={0} w="100%">

            {/* ── Left word button ── */}
            <Box
              as="button"
              onClick={() => !isAnswered && onAnswer(item.id, leftWord)}
              cursor={isAnswered ? 'default' : 'pointer'}
              px={4}
              py={3}
              borderRadius="14px"
              fontWeight="700"
              fontSize={{ base: 'md', md: 'lg' }}
              transition="all 0.22s cubic-bezier(0.4,0,0.2,1)"
              minW="100px"
              textAlign="center"
              flexShrink={0}
              {...wordButtonStyle(leftWord)}
            >
              {leftWord}
            </Box>

            {/* Left arrow: ←── */}
            <Flex flex="1" align="center" position="relative" h="24px" mx={1}>
              <Box flex="1" h="2px" bg="linear-gradient(to left, rgba(99,102,241,0.5), rgba(99,102,241,0.1))" />
              <Box
                w="0"
                h="0"
                borderTop="7px solid transparent"
                borderBottom="7px solid transparent"
                borderRight="10px solid rgba(99,102,241,0.5)"
                flexShrink={0}
              />
            </Flex>

            {/* Center: question mark bubble */}
            <Box
              w="42px"
              h="42px"
              borderRadius="50%"
              bg="linear-gradient(135deg, #818cf8, #6366f1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 14px rgba(99,102,241,0.4)"
              flexShrink={0}
              zIndex={1}
            >
              <Text color="white" fontWeight="800" fontSize="lg" lineHeight="1">?</Text>
            </Box>

            {/* Right arrow: ──→ */}
            <Flex flex="1" align="center" position="relative" h="24px" mx={1}>
              <Box
                w="0"
                h="0"
                borderTop="7px solid transparent"
                borderBottom="7px solid transparent"
                borderLeft="10px solid rgba(99,102,241,0.5)"
                flexShrink={0}
              />
              <Box flex="1" h="2px" bg="linear-gradient(to right, rgba(99,102,241,0.5), rgba(99,102,241,0.1))" />
            </Flex>

            {/* ── Right word button ── */}
            <Box
              as="button"
              onClick={() => !isAnswered && onAnswer(item.id, rightWord)}
              cursor={isAnswered ? 'default' : 'pointer'}
              px={4}
              py={3}
              borderRadius="14px"
              fontWeight="700"
              fontSize={{ base: 'md', md: 'lg' }}
              transition="all 0.22s cubic-bezier(0.4,0,0.2,1)"
              minW="100px"
              textAlign="center"
              flexShrink={0}
              {...wordButtonStyle(rightWord)}
            >
              {rightWord}
            </Box>

          </Flex>
        </Box>

        {/* Complete sentence */}
        <Box
          w="100%"
          p={5}
          borderRadius="16px"
          bg={
            !isAnswered
              ? 'rgba(255,255,255,0.3)'
              : isCorrect
              ? 'rgba(22,163,74,0.08)'
              : 'rgba(251,146,60,0.08)'
          }
          border="2px solid"
          borderColor={
            !isAnswered
              ? 'rgba(255,255,255,0.5)'
              : isCorrect
              ? 'rgba(22,163,74,0.3)'
              : 'rgba(251,146,60,0.3)'
          }
          transition="all 0.3s"
          textAlign="center"
          minH="68px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize={{ base: 'lg', md: 'xl' }}
            fontWeight="600"
            color={sentenceColor}
            transition="color 0.3s"
          >
            {isAnswered && (isCorrect ? '✓ ' : '✗ ')}
            <Text as="span" fontStyle="italic" color="gray.500" fontWeight="400">
              {item.object_name},{' '}
            </Text>
            c'est pour{' '}
            <Text
              as="span"
              fontWeight="800"
              color={sentenceColor}
              borderBottom={!isAnswered ? '2px dashed' : 'none'}
              borderColor="gray.300"
              pb={!isAnswered ? '1px' : '0'}
            >
              {sentenceWord}
            </Text>
            .
          </Text>
        </Box>

        {/* Hint if wrong */}
        {isAnswered && !isCorrect && (
          <Text
            fontSize="sm"
            color="green.600"
            fontWeight="500"
            animation={`${fadeIn} 0.3s ease`}
          >
            La bonne réponse est : <strong>{item.correct_answer}</strong>
          </Text>
        )}

      </VStack>
    </Box>
  );
};

export default CestPourCard;
