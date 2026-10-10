import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChevronRight, Clock, Mail, MessageCircle, Phone, User } from 'lucide-react';
import consultationService from '../../services/consultationService';
import { openConsultation } from '../../data/whoWeServe';
import { LEGAL_LINKS } from '../../data/legalPages';
import banner from '../../assets/contact-hero-banner.webp';

const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };

// Details as shown in the approved Contact design
const EMAIL = 'online@solahana.com';
const PHONE = '+91 7304442171';
const PHONE_HREF = 'tel:+917304442171';
const HOURS = 'Monday – Saturday  |  10:00 AM – 6:00 PM';

const field = 'w-full rounded-lg border border-[#E6DFCF] bg-white py-3.5 pl-11 pr-4 text-[15.5px] text-[#0A1836] outline-none transition-colors placeholder:text-[#64748B] focus:border-[#C9922E] focus:ring-2 focus:ring-[#E2B24E]/30';

function GoldIcon({ icon: Icon }) {
  return (
    <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#FBE2A0] to-[#EDB950] text-[#0A1836] shadow-[0_6px_16px_rgba(201,146,46,0.28)]">
      <Icon className="h-6 w-6" strokeWidth={2} />
    </span>
  );
}

/* Contact: banner picture (desktop), then "Get in Touch" with a working message form and contact cards. */
export default function ContactLayout({ page }) {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const phone = form.phone.replace(/[\s+-]/g, '').replace(/^91/, '');
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setStatus({ state: 'error', text: 'Please enter a valid 10-digit Indian mobile number.' });
      return;
    }
    setStatus({ state: 'sending', text: '' });
    try {
      await consultationService.bookConsultation({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone,
        goal: 'General Enquiry',
        message: form.message.trim(),
      });
      setForm({ fullName: '', email: '', phone: '', message: '' });
      setStatus({ state: 'done', text: 'Thank you. Your message has been sent and our team will get back to you shortly.' });
    } catch (err) {
      setStatus({ state: 'error', text: err?.response?.data?.message || 'We could not send your message. Please try again or email us directly.' });
    }
  };

  return (
    <div className="relative z-10 bg-white">
      {/* banner: picture on desktop */}
      <section aria-label={page.title} className="hidden bg-[#0A1836] pt-[80px] lg:block">
        <h1 className="sr-only">{page.title}: {page.tagline}</h1>
        <img src={banner} alt="" aria-hidden="true" width="1600" height="800" fetchpriority="high" draggable="false" className="block h-auto w-full select-none" />
      </section>
      {/* banner: live text below lg */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C] pt-[80px] lg:hidden">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px] text-white/85">
            <Link to="/">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#E2B24E]" />
            <span className="text-[#E2B24E]">{page.title}</span>
          </nav>
          <p style={playfair} className="mt-4 text-[44px] font-bold leading-none text-white sm:text-[56px]">{page.title}</p>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-14 bg-[#E2B24E]" />
          <p className="mt-4 text-[18px] text-white/90">{page.tagline}</p>
        </div>
      </section>

      {/* get in touch */}
      <section className="relative overflow-hidden bg-[#FDF8EE] py-10 sm:py-14">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[360px] w-[360px] rounded-full bg-[#E2B24E]/10 blur-[90px]" />
        <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <h2 style={playfair} className="text-[38px] font-bold leading-tight text-[#0A1836] sm:text-[52px]">Get in Touch</h2>
          <span aria-hidden="true" className="mt-3 block h-[4px] w-14 rounded-full bg-[#D9A441]" />
          <p className="mt-5 max-w-[80ch] text-[16px] leading-relaxed text-[#334155] sm:text-[18px]">
            Write to us or call, and our team will respond. To start a conversation about your plan, you can also book a free consultation.
          </p>

          <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            {/* message form */}
            <motion.form
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45 }}
              onSubmit={submit}
              noValidate
              className="rounded-2xl border border-[#F1E7D2] bg-white/90 p-6 shadow-[0_12px_34px_rgba(15,31,69,0.08)] sm:p-8"
            >
              <h3 style={playfair} className="text-[26px] font-bold text-[#0A1836] sm:text-[30px]">Send Us a Message</h3>
              <span aria-hidden="true" className="mt-2 block h-[3px] w-12 rounded-full bg-[#D9A441]" />
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="relative block">
                  <span className="sr-only">Full Name</span>
                  <User className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#475569]" />
                  <input required value={form.fullName} onChange={set('fullName')} placeholder="Full Name *" autoComplete="name" className={field} />
                </label>
                <label className="relative block">
                  <span className="sr-only">Email Address</span>
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#475569]" />
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="Email Address *" autoComplete="email" className={field} />
                </label>
                <label className="relative block sm:col-span-2">
                  <span className="sr-only">Phone Number</span>
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#475569]" />
                  <input required type="tel" inputMode="numeric" value={form.phone} onChange={set('phone')} placeholder="Phone Number *" autoComplete="tel" className={field} />
                </label>
                <label className="relative block sm:col-span-2">
                  <span className="sr-only">How can we help you?</span>
                  <MessageCircle className="pointer-events-none absolute left-4 top-4 h-[18px] w-[18px] text-[#475569]" />
                  <textarea required rows={4} value={form.message} onChange={set('message')} placeholder="How can we help you? *" className={`${field} resize-y`} />
                </label>
              </div>
              <button
                type="submit"
                disabled={status.state === 'sending'}
                className="group mt-5 flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#0A1836] px-6 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-[#12275A] disabled:cursor-wait disabled:opacity-70"
              >
                {status.state === 'sending' ? 'Sending…' : 'Send Message'}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              {status.text && (
                <p role="status" className={`mt-4 text-[14.5px] font-medium ${status.state === 'done' ? 'text-[#1B7A43]' : 'text-[#B42318]'}`}>{status.text}</p>
              )}
            </motion.form>

            {/* contact cards */}
            <div className="space-y-4">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-5 rounded-2xl border border-[#F1E7D2] bg-white/90 p-5 shadow-[0_8px_24px_rgba(15,31,69,0.06)] transition-shadow hover:shadow-[0_14px_34px_rgba(15,31,69,0.12)]">
                <GoldIcon icon={Mail} />
                <span className="min-w-0">
                  <span style={playfair} className="block text-[22px] font-bold text-[#0A1836]">Email Us</span>
                  <span className="mt-0.5 block break-all text-[17px] text-[#334155]">{EMAIL}</span>
                </span>
              </a>
              <a href={PHONE_HREF} className="flex items-center gap-5 rounded-2xl border border-[#F1E7D2] bg-white/90 p-5 shadow-[0_8px_24px_rgba(15,31,69,0.06)] transition-shadow hover:shadow-[0_14px_34px_rgba(15,31,69,0.12)]">
                <GoldIcon icon={Phone} />
                <span>
                  <span style={playfair} className="block text-[22px] font-bold text-[#0A1836]">Call Us</span>
                  <span className="mt-0.5 block text-[17px] text-[#334155]">{PHONE}</span>
                </span>
              </a>
              <div className="flex items-start gap-5 rounded-2xl border border-[#F1E7D2] bg-white/90 p-5 shadow-[0_8px_24px_rgba(15,31,69,0.06)]">
                <GoldIcon icon={CalendarDays} />
                <div className="min-w-0 flex-1">
                  <p style={playfair} className="text-[22px] font-bold text-[#0A1836]">Book a Consultation</p>
                  <p className="mt-0.5 text-[16px] text-[#334155]">Let’s discuss your financial goals.</p>
                  <button
                    type="button"
                    onClick={() => openConsultation()}
                    className="group mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#F6D488] to-[#E4B04F] px-6 py-3 text-[15.5px] font-semibold text-[#0A1836] shadow-[0_8px_20px_rgba(226,176,79,0.35)] transition-transform hover:-translate-y-0.5"
                  >
                    Book Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-1 text-[15px] text-[#334155]">
                <span aria-hidden="true" className="hidden h-px flex-1 bg-[#D9C9A3] sm:block" />
                <Clock className="h-5 w-5 shrink-0 text-[#9A7220]" />
                <span className="whitespace-pre">{HOURS}</span>
                <span aria-hidden="true" className="hidden h-px flex-1 bg-[#D9C9A3] sm:block" />
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#E7E2D5] pt-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#9A7220]">More from Solahana</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {LEGAL_LINKS.filter((l) => l.slug !== page.slug).map((l) => (
                <li key={l.slug}>
                  <Link to={l.path} className="inline-flex items-center gap-1.5 rounded-full border border-[#E2B24E]/60 px-4 py-2 text-[14px] font-semibold text-[#0F1F45] transition-colors hover:bg-[#0F1F45] hover:text-white">
                    {l.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
