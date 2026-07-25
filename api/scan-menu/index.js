import { buildSystemPrompt } from '../server/prompts.js';

export const config = {
  maxDuration: 30,
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const QWEN_API_KEY = process.env.QWEN_API_KEY;
    const QWEN_API_URL = process.env.QWEN_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen-vl-max';

    if (!QWEN_API_KEY) {
      return new Response(JSON.stringify({ error: 'QWEN_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await req.formData();
    const imageFile = formData.get('image');
    const profilesJson = formData.get('profiles');

    if (!profilesJson) {
      return new Response(JSON.stringify({ error: 'profiles parameter required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const profiles = JSON.parse(profilesJson);

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ error: 'At least one dietary profile must be selected' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageBase64 = imageBuffer.toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';
    const imageUrl = `data:${mimeType};base64,${imageBase64}`;

    const systemPrompt = buildSystemPrompt(profiles);
    const startTime = Date.now();

    const response = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: imageUrl },
              },
              {
                type: 'text',
                text: 'Please analyze this Japanese restaurant menu and return the structured JSON array as specified in the instructions.',
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Qwen API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Vision API failed', details: errorText }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: 'No response from vision model' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let parsed;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = JSON.parse(content);
      }
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
      return new Response(JSON.stringify({ error: 'Failed to parse LLM response', raw: content }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const elapsed = Date.now() - startTime;

    return new Response(JSON.stringify({
      dishes: parsed,
      profiles,
      processingTimeMs: elapsed,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Scan error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}