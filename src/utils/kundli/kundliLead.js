/**
 * The Financial Health Check-up callback request: the existing lead record (same endpoint, same strict server validation,
 * no backend change) with the approved Health Check-up consent (hc-consent-v1, which the live server already accepts) and
 * its own source, so these leads can be told apart from the earlier 3-step check-up ('financial_health_checkup').
 *
 * Only the name, mobile number, the consent record and the hc-v1 score summary are sent. It is built by
 * buildLeadPayload, key by key from the score result, so no Kundli answer (no amount, goal, age or rate) can end up in it.
 */
import { buildLeadPayload, CONSENT_VERSION } from '../financialHealthCheck.js';

export const KUNDLI_LEAD_SOURCE = 'financial_health_checkup_full';

export function buildKundliLead({ fullName, phone, result }) {
  const payload = buildLeadPayload({ fullName, phone, result, source: KUNDLI_LEAD_SOURCE });
  return { ...payload, consent: { callback: true, textVersion: CONSENT_VERSION } };
}
