import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, IconButton, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, useDisclosure, Text, Tooltip, Select, VStack, HStack
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';
import { addWordToTheme, updateWord, deleteWord } from '../data/wordListsManager';
import type { SetupContextType } from '../pages/WordGuesserSetup';

export default function ManageWords() {
  const { wordLists, loadLists } = useOutletContext<SetupContextType>();
  const [filterThemeDbId, setFilterThemeDbId] = useState<string>('');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [formThemeDbId, setFormThemeDbId] = useState<string>('');
  const [formWordId, setFormWordId] = useState<string | null>(null);
  const [formWord, setFormWord] = useState('');
  const [formClues, setFormClues] = useState<string[]>(['', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormThemeDbId(filterThemeDbId || '');
    setFormWordId(null);
    setFormWord('');
    setFormClues(['', '', '']);
    onOpen();
  };

  const handleOpenEdit = (wordItem: { id: string, word: string, clues: string[], themeDbId: string }) => {
    setModalMode('edit');
    setFormThemeDbId(wordItem.themeDbId);
    setFormWordId(wordItem.id);
    setFormWord(wordItem.word);
    setFormClues([...wordItem.clues]);
    onOpen();
  };

  const handleSaveWord = async (e: React.FormEvent) => {
    e.preventDefault();
    const validClues = formClues.filter(c => c.trim() !== '');
    if ((modalMode === 'create' && !formThemeDbId) || !formWord || validClues.length === 0) {
      alert("Veuillez sélectionner un thème, remplir le mot et au moins un indice.");
      return;
    }

    setIsLoading(true);
    try {
      if (modalMode === 'create') {
        await addWordToTheme(formThemeDbId, formWord, validClues);
      } else {
        await updateWord(formWordId!, formWord, validClues);
      }
      onClose();
      loadLists();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du mot.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWord = async (wordDbId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce mot ?')) return;
    setIsLoading(true);
    try {
      await deleteWord(wordDbId);
      loadLists();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du mot.");
    } finally {
      setIsLoading(false);
    }
  };

  const allWords = wordLists.flatMap(t =>
    t.words.map(w => ({ ...w, themeDbId: t.db_id, themeTitle: t.title }))
  );

  const displayedWords = filterThemeDbId
    ? allWords.filter(w => w.themeDbId === filterThemeDbId)
    : allWords;

  return (
    <Box layerStyle="glass">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="lg" color="brand.600">Liste des Mots</Heading>
        <IconButton 
          aria-label="Ajouter un mot" 
          icon={<AddIcon />} 
          colorScheme="brand" 
          onClick={handleOpenCreate} 
          borderRadius="12px"
        />
      </Flex>

      <Box mb={6}>
        <Select 
          value={filterThemeDbId} 
          onChange={(e) => setFilterThemeDbId(e.target.value)}
          variant="filled"
          bg="rgba(255, 255, 255, 0.6)"
          _focus={{ bg: "rgba(255, 255, 255, 0.9)", borderColor: "brand.500" }}
          _hover={{ bg: "rgba(255, 255, 255, 0.8)" }}
          size="lg"
          borderRadius="12px"
        >
          <option value="">-- Tous les thèmes --</option>
          {wordLists.map(theme => (
            <option key={theme.db_id} value={theme.db_id}>{theme.title}</option>
          ))}
        </Select>
      </Box>

      {displayedWords.length === 0 ? (
        <Text color="gray.500">Aucun mot trouvé.</Text>
      ) : (
        <TableContainer bg="rgba(255, 255, 255, 0.4)" borderRadius="16px" border="1px solid var(--chakra-colors-whiteAlpha-600)" shadow="sm">
          <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
            <Thead bg="brand.50">
              <Tr>
                <Th>Mot</Th>
                <Th display={{ base: 'none', md: 'table-cell' }}>Thème</Th>
                <Th textAlign="center">Indices</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayedWords.map(w => (
                <Tr key={w.id} _hover={{ bg: 'whiteAlpha.700' }}>
                  <Td fontWeight="bold" color="brand.600" fontSize={{ base: 'md', md: 'lg' }}>{w.word}</Td>
                  <Td display={{ base: 'none', md: 'table-cell' }} color="gray.500">{w.themeTitle}</Td>
                  <Td textAlign="center">
                    <Tooltip 
                      hasArrow 
                      label={
                        <VStack align="start" spacing={1} p={2}>
                          {w.clues.map((c, i) => <Text key={i}>• {c}</Text>)}
                        </VStack>
                      } 
                      bg="gray.800"
                      color="white"
                      borderRadius="8px"
                      placement="top"
                    >
                      <IconButton aria-label="Indices" icon={<InfoIcon />} size="md" variant="ghost" colorScheme="yellow" isRound />
                    </Tooltip>
                  </Td>
                  <Td textAlign="right">
                    <Flex gap={2} justify="flex-end">
                      <IconButton aria-label="Éditer" icon={<EditIcon />} size="sm" variant="ghost" colorScheme="brand" onClick={() => handleOpenEdit(w)} />
                      <IconButton aria-label="Supprimer" icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDeleteWord(w.id)} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
        <ModalContent layerStyle="glass" p={0} m={4}>
          <form onSubmit={handleSaveWord}>
            <ModalHeader color="brand.600">{modalMode === 'create' ? 'Ajouter un mot' : 'Modifier le mot'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired mb={4}>
                <FormLabel>Le mot</FormLabel>
                <Input 
                  placeholder="ex: Football" 
                  value={formWord} 
                  onChange={e => setFormWord(e.target.value)} 
                  variant="glass"
                />
              </FormControl>

              {modalMode === 'create' && (
                <FormControl isRequired mb={4}>
                  <FormLabel>Thème</FormLabel>
                  <Select 
                    value={formThemeDbId} 
                    onChange={e => setFormThemeDbId(e.target.value)}
                    variant="filled"
                    bg="rgba(255, 255, 255, 0.6)"
                    _focus={{ bg: "rgba(255, 255, 255, 0.9)" }}
                  >
                    <option value="">-- Renseigner le thème du mot --</option>
                    {wordLists.map(theme => (
                      <option key={theme.db_id} value={theme.db_id}>{theme.title}</option>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControl isRequired mb={2}>
                <FormLabel>Indices (au moins 1 requis)</FormLabel>
              </FormControl>
              
              <VStack spacing={3} align="stretch" mb={4}>
                {formClues.map((clue, idx) => (
                  <HStack key={idx}>
                    <Input
                      placeholder={`Indice ${idx + 1}`}
                      value={clue}
                      onChange={e => {
                        const next = [...formClues];
                        next[idx] = e.target.value;
                        setFormClues(next);
                      }}
                      required={idx === 0}
                      variant="glass"
                    />
                    {formClues.length > 1 && (
                      <IconButton 
                        aria-label="Supprimer indice" 
                        icon={<CloseIcon />} 
                        size="sm" 
                        colorScheme="red" 
                        variant="ghost" 
                        onClick={() => setFormClues(formClues.filter((_, i) => i !== idx))} 
                      />
                    )}
                  </HStack>
                ))}
              </VStack>
              
              <Button 
                onClick={() => setFormClues([...formClues, ''])} 
                variant="outline" 
                colorScheme="brand" 
                size="sm" 
                w="100%" 
                borderStyle="dashed"
              >
                + Ajouter un indice
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3} variant="ghost">Annuler</Button>
              <Button type="submit" colorScheme="brand" isLoading={isLoading}>
                {modalMode === 'create' ? "Valider l'ajout" : "Sauvegarder"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
