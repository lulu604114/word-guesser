import React from 'react';
import {
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Box,
  Center,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';

const CebApp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Flex direction="column" align="center" w="100%" p={{ base: 4, md: 8 }} maxW="1280px" mx="auto">
      <AppHeader title="CEB Interactif" />

      <Box w="100%" maxW="700px" mt={8}>
        <Box layerStyle="glass">
          <Heading as="h2" size="md" mb={2} color="gray.500" textAlign="center">
            Choisissez un mode
          </Heading>
          <Text fontSize="sm" color="gray.400" textAlign="center" mb={8}>
            Entraîne-toi à la lecture et à la compréhension en mode écrit ou oral.
          </Text>

          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
            {/* CEB Écrit */}
            <Box
              layerStyle="card"
              onClick={() => navigate('/ceb/ecrit')}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(99,102,241,0.18)' }}
              transition="all 0.25s"
            >
              <Center flexDir="column" gap={3} py={4}>
                <Text fontSize="4xl">🖊️</Text>
                <Heading as="h3" size="md" color="gray.800" textAlign="center">
                  CEB Écrit
                </Heading>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Lis le texte toi-même, surligne les mots importants, puis réponds aux questions.
                </Text>
                <Badge colorScheme="blue" borderRadius="8px" px={3} py={1} mt={1}>
                  Texte visible
                </Badge>
              </Center>
            </Box>

            {/* CEB Oral */}
            <Box
              layerStyle="card"
              onClick={() => navigate('/ceb/oral')}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(251,146,60,0.18)' }}
              transition="all 0.25s"
            >
              <Center flexDir="column" gap={3} py={4}>
                <Text fontSize="4xl">🎧</Text>
                <Heading as="h3" size="md" color="gray.800" textAlign="center">
                  CEB Oral
                </Heading>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Écoute le texte lu par l'ordinateur, puis réponds aux questions de mémoire.
                </Text>
                <Badge colorScheme="orange" borderRadius="8px" px={3} py={1} mt={1}>
                  Texte lu à voix haute
                </Badge>
              </Center>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </Flex>
  );
};

export default CebApp;
