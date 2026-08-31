import { escapeHtml } from './seo.js';

// Sends a notification email via Resend (https://resend.com) when a new lead
// comes in. Requires the RESEND_API_KEY secret; silently no-ops without it so
// a missing/misconfigured key never blocks a lead from being saved to D1.
export async function sendLeadNotification(env, lead, recipientEmail) {
  if (!env.RESEND_API_KEY || !recipientEmail) return;

  const subjectSource = lead.category || lead.source || 'פנייה חדשה';
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; font-size: 15px; color: #0A1931;">
      <h2 style="margin-bottom: 4px;">פנייה חדשה מהאתר</h2>
      <p style="color:#555; margin-top:0;">${escapeHtml(new Date().toLocaleString('he-IL'))}</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 480px;">
        <tr><td style="padding:6px 10px; font-weight:bold; border-bottom:1px solid #eee;">שם</td><td style="padding:6px 10px; border-bottom:1px solid #eee;">${escapeHtml(lead.name)}</td></tr>
        <tr><td style="padding:6px 10px; font-weight:bold; border-bottom:1px solid #eee;">טלפון</td><td style="padding:6px 10px; border-bottom:1px solid #eee;">${escapeHtml(lead.phone)}</td></tr>
        ${lead.email ? `<tr><td style="padding:6px 10px; font-weight:bold; border-bottom:1px solid #eee;">דוא"ל</td><td style="padding:6px 10px; border-bottom:1px solid #eee;">${escapeHtml(lead.email)}</td></tr>` : ''}
        ${lead.category ? `<tr><td style="padding:6px 10px; font-weight:bold; border-bottom:1px solid #eee;">תחום</td><td style="padding:6px 10px; border-bottom:1px solid #eee;">${escapeHtml(lead.category)}</td></tr>` : ''}
        ${lead.message ? `<tr><td style="padding:6px 10px; font-weight:bold; vertical-align:top;">הודעה</td><td style="padding:6px 10px;">${escapeHtml(lead.message).replace(/\n/g, '<br>')}</td></tr>` : ''}
      </table>
      <p style="color:#999; font-size:12px; margin-top:20px;">הפנייה נשמרה גם בלוח הבקרה של האתר (/admin).</p>
    </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || 'האתר של עו"ד ישראל גרוסמן <onboarding@resend.dev>',
        to: [recipientEmail],
        reply_to: lead.email || undefined,
        subject: `פנייה חדשה מהאתר — ${subjectSource}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error('Resend email failed', res.status, await res.text());
    }
  } catch (err) {
    console.error('Resend email error', err);
  }
}
