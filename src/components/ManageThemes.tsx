import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { addTheme, updateTheme, deleteTheme, type DbWordList } from '../data/wordListsManager';
import type { SetupContextType } from '../pages/WordGuesserSetup';
import Dialog from './Dialog';
import './ManageWords.css'; 

export default function ManageThemes() {
  const { wordLists, loadLists } = useOutletContext<SetupContextType>();

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (theme: DbWordList) => {
    setModalMode('edit');
    setFormThemeDbId(theme.db_id);
    setFormShortId(theme.id); // mapped in wordLists
    setFormTitle(theme.title);
    setIsModalOpen(true);
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
      setIsModalOpen(false);
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
    <div className="manage-form-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Thèmes</h3>
        <button className="icon-btn" onClick={handleOpenCreate} title="Ajouter un nouveau thème" style={{ background: 'linear-gradient(135deg, var(--primary-color), #818cf8)', color: 'white', padding: '0.6rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      
      <div className="words-list" style={{ marginTop: '0', marginBottom: '2rem' }}>
        {wordLists.length === 0 && <p>Aucun thème pour le moment.</p>}
        {wordLists.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="words-table">
              <thead>
                <tr>
                  <th>Titre du Thème</th>
                  <th>ID Court</th>
                  <th style={{ textAlign: 'center' }}>Mots Associés</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wordLists.map(theme => (
                  <tr key={theme.db_id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.1rem' }}>{theme.title}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{theme.id}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>
                        {theme.words.length} mots
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="word-actions-inline">
                        <button className="icon-btn edit-icon-btn" onClick={() => handleOpenEdit(theme)} title="Modifier ce thème">✏️</button>
                        <button className="icon-btn delete-icon-btn" onClick={() => handleDeleteTheme(theme.db_id)} title="Supprimer ce thème">🗑️</button>
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
        title={modalMode === 'create' ? 'Ajouter un thème' : 'Modifier le thème'}
      >
        <form onSubmit={handleSaveTheme} className="add-theme-form">
          <label style={{marginTop: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)'}}>Identifiant court :</label>
          <input 
            type="text" placeholder="ID court (ex: sports)" 
            value={formShortId} onChange={e => setFormShortId(e.target.value)} 
            required 
          />
          <label style={{marginTop: '1rem', fontSize: '1rem', color: 'var(--text-muted)'}}>Titre complet :</label>
          <input 
            type="text" placeholder="Titre (ex: Les Sports)" 
            value={formTitle} onChange={e => setFormTitle(e.target.value)} 
            required 
          />
          <button type="submit" disabled={isLoading} className="add-action-btn" style={{marginTop: '1.5rem'}}>
            {modalMode === 'create' ? 'Créer le thème' : 'Sauvegarder les modifications'}
          </button>
        </form>
      </Dialog>
    </div>
  );
}
