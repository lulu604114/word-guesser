import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WordGuesserApp from './pages/word-guesser/WordGuesserApp';
import WordGuesserSetup from './pages/word-guesser/WordGuesserSetup';
import ProsodyApp from './pages/prosody/ProsodyApp';
import ManageThemes from './components/ManageThemes';
import ManageWords from './components/ManageWords';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/word-guesser" element={<WordGuesserApp />} />
        <Route path="/word-guesser/:themeId" element={<WordGuesserApp />} />
        <Route path="/prosody" element={<ProsodyApp />} />
        <Route path="/prosody/:themeId" element={<ProsodyApp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/setup/word-guesser" element={<WordGuesserSetup />}>
            <Route index element={<Navigate to="themes" replace />} />
            <Route path="themes" element={<ManageThemes />} />
            <Route path="words" element={<ManageWords />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
