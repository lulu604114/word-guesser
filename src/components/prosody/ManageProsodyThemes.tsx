import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, IconButton, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, useDisclosure, Text, Badge,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  addProsodyTheme, updateProsodyTheme, deleteProsodyTheme,
  type ProsodyTheme,
} from '../../data/prosodyManager';
import type { ProsodySetupContextType } from '../../pages/prosody/ProsodySetup';

export default function ManageProsodyThemes() {
  const { themes, phrases, load } = useOutletContext<ProsodySetupContextType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [formId, setFormId] = useState<string | null>(null);
  const [formShortId, setFormShortId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormId(null);
    setFormShortId('');
    setFormTitle('');
    setFormDescription('');
    onOpen();
  };

  const handleOpenEdit = (theme: ProsodyTheme) => {
    setModalMode('edit');
    setFormId(theme.id);
    setFormShortId(theme.short_id);
    setFormTitle(theme.title);
    setFormDescription(theme.description);
    onOpen();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formShortId || !formTitle) return;
    setIsLoading(true);
    try {
      if (modalMode === 'create') {
        await addProsodyTheme(formShortId, formTitle, formDescription);
      } else if (formId) {
        await updateProsodyTheme(formId, formShortId, formTitle, formDescription);
      }
      onClose();
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du thème.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce thème (et toutes ses phrases) ?')) return;
    setIsLoading(true);
    try {
      await deleteProsodyTheme(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression du thème.');
    } finally {
      setIsLoading(false);
    }
  };

  const phraseCountFor = (themeId: string) =>
    phrases.filter(p => p.theme_id === themeId).length;

  return (
    <Box layerStyle="glass">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="lg" color="brand.600">Thèmes de Prosodie</Heading>
        <IconButton
          aria-label="Ajouter un thème"
          icon={<AddIcon />}
          colorScheme="brand"
          onClick={handleOpenCreate}
          borderRadius="12px"
        />
      </Flex>

      {themes.length === 0 ? (
        <Text color="gray.500">Aucun thème pour le moment.</Text>
      ) : (
        <TableContainer
          bg="rgba(255, 255, 255, 0.4)"
          borderRadius="16px"
          border="1px solid var(--chakra-colors-whiteAlpha-600)"
          shadow="sm"
          overflowX="auto"
        >
          <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
            <Thead bg="brand.50">
              <Tr>
                <Th>Titre</Th>
                <Th display={{ base: 'none', md: 'table-cell' }}>ID Court</Th>
                <Th display={{ base: 'none', lg: 'table-cell' }}>Description</Th>
                <Th textAlign="center">Phrases</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {themes.map(theme => (
                <Tr key={theme.id} _hover={{ bg: 'whiteAlpha.700' }}>
                  <Td fontWeight="bold" color="brand.600" fontSize={{ base: 'md', md: 'lg' }}>
                    {theme.title}
                  </Td>
                  <Td display={{ base: 'none', md: 'table-cell' }} color="gray.500">
                    {theme.short_id}
                  </Td>
                  <Td
                    display={{ base: 'none', lg: 'table-cell' }}
                    color="gray.500"
                    maxW="260px"
                    isTruncated
                  >
                    {theme.description}
                  </Td>
                  <Td textAlign="center">
                    <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                      {phraseCountFor(theme.id)} phrases
                    </Badge>
                  </Td>
                  <Td textAlign="right">
                    <Flex gap={2} justify="flex-end">
                      <IconButton
                        aria-label="Éditer"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="brand"
                        onClick={() => handleOpenEdit(theme)}
                      />
                      <IconButton
                        aria-label="Supprimer"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(theme.id)}
                      />
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
          <form onSubmit={handleSave}>
            <ModalHeader color="brand.600">
              {modalMode === 'create' ? 'Ajouter un thème' : 'Modifier le thème'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired mb={4}>
                <FormLabel>Identifiant court</FormLabel>
                <Input
                  placeholder="ex: phrases-interrogatives"
                  value={formShortId}
                  onChange={e => setFormShortId(e.target.value)}
                  variant="glass"
                />
              </FormControl>
              <FormControl isRequired mb={4}>
                <FormLabel>Titre complet</FormLabel>
                <Input
                  placeholder="ex: Phrases interrogatives"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  variant="glass"
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Description du thème..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  variant="filled"
                  bg="rgba(255, 255, 255, 0.6)"
                  _focus={{ bg: 'rgba(255, 255, 255, 0.9)', borderColor: 'brand.500' }}
                  borderRadius="12px"
                  rows={3}
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
