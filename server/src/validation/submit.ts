import { z } from 'zod'

export const ResponsePayload = z.object({
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
})

type ResponsePayloadType = z.infer<typeof ResponsePayload>

export type { ResponsePayloadType }
