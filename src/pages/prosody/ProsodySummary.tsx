import React from 'react';
import { Box, Flex, Heading, Text, Button, VStack, Divider } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import type { ProsodyResult } from './ProsodySession';

interface ProsodySummaryProps {
  results: ProsodyResult[];
  onRestart: () => void;
  onChangeTheme: () => void;
}

const ProsodySummary: React.FC<ProsodySummaryProps> = ({ results, onRestart, onChangeTheme }) => {
  const validatedPhrases = results.filter(r => r.isValidated);
  const invalidPhrases = results.filter(r => !r.isValidated);

  const score = validatedPhrases.length;
  const total = results.length;

  return (
    <Box layerStyle="glass" w="100%" maxW="800px" mx="auto" p={8}>
      <Flex direction="column" align="center" mb={8}>
        <Heading as="h2" size="xl" mb={2} color="brand.600">
          Résumé de l'exercice
        </Heading>
        <Text fontSize="2xl" fontWeight="bold" color={score === total ? 'green.500' : 'brand.500'}>
          {score} / {total} phrases validées
        </Text>
      </Flex>

      <Flex direction={{ base: 'column', md: 'row' }} gap={8} mb={10}>
        {/* Validated List */}
        <Box flex="1">
          <Flex align="center" mb={4} gap={2}>
            <CheckCircleIcon color="green.500" boxSize={5} />
            <Heading as="h3" size="md" color="green.600">
              Bien prononcé ({validatedPhrases.length})
            </Heading>
          </Flex>
          <VStack align="start" spacing={3} bg="green.50" p={4} borderRadius="xl" minH="150px">
            {validatedPhrases.length === 0 ? (
              <Text color="gray.500" fontStyle="italic">Aucune phrase validée.</Text>
            ) : (
              validatedPhrases.map((r, i) => (
                <Text key={i} color="gray.700">• {r.phrase}</Text>
              ))
            )}
          </VStack>
        </Box>

        {/* Invalid List */}
        <Box flex="1">
          <Flex align="center" mb={4} gap={2}>
            <WarningIcon color="red.500" boxSize={5} />
            <Heading as="h3" size="md" color="red.600">
              À revoir ({invalidPhrases.length})
            </Heading>
          </Flex>
          <VStack align="start" spacing={3} bg="red.50" p={4} borderRadius="xl" minH="150px">
            {invalidPhrases.length === 0 ? (
              <Text color="gray.500" fontStyle="italic">Aucune phrase à revoir, parfait !</Text>
            ) : (
              invalidPhrases.map((r, i) => (
                <Text key={i} color="gray.700">• {r.phrase}</Text>
              ))
            )}
          </VStack>
        </Box>
      </Flex>

      <Divider mb={8} borderColor="gray.200" />

      <Flex justify="center" gap={4}>
        <Button onClick={onChangeTheme} variant="outline" colorScheme="brand" size="lg">
          Changer de thème
        </Button>
        <Button onClick={onRestart} colorScheme="brand" size="lg">
          Recommencer
        </Button>
      </Flex>
    </Box>
  );
};

export default ProsodySummary;
