import { useState, useRef } from 'react';
import { analyzeDrawingWithGemini, getMockAnalysis, testGeminiConnection } from '../../utils/geminiAPI';
import { analyzeDrawingWithOpenAI, testOpenAIConnection } from '../../utils/openaiAPI';

const ThesisDemo = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown'); // 'gemini', 'openai', 'mock', 'unknown'
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gemini'); // 'gemini' or 'openai'
  const fileInputRef = useRef(null);

  const sampleImages = [
    { name: 'Part1_P_3.jpg', label: 'Perfect Drawing', category: 'Reference' },
    { name: 'Part1_D01_3.jpg', label: 'Date Error', category: 'Error' },
    { name: 'Part1_M01_3.jpg', label: 'Material Error', category: 'Error' },
    { name: 'Part1_TL01_3.jpg', label: 'Title Error', category: 'Error' }
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
      url: `/dataset/iteration-2-dataset/${imageName}`,
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
      let result;
      if (selectedModel === 'gemini') {
        result = await testGeminiConnection();
      } else {
        result = await testOpenAIConnection();
      }
      setApiTestResult({ success: true, message: `${selectedModel === 'gemini' ? 'Gemini' : 'OpenAI'} API connection successful!` });
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
        urlType: uploadedImage.url ? (uploadedImage.url.startsWith('data:') ? 'data-url' : 'file-path') : 'none',
        selectedModel: selectedModel
      });

      // Use selected model for uploaded images (data URLs), use mock for sample images (file paths)
      if (uploadedImage.url && uploadedImage.url.startsWith('data:image/')) {
        // Real uploaded image - use selected AI model
        try {
          if (selectedModel === 'gemini') {
            console.log('🤖 Attempting Gemini API analysis for uploaded image...');
            result = await analyzeDrawingWithGemini(uploadedImage.url);
            setApiStatus('gemini');
            console.log('✅ Gemini API analysis successful!');
          } else {
            console.log('🤖 Attempting OpenAI fine-tuned model analysis for uploaded image...');
            result = await analyzeDrawingWithOpenAI(uploadedImage.url);
            setApiStatus('openai');
            console.log('✅ OpenAI API analysis successful!');
          }
        } catch (apiError) {
          console.log(`❌ ${selectedModel === 'gemini' ? 'Gemini' : 'OpenAI'} API failed, falling back to mock:`, apiError.message);
          setApiStatus('mock');
          result = getMockAnalysis(uploadedImage.name || 'uploaded-image');
          // Add source indicator for fallback
          result.source = 'mock-fallback';
          result.fallbackReason = apiError.message;
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
      <header style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '80px 40px',
        borderRadius: '0 0 24px 24px',
        marginBottom: '60px',
        textAlign: 'center',
        color: 'white',
        marginLeft: '-20px',
        marginRight: '-20px',
        boxShadow: '0 20px 60px rgba(15, 23, 42, 0.4)'
      }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', color: '#ffffff' }}>
          Engineering Drawing Analysis
        </h1>
        <p style={{ fontSize: '22px', opacity: '0.85', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.5' }}>
          Get instant, detailed feedback on your technical drawings using AI powered by AS1100 standards
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#60a5fa' }}>7</div>
            <div style={{ fontSize: '14px', opacity: '0.8', maxWidth: '120px' }}>Title Block Elements Checked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#60a5fa' }}>AS1100</div>
            <div style={{ fontSize: '14px', opacity: '0.8', maxWidth: '120px' }}>Australian Standard Compliance</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#60a5fa' }}>Instant</div>
            <div style={{ fontSize: '14px', opacity: '0.8', maxWidth: '120px' }}>Feedback Delivery</div>
          </div>
        </div>
      </header>

      <div className="demo-content">
        {/* Model Selection Section */}
        <div className="model-selection-section">
          <h2>Select AI Model</h2>
          <p>Choose which AI model to use for analysing your engineering drawings:</p>

          <div className="model-options">
            <div
              className={`model-card ${selectedModel === 'gemini' ? 'selected' : ''}`}
              onClick={() => setSelectedModel('gemini')}
            >
              <div className="model-header">
                <div className={`model-radio ${selectedModel === 'gemini' ? 'selected' : ''}`}>
                  {selectedModel === 'gemini' && <div className="radio-dot"></div>}
                </div>
                <h3>Gemini 2.0 Flash</h3>
              </div>
              <p className="model-description">
                Google's latest multimodal AI model with fast processing and excellent vision capabilities for general engineering drawing analysis.
              </p>
            </div>

            <div
              className={`model-card ${selectedModel === 'openai' ? 'selected' : ''}`}
              onClick={() => setSelectedModel('openai')}
            >
              <div className="model-header">
                <div className={`model-radio ${selectedModel === 'openai' ? 'selected' : ''}`}>
                  {selectedModel === 'openai' && <div className="radio-dot"></div>}
                </div>
                <h3>Fine-tuned GPT-4o</h3>
              </div>
              <p className="model-description">
                Custom fine-tuned OpenAI model specifically trained for AS1100 title block analysis and engineering drawing compliance.
              </p>
              <span className="model-badge">Specialized for AS1100</span>
            </div>
          </div>
        </div>

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
              {isTestingApi ? 'Testing Connection...' : `Test ${selectedModel === 'gemini' ? 'Gemini' : 'OpenAI'} Connection`}
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
                      src={`/dataset/iteration-2-dataset/${sample.name}`}
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
                     apiStatus === 'openai' ? 'Fine-tuned GPT-4o Analysis' :
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