import { useEffect, useRef, useState, type FormEvent } from 'react';
import { PILLARS } from '../../data/aoh';
import { makeReport, reportFileName, saveFile } from './makeReport';
import type { Relationship } from './content';

// "Get your full report", under the check-in results: first name, email and (optionally) company,
// then the report is emailed (netlify/src/send-report.tsx). If that fails,
// the PDF is made here in the browser and downloads instead, so nobody leaves
// empty-handed. The Netlify form tells us who asked; nothing waits on it.

interface Props {
  scores: number[];
  overall: number;
  answers: number[][];
  questions: string[][];
  relationship: Relationship;
  tone: string;
  weakHint: string;
  strongest: string;
  weakest: string;
}

type State = 'idle' | 'making' | 'sent' | 'done' | 'error';

const FORM = 'fulfilment-report';

/** The report cover's pentagon, small: the app's shape, with the overall score in the middle. */
const MiniPentagon = ({ scores, overall }: { scores: number[]; overall: number }) => {
  const c = 50, R = 33;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  };
  const poly = (r: (i: number) => number) => [0, 1, 2, 3, 4].map((i) => pt(i, r(i)).map((n) => n.toFixed(1)).join(',')).join(' ');
  return (
    <svg viewBox="0 0 100 100">
      <polygon points={poly(() => R)} fill="rgba(255,255,255,.6)" stroke="#D8D5C4" strokeWidth="0.9" strokeLinejoin="round" />
      <polygon points={poly((i) => (R * Math.max(scores[i], 4)) / 100)} fill="#E3EE92" stroke="#7A9A22" strokeWidth="1.4" strokeLinejoin="round" />
      {PILLARS.map((p, i) => { const [x, y] = pt(i, R + 5); return <circle key={p.key} cx={x} cy={y} r="5.4" fill={p.tint} stroke="#fff" strokeWidth="1" />; })}
      <text x="50" y="56.5" textAnchor="middle" fontFamily="'DM Serif Display', serif" fontSize="17" fill="#16241A">{overall}</text>
    </svg>
  );
};

const ReportOffer = (p: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [state, setState] = useState<State>('idle');
  const [file, setFile] = useState<{ url: string; name: string } | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => { if (file) URL.revokeObjectURL(file.url); }, [file]);
  useEffect(() => { if (state === 'sent' || state === 'done') doneRef.current?.focus(); }, [state]);

  const who = name.trim();

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (state === 'making' || !form.reportValidity()) return;
    setState('making');

    const bot = (form.elements.namedItem('bot-field') as HTMLInputElement | null)?.value;
    if (!bot) {
      const body = new URLSearchParams({
        'form-name': FORM, name: who, email: email.trim(), company: company.trim(),
        overall: String(p.overall), strongest: p.strongest, 'needs-attention': p.weakest,
      });
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() }).catch(() => {});
    }

    // The reader's own date for the report, not the server's.
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    try {
      const res = await fetch('/.netlify/functions/send-report', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: who, email: email.trim(), answers: p.answers, relationship: p.relationship, date, 'bot-field': bot || '' }),
      });
      if (res.ok) { setState('sent'); return; }
    } catch { /* fall through to the download */ }

    try {
      const blob = await makeReport({
        name: who, date: new Date(), scores: p.scores, overall: p.overall, answers: p.answers,
        questions: p.questions, relationship: p.relationship, tone: p.tone, weakHint: p.weakHint,
      });
      const next = { url: URL.createObjectURL(blob), name: reportFileName(who) };
      saveFile(next.url, next.name);
      setFile(next);
      setState('done');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  };

  return (
    <section className="fc-rep fc-step" id="fc-report" aria-labelledby="fc-rep-h">
      <div className="fc-rep-vis" aria-hidden="true">
        <img className="fc-rep-page fc-rep-p2" src="/report/preview-toolkit.webp" alt="" width="400" height="565" loading="lazy" />
        <img className="fc-rep-page fc-rep-p1" src="/report/preview-pillar.webp" alt="" width="400" height="565" loading="lazy" />
        <div className="fc-rep-page fc-rep-cover">
          <span className="fc-rep-brand"><img src="/assets/aoh-logo-new.png" alt="" width="14" height="14" />The Artistry of Humanity</span>
          <span className="fc-rep-eb">Your Fulfilment Report</span>
          <b>{who ? `${who}, here’s` : 'Here’s'} where you are right now.</b>
          <MiniPentagon scores={p.scores} overall={p.overall} />
        </div>
      </div>

      <div className="fc-rep-body">
        {state === 'sent' ? (
          <div role="status">
            <span className="eyebrow">On its way</span>
            <h2 ref={doneRef} tabIndex={-1} className="fc-next-h">Check your inbox, {who}.</h2>
            <p className="body">We’ve emailed your report to {email.trim()}. Start with the pillar marked <b>Start here</b>, and pick one thing to try this week.</p>
          </div>
        ) : state !== 'done' ? (
          <>
            <span className="eyebrow">Free · PDF · 12 pages</span>
            <h2 id="fc-rep-h" className="fc-next-h">Get your full report.</h2>
            <p className="body">Your score in every pillar, what your answers are telling you, and practical things to try. Made for you, with your name on it.</p>
            <form className="fc-rep-form" name={FORM} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}>
              <input type="hidden" name="form-name" value={FORM} />
              <p hidden><label>Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
              <div className="fields">
                <label className="field"><span>First name</span><input type="text" name="name" autoComplete="given-name" maxLength={40} required value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label className="field"><span>Email</span><input type="email" name="email" autoComplete="email" maxLength={255} required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                <label className="field"><span>Company (optional)</span><input type="text" name="company" autoComplete="organization" maxLength={150} value={company} onChange={(e) => setCompany(e.target.value)} /></label>
              </div>
              <button className="btn btn-lime" type="submit" disabled={state === 'making'} aria-busy={state === 'making'}>
                {state === 'making' ? 'Sending your report…' : 'Email me my report'}
              </button>
              {state === 'error' && (
                <p className="fc-rep-err" role="alert">Something went wrong making your report. Please try again, or write to <a href="mailto:ian@artistry-of-humanity.com">ian@artistry-of-humanity.com</a>.</p>
              )}
              <p className="fc-rep-fine">We’ll email it to you straight away. We keep these details to stay in touch now and then, never share them, and you can unsubscribe any time. <a href="/privacy">Privacy</a></p>
            </form>
          </>
        ) : (
          <div role="status">
            <span className="eyebrow">Your report is ready</span>
            <h2 ref={doneRef} tabIndex={-1} className="fc-next-h">Enjoy the read, {who}.</h2>
            <p className="body">We couldn’t email it just now, so it’s in your downloads as “{file?.name}”. Start with the pillar marked <b>Start here</b>, and pick one thing to try this week.</p>
            {file && <a className="btn btn-lime" href={file.url} download={file.name}>Download it again</a>}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportOffer;
