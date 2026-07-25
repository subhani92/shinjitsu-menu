import express from 'express';
import cors from 'cors';
import { buildSystemPrompt } from './prompts.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const QWEN_API_KEY = process.env.QWEN_API_KEY;
const QWEN_API_URL = (process.env.QWEN_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions').replace(/\/+$/, '') + '/chat/completions';
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen-vl-max';

app.post('/api/scan-menu', async (req, res) => {
  try {
    if (!QWEN_API_KEY) {
      return res.status(500).json({ error: 'QWEN_API_KEY not configured' });
    }

    const { imageBase64, profiles } = req.body;

    if (!profiles || (Array.isArray(profiles) && profiles.length === 0)) {
      return res.status(400).json({ error: 'At least one dietary profile must be selected' });
    }

    let profileList;
    if (typeof profiles === 'string') {
      try {
        profileList = JSON.parse(profiles);
      } catch {
        return res.status(400).json({ error: 'Invalid profiles format' });
      }
    } else if (Array.isArray(profiles)) {
      profileList = profiles;
    } else {
      return res.status(400).json({ error: 'profiles must be an array or JSON string' });
    }

    if (!profileList || profileList.length === 0) {
      return res.status(400).json({ error: 'At least one dietary profile must be selected' });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageUrl = `data:image/jpeg;base64,${cleanBase64}`;

    const systemPrompt = buildSystemPrompt(profileList);
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
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: imageUrl } },
              { type: 'text', text: 'Please analyze this Japanese restaurant menu and return the structured JSON array as specified in the instructions.' },
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
      return res.status(502).json({ error: 'Vision API failed', details: errorText });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: 'No response from vision model' });
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
      return res.status(502).json({ error: 'Failed to parse LLM response', raw: content });
    }

    const elapsed = Date.now() - startTime;
    console.log(`Scan completed in ${elapsed}ms for profiles: ${profileList.join(', ')}`);

    res.json({
      dishes: parsed,
      profiles: profileList,
      processingTimeMs: elapsed,
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Shinjitsu Menu server running on port ${PORT}`);
  console.log(`Qwen API: ${QWEN_API_URL}`);
  console.log(`Model: ${QWEN_MODEL}`);
});