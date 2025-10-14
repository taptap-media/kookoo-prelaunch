/*
  Example Node + TypeScript endpoint to validate and insert survey submissions
  Uses the Supabase service role key (server-only). This is a minimal example.

  Usage:
  - Install: npm install @supabase/supabase-js express zod
  - Run: node dist/submit.js (after building TypeScript)

  SECURITY: Keep SUPABASE_SERVICE_ROLE secret on server. Do not expose to clients.
*/

import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const app = express();
app.use(bodyParser.json());

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false }
});

// Minimal validation schema for incoming payload
const ResponsePayload = z.object({
  respondent: z.object({
    email: z.string().email().optional(),
    whatsapp: z.string().optional(),
    user_type: z.enum(['passenger','cargo','partner']).optional(),
    origin: z.string().optional(),
    destination: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional()
  }),
  responses: z.array(z.object({
    question_code: z.string(),
    answer_text: z.string().optional(),
    answer_number: z.number().optional(),
    answer_bool: z.boolean().optional(),
    answer_json: z.any().optional(),
    option_code: z.string().optional(),
    reference_table: z.string().optional(),
    reference_id: z.string().optional()
  }))
});

// Helper: find question by code
async function getQuestionByCode(code: string) {
  const { data, error } = await supabase
    .from('questions')
    .select('id')
    .eq('code', code)
    .limit(1)
    .single();
  if (error) throw error;
  return data?.id as string | undefined;
}

app.post('/submit', async (req, res) => {
  try {
    const parsed = ResponsePayload.parse(req.body);

    // Insert respondent
    const { data: respondent, error: rErr } = await supabase
      .from('respondents')
      .insert([{ ...parsed.respondent }])
      .select('*')
      .single();
    if (rErr) throw rErr;

    const respondent_id = respondent.id;

    // Insert responses in a transaction
    const toInsert: any[] = [];

    for (const r of parsed.responses) {
      const question_id = await getQuestionByCode(r.question_code);
      if (!question_id) {
        // skip unknown question_code or log
        console.warn('Unknown question code', r.question_code);
        continue;
      }

      const row: any = {
        respondent_id,
        question_id,
        answer_text: r.answer_text ?? null,
        answer_number: r.answer_number ?? null,
        answer_bool: r.answer_bool ?? null,
        answer_json: r.answer_json ? JSON.stringify(r.answer_json) : null
      };

      toInsert.push(row);
    }

    if (toInsert.length > 0) {
      const { error: insErr } = await supabase.from('responses').insert(toInsert);
      if (insErr) throw insErr;
    }

    return res.status(201).json({ ok: true, respondent_id });
  } catch (err: any) {
    console.error('submit error', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(PORT, () => console.log(`Submit API listening on ${PORT}`));

export default app;
