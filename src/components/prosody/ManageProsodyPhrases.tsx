import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, IconButton, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Textarea, useDisclosure, Text, Select, Checkbox, Badge, Tooltip,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  addProsodyPhrase, updateProsodyPhrase, deleteProsodyPhrase,
  type ProsodyPhrase,
} from '../../data/prosodyManager';
import type { ProsodySetupContextType } from '../../pages/prosody/ProsodySetup';
import { getDifficultyInfo } from '../../pages/prosody/ProsodySession';

export default function ManageProsodyPhrases() {
  const { themes, phrases, load } = useOutletContext<ProsodySetupContextType>();

  const [filterThemeId, setFilterThemeId] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [formPhraseId, setFormPhraseId] = useState<string | null>(null);
  const [formThemeId, setFormThemeId] = useState('');
  const [formPhrase, setFormPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Displayed list ─────────────────────────────────────────────────────

  const displayedPhrases = filterThemeId
    ? phrases.filter(p => p.theme_id === filterThemeId)
    : phrases;

  const themeTitle = (themeId: string) =>
    themes.find(t => t.id === themeId)?.title ?? '—';

  // ── Selection helpers ─────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === displayedPhrases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedPhrases.map(p => p.id)));
    }
  };

  // ── Modal helpers ─────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormPhraseId(null);
    setFormThemeId(filterThemeId || '');
    setFormPhrase('');
    setSelectedIds(new Set());
    onOpen();
  };

  const handleOpenEdit = (phrase: ProsodyPhrase) => {
    setModalMode('edit');
    setFormPhraseId(phrase.id);
    setFormThemeId(phrase.theme_id ?? '');
    setFormPhrase(phrase.phrase);
    onOpen();
  };

  // ── CRUD ──────────────────────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((modalMode === 'create' && !formThemeId) || !formPhrase.trim()) {
      alert('Veuillez sélectionner un thème et renseigner la phrase.');
      return;
    }
    setIsLoading(true);
    try {
      if (modalMode === 'create') {
        await addProsodyPhrase(formThemeId, formPhrase.trim());
      } else if (formPhraseId) {
        await updateProsodyPhrase(formPhraseId, formPhrase.trim());
      }
      onClose();
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde de la phrase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette phrase ?')) return;
    setIsLoading(true);
    try {
      await deleteProsodyPhrase(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression de la phrase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Voulez-vous vraiment supprimer ${selectedIds.size} phrase(s) ?`)) return;
    setIsLoading(true);
    try {
      await Promise.all([...selectedIds].map(id => deleteProsodyPhrase(id)));
      setSelectedIds(new Set());
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression des phrases.');
    } finally {
      setIsLoading(false);
    }
  };


  const difficulty = getDifficultyInfo(formPhrase);

  return (
    <Box layerStyle="glass">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="lg" color="brand.600">Phrases de Prosodie</Heading>
        <Flex gap={2} align="center">
          {selectedIds.size > 0 && (
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              variant="solid"
              size="md"
              onClick={handleDeleteSelected}
              isLoading={isLoading}
            >
              Supprimer ({selectedIds.size})
            </Button>
          )}
          <IconButton
            aria-label="Ajouter une phrase"
            icon={<AddIcon />}
            colorScheme="brand"
            size="md"
            onClick={handleOpenCreate}
            borderRadius="12px"
          />
        </Flex>
      </Flex>

      {/* Filter */}
      <Box mb={6}>
        <Select
          value={filterThemeId}
          onChange={e => setFilterThemeId(e.target.value)}
          variant="filled"
          bg="rgba(255, 255, 255, 0.6)"
          _focus={{ bg: 'rgba(255, 255, 255, 0.9)', borderColor: 'brand.500' }}
          _hover={{ bg: 'rgba(255, 255, 255, 0.8)' }}
          size="lg"
          borderRadius="12px"
        >
          <option value="">-- Tous les thèmes --</option>
          {themes.map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </Select>
      </Box>

      {/* Table */}
      {displayedPhrases.length === 0 ? (
        <Text color="gray.500">Aucune phrase trouvée.</Text>
      ) : (
        <TableContainer
          bg="rgba(255, 255, 255, 0.4)"
          borderRadius="16px"
          border="1px solid var(--chakra-colors-whiteAlpha-600)"
          shadow="sm"
        >
          <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
            <Thead bg="brand.50">
              <Tr>
                <Th w="40px" pr={0}>
                  <Checkbox
                    isChecked={
                      displayedPhrases.length > 0 &&
                      selectedIds.size === displayedPhrases.length
                    }
                    isIndeterminate={
                      selectedIds.size > 0 &&
                      selectedIds.size < displayedPhrases.length
                    }
                    onChange={toggleSelectAll}
                    colorScheme="brand"
                  />
                </Th>
                <Th>Phrase</Th>
                <Th display={{ base: 'none', md: 'table-cell' }}>Thème</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {displayedPhrases.map(p => (
                <Tr
                  key={p.id}
                  _hover={{ bg: 'whiteAlpha.700' }}
                  bg={selectedIds.has(p.id) ? 'brand.50' : undefined}
                >
                  <Td pr={0}>
                    <Checkbox
                      isChecked={selectedIds.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      colorScheme="brand"
                    />
                  </Td>
                  <Td color="gray.700">{p.phrase}</Td>
                  <Td display={{ base: 'none', md: 'table-cell' }} color="gray.500">
                    {themeTitle(p.theme_id ?? '')}
                  </Td>
                  <Td textAlign="right">
                    <Flex gap={2} justify="flex-end">
                      <IconButton
                        aria-label="Éditer"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="brand"
                        onClick={() => handleOpenEdit(p)}
                      />
                      <IconButton
                        aria-label="Supprimer"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(p.id)}
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
        <ModalContent layerStyle="glass" p={0} m={4}>
          <form onSubmit={handleSave}>
            <ModalHeader color="brand.600">
              {modalMode === 'create' ? 'Ajouter une phrase' : 'Modifier la phrase'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {modalMode === 'create' && (
                <FormControl isRequired mb={4}>
                  <FormLabel>Thème</FormLabel>
                  <Select
                    value={formThemeId}
                    onChange={e => setFormThemeId(e.target.value)}
                    variant="filled"
                    bg="rgba(255, 255, 255, 0.6)"
                    _focus={{ bg: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    <option value="">-- Sélectionner un thème --</option>
                    {themes.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </Select>
                </FormControl>
              )}
              <FormControl isRequired>
                <Flex justify="space-between" align="center" mb={1}>
                  <FormLabel mb={0}>Phrase</FormLabel>
                  <Tooltip
                    label={`≤ 3 mots = Courte · ≤ 6 = Moyenne · > 6 = Longue (${formPhrase.trim().split(/\s+/).filter(w => w.match(/[a-zA-ZÀ-ÿ0-9]/)).length} mots)`}
                    placement="top"
                    hasArrow
                  >
                    <Badge
                      colorScheme={difficulty.colorScheme}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      cursor="default"
                      transition="all 0.2s"
                    >
                      {formPhrase.trim() ? difficulty.label : '—'}
                    </Badge>
                  </Tooltip>
                </Flex>
                <Textarea
                  placeholder="ex: Est-ce que tu viens avec nous ?"
                  value={formPhrase}
                  onChange={e => setFormPhrase(e.target.value)}
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
                {modalMode === 'create' ? "Valider l'ajout" : 'Sauvegarder'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
