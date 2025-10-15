import express from 'express'
import { Response, Request } from 'express'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
// import { withTransaction } from '../services/db' // Désactivé pour simplifier
import { ResponsePayload } from '../validation/submit'

// Charger les variables d'environnement
dotenv.config()

const router = express.Router()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || ''

// Debug des variables d'environnement
console.log('SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'MISSING')
console.log('SUPABASE_SERVICE_ROLE:', SUPABASE_SERVICE_ROLE ? 'SET' : 'MISSING')

let supabase: ReturnType<typeof createClient> | null = null
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE) {
  // Initialize server-side Supabase client only if service role key is available
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })
  console.log('✅ Supabase client initialized successfully')
} else {
  console.warn('❌ Server Supabase client not initialized: SUPABASE_SERVICE_ROLE missing. Falling back to direct DB when possible.')
}

// helper to find question id by code using a pg client
async function getQuestionIdByCode(client: any, code: string): Promise<string | null> {
  const q = await client.query('SELECT id FROM questions WHERE code = $1 LIMIT 1', [code])
  return q.rows?.[0]?.id ?? null
}

// helper to find option id by question id + option code using a pg client
async function getOptionIdByCode(client: any, question_id: string, option_code: string): Promise<string | null> {
  const q = await client.query('SELECT id FROM question_options WHERE question_id = $1 AND code = $2 LIMIT 1', [question_id, option_code])
  return q.rows?.[0]?.id ?? null
}

// helper to find respondent by email (lowercased) or whatsapp
async function findRespondentByEmailOrWhatsapp(client: any, email: string | null, whatsapp: string | null): Promise<string | null> {
  if (email) {
    const q = await client.query('SELECT id FROM respondents WHERE lower(email) = lower($1) LIMIT 1', [email])
    if (q.rows?.[0]?.id) return q.rows[0].id
  }
  if (whatsapp) {
    const q2 = await client.query('SELECT id FROM respondents WHERE whatsapp = $1 LIMIT 1', [whatsapp])
    if (q2.rows?.[0]?.id) return q2.rows[0].id
  }
  return null
}

// POST /submit
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = ResponsePayload.parse(req.body)

    // Basic sanitization and normalization
    const respondent = {
      email: parsed.respondent.email ? parsed.respondent.email.toLowerCase().trim() : null,
      whatsapp: parsed.respondent.whatsapp ? parsed.respondent.whatsapp.trim() : null,
      user_type: parsed.respondent.user_type ?? null,
      origin: parsed.respondent.origin ?? null,
      destination: parsed.respondent.destination ?? null,
      metadata: parsed.respondent.metadata ?? null
    }

    // Utilisation de Supabase uniquement
    if (!supabase) throw new Error('Supabase service role client not configured on server')

    const { data: respondentRow, error: rErr } = await (supabase as any)
      .from('respondents')
      .insert([respondent])
      .select('id')
      .maybeSingle()
    if (rErr) throw rErr

    const respondent_id = (respondentRow as any)?.id
    if (!respondent_id) throw new Error('Failed to create respondent')

    for (const r of parsed.responses) {
  const questionQuery = await supabase.from('questions').select('id').eq('code', r.question_code).limit(1).maybeSingle()
  const question_id = (questionQuery.data as any)?.id
      if (!question_id) continue

      let option_id = null
      if (r.option_code) {
        const optQuery = await supabase.from('question_options').select('id').eq('question_id', question_id).eq('code', r.option_code).limit(1).maybeSingle()
        option_id = (optQuery.data as any)?.id ?? null
      }

      const insert: any = {
        respondent_id,
        question_id,
        answer_text: r.answer_text ?? null,
        answer_number: r.answer_number ?? null,
        answer_bool: r.answer_bool ?? null,
        answer_json: r.answer_json ?? null,
        option_id
      }

      // Supabase upsert uses .upsert(rows, { onConflict }) where onConflict is a string or array
  await (supabase as any).from('responses').upsert([insert], { onConflict: 'respondent_id,question_id' })
    }

    return res.status(201).json({ ok: true, respondent_id })
  } catch (err: any) {
    console.error('submit error', err)
    return res.status(400).json({ error: err.message || String(err) })
  }
})

export default router
