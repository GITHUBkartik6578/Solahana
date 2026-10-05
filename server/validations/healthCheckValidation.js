import { z } from 'zod';

// Accepts "98765 43210", "+91 98765-43210", "098765 43210" and returns the bare 10 digits.
const cleanPhone = (value) => String(value ?? '').replace(/[\s\-()]/g, '').replace(/^(\+?91|0)(?=[6-9][0-9]{9}$)/, '');

export const startHealthCheckSchema = z.object({
  fullName: z
    .string({ error: 'Please enter your name.' })
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'Name is too long.'),
  phone: z
    .string({ error: 'Please enter a valid 10-digit mobile number.' })
    .transform(cleanPhone)
    .refine((v) => /^[6-9][0-9]{9}$/.test(v), 'Please enter a valid 10-digit mobile number.'),
  source: z.string().trim().max(40).optional(),
});

export const completeHealthCheckSchema = z.object({
  token: z.string({ error: 'Missing token.' }).min(16).max(128),
  answers: z
    .array(
      z.object({
        questionId: z.string().trim().min(1).max(40),
        area: z.string().trim().max(60).optional().default(''),
        question: z.string().trim().max(300).optional().default(''),
        answer: z.string().trim().max(200).optional().default(''),
        score: z.number().int().min(0).max(2),
      })
    )
    .min(1)
    .max(12),
});
