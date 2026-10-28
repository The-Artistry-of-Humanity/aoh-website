import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import PentagonDiagram from './PentagonDiagram';
import ReportOffer from './report/ReportOffer';
import { loadReport } from './report/makeReport';
import './FulfilmentCheckIn.css';

// The Fulfilment check-in, ported from the old Lovable page
// (src/pages/FulfilmentCheckIn.tsx). Questions, answer options, scoring, result
// logic and step flow are unchanged; only the UI layer is new. Copy edits are
// punctuation and Australian spelling only (no em dashes, "practise" as a verb).

type Answer = 0 | 1 | 2 | 3; // No, Not really, Mostly, Yes
const ANSWER_OPTIONS: { label: string; value: Answer }[] = [
  { label: 'No', value: 0 },
  { label: 'Not really', value: 1 },
  { label: 'Mostly', value: 2 },
  { label: 'Yes', value: 3 },
];

type Question = { text: string; context?: string };

const HEALTH: Question[] = [
  {
    text: 'Do you exercise regularly each week?',
    context:
      "Movement is the most direct lever we have over our energy, mood, and mental clarity. This isn't about performance or aesthetics. It's about whether physical activity is a consistent part of how you live, not something you get to when life allows.",
  },
  {
    text: 'Do you have a clear approach to nutrition and stick to it?',
    context:
      "You don't need a perfect diet. You need a conscious one. This question is about whether you have a relationship with food that serves your energy and wellbeing, and whether you're able to hold yourself to it most of the time.",
  },
  {
    text: 'Are you happy with your body?',
    context:
      "This isn't about aesthetics. It's about whether your relationship with your physical self is one of care or disconnection. How you feel in your body shapes your confidence, your energy, and how present you are in every other area of life.",
  },
  {
    text: 'Are you taking care of your health in a way that supports how you want to live?',
    context:
      "Health isn't just the absence of illness. It's the presence of vitality. This question asks whether your daily habits are building the physical foundation your life actually requires, or quietly eroding it.",
  },
];

const INTERNAL: Question[] = [
  {
    text: 'Do you regularly read?',
    context:
      "Reading is one of the simplest indicators of a growth mindset. It doesn't matter what you read. What matters is whether you're consistently exposing yourself to new ideas, perspectives, and ways of thinking beyond your own experience.",
  },
  {
    text: 'Do you practise mindfulness? (e.g. meditation, breathwork, or similar)',
    context:
      'Mindfulness practice, in whatever form works for you, is about building the capacity to be present rather than reactive. It’s less about the specific technique and more about whether you have a regular practice of turning inward and creating space between stimulus and response.',
  },
  {
    text: 'Do you practise gratitude?',
    context:
      "Gratitude isn't a feeling. It's a practice. Research consistently shows that people who actively notice and acknowledge what's good in their lives experience greater wellbeing, stronger relationships, and more resilience under pressure.",
  },
  {
    text: 'Do you forgive yourself and others?',
    context:
      "Carrying resentment, towards yourself or others, is one of the heaviest things a person can hold. This question isn't asking whether you've had nothing to forgive. It's asking whether you've done the work of letting it go.",
  },
];

const LOVE_PARTNERED: Question[] = [
  {
    text: 'Do you understand your non-negotiables in a romantic relationship?',
    context:
      'Most people discover their relationship values through disappointment rather than reflection. Knowing what you genuinely need, not just what you want, is the foundation of choosing and sustaining a relationship that actually works.',
  },
  {
    text: 'Have you discussed them with your partner?',
    context:
      'Self-knowledge is the first step. Shared understanding is the second. Many people know what they need but have never had an honest conversation about it with the person closest to them. That gap is where most relationship friction lives.',
  },
  {
    text: 'Do you make time for meaningful connection with your partner?',
    context:
      "Proximity is not the same as connection. This question asks whether you're genuinely present with your partner: not just in the same room, but actually investing in the quality of the relationship through intentional time and attention.",
  },
  {
    text: 'Do you feel loved, respected and happy in your relationship?',
    context:
      'Three simple words: loved, respected, happy. Each one asks something different. You can feel loved but not respected. You can feel respected but not happy. All three matter, and all three deserve an honest answer.',
  },
];

const LOVE_SINGLE: Question[] = [
  {
    text: 'Do you understand what you need from a romantic relationship?',
    context:
      'Most people discover their relationship values through disappointment rather than reflection. Knowing what you genuinely need, not just what you want, is the foundation of choosing a relationship that actually works for you.',
  },
  {
    text: 'Are you actively working on becoming the partner you want to attract?',
    context:
      "The quality of the relationship you attract is closely connected to the work you've done on yourself. This isn't about being perfect. It's about whether you're growing in the direction of the partnership you say you want.",
  },
  {
    text: 'Do you make time for meaningful connection in your personal life?',
    context:
      "Romantic connection is one form of intimacy, but not the only one. This question asks whether you're nurturing depth in your relationships more broadly, and whether connection is a genuine priority in how you spend your time.",
  },
  {
    text: 'Do you feel at peace with where you are in your love life right now?',
    context:
      "Being single is not the problem. Being at war with it is. This question asks whether you've found a genuine sense of acceptance and self-sufficiency in your current chapter: not resignation, but peace.",
  },
];

