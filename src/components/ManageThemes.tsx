import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, IconButton, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, useDisclosure, Text, Badge
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { addTheme, updateTheme, deleteTheme, type DbWordList } from '../data/wordListsManager';
import type { SetupContextType } from '../pages/WordGuesserSetup';

export default function ManageThemes() {
  const { wordLists, loadLists } = useOutletContext<SetupContextType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const [formThemeDbId, setFormThemeDbId] = useState<string | null>(null);
  const [formShortId, setFormShortId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormThemeDbId(null);
    setFormShortId('');
    setFormTitle('');
    onOpen();
  };

  const handleOpenEdit = (theme: DbWordList) => {
    setModalMode('edit');
    setFormThemeDbId(theme.db_id);
    setFormShortId(theme.id);
    setFormTitle(theme.title);
    onOpen();
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formShortId || !formTitle) return;
    setIsLoading(true);
    try {
      if (modalMode === 'create') {
        await addTheme(formShortId, formTitle);
      } else if (formThemeDbId) {
        await updateTheme(formThemeDbId, formShortId, formTitle);
      }
      onClose();
      loadLists();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du thème.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTheme = async (themeDbId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce thème (et tous ses mots) ?')) return;
    setIsLoading(true);
    try {
      await deleteTheme(themeDbId);
      loadLists();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du thème.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box layerStyle="glass">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="lg" color="brand.600">Thèmes</Heading>
        <IconButton 
          aria-label="Ajouter un thème" 
          icon={<AddIcon />} 
          colorScheme="brand" 
          onClick={handleOpenCreate} 
          borderRadius="12px"
        />
      </Flex>
      
      {wordLists.length === 0 ? (
        <Text color="gray.500">Aucun thème pour le moment.</Text>
      ) : (
        <TableContainer bg="rgba(255, 255, 255, 0.4)" borderRadius="16px" border="1px solid var(--chakra-colors-whiteAlpha-600)" shadow="sm" overflowX="auto">
          <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
            <Thead bg="brand.50">
              <Tr>
                <Th>Titre</Th>
                <Th display={{ base: 'none', md: 'table-cell' }}>ID Court</Th>
                <Th textAlign="center">Mots</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {wordLists.map(theme => (
                <Tr key={theme.db_id} _hover={{ bg: 'whiteAlpha.700' }}>
                  <Td fontWeight="bold" color="brand.600" fontSize={{ base: 'md', md: 'lg' }}>{theme.title}</Td>
                  <Td display={{ base: 'none', md: 'table-cell' }} color="gray.500">{theme.id}</Td>
                  <Td textAlign="center">
                    <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                      {theme.words.length} mots
                    </Badge>
                  </Td>
                  <Td textAlign="right">
                    <Flex gap={2} justify="flex-end">
                      <IconButton aria-label="Éditer" icon={<EditIcon />} size="sm" variant="ghost" colorScheme="brand" onClick={() => handleOpenEdit(theme)} />
                      <IconButton aria-label="Supprimer" icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDeleteTheme(theme.db_id)} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
        <ModalContent layerStyle="glass" p={0} m={4}>
          <form onSubmit={handleSaveTheme}>
            <ModalHeader color="brand.600">{modalMode === 'create' ? 'Ajouter un thème' : 'Modifier le thème'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired mb={4}>
                <FormLabel>Identifiant court</FormLabel>
                <Input 
                  placeholder="ex: sports" 
                  value={formShortId} 
                  onChange={e => setFormShortId(e.target.value)} 
                  variant="glass"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Titre complet</FormLabel>
                <Input 
                  placeholder="ex: Les Sports" 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)} 
                  variant="glass"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={3} variant="ghost">Annuler</Button>
              <Button type="submit" colorScheme="brand" isLoading={isLoading}>
                {modalMode === 'create' ? 'Créer' : 'Sauvegarder'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
