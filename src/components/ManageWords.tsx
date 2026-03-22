import { useState } from 'react';
import type { DbWordList } from '../data/wordListsManager';
import { addWordToTheme, updateWord, deleteWord, addTheme } from '../data/wordListsManager';
import './ManageWords.css'; 

interface ManageWordsProps {
  wordLists: DbWordList[];
  onBack: () => void;
  onDataChanged: () => void;
}

export default function ManageWords({ wordLists, onBack, onDataChanged }: ManageWordsProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('');
  
  // New Theme state
  const [newThemeShortId, setNewThemeShortId] = useState('');
  const [newThemeTitle, setNewThemeTitle] = useState('');
  
  // New Word state
  const [newWord, setNewWord] = useState('');
  const [newClues, setNewClues] = useState<string[]>(['', '', '']);
  
  // Edit Word State
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [editWord, setEditWord] = useState('');
  const [editClues, setEditClues] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const selectedTheme = wordLists.find(t => t.id === selectedThemeId);

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeShortId || !newThemeTitle) return;
    setIsLoading(true);
    try {
      await addTheme(newThemeShortId, newThemeTitle);
      setNewThemeShortId('');
      setNewThemeTitle('');
      onDataChanged();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du thème.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    const validClues = newClues.filter(c => c.trim() !== '');
    if (!selectedTheme || !newWord || validClues.length === 0) {
      alert("Veuillez remplir le mot et au moins un indice.");
      return;
    }
    setIsLoading(true);
    try {
      await addWordToTheme(selectedTheme.db_id, newWord, validClues);
      setNewWord(''); 
      setNewClues(['', '', '']);
      onDataChanged();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du mot.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (wordItem: { id: string, word: string, clues: string[] }) => {
    setEditingWordId(wordItem.id);
    setEditWord(wordItem.word);
    setEditClues([...wordItem.clues]);
  };

  const handleSaveEdit = async () => {
    const validClues = editClues.filter(c => c.trim() !== '');
    if (!editingWordId || !editWord || validClues.length === 0) {
      alert("Veuillez remplir le mot et au moins un indice.");
      return;
    }
    setIsLoading(true);
    try {
      await updateWord(editingWordId, editWord, validClues);
      setEditingWordId(null);
      onDataChanged();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification du mot.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWord = async (wordDbId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce mot ?')) return;
    setIsLoading(true);
    try {
      await deleteWord(wordDbId);
      onDataChanged();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du mot.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>Gestion des Mots</h2>
        <button className="back-btn" onClick={onBack}>Retourner au Jeu</button>
      </div>

      <div className="manage-form-section">
        <h3>Sélectionner ou Créer un Thème</h3>
        
        <div className="theme-selection">
          <select 
            value={selectedThemeId} 
            onChange={(e) => setSelectedThemeId(e.target.value)}
          >
            <option value="">-- Choisir un thème --</option>
            {wordLists.map(theme => (
              <option key={theme.id} value={theme.id}>{theme.title}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleAddTheme} className="add-theme-form">
          <h4>Ajouter un nouveau thème</h4>
          <input 
            type="text" placeholder="ID court (ex: sports)" 
            value={newThemeShortId} onChange={e => setNewThemeShortId(e.target.value)} 
            required 
          />
          <input 
            type="text" placeholder="Titre (ex: Les Sports)" 
            value={newThemeTitle} onChange={e => setNewThemeTitle(e.target.value)} 
            required 
          />
          <button type="submit" disabled={isLoading}>Créer le thème</button>
        </form>
      </div>

      {selectedTheme && (
        <div className="manage-words-section">
          <h3>Mots pour "{selectedTheme.title}"</h3>

          <form onSubmit={handleAddWord} className="add-word-form">
            <h4>Ajouter un mot</h4>
            <input type="text" placeholder="Le mot (ex: Football)" value={newWord} onChange={e => setNewWord(e.target.value)} required />
            
            <label style={{marginTop: '1rem', fontSize: '0.9rem', color: '#ccc'}}>Indices (au moins 1 requis) :</label>
            {newClues.map((clue, idx) => (
              <div key={idx} style={{display: 'flex', gap: '0.5rem'}}>
                <input 
                  type="text" 
                  placeholder={`Indice ${idx + 1}`} 
                  value={clue} 
                  onChange={e => {
                    const next = [...newClues];
                    next[idx] = e.target.value;
                    setNewClues(next);
                  }} 
                  required={idx === 0}
                  style={{flex: 1}}
                />
                {newClues.length > 1 && (
                  <button type="button" onClick={() => setNewClues(newClues.filter((_, i) => i !== idx))} className="delete-btn" style={{padding: '0 0.5rem'}}>
                    X
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setNewClues([...newClues, ''])} style={{marginTop: '0.5rem', backgroundColor: '#555'}}>
              + Ajouter un indice
            </button>
            <button type="submit" disabled={isLoading} style={{marginTop: '1rem'}}>
              Valider l'ajout du mot
            </button>
          </form>

          <div className="words-list">
            {selectedTheme.words.length === 0 && <p>Aucun mot dans ce thème.</p>}
            {selectedTheme.words.map(w => (
              <div key={w.id} className="word-card">
                {editingWordId === w.id ? (
                  <div className="edit-word-form">
                    <label>Mot :</label>
                    <input type="text" value={editWord} onChange={e => setEditWord(e.target.value)} required />
                    
                    <label style={{marginTop: '0.5rem'}}>Indices :</label>
                    {editClues.map((clue, idx) => (
                      <div key={idx} style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                        <input 
                          type="text" 
                          value={clue} 
                          onChange={e => {
                            const next = [...editClues];
                            next[idx] = e.target.value;
                            setEditClues(next);
                          }} 
                          required={idx === 0}
                          style={{flex: 1}}
                        />
                        {editClues.length > 1 && (
                          <button type="button" onClick={() => setEditClues(editClues.filter((_, i) => i !== idx))} className="delete-btn" style={{padding: '0 0.5rem'}}>
                            X
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setEditClues([...editClues, ''])} style={{backgroundColor: '#555', marginBottom: '1rem'}}>
                      + Ajouter un indice
                    </button>

                    <button onClick={handleSaveEdit} disabled={isLoading}>Sauvegarder les modifications</button>
                    <button onClick={() => setEditingWordId(null)} className="cancel-btn">Annuler</button>
                  </div>
                ) : (
                  <div className="word-info">
                    <h4>{w.word}</h4>
                    <ul>
                      {w.clues.map((clue, i) => <li key={i}>{clue}</li>)}
                    </ul>
                    <div className="word-actions">
                      <button onClick={() => handleStartEdit(w)}>Modifier</button>
                      <button className="delete-btn" onClick={() => handleDeleteWord(w.id)}>Supprimer</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
