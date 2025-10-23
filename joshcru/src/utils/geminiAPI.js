// Gemini API integration for engineering drawing analysis

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Test function to check API connectivity
export const testGeminiConnection = async () => {
  console.log('🔍 Testing Gemini API connection...');
  console.log('API Key available:', GEMINI_API_KEY ? 'Yes' : 'No');
  console.log('API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
  
  if (!GEMINI_API_KEY) {
    throw new Error('No API key found. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
  }

  try {
    const testPayload = {
      contents: [{
        parts: [{ text: "Say 'API connection successful'" }]
      }]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`API test failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API test successful:', data);
    return { success: true, response: data };
  } catch (error) {
    console.error('❌ API test failed:', error);
    throw error;
  }
};

export const analyzeDrawingWithGemini = async (imageData) => {
  console.log('🔍 Starting Gemini analysis...');
  console.log('API Key available:', GEMINI_API_KEY ? 'Yes' : 'No');
  console.log('Image data type:', typeof imageData);
  console.log('Image data preview:', imageData ? imageData.substring(0, 50) + '...' : 'null');

  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
  }

  try {
    // Convert image to base64 if it's not already
    let base64Image = imageData;
    let mimeType = "image/jpeg";
    
    if (imageData.startsWith('data:image/')) {
      const mimeMatch = imageData.match(/data:image\/([^;]+)/);
      if (mimeMatch) {
        mimeType = `image/${mimeMatch[1]}`;
      }
      base64Image = imageData.split(',')[1];
      console.log('📷 Detected image format:', mimeType);
      console.log('📏 Base64 image length:', base64Image.length);
    } else {
      console.log('⚠️ Image data not in data URL format, using as-is');
    }

    const systemMessage = `You are an expert engineering drawing analyst specialising in AS1100 Australian standard compliance. Focus specifically on analysing the title block elements and identify any missing or non-compliant information.`;
    
    const userMessage = `Please analyse this engineering drawing's title block for AS1100 compliance. Identify any missing elements such as title, material, scale, tolerance, surface finish, drawn by field, or date. Focus only on the title block area.

Provide your analysis in this exact JSON format with separate categories for each title block element:

{
  "overallScore": 85,
  "status": "good",
  "summary": "Brief assessment summary focussing on AS1100 title block compliance",
  "feedback": [
    {
      "category": "Title",
      "score": 80,
      "status": "good",
      "comments": "Analysis of drawing title presence and completeness"
    },
    {
      "category": "Material",
      "score": 75,
      "status": "satisfactory",
      "comments": "Analysis of material specification in title block"
    },
    {
      "category": "Scale",
      "score": 90,
      "status": "excellent",
      "comments": "Analysis of scale information presence and accuracy"
    },
    {
      "category": "Tolerance",
      "score": 60,
      "status": "needs_improvement",
      "comments": "Analysis of tolerance specification in title block"
    },
    {
      "category": "Surface Finish",
      "score": 70,
      "status": "satisfactory",
      "comments": "Analysis of surface finish requirements in title block"
    },
    {
      "category": "Drawn By",
      "score": 85,
      "status": "good",
      "comments": "Analysis of drawn by field completion"
    },
    {
      "category": "Date",
      "score": 80,
      "status": "good",
      "comments": "Analysis of date field presence and format"
    }
  ],
  "suggestions": ["AS1100 specific improvement suggestions for each missing or incomplete element"]
}`;

    const requestBody = {
      contents: [{
        parts: [
          { text: `${systemMessage}\n\n${userMessage}` },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image
            }
          }
        ]
      }]
    };

    console.log('📤 Sending request to Gemini API...');
    console.log('Request URL:', `${GEMINI_API_URL}?key=${GEMINI_API_KEY.substring(0, 10)}...`);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📄 Full API response:', data);
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log('📝 Response text:', responseText);
    
    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response:', responseText);
      throw new Error('Could not parse JSON response from Gemini');
    }

    console.log('🔍 Extracted JSON:', jsonMatch[0]);
    const analysisResult = JSON.parse(jsonMatch[0]);
    
    // Add timestamp and confidence
    analysisResult.timestamp = new Date().toLocaleString();
    analysisResult.confidence = 0.85; // Gemini confidence placeholder
    analysisResult.source = 'gemini-api';

    console.log('✅ Successfully parsed analysis result:', analysisResult);
    return analysisResult;

  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// Fallback mock analysis function (used when API is not available)
export const getMockAnalysis = (imageName) => {
  const baseResult = {
    timestamp: new Date().toLocaleString(),
    confidence: Math.random() * 0.3 + 0.7,
  };

  if (imageName && imageName.includes('PERFECT')) {
    return {
      ...baseResult,
      overallScore: 95,
      status: 'excellent',
      summary: 'This drawing meets all engineering standards and best practises.',
      feedback: [
        {
          category: 'Dimensioning',
          score: 98,
          status: 'excellent',
          comments: 'All dimensions are properly placed and clearly readable. Excellent use of dimension lines and extension lines.'
        },
        {
          category: 'Line Quality',
          score: 96,
          status: 'excellent',
          comments: 'Line weights are consistent and appropriate. Object lines are bold, hidden lines are properly dashed.'
        }
      ],
      suggestions: [
        'Consider adding a section view to better show internal features',
        'Excellent work overall - this drawing demonstrates mastery of technical drawing standards'
      ]
    };
  }

  // Default mock response
  return {
    ...baseResult,
    overallScore: 82,
    status: 'good',
    summary: 'Good drawing with minor areas for improvement.',
    feedback: [
      {
        category: 'Overall Quality',
        score: 82,
        status: 'good',
        comments: 'This is a well-executed technical drawing with good attention to detail.'
      }
    ],
    suggestions: [
      'Review dimension spacing for consistency',
      'Complete any missing title block information'
    ]
  };
};