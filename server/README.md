# KooKoo Submit API

This service provides a secure server-side endpoint to accept survey submissions and write them to your Supabase/Postgres database using the service_role key.

Quickstart

1. Copy environment variables:
   cp .env.example .env
   Fill in SUPABASE_SERVICE_ROLE, SUPABASE_URL and/or DATABASE_URL.

2. Install dependencies (server root):
   npm install

3. Development:
   npm run dev

4. Build & Run (production):
   npm run build
   npm start

Notes
- The service prefers using DATABASE_URL + direct pg transactions for stronger transactional guarantees. If DATABASE_URL is not provided, it falls back to using the Supabase service_role client for writes.
- Keep SUPABASE_SERVICE_ROLE secret. Do not commit it or expose in frontend code.
