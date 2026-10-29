import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import PentagonDiagram from './PentagonDiagram';
import ReportOffer from './report/ReportOffer';
import { buildPillars, LOVE_PILLAR_INDEX, scorePillars, overallOf, interpret, type RelationshipStatus } from '../data/checkin';
import './FulfilmentCheckIn.css';

// The Fulfilment check-in, ported from the old Lovable page
// (src/pages/FulfilmentCheckIn.tsx). Questions, answer options, scoring, result
// logic and step flow are unchanged; only the UI layer is new. Copy edits are
// punctuation and Australian spelling only (no em dashes, "practise" as a verb).
// The questions and scoring live in src/data/checkin.ts.

type Answer = 0 | 1 | 2 | 3; // No, Not really, Mostly, Yes
const ANSWER_OPTIONS: { label: string; value: Answer }[] = [
  { label: 'No', value: 0 },
  { label: 'Not really', value: 1 },
  { label: 'Mostly', value: 2 },
  { label: 'Yes', value: 3 },
];

type Stage = 'landing' | 'questions' | 'love-toggle' | 'transition' | 'results';

/** Unanswered questions hold -1, as in the original. */
const emptyAnswers = () => buildPillars('partnered').map((p) => Array(p.questions.length).fill(-1) as number[]);

// Small inline icons (stroke = currentColor).
const Svg = ({ children, size = 18 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const IconHelp = () => <Svg size={16}><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17.2h.01" /></Svg>;
const IconLeft = () => <Svg><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>;
const IconRight = () => <Svg><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const IconPentagon = () => <Svg size={15}><path d="M12 3.5 20.5 9.7 17.3 19.7H6.7L3.5 9.7Z" /></Svg>;
const IconBars = () => <Svg size={15}><path d="M5 20V11M12 20V5M19 20v-6M3 20h18" /></Svg>;
const IconAgain = () => <Svg size={16}><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5" /><path d="M3.5 3.5v5h5" /></Svg>;
const IconRoom = () => <Svg size={24}><circle cx="12" cy="7" r="3" /><path d="M6 20a6 6 0 0 1 12 0" /><circle cx="4.5" cy="10" r="2" /><circle cx="19.5" cy="10" r="2" /></Svg>;
const IconCall = () => <Svg size={24}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></Svg>;
const IconChevron = () => <Svg size={20}><path d="m9 6 6 6-6 6" /></Svg>;

const FulfilmentCheckIn = () => {
  const [stage, setStage] = useState<Stage>('landing');
  const [pillarIdx, setPillarIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>('partnered');
  const [answers, setAnswers] = useState<number[][]>(emptyAnswers);
  const [view, setView] = useState<'pentagon' | 'bars'>('pentagon');
  const [contextOpen, setContextOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  // Ignores a second tap while the 220 ms auto-advance is pending, so a
  // double tap on a phone can't skip a question.
  const advancing = useRef(false);

  const PILLARS = useMemo(() => buildPillars(relationshipStatus), [relationshipStatus]);

  const totalQuestions = PILLARS.reduce((s, p) => s + p.questions.length, 0);
  const answeredCount = answers.flat().filter((a) => a >= 0).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const pillarScores = useMemo(() => scorePillars(answers), [answers]);
  const overallScore = useMemo(() => overallOf(pillarScores), [pillarScores]);

  const currentAnswer = answers[pillarIdx]?.[questionIdx];
  const currentQuestion = PILLARS[pillarIdx]?.questions[questionIdx];

  // Reset context disclosure when question changes
  useEffect(() => {
    setContextOpen(false);
  }, [pillarIdx, questionIdx, stage]);

  const setAnswer = (val: Answer) => {
    if (advancing.current) return;
    advancing.current = true;
    setAnswers((prev) => {
      const next = prev.map((row) => [...row]);
      next[pillarIdx][questionIdx] = val;
      return next;
    });
    setTimeout(() => {
      advancing.current = false;
      goNext();
    }, 220);
  };

  const goNext = () => {
    const pillar = PILLARS[pillarIdx];
    if (questionIdx < pillar.questions.length - 1) {
      setQuestionIdx((i) => i + 1);
    } else if (pillarIdx < PILLARS.length - 1) {
      const nextPillar = pillarIdx + 1;
      // Show love toggle before entering Love pillar
      if (nextPillar === LOVE_PILLAR_INDEX) {
        setStage('love-toggle');
        return;
      }
      setPillarIdx(nextPillar);
      setQuestionIdx(0);
    } else {
      setStage('transition');
    }
  };

  const goBack = () => {
    if (questionIdx > 0) {
      setQuestionIdx((i) => i - 1);
    } else if (pillarIdx > 0) {
      const prev = pillarIdx - 1;
      setPillarIdx(prev);
      setQuestionIdx(PILLARS[prev].questions.length - 1);
    }
  };

  const chooseRelationship = (status: RelationshipStatus) => {
    setRelationshipStatus(status);
    // Clear any previous Love answers (length stays 4 either way)
    setAnswers((prev) => {
      const next = prev.map((row) => [...row]);
      next[LOVE_PILLAR_INDEX] = Array(4).fill(-1);
      return next;
    });
    setPillarIdx(LOVE_PILLAR_INDEX);
    setQuestionIdx(0);
    setStage('questions');
  };

  // Transition screen → results
  useEffect(() => {
    if (stage !== 'transition') return;
    const t = setTimeout(() => setStage('results'), 2200);
    return () => clearTimeout(t);
  }, [stage]);

  const reset = () => {
    setAnswers(emptyAnswers());
    setRelationshipStatus('partnered');
    setPillarIdx(0);
    setQuestionIdx(0);
    setStage('landing');
    setView('pentagon');
  };

  // Interpretation
  const interpretation = useMemo(() => interpret(pillarScores, overallScore, PILLARS), [pillarScores, overallScore, PILLARS]);

  // ---- UI behaviour only (no effect on the flow above) ----

  const reduceMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep the panel in view as the steps change (mainly for phones), and move
  // focus to the new question for keyboard and screen-reader users.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const el = rootRef.current;
    if (el) {
      const top = el.getBoundingClientRect().top;
      if (top < 64 || top > window.innerHeight * 0.45) el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    }
    if (stage === 'questions' || stage === 'love-toggle' || stage === 'results') {
      const active = document.activeElement;
      if (!active || active === document.body || el?.contains(active)) headRef.current?.focus({ preventScroll: true });
    }
  }, [stage, pillarIdx, questionIdx]);

  // Draw the highlighter and grow the bars once the results are on screen.
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    if (stage !== 'results') { setDrawn(false); return; }
    const t = setTimeout(() => setDrawn(true), 350);
    return () => clearTimeout(t);
  }, [stage]);
  const [barsOn, setBarsOn] = useState(false);
  useEffect(() => {
    if (stage !== 'results' || view !== 'bars') { setBarsOn(false); return; }
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setBarsOn(true)));
    return () => cancelAnimationFrame(r);
  }, [stage, view]);

  const ctxId = `fc-ctx-${pillarIdx}-${questionIdx}`;

  return (
    <div className="fc" ref={rootRef} data-stage={stage}>
      <div className="card-dark fc-panel">
        <div className="glow fc-glow" aria-hidden="true" />

        {/* LANDING */}
        {stage === 'landing' && (
          <div className="fc-step fc-land">
            <div className="fc-land-pent">
              <PentagonDiagram scores={[60, 45, 70, 35, 55]} size={320} showLabels={true} sample />
            </div>
            <div className="btns">
              <button type="button" className="btn btn-lime" onClick={() => setStage('questions')}>Start your check-in</button>
            </div>
          </div>
        )}

        {/* LOVE TOGGLE */}
        {stage === 'love-toggle' && (
          <div className="fc-step fc-love">
            <span className="eyebrow">Love &amp; Relationships</span>
            <h2 ref={headRef} tabIndex={-1} className="fc-h">Which best describes you right now?</h2>
            <p className="fc-sub">So the next four questions land where you actually are.</p>
            <div className="fc-opts">
              <button type="button" className="fc-opt" onClick={() => chooseRelationship('partnered')}>
                <span>I’m in a relationship</span><span className="fc-go"><IconRight /></span>
              </button>
              <button type="button" className="fc-opt" onClick={() => chooseRelationship('single')}>
                <span>I’m single</span><span className="fc-go"><IconRight /></span>
              </button>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {stage === 'questions' && currentQuestion && (
          <div className="fc-qs">
            <div className="fc-prog">
              <div className="fc-prog-row">
                <span>{String(pillarIdx + 1).padStart(2, '0')} / 05 · {PILLARS[pillarIdx].name}</span>
                <span>{progress}%</span>
              </div>
              <div className="fc-bar" role="progressbar" aria-label="Check-in progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div key={`${pillarIdx}-${questionIdx}`} className="fc-step fc-q">
              <span className="fc-qn">Question {questionIdx + 1} of {PILLARS[pillarIdx].questions.length}</span>
              <h2 ref={headRef} tabIndex={-1} className="fc-h">{currentQuestion.text}</h2>

              {currentQuestion.context && (
                <div className="fc-why-wrap">
                  <button type="button" className="fc-why" onClick={() => setContextOpen((v) => !v)} aria-expanded={contextOpen} aria-controls={ctxId}>
                    <IconHelp />
                    {contextOpen ? 'Hide context' : 'Why this matters'}
                  </button>
                  <div id={ctxId} className={`fc-ctx${contextOpen ? ' open' : ''}`} aria-hidden={!contextOpen}>
                    <div><p>{currentQuestion.context}</p></div>
                  </div>
                </div>
              )}

              <div className="fc-opts" role="group" aria-label="Your answer">
                {ANSWER_OPTIONS.map((opt) => {
                  const selected = currentAnswer === opt.value;
                  return (
                    <button key={opt.value} type="button" className="fc-opt" aria-pressed={selected} onClick={() => setAnswer(opt.value)}>
                      <span>{opt.label}</span>
                      <span className="fc-dot" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="fc-nav">
              <button type="button" className="fc-tx" onClick={goBack} disabled={pillarIdx === 0 && questionIdx === 0}>
                <IconLeft /> Back
              </button>
              <button type="button" className="fc-tx" onClick={goNext} disabled={currentAnswer < 0}>
                Skip <IconRight />
              </button>
            </div>
          </div>
        )}

        {/* TRANSITION */}
        {stage === 'transition' && (
          <div className="fc-step fc-wait" role="status">
            <div className="fc-pulse" aria-hidden="true"><i /><i /><i /></div>
            <p className="fc-wait-h">Bringing it together…</p>
            <p className="fc-sub">A clearer picture, in a moment.</p>
          </div>
        )}

        {/* RESULTS */}
        {stage === 'results' && (
          <div className="fc-step fc-res">
            <span className="eyebrow">Your check-in</span>
            <h2 ref={headRef} tabIndex={-1} className="fc-h fc-res-h">Here’s where you are <span className={`mk mk-d${drawn ? ' on' : ''}`}>right now</span>.</h2>

            <div className="fc-seg" role="group" aria-label="Chart style">
              <button type="button" aria-pressed={view === 'pentagon'} onClick={() => setView('pentagon')}><IconPentagon /> Pentagon</button>
              <button type="button" aria-pressed={view === 'bars'} onClick={() => setView('bars')}><IconBars /> Bars</button>
            </div>

            <div className="fc-vis">
              {view === 'pentagon' ? (
                <div className="fc-res-pent">
                  <PentagonDiagram scores={pillarScores} size={320} showLabels={true} centre={overallScore} />
                </div>
              ) : (
                <div className="fc-bars">
                  {pillarScores.map((s, i) => (
                    <div key={i}>
                      <div className="fc-bars-row">
                        <span>{PILLARS[i].name}</span>
                        <b>{s}</b>
                      </div>
                      <div className="fc-track"><i style={{ width: `${barsOn ? s : 0}%` }} /></div>
                    </div>
                  ))}
                  <div className="fc-overall">
                    <span>Overall Fulfilment</span>
                    <b>{overallScore}</b>
                  </div>
                </div>
              )}
            </div>

            <p className="fc-tone">{interpretation.tone}</p>
            <div className="fc-two">
              <div className="fc-strong">
                <small>Strongest</small>
                <b>{interpretation.strongest}</b>
              </div>
              <div className="fc-weak">
                <small>Needs attention</small>
                <b>{interpretation.weakest}</b>
              </div>
            </div>
            <p className="fc-hint">{interpretation.weakHint}</p>

            <div className="fc-res-act">
              <a className="btn btn-lime" href="#fc-report">Get your full report</a>
              <button type="button" className="fc-tx fc-again" onClick={reset}>
                <IconAgain /> Take it again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* THE REPORT (a PDF with their name on it) */}
      {stage === 'results' && (
        <ReportOffer
          scores={pillarScores}
          overall={overallScore}
          answers={answers}
          questions={PILLARS.map((pl) => pl.questions.map((q) => q.text))}
          relationship={relationshipStatus}
          tone={interpretation.tone}
          weakHint={interpretation.weakHint}
          strongest={interpretation.strongest}
          weakest={interpretation.weakest}
        />
      )}

      {/* WHAT COMES NEXT */}
      {stage === 'results' && (
        <div className="fc-next fc-step">
          <span className="eyebrow">What comes next</span>
          <h2 className="fc-next-h">Want to go further?</h2>
          <p className="body">The Five Pillars sit behind all of our work with leaders and teams. Three good places to start:</p>
          <div className="fc-links">
            <a className="card fc-link" href="/what-we-do/masterclass">
              <span className="ico"><IconRoom /></span>
              <span className="fc-link-t">
                <span className="pill">60–90 min</span>
                <b>A Masterclass</b>
                <span className="body">A working session for your leadership team. You leave with a clear picture of where your culture sits across the Five Pillars.</span>
              </span>
              <span className="fc-arr"><IconChevron /></span>
            </a>
            <a className="card fc-link" href="/contact">
              <span className="ico"><IconCall /></span>
              <span className="fc-link-t">
                <span className="pill">30 minutes</span>
                <b>Book a call</b>
                <span className="body">No pitch. Tell us what you’re seeing in your organisation, and we’ll show you where the Five Pillars could help.</span>
              </span>
              <span className="fc-arr"><IconChevron /></span>
            </a>
            <a className="card fc-link" href="/what-we-do/norma">
              <span className="ico fc-ico-norma"><img src="/assets/norma-app-icon.png" alt="" width="40" height="40" /></span>
              <span className="fc-link-t">
                <span className="pill">nørma</span>
                <b>See how nørma tracks this every month</b>
                <span className="body">An app for your people and a dashboard for you, built on the same Five Pillars.</span>
              </span>
              <span className="fc-arr"><IconChevron /></span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FulfilmentCheckIn;
