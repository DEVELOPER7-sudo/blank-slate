import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for the AI's analysis
const searchPlanSchema = z.object({
  editType: z.enum([
    'UPDATE_COMPONENT',
    'ADD_FEATURE', 
    'FIX_ISSUE',
    'UPDATE_STYLE',
    'REFACTOR',
    'ADD_DEPENDENCY',
    'REMOVE_ELEMENT'
  ]).describe('The type of edit being requested'),
  
  reasoning: z.string().describe('Explanation of the search strategy'),
  
  searchTerms: z.array(z.string()).describe('Specific text to search for'),
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, manifest } = await request.json();

    console.log('[analyze-edit-intent] Puter API - Analyzing intent');
    console.log('[analyze-edit-intent] - prompt:', prompt);

    // Use Puter API to analyze the edit intent
    const analysisPrompt = `Analyze this user request and determine what type of edit is needed: "${prompt}"
    
    Respond with JSON containing:
    - editType: One of UPDATE_COMPONENT, ADD_FEATURE, FIX_ISSUE, UPDATE_STYLE, REFACTOR, ADD_DEPENDENCY, REMOVE_ELEMENT
    - reasoning: Brief explanation
    - searchTerms: Array of terms to search for in the code`;

    const response = await fetch('https://puter.com/api/v1/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: analysisPrompt,
        model: 'gpt-5-nano',
      }),
    });

    if (!response.ok) {
      throw new Error(`Puter API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.response || data.text || '{}';

    // Try to parse JSON from response
    let result;
    try {
      // Extract JSON from response if it contains extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
      result = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback structure
      result = {
        editType: 'UPDATE_COMPONENT',
        reasoning: responseText,
        searchTerms: []
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[analyze-edit-intent] Error:', error);
    return NextResponse.json(
      { 
        editType: 'UPDATE_COMPONENT',
        reasoning: 'Error analyzing intent',
        searchTerms: []
      },
      { status: 500 }
    );
  }
}
