// OpenAI API integration for fine-tuned GPT model (engineering drawing analysis)

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const FINETUNED_MODEL = process.env.REACT_APP_OPENAI_MODEL;

// Test function to check API connectivity
export const testOpenAIConnection = async () => {
  console.log('🔍 Testing OpenAI API connection...');
  console.log('API Key available:', OPENAI_API_KEY ? 'Yes' : 'No');
  console.log('API Key length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);

  if (!OPENAI_API_KEY) {
    throw new Error('No API key found. Please set REACT_APP_OPENAI_API_KEY in your .env file.');
  }

  try {
    const testPayload = {
      model: FINETUNED_MODEL,
      messages: [
        {
          role: 'user',
          content: 'Say "API connection successful"'
        }
      ],
      max_tokens: 50
    };

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
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

export const analyzeDrawingWithOpenAI = async (imageData) => {
  console.log('🔍 Starting OpenAI fine-tuned model analysis...');
  console.log('API Key available:', OPENAI_API_KEY ? 'Yes' : 'No');
  console.log('Image data type:', typeof imageData);
  console.log('Image data preview:', imageData ? imageData.substring(0, 50) + '...' : 'null');

  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your .env file.');
  }

  try {
    // Prepare the image URL (OpenAI accepts both URLs and base64 data URLs)
    let imageUrl = imageData;

    // Ensure it's in data URL format
    if (!imageData.startsWith('data:image/')) {
      console.log('⚠️ Image data not in data URL format, converting...');
      imageUrl = `data:image/jpeg;base64,${imageData}`;
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
      model: FINETUNED_MODEL,
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userMessage
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    };

    console.log('📤 Sending request to OpenAI API...');
    console.log('Using model:', FINETUNED_MODEL);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📄 Full API response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const responseText = data.choices[0].message.content;
    console.log('📝 Response text:', responseText);

    // Try to extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response:', responseText);
      throw new Error('Could not parse JSON response from OpenAI');
    }

    console.log('🔍 Extracted JSON:', jsonMatch[0]);
    const analysisResult = JSON.parse(jsonMatch[0]);

    // Add timestamp and metadata
    analysisResult.timestamp = new Date().toLocaleString();
    analysisResult.confidence = 0.90; // Fine-tuned model typically has higher confidence
    analysisResult.source = 'openai-finetuned';
    analysisResult.model = FINETUNED_MODEL;

    console.log('✅ Successfully parsed analysis result:', analysisResult);
    return analysisResult;

  } catch (error) {
    console.error('❌ OpenAI API Error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};