const SOCIAL: Question[] = [
  {
    text: 'Do you spend quality time with a like-minded friend weekly?',
    context:
      "Not just any time: quality time, with someone who genuinely gets you. Weekly is the provocation here. Most people think they're more connected than they are until they look at how often they actually invest in friendship.",
  },
  {
    text: 'Are you part of a community or group where you feel a genuine sense of belonging?',
    context:
      'Humans are tribal by nature. We need a sense of belonging beyond our immediate circle: a group, a community, a team where we feel seen and connected to something larger than ourselves. The absence of this is one of the most overlooked drivers of quiet suffering.',
  },
  {
    text: 'Do you have a great relationship with your family?',
    context:
      "Family relationships shape us more than almost anything else, and unresolved tension here has a way of showing up everywhere else. This question isn't asking whether your family is perfect. It's asking whether the relationship is one you'd genuinely describe as great.",
  },
  {
    text: 'Do you feel genuinely connected to the people around you?',
    context:
      "Loneliness doesn't always look like isolation. You can be surrounded by people and still feel profoundly disconnected. This question asks about the quality of connection in your everyday life, whether the people around you actually know you.",
  },
];

const WORK: Question[] = [
  {
    text: "Do you have a strong relationship with whoever you're accountable to at work?",
    context:
      'The relationship with your direct boss or accountability partner is one of the strongest predictors of your experience at work. Trust, respect, and clear communication here create the conditions for everything else to function well.',
  },
  {
    text: 'Do you feel you have enough time to carry out your work effectively?',
    context:
      "Chronic time pressure is a signal: either of too much on your plate, unclear priorities, or a mismatch between what's being asked of you and what's actually possible. Most people who answer no to this question have been answering no for longer than they've admitted.",
  },
  {
    text: 'Do you feel a genuine sense of purpose in your work?',
    context:
      'Purpose doesn’t require a calling. It requires a clear enough connection between what you do and why it matters: to you, to others, or to something beyond the transaction. Without that thread, even successful work can feel hollow.',
  },
  {
    text: 'Do you feel in control of your next step?',
    context:
      "This isn't about having everything figured out. It's about whether you have a sense of agency over where you're heading: that your next move is yours to make, not just something that's happening to you.",
  },
];

type RelationshipStatus = 'partnered' | 'single';

const buildPillars = (status: RelationshipStatus) => [
  { name: 'Health & Fitness', questions: HEALTH },
  { name: 'Internal Work', questions: INTERNAL },
  { name: 'Love & Relationships', questions: status === 'partnered' ? LOVE_PARTNERED : LOVE_SINGLE },
  { name: 'Social Connections', questions: SOCIAL },
  { name: 'Work & Life Flow', questions: WORK },
];

const LOVE_PILLAR_INDEX = 2;

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

  // Scores 0-100 per pillar, identical weighting regardless of love path
  const pillarScores = useMemo(
    () =>
      answers.map((arr) => {
        const valid = arr.filter((a) => a >= 0);
        if (!valid.length) return 0;
        const sum = valid.reduce((s, v) => s + v, 0);
        return Math.round((sum / (valid.length * 3)) * 100);
      }),
    [answers]
  );
  const overallScore = useMemo(
    () => Math.round(pillarScores.reduce((s, v) => s + v, 0) / pillarScores.length),
    [pillarScores]
  );

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

  // Fetch the report's PDF code while they answer, so it's ready by the results.
  useEffect(() => {
    if (stage !== 'questions') return;
    const go = () => { loadReport().catch(() => {}); };
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(go, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(go, 1500);
    return () => clearTimeout(t);
  }, [stage]);

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
  const interpretation = useMemo(() => {
    const indexed = pillarScores.map((s, i) => ({ s, name: PILLARS[i].name }));
    const max = indexed.reduce((a, b) => (b.s > a.s ? b : a));
    const min = indexed.reduce((a, b) => (b.s < a.s ? b : a));
    let tone = '';
    if (overallScore >= 80) tone = "You're moving with intention. Most pillars are well-tended. Protect this rhythm.";
    else if (overallScore >= 60) tone = "You've built real foundations. There's room to deepen, especially where energy is leaking.";
    else if (overallScore >= 40) tone = "You're in motion, but stretched. A few honest adjustments could shift everything.";
    else tone = "There's a lot asking for your attention. Start with one pillar. Momentum compounds.";
    return {
      tone,
      strongest: max.name,
      weakest: min.name,
      weakHint:
        min.name === 'Health & Fitness'
          ? 'When the body is unattended, everything else gets harder. Small, consistent inputs win here.'
          : min.name === 'Internal Work'
          ? 'Without inner practice, the noise outside becomes the noise inside. Make space, even briefly, daily.'
          : min.name === 'Love & Relationships'
          ? 'Connection isn’t passive. It needs the same intention you give your work.'
          : min.name === 'Social Connections'
          ? 'Belonging is a need, not a luxury. One real conversation a week changes the texture of life.'
          : 'When work owns you, life thins. Reclaim a clear next step: direction restores energy.',
    };
  }, [pillarScores, overallScore, PILLARS]);

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
