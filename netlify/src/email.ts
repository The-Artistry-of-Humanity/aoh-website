// Email for the site's Netlify functions, sent through Resend. Nothing is sent
// until RESEND_API_KEY is set in Netlify (Project configuration → Environment
// variables); without it, send() reports 'not-configured' and does nothing.

const SITE = 'https://artistry-of-humanity.com';
export const FROM = process.env.EMAIL_FROM || 'The Artistry of Humanity <ian@artistry-of-humanity.com>';

export const isEmail = (v: unknown): v is string =>
  typeof v === 'string' && v.length <= 254 && /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[a-z]{2,}$/i.test(v.trim());

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The first word of what someone typed as their name, for "Thank you, Sam." */
export const firstName = (name: unknown) => (typeof name === 'string' ? name.trim().split(/\s+/)[0].slice(0, 40) : '');

interface Mail {
  heading: string;
  paragraphs: string[];
  /** Optional link under the paragraphs, e.g. back to the check-in. */
  link?: { href: string; label: string };
  /** Small print under the sign-off. */
  footer?: string;
}

/** The email itself: cream page, white card, the AOH mark, serif heading. Tables and inline styles only, for Outlook and Gmail. */
export function render({ heading, paragraphs, link, footer }: Mail) {
  const p = (t: string) => `<p style="margin:0 0 16px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#3F4A42">${esc(t)}</p>`;
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#F4F2E6">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F2E6"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px">
<tr><td style="padding:32px 36px 8px"><img src="${SITE}/report/aoh-logo.png" width="36" height="36" alt="The Artistry of Humanity" style="display:block;border-radius:9px"></td></tr>
<tr><td style="padding:16px 36px 8px">
<h1 style="margin:0 0 18px;font:400 28px/1.2 Georgia,'Times New Roman',serif;color:#16241A">${esc(heading)}</h1>
${paragraphs.map(p).join('\n')}
${link ? `<p style="margin:0 0 16px;font:16px/1.6 Arial,Helvetica,sans-serif"><a href="${link.href}" style="color:#4A6B3A;font-weight:bold">${esc(link.label)}</a></p>` : ''}
<p style="margin:8px 0 0;font:16px/1.6 Arial,Helvetica,sans-serif;color:#3F4A42">With warmth,<br>The Artistry of Humanity team</p>
</td></tr>
<tr><td style="padding:24px 36px 32px">${footer ? `<p style="margin:0;font:12px/1.5 Arial,Helvetica,sans-serif;color:#8A928B">${esc(footer)}</p>` : ''}</td></tr>
</table></td></tr></table></body></html>`;
  const text = [heading, '', ...paragraphs.flatMap((t) => [t, '']), ...(link ? [`${link.label}: ${link.href}`, ''] : []), 'With warmth,', 'The Artistry of Humanity team', ...(footer ? ['', footer] : [])].join('\n');
  return { html, text };
}

export type SendResult = 'sent' | 'not-configured' | 'failed';

export async function send(to: string, subject: string, mail: Mail, attachments?: { filename: string; content: string }[]): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return 'not-configured';
  const { html, text } = render(mail);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to.trim()], subject, html, text, attachments }),
  });
  if (res.ok) return 'sent';
  console.error('Resend refused the email', res.status, await res.text());
  return 'failed';
}
