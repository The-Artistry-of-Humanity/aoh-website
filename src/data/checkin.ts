// The Fulfilment check-in's questions, scoring and result lines, shared by the
// check-in page and the server function that emails the report, so both always
// agree. Moved unchanged from src/islands/FulfilmentCheckIn.tsx.

export type Question = { text: string; context?: string };

export const HEALTH: Question[] = [
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

export const INTERNAL: Question[] = [
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

export const LOVE_PARTNERED: Question[] = [
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

export const LOVE_SINGLE: Question[] = [
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

export const SOCIAL: Question[] = [
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

export const WORK: Question[] = [
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

export type RelationshipStatus = 'partnered' | 'single';

export const buildPillars = (status: RelationshipStatus) => [
  { name: 'Health & Fitness', questions: HEALTH },
  { name: 'Internal Work', questions: INTERNAL },
  { name: 'Love & Relationships', questions: status === 'partnered' ? LOVE_PARTNERED : LOVE_SINGLE },
  { name: 'Social Connections', questions: SOCIAL },
  { name: 'Work & Life Flow', questions: WORK },
];

export const LOVE_PILLAR_INDEX = 2;

export type Pillar = ReturnType<typeof buildPillars>[number];

/** Scores 0-100 per pillar, identical weighting regardless of love path. */
export const scorePillars = (answers: number[][]) =>
  answers.map((arr) => {
    const valid = arr.filter((a) => a >= 0);
    if (!valid.length) return 0;
    const sum = valid.reduce((s, v) => s + v, 0);
    return Math.round((sum / (valid.length * 3)) * 100);
  });

export const overallOf = (pillarScores: number[]) =>
  Math.round(pillarScores.reduce((s, v) => s + v, 0) / pillarScores.length);

/** The result lines under the score: a tone, the strongest and weakest pillar, and a hint for the weakest. */
export function interpret(pillarScores: number[], overallScore: number, PILLARS: Pillar[]) {
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
}
