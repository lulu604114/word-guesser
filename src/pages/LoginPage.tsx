import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, VStack } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import AppHeader from '../components/AppHeader';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      navigate('/setup/word-guesser');
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" w="100%" p={8} maxW="1280px" mx="auto">
      <AppHeader title="Connexion Administrateur" />
      <Box layerStyle="glass" w="100%" maxW="400px" mt={8}>
        <Heading as="h2" size="lg" mb={6} color="brand.600">Accès restreint</Heading>
        
        {error && (
          <Box 
            color="error.500" 
            bg="rgba(239, 68, 68, 0.1)" 
            p={4} 
            borderRadius="12px"
            mb={6}
            border="1px solid rgba(239, 68, 68, 0.3)"
          >
            {error}
          </Box>
        )}
        
        <form onSubmit={handleLogin}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel color="gray.600" fontWeight="600">Adresse email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="glass"
                placeholder="admin@example.com"
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel color="gray.600" fontWeight="600">Mot de passe</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="glass"
                placeholder="••••••••"
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="brand" 
              isLoading={isLoading}
              loadingText="Connexion..."
              mt={4} 
              size="lg"
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              Se connecter
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
