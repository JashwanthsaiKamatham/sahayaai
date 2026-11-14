# SahayaAI - Vernacular Rural Welfare & Scheme Accessibility Platform
Light theme, mobile-first, Telugu/English/Kannada/Hindi, voice in/out, Gemini AI eligibility + document checklist.
## Run locally
Backend: cd server && npm install && cp .env.example .env && npm run dev (port 5000)
Frontend: cd client && npm install && npm run dev (port 5173)
Demo works WITHOUT keys (in-memory demo DB + smart local AI fallback). Add Supabase/Gemini keys for production.

## Live Architecture
Frontend (Vercel) -> Backend (Render) -> Supabase Postgres + Google Gemini (gemini-3.8-flash, backend only)
Demo login: demo@example.com / demo1234
