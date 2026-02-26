import { getGroqClient, GROQ_MODEL, AGRICULTURAL_SYSTEM_PROMPT } from '@/lib/groq';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const { query, language = 'en' } = await request.json();

    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Query cannot be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Load farmers queries data for context
    const dataPath = join(process.cwd(), 'data', 'farmers-queries.json');
    const farmersData = JSON.parse(readFileSync(dataPath, 'utf-8'));

    // Create context from related queries
    const relatedQueries = farmersData.queries.slice(0, 3);
    const contextStr = relatedQueries
      .map(
        (q: any) =>
          `Q: ${q.query}\nA: ${q.solution}`
      )
      .join('\n\n');

    const systemMessage = `${AGRICULTURAL_SYSTEM_PROMPT}

IMPORTANT: Format your response as a concise point-wise list with 3-6 main points. Each point should be clear, practical, and actionable. Use bullet points or numbering. Keep each point brief and to the point. Avoid lengthy paragraphs.

Here are some example queries and answers for context:
${contextStr}

Respond in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : 'English'}.`;

    const groq = getGroqClient();

    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    const content = response.choices[0]?.message?.content || 'Unable to generate response';

    return new Response(JSON.stringify({ response: content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Groq API Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process query',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
