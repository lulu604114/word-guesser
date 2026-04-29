import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface TextReaderProps {
  content: string;
  highlightedWords: Set<number>;
  onToggleHighlight: (index: number) => void;
}

const TextReader: React.FC<TextReaderProps> = ({
  content,
  highlightedWords,
  onToggleHighlight,
}) => {
  // Split text into paragraphs, then into words
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

  let globalIndex = 0;

  return (
    <Box>
      {paragraphs.map((paragraph, pIdx) => {
        const words = paragraph.split(/(\s+)/);
        const elements: React.ReactNode[] = [];

        for (const token of words) {
          if (/^\s+$/.test(token)) {
            // It's whitespace — just render a space
            elements.push(' ');
          } else {
            // It's a word — make it clickable/highlightable
            const wordIdx = globalIndex;
            const isHighlighted = highlightedWords.has(wordIdx);
            elements.push(
              <Text
                key={`${pIdx}-${wordIdx}`}
                as="span"
                display="inline"
                cursor="pointer"
                px="1px"
                borderRadius="4px"
                bg={isHighlighted ? 'rgba(250, 204, 21, 0.55)' : 'transparent'}
                boxShadow={isHighlighted ? '0 0 0 2px rgba(250, 204, 21, 0.8)' : 'none'}
                transition="background 0.15s, box-shadow 0.15s"
                _hover={{
                  bg: isHighlighted
                    ? 'rgba(250, 204, 21, 0.75)'
                    : 'rgba(250, 204, 21, 0.2)',
                }}
                onClick={() => onToggleHighlight(wordIdx)}
                title={isHighlighted ? 'Cliquer pour enlever le surlignage' : 'Cliquer pour surligner'}
              >
                {token}
              </Text>
            );
            globalIndex++;
          }
        }

        return (
          <Box
            key={pIdx}
            mb={4}
            fontSize={{ base: 'md', md: 'lg' }}
            lineHeight="1.9"
            color="gray.800"
          >
            {elements}
          </Box>
        );
      })}

      {highlightedWords.size > 0 && (
        <Box
          mt={4}
          p={3}
          bg="rgba(250, 204, 21, 0.1)"
          borderRadius="12px"
          border="1px dashed rgba(250, 204, 21, 0.6)"
        >
          <Text fontSize="xs" color="gray.500" fontStyle="italic">
            💡 {highlightedWords.size} mot{highlightedWords.size > 1 ? 's' : ''} surligné{highlightedWords.size > 1 ? 's' : ''} — cliquez à nouveau pour enlever le surlignage
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default TextReader;
