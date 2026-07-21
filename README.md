# Procelligence AI Website

Responsive static website focused on **Agentic AI for Computational Science & Engineering Intelligence**, now including a live website chatbot.

## Main files

- `index.html` — site content and chatbot interface
- `styles.css` — site and chatbot styling
- `script.js` — navigation, animations, and chatbot client logic
- `api/chat.js` — secure Vercel serverless chatbot endpoint
- `images/AgenticAI.png` — ReActOR framework visual

## Chatbot configuration on Vercel

Add these environment variables in the Vercel project:

- `OPENAI_API_KEY` — required; keep it server-side only
- `OPENAI_MODEL` — optional; defaults to `gpt-4.1-mini`

Then redeploy the project. Never put the API key in `index.html`, `script.js`, or other browser-delivered files.

## Local preview

The visual interface can be previewed locally, but live AI responses require either Vercel deployment or a local server capable of running the `/api/chat` function.
