import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Thesis from '../pages/Thesis';
import ThesisDemo from '../pages/ThesisDemo';

const ThesisNav = () => (
  <nav className="thesis-navbar">
    <div className="thesis-nav-content">
      <div className="thesis-logo">
        <Link to="/thesis">AI Drawing Analysis</Link>
      </div>
      <ul className="thesis-nav-links">
        <li><Link to="/thesis">About</Link></li>
        <li><Link to="/thesis/demo">Demo</Link></li>
        <li><Link to="/">← Back to Portfolio</Link></li>
      </ul>
    </div>
  </nav>
);

const ThesisApp = () => {
  return (
    <div className="thesis-app">
      <ThesisNav />
      <main className="thesis-content">
        <Routes>
          <Route path="/" element={<Thesis />} />
          <Route path="/demo" element={<ThesisDemo />} />
        </Routes>
      </main>
      <footer className="thesis-footer">
        <p>&copy; 2024 Joshua Cruzado - AI Feedback Tool for Engineering Drawings</p>
      </footer>
    </div>
  );
};

export default ThesisApp;