import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, SimpleGrid, Flex, IconButton } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Flex direction="column" align="center" justify="center" w="100%" p={8}>
      <Heading 
        as="h1" 
        fontSize={{ base: '2.5rem', md: '3.5rem' }} 
        mb={8} 
        bgGradient="linear(to-br, #a5b4fc, #818cf8)" 
        bgClip="text" 
        textShadow="0 4px 12px rgba(99, 102, 241, 0.2)"
      >
        Jeux Disponibles
      </Heading>
      
      <Box layerStyle="glass" w="100%" maxW="600px">
        <Heading as="h2" size="md" mb={6} color="gray.500" textAlign="center">
          Choisissez un jeu pour commencer
        </Heading>
        
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
          <Box 
            layerStyle="card"
            onClick={() => navigate('/word-guesser')}
            position="relative"
          >
            <IconButton
              aria-label="Paramètres du jeu"
              icon={<SettingsIcon />}
              position="absolute"
              top={2}
              right={2}
              size="sm"
              variant="ghost"
              colorScheme="brand"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/setup/word-guesser');
              }}
            />
            <Heading as="h3" size="md" mb={2} color="gray.800">
              Devinettes
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Jeu de devinettes de mots avec des indices.
            </Text>
          </Box>
          <Box 
            layerStyle="card"
            onClick={() => navigate('/prosody')}
            position="relative"
          >
            <IconButton
              aria-label="Paramètres de la prosodie"
              icon={<SettingsIcon />}
              position="absolute"
              top={2}
              right={2}
              size="sm"
              variant="ghost"
              colorScheme="brand"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/setup/prosody');
              }}
            />
            <Heading as="h3" size="md" mb={2} color="gray.800">
              Prosodie
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Module d'apprentissage et d'entraînement à la prosodie.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default HomePage;
