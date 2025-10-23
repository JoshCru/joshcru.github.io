import { useState, useRef } from 'react';
import { analyzeDrawingWithGemini, getMockAnalysis, testGeminiConnection } from '../../utils/geminiAPI';

const ThesisDemo = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'gemini', 'mock', 'unknown'
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);
  const fileInputRef = useRef(null);

  const sampleImages = [
    { name: 'PART01_PERFECT.jpeg', label: 'Perfect Drawing', category: 'Reference' },
    { name: 'PART01_D01.jpeg', label: 'Dimensioning Error', category: 'Error' },
    { name: 'PART01_M01.jpeg', label: 'Missing Feature', category: 'Error' },
    { name: 'PART01_TB01.jpeg', label: 'Title Block Issue', category: 'Error' }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          file,
          url: e.target.result,
          name: file.name
        });
        setAnalysisResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleImageSelect = (imageName, label) => {
    setUploadedImage({
      url: `/dataset/dataset-2025-07-29-000639/${imageName}`,
      name: imageName,
      label: label,
      isSample: true
    });
    setAnalysisResult(null);
    setError(null);
  };

  const testApiConnection = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    setError(null);

    try {
      const result = await testGeminiConnection();
      setApiTestResult({ success: true, message: 'API connection successful!' });
      console.log('✅ API test passed:', result);
    } catch (error) {
      setApiTestResult({ success: false, message: error.message });
      console.error('❌ API test failed:', error);
    } finally {
      setIsTestingApi(false);
    }
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      let result;
      
      console.log('🔍 Analysis starting for:', uploadedImage);
      console.log('📊 Image details:', {
        name: uploadedImage.name,
        isSample: uploadedImage.isSample,
        hasUrl: !!uploadedImage.url,
        urlType: uploadedImage.url ? (uploadedImage.url.startsWith('data:') ? 'data-url' : 'file-path') : 'none'
      });
      
      // Force Gemini for uploaded images (data URLs), use mock for sample images (file paths)
      if (uploadedImage.url && uploadedImage.url.startsWith('data:image/')) {
        // Real uploaded image - use Gemini API
        try {
          console.log('🤖 Attempting Gemini API analysis for uploaded image...');
          result = await analyzeDrawingWithGemini(uploadedImage.url);
          setApiStatus('gemini');
          console.log('✅ Gemini API analysis successful!');
        } catch (geminiError) {
          console.log('❌ Gemini API failed, falling back to mock:', geminiError.message);
          setApiStatus('mock');
          result = getMockAnalysis(uploadedImage.name || 'uploaded-image');
          // Add source indicator for fallback
          result.source = 'mock-fallback';
          result.fallbackReason = geminiError.message;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } else {
        // Sample image - use mock analysis (by design)
        console.log('📋 Using mock analysis for sample image...');
        setApiStatus('mock');
        result = getMockAnalysis(uploadedImage.name || uploadedImage.label);
        result.source = 'mock-sample';
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      console.log('📄 Final analysis result:', result);
      setAnalysisResult(result);
    } catch (err) {
      setError(`Failed to analyse image: ${err.message}`);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };


  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981'; // green
    if (score >= 75) return '#f59e0b'; // yellow
    if (score >= 60) return '#ef4444'; // red
    return '#dc2626'; // dark red
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'satisfactory': return '#f59e0b';
      case 'needs_improvement': return '#ef4444';
      case 'poor': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div className="demo-container thesis-page">
      <div className="demo-header">
        <h1>Engineering Drawing Analysis</h1>
        <p className="demo-subtitle">
          Get instant, detailed feedback on your technical drawings using AI powered by AS1100 standards
        </p>
        <div className="demo-stats">
          <div className="stat-item">
            <span className="stat-number">7</span>
            <span className="stat-label">Title Block Elements Checked</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">AS1100</span>
            <span className="stat-label">Australian Standard Compliance</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">Instant</span>
            <span className="stat-label">Feedback Delivery</span>
          </div>
        </div>
      </div>

      <div className="demo-content">
        {/* API Test Section */}
        <div className="api-test-section">
          <h2>System Status</h2>
          <p>Verify AI analysis connectivity before uploading your drawings:</p>
          
          <div className="api-test-controls">
            <button 
              className="test-api-button"
              onClick={testApiConnection}
              disabled={isTestingApi}
            >
              {isTestingApi ? 'Testing Connection...' : 'Test AI Connection'}
            </button>
            
            {apiTestResult && (
              <div className={`api-test-result ${apiTestResult.success ? 'success' : 'error'}`}>
                <div className="result-indicator">
                  <div className={`status-dot ${apiTestResult.success ? 'success' : 'error'}`}></div>
                  <span>{apiTestResult.success ? 'Connected' : 'Connection Failed'}</span>
                </div>
                <p className="result-message">{apiTestResult.message}</p>
              </div>
            )}
          </div>
        </div>

        <div className="upload-section">
          <h2>Submit Your Drawing</h2>
          <div className="upload-area">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="upload-content">
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <button 
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Drawing File
              </button>
              <p className="upload-hint">Supports PDF, JPG, PNG formats</p>
            </div>
          </div>

          <div className="sample-images">
            <h3>Or Try Sample Drawings</h3>
            <p className="sample-description">Test the analysis with pre-loaded engineering drawings that demonstrate common issues</p>
            <div className="sample-grid">
              {sampleImages.map((sample, index) => (
                <div 
                  key={index}
                  className={`sample-item ${sample.category.toLowerCase()}`}
                  onClick={() => handleSampleImageSelect(sample.name, sample.label)}
                >
                  <div className="sample-image-container">
                    <img
                      src={`/dataset/dataset-2025-07-29-000639/${sample.name}`}
                      alt={sample.label}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="sample-overlay">
                      <span className="sample-action">Analyse Drawing</span>
                    </div>
                  </div>
                  <div className="sample-info">
                    <h4 className="sample-label">{sample.label}</h4>
                    <span className={`sample-category ${sample.category.toLowerCase()}`}>
                      {sample.category === 'Reference' ? 'Compliant Example' : 'Common Issue'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {uploadedImage && (
          <div className="image-preview">
            <h3>Selected Image</h3>
            <div className="preview-container">
              <img src={uploadedImage.url} alt="Selected drawing" />
              <div className="image-info">
                <p><strong>File:</strong> {uploadedImage.name}</p>
                {uploadedImage.label && <p><strong>Type:</strong> {uploadedImage.label}</p>}
              </div>
              <button 
                className="analyze-button"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="button-spinner"></div>
                    Analysing Drawing...
                  </>
                ) : (
                  'Start Analysis'
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="analyzing-spinner">
            <div className="spinner"></div>
            <p>AI is analysing your drawing...</p>
            <p className="analysing-details">
              Checking dimensions, line quality, completeness, and standards compliance...
            </p>
          </div>
        )}

        {analysisResult && (
          <div className="analysis-results">
            <div className="results-header">
              <h2>Analysis Results</h2>
              <div className="overall-score">
                <div 
                  className="score-circle"
                  style={{ borderColor: getScoreColor(analysisResult.overallScore) }}
                >
                  <span className="score-number">{analysisResult.overallScore}</span>
                  <span className="score-label">Overall</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h3>Summary</h3>
              <p className="summary-text">{analysisResult.summary}</p>
              <div className="analysis-meta">
                <span>Analysed: {analysisResult.timestamp}</span>
                <span>Confidence: {(analysisResult.confidence * 100).toFixed(1)}%</span>
                <div className={`api-status ${apiStatus}`}>
                  <div className={`status-indicator ${apiStatus}`}></div>
                  <span>
                    {apiStatus === 'gemini' ? 'Gemini AI Analysis' : 
                     apiStatus === 'mock' ? 'Demo Mode' : 'Unknown Source'}
                  </span>
                </div>
              </div>
            </div>

            <div className="feedback-categories">
              <h3>Detailed Feedback</h3>
              <div className="categories-grid">
                {analysisResult.feedback.map((category, index) => (
                  <div key={index} className="category-card">
                    <div className="category-header">
                      <h4>{category.category}</h4>
                      <div 
                        className="category-score"
                        style={{ color: getStatusColor(category.status) }}
                      >
                        {category.score}/100
                      </div>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(category.status) }}
                    >
                      {category.status.replace('_', ' ').toUpperCase()}
                    </div>
                    <p className="category-comments">{category.comments}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="suggestions-section">
              <h3>Improvement Suggestions</h3>
              <ul className="suggestions-list">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="action-buttons">
              <button className="secondary-button">Generate Report</button>
              <button className="secondary-button">Save Analysis</button>
              <button className="primary-button" onClick={() => {
                setUploadedImage(null);
                setAnalysisResult(null);
                setError(null);
              }}>
                Analyse Another Drawing
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="demo-info">
        <h2>How It Works</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6l0 6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Instant Analysis</h3>
            <p>Upload your technical drawing and receive comprehensive feedback within seconds using advanced AI technology.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>AS1100 Compliance</h3>
            <p>Every analysis follows Australian engineering standards, ensuring your drawings meet professional requirements.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Detailed Feedback</h3>
            <p>Get specific insights on title blocks, dimensions, materials, tolerances, and more with actionable improvement suggestions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisDemo;