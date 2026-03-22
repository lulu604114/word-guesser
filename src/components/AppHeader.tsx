import React from 'react';
import { useNavigate } from 'react-router-dom';

type AppHeaderProps = {
  title: string;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="title-container">
      <button className="back-button" onClick={() => navigate('/')} title="Retour à l'accueil">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 className="title">{title}</h1>
    </div>
  );
};

export default AppHeader;
