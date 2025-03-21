import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';


const Home = () => {
  return (
    <div className="profile-section">
      <div className="profile-header">
        <img 
          src="/api/placeholder/200/200" 
          alt="Profile" 
          className="profile-photo" 
        />
        
        <div className="profile-intro">
          <h1>Joshua Cruzado</h1>
          <p className="tagline">Software Engineer | Mechatronics | AI in Education</p>
          <p className="degree">Computer Science and Mechatronics Engineering, University of New South Wales</p>
          <a href="#" className="resume-link" target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        </div>
      </div>
      
      <div className="about-section">
        <h2>About Me</h2>
        <p>
          I'm a passionate software engineer with 5 years of experience building web applications
          and AI-powered solutions. My background in mechatronics gives me a unique perspective
          on creating software that interacts with physical systems. I'm particularly interested
          in applying AI to educational technology to create more personalized learning experiences.
        </p>
      </div>
      
      <div className="skills-section">
        <h2>Skills & Expertise</h2>
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Programming</h3>
            <ul>
              <li>JavaScript/TypeScript</li>
              <li>Python</li>
              <li>C++</li>
              <li>Java</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Web Development</h3>
            <ul>
              <li>React</li>
              <li>Node.js</li>
              <li>Express</li>
              <li>GraphQL</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>AI & Machine Learning</h3>
            <ul>
              <li>TensorFlow</li>
              <li>PyTorch</li>
              <li>Computer Vision</li>
              <li>NLP</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Tools & Technologies</h3>
            <ul>
              <li>Git</li>
              <li>Docker</li>
              <li>AWS</li>
              <li>CI/CD</li>
            </ul>
          </div>
        </div>
      </div>
      
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
      <div className="project-item">
        <h3><Link to="/ai-tutor">AI Tutor</Link></h3>
        <p>An AI-powered tutoring system that adapts to individual learning styles and needs.</p>
        <div className="tech-stack">
          <span>Python</span>
          <span>TensorFlow</span>
          <span>React</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/smart-garden">Smart Garden</Link></h3>
        <p>IoT system for automated plant care with moisture, light, and temperature monitoring.</p>
        <div className="tech-stack">
          <span>Arduino</span>
          <span>React Native</span>
          <span>Node.js</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/ecommerce">E-commerce Platform</Link></h3>
        <p>Full-featured online store with product management, cart, and payment processing.</p>
        <div className="tech-stack">
          <span>Next.js</span>
          <span>MongoDB</span>
          <span>Stripe</span>
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
      <p>Email: john.doe@example.com</p>
      <p>LinkedIn: <a href="https://linkedin.com/in/johndoe" target="_blank" rel="noopener noreferrer">linkedin.com/in/johndoe</a></p>
      <p>GitHub: <a href="https://github.com/johndoe" target="_blank" rel="noopener noreferrer">github.com/johndoe</a></p>
    </div>
  </div>
);

const Nav = () => (
  <nav className="navbar">
    <div className="logo">
      <Link to="/">John Doe</Link>
    </div>
    <ul className="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/projects">Projects</Link></li>
      <li><Link to="/contact">Contact</Link></li>
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
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} John Doe. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;