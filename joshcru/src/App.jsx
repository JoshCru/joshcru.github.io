import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

const Home = () => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [degree, setDegree] = useState('');
  const [about, setAbout] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const saveProfile = () => {
    setIsEditing(false);
    // In a real app, you'd save this data to localStorage or a backend
  };

  return (
    <div className="home">
      <div className="profile-header">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt="Profile" 
            className="profile-photo" 
          />
        ) : (
          <div className="profile-photo-placeholder">
            {isEditing ? (
              <input 
                type="text" 
                value={photoUrl} 
                onChange={(e) => setPhotoUrl(e.target.value)} 
                placeholder="Enter photo URL" 
              />
            ) : (
              <span>No Photo Added</span>
            )}
          </div>
        )}
        
        <div className="profile-intro">
          <h1>Welcome to My Portfolio</h1>
          <p className="tagline">Software Engineer | Mechatronics | AI in Education</p>
          
          {degree && <p className="degree">{degree}</p>}
          
          {isEditing ? (
            <input 
              type="text" 
              value={degree} 
              onChange={(e) => setDegree(e.target.value)} 
              placeholder="Your degree (e.g., B.S. Computer Science)" 
              className="degree-input"
            />
          ) : null}
          
          {resumeUrl ? (
            <a href={resumeUrl} className="resume-link" target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
          ) : isEditing ? (
            <input 
              type="text" 
              value={resumeUrl} 
              onChange={(e) => setResumeUrl(e.target.value)} 
              placeholder="Link to your resume" 
              className="resume-input"
            />
          ) : null}
        </div>
      </div>
      
      <div className="about-section">
        <h2>About Me</h2>
        {isEditing ? (
          <textarea 
            value={about} 
            onChange={(e) => setAbout(e.target.value)} 
            placeholder="Tell visitors about yourself, your skills, and your experience..." 
            rows={6}
            className="about-textarea"
          />
        ) : (
          <p>{about || "Add some information about yourself to help visitors get to know you better."}</p>
        )}
      </div>
      
      {isEditing ? (
        <button onClick={saveProfile} className="save-button">Save Profile</button>
      ) : (
        <button onClick={() => setIsEditing(true)} className="edit-button">Edit Profile</button>
      )}
      
      <div className="featured-projects">
        <h2>Featured Projects</h2>
        <div className="project-cards">
          <Link to="/discord" className="project-card">
            <h3>Discord Clone</h3>
            <p>Real-time chat application with user authentication</p>
          </Link>
          <Link to="/rebalance" className="project-card">
            <h3>Rebalance Calculator</h3>
            <p>Financial tool for portfolio management</p>
          </Link>
          <Link to="/todolist" className="project-card">
            <h3>To-Do List</h3>
            <p>Task management app with priority sorting</p>
          </Link>
        </div>
        <Link to="/projects" className="view-all">View All Projects →</Link>
      </div>
    </div>
  );
};

const Projects = () => (
  <div className="projects">
    <h2>My Projects</h2>
    <div className="project-grid">
      <div className="project-item">
        <h3><Link to="/discord">Discord Clone</Link></h3>
        <p>A real-time chat application with user authentication, message history, and channel support.</p>
        <div className="tech-stack">
          <span>React</span>
          <span>Firebase</span>
          <span>WebSockets</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/rebalance">Rebalance Calculator</Link></h3>
        <p>A tool for investors to calculate how to rebalance their portfolio to match target allocations.</p>
        <div className="tech-stack">
          <span>JavaScript</span>
          <span>Chart.js</span>
          <span>Local Storage</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/todolist">To-Do List</Link></h3>
        <p>A task management application with priority sorting, deadlines, and category filtering.</p>
        <div className="tech-stack">
          <span>React</span>
          <span>Redux</span>
          <span>Material UI</span>
        </div>
      </div>
    </div>
  </div>
);

const Contact = () => (
  <div className="contact">
    <h2>Contact Me</h2>
    <form className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Your Name" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="your.email@example.com" />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={5} placeholder="How can I help you?"></textarea>
      </div>
      <button type="submit" className="submit-button">Send Message</button>
    </form>
    
    <div className="contact-info">
      <p>Email: your.email@example.com</p>
      <p>LinkedIn: <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">Your Profile</a></p>
      <p>GitHub: <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">yourusername</a></p>
    </div>
  </div>
);

const Profile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(name || '');

  return (
    <div className="profile-page">
      <h2>Profile {name ? `- ${name}` : "Not Set"}</h2>
      <div className="profile-form">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Enter Name" 
          className="profile-input"
        />
        <button 
          onClick={() => navigate(`/profile/${input}`)} 
          className="profile-button"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

const Nav = () => (
  <nav className="navbar">
    <div className="logo">
      <Link to="/">YourName</Link>
    </div>
    <ul className="nav-links">
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
      <div className="app-container">
        <Nav />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:name" element={<Profile />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;