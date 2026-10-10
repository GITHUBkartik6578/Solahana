import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Phone, MessageCircle, CalendarCheck, Clock, MapPin, RotateCcw } from 'lucide-react';

import { EXPERTS } from '../data/experts';
import { scrollToConsultation } from '../utils/consultation';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const EXPERIENCE_FILTERS = [
  { id: 'gt10', label: 'Above 10 Years', test: (y) => y > 10 },
  { id: '5to10', label: 'Between 5 to 10 Years', test: (y) => y >= 5 && y <= 10 },
  { id: '2to4', label: 'Between 2 to 4 Years', test: (y) => y >= 2 && y < 5 },
  { id: 'lt2', label: 'Below 2 Years', test: (y) => y < 2 },
];

function Stat({ label, children }) {
  return (
    <div className="flex-1 px-2 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">{label}</p>
      <div style={serif} className="mt-1 text-[15px] font-bold text-[#0F1F45]">{children}</div>
    </div>
  );
}

function ExpertListCard({ expert, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group flex w-full cursor-pointer items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,31,69,0.12)] ${
        active ? 'border-[#C9922E] shadow-[0_14px_30px_rgba(201,146,46,0.22)] ring-1 ring-[#C9922E]/50' : 'border-[#E7DFCF]'
      }`}
    >
      <img src={expert.avatar} alt="" draggable="false" className="h-[76px] w-[76px] shrink-0 rounded-full object-cover ring-2 ring-[#C9922E]/60" />
      <div className="min-w-0 flex-1">
        <p style={serif} className="text-[17px] font-bold leading-tight text-[#0F1F45]">{expert.name}</p>
        <p className="mt-0.5 text-[12.5px] font-medium leading-snug text-[#475569]">
          {[expert.role, ...(expert.qualifications || []).slice(1)].join(', ')}
        </p>
        <span className="my-2 block h-px w-full bg-[#E7DFCF]" />
        <div className="flex items-center text-[12px]">
          <div className="pr-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#64748B]">Experience</p>
            <p className="font-bold text-[#0F1F45]">{expert.years}+ Years</p>
          </div>
          {expert.location && (
            <div className="border-l border-[#E7DFCF] pl-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[#64748B]">Location</p>
              <p className="font-bold text-[#0F1F45]">{expert.location}</p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function ExpertDetail({ expert }) {
  return (
    <motion.aside
      key={expert.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-3xl border border-[#E7DFCF] bg-white shadow-[0_20px_50px_rgba(15,31,69,0.12)]"
      aria-label={`${expert.name} details`}
    >
      <div className="h-1.5 bg-gradient-to-r from-[#E6C27A] via-[#C9922E] to-[#A67C2E]" />
      <div className="p-5 text-center sm:p-6">
        <img src={expert.avatar} alt={expert.photoAlt} draggable="false" className="mx-auto h-[88px] w-[88px] rounded-full object-cover ring-4 ring-[#C9922E]/40" />
        <h2 style={serif} className="mt-2 text-[22px] font-bold leading-tight text-[#0F1F45]">{expert.name}</h2>
        <p className="mt-1 text-[13px] font-medium text-[#475569]">{expert.credential || expert.role}</p>
        {expert.qualifications && expert.qualifications.length > 1 && (
          <p className="mt-0.5 text-[12.5px] text-[#64748B]">{expert.qualifications.slice(1).join(' | ')}</p>
        )}

        <div className="mt-4 flex items-stretch divide-x divide-[#E7DFCF] border-y border-[#E7DFCF] py-3">
          <Stat label="Experience">{expert.years}+ Years</Stat>
          {expert.location && <Stat label="Location">{expert.location}</Stat>}
          <Stat label="Planning areas">{expert.expertise.length}</Stat>
        </div>

        {expert.summary && (
          <>
            <h3 className="mt-4 text-[13px] font-bold uppercase tracking-[0.18em] text-[#0F1F45]">About Me</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#475569]">{expert.summary}</p>
          </>
        )}

        <h3 className="mt-4 text-[13px] font-bold uppercase tracking-[0.18em] text-[#0F1F45]">Areas of Expertise</h3>
        <ul className="mt-2.5 flex flex-wrap justify-center gap-2">
          {expert.expertise.map((a) => (
            <li key={a.label}>
              <Link
                to={a.to}
                className="inline-flex rounded-full border border-[#C9922E]/50 bg-[#FEFDF9] px-3 py-1 text-[12px] font-semibold text-[#0F1F45] transition-colors hover:bg-[#0F1F45] hover:text-white"
              >
                {a.label}
              </Link>
            </li>
          ))}
        </ul>

        {expert.hours && (
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-[#64748B]">
            <Clock className="h-3.5 w-3.5 text-[#C9922E]" />
            Available {expert.hours}
          </p>
        )}

        {(expert.phoneTel || expert.whatsapp) && (
          <>
            <div className={`mt-3 grid gap-2.5 ${expert.phoneTel && expert.whatsapp ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {expert.phoneTel && (
                <a
                  href={expert.phoneTel}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0F1F45] px-4 py-2.5 text-[13px] font-bold text-[#0F1F45] transition-colors hover:bg-[#0F1F45] hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              )}
              {expert.whatsapp && (
                <a
                  href={expert.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600 px-4 py-2.5 text-[13px] font-bold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
            </div>
            {expert.phoneDisplay && <p className="mt-2 text-[12px] font-semibold text-[#475569]">{expert.phoneDisplay}</p>}
          </>
        )}

        <button
          type="button"
          onClick={() => scrollToConsultation()}
          className={`${expert.phoneTel || expert.whatsapp ? 'mt-3' : 'mt-5'} inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0F1F45] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_26px_rgba(15,31,69,0.3)] transition-all hover:bg-[#1A3170]`}
        >
          <CalendarCheck className="h-4 w-4" />
          Book Appointment
        </button>
      </div>
    </motion.aside>
  );
}

export default function OurExpertsPage() {
  const [query, setQuery] = useState('');
  const [exp, setExp] = useState([]);
  const [selectedId, setSelectedId] = useState(EXPERTS[0].id);

  const toggleExp = (id) => setExp((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const reset = () => { setQuery(''); setExp([]); };

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tests = EXPERIENCE_FILTERS.filter((f) => exp.includes(f.id));
    return EXPERTS.filter((e) => {
      const hay = [e.name, e.credential, e.role, e.location, ...(e.qualifications || []), ...(e.expertise || []).map((a) => a.label)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return (!q || hay.includes(q)) && (!tests.length || tests.some((f) => f.test(e.years)));
    });
  }, [query, exp]);

  const selected = list.find((e) => e.id === selectedId) || list[0];
  const hasFilters = query || exp.length > 0;

  return (
    <div className="relative z-10 min-h-screen bg-[#F7F8FB] pt-[80px]">
      <h1 className="sr-only">Our Experts at SOLAHANA</h1>

      {/* heading + search */}
      <section className="border-b border-[#E7DFCF] bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:gap-10 lg:px-8">
          <div>
            <p style={serif} className="text-[26px] font-bold leading-tight text-[#0F1F45] sm:text-[30px]">
              Book Your Appointment with <span className="text-[#B8862B]">Expert</span> Now
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[#475569]">
              We have {EXPERTS.length} Solahana Wealth {EXPERTS.length === 1 ? 'Expert' : 'Experts'} to serve your needs
            </p>
          </div>
          <label className="relative block w-full md:max-w-md">
            <span className="sr-only">Search experts</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, qualification or planning area"
              className="w-full rounded-full border border-[#D9E2F3] bg-[#F7F8FB] py-2.5 pl-11 pr-4 text-sm text-[#0F1F45] outline-none transition-all focus:border-[#C9922E] focus:bg-white focus:ring-2 focus:ring-[#C9922E]/20"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[210px_minmax(0,1fr)_420px] lg:px-8" aria-label="Our experts">
        {/* filters */}
        <aside className="lg:pt-1" aria-label="Filters">
          <div className="flex items-center justify-between">
            <h2 style={serif} className="text-[18px] font-bold text-[#0F1F45]">Filters</h2>
            <button
              type="button"
              onClick={reset}
              disabled={!hasFilters}
              className="inline-flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-[#64748B] transition-colors enabled:hover:text-[#B8862B] disabled:cursor-default disabled:opacity-50"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </button>
          </div>

          <fieldset className="mt-5">
            <legend className="text-[14px] font-bold text-[#0F1F45]">Experience</legend>
            <div className="mt-3 flex flex-row flex-wrap gap-x-5 gap-y-2.5 lg:flex-col">
              {EXPERIENCE_FILTERS.map((f) => (
                <label key={f.id} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#475569]">
                  <input
                    type="checkbox"
                    checked={exp.includes(f.id)}
                    onChange={() => toggleExp(f.id)}
                    className="h-4 w-4 rounded border-[#C9922E] text-[#C9922E] focus:ring-[#C9922E]"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </fieldset>
        </aside>

        {/* expert list */}
        <div>
          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D9B56A] bg-white p-8 text-center">
              <p style={serif} className="text-[18px] font-bold text-[#0F1F45]">No expert matches these filters</p>
              <p className="mt-1 text-sm text-[#475569]">Try a different search, or book a free call and we will connect you with the right person.</p>
              <button type="button" onClick={reset} className="mt-4 cursor-pointer rounded-full border border-[#0F1F45] px-5 py-2 text-sm font-semibold text-[#0F1F45] hover:bg-[#0F1F45] hover:text-white">
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {list.map((e) => (
                <ExpertListCard key={e.id} expert={e} active={selected && selected.id === e.id} onSelect={() => setSelectedId(e.id)} />
              ))}
            </div>
          )}
          <p className="mt-5 flex items-center gap-1.5 text-[12.5px] text-[#64748B]">
            <MapPin className="h-3.5 w-3.5 text-[#C9922E]" />
            Meet in person at our Andheri West office in Mumbai, or talk online from anywhere.
          </p>
        </div>

        {/* selected expert */}
        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100svh-112px)] lg:self-start lg:overflow-y-auto lg:rounded-3xl lg:[scrollbar-width:thin]">{selected && <ExpertDetail expert={selected} />}</div>
      </section>
    </div>
  );
}
