import React from 'react';
import { AUDIENCES, LEVEL_NAMES, MAP_COLUMNS } from '../../data/whoWeServe';

/** Three short bars: how much attention an area usually needs at a stage. */
function Level({ value }) {
  return (
    <span className="flex justify-center gap-[3px]" role="img" aria-label={LEVEL_NAMES[value]} title={LEVEL_NAMES[value]}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={`h-2 w-[18px] rounded-full ${n <= value ? 'bg-[#C9A04F]' : 'bg-[#E6EAF2]'}`} />
      ))}
    </span>
  );
}

/**
 * Six stages x six areas of money. Clicking a row opens that stage in the guide above.
 */
export default function FocusMap({ activeId, onSelect }) {
  return (
    <section className="border-y border-[#EEF1F6] bg-[#F7F8FB] py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,2fr)] lg:gap-14 lg:px-8">
        <div className="lg:sticky lg:top-28">
          <h2 className="font-serif-luxury text-[28px] font-bold leading-tight text-[#0F1F45] [text-wrap:balance] sm:text-[34px]">
            What needs attention first, by stage
          </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'var(--grad-gold)' }} />
          <p className="mt-4 leading-relaxed text-[#475569]">
            Each stage of life puts weight on different parts of your money. Use this as a starting point, then pick a row to open that guide.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-[#5B6B84]">
            {[3, 2, 1, 0].map((v) => (
              <span key={v} className="inline-flex items-center gap-2">
                <Level value={v} />
                {LEVEL_NAMES[v]}
              </span>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-[#5B6B84]">
            General information to help you find a starting point, not a recommendation. Your own plan depends on your full situation.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#E4E8F0] bg-white shadow-[0_1px_2px_rgba(15,31,69,0.04),0_18px_44px_rgba(15,31,69,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-left sm:min-w-[640px]">
              <caption className="sr-only">How much attention each area of money usually needs at each stage of life</caption>
              <thead>
                <tr className="border-b border-[#E4E8F0]">
                  <th scope="col" className="sticky left-0 z-10 bg-white py-4 pl-5 pr-3 text-[12.5px] font-bold text-[#5B6B84] sm:pl-6">
                    Stage
                  </th>
                  {MAP_COLUMNS.map((c) => (
                    <th key={c.key} scope="col" className="px-2 py-4 text-center text-[12.5px] font-bold text-[#0F1F45]">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AUDIENCES.map((a) => {
                  const selected = a.id === activeId;
                  const Icon = a.icon;
                  return (
                    <tr
                      key={a.id}
                      onClick={() => onSelect(a.id, { scroll: true })}
                      className={`cursor-pointer border-b border-[#EEF1F6] transition-colors last:border-0 ${
                        selected ? 'bg-[#EEF2FB]' : 'hover:bg-[#F9FAFC]'
                      }`}
                    >
                      <th
                        scope="row"
                        className={`sticky left-0 z-10 py-3.5 pl-5 pr-3 sm:pl-6 ${selected ? 'bg-[#EEF2FB]' : 'bg-white'}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-2 left-0 w-[3px] rounded-r-full ${selected ? 'bg-[#2F5BC7]' : 'bg-transparent'}`}
                        />
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(a.id, { scroll: true });
                          }}
                          className={`flex items-center gap-2.5 whitespace-nowrap rounded-md text-left text-[14px] font-bold outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7] focus-visible:ring-offset-2 ${
                            selected ? 'text-[#1A3170]' : 'text-[#0F1F45]'
                          }`}
                        >
                          <Icon className={`h-4 w-4 shrink-0 ${selected ? 'text-[#2F5BC7]' : 'text-[#A67C2E]'}`} strokeWidth={2.2} />
                          <span className="sm:hidden">{a.shortLabel}</span>
                          <span className="hidden sm:inline">{a.label}</span>
                        </button>
                      </th>
                      {MAP_COLUMNS.map((c) => (
                        <td key={c.key} className="px-2 py-3.5">
                          <Level value={a.map[c.key]} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-[#EEF1F6] px-5 py-3 text-xs font-semibold text-[#5B6B84] sm:hidden">Swipe the table sideways to see all six areas.</p>
        </div>
      </div>
    </section>
  );
}
