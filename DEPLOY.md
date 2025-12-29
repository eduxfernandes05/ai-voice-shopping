# Deployment Guide

## Pre-requisites
- Node.js 18+ installed
- Azure OpenAI API access (optional for AI features)
- Git installed

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Azure OpenAI credentials in `.env`:
```env
VITE_AZURE_OPENAI_ENDPOINT=your_endpoint
VITE_AZURE_OPENAI_API_KEY=your_key
VITE_AZURE_OPENAI_DEPLOYMENT=your_deployment
VITE_AZURE_REALTIME_ENDPOINT=your_realtime_endpoint
VITE_AZURE_REALTIME_API_KEY=your_realtime_key
VITE_AZURE_REALTIME_DEPLOYMENT=gpt-realtime
```

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5000`

## Production Build

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

## Deploy to Netlify

1. Build the project: `npm run build`
2. Upload `dist/` folder to Netlify
3. Add environment variables in Netlify dashboard

## Deploy to GitHub Pages

1. Update `vite.config.ts` with your repo name:
```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

2. Build and deploy:
```bash
npm run build
npx gh-pages -d dist
```

## Important Notes

- AI features require valid Azure OpenAI credentials
- The app works without AI, but voice and chat assistants won't function
- Make sure to add `.env` to `.gitignore` (already configured)
- Never commit your API keys to version control
