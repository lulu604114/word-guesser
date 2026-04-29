import React, { useState } from 'react';
import {
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Box,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react';
import AppHeader from '../../components/AppHeader';
import { useCebAdmin } from '../../hooks/useCebAdmin';
import CebSession from './CebSession';
import type { CebText } from '../../types/ceb';

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

const LEVEL_ICONS: Record<string, string> = {
  court: '📄',
  moyen: '📃',
  long: '📜',
};

const CebApp: React.FC = () => {
  const { enrichedTexts, isLoading, error } = useCebAdmin();
  const [selectedText, setSelectedText] = useState<CebText | null>(null);

  if (isLoading) {
    return (
      <Center h="60vh" flexDir="column" gap={4}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Heading size="md" color="brand.600">Chargement des textes...</Heading>
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="60vh" flexDir="column" gap={4}>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  if (selectedText) {
    return (
      <Flex direction="column" align="center" w="100%" p={{ base: 4, md: 8 }} maxW="900px" mx="auto">
        <CebSession text={selectedText} onExit={() => setSelectedText(null)} />
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" w="100%" p={{ base: 4, md: 8 }} maxW="1280px" mx="auto">
      <AppHeader title="CEB Interactif" />

      <Box w="100%" maxW="800px" mt={8}>
        <Box layerStyle="glass">
          <Heading as="h2" size="md" mb={2} color="gray.500" textAlign="center">
            Choisissez un texte pour commencer
          </Heading>
          <Text fontSize="sm" color="gray.400" textAlign="center" mb={8}>
            Lis le texte, surligne les mots importants, puis réponds aux questions.
          </Text>

          {enrichedTexts.length === 0 ? (
            <Center py={12} flexDir="column" gap={3}>
              <Text fontSize="4xl">📚</Text>
              <Text color="gray.400" fontStyle="italic" textAlign="center">
                Aucun texte disponible pour le moment.
              </Text>
              <Text fontSize="sm" color="gray.300" textAlign="center">
                Un enseignant peut en ajouter via le panneau d'administration.
              </Text>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {enrichedTexts.map(text => {
                const qCount = text.questions?.length ?? 0;
                return (
                  <Box
                    key={text.id}
                    layerStyle="card"
                    onClick={() => setSelectedText(text)}
                    position="relative"
                  >
                    <Flex justify="space-between" align="flex-start" mb={3}>
                      <Text fontSize="2xl">{LEVEL_ICONS[text.level]}</Text>
                      <Badge
                        colorScheme={LEVEL_COLORS[text.level]}
                        borderRadius="8px"
                        px={2}
                        py={1}
                        fontSize="xs"
                      >
                        {LEVEL_LABELS[text.level]}
                      </Badge>
                    </Flex>
                    <Heading as="h3" size="md" mb={2} color="gray.800">
                      {text.title}
                    </Heading>
                    <Text color="gray.500" fontSize="sm" mb={3} noOfLines={3}>
                      {text.content}
                    </Text>
                    {qCount > 0 ? (
                      <Text fontSize="xs" fontWeight="bold" color="brand.500">
                        {qCount} question{qCount > 1 ? 's' : ''}
                      </Text>
                    ) : (
                      <Text fontSize="xs" fontStyle="italic" color="gray.300">
                        Aucune question
                      </Text>
                    )}
                  </Box>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default CebApp;
