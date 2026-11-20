import React, { useRef, useState } from 'react';
import { Download, FolderOpen } from 'lucide-react';
import { GROWTH } from '../../utils/kundli/kundliCopy';
import { buildKundliFile, fileNameFor, MAX_FILE_BYTES, parseKundliFile, FILE_ERRORS } from '../../utils/kundli/kundliHistory';
import { shortDate } from '../../utils/kundli/kundliDates';

/**
 * "Load my previous Kundli": reads the customer's own file in this browser. Nothing is uploaded anywhere.
 * After a good file, the customer chooses to start from the latest saved answers or from empty answers; either way the
 * saved Kundlis are kept for the growth charts.
 */
export function LoadKundliFile({ history, onLoaded, onUseLatest, onStartEmpty }) {
  const input = useRef(null);
  const [error, setError] = useState('');
  const read = async (file) => {
    setError('');
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError(FILE_ERRORS.tooBig);
      return;
    }
    const parsed = parseKundliFile(await file.text());
    if (!parsed.ok) setError(parsed.error);
    else onLoaded(parsed.history);
  };
  const latest = history.length ? history[history.length - 1] : null;
  return (
    <div className="mt-8 rounded-2xl border border-[#E4E8F0] bg-white p-5">
      {latest ? (
        <>
          <p className="text-[14.5px] font-semibold text-[#0F1F45]">{GROWTH.loaded(history.length, shortDate(latest.date))}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onUseLatest}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-6 text-[14.5px] font-bold text-white"
            >
              {GROWTH.useLatest}
            </button>
            <button type="button" onClick={onStartEmpty} className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-[#E4E8F0] bg-white px-6 text-[14.5px] font-semibold text-[#0F1F45] hover:border-[#2F5BC7]/50">
              {GROWTH.startEmpty}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-[14px] text-[#475569]">{GROWTH.loadNote}</p>
          <input
            ref={input}
            id="kundli-file"
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={(e) => {
              read(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          <label
            htmlFor="kundli-file"
            className="mt-3 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl border border-[#2F5BC7]/40 bg-[#EEF2FB] px-5 text-[14.5px] font-semibold text-[#1A3170] focus-within:ring-2 focus-within:ring-[#2F5BC7]/40 hover:border-[#2F5BC7]"
          >
            <FolderOpen className="h-4 w-4" aria-hidden="true" />
            {GROWTH.load}
          </label>
        </>
      )}
      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13.5px] text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

/** "Save my Kundli (file)": downloads the customer's file (earlier Kundlis + today's) to their device. */
export function SaveKundliFile({ history, answers }) {
  const [saved, setSaved] = useState(false);
  const save = () => {
    const blob = new Blob([buildKundliFile(history, answers)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileNameFor();
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
  };
  return (
    <div className="kundli-noprint">
      <button
        type="button"
        onClick={save}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#2F5BC7]/40 bg-[#EEF2FB] px-5 text-[14px] font-semibold text-[#1A3170] hover:border-[#2F5BC7]"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {GROWTH.save}
      </button>
      <p className="mt-1.5 max-w-[420px] text-[12px] leading-relaxed text-[#5B6B84]" aria-live="polite">
        {saved ? GROWTH.saved : GROWTH.saveNote}
      </p>
    </div>
  );
}
