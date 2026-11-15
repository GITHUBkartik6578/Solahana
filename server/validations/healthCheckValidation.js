import { z } from 'zod';
// The scoring rules, the allowed consent texts and the score-consistency check live in one shared pure module
// (plain ESM, no imports besides a sibling helper), so the server cannot drift from what the browser calculated.
import { CONSENT_TEXTS, SCORING_VERSION, BAND_IDS, checkLeadResult, isValidMobile, normalizePhone } from '../../src/utils/financialHealthCheck.js';

const points = (message) => z.number({ error: message }).int({ error: message });

/**
 * A callback request from the Financial Health Check-up. Strict at every level: any key that is not listed here (an
 * income, a savings figure, an answer...) is rejected, so financial amounts cannot be stored by accident even if a
 * client sends them. The score is calculated in the browser; the server can only check that the submitted numbers agree
 * with each other (allowed point values, applicable maximum, earned total, normalisation, band). It cannot verify the
 * figures the person typed, because they never reach the server.
 */
export const submitHealthCheckSchema = z.strictObject({
  fullName: z
    .string({ error: 'Please enter your name.' })
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'Name is too long.'),
  phone: z
    .string({ error: 'Please enter a valid 10-digit mobile number.' })
    .transform(normalizePhone)
    .refine(isValidMobile, 'Please enter a valid 10-digit mobile number.'),
  source: z.string().trim().max(40).optional(),
  consent: z.strictObject(
    {
      callback: z.literal(true, { error: 'Please tick the consent box to request a callback.' }),
      textVersion: z
        .string({ error: 'Unknown consent text version.' })
        .refine((v) => Object.hasOwn(CONSENT_TEXTS, v), 'Unknown consent text version.'),
    },
    { error: 'Please tick the consent box to request a callback.' }
  ),
  result: z
    .strictObject(
      {
        scoringVersion: z.literal(SCORING_VERSION, { error: 'Unknown scoring version.' }),
        shieldingApplicable: z.boolean({ error: 'Applicability flags must be true or false.' }),
        emergencyMeasurable: z.boolean({ error: 'Applicability flags must be true or false.' }),
        points: z.strictObject(
          {
            emi: points('Invalid category points.'),
            term: points('Invalid category points.'),
            emergency: points('Invalid category points.').nullable(),
            investment: points('Invalid category points.'),
            health: points('Invalid category points.'),
            overlap: points('Invalid category points.'),
            shielding: points('Invalid category points.').nullable(),
          },
          { error: 'Invalid category points.' }
        ),
        earned: points('Invalid earned points.'),
        applicable: points('Invalid applicable maximum.'),
        score: points('Invalid score.'),
        band: z.enum(BAND_IDS, { error: 'Invalid band.' }),
      },
      { error: 'Invalid result.' }
    )
    .superRefine((value, ctx) => {
      checkLeadResult(value).forEach((message) => ctx.addIssue({ code: 'custom', message }));
    }),
});
