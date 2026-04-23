import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

type AppHeaderProps = {
  title: string;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Flex align="center" justify="center" position="relative" w="100%" maxW="600px" mb="2rem" mx="auto">
      <IconButton
        position="absolute"
        left="0"
        aria-label="Retour à la page précédente"
        icon={<ArrowBackIcon boxSize={6} />}
        onClick={() => navigate(-1)}
        variant="outline"
        colorScheme="brand"
        borderRadius="full"
        size="lg"
        bg="rgba(255, 255, 255, 0.4)"
        _hover={{ bg: 'rgba(255, 255, 255, 0.8)', transform: 'translateX(-4px)' }}
        boxShadow="0 4px 12px rgba(31, 38, 135, 0.05)"
      />
      <Heading 
        as="h1" 
        size={{ base: 'xl', md: '2xl' }}
        bgGradient="linear(to-br, #a5b4fc, #818cf8)" 
        bgClip="text" 
        textShadow="0 4px 12px rgba(99, 102, 241, 0.2)"
        my={0}
      >
        {title}
      </Heading>
    </Flex>
  );
};

export default AppHeader;
