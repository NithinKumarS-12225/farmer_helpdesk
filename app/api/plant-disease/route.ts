import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, language = 'en' } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 });
    }

    console.log('[v0] Starting plant disease analysis with Llama 4 Scout...');

    try {
      // Use Llama 4 Scout model (recommended replacement for vision tasks)
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `You are an expert plant pathologist and agricultural specialist in India. Analyze this plant/leaf image and identify any diseases or health issues.

IMPORTANT: Respond ONLY with valid JSON (no other text) in this format:
{
  "disease": "Disease name or 'Healthy Plant'",
  "confidence": 0.85,
  "description": "Brief description of the condition",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "treatment": ["treatment 1", "treatment 2"],
  "prevention": ["prevention 1", "prevention 2"]
}

Be specific and accurate based on what you observe.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageBase64,
                  },
                },
              ],
            },
          ],
          temperature: 0.3,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[v0] Groq API error:', errorData);
        
        // If this model also doesn't support images, use fallback text analysis
        if (errorData.error?.message?.includes('image') || errorData.error?.message?.includes('vision')) {
          console.log('[v0] Vision not supported, using AI description analysis...');
          return getFallbackAnalysis(groqApiKey, language);
        }
        
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisContent = data.choices?.[0]?.message?.content;

      if (!analysisContent) {
        throw new Error('No content in response');
      }

      let analysis;
      try {
        analysis = JSON.parse(analysisContent);
      } catch (e) {
        const jsonMatch = analysisContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid response format');
        }
      }

      if (!analysis.disease || !Array.isArray(analysis.symptoms)) {
        throw new Error('Invalid analysis structure');
      }

      console.log('[v0] Disease detected:', analysis.disease);

      // Get detailed treatment recommendations
      const treatmentResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `You are an expert agricultural advisor from India's Ministry of Agriculture. Provide practical advice for Indian farmers in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : 'English'}.

Be specific with:
- Cost estimates in ₹
- Local remedy options
- Government schemes applicable
- Day-by-day action plan`,
            },
            {
              role: 'user',
              content: `Disease: ${analysis.disease}
Symptoms: ${analysis.symptoms.join(', ')}

Provide practical treatment and prevention advice suitable for Karnataka farmers.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      const treatmentData = await treatmentResponse.json();
      const treatmentContent = treatmentData.choices?.[0]?.message?.content;

      const enhancedAnalysis = {
        ...analysis,
        aiGeneratedTreatment: treatmentContent || '',
        analysisTimestamp: new Date().toISOString(),
        language: language,
      };

      return NextResponse.json(enhancedAnalysis);
    } catch (groqError) {
      console.error('[v0] Groq error:', groqError);
      return getFallbackAnalysis(groqApiKey, language);
    }
  } catch (error) {
    console.error('[v0] Plant disease analysis error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Analysis service temporarily unavailable',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Fallback function to provide generic analysis
async function getFallbackAnalysis(groqApiKey: string, language: string) {
  try {
    const fallbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a helpful agricultural AI assistant providing guidance to Indian farmers. Respond in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : 'English'}.`,
          },
          {
            role: 'user',
            content: `A farmer wants to diagnose their plant disease. Since direct image analysis is temporarily unavailable, provide general guidance on:
1. How to identify common plant diseases in Karnataka
2. Common symptoms to look for
3. When to contact an agricultural expert

Keep it simple and practical for farmers.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const fallbackData = await fallbackResponse.json();
    const guidanceContent = fallbackData.choices?.[0]?.message?.content;

    return NextResponse.json({
      disease: 'Analysis Service - Use Guidance',
      confidence: 0.6,
      description: 'Direct image analysis is temporarily unavailable. Follow the guidance below to diagnose your plant.',
      symptoms: ['Image upload successful', 'Please use the recommendations below'],
      treatment: ['Upload a clear, well-lit image of affected leaf', 'Include both affected and healthy parts', 'Ensure good camera focus'],
      prevention: ['Contact local Agricultural Department for precise diagnosis'],
      aiGeneratedTreatment: guidanceContent || 'Please try uploading your image again or contact your local Krishi Vigyan Kendra (KVK) for expert assistance.',
      fallbackMode: true,
      analysisTimestamp: new Date().toISOString(),
      language: language,
    });
  } catch (fallbackError) {
    console.error('[v0] Fallback also failed:', fallbackError);
    return NextResponse.json({
      disease: 'Service Temporarily Unavailable',
      confidence: 0,
      description: 'The AI plant disease analysis service is currently unavailable.',
      symptoms: ['Service error - please try again later'],
      treatment: ['Try uploading again in a few moments', 'Contact your local Agricultural Department'],
      prevention: [],
      aiGeneratedTreatment: 'For immediate assistance, please contact your nearest Krishi Vigyan Kendra (KVK) or Agricultural Extension Office in your district.',
      fallbackMode: true,
      analysisTimestamp: new Date().toISOString(),
    });
  }
}
