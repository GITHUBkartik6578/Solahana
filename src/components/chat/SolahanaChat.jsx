import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Send, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import avatar from '../../assets/solahana-bot-avatar.png';
import consultationService from '../../services/consultationService';

const PHONE_DISPLAY = '+91 73044 42171';
const PHONE_TEL = 'tel:+917304442171';
const WHATSAPP = 'https://wa.me/917304442171';
const ADVISOR = 'Amit Pandey';
const ADVISOR_FIRST = 'Amit';

// WhatsApp link with the message already typed, so a lead reaches the advisor in one tap
const waLink = (text) => (text ? `${WHATSAPP}?text=${encodeURIComponent(text)}` : WHATSAPP);
const bookingSummary = (d) =>
  `Hi ${ADVISOR_FIRST}, I just booked a free consultation on the Solahana website.\n` +
  `Name: ${d.fullName}\nMobile: ${d.phone}\nEmail: ${d.email}\nInterested in: ${d.goal}\nBest time to call: ${d.preferredTime}`;
const TIME_SLOTS = ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 8 PM)'];

/* ------------------------------------------------------------------ */
/* Approved answers. Keep these general: no specific fund/product picks. */
/* ------------------------------------------------------------------ */
const MENU = [
  { label: 'What do you do?', intent: 'services' },
  { label: 'How does it work?', intent: 'process' },
  { label: 'Fees', intent: 'pricing' },
  { label: 'Book a free call', intent: 'book' },
];

const ANSWERS = {
  greet: {
    text: 'Hi! I’m the Solahana assistant. I can explain how we work, what it costs, or book a free call with an advisor for you.',
    chips: MENU,
  },
  services: {
    text: 'We look after your whole financial picture: financial planning, investments like SIPs and mutual funds, tax planning, health and term cover, retirement and estate planning. One clear plan instead of scattered products.',
    chips: [{ label: 'How does it work?', intent: 'process' }, { label: 'Who do you help?', intent: 'who' }, { label: 'Book a free call', intent: 'book' }],
  },
  process: {
    text: 'Five simple steps:\n1. A free intro call\n2. A detailed discussion of your money\n3. A review of what’s working and what isn’t\n4. Your written plan\n5. Action, and a review every year',
    chips: [{ label: 'See the full process', to: '/our-process' }, { label: 'Book a free call', intent: 'book' }],
  },
  pricing: {
    text: 'Fees depend on what you need. After a free intro call, you get a clear quote before you commit to anything.',
    chips: [{ label: 'View pricing', to: '/pricing' }, { label: 'Book a free call', intent: 'book' }],
  },
  who: {
    text: 'Salaried professionals, business owners, families, NRIs, young professionals and retirees. Most people are a mix, and we start from where you are today.',
    chips: [{ label: 'Who we serve', to: '/who-we-serve' }, { label: 'Book a free call', intent: 'book' }],
  },
  tax: {
    text: 'We plan taxes early in the year, not in a March rush: picking the old or new regime, and using 80C, 80D and NPS sensibly around your goals.',
    chips: [{ label: 'Tax planning', to: '/tax-planning' }, { label: 'Book a free call', intent: 'book', goal: 'Tax Planning' }],
  },
  invest: {
    text: 'We build goal-based SIP portfolios that match your timeline and comfort with risk, then review them regularly. Specific fund choices need your full picture, so that’s done with an advisor, not in chat.',
    chips: [{ label: 'Investments', to: '/investments' }, { label: 'Book a free call', intent: 'book', goal: 'Investment Planning' }],
  },
  retirement: {
    text: 'We work out your retirement number and plan a steady monthly income for after you stop working, keeping rising costs and medical expenses in mind.',
    chips: [{ label: 'Book a free call', intent: 'book', goal: 'Retirement Planning' }],
  },
  insurance: {
    text: 'We check whether your health and term cover is enough for your family, and whether you’re paying for cover you don’t need.',
    chips: [{ label: 'Risk management', to: '/risk-management' }, { label: 'Book a free call', intent: 'book', goal: 'Risk Management' }],
  },
  estate: {
    text: 'We help you get a clear will, correct nominees on every account, and your documents organised, so things are easy for your family later.',
    chips: [{ label: 'Estate planning', to: '/estate-planning' }, { label: 'Book a free call', intent: 'book', goal: 'Estate Planning' }],
  },
  nri: {
    text: 'Yes, we work with NRIs: setting up NRE and NRO accounts correctly, avoiding paying tax twice on the same income, and investing in India with a plan.',
    chips: [{ label: 'Book a free call', intent: 'book' }, { label: 'Talk to a person', intent: 'human' }],
  },
  human: {
    text: `You can talk to ${ADVISOR}, our advisor, directly on ${PHONE_DISPLAY}, by call or WhatsApp, Monday to Saturday, 10am to 7pm. Or I can book a free call for you right now.`,
    actions: true,
    chips: [{ label: 'Book a free call', intent: 'book' }],
  },
  regulatory: {
    text: 'For registration and regulatory details, please see our Disclosures, or ask the advisor on your call. They’ll walk you through it.',
    chips: [{ label: 'Book a free call', intent: 'book' }, { label: 'Talk to a person', intent: 'human' }],
  },
  thanks: { text: 'Happy to help! Anything else?', chips: MENU },
  fallback: {
    text: 'I don’t have a good answer for that yet. An advisor can help. Shall I book you a free call?',
    chips: [{ label: 'Book a free call', intent: 'book' }, { label: 'Talk to a person', intent: 'human' }, { label: 'Main menu', intent: 'greet' }],
  },
};

