import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import AppHeader from '../components/AppHeader';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Redirect to setup on success
      navigate('/setup/word-guesser');
    }
  };

  return (
    <div className="app-container">
      <AppHeader title="Connexion Administrateur" />
      <div className="glass-panel" style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Accès restreint</h2>
        
        {error && (
          <div style={{ 
            color: 'var(--error-color)', 
            background: 'rgba(239, 68, 68, 0.1)', 
            padding: '1rem', 
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label htmlFor="email" style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '1rem' }}>Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="guess-input"
              placeholder="admin@example.com"
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label htmlFor="password" style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '1rem' }}>Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="guess-input"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              marginTop: '0.5rem', 
              padding: '1.2rem', 
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
