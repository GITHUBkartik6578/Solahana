/**
 * The Financial Kundli callback request. It is the Health Check-up's lead record (same endpoint, same strict server
 * validation, no backend change) with two differences: source 'financial_kundli' and the Kundli's own consent version.
 *
 * Only the name, mobile number, the consent record and the hc-v1 score summary are sent. It is built by
 * buildLeadPayload, key by key from the score result, so no Kundli answer (no amount, goal, age or rate) can end up in it.
 */
import { buildLeadPayload, KUNDLI_CONSENT_VERSION } from '../financialHealthCheck.js';

export const KUNDLI_LEAD_SOURCE = 'financial_kundli';

export function buildKundliLead({ fullName, phone, result }) {
  const payload = buildLeadPayload({ fullName, phone, result, source: KUNDLI_LEAD_SOURCE });
  return { ...payload, consent: { callback: true, textVersion: KUNDLI_CONSENT_VERSION } };
}
