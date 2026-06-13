import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Navigation from './components/Navigation/Navigation';

// Pages
import LandingPage from './pages/LandingPage/LandingPage';
import QueryInterface from './pages/QueryInterface/QueryInterface';
import ResultsPage from './pages/ResultsPage/ResultsPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/query" element={<QueryInterface />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
};

export default App;
