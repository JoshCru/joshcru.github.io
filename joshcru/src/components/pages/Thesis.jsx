import { useState } from 'react';
import { Link } from 'react-router-dom';

const Thesis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const sampleDrawings = [
    { name: 'PART01_PERFECT.jpeg', label: 'Perfect Drawing Example' },
    { name: 'PART01_D01.jpeg', label: 'Dimensioning Error' },
    { name: 'PART01_M01.jpeg', label: 'Missing Feature' },
    { name: 'PART01_TB01.jpeg', label: 'Title Block Issue' }
  ];

  return (
    <div className="thesis-container thesis-page">
      <div className="thesis-header">
        <h1>AI Feedback Tool for Engineering Drawings</h1>
        <p className="thesis-subtitle">
          Fine-tuned AI Model for Automated Assessment of University Engineering Student Drawings
        </p>
      </div>

      <div className="thesis-overview">
        <h2>Project Overview</h2>
        <p>
          This thesis project develops an intelligent feedback system that leverages a fine-tuned ChatGPT model 
          to provide automated, constructive feedback on engineering drawings submitted by university students. 
          The system identifies common errors, suggests improvements, and helps students learn proper technical 
          drawing standards.
        </p>
      </div>

      <div className="thesis-features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🤖 AI-Powered Analysis</h3>
            <p>Fine-tuned GPT model specifically trained on engineering drawing standards and common student errors.</p>
          </div>
          <div className="feature-card">
            <h3>📏 Error Detection</h3>
            <p>Automatically identifies dimensioning errors, missing features, incorrect projections, and title block issues.</p>
          </div>
          <div className="feature-card">
            <h3>💬 Constructive Feedback</h3>
            <p>Provides detailed, educational feedback to help students understand and correct their mistakes.</p>
          </div>
          <div className="feature-card">
            <h3>📊 Performance Analytics</h3>
            <p>Tracks common error patterns and provides insights for both students and educators.</p>
          </div>
        </div>
      </div>

      <div className="thesis-technology">
        <h2>Technology Stack</h2>
        <div className="tech-stack">
          <span>OpenAI GPT</span>
          <span>Python</span>
          <span>Computer Vision</span>
          <span>Machine Learning</span>
          <span>React</span>
          <span>Educational Technology</span>
        </div>
      </div>

      <div className="sample-drawings">
        <h2>Sample Engineering Drawings Dataset</h2>
        <p>The AI model has been trained on a comprehensive dataset of engineering drawings with various error types:</p>
        
        <div className="drawing-categories">
          <div className="category">
            <h3>Error Categories</h3>
            <ul>
              <li><strong>D-Series:</strong> Dimensioning and annotation errors</li>
              <li><strong>M-Series:</strong> Missing features and incomplete drawings</li>
              <li><strong>TB-Series:</strong> Title block and documentation issues</li>
              <li><strong>PERFECT:</strong> Reference drawings meeting all standards</li>
            </ul>
          </div>
        </div>

        <div className="sample-gallery">
          <h3>Example Drawings</h3>
          <div className="image-grid">
            {sampleDrawings.map((drawing, index) => (
              <div 
                key={index} 
                className="drawing-thumbnail"
                onClick={() => setSelectedImage(drawing)}
              >
                <img 
                  src={`/dataset/engineering-drawings/${drawing.name}`}
                  alt={drawing.label}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <p>{drawing.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="thesis-objectives">
        <h2>Research Objectives</h2>
        <ol>
          <li>Develop a fine-tuned AI model capable of analysing engineering drawings</li>
          <li>Create an automated feedback system for common drawing errors</li>
          <li>Evaluate the effectiveness of AI feedback in improving student learning outcomes</li>
          <li>Establish a framework for integrating AI assessment tools in engineering education</li>
        </ol>
      </div>

      <div className="thesis-status">
        <h2>Project Status</h2>
        <div className="status-timeline">
          <div className="timeline-item completed">
            <h4>✓ Literature Review & Dataset Collection</h4>
            <p>Comprehensive review of existing automated assessment tools and collection of engineering drawing samples.</p>
          </div>
          <div className="timeline-item completed">
            <h4>✓ AI Model Development</h4>
            <p>Fine-tuning of GPT model using engineering drawing dataset and error classification system.</p>
          </div>
          <div className="timeline-item in-progress">
            <h4>🔄 System Integration & Testing</h4>
            <p>Currently developing the web interface and conducting accuracy validation tests.</p>
          </div>
          <div className="timeline-item pending">
            <h4>⏳ User Study & Evaluation</h4>
            <p>Planned evaluation with engineering students to assess learning outcomes and system effectiveness.</p>
          </div>
        </div>
      </div>

      <div className="thesis-impact">
        <h2>Expected Impact</h2>
        <p>
          This research aims to revolutionize engineering education by providing immediate, consistent, 
          and detailed feedback on technical drawings. The system will help students learn faster, 
          reduce instructor workload, and maintain consistent grading standards across different educators.
        </p>
      </div>

      <div className="thesis-links">
        <h2>Project Resources</h2>
        <div className="link-buttons">
          <Link to="/thesis/demo" className="thesis-link-button demo-button">
            🚀 Try Live Demo
          </Link>
          <button className="thesis-link-button" disabled>
            📄 Research Paper (Coming Soon)
          </button>
          <button className="thesis-link-button" disabled>
            📊 Dataset Documentation
          </button>
        </div>
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={() => setSelectedImage(null)}>&times;</span>
            <img 
              src={`/dataset/engineering-drawings/${selectedImage.name}`}
              alt={selectedImage.label}
            />
            <h3>{selectedImage.label}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Thesis;