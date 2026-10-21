import React from 'react';

/** Short risk / assumption note shown at the end of a calculator's results. Plain text, existing colour tokens. */
export default function CalculatorDisclaimer({ notes }) {
  const lines = (Array.isArray(notes) ? notes : [notes]).filter(Boolean);
  if (lines.length === 0) return null;
  return (
    <div role="note" aria-label="Assumptions and risk" className="pt-3 border-t border-[#E4E8F0] space-y-1.5 text-left">
      {lines.map((line) => (
        <p key={line} className="text-[11px] leading-relaxed text-[#64748B]">{line}</p>
      ))}
    </div>
  );
}
