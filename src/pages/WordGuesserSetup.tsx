import React from 'react';
import { useNavigate, Outlet, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Box, Button, Flex, Heading, VStack, Spinner, Center } from '@chakra-ui/react';
import { useWordLists } from '../hooks/useWordLists';
import AppHeader from '../components/AppHeader';
import type { DbWordList } from '../data/wordListsManager';
import { useAuth } from '../contexts/AuthContext';
// import '../components/ManageWords.css'; // Removed CSS import

export type SetupContextType = {
  wordLists: DbWordList[];
  loadLists: () => Promise<void>;
};

const WordGuesserSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wordLists, isLoading, error, loadLists } = useWordLists();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (isLoading) return (
    <Center h="100vh" flexDir="column" gap={4}>
      <Spinner size="xl" color="brand.500" thickness="4px" />
      <Heading size="md" color="brand.600">Chargement des données...</Heading>
    </Center>
  );

  if (error) return (
    <Center h="100vh" flexDir="column" gap={4}>
      <Heading size="md" color="error.500">{error}</Heading>
      <Button onClick={loadLists} colorScheme="brand">Réessayer</Button>
    </Center>
  );

  return (
    <Flex direction="column" align="center" w="100%" p={8} maxW="1280px" mx="auto">
      <AppHeader title="Configuration Devinettes" />
      
      <Flex direction={{ base: 'column', md: 'row' }} gap={8} w="100%" maxW="1100px" align="flex-start">
        <Box as="aside" flex="0 0 250px" w={{ base: '100%', md: '250px' }}>
          <VStack 
            as="nav" 
            spacing={3} 
            align="stretch" 
            bg="rgba(255, 255, 255, 0.4)" 
            border="1px solid rgba(255, 255, 255, 0.6)" 
            backdropFilter="blur(10px)" 
            p={4} 
            borderRadius="16px" 
            boxShadow="0 8px 32px rgba(31, 38, 135, 0.08)"
          >
            <Button
              as={RouterNavLink}
              to="themes"
              variant={location.pathname.includes('themes') ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              size="lg"
              colorScheme="brand"
              color={location.pathname.includes('themes') ? 'white' : 'gray.600'}
            >
              📂 Gérer les Thèmes
            </Button>
            <Button
              as={RouterNavLink}
              to="words"
              variant={location.pathname.includes('words') ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              size="lg"
              colorScheme="brand"
              color={location.pathname.includes('words') ? 'white' : 'gray.600'}
            >
              📝 Gérer les Mots
            </Button>
            <Button 
              onClick={handleSignOut} 
              variant="outline"
              colorScheme="red"
              justifyContent="flex-start"
              size="lg"
              mt={4}
              bg="rgba(255, 100, 100, 0.1)"
            >
              🚪 Se déconnecter
            </Button>
          </VStack>
        </Box>

        <Box as="main" flex="1" w="100%">
          <Outlet context={{ wordLists, loadLists } satisfies SetupContextType} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default WordGuesserSetup;