// Matching order matters: an action ("book", "talk to someone") wins, then a specific topic,
// and only then generic questions like "how does it work".
const ACTION_RULES = [
  ['book', /\b(book|call ?back|appointment|consult|schedule|meet)\b/],
  ['human', /\b(human|person|agent|advis[oe]r|speak to|talk to|contact|phone number|whatsapp)\b/],
];
const TOPIC_RULES = [
  ['tax', /\b(tax|taxes|80c|80d|nps|regime|itr|elss)\b/, 'Tax Planning'],
  ['nri', /\b(nri|nre|nro|abroad|overseas|dubai|gulf)\b/, 'Financial Planning'],
  ['retirement', /\b(retire|retirement|pension|fire)\b/, 'Retirement Planning'],
  ['insurance', /\b(insurance|term plan|term cover|health cover|mediclaim|policy|policies)\b/, 'Risk Management'],
  ['estate', /\b(will|nominee|nominees|estate|succession|inherit)\b/, 'Estate Planning'],
  ['invest', /\b(sip|sips|mutual|fund|funds|invest|investing|investment|stock|stocks|equity|portfolio|returns?)\b/, 'Investment Planning'],
  ['regulatory', /\b(sebi|amfi|regist\w*|licen\w*|regulat\w*|certified)\b/],
  ['pricing', /\b(fee|fees|price|pricing|cost|charges?|how much|free)\b/],
];
const GENERIC_RULES = [
  ['process', /\b(process|how (does|do|will)|steps?|procedure|onboard\w*)\b/],
  ['who', /\b(salaried|business|family|families|young|students?|who do you)\b/],
  ['services', /\b(what (do|can) you|services?|offer|help)\b/],
  ['thanks', /\b(thanks|thank you|thx|great|ok|okay|cool)\b/],
  ['greet', /^(hi+|hello|hey|namaste|good (morning|evening|afternoon))\b/],
];

const detect = (raw) => {
  const t = raw.toLowerCase();
  const topic = TOPIC_RULES.find(([, re]) => re.test(t));
  const action = ACTION_RULES.find(([, re]) => re.test(t));
  if (action) return { intent: action[0], goal: topic?.[2] };
  if (topic) return { intent: topic[0], goal: topic[2] };
  const generic = GENERIC_RULES.find(([, re]) => re.test(t));
  return { intent: generic ? generic[0] : 'fallback' };
};

let uid = 0;
const mid = () => `m${++uid}`;

