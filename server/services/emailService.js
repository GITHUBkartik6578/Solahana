import nodemailer from 'nodemailer';

/**
 * Escapes user-supplied text before it is placed inside an HTML email. Booking fields come from a
 * public form, so without this anyone could inject markup/links into the advisor's inbox.
 */
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Creates reusable Nodemailer transporter instance using environment variables
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.mailtrap.io';
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '2525', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends HTML Email with safe fallback logging
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const from = process.env.EMAIL_FROM || 'SOLAHANA <info@solahana.com>';

    if (!transporter) {
      console.log(`\n[EMAIL SERVICE - MOCK MODE]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${text || 'HTML Email Body'}\n`);
      return { success: true, mock: true };
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`[EMAIL SERVICE] Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL SERVICE ERROR] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Email Template: New lead alert for the advisor.
 * Goes to ADVISOR_EMAIL so a booking never sits unseen in the dashboard.
 */
export const sendNewLeadAlertEmail = async (booking) => {
  const to = process.env.ADVISOR_EMAIL || process.env.ADMIN_EMAIL;

  if (!to) {
    console.warn('[EMAIL SERVICE] ADVISOR_EMAIL not set — skipping new-lead alert.');
    return { success: false, skipped: true };
  }

  const digits = String(booking.phone || '').replace(/\D/g, '');
  const waNumber = digits.length === 10 ? `91${digits}` : digits;
  const received = new Date(booking.createdAt || Date.now()).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const source = /chat assistant/i.test(booking.message || '') ? 'Website chat assistant' : 'Website form';

  const subject = `New lead: ${booking.fullName} — ${booking.goal}`.replace(/[\r\n]+/g, ' ');

  const row = (label, value) =>
    `<tr>
      <td style="padding:8px 0;color:#5B6B84;font-size:13px;width:150px;">${label}</td>
      <td style="padding:8px 0;color:#0F1F45;font-size:14px;font-weight:600;">${escapeHtml(value) || '—'}</td>
    </tr>`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#F7F8FB;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4E8F0;border-radius:16px;overflow:hidden;">
      <div style="background:#0F1F45;padding:18px 24px;">
        <p style="margin:0;color:#C9A04F;font-size:11px;letter-spacing:2px;font-weight:bold;">SOLAHANA</p>
        <h1 style="margin:6px 0 0;color:#FFFFFF;font-size:19px;">New consultation request</h1>
      </div>

      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row('Name', booking.fullName)}
          ${row('Mobile', booking.phone)}
          ${row('Email', booking.email)}
          ${row('Interested in', booking.goal)}
          ${row('Preferred call', booking.preferredTime)}
          ${row('Mode', booking.consultationMode)}
          ${row('City', booking.city)}
          ${row('Came from', source)}
          ${row('Received', received)}
        </table>

        ${booking.message ? `<p style="margin:18px 0 0;padding:12px 14px;background:#F7F8FB;border-left:3px solid #C9A04F;color:#475569;font-size:13px;">${escapeHtml(booking.message)}</p>` : ''}

        <div style="margin-top:24px;">
          <a href="tel:+91${digits}" style="display:inline-block;background:#1A3170;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:bold;padding:11px 18px;border-radius:999px;margin-right:8px;">Call ${escapeHtml(booking.fullName.split(' ')[0])}</a>
          <a href="https://wa.me/${waNumber}" style="display:inline-block;background:#C9A04F;color:#0F1F45;text-decoration:none;font-size:13px;font-weight:bold;padding:11px 18px;border-radius:999px;">WhatsApp</a>
        </div>

        <p style="margin:22px 0 0;color:#8A96AB;font-size:12px;">
          The full list is in the admin dashboard under Consultations.
        </p>
      </div>
    </div>
  </div>`;

  const text = `New consultation request\n\nName: ${booking.fullName}\nMobile: ${booking.phone}\nEmail: ${booking.email}\nInterested in: ${booking.goal}\nPreferred call: ${booking.preferredTime}\nCame from: ${source}\nReceived: ${received}`;

  return sendEmail({ to, subject, html, text });
};

/**
 * Email Template: Consultation Booked Confirmation
 */
