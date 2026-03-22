import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WordGuesserApp from './pages/WordGuesserApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/word-guesser" element={<WordGuesserApp />} />
    </Routes>
  );
}

export default App;
