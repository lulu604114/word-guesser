import React, { useState } from 'react';
import {
  Flex, Heading, Text, Box, Spinner, Center, VStack, HStack,
  Button, Badge, IconButton, Progress, CircularProgress, CircularProgressLabel,
} from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import AppHeader from '../../components/AppHeader';
import { useCestPourAdmin } from '../../hooks/useCestPourAdmin';
import CestPourCard from '../../components/cestpour/CestPourCard';
import type { CestPourAnswersMap } from '../../types/cestpour';

const CestPourApp: React.FC = () => {
  const { items, isLoading, error } = useCestPourAdmin();
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [answers, setAnswers]         = useState<CestPourAnswersMap>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (itemId: string, word: string) => {
    setAnswers(prev => ({ ...prev, [itemId]: word }));
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIdx(0);
    setShowResults(false);
  };

  if (isLoading) return (
    <Center h="60vh" flexDir="column" gap={4}>
      <Spinner size="xl" color="brand.500" thickness="4px" />
      <Heading size="md" color="brand.600">Chargement...</Heading>
    </Center>
  );

  if (error) return (
    <Center h="60vh"><Text color="red.500">{error}</Text></Center>
  );

  if (items.length === 0) return (
    <Flex direction="column" align="center" w="100%" p={8} maxW="700px" mx="auto">
      <AppHeader title="C'est pour..." />
      <Box layerStyle="glass" mt={8} textAlign="center" p={12}>
        <Text fontSize="4xl" mb={3}>🧩</Text>
        <Text color="gray.400" fontStyle="italic">
          Aucun item disponible. Un enseignant peut en ajouter via le panneau d'administration.
        </Text>
      </Box>
    </Flex>
  );

  const currentItem = items[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const correctCount  = items.filter(it => answers[it.id] === it.correct_answer).length;

  // ── Results screen ──
  if (showResults) {
    const pct = Math.round((correctCount / items.length) * 100);
    const progressColor = pct === 100 ? 'green.400' : pct >= 60 ? 'orange.400' : 'red.400';
    const msg = pct === 100 ? '🎉 Parfait !' : pct >= 60 ? '😊 Bien !' : '💪 Continue !';

    return (
      <Flex direction="column" align="center" w="100%" p={{ base: 4, md: 8 }} maxW="700px" mx="auto">
        <AppHeader title="C'est pour..." />
        <Box layerStyle="glass" mt={8} w="100%">
          <VStack spacing={6} align="center">
            <CircularProgress value={pct} size="120px" thickness="8px" color={progressColor} trackColor="gray.100">
              <CircularProgressLabel>
                <Text fontSize="xl" fontWeight="800" color="gray.800">{correctCount}/{items.length}</Text>
              </CircularProgressLabel>
            </CircularProgress>
            <Heading size="lg" color="gray.800">{msg}</Heading>
            <Text color="gray.500">{pct}% de bonnes réponses</Text>

            <VStack align="stretch" w="100%" spacing={2} pt={2}>
              {items.map((it, i) => {
                const ans = answers[it.id];
                const ok  = ans === it.correct_answer;
                return (
                  <Box
                    key={it.id}
                    p={3}
                    borderRadius="12px"
                    bg={ok ? 'rgba(22,163,74,0.07)' : 'rgba(239,68,68,0.07)'}
                    border="1px solid"
                    borderColor={ok ? 'green.200' : 'red.200'}
                  >
                    <HStack justify="space-between">
                      <Text fontSize="sm" fontWeight="600" color="gray.700">
                        {i + 1}. {it.object_name} — c'est pour{' '}
                        <Text as="span" fontWeight="800" color={ok ? 'green.600' : 'red.500'}>
                          {ans ?? '(sans réponse)'}
                        </Text>
                      </Text>
                      <Badge colorScheme={ok ? 'green' : 'red'} borderRadius="8px">
                        {ok ? '✓' : '✗'}
                      </Badge>
                    </HStack>
                    {!ok && (
                      <Text fontSize="xs" color="green.600" mt={1}>
                        Bonne réponse : {it.correct_answer}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </VStack>

            <Button colorScheme="brand" size="lg" onClick={handleRestart} borderRadius="14px">
              Recommencer
            </Button>
          </VStack>
        </Box>
      </Flex>
    );
  }

  // ── Game screen ──
  return (
    <Flex direction="column" align="center" w="100%" p={{ base: 4, md: 8 }} maxW="700px" mx="auto">
      <AppHeader title="C'est pour..." />

      <Box w="100%" mt={6}>
        {/* Progress */}
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="sm" fontWeight="600" color="gray.500">
            {currentIdx + 1} / {items.length}
          </Text>
          <Text fontSize="sm" color="brand.500" fontWeight="600">
            {answeredCount} répondu{answeredCount > 1 ? 's' : ''}
          </Text>
        </Flex>
        <Progress
          value={((currentIdx + 1) / items.length) * 100}
          colorScheme="brand"
          borderRadius="full"
          size="sm"
          mb={6}
          bg="rgba(99,102,241,0.1)"
        />

        {/* Card */}
        <CestPourCard
          key={currentItem.id}
          item={currentItem}
          existingAnswer={answers[currentItem.id]}
          onAnswer={handleAnswer}
        />

        {/* Navigation */}
        <Flex justify="space-between" align="center" mt={6}>
          <IconButton
            aria-label="Précédent"
            icon={<ArrowBackIcon />}
            isDisabled={currentIdx === 0}
            onClick={() => setCurrentIdx(i => i - 1)}
            variant="outline"
            colorScheme="gray"
            borderRadius="12px"
            size="lg"
          />

          {/* Dot navigation */}
          <HStack spacing={2}>
            {items.map((it, i) => (
              <Box
                key={it.id}
                w="10px"
                h="10px"
                borderRadius="50%"
                cursor="pointer"
                bg={
                  i === currentIdx
                    ? 'brand.500'
                    : answers[it.id] !== undefined
                    ? 'brand.200'
                    : 'gray.200'
                }
                border={i === currentIdx ? '2px solid' : '1px solid transparent'}
                borderColor={i === currentIdx ? 'brand.600' : 'transparent'}
                transition="all 0.2s"
                onClick={() => setCurrentIdx(i)}
                _hover={{ transform: 'scale(1.4)' }}
                title={`Item ${i + 1}`}
              />
            ))}
          </HStack>

          {currentIdx < items.length - 1 ? (
            <IconButton
              aria-label="Suivant"
              icon={<ArrowForwardIcon />}
              onClick={() => setCurrentIdx(i => i + 1)}
              colorScheme="brand"
              borderRadius="12px"
              size="lg"
            />
          ) : (
            <Button
              colorScheme="green"
              borderRadius="12px"
              size="lg"
              onClick={() => setShowResults(true)}
              px={6}
            >
              Terminer
            </Button>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default CestPourApp;
