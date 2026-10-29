// Runs on every verified Netlify Forms submission (spam never reaches it) and
// sends the person a short confirmation, as the old site did. Ian's copy comes
// from Netlify's own notification emails (Forms → Submission notifications).
// The Fulfilment Report emails itself (send-report), and unsubscribes get no
// reply. Uses the classic handler: Netlify only delivers this event to it.
import { send, isEmail, firstName } from './email';

const ENQUIRIES = ['contact', 'speaker-enquiry', 'masterclass', 'coaching-enquiry', 'accelerator-enquiry'];

export const handler = async (event: { body?: string }) => {
  const { payload } = JSON.parse(event.body || '{}');
  const form: string = payload?.form_name ?? '';
  const d = payload?.data ?? {};
  if (!isEmail(d.email)) return { statusCode: 200 };
  const first = firstName(d.name);

  if (ENQUIRIES.includes(form)) {
    await send(d.email, 'Thanks for reaching out to The Artistry of Humanity', {
      heading: first ? `Thank you, ${first}.` : 'Thank you for reaching out.',
      paragraphs: ['Your message has reached us at The Artistry of Humanity. We’ll reply within one business day, usually sooner.'],
    });
  } else if (form === 'session-feedback') {
    await send(d.email, 'Thank you for your feedback', {
      heading: first ? `Thank you, ${first}.` : 'Thank you.',
      paragraphs: [
        'Your feedback has reached us. We read every response and it shapes how we design the next session.',
        'If you flagged something we can do better, we will come back to you directly.',
      ],
    });
  }
  return { statusCode: 200 };
};
