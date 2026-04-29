import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, Select, useDisclosure, Text, Badge, VStack,
  HStack, Switch,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  addCebQuestion, updateCebQuestion, deleteCebQuestion,
  addCebOption, deleteCebOption,
} from '../../data/cebManager';
import type { CebQuestion } from '../../types/ceb';
import type { CebSetupContextType } from '../../pages/ceb/CebSetup';

const QUESTION_TYPES = [
  { value: 'qcm', label: 'QCM (une seule bonne réponse)' },
  { value: 'multiple', label: 'Choix multiples (plusieurs bonnes réponses)' },
  { value: 'vrai_faux', label: 'Vrai / Faux' },
  { value: 'ouverte', label: 'Question ouverte (réponse libre)' },
  { value: 'fermee', label: 'Question fermée (Oui / Non)' },
];

const NEEDS_OPTIONS = ['qcm', 'multiple', 'vrai_faux', 'fermee'];

export default function ManageCebQuestions() {
  const { texts, questions, options, load } = useOutletContext<CebSetupContextType>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [selectedTextId, setSelectedTextId] = useState<string>(texts[0]?.id ?? '');

  // Question form
  const [formQId, setFormQId] = useState<string | null>(null);
  const [formTextId, setFormTextId] = useState('');
  const [formType, setFormType] = useState<CebQuestion['type']>('qcm');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formDraftAnswer, setFormDraftAnswer] = useState('');
  const [formOptions, setFormOptions] = useState<Array<{ id?: string; text: string; isCorrect: boolean }>>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const questionsForText = (textId: string) =>
    questions.filter(q => q.text_id === textId).sort((a, b) => a.order_index - b.order_index);

  const optionsForQuestion = (questionId: string) =>
    options.filter(o => o.question_id === questionId).sort((a, b) => a.order_index - b.order_index);

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormQId(null);
    setFormTextId(selectedTextId);
    setFormType('qcm');
    setFormQuestionText('');
    setFormDraftAnswer('');
    setFormOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    onOpen();
  };

  const handleOpenEdit = (q: CebQuestion) => {
    setModalMode('edit');
    setFormQId(q.id);
    setFormTextId(q.text_id);
    setFormType(q.type);
    setFormQuestionText(q.question_text);
    setFormDraftAnswer(q.draft_answer);
    const qOptions = optionsForQuestion(q.id);
    setFormOptions(
      qOptions.length > 0
        ? qOptions.map(o => ({ id: o.id, text: o.option_text, isCorrect: o.is_correct }))
        : [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
    );
    onOpen();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText || !formTextId) return;
    setIsLoading(true);
    try {
      const existingCount = questionsForText(formTextId).length;
      if (modalMode === 'create') {
        const newQ = await addCebQuestion(
          formTextId,
          existingCount,
          formType,
          formQuestionText,
          formDraftAnswer
        );
        if (NEEDS_OPTIONS.includes(formType)) {
          for (let i = 0; i < formOptions.length; i++) {
            const opt = formOptions[i];
            if (opt.text.trim()) {
              await addCebOption(newQ.id, i, opt.text.trim(), opt.isCorrect);
            }
          }
        }
      } else if (formQId) {
        const existingQ = questions.find(q => q.id === formQId);
        await updateCebQuestion(
          formQId,
          existingQ?.order_index ?? 0,
          formType,
          formQuestionText,
          formDraftAnswer
        );
        // Sync options: delete old ones and re-create
        const oldOptions = optionsForQuestion(formQId);
        for (const old of oldOptions) {
          await deleteCebOption(old.id);
        }
        if (NEEDS_OPTIONS.includes(formType)) {
          for (let i = 0; i < formOptions.length; i++) {
            const opt = formOptions[i];
            if (opt.text.trim()) {
              await addCebOption(formQId, i, opt.text.trim(), opt.isCorrect);
            }
          }
        }
      }
      onClose();
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde de la question.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Supprimer cette question (et ses options) ?')) return;
    setIsLoading(true);
    try {
      await deleteCebQuestion(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression.');
    } finally {
      setIsLoading(false);
    }
  };

  const addOptionRow = () =>
    setFormOptions(prev => [...prev, { text: '', isCorrect: false }]);

  const removeOptionRow = (i: number) =>
    setFormOptions(prev => prev.filter((_, idx) => idx !== i));

  const updateOption = (i: number, field: 'text' | 'isCorrect', value: string | boolean) =>
    setFormOptions(prev => prev.map((o, idx) => (idx === i ? { ...o, [field]: value } : o)));

  const handleTypeChange = (newType: CebQuestion['type']) => {
    setFormType(newType);
    if (newType === 'vrai_faux') {
      setFormOptions([
        { text: 'Vrai', isCorrect: false },
        { text: 'Faux', isCorrect: false },
      ]);
    } else if (newType === 'fermee') {
      setFormOptions([
        { text: 'Oui', isCorrect: false },
        { text: 'Non', isCorrect: false },
      ]);
    } else if (!NEEDS_OPTIONS.includes(newType)) {
      setFormOptions([]);
    } else {
      setFormOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
    }
  };

  const Q_TYPE_COLORS: Record<string, string> = { qcm: 'purple', multiple: 'blue', vrai_faux: 'orange', ouverte: 'green', fermee: 'teal' };
  const Q_TYPE_LABELS: Record<string, string> = { qcm: 'QCM', multiple: 'Multiples', vrai_faux: 'V/F', ouverte: 'Ouverte', fermee: 'Oui/Non' };

  return (
    <Box layerStyle="glass">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h3" size="lg" color="brand.600">Questions CEB</Heading>
        <IconButton
          aria-label="Ajouter une question"
          icon={<AddIcon />}
          colorScheme="brand"
          onClick={handleOpenCreate}
          borderRadius="12px"
        />
      </Flex>

      {/* Text selector */}
      <FormControl mb={6}>
        <FormLabel fontSize="sm" color="gray.500">Afficher les questions pour :</FormLabel>
        <Select
          value={selectedTextId}
          onChange={e => setSelectedTextId(e.target.value)}
          bg="rgba(255,255,255,0.6)"
          border="2px solid rgba(255,255,255,0.7)"
          borderRadius="12px"
          _focus={{ borderColor: 'brand.600' }}
          maxW="400px"
        >
          {texts.map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </Select>
      </FormControl>

      {texts.length === 0 ? (
        <Text color="gray.400" fontStyle="italic">Ajoutez d'abord un texte dans l'onglet "Textes".</Text>
      ) : selectedTextId && questionsForText(selectedTextId).length === 0 ? (
        <Text color="gray.400" fontStyle="italic">Aucune question pour ce texte. Cliquez sur + pour en ajouter.</Text>
      ) : (
        <VStack align="stretch" spacing={3}>
          {questionsForText(selectedTextId).map((q, i) => (
            <Box
              key={q.id}
              bg="rgba(255,255,255,0.5)"
              border="1px solid rgba(255,255,255,0.7)"
              borderRadius="12px"
              p={4}
            >
              <Flex justify="space-between" align="flex-start">
                <HStack flex={1} spacing={3} align="flex-start">
                  <Text fontWeight="700" color="gray.400" fontSize="sm" flexShrink={0}>
                    {i + 1}.
                  </Text>
                  <VStack align="flex-start" spacing={1} flex={1}>
                    <HStack>
                      <Badge colorScheme={Q_TYPE_COLORS[q.type]} borderRadius="6px" fontSize="10px">
                        {Q_TYPE_LABELS[q.type]}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" fontWeight="500">
                      {q.question_text}
                    </Text>
                    {optionsForQuestion(q.id).length > 0 && (
                      <Text fontSize="xs" color="gray.400">
                        {optionsForQuestion(q.id).length} options •{' '}
                        {optionsForQuestion(q.id).filter(o => o.is_correct).length} correcte(s)
                      </Text>
                    )}
                  </VStack>
                </HStack>
                <HStack>
                  <IconButton
                    aria-label="Éditer"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="brand"
                    onClick={() => handleOpenEdit(q)}
                  />
                  <IconButton
                    aria-label="Supprimer"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDeleteQuestion(q.id)}
                  />
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
        <ModalContent layerStyle="glass" p={0} m={4}>
          <form onSubmit={handleSave}>
            <ModalHeader color="brand.600">
              {modalMode === 'create' ? 'Ajouter une question' : 'Modifier la question'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Texte associé</FormLabel>
                  <Select
                    value={formTextId}
                    onChange={e => setFormTextId(e.target.value)}
                    bg="rgba(255,255,255,0.6)"
                    border="2px solid rgba(255,255,255,0.7)"
                    borderRadius="12px"
                    _focus={{ borderColor: 'brand.600' }}
                  >
                    {texts.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Type de question</FormLabel>
                  <Select
                    value={formType}
                    onChange={e => handleTypeChange(e.target.value as CebQuestion['type'])}
                    bg="rgba(255,255,255,0.6)"
                    border="2px solid rgba(255,255,255,0.7)"
                    borderRadius="12px"
                    _focus={{ borderColor: 'brand.600' }}
                  >
                    {QUESTION_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Énoncé de la question</FormLabel>
                  <Textarea
                    placeholder="Ex: Quel est le thème principal du texte ?"
                    value={formQuestionText}
                    onChange={e => setFormQuestionText(e.target.value)}
                    variant="filled"
                    bg="rgba(255,255,255,0.6)"
                    _focus={{ bg: 'rgba(255,255,255,0.9)', borderColor: 'brand.500' }}
                    borderRadius="12px"
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Ébauche de réponse (visible pour l'élève sur demande)</FormLabel>
                  <Textarea
                    placeholder="Aide ou réponse modèle..."
                    value={formDraftAnswer}
                    onChange={e => setFormDraftAnswer(e.target.value)}
                    variant="filled"
                    bg="rgba(255,255,255,0.6)"
                    _focus={{ bg: 'rgba(255,255,255,0.9)', borderColor: 'brand.500' }}
                    borderRadius="12px"
                    rows={2}
                  />
                </FormControl>

                {/* Options */}
                {NEEDS_OPTIONS.includes(formType) && (
                  <Box
                    p={4}
                    bg="rgba(99,102,241,0.04)"
                    border="1px dashed rgba(99,102,241,0.3)"
                    borderRadius="12px"
                  >
                    <Flex justify="space-between" align="center" mb={3}>
                      <Text fontWeight="600" fontSize="sm" color="brand.600">
                        Options de réponse
                      </Text>
                      {(formType === 'qcm' || formType === 'multiple') && (
                        <Button size="xs" leftIcon={<AddIcon />} onClick={addOptionRow} colorScheme="brand" variant="ghost">
                          Ajouter
                        </Button>
                      )}
                    </Flex>
                    <VStack align="stretch" spacing={2}>
                      {formOptions.map((opt, i) => (
                        <HStack key={i} spacing={2}>
                          <Input
                            value={opt.text}
                            onChange={e => updateOption(i, 'text', e.target.value)}
                            placeholder={`Option ${i + 1}`}
                            size="sm"
                            bg="rgba(255,255,255,0.7)"
                            borderRadius="8px"
                            isReadOnly={formType === 'vrai_faux' || formType === 'fermee'}
                          />
                          <HStack spacing={1} flexShrink={0}>
                            <Text fontSize="xs" color="gray.500">Correct</Text>
                            <Switch
                              isChecked={opt.isCorrect}
                              onChange={e => {
                                if (formType === 'qcm' || formType === 'vrai_faux' || formType === 'fermee') {
                                  // Single correct answer: uncheck others
                                  setFormOptions(prev =>
                                    prev.map((o, idx) => ({ ...o, isCorrect: idx === i ? e.target.checked : false }))
                                  );
                                } else {
                                  updateOption(i, 'isCorrect', e.target.checked);
                                }
                              }}
                              colorScheme="green"
                              size="sm"
                            />
                          </HStack>
                          {(formType === 'qcm' || formType === 'multiple') && formOptions.length > 2 && (
                            <IconButton
                              aria-label="Supprimer l'option"
                              icon={<DeleteIcon />}
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => removeOptionRow(i)}
                            />
                          )}
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}
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
