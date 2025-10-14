// Frontend helper to submit survey data to the server API
export interface FrontendResponseItem {
  question_code: string
  answer_text?: string
  answer_number?: number
  answer_bool?: boolean
  answer_json?: any
  option_code?: string
  reference_table?: string
  reference_id?: string
}

export interface FrontendPayload {
  respondent: {
    email?: string
    whatsapp?: string
    user_type?: 'passenger'|'cargo'|'partner'
    origin?: string
    destination?: string
    metadata?: Record<string, any>
  }
  responses: FrontendResponseItem[]
}

export async function submitSurvey(payload: FrontendPayload) {
  const res = await fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(err.error || err.message || 'Submission failed')
  }
  return res.json()
}