export const sendConsultationBookedEmail = async (booking) => {
  const dateFormatted = new Date(booking.preferredDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `SOLAHANA Consultation Booked — ${booking.goal}`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #020B2D; padding: 40px 20px; color: #F8F7F3;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #071C48; border: 1px solid rgba(200, 162, 74, 0.3); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #C8A24A; font-size: 26px; margin: 0; font-family: Georgia, serif;">SOLAHANA</h1>
          <p style="color: #BAC6DA; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">Financial Planning & Wealth Management</p>
        </div>
        <hr style="border: 0; border-top: 1px solid rgba(200, 162, 74, 0.2); margin: 20px 0;" />
        <p style="font-size: 16px;">Dear <strong>${escapeHtml(booking.fullName)}</strong>,</p>
        <p style="font-size: 14px; color: #E0E6ED; line-height: 1.6;">
          Thank you for requesting a 1-on-1 financial planning session with SOLAHANA. Your booking request has been received and is currently under review by our wealth desk.
        </p>
        <div style="background-color: #020B2D; border: 1px solid rgba(200, 162, 74, 0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #C8A24A; margin-top: 0; font-size: 16px;">Session Details</h3>
          <p style="margin: 8px 0; font-size: 13px;"><strong>Goal:</strong> ${escapeHtml(booking.goal)}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong>Mode:</strong> ${escapeHtml(booking.consultationMode)}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong>Preferred Date:</strong> ${dateFormatted}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong>Preferred Time Slot:</strong> ${escapeHtml(booking.preferredTime)}</p>
          <p style="margin: 8px 0; font-size: 13px;"><strong>Status:</strong> <span style="color: #E8C878; font-weight: bold;">Pending Review</span></p>
        </div>
        <p style="font-size: 13px; color: #BAC6DA; line-height: 1.5;">
          Our dedicated wealth advisor will confirm your slot and send video meeting credentials shortly.
        </p>
        <div style="margin-top: 32px; font-size: 12px; color: #8899B5; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
          SOLAHANA Financial Planning · Off Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053
        </div>
      </div>
    </div>
  `;

  return sendEmail({ to: booking.email, subject, html });
};

/**
 * Email Template: Consultation Confirmed
 */
export const sendConsultationConfirmedEmail = async (booking) => {
  const dateFormatted = new Date(booking.preferredDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `SOLAHANA Consultation Confirmed — ${booking.goal}`;
  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #020B2D; padding: 40px 20px; color: #F8F7F3;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #071C48; border: 1px solid rgba(200, 162, 74, 0.4); border-radius: 16px; padding: 32px;">
        <h1 style="color: #C8A24A; font-size: 24px; font-family: Georgia, serif;">Consultation Confirmed!</h1>
        <p style="font-size: 14px; color: #E0E6ED;">Dear <strong>${escapeHtml(booking.fullName)}</strong>,</p>
        <p style="font-size: 14px; color: #E0E6ED; line-height: 1.6;">
          Your financial planning session for <strong>${escapeHtml(booking.goal)}</strong> has been officially confirmed by our wealth team.
        </p>
        <div style="background-color: #020B2D; border: 1px solid rgba(200, 162, 74, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 6px 0; font-size: 13px;"><strong>Date:</strong> ${dateFormatted}</p>
          <p style="margin: 6px 0; font-size: 13px;"><strong>Time:</strong> ${escapeHtml(booking.preferredTime)}</p>
          <p style="margin: 6px 0; font-size: 13px;"><strong>Mode:</strong> ${escapeHtml(booking.consultationMode)}</p>
          ${/^https?:\/\//i.test(booking.meetingLink || '') ? `<p style="margin: 12px 0 6px 0; font-size: 13px;"><strong>Meeting Link:</strong> <a href="${escapeHtml(booking.meetingLink)}" style="color: #E8C878;">${escapeHtml(booking.meetingLink)}</a></p>` : ''}
        </div>
      </div>
    </div>
  `;

  return sendEmail({ to: booking.email, subject, html });
};

/**
 * Email Template: Consultation Cancelled
 */
export const sendConsultationCancelledEmail = async (booking) => {
  const subject = `SOLAHANA Consultation Cancelled — ${booking.goal}`;
  const html = `
    <div style="font-family: sans-serif; background-color: #020B2D; padding: 30px; color: #F8F7F3;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #071C48; padding: 25px; border-radius: 12px; border: 1px solid rgba(200,162,74,0.3);">
        <h2 style="color: #EF4444;">Consultation Cancelled</h2>
        <p>Dear <strong>${escapeHtml(booking.fullName)}</strong>,</p>
        <p>Your consultation booking for <strong>${escapeHtml(booking.goal)}</strong> has been cancelled.</p>
        <p>If you'd like to reschedule, please visit your SOLAHANA portal or contact info@solahana.com.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: booking.email, subject, html });
};
