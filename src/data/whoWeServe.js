/**
 * Opens the consultation form at the bottom of the page. If `consult` ({ goal, message }) is given,
 * the form is pre-filled first (listened to by GlobalConsultationSection).
 */
export function openConsultation(consult) {
  if (consult) {
    window.dispatchEvent(new CustomEvent('solahana:prefill-consultation', { detail: consult }));
  }
  const el = document.getElementById('global-consultation-section');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
