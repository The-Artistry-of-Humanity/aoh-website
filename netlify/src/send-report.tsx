// POST /.netlify/functions/send-report: makes someone's Fulfilment Report and
// emails it to them. The page sends only the name, email, answers and
// relationship status; scores and result lines are worked out here with the
// check-in's own code, so the email can only ever carry our real report. The
// answers are used to make the PDF and aren't stored. Any answer other than
// 200 tells the page to make the report in the browser and download it instead.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { renderToBuffer } from '@react-pdf/renderer';
import ReportDoc, { registerFonts } from '../../src/islands/report/ReportDoc';
import { reportFileName } from '../../src/islands/report/content';
import { buildPillars, scorePillars, overallOf, interpret } from '../../src/data/checkin';
import { send, isEmail, firstName } from './email';

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Fonts and images ship with the function (netlify.toml included_files); the
// site's own copy is the fallback.
const local = [process.env.LAMBDA_TASK_ROOT, process.cwd()]
  .filter((d): d is string => !!d)
  .map((d) => join(d, 'public/report/'))
  .find((d) => existsSync(join(d, 'fonts')));
const base = local ?? `${process.env.URL || 'https://artistry-of-humanity.com'}/report/`;

/** A first name as people write them: letters, spaces, hyphens, apostrophes. Nothing else reaches the email. */
const NAME = /^[\p{L}\p{M}][\p{L}\p{M}'’ .-]{0,39}$/u;

const validAnswers = (a: unknown): a is number[][] =>
  Array.isArray(a) && a.length === 5 &&
  a.every((row) => Array.isArray(row) && row.length === 4 && row.every((v) => Number.isInteger(v) && v >= -1 && v <= 3));

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { ok: false });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return json(400, { ok: false });
  }
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const { email, answers, relationship, date } = b;
  if (b['bot-field']) return json(200, { ok: true });
  if (!NAME.test(name) || !isEmail(email) || !validAnswers(answers) || (relationship !== 'partnered' && relationship !== 'single'))
    return json(400, { ok: false });

  // The reader's own date, so a report asked for on Tuesday morning in Sydney doesn't say Monday.
  const m = typeof date === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(date) : null;
  const day = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date();

  const pillars = buildPillars(relationship);
  const scores = scorePillars(answers);
  const overall = overallOf(scores);
  const { tone, weakHint } = interpret(scores, overall, pillars);

  try {
    registerFonts(base);
    const pdf = await renderToBuffer(
      <ReportDoc d={{ name, date: day, base, scores, overall, answers, relationship, tone, weakHint,
        questions: pillars.map((p) => p.questions.map((q) => q.text)) }} />,
    );
    const first = firstName(name);
    const result = await send(email, `Your Fulfilment Report, ${first}`, {
      heading: `Here’s your Fulfilment Report, ${first}.`,
      paragraphs: [
        'It’s attached as a PDF: your score in every pillar, what your answers are telling you, and practical things to try.',
        'Start with the pillar marked “Start here”, and pick one thing to try this week.',
      ],
      link: { href: 'https://artistry-of-humanity.com/fulfilment-check-in', label: 'Take the check-in again in a month and compare' },
      footer: 'You’re getting this because you asked for your report at artistry-of-humanity.com. If you’d rather not hear from us, reply and let us know.',
    }, [{ filename: reportFileName(name), content: Buffer.from(pdf).toString('base64') }]);
    return result === 'sent' ? json(200, { ok: true }) : json(503, { ok: false, reason: result });
  } catch (err) {
    console.error('Report email failed', err);
    return json(500, { ok: false });
  }
};
