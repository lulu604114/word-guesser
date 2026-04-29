import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, IconButton, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, useDisclosure, Text, VStack, Image, Badge,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  addCestPourItem, updateCestPourItem, deleteCestPourItem,
} from '../../data/cestpourManager';
import type { CestPourItem } from '../../types/cestpour';
import type { CestPourSetupContextType } from '../../pages/cestpour/CestPourSetup';

export default function ManageCestPourItems() {
  const { items, load } = useOutletContext<CestPourSetupContextType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [formId, setFormId]                 = useState<string | null>(null);
  const [formObjectName, setFormObjectName] = useState('');
  const [formImageUrl, setFormImageUrl]     = useState('');
  const [formCorrect, setFormCorrect]       = useState('');
  const [formWrong, setFormWrong]           = useState('');
  const [formOrder, setFormOrder]           = useState(0);
  const [isLoading, setIsLoading]           = useState(false);

  const [previewImg, setPreviewImg] = useState('');

  const openCreate = () => {
    setModalMode('create');
    setFormId(null);
    setFormObjectName('');
    setFormImageUrl('');
    setFormCorrect('');
    setFormWrong('');
    setFormOrder(items.length);
    setPreviewImg('');
    onOpen();
  };

  const openEdit = (item: CestPourItem) => {
    setModalMode('edit');
    setFormId(item.id);
    setFormObjectName(item.object_name);
    setFormImageUrl(item.image_url);
    setFormCorrect(item.correct_answer);
    setFormWrong(item.wrong_answer);
    setFormOrder(item.order_index);
    setPreviewImg(item.image_url);
    onOpen();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formObjectName || !formCorrect || !formWrong) return;
    setIsLoading(true);
    try {
      if (modalMode === 'create') {
        await addCestPourItem(formObjectName, formImageUrl, formCorrect, formWrong, formOrder);
      } else if (formId) {
        await updateCestPourItem(formId, formObjectName, formImageUrl, formCorrect, formWrong, formOrder);
      }
      onClose();
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet item ?')) return;
    setIsLoading(true);
    try {
      await deleteCestPourItem(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box layerStyle="glass">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="lg" color="brand.600">Items "C'est pour..."</Heading>
        <IconButton
          aria-label="Ajouter un item"
          icon={<AddIcon />}
          colorScheme="brand"
          onClick={openCreate}
          borderRadius="12px"
        />
      </Flex>

      {items.length === 0 ? (
        <Text color="gray.400" fontStyle="italic">Aucun item pour le moment.</Text>
      ) : (
        <TableContainer
          bg="rgba(255,255,255,0.4)"
          borderRadius="16px"
          border="1px solid var(--chakra-colors-whiteAlpha-600)"
          shadow="sm"
          overflowX="auto"
        >
          <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
            <Thead bg="brand.50">
              <Tr>
                <Th>Image</Th>
                <Th>Objet</Th>
                <Th>✓ Bonne réponse</Th>
                <Th>✗ Mauvaise réponse</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map(item => (
                <Tr key={item.id} _hover={{ bg: 'whiteAlpha.700' }}>
                  <Td>
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.object_name}
                        w="48px"
                        h="48px"
                        objectFit="cover"
                        borderRadius="8px"
                        border="1px solid rgba(0,0,0,0.08)"
                        fallback={<Box w="48px" h="48px" bg="gray.100" borderRadius="8px" display="flex" alignItems="center" justifyContent="center"><Text fontSize="lg">🖼️</Text></Box>}
                      />
                    ) : (
                      <Box w="48px" h="48px" bg="gray.100" borderRadius="8px" display="flex" alignItems="center" justifyContent="center">
                        <Text fontSize="lg">🖼️</Text>
                      </Box>
                    )}
                  </Td>
                  <Td fontWeight="700" color="brand.600">{item.object_name}</Td>
                  <Td>
                    <Badge colorScheme="green" borderRadius="8px" px={2}>{item.correct_answer}</Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="red" borderRadius="8px" px={2}>{item.wrong_answer}</Badge>
                  </Td>
                  <Td textAlign="right">
                    <Flex gap={2} justify="flex-end">
                      <IconButton aria-label="Éditer" icon={<EditIcon />} size="sm" variant="ghost" colorScheme="brand" onClick={() => openEdit(item)} />
                      <IconButton aria-label="Supprimer" icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(item.id)} />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
        <ModalContent layerStyle="glass" p={0} m={4}>
          <form onSubmit={handleSave}>
            <ModalHeader color="brand.600">
              {modalMode === 'create' ? 'Ajouter un item' : 'Modifier l\'item'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Nom de l'objet</FormLabel>
                  <Input
                    placeholder="ex: Un couteau"
                    value={formObjectName}
                    onChange={e => setFormObjectName(e.target.value)}
                    variant="glass"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>URL de l'image</FormLabel>
                  <Input
                    placeholder="https://..."
                    value={formImageUrl}
                    onChange={e => { setFormImageUrl(e.target.value); setPreviewImg(e.target.value); }}
                    variant="glass"
                  />
                  {previewImg && (
                    <Box mt={2} w="80px" h="80px" borderRadius="10px" overflow="hidden" border="1px solid rgba(0,0,0,0.08)">
                      <Image
                        src={previewImg}
                        alt="Aperçu"
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        fallback={<Box w="80px" h="80px" bg="gray.100" display="flex" alignItems="center" justifyContent="center"><Text fontSize="xl">❌</Text></Box>}
                      />
                    </Box>
                  )}
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>✓ Bonne réponse (mot qui complète "c'est pour...")</FormLabel>
                  <Input
                    placeholder="ex: couper"
                    value={formCorrect}
                    onChange={e => setFormCorrect(e.target.value)}
                    variant="glass"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>✗ Mauvaise réponse (mot distracteur)</FormLabel>
                  <Input
                    placeholder="ex: dessiner"
                    value={formWrong}
                    onChange={e => setFormWrong(e.target.value)}
                    variant="glass"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Ordre d'affichage</FormLabel>
                  <Input
                    type="number"
                    value={formOrder}
                    onChange={e => setFormOrder(Number(e.target.value))}
                    variant="glass"
                    w="100px"
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
