Server submit API

Files added/changed:
- server/: new Express + TypeScript server with transactional writes via pg and fallback to Supabase service_role client.
- server/.env.example: server env vars
- server/package.json, tsconfig.json
- server/src/*: index.ts, routes/submit.ts, services/db.ts, validation/submit.ts
- src/services/submit.ts: frontend helper that posts to /submit
- .env.example: frontend env hints

How it works
- Frontend collects survey payload and POSTs to /submit.
- Server validates payload using Zod.
- If DATABASE_URL is present, server uses pg transactions (atomic). Otherwise it uses Supabase service_role client.
- Respondent contact info is upserted to avoid duplicates and keep idempotency.
- Responses are inserted/upserted by (respondent_id, question_id).

Security notes
- Keep SUPABASE_SERVICE_ROLE secret on the server.
- Frontend should only use the anon key for read-only ops.
- The server enforces basic sanitization and uses parameterized queries to prevent SQL injection.

# Security note (important)

If you accidentally placed `SUPABASE_SERVICE_ROLE` in `.env.local` or committed it to git, rotate the key immediately via the Supabase dashboard and remove the file from the repository. Keep the service role key in `server/.env` only. To remove and ignore the file:

```bash
# remove from git index but keep locally
git rm --cached .env.local
# add to .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "Remove .env.local from repo and ignore local env"
```

If the key was pushed to a public repo or shared, rotate the key in Supabase > Settings > API > Service Role Key.

Next steps
- Add unit tests for validation and db service.
- Expand CORS origin list for production.
- Add rate-limiting / abuse protection for the /submit endpoint.
