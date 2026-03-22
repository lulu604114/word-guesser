import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { addWordToTheme, updateWord, deleteWord } from '../data/wordListsManager';
import type { SetupContextType } from '../pages/WordGuesserSetup';
import Dialog from './Dialog';
import './ManageWords.css';

export default function ManageWords() {
  const { wordLists, loadLists } = useOutletContext<SetupContextType>();

  // Filter state
  const [filterThemeDbId, setFilterThemeDbId] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Unified Form state
  const [formThemeDbId, setFormThemeDbId] = useState<string>('');
  const [formWordId, setFormWordId] = useState<string | null>(null);
  const [formWord, setFormWord] = useState('');
  const [formClues, setFormClues] = useState<string[]>(['', '', '']);

  // Edit word state eliminated

  const [isLoading, setIsLoading] = useState(false);

  // Portal Tooltip State
  const [activeTooltip, setActiveTooltip] = useState<{ id: string, top: number, left: number } | null>(null);

  const handleTooltipEnter = (e: React.MouseEvent, wordId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      id: wordId,
      top: rect.top + window.scrollY - 15, // 15px above the icon for the arrow pointer space
      left: rect.left + window.scrollX + (rect.width / 2)
    });
  };

  const handleTooltipLeave = () => {
    setActiveTooltip(null);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormThemeDbId(filterThemeDbId || '');
    setFormWordId(null);
    setFormWord('');
    setFormClues(['', '', '']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (wordItem: { id: string, word: string, clues: string[], themeDbId: string }) => {
    setModalMode('edit');
    setFormThemeDbId(wordItem.themeDbId);
    setFormWordId(wordItem.id);
    setFormWord(wordItem.word);
    setFormClues([...wordItem.clues]);
    setIsModalOpen(true);
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
      setIsModalOpen(false);
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
    <div className="manage-words-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Liste des Mots</h3>
        <button className="icon-btn" onClick={handleOpenCreate} title="Ajouter un nouveau mot" style={{ background: 'linear-gradient(135deg, var(--primary-color), #818cf8)', color: 'white', padding: '0.6rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <div className="theme-selection" style={{ marginBottom: '1.5rem' }}>
        <select
          value={filterThemeDbId}
          onChange={(e) => setFilterThemeDbId(e.target.value)}
          style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.6)', border: '2px solid var(--glass-border)', fontSize: '1.1rem', outline: 'none' }}
        >
          <option value="">-- Tous les thèmes --</option>
          {wordLists.map(theme => (
            <option key={theme.db_id} value={theme.db_id}>{theme.title}</option>
          ))}
        </select>
      </div>

      <div className="words-list" style={{ marginTop: '0' }}>
        {displayedWords.length === 0 && <p>Aucun mot trouvé.</p>}
        {displayedWords.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="words-table">
              <thead>
                <tr>
                  <th>Mot</th>
                  <th>Thème</th>
                  <th style={{ textAlign: 'center' }}>Indices</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedWords.map(w => (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.1rem' }}>{w.word}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{w.themeTitle}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className="clues-icon"
                        onMouseEnter={(e) => handleTooltipEnter(e, w.id)}
                        onMouseLeave={handleTooltipLeave}
                      >
                        💡
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="word-actions-inline">
                        <button className="icon-btn edit-icon-btn" onClick={() => handleOpenEdit(w)} title="Modifier ce mot">✏️</button>
                        <button className="icon-btn delete-icon-btn" onClick={() => handleDeleteWord(w.id)} title="Supprimer ce mot">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Ajouter un mot' : 'Modifier le mot'}
      >
        <form onSubmit={handleSaveWord} className="add-word-form">
          <input type="text" placeholder="Le mot (ex: Football)" value={formWord} onChange={e => setFormWord(e.target.value)} required />

          {modalMode === 'create' && (
            <select
              value={formThemeDbId}
              onChange={(e) => setFormThemeDbId(e.target.value)}
              required
              style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.6)', border: '2px solid var(--glass-border)', fontSize: '1.1rem', outline: 'none' }}
            >
              <option value="">-- Renseigner le thème du mot --</option>
              {wordLists.map(theme => (
                <option key={theme.db_id} value={theme.db_id}>{theme.title}</option>
              ))}
            </select>
          )}

          <label style={{ marginTop: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Indices (au moins 1 requis) :</label>
          {formClues.map((clue, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder={`Indice ${idx + 1}`}
                value={clue}
                onChange={e => {
                  const next = [...formClues];
                  next[idx] = e.target.value;
                  setFormClues(next);
                }}
                required={idx === 0}
                style={{ flex: 1 }}
              />
              {formClues.length > 1 && (
                <button type="button" onClick={() => setFormClues(formClues.filter((_, i) => i !== idx))} className="delete-idx-btn">
                  X
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setFormClues([...formClues, ''])} className="add-clue-btn">
            + Ajouter un indice
          </button>
          <button type="submit" disabled={isLoading} className="add-action-btn" style={{ marginTop: '1rem' }}>
            {modalMode === 'create' ? "Valider l'ajout du mot" : "Sauvegarder les modifications"}
          </button>
        </form>
      </Dialog>

      {activeTooltip && createPortal(
        <div
          className="custom-tooltip body-tooltip"
          style={{
            top: `${activeTooltip.top}px`,
            left: `${activeTooltip.left}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <ul style={{ margin: 0, paddingLeft: '1.2rem', textAlign: 'left', lineHeight: '1.5' }}>
            {displayedWords.find(w => w.id === activeTooltip.id)?.clues.map((clue, i) => <li key={i}>{clue}</li>)}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}
