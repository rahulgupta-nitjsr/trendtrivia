import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/globalStyles';
import { theme } from './styles/theme';
import HomePage from './pages/HomePage';
import TopicPage from './pages/TopicPage';
import QuizPage from './pages/QuizPage';
import ScorePage from './pages/ScorePage';
import Background from './components/Background';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Background />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic" element={<TopicPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/score" element={<ScorePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 