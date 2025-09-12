import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './components/pages/Home';
import Projects from './components/pages/Projects';
import Contact from './components/pages/Contact';
import ThesisApp from './components/thesis/ThesisApp';
import RebalanceCalculator from './components/pages/RebalanceCalculator';
import './App.css';

const Nav = () => {
  const location = useLocation();
  
  // Don't show main navigation on thesis pages
  if (location.pathname.startsWith('/thesis')) {
    return null;
  }
  
  return (
    <nav className="navbar">
      <div className="navbar-content" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 40px'}}>
        <div className="logo">
          <Link to="/">Joshua Cruzado</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/thesis">Thesis</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  
  // Don't show main footer on thesis pages
  if (location.pathname.startsWith('/thesis')) {
    return null;
  }
  
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Joshua Cruzado. All rights reserved.</p>
    </footer>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isThesisPage = location.pathname.startsWith('/thesis');
  
  // Set body background based on current page
  React.useEffect(() => {
    if (isThesisPage) {
      document.body.style.background = '#ffffff';
      document.body.style.color = '#333';
    } else {
      document.body.style.background = '#0d1117';
      document.body.style.color = '#c9d1d9';
    }
  }, [isThesisPage]);
  
  return (
    <div className={`app-container ${isThesisPage ? 'thesis-theme' : 'dark-theme'}`}>
      <Nav />
      <main className={`content ${isThesisPage ? 'thesis-theme' : 'dark-theme'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/rebalance-calculator" element={<RebalanceCalculator />} />
          {/* Thesis routes handled by ThesisApp */}
          <Route path="/thesis/*" element={<ThesisApp />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;