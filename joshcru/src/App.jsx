import React from 'react';
import resumePdf from './JoshuaCruzado.pdf';
import profilePic from './pfp.jpeg';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

const Home = () => {
  return (
    <div className="profile-section">
      <div className="profile-header">
      <img src={profilePic} alt="Profile" className="profile-photo" />
        
        <div className="profile-intro">
          <h1>Joshua Cruzado</h1>
          <p className="tagline">Software Engineer | Mechatronics Engineer | AI Enthusiast</p>
          <p className="degree">Bachelor of Engineering (Honours) / Computer Science, University of New South Wales</p>
          <a href={resumePdf} className="resume-link" target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        </div>
      </div>
      
      <div className="about-section">
        <h2>About Me</h2>
        <p>
          I'm a passionate engineering and computer science student at UNSW, specializing in Mechatronics Engineering 
          and Computer Science. My dual background gives me a unique perspective on creating software that interacts 
          with physical systems. I'm particularly interested in robotics, autonomous systems, and software development.
        </p>
      </div>
      
      <div className="education-section">
        <h2>Education</h2>
        <div className="education-item">
          <h3>University of New South Wales (UNSW)</h3>
          <p>Bachelor of Engineering (Honours) / Computer Science</p>
          <p>Majors: Mechatronic Engineering, Computer Science</p>
          <p>2021 - Present</p>
          <p>WAM: 76.3 (Distinction)</p>
        </div>
      </div>
      
      <div className="skills-section">
        <h2>Skills & Expertise</h2>
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Programming</h3>
            <ul>
              <li>Python</li>
              <li>C</li>
              <li>JavaScript/TypeScript</li>
              <li>Rust</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Web Development</h3>
            <ul>
              <li>React</li>
              <li>Node.js</li>
              <li>Express</li>
              <li>Databases (SQL)</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Engineering</h3>
            <ul>
              <li>Robot Design</li>
              <li>Control Systems</li>
              <li>Digital Circuit Design</li>
              <li>Mechatronic Systems</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Tools & Technologies</h3>
            <ul>
              <li>Git</li>
              <li>Arduino</li>
              <li>Operating Systems</li>
              <li>Computer Networks</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="featured-courses">
        <h2>Key Coursework</h2>
        <div className="course-grid">
          <div className="course-item">
            <h3>Software Engineering</h3>
            <ul>
              <li>COMP1531 - Software Engineering Fundamentals (90 HD)</li>
              <li>COMP2511 - Object-Oriented Design & Programming (81 DN)</li>
              <li>COMP3900 - Computer Science Project (Current)</li>
            </ul>
          </div>
          <div className="course-item">
            <h3>Mechatronics</h3>
            <ul>
              <li>MTRN2500 - Computing for Mechatronics (89 HD)</li>
              <li>MTRN3500 - Computer Applications in Mechatronic Systems (80 DN)</li>
              <li>MTRN4010 - Advanced Autonomous Systems (Current)</li>
            </ul>
          </div>
          <div className="course-item">
            <h3>Computer Science Core</h3>
            <ul>
              <li>COMP3121 - Algorithms & Programming Techniques (74 CR)</li>
              <li>COMP3231 - Operating Systems (79 DN)</li>
              <li>COMP3311 - Database Systems (79 DN)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="featured-projects">
        <h2>Featured Projects</h2>
        <div className="project-cards">
          <Link to="/thesis" className="project-card">
            <h3>Engineering Thesis</h3>
            <p>Mechatronics research project (In progress)</p>
          </Link>
          <Link to="/robot-design" className="project-card">
            <h3>Robot Design</h3>
            <p>Autonomous robot system from MTRN3100</p>
          </Link>
          <Link to="/rust-programming" className="project-card">
            <h3>Rust Programming</h3>
            <p>Modern programming problems solved with Rust</p>
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
        <h3><Link to="/thesis">Engineering Thesis</Link></h3>
        <p>Current research project for my Engineering degree, focusing on mechatronic systems and control.</p>
        <div className="tech-stack">
          <span>Python</span>
          <span>Control Systems</span>
          <span>Robotics</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/robot-design">Robot Design</Link></h3>
        <p>Autonomous robot developed as part of MTRN3100 with navigation and object detection capabilities.</p>
        <div className="tech-stack">
          <span>C++</span>
          <span>Sensors</span>
          <span>Control Theory</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/rust-programming">Rust Programming</Link></h3>
        <p>Collection of modern programming challenges solved using Rust from COMP6991.</p>
        <div className="tech-stack">
          <span>Rust</span>
          <span>Algorithms</span>
          <span>Memory Safety</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/database-project">Database Systems Project</Link></h3>
        <p>Comprehensive database design and implementation from COMP3311.</p>
        <div className="tech-stack">
          <span>SQL</span>
          <span>Database Design</span>
          <span>Query Optimization</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/web-frontend">Web Frontend Application</Link></h3>
        <p>Interactive web application developed in COMP6080 Web Frontend Programming.</p>
        <div className="tech-stack">
          <span>React</span>
          <span>JavaScript</span>
          <span>CSS</span>
        </div>
      </div>
      <div className="project-item">
        <h3><Link to="/satellite-systems">Satellite Systems</Link></h3>
        <p>Project from AERO9500 exploring satellite communication and control systems.</p>
        <div className="tech-stack">
          <span>Python</span>
          <span>Communication Systems</span>
          <span>Orbital Mechanics</span>
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
      <p>Email: joshua.cruzado@example.com</p>
      <p>LinkedIn: <a href="https://linkedin.com/in/joshua-cruzado" target="_blank" rel="noopener noreferrer">linkedin.com/in/joshua-cruzado</a></p>
      <p>GitHub: <a href="https://github.com/joshcru" target="_blank" rel="noopener noreferrer">github.com/joshcru</a></p>
    </div>
  </div>
);

const Nav = () => (
  <nav className="navbar">
    <div className="logo">
      <Link to="/">Joshua Cruzado</Link>
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
          <p>&copy; {new Date().getFullYear()} Joshua Cruzado. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;