import React from 'react';
import { Link } from 'react-router-dom';

const Projects = () => (
  <div className="projects">
    <div className="projects-header">
      <h1>My Projects & Coursework</h1>
      <p>A comprehensive collection of academic projects, research, and coursework from my dual degree in Mechatronics Engineering and Computer Science at UNSW.</p>
    </div>

    {/* Featured Research */}
    <div className="project-category">
      <div className="category-header">
        <h2>Thesis & Research</h2>
        <p>Current research projects and independent work</p>
      </div>
      <div className="project-grid">
        <div className="project-item featured">
          <h3><Link to="/thesis">AI Feedback Tool for Engineering Drawings</Link></h3>
          <p>Honours thesis developing an AI-powered feedback system for automated assessment of engineering drawings using fine-tuned language models.</p>
          <div className="project-meta">
            <span className="course-code">THESIS 2024</span>
            <span className="status ongoing">Ongoing</span>
          </div>
          <div className="tech-stack">
            <span>OpenAI GPT</span>
            <span>Python</span>
            <span>React</span>
            <span>Computer Vision</span>
          </div>
          <div className="project-actions">
            <Link to="/thesis-demo" className="demo-link">Try Demo</Link>
          </div>
        </div>
      </div>
    </div>

    {/* Mechatronics Engineering Projects */}
    <div className="project-category">
      <div className="category-header">
        <h2>Mechatronics Engineering</h2>
        <p>Robotics, control systems, and mechatronic design projects</p>
      </div>
      <div className="project-grid">
        <div className="project-item">
          <h3><Link to="/robot-design">Autonomous Robot System</Link></h3>
          <p>Design and implementation of an autonomous robot with navigation, object detection, and path planning capabilities.</p>
          <div className="project-meta">
            <span className="course-code">MTRN3100</span>
            <span className="grade">HD 89</span>
          </div>
          <div className="tech-stack">
            <span>C++</span>
            <span>ROS</span>
            <span>Computer Vision</span>
            <span>Control Theory</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/advanced-autonomous-systems">Advanced Autonomous Systems</Link></h3>
          <p>Current coursework in advanced robotics, machine learning for robotics, and autonomous decision making.</p>
          <div className="project-meta">
            <span className="course-code">MTRN4010</span>
            <span className="status ongoing">Current</span>
          </div>
          <div className="tech-stack">
            <span>Python</span>
            <span>Machine Learning</span>
            <span>SLAM</span>
            <span>Path Planning</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/mechatronics-computing">Computing for Mechatronics</Link></h3>
          <p>Embedded systems programming and real-time control implementation for mechatronic applications.</p>
          <div className="project-meta">
            <span className="course-code">MTRN2500</span>
            <span className="grade">HD 89</span>
          </div>
          <div className="tech-stack">
            <span>C</span>
            <span>Embedded Systems</span>
            <span>Real-time Control</span>
            <span>Microcontrollers</span>
          </div>
        </div>
      </div>
    </div>

    {/* Computer Science Projects */}
    <div className="project-category">
      <div className="category-header">
        <h2>Computer Science</h2>
        <p>Software engineering, algorithms, and system design projects</p>
      </div>
      <div className="project-grid">
        <div className="project-item">
          <h3><Link to="/cs-project">Computer Science Project</Link></h3>
          <p>Large-scale software engineering project implementing a comprehensive web application with modern development practices.</p>
          <div className="project-meta">
            <span className="course-code">COMP3900</span>
            <span className="status ongoing">Current</span>
          </div>
          <div className="tech-stack">
            <span>React</span>
            <span>Node.js</span>
            <span>PostgreSQL</span>
            <span>Agile</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/software-engineering">Software Engineering Fundamentals</Link></h3>
          <p>Team-based software development project implementing version control, testing, and collaborative coding practices.</p>
          <div className="project-meta">
            <span className="course-code">COMP1531</span>
            <span className="grade">HD 90</span>
          </div>
          <div className="tech-stack">
            <span>Python</span>
            <span>Flask</span>
            <span>Git</span>
            <span>Testing</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/oop-design">Object-Oriented Design & Programming</Link></h3>
          <p>Advanced Java programming focusing on design patterns, software architecture, and object-oriented principles.</p>
          <div className="project-meta">
            <span className="course-code">COMP2511</span>
            <span className="grade">DN 81</span>
          </div>
          <div className="tech-stack">
            <span>Java</span>
            <span>Design Patterns</span>
            <span>UML</span>
            <span>Testing</span>
          </div>
        </div>
      </div>
    </div>

    {/* Systems & Infrastructure */}
    <div className="project-category">
      <div className="category-header">
        <h2>Systems & Infrastructure</h2>
        <p>Low-level programming, databases, and system design</p>
      </div>
      <div className="project-grid">
        <div className="project-item">
          <h3><Link to="/operating-systems">Operating Systems</Link></h3>
          <p>Implementation of OS components including scheduling algorithms, memory management, and file systems.</p>
          <div className="project-meta">
            <span className="course-code">COMP3231</span>
            <span className="grade">DN 79</span>
          </div>
          <div className="tech-stack">
            <span>C</span>
            <span>Assembly</span>
            <span>Kernel Programming</span>
            <span>System Calls</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/database-systems">Database Systems</Link></h3>
          <p>Comprehensive database design, SQL optimization, and implementation of database management concepts.</p>
          <div className="project-meta">
            <span className="course-code">COMP3311</span>
            <span className="grade">DN 79</span>
          </div>
          <div className="tech-stack">
            <span>PostgreSQL</span>
            <span>SQL</span>
            <span>Database Design</span>
            <span>Query Optimization</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/rust-programming">Extended Programming in Rust</Link></h3>
          <p>Advanced programming concepts implemented in Rust, focusing on memory safety, concurrency, and performance.</p>
          <div className="project-meta">
            <span className="course-code">COMP6991</span>
            <span className="status recent">Recent</span>
          </div>
          <div className="tech-stack">
            <span>Rust</span>
            <span>Memory Safety</span>
            <span>Concurrency</span>
            <span>Performance</span>
          </div>
        </div>
      </div>
    </div>

    {/* Web & Frontend */}
    <div className="project-category">
      <div className="category-header">
        <h2>Web Development</h2>
        <p>Frontend development and web application projects</p>
      </div>
      <div className="project-grid">
        <div className="project-item">
          <h3><Link to="/web-frontend">Web Frontend Programming</Link></h3>
          <p>Modern frontend development using React, focusing on user experience, responsive design, and state management.</p>
          <div className="project-meta">
            <span className="course-code">COMP6080</span>
            <span className="status recent">Recent</span>
          </div>
          <div className="tech-stack">
            <span>React</span>
            <span>JavaScript</span>
            <span>CSS</span>
            <span>Responsive Design</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/portfolio-website">Portfolio Website</Link></h3>
          <p>This very website! Built with React showcasing projects, skills, and academic achievements.</p>
          <div className="project-meta">
            <span className="course-code">Personal</span>
            <span className="status ongoing">Ongoing</span>
          </div>
          <div className="tech-stack">
            <span>React</span>
            <span>CSS</span>
            <span>Responsive Design</span>
            <span>GitHub Pages</span>
          </div>
        </div>
      </div>
    </div>

    {/* Specialized Topics */}
    <div className="project-category">
      <div className="category-header">
        <h2>Specialized Topics</h2>
        <p>Aerospace, algorithms, and advanced computational work</p>
      </div>
      <div className="project-grid">
        <div className="project-item">
          <h3><Link to="/satellite-systems">Satellite Systems Engineering</Link></h3>
          <p>Advanced aerospace engineering project exploring satellite communication, orbital mechanics, and space systems.</p>
          <div className="project-meta">
            <span className="course-code">AERO9500</span>
            <span className="status recent">Recent</span>
          </div>
          <div className="tech-stack">
            <span>Python</span>
            <span>MATLAB</span>
            <span>Orbital Mechanics</span>
            <span>Communication Systems</span>
          </div>
        </div>
        <div className="project-item">
          <h3><Link to="/algorithms">Algorithms & Programming Techniques</Link></h3>
          <p>Implementation and analysis of advanced algorithms, data structures, and computational complexity.</p>
          <div className="project-meta">
            <span className="course-code">COMP3121</span>
            <span className="grade">CR 74</span>
          </div>
          <div className="tech-stack">
            <span>Python</span>
            <span>Algorithms</span>
            <span>Data Structures</span>
            <span>Complexity Analysis</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Projects;