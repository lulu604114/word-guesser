import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WordGuesserApp from './pages/WordGuesserApp';
import WordGuesserSetup from './pages/WordGuesserSetup';
import ManageThemes from './components/ManageThemes';
import ManageWords from './components/ManageWords';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/word-guesser" element={<WordGuesserApp />} />
      <Route path="/setup/word-guesser" element={<WordGuesserSetup />}>
        <Route index element={<Navigate to="themes" replace />} />
        <Route path="themes" element={<ManageThemes />} />
        <Route path="words" element={<ManageWords />} />
      </Route>
    </Routes>
  );
}

export default App;
