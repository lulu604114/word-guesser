import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, IconButton, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Select, useDisclosure, Text, Badge, VStack,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  addCebText, updateCebText, deleteCebText,
} from '../../data/cebManager';
import type { CebText } from '../../types/ceb';
import type { CebSetupContextType } from '../../pages/ceb/CebSetup';

export default function ManageCebTexts() {
  const { texts, questions, load } = useOutletContext<CebSetupContextType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [formId, setFormId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formLevel, setFormLevel] = useState<'court' | 'moyen' | 'long'>('court');
  const [formContent, setFormContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormId(null);
    setFormTitle('');
    setFormLevel('court');
    setFormContent('');
    onOpen();
  };

  const handleOpenEdit = (text: CebText) => {
    setModalMode('edit');
    setFormId(text.id);
    setFormTitle(text.title);
    setFormLevel(text.level);
    setFormContent(text.content);
    onOpen();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) return;
    setIsLoading(true);
    try {
      if (modalMode === 'create') {
        await addCebText(formTitle, formLevel, formContent);
      } else if (formId) {
        await updateCebText(formId, formTitle, formLevel, formContent);
      }
      onClose();
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du texte.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce texte (et toutes ses questions) ?')) return;
    setIsLoading(true);
    try {
      await deleteCebText(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression du texte.');
    } finally {
      setIsLoading(false);
    }
  };

  const questionCountFor = (textId: string) =>
    questions.filter(q => q.text_id === textId).length;

  const LEVEL_LABELS: Record<string, string> = {
    court: 'Court',
    moyen: 'Moyen',
    long: 'Long',
  };

  const LEVEL_COLORS: Record<string, string> = {
    court: 'green',
    moyen: 'blue',
    long: 'purple',
  };

  return (
    <Box layerStyle="glass">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="lg" color="brand.600">Textes CEB</Heading>
        <IconButton
          aria-label="Ajouter un texte"
          icon={<AddIcon />}
          colorScheme="brand"
          onClick={handleOpenCreate}
          borderRadius="12px"
        />
      </Flex>

      {texts.length === 0 ? (
        <Text color="gray.500">Aucun texte pour le moment.</Text>
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
                <Th>Niveau</Th>
                <Th display={{ base: 'none', md: 'table-cell' }} textAlign="center">Questions</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {texts.map(text => (
                <Tr key={text.id} _hover={{ bg: 'whiteAlpha.700' }}>
                  <Td fontWeight="bold" color="brand.600" fontSize={{ base: 'sm', md: 'md' }}>
                    {text.title}
                  </Td>
                  <Td>
                    <Badge colorScheme={LEVEL_COLORS[text.level]} borderRadius="8px" px={2}>
                      {LEVEL_LABELS[text.level]}
                    </Badge>
                  </Td>
                  <Td display={{ base: 'none', md: 'table-cell' }} textAlign="center">
                    <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                      {questionCountFor(text.id)} questions
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
                        onClick={() => handleOpenEdit(text)}
                      />
                      <IconButton
                        aria-label="Supprimer"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(text.id)}
                      />
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
          <form onSubmit={handleSave}>
            <ModalHeader color="brand.600">
              {modalMode === 'create' ? 'Ajouter un texte' : 'Modifier le texte'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Titre du texte</FormLabel>
                  <Input
                    placeholder="ex: La vie des abeilles"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    variant="glass"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Niveau de difficulté</FormLabel>
                  <Select
                    value={formLevel}
                    onChange={e => setFormLevel(e.target.value as 'court' | 'moyen' | 'long')}
                    bg="rgba(255,255,255,0.6)"
                    border="2px solid rgba(255,255,255,0.7)"
                    borderRadius="12px"
                    _focus={{ borderColor: 'brand.600' }}
                  >
                    <option value="court">📄 Court (~100 mots)</option>
                    <option value="moyen">📃 Moyen (~250 mots)</option>
                    <option value="long">📜 Long (~400 mots)</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Contenu du texte</FormLabel>
                  <Textarea
                    placeholder="Collez ou écrivez le texte ici. Utilisez des sauts de ligne pour séparer les paragraphes."
                    value={formContent}
                    onChange={e => setFormContent(e.target.value)}
                    variant="filled"
                    bg="rgba(255, 255, 255, 0.6)"
                    _focus={{ bg: 'rgba(255, 255, 255, 0.9)', borderColor: 'brand.500' }}
                    borderRadius="12px"
                    rows={10}
                    resize="vertical"
                  />
                </FormControl>
              </VStack>
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
