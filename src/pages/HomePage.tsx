import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="title">Jeux Disponibles</h1>
      
      <div className="glass-panel home-container">
        <h2>Choisissez un jeu pour commencer</h2>
        
        <div className="list-grid">
          <div 
            className="list-card"
            onClick={() => navigate('/word-guesser')}
          >
            <h3>Devinettes</h3>
            <p>Jeu de devinettes de mots avec des indices.</p>
          </div>
          {/* Add more games here in the future */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