export default function SolahanaChat() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [lead, setLead] = useState(null); // { step, goal, fullName, phone, email }
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const started = useRef(false);

  const pushBot = useCallback((payload, delay = 550) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: mid(), from: 'bot', ...payload }]);
    }, delay);
  }, []);

  const pushUser = (text) => setMessages((m) => [...m, { id: mid(), from: 'user', text }]);

  /* first open: greet */
  useEffect(() => {
    if (open && !started.current) {
      started.current = true;
      pushBot(ANSWERS.greet, 350);
    }
    if (open) {
      setTeaser(false);
      window.setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open, pushBot]);

  /* greeting teaser, once per session */
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('sol_chat_teaser') === '1'; } catch { /* storage unavailable */ }
    if (seen) return undefined;
    const t = window.setTimeout(() => {
      setTeaser(true);
      try { sessionStorage.setItem('sol_chat_teaser', '1'); } catch { /* ignore */ }
    }, 6000);
    return () => window.clearTimeout(t);
  }, []);

  /* keep the latest message in view */
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  /* Esc closes */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* ------------------------------ lead capture ------------------------------ */
  const startBooking = (goal = 'Financial Planning') => {
    setLead({ step: 'name', goal });
    pushBot({ text: 'Great, let’s book your free call. It takes under a minute. What’s your name?', hint: 'lead' });
  };

  const cancelBooking = () => {
    setLead(null);
    pushBot({ text: 'No problem. Anything else I can help with?', chips: MENU });
  };

  const submitLead = async (data) => {
    setLead({ ...data, step: 'sending' });
    setTyping(true);
    try {
      await consultationService.bookConsultation({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        goal: data.goal,
        preferredTime: data.preferredTime,
        consultationMode: 'Phone Call',
        message: 'Booked via the website chat assistant.',
      });
      setTyping(false);
      setLead(null);
      setMessages((m) => [
        ...m,
        {
          id: mid(),
          from: 'bot',
          text: `You’re booked, ${data.fullName.split(' ')[0]}! ${ADVISOR} will call you on ${data.phone} in the ${data.preferredTime.split(' (')[0].toLowerCase()}.\n\nWant to reach him sooner? Send your details on WhatsApp in one tap.`,
          success: true,
          actions: true,
          waText: bookingSummary(data),
          chips: MENU,
        },
      ]);
    } catch (err) {
      console.error('[Chat booking failed]:', err);
      setTyping(false);
      setLead(null);
      setMessages((m) => [
        ...m,
        {
          id: mid(),
          from: 'bot',
          text: `Sorry, I couldn’t send your booking just now. Tap WhatsApp below: your details are already filled in, so ${ADVISOR} gets them straight away. Or call ${PHONE_DISPLAY}.`,
          actions: true,
          waText: bookingSummary(data),
        },
      ]);
    }
  };

  const handleLeadInput = (text) => {
    const v = text.trim();
    if (lead.step === 'name') {
      if (v.length < 2) return pushBot({ text: 'Could you share your full name?', hint: 'lead' }, 300);
      setLead({ ...lead, fullName: v, step: 'phone' });
      return pushBot({ text: `Thanks, ${v.split(' ')[0]}! What’s your 10-digit mobile number?`, hint: 'lead' });
    }
    if (lead.step === 'phone') {
      const digits = v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
      if (!/^[6-9]\d{9}$/.test(digits)) return pushBot({ text: 'That doesn’t look like a valid Indian mobile number. Please enter 10 digits, starting with 6, 7, 8 or 9.', hint: 'lead' }, 300);
      setLead({ ...lead, phone: digits, step: 'email' });
      return pushBot({ text: 'And your email address?', hint: 'lead' });
    }
    if (lead.step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return pushBot({ text: 'Please check that email address, it doesn’t look quite right.', hint: 'lead' }, 300);
      setLead({ ...lead, email: v, step: 'time' });
      return pushBot({ text: 'When should the advisor call you?', slots: true, hint: 'lead' });
    }
    return undefined;
  };

  /* ------------------------------ routing ------------------------------ */
  const runIntent = (intent, extra = {}) => {
    if (intent === 'book') return startBooking(extra.goal);
    return pushBot(ANSWERS[intent] || ANSWERS.fallback);
  };

  const onChip = (chip) => {
    pushUser(chip.label);
    if (chip.to) {
      pushBot({ text: 'Opening that page for you.' }, 300);
      window.setTimeout(() => navigate(chip.to), 450);
      return;
    }
    runIntent(chip.intent, chip);
  };

  const onSlot = (slot) => {
    pushUser(slot);
    submitLead({ ...lead, preferredTime: slot });
  };

  const onSend = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput('');
    if (lead && lead.step === 'phone') pushUser(text.replace(/\d(?=\d{4})/g, '•'));
    else pushUser(text);
    if (lead && ['name', 'phone', 'email'].includes(lead.step)) return handleLeadInput(text);
    if (lead && lead.step === 'time') {
      const slot = TIME_SLOTS.find((s) => s.toLowerCase().startsWith(text.toLowerCase().slice(0, 4)));
      if (slot) return submitLead({ ...lead, preferredTime: slot });
      return pushBot({ text: 'Please pick one of the time slots above.', hint: 'lead' }, 300);
    }
    const { intent, goal } = detect(text);
    runIntent(intent, { goal });
  };

  const lastBotId = [...messages].reverse().find((m) => m.from === 'bot')?.id;
  const inLead = Boolean(lead && lead.step !== 'sending');
  const placeholder = !lead
    ? 'Ask about SIPs, tax, fees…'
    : { name: 'Your full name', phone: '10-digit mobile number', email: 'you@example.com', time: 'Choose a time above' }[lead.step] || '';

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label="Solahana chat assistant"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed z-[70] bottom-24 right-3 left-3 sm:left-auto sm:right-6 sm:w-[380px] h-[min(620px,calc(100vh-8.5rem))] flex flex-col rounded-3xl overflow-hidden bg-white border border-[#E4E8F0] shadow-[0_30px_80px_rgba(15,31,69,0.28)] origin-bottom-right"
          >
            {/* Header */}
            <header className="bg-ink-band px-4 py-3.5 flex items-center gap-3">
              <span className="relative shrink-0">
                <img src={avatar} alt="" className="w-11 h-11 rounded-full bg-[#FFF7E6] ring-2 ring-[#C9A04F]/70 object-cover" />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#132B5E]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white leading-tight">Solahana Assistant</p>
                <p className="text-[11px] text-[#AEBBD3] leading-tight mt-0.5">Online · replies instantly</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#AEBBD3] hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Messages */}
            <div ref={bodyRef} className="flex-1 overflow-y-auto bg-[#F7F8FB] px-4 py-4 space-y-3" aria-live="polite">
              {messages.map((m) =>
                m.from === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[80%] rounded-2xl rounded-br-md bg-[#1A3170] text-white text-sm px-3.5 py-2.5 leading-relaxed whitespace-pre-line">{m.text}</p>
                  </div>
                ) : (
                  <div key={m.id} className="flex items-end gap-2">
                    <img src={avatar} alt="" className="w-7 h-7 rounded-full bg-[#FFF7E6] ring-1 ring-[#E4E8F0] shrink-0" />
                    <div className="max-w-[85%] space-y-2">
                      <p className={`rounded-2xl rounded-bl-md text-sm px-3.5 py-2.5 leading-relaxed whitespace-pre-line border ${
                        m.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-white border-[#E4E8F0] text-[#0F1F45]'
                      }`}>
                        {m.text}
                      </p>

                      {m.actions && (
                        <div className="flex gap-2">
                          <a href={PHONE_TEL} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E4E8F0] text-xs font-bold text-[#1A3170] hover:border-[#CBD6EE]">
                            <Phone className="w-3.5 h-3.5" /> Call {ADVISOR_FIRST}
                          </a>
                          <a href={waLink(m.waText)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E4E8F0] text-xs font-bold text-emerald-700 hover:border-emerald-300">
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp {ADVISOR_FIRST}
                          </a>
                        </div>
                      )}

                      {/* Only the latest bot message keeps its buttons */}
                      {m.id === lastBotId && !typing && m.slots && lead?.step === 'time' && (
                        <div className="flex flex-col gap-1.5">
                          {TIME_SLOTS.map((s) => (
                            <button key={s} onClick={() => onSlot(s)} className="text-left px-3 py-2 rounded-xl bg-white border border-[#CBD6EE] text-xs font-semibold text-[#1A3170] hover:bg-[#EEF2FB] transition-colors">
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                      {m.id === lastBotId && !typing && !lead && m.chips && (
                        <div className="flex flex-wrap gap-1.5">
                          {m.chips.map((c) => (
                            <button
                              key={c.label}
                              onClick={() => onChip(c)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-[#CBD6EE] text-xs font-semibold text-[#1A3170] hover:bg-[#1A3170] hover:text-white hover:border-[#1A3170] transition-colors"
                            >
                              {c.label}
                              {c.to && <ArrowRight className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {typing && (
                <div className="flex items-end gap-2">
                  <img src={avatar} alt="" className="w-7 h-7 rounded-full bg-[#FFF7E6] ring-1 ring-[#E4E8F0]" />
                  <span className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white border border-[#E4E8F0] px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#8A96AB] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="border-t border-[#E4E8F0] bg-white px-3 pt-2.5 pb-3">
              {inLead && (
                <div className="flex items-center justify-between px-1 pb-2 text-[11px] text-[#5B6B84]">
                  <span>Your details are only used to arrange your call.</span>
                  <button onClick={cancelBooking} className="font-semibold text-[#2F5BC7] hover:underline">Cancel</button>
                </div>
              )}
              <form onSubmit={onSend} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  disabled={lead?.step === 'time' || lead?.step === 'sending'}
                  inputMode={lead?.step === 'phone' ? 'tel' : lead?.step === 'email' ? 'email' : 'text'}
                  aria-label="Type your message"
                  className="flex-1 min-w-0 h-11 px-4 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] text-sm text-[#0F1F45] placeholder-[#94A3B8] focus:outline-none focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15 disabled:opacity-60"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim()}
                  className="w-11 h-11 shrink-0 rounded-full bg-[#1A3170] text-white flex items-center justify-center hover:bg-[#2F5BC7] disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-[#8A96AB]">General information only, not investment advice.</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Greeting teaser */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.div
            key="teaser"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed z-[70] bottom-[5.6rem] right-5 sm:right-6 max-w-[250px]"
          >
            <div className="relative rounded-2xl rounded-br-md bg-white border border-[#E4E8F0] shadow-[0_14px_36px_rgba(15,31,69,0.16)] pl-4 pr-8 py-3">
              <button onClick={() => setOpen(true)} className="text-left text-sm text-[#0F1F45] leading-snug">
                <span className="font-bold">Hi there!</span> Questions about planning your money? I can help.
              </button>
              <button onClick={() => setTeaser(false)} aria-label="Dismiss" className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[#8A96AB] hover:bg-[#F7F8FB]">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Solahana'}
        aria-expanded={open}
        className="fixed z-[70] bottom-5 right-5 sm:right-6 w-16 h-16 rounded-full bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] ring-2 ring-[#C9A04F]/70 shadow-[0_14px_34px_rgba(15,31,69,0.35)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {!open && <span className="absolute inset-0 rounded-full ring-2 ring-[#C9A04F]/50 animate-ping [animation-duration:2.6s] pointer-events-none" />}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="text-white">
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.img
              key="av"
              src={avatar}
              alt=""
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="w-12 h-12 rounded-full bg-[#FFF7E6] object-cover"
            />
          )}
        </AnimatePresence>
        {!open && !started.current && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C9A04F] ring-2 ring-white text-[9px] font-bold text-[#0F1F45] flex items-center justify-center">1</span>
        )}
      </button>
    </>
  );
}
