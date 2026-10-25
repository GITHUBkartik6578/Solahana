import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as copy from '../../utils/financialHealthCheckCopy';
import {
  CATEGORY_IDS,
  CONSENT_TEXTS,
  CONSENT_VERSION,
  scoreHealthCheck,
} from '../../utils/financialHealthCheck';

const source = readFileSync(new URL('./HealthCheck.jsx', import.meta.url), 'utf8');
const base = {
  income: 10_000_000, expenses: 3_000_000, emi: 1_000_000, savings: 20_000_000,
  termCover: 1_300_000_000, healthCover: 100_000_000, investments: 2_000_000, overlap: 'yes', business: 'yes',
};

describe('HealthCheck component (source contract)', () => {
  it('keeps the section anchor and uses the 201-only service call', () => {
    expect(source).toContain('id="health-check"');
    expect(source).toContain('healthCheckService.submitCallback(payload)');
    expect(source).not.toMatch(/healthCheckService\.(start|complete)\b/);
  });
  it('starts with consent unticked and blocks submit until ticked', () => {
    expect(source).toContain('useState(false); // never pre-ticked');
    expect(source).toMatch(/if \(!consent\) next\.consent/);
    // the early return on errors comes before the network call
    expect(source.indexOf('if (Object.keys(next).length) return;')).toBeLessThan(source.indexOf('await healthCheckService'));
  });
  it('shows success only after the awaited call resolves, and shows failure otherwise', () => {
    const call = source.indexOf('await healthCheckService.submitCallback');
    const ok = source.indexOf('setSent(true)');
    expect(call).toBeGreaterThan(-1);
    expect(ok).toBeGreaterThan(call);
    expect(source.match(/setSent\(true\)/g)).toHaveLength(1);
    expect(source).toContain('catch {');
    expect(source).toContain('setSendError(CALLBACK.failure)');
  });
  it('builds the payload only through buildLeadPayload and never passes amounts to it', () => {
    const calls = source.match(/buildLeadPayload\(\{[^}]*\}\)/g) || [];
    expect(calls).toHaveLength(1);
    expect(calls[0]).toBe('buildLeadPayload({ fullName: contact.fullName, phone: contact.phone, result })');
  });
  it('does not persist or log anything', () => {
    expect(source).not.toMatch(/localStorage|sessionStorage|indexedDB|console\.|document\.cookie|gtag|dataLayer|fetch\(|axios/);
  });
  it('has no coin, mascot or Ana branding and no PlanningSlides/Hero imports', () => {
    expect(source).not.toMatch(/\bAna\b|coin|mascot|16 ?ana|₹ ?1 assessment/i);
    expect(source).not.toMatch(/PlanningSlides|HeroFintechIllustration/);
  });
  it('keeps the consultation button separate from the callback form and the privacy note on the steps', () => {
    expect(source).toContain("import { scrollToConsultation } from '../../utils/consultation'");
    expect(source).toContain('onClick={() => scrollToConsultation()}');
    expect(source.indexOf('onClick={() => scrollToConsultation()}')).toBeGreaterThan(source.lastIndexOf('</form>'));
    expect(source).toContain('{NEW_MICROCOPY.stepPrivacyNote}');
    expect(copy.NEW_MICROCOPY.notApplicablePoints).toBe('N/A');
    expect(copy.NEW_MICROCOPY.stepPrivacyNote).toMatch(/stay in your browser. They are not sent to Solahana/);
  });
  it('disables the callback button until consent is ticked', () => {
    expect(source).toContain('disabled={sending || !consent}');
  });
  it('uses no placeholders', () => {
    expect(source).not.toMatch(/placeholder=\{/);
    expect(source).not.toContain('PRIVACY_NOTE');
  });
  it('shows the exact consent text that the server version stands for', () => {
    expect(source).toContain('CONSENT_TEXTS[CONSENT_VERSION]');
    expect(CONSENT_TEXTS[CONSENT_VERSION]).toBe(CONSENT_TEXTS['hc-consent-v1']);
  });
});

describe('copy module', () => {
  it('has the approved title, steps and no banned branding', () => {
    expect(copy.HEADER.title).toBe('Solahana Financial Health Check-up');
    expect(copy.STEPS.map((s) => s.label)).toEqual([
      'Step 1 of 3: Income & expenses',
      'Step 2 of 3: Financial protection',
      'Step 3 of 3: Investing & financial discipline',
    ]);
    expect(JSON.stringify(copy)).not.toMatch(/\bAna\b|coin|mascot|payment|₹ ?1 /i);
  });
  it('explains normalisation for all four applicable maximums', () => {
    const full = scoreHealthCheck(base);
    expect(copy.normalizationNote(full)).toBe(`Score: ${full.score} out of 100 (all 100 points applied).`);
    const noBiz = scoreHealthCheck({ ...base, business: 'na' });
    expect(noBiz.applicable).toBe(95);
    expect(copy.normalizationNote(noBiz)).toContain(`out of 95 applicable points`);
    expect(copy.normalizationNote(noBiz)).toContain("Business asset shielding (not applicable: you don't own a business)");
    const noExp = scoreHealthCheck({ ...base, expenses: 0 });
    expect(noExp.applicable).toBe(80);
    expect(copy.normalizationNote(noExp)).toContain('Emergency fund (not measurable because you entered no fixed expenses)');
    const both = scoreHealthCheck({ ...base, expenses: 0, business: 'na' });
    expect(both.applicable).toBe(75);
    expect(copy.normalizationNote(both)).toMatch(/Emergency fund.*and Business asset shielding/);
  });
  it('has a band text for each band and a label and observation for every category outcome', () => {
    expect(Object.keys(copy.BANDS).sort()).toEqual(['attention', 'good', 'strong']);
    const r = scoreHealthCheck({ ...base, expenses: 0, business: 'na' });
    CATEGORY_IDS.forEach((id) => {
      expect(copy.CATEGORY_LABELS[id]).toBeTruthy();
      expect(copy.observationFor(id, r.points[id])).toBeTruthy();
    });
    expect(copy.observationFor('emergency', null)).toMatch(/^Not measurable: no fixed expenses were entered/);
    expect(copy.observationFor('shielding', null)).toMatch(/Not applicable/);
    expect(copy.observationFor('emi', 10)).toBe('Your EMIs take 30% to 45% of your income, which leaves less room for savings and surprises.');
  });
  it('states the retention period, the amounts-never-stored promise and the disclaimer', () => {
    expect(copy.CALLBACK.retention).toMatch(/24 months/);
    expect(copy.CALLBACK.retention).toMatch(/never sent to us or stored/);
    expect(copy.DISCLAIMER).toMatch(/educational self-assessment/);
    expect(copy.DISCLAIMER).toMatch(/not personalised advice/);
  });
  it('uses the approved wording exactly', () => {
    expect(copy.HEADER.subtitle).toBe("Answer three short steps about your income, protection and investing. You'll get a score out of 100 and a plain-language breakdown, with no contact details needed.");
    expect(copy.BANDS.strong.title).toBe('Strong foundation');
    expect(copy.BANDS.good.title).toBe('A good base, with gaps to close');
    expect(copy.BANDS.attention.title).toBe('Needs attention');
    expect(copy.CALLBACK.heading).toBe('Want a free callback about your result?');
    expect(copy.CALLBACK.success).toBe("Thank you. We've received your request.");
    expect(copy.CALLBACK.failure).toBe("We couldn't save your request just now. Your result is still shown above; please try again.");
    expect(copy.FIELDS.income.help).toBe('The money credited to you each month after tax and deductions. If your income varies, use the average of the last 6 to 12 months.');
    expect(copy.CHOICES.business.options.map((o) => o.label)).toEqual(['Yes', 'No or not sure', "Not applicable: I don't own a business"]);
  });
  it('lists the unapproved strings only under NEW_MICROCOPY', () => {
    expect(Object.keys(copy.NEW_MICROCOPY).sort()).toEqual(['callbackButton', 'consentError', 'consultationButton', 'emiAboveIncome', 'notApplicablePoints', 'progressLabel', 'sending', 'stepPrivacyNote']);
  });
});
