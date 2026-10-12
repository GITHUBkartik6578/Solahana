import { z } from 'zod';
// Single source of truth shared with the chatbot UI: the limits, HLV maths and diagnostic questions
// live in src/utils. They are plain ESM with no imports, and Render deploys the whole repo
// (render.yaml has no rootDir), so the server can import them directly instead of keeping a copy
// that could drift.
import { calculateHlv, validateHlvInputs } from '../../src/utils/hlvCalculator.js';
import { DIAGNOSTIC_QUESTIONS, evaluateDiagnostic } from '../../src/utils/healthDiagnostic.js';

/**
 * HLV inputs: numbers only (strings are rejected, never coerced), no unknown keys.
 * Range rules come from validateHlvInputs, so the server cannot be looser than the chatbot.
 * On success the parsed value is { inputs, need, gap }, recomputed here. A client-sent result is never trusted
 * (and is rejected as an unknown key).
 */
export const hlvInputsSchema = z
  .strictObject({
    monthlyExpenses: z.number({ error: 'Monthly expenses must be a number.' }),
    liabilities: z.number({ error: 'Liabilities must be a number.' }),
    existingCover: z.number({ error: 'Existing cover must be a number.' }),
    years: z.number({ error: 'Years must be a number.' }),
  })
  .superRefine((value, ctx) => {
    const check = validateHlvInputs(value);
    if (check.ok) return;
    Object.entries(check.errors).forEach(([field, message]) => ctx.addIssue({ code: 'custom', path: [field], message }));
  })
  .transform((value) => {
    const { need, gap, monthlyExpenses, liabilities, existingCover, years } = calculateHlv(value);
    return { inputs: { monthlyExpenses, liabilities, existingCover, years }, need, gap };
  });

/**
 * Diagnostic answers: exactly one value per question, each one of that question's offered options, no extra keys.
 * On success the parsed value is { answers, result }, with the result evaluated here.
 */
export const diagnosticAnswersSchema = z
  .strictObject(
    Object.fromEntries(
      DIAGNOSTIC_QUESTIONS.map((q) => [
        q.id,
        z.enum(
          q.options.map((o) => o.value),
          { error: `Please choose one of the offered answers for "${q.id}".` }
        ),
      ])
    )
  )
  .transform((answers) => ({ answers: { ...answers }, result: evaluateDiagnostic(answers) }));
