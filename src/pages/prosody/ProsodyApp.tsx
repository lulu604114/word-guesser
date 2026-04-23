import React, { useState, useEffect } from 'react';
import { Flex, Heading, Text, SimpleGrid, Box, Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { prosodyThemes } from '../../data/prosodyThemes';
import { prosodyPhrases } from '../../data/prosodyData';
import AppHeader from '../../components/AppHeader';
import ProsodySession from './ProsodySession';
import type { ProsodyResult } from './ProsodySession';
import ProsodySummary from './ProsodySummary';

const ProsodyApp: React.FC = () => {
  const navigate = useNavigate();
  const { themeId } = useParams<{ themeId: string }>();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionResults, setSessionResults] = useState<ProsodyResult[] | null>(null);

  const selectedTheme = themeId ? prosodyThemes.find(t => t.id === themeId) : null;
  const themePhrases = themeId ? prosodyPhrases[themeId] : null;

  // Reset state when theme changes
  useEffect(() => {
    setIsSessionActive(false);
    setSessionResults(null);
  }, [themeId]);

  if (themeId && !selectedTheme) {
    // If invalid theme, redirect to main prosody page
    navigate('/prosody', { replace: true });
    return null;
  }

  const handleStartSession = () => {
    setIsSessionActive(true);
    setSessionResults(null);
  };

  const handleFinishSession = (results: ProsodyResult[]) => {
    setIsSessionActive(false);
    setSessionResults(results);
  };

  const handleRestart = () => {
    setSessionResults(null);
    setIsSessionActive(true);
  };

  const handleChangeTheme = () => {
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
              {prosodyThemes.map((theme) => {
                const phraseCount = prosodyPhrases[theme.id]?.length || 0;
                return (
                  <Box 
                    key={theme.id} 
                    layerStyle="card"
                    onClick={() => navigate(`/prosody/${theme.id}`)}
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
