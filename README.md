# Shinjitsu Menu — Japanese Menu Safety Scanner

Religion & allergy-aware menu scanner for tourists in Japan. Photograph a Japanese restaurant menu and get per-dish safety verdicts based on your dietary profile.

## Features

- **Multi-profile scanning**: Halal, Kosher, Hindu Vegetarian, Hindu Non-Veg (no beef), Jain, Vegan, and common allergens (egg, dairy, shellfish, peanut, gluten)
- **Real reasoning**: LLM-powered analysis that understands Japanese cuisine conventions, not just keyword matching
- **Instant re-scoring**: Toggle between profiles on the same scanned menu to see different verdicts
- **Staff questions**: For uncertain dishes, generates Japanese questions you can show restaurant staff

## Setup

### Environment Variables

Create a `.env` file in the server directory:

```
QWEN_API_KEY=
QWEN_API_URL=https://home.qwencloud.com/api-keys
QWEN_MODEL=qwen-vl-max
PORT=3001
```

### Development

```bash
# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Run both client and server
npm run dev
```

Client: http://localhost:5173
Server: http://localhost:3001

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set the `QWEN_API_KEY` environment variable in your Vercel project settings.

## Architecture

- **Client**: Vite + React, mobile-first single page app
- **Server**: Express API (local) / Vercel serverless functions (deployed)
- **Vision Model**: Qwen VL (qwen-vl-max) via DashScope API
- **Prompt Engineering**: Detailed system prompt with Japanese hidden ingredient cheatsheet and per-profile reasoning rules