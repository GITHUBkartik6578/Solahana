import { z } from 'zod';

export const validateNewsletter = z.object({
  email: z
    .string({ error: 'Please provide an email address' })
    .email('Please provide a valid email address'),
  source: z.string().optional(),
});
