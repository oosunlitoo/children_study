import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Chinese from './pages/Chinese';
import English from './pages/English';
import MathPage from './pages/Math';
import Drawing from './pages/Drawing';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-brand-cream font-sans text-gray-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chinese" element={<Chinese />} />
          <Route path="/english" element={<English />} />
          <Route path="/math" element={<MathPage />} />
          <Route path="/drawing" element={<Drawing />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
};

export default App;
