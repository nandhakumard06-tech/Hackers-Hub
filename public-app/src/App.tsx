import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CyberBackground } from './components/CyberBackground';

// Public Pages
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Success } from './pages/Success';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#FF1A1A] selection:text-white relative">
        <CyberBackground />
        <Navbar />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<Success />} />
            {/* All unknown routes redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
