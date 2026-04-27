import React, { useState, useEffect } from 'react';
import { Flex, Heading, Text, SimpleGrid, Box, Button, Spinner, Center } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import ProsodySession from './ProsodySession';
import type { ProsodyResult } from './ProsodySession';
import ProsodySummary from './ProsodySummary';
import { useProsodyAdmin } from '../../hooks/useProsodyAdmin';

const ProsodyApp: React.FC = () => {
  const navigate = useNavigate();
  const { themeId } = useParams<{ themeId: string }>();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionResults, setSessionResults] = useState<ProsodyResult[] | null>(null);

  const { themes, phrases, isLoading } = useProsodyAdmin();

  // Build a phrases map keyed by theme short_id for O(1) lookup
  const phrasesMap = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const theme of themes) {
      map[theme.short_id] = phrases
        .filter(p => p.theme_id === theme.id)
        .map(p => p.phrase);
    }
    return map;
  }, [themes, phrases]);

  const selectedTheme = themeId ? themes.find(t => t.short_id === themeId) : null;
  const themePhrases = themeId ? (phrasesMap[themeId] ?? null) : null;

  // Cleanup object URLs to avoid memory leaks
  const cleanupAudio = (results: ProsodyResult[] | null) => {
    if (results) {
      results.forEach(r => {
        if (r.audioUrl) URL.revokeObjectURL(r.audioUrl);
      });
    }
  };

  // Reset state when theme changes
  useEffect(() => {
    if (sessionResults) cleanupAudio(sessionResults);
    setIsSessionActive(false);
    setSessionResults(null);
  }, [themeId]);

  if (isLoading) {
    return (
      <Center h="60vh" flexDir="column" gap={4}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Heading size="md" color="brand.600">Chargement des thèmes...</Heading>
      </Center>
    );
  }

  if (themeId && !selectedTheme) {
    navigate('/prosody', { replace: true });
    return null;
  }

  const handleStartSession = () => {
    if (sessionResults) cleanupAudio(sessionResults);
    setIsSessionActive(true);
    setSessionResults(null);
  };

  const handleFinishSession = (results: ProsodyResult[]) => {
    setIsSessionActive(false);
    setSessionResults(results);
  };

  const handleRestart = () => {
    if (sessionResults) cleanupAudio(sessionResults);
    setSessionResults(null);
    setIsSessionActive(true);
  };

  const handleChangeTheme = () => {
    if (sessionResults) cleanupAudio(sessionResults);
    navigate('/prosody');
  };

  return (
    <Flex direction="column" align="center" w="100%" p={8} maxW="1280px" mx="auto">
      <AppHeader title="Prosodie" />

      <Box w="100%" maxW="800px" mt={8}>
        {!themeId ? (
          <Box layerStyle="glass">
            <Heading as="h2" size="md" mb={6} color="gray.500" textAlign="center">
              Choisissez un thème pour commencer
            </Heading>

            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
              {themes.map(theme => {
                const phraseCount = phrasesMap[theme.short_id]?.length ?? 0;
                return (
                  <Box
                    key={theme.id}
                    layerStyle="card"
                    onClick={() => navigate(`/prosody/${theme.short_id}`)}
                    position="relative"
                  >
                    <Heading as="h3" size="md" mb={2} color="brand.600">
                      {theme.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={2}>
                      {theme.description}
                    </Text>
                    {phraseCount > 0 ? (
                      <Text fontSize="xs" fontWeight="bold" color="green.500">
                        {phraseCount} phrases disponibles
                      </Text>
                    ) : (
                      <Text fontSize="xs" fontStyle="italic" color="gray.400">
                        En construction
                      </Text>
                    )}
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        ) : isSessionActive && themePhrases ? (
          <ProsodySession phrases={themePhrases} onFinish={handleFinishSession} />
        ) : sessionResults ? (
          <ProsodySummary
            results={sessionResults}
            onRestart={handleRestart}
            onChangeTheme={handleChangeTheme}
          />
        ) : (
          <Box layerStyle="glass" textAlign="center" p={10}>
            <Heading as="h2" size="xl" mb={4} color="brand.600">
              {selectedTheme?.title}
            </Heading>

            {themePhrases && themePhrases.length > 0 ? (
              <>
                <Text color="gray.600" fontSize="lg" mb={8}>
                  Prêt à commencer ? Lisez les phrases à voix haute en vous concentrant sur l'intonation appropriée.
                </Text>
                <Flex justify="center" gap={4}>
                  <Button variant="outline" colorScheme="gray" onClick={handleChangeTheme}>
                    Retour
                  </Button>
                  <Button colorScheme="brand" size="lg" onClick={handleStartSession}>
                    Commencer l'exercice
                  </Button>
                </Flex>
              </>
            ) : (
              <>
                <Text color="gray.600" fontSize="lg" mb={8}>
                  Ce module est en cours de développement. Les phrases pour ce thème ne sont pas encore disponibles.
                </Text>
                <Button colorScheme="brand" onClick={handleChangeTheme}>
                  Retour aux thèmes
                </Button>
              </>
            )}
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default ProsodyApp;
