// Single source of truth for "book a consultation" behaviour across the site.
// The consultation form (GlobalConsultationSection) is rendered at the bottom of every public page.
export const CONSULT_SECTION_ID = 'global-consultation-section';
export const CONSULT_HASH = '#book';

/**
 * Smooth-scrolls to the consultation form on the current page and puts the cursor
 * in the first field so the visitor can start typing straight away.
 * Returns false when the form isn't on this page (e.g. dashboard, login).
 */
export function scrollToConsultation({ focus = true } = {}) {
  const section = document.getElementById(CONSULT_SECTION_ID);
  if (!section) return false;

  // Aim at the form card itself (on mobile it sits below the intro copy), leaving room for the fixed navbar.
  const form = section.querySelector('form');
  const target = (form && form.closest('.rounded-3xl')) || form || section;
  const NAVBAR_OFFSET = 96;
  const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

  if (focus) {
    window.setTimeout(() => {
      const field = section.querySelector('input:not([type="checkbox"]):not([type="hidden"]), textarea');
      if (field) field.focus({ preventScroll: true });
    }, 700);
  }
  return true;
}
