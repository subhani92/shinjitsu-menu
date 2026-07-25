# Shinjitsu Menu — Japanese Menu Safety Scanner

Religion & allergy-aware menu scanner for tourists in Japan. Photograph a Japanese restaurant menu and get per-dish safety verdicts based on your dietary profile.

## Features

- **Multi-profile scanning**: Halal, Kosher, Hindu Vegetarian, Hindu Non-Veg (no beef), Jain, Vegan, and common allergens
- **Real reasoning**: LLM-powered analysis that understands Japanese cuisine conventions
- **Instant re-scoring**: Toggle between profiles on the same scanned menu to see different verdicts
- **Staff questions**: Generates Japanese questions with text-to-speech for restaurant staff

## Local Development

```bash
# Install dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..

# Configure API key
cp server/.env.example server/.env
# Edit server/.env and add your QWEN_API_KEY

# Run both client and server
npm run dev
```

Client: http://localhost:5173
Server: http://localhost:3001

## Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Build the client

```bash
cd client && npm run build && cd ..
```

### 3. Deploy

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** shinjitsu-menu (or your choice)
- **In which directory is your code?** `.`
- **Override settings?** No

### 4. Set Environment Variables

Go to your project on [vercel.com](https://vercel.com) → Settings → Environment Variables, then add:

| Variable | Value |
|---|---|
| `QWEN_API_KEY` | Your DashScope API key |
| `QWEN_API_URL` | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `QWEN_MODEL` | `qwen-vl-max` |

### 5. Redeploy

```bash
vercel --prod
```

## Architecture

- **Client**: Vite + React, mobile-first single page app
- **Server**: Express API (local) / Vercel serverless functions (deployed)
- **Vision Model**: Qwen VL (qwen-vl-max) via DashScope API
- **Prompts**: Japanese hidden ingredient cheatsheet + per-profile reasoning rules