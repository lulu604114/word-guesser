import React from 'react';
import { Flex, Heading, Text, SimpleGrid, Box, Button } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { prosodyThemes } from '../../data/prosodyThemes';
import AppHeader from '../../components/AppHeader';

const ProsodyApp: React.FC = () => {
  const navigate = useNavigate();
  const { themeId } = useParams<{ themeId: string }>();

  const selectedTheme = themeId ? prosodyThemes.find(t => t.id === themeId) : null;

  if (themeId && !selectedTheme) {
    // If invalid theme, redirect to main prosody page
    navigate('/prosody', { replace: true });
    return null;
  }

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
              {prosodyThemes.map((theme) => (
                <Box 
                  key={theme.id} 
                  layerStyle="card"
                  onClick={() => navigate(`/prosody/${theme.id}`)}
                >
                  <Heading as="h3" size="md" mb={2} color="brand.600">
                    {theme.title}
                  </Heading>
                  <Text color="gray.600" fontSize="sm">
                    {theme.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          <Box layerStyle="glass" textAlign="center" p={10}>
            <Heading as="h2" size="xl" mb={4} color="brand.600">
              {selectedTheme?.title}
            </Heading>
            <Text color="gray.600" fontSize="lg" mb={8}>
              Ce module est en cours de développement.
            </Text>
            <Button colorScheme="brand" onClick={() => navigate('/prosody')}>
              Retour aux thèmes
            </Button>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default ProsodyApp;
