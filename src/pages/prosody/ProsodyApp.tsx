import React from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';

const ProsodyApp: React.FC = () => {
  return (
    <Flex direction="column" align="center" justify="center" w="100%" h="100vh" p={8}>
      <Heading 
        as="h1" 
        fontSize={{ base: '2.5rem', md: '3.5rem' }} 
        mb={8} 
        bgGradient="linear(to-br, #a5b4fc, #818cf8)" 
        bgClip="text" 
        textShadow="0 4px 12px rgba(99, 102, 241, 0.2)"
      >
        Prosodie
      </Heading>
      
      <Text color="gray.600" fontSize="lg" textAlign="center" maxW="600px">
        Bienvenue dans le module de prosodie. Ce module est en cours de développement.
      </Text>
    </Flex>
  );
};

export default ProsodyApp;
