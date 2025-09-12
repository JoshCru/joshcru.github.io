import React from 'react';
import { Link } from 'react-router-dom';
import resumePdf from '../../JoshuaCruzado.pdf';
import profilePic from '../../image.png';

const Home = () => {
  return (
    <div className="profile-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-name">Joshua Cruzado</h1>
            <p className="hero-tagline">Software Engineer | Mechatronics Engineer | AI Enthusiast</p>
            <p className="hero-degree">Bachelor of Engineering (Honours) / Computer Science</p>
            <p className="hero-university">University of New South Wales</p>
            <div className="hero-actions">
              <a href={resumePdf} className="cta-button primary" target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
              <Link to="/projects" className="cta-button secondary">
                View Projects
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={profilePic} alt="Profile" className="profile-photo" />
          </div>
        </div>
      </div>
      
      <div className="intro-section">
        <div className="intro-content">
          <h2>About Me</h2>
          <p>
            I'm a passionate engineering and computer science student at UNSW, specializing in Mechatronics Engineering 
            and Computer Science. My dual background gives me a unique perspective on creating software that interacts 
            with physical systems, with particular interests in robotics, autonomous systems, and AI.
          </p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">76.3</div>
            <div className="stat-label">WAM (Distinction)</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2021</div>
            <div className="stat-label">Started at UNSW</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2</div>
            <div className="stat-label">Engineering Majors</div>
          </div>
        </div>
      </div>
      
      <div className="skills-section">
        <div className="section-header">
          <h2>Technical Skills</h2>
          <p>Core technologies and expertise areas</p>
        </div>
        
        <div className="skills-container">
          <div className="skill-category">
            <h3>Programming Languages</h3>
            <div className="skill-tags">
              <span className="skill-tag">Python</span>
              <span className="skill-tag">C</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">TypeScript</span>
              <span className="skill-tag">Rust</span>
            </div>
          </div>
          
          <div className="skill-category">
            <h3>Web Development</h3>
            <div className="skill-tags">
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Express</span>
              <span className="skill-tag">SQL</span>
              <span className="skill-tag">PostgreSQL</span>
            </div>
          </div>
          
          <div className="skill-category">
            <h3>Engineering & Robotics</h3>
            <div className="skill-tags">
              <span className="skill-tag">Robot Design</span>
              <span className="skill-tag">Control Systems</span>
              <span className="skill-tag">Circuit Design</span>
              <span className="skill-tag">Arduino</span>
              <span className="skill-tag">ROS</span>
            </div>
          </div>
          
          <div className="skill-category">
            <h3>Tools & Platforms</h3>
            <div className="skill-tags">
              <span className="skill-tag">Git</span>
              <span className="skill-tag">Linux</span>
              <span className="skill-tag">Docker</span>
              <span className="skill-tag">MATLAB</span>
              <span className="skill-tag">CAD</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="coursework-section">
        <div className="section-header">
          <h2>Academic Highlights</h2>
          <p>Notable courses and achievements</p>
        </div>
        
        <div className="highlight-grid">
          <div className="highlight-item">
            <div className="highlight-grade">HD 90</div>
            <div className="highlight-details">
              <h4>Software Engineering Fundamentals</h4>
              <p>COMP1531 - Team development, version control, testing</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-grade">HD 89</div>
            <div className="highlight-details">
              <h4>Computing for Mechatronics</h4>
              <p>MTRN2500 - Embedded systems, real-time control</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-grade">DN 81</div>
            <div className="highlight-details">
              <h4>Object-Oriented Programming</h4>
              <p>COMP2511 - Java, design patterns, architecture</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-grade">DN 80</div>
            <div className="highlight-details">
              <h4>Mechatronic Systems</h4>
              <p>MTRN3500 - Computer applications in engineering</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="featured-projects">
        <div className="section-header">
          <h2>Featured Projects</h2>
          <p>Recent work and ongoing developments</p>
        </div>
        
        <div className="projects-showcase">
          <Link to="/thesis" className="project-card featured">
            <div className="project-header">
              <h3>AI Feedback Tool for Engineering Drawings</h3>
              <span className="project-status ongoing">In Progress</span>
            </div>
            <p>Honours thesis developing an AI-powered feedback system for automated assessment of engineering drawings using fine-tuned language models.</p>
            <div className="project-tech">
              <span className="tech-tag">OpenAI GPT</span>
              <span className="tech-tag">React</span>
              <span className="tech-tag">Python</span>
            </div>
          </Link>
          
          <Link to="/rebalance-calculator" className="project-card">
            <div className="project-header">
              <h3>ASX Portfolio Rebalancer</h3>
              <span className="project-status completed">Live</span>
            </div>
            <p>Portfolio management and rebalancing tool for Australian stock investments with real-time data integration.</p>
            <div className="project-tech">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Alpha Vantage API</span>
              <span className="tech-tag">JavaScript</span>
            </div>
          </Link>
          
          <Link to="/robot-design" className="project-card">
            <div className="project-header">
              <h3>Autonomous Robot System</h3>
              <span className="project-status completed">HD 89</span>
            </div>
            <p>Design and implementation of an autonomous robot with navigation, object detection, and path planning capabilities.</p>
            <div className="project-tech">
              <span className="tech-tag">C++</span>
              <span className="tech-tag">ROS</span>
              <span className="tech-tag">Computer Vision</span>
            </div>
          </Link>
        </div>
        
        <div className="projects-cta">
          <Link to="/projects" className="view-all-button">
            View All Projects
            <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;