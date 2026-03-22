import React from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { useWordLists } from '../hooks/useWordLists';
import AppHeader from '../components/AppHeader';
import '../components/ManageWords.css';
import type { DbWordList } from '../data/wordListsManager';
import { useAuth } from '../contexts/AuthContext';

export type SetupContextType = {
  wordLists: DbWordList[];
  loadLists: () => Promise<void>;
};

const WordGuesserSetup: React.FC = () => {
  const navigate = useNavigate();
  const { wordLists, isLoading, error, loadLists } = useWordLists();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (isLoading) return <div className="loading-container"><h2>Chargement des données...</h2></div>;
  if (error) return (
    <div className="error-container">
      <h2>{error}</h2>
      <button onClick={loadLists}>Réessayer</button>
    </div>
  );

  return (
    <div className="app-container">
      <AppHeader title="Configuration Devinettes" />
      <div className="setup-layout">
        <aside className="setup-sidebar">
          <nav className="setup-nav">
            <NavLink to="themes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              📂 Gérer les Thèmes
            </NavLink>
            <NavLink to="words" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              📝 Gérer les Mots
            </NavLink>
            <button 
              onClick={handleSignOut} 
              className="nav-item" 
              style={{ 
                marginTop: '1rem', 
                border: '1px solid rgba(255, 100, 100, 0.3)', 
                color: '#ff6b6b', 
                background: 'rgba(255, 100, 100, 0.1)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🚪 Se déconnecter
            </button>
          </nav>
        </aside>

        <main className="setup-content">
          <Outlet context={{ wordLists, loadLists } satisfies SetupContextType} />
        </main>
      </div>
    </div>
  );
};

export default WordGuesserSetup;
