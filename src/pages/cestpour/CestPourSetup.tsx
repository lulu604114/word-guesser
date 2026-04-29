import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Box, Button, Flex, Heading, Spinner, Center } from '@chakra-ui/react';
import { useCestPourAdmin } from '../../hooks/useCestPourAdmin';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../contexts/AuthContext';
import type { CestPourItem } from '../../types/cestpour';

export type CestPourSetupContextType = {
  items: CestPourItem[];
  load: () => Promise<void>;
};

const CestPourSetup: React.FC = () => {
  const navigate = useNavigate();
  const { items, isLoading, error, load } = useCestPourAdmin();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Only block on initial load
  if (isLoading && items.length === 0) return (
    <Center h="100vh" flexDir="column" gap={4}>
      <Spinner size="xl" color="brand.500" thickness="4px" />
      <Heading size="md" color="brand.600">Chargement...</Heading>
    </Center>
  );

  if (error) return (
    <Center h="100vh" flexDir="column" gap={4}>
      <Heading size="md" color="red.500">{error}</Heading>
      <Button onClick={load} colorScheme="brand">Réessayer</Button>
    </Center>
  );

  return (
    <Flex direction="column" align="center" w="100%" p={8} maxW="1280px" mx="auto">
      <AppHeader title="Configuration – C'est pour..." />

      <Flex direction={{ base: 'column', md: 'row' }} gap={4} w="100%" maxW="1100px" align="flex-start" justify="flex-end" mb={4}>
        <Button
          variant="outline"
          colorScheme="red"
          onClick={handleSignOut}
          bg="rgba(255,100,100,0.1)"
          borderRadius="12px"
        >
          🚪 Se déconnecter
        </Button>
      </Flex>

      <Box w="100%" maxW="1100px">
        <Outlet context={{ items, load } satisfies CestPourSetupContextType} />
      </Box>
    </Flex>
  );
};

export default CestPourSetup;
