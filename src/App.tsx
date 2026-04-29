import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WordGuesserApp from './pages/word-guesser/WordGuesserApp';
import WordGuesserSetup from './pages/word-guesser/WordGuesserSetup';
import ProsodyApp from './pages/prosody/ProsodyApp';
import ProsodySetup from './pages/prosody/ProsodySetup';
import CebApp from './pages/ceb/CebApp';
import CebSetup from './pages/ceb/CebSetup';
import ManageThemes from './components/ManageThemes';
import ManageWords from './components/ManageWords';
import ManageProsodyThemes from './components/prosody/ManageProsodyThemes';
import ManageProsodyPhrases from './components/prosody/ManageProsodyPhrases';
import ManageCebTexts from './components/ceb/ManageCebTexts';
import ManageCebQuestions from './components/ceb/ManageCebQuestions';
import CestPourApp from './pages/cestpour/CestPourApp';
import CestPourSetup from './pages/cestpour/CestPourSetup';
import ManageCestPourItems from './components/cestpour/ManageCestPourItems';
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
        <Route path="/ceb" element={<CebApp />} />
        <Route path="/cestpour" element={<CestPourApp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/setup/word-guesser" element={<WordGuesserSetup />}>
            <Route index element={<Navigate to="themes" replace />} />
            <Route path="themes" element={<ManageThemes />} />
            <Route path="words" element={<ManageWords />} />
          </Route>
          <Route path="/setup/prosody" element={<ProsodySetup />}>
            <Route index element={<Navigate to="themes" replace />} />
            <Route path="themes" element={<ManageProsodyThemes />} />
            <Route path="phrases" element={<ManageProsodyPhrases />} />
          </Route>
          <Route path="/setup/ceb" element={<CebSetup />}>
            <Route index element={<Navigate to="texts" replace />} />
            <Route path="texts" element={<ManageCebTexts />} />
            <Route path="questions" element={<ManageCebQuestions />} />
          </Route>
          <Route path="/setup/cestpour" element={<CestPourSetup />}>
            <Route index element={<ManageCestPourItems />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
