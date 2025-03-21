import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

const Home = () => (
  <div className="home">
    <h1>Welcome to My Portfolio</h1>
    <p>Software Engineer | Mechatronics | AI in Education</p>
  </div>
);

const Projects = () => (
  <div className="projects">
    <h2>My Projects</h2>
    <ul>
      <li><Link to="/discord">Discord Clone</Link></li>
      <li><Link to="/rebalance">Rebalance Calculator</Link></li>
      <li><Link to="/todolist">To-Do List</Link></li>
    </ul>
  </div>
);

const Contact = () => (
  <div className="contact">
    <h2>Contact Me</h2>
    <p>Email: your.email@example.com</p>
    <p>LinkedIn: <a href="https://linkedin.com">Your Profile</a></p>
  </div>
);

const Profile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = React.useState(name || '');

  return (
    <div className="profile">
      <h2>Profile {name ? name : "Not Set"}</h2>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Enter Name" />
      <button onClick={() => navigate(`/profile/${input}`)}>Go!</button>
    </div>
  );
};

const Nav = () => (
  <nav className="navbar">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/projects">Projects</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      <li><Link to="/profile">Profile</Link></li>
    </ul>
  </nav>
);

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile/:name" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
