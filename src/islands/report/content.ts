// Every word in the Fulfilment Report. The pillar copy and quotes follow The
// Artistry of Humanity Workbook (whose Pulse Check is this check-in); the
// practices are the workbook's exercises and the habits, growth work and
// resets in the nørma app, written so anyone can do them by hand.

export type Band = 'low' | 'mid' | 'high';
export type Kind = 'now' | 'day' | 'week' | 'once' | 'month';
export type Relationship = 'partnered' | 'single';

export interface ReportInput {
  name: string;
  date: Date;
  /** Where the report's fonts and images load from (the site's /report/ folder). */
  base: string;
  scores: number[];
  overall: number;
  /** Four answers per pillar, 0 (No) to 3 (Yes), -1 when skipped. */
  answers: number[][];
  /** The question each answer belongs to, as the check-in asked it. */
  questions: string[][];
  relationship: Relationship;
  /** The check-in's own result lines, so the report says what the screen said. */
  tone: string;
  weakHint: string;
}

export interface Practice {
  kind: Kind;
  title: string;
  text: string;
}

/** Possible pillar scores run 0, 8, 17 … 92, 100: up to 42 is low, 75 and up is high. */
export const bandOf = (v: number): Band => (v < 50 ? 'low' : v < 75 ? 'mid' : 'high');
export const BAND_LABEL: Record<Band, string> = { low: 'Room to grow', mid: 'Getting there', high: 'Well tended' };
export const KIND_LABEL: Record<Kind, string> = { now: 'Right now', day: 'Every day', week: 'Every week', once: 'Once', month: 'Every month' };

interface PillarCopy {
  what: string;
  /** A line from the workbook, shown at the foot of the pillar's page. */
  quote: string;
  bands: Record<Band, string>;
  /** One practice per question, in question order. */
  tips: Practice[];
  /** Love & Relationships asks different questions when someone is single. */
  tipsSingle?: Practice[];
  /** Used when fewer than three answers came in low. */
  extras: Practice[];
}

const P = (kind: Kind, title: string, text: string): Practice => ({ kind, title, text });

export const PILLAR_COPY: PillarCopy[] = [
  {
    what: 'A healthy lifestyle built on regular movement and nourishing food. It’s the foundation the other four pillars stand on: the energy and stamina to pursue your goals. Not performance or looks, but whether your daily habits are building the energy your life needs, or quietly using it up.',
    quote: 'While occasional exercise offers some benefits, the real magic happens with consistent physical activity.',
    bands: {
      low: 'Your body is asking for attention. When this pillar runs low, everything else gets harder: patience, focus, mood, sleep. It’s also the pillar where small, consistent inputs show up fastest. Start small, even a fifteen-minute walk each day, and let the rest build from there.',
      mid: 'The foundations are there, but they hold only when life allows. The aim now is consistency: moving exercise and food from “when I get to it” into the shape of your week, so a busy month doesn’t take them away.',
      high: 'You’re looking after the foundation. Movement and food are part of how you live, not something you fit in. This is your safety net when life gets hard, so protect the routines that got you here, and keep raising the bar.',
    },
    tips: [
      P('week', 'Put movement in the calendar', 'Two or three slots a week, treated like an important appointment. Find something you enjoy, start with what fits comfortably, and build up as you get fitter. A brisk walk counts.'),
      P('day', 'Eat more whole foods', 'There’s no one-size-fits-all diet. More whole foods, fewer processed ones, and water within reach all day. Notice how different foods make you feel, and adjust.'),
      P('once', 'Set a fitness goal that fits your life', 'Write down what you want your body to let you do in ten years, then one goal for the next three months that serves it. Build it around the week you actually have, so it survives a bad Tuesday.'),
      P('once', 'Book the appointment you’ve been avoiding', 'The check-up, the dentist, the physio. It takes ten minutes to arrange and saves months of low-level dread. Booking it doesn’t commit you to bad news. It commits you to knowing.'),
    ],
    extras: [
      P('day', 'A consistent bedtime', 'Sleep is where energy is rebuilt. Go to bed and get up at the same times, and keep the half hour before bed off screens.'),
      P('now', 'Walk it off', 'When the day is getting on top of you, ten minutes outside with the phone away does more for your head than another coffee.'),
    ],
  },
  {
    what: 'The deliberate act of turning inward: examining your thoughts, feelings, motivations and behaviour. It’s exercise for your inner strength. Reading, mindfulness, gratitude and forgiveness are the four we ask about, because each one is a regular habit of turning inward.',
    quote: 'Internal work isn’t a sign of weakness; it’s a sign of strength.',
    bands: {
      low: 'There’s not much space at the moment between what happens and how you respond. That’s common, and it’s why this pillar matters: without inner practice, the noise outside becomes the noise inside. A few minutes a day changes more than you’d expect.',
      mid: 'Some practices are in place. The next step is making them regular, so they are there when you need them most rather than when you remember. One small daily anchor, like three good things before bed, is often enough.',
      high: 'You’ve built a real inner practice. You make space to reflect, you notice what’s good, and you can let things go. Keep it daily: this is the pillar that steadies the others when life throws a curveball.',
    },
    tips: [
      P('day', 'Ten pages a day', 'That’s a book a month. It doesn’t matter what you read, only that new ideas keep reaching you from outside your own experience.'),
      P('now', 'Box breathing', 'In for four, hold for four, out for four, hold for four. Three minutes is enough to put space between what happened and what you do next.'),
      P('day', 'Three good things', 'Each evening, write down three things you’re grateful for. What you look for, you start to see, and the good in your day is no exception.'),
      P('once', 'Write the letter you never sent', 'To someone you’re still carrying, or to yourself. Write the honest version. Whether you ever send it matters far less than putting it down on your side.'),
    ],
    extras: [
      P('day', 'Talk it out', 'Five minutes at the end of the day: what came up for me today, what set it off, and what would I do differently? Write it down or say it out loud.'),
      P('once', 'Reframe a difficult emotion', 'Next time you feel something you’d call negative, pause and ask what it’s signalling. Anger often means a line was crossed; sadness, a need for support or rest.'),
    ],
  },
  {
    what: 'Healthy, supportive relationships, whatever your relationship status. Knowing what you need, saying it out loud, making real time for connection, and feeling loved, respected and at peace with where you are.',
    quote: 'The most important relationship you’ll ever have is the one with yourself.',
    bands: {
      low: 'This part of life is asking for honesty. Connection isn’t passive: it needs the same intention you give your work. Start with getting clear on what you actually need, because most friction lives in what has never been said.',
      mid: 'There’s real care here, with room to deepen. Often the gap isn’t feeling but attention: time that is truly shared, and the conversation about what matters that never quite happens.',
      high: 'This pillar is well looked after. You know what you need and you make time for it. Keep investing on purpose, especially when work gets loud: this is usually the first thing to give way.',
    },
    tips: [
      P('once', 'Write down your non-negotiables', 'Take some quiet time: what truly matters to you, and what do you need in a relationship? Write it down. Words are wind, but writing remains.'),
      P('once', 'Have the values conversation', 'Couples negotiate logistics constantly and values almost never. Talk through what matters most to each of you, from how you like to spend your time to what drives you. It’s rarely as heavy as you expect.'),
      P('week', 'A date night in the calendar', 'Schedule it like anything else that matters, and leave the phones in another room. Being in the same room isn’t the same as being together.'),
      P('once', 'Say one true thing', 'Distance builds from small things left unsaid. Pick a calm, private moment and tell your partner one honest thing that matters, starting with “I”, not “you”.'),
    ],
    tipsSingle: [
      P('once', 'Write down your non-negotiables', 'What truly matters to you, and what would you need from a partner? Most people carry it as a feeling, which is easy to talk yourself out of. On paper it holds.'),
      P('once', 'Reconnect with your own worth', 'List what makes you worth loving. Not achievements: worth isn’t output. It’s uncomfortable, it doesn’t take long, and it shapes what you accept from others.'),
      P('week', 'Go past hello', 'At the café, the gym, the class you already go to, turn one hello a week into a real conversation. Depth starts with people you already see.'),
      P('week', 'Take yourself out', 'Once a week, do something you love on your own, on purpose. Peace with this chapter grows from enjoying your own company, not waiting out the time.'),
    ],
    extras: [
      P('day', 'Say the appreciative thing out loud', 'You notice what you love about people every day. Say one of those things to them, today.'),
      P('once', 'Find your people through something you love', 'A running club, a choir, a climbing wall. Go back until you’re a familiar face. The thing you love does the introductions.'),
    ],
  },
  {
    what: 'Community, friendship and family: a sense of belonging, and people who celebrate your wins and stand by you in the hard times. Not how many people you know, but whether you spend real time with people who get you.',
    quote: 'Humans are inherently social creatures, wired for connection.',
    bands: {
      low: 'You may be more short of connection than you’ve realised. Loneliness doesn’t always look like isolation: you can be busy and surrounded by people and still feel unknown. Belonging is a need, not a luxury, and it rebuilds one real conversation at a time.',
      mid: 'You have people around you. The opportunity is depth and rhythm: the weekly catch-up that actually happens, a group where you’re a familiar face, a family conversation that goes past logistics.',
      high: 'You’re well connected, with people who know you and a place you belong. Keep the rhythm going on purpose. Friendships fade from neglect far more often than from conflict.',
    },
    tips: [
      P('week', 'A standing catch-up', 'Same friend, same slot, every week or fortnight, in the calendar like anything else that matters. Quality time with someone who gets you, on repeat.'),
      P('week', 'Join a group, and keep going', 'A team, a club, a class, a volunteer shift. Go back until people expect you. Belonging is built by turning up.'),
      P('once', 'Ask a parent one real question', 'Skip the weather and the logistics. Ask one question that matters, and listen to the answer. If your parents are gone, ask someone who knew them.'),
      P('once', 'Map your energy', 'List everyone who comes to mind. For each: their best quality, and whether time with them leaves you energised or drained. Who you forget might be telling in itself.'),
    ],
    extras: [
      P('once', 'Make the call you keep putting off', 'Someone keeps coming to mind and you keep not calling. There isn’t a better moment. The call is almost always shorter and easier than the weeks of meaning to.'),
      P('once', 'Ask how you show up', 'Pick one or two people close to you and ask how they experience you in the relationship. Then listen. It’s the quickest way to deepen a friendship that already works.'),
    ],
  },
  {
    what: 'Not a perfect split between work and life, but flow: harmony between the demands of work and the richness of life outside it. A good relationship with whoever you answer to, enough time to do the work well, a sense of purpose, and a hand on your next step.',
    quote: 'Some days may require more energy on the work front, while others may allow for deeper personal pursuits.',
    bands: {
      low: 'Work may be owning more of you than it should right now. When it does, life thins. Start with one clear next step: direction restores energy faster than more effort does.',
      mid: 'Work is mostly working. Look at the answer that came in lowest, whether it’s time, purpose, your manager or your next step. That’s usually where the energy is leaking.',
      high: 'Work and life are flowing. You have purpose, room to do things well and a say in where you go next. Keep the boundaries that protect it, like a clear end to the working day.',
    },
    tips: [
      P('once', 'Ask for ten minutes', 'Nobody can help with what they can’t see. Ask whoever you answer to for ten minutes, not a big conversation. Bring the facts and your own part in it, and open it up.'),
      P('once', 'Say no to one thing', 'A full plate is thirty small yeses. One clean no gives real time back, and the friction lasts about a minute. “I can’t take this on” is a complete sentence.'),
      P('once', 'Map your impact', 'What do your daily tasks support: your team, your customers, your community? Write a few sentences that connect your role to something bigger. It doesn’t need to be grand.'),
      P('once', 'Write what you actually want', 'Ten minutes, editor off: what you naturally excel at, what you value, and what you want next, short term and long term. Judge it later; first get it on paper.'),
    ],
    extras: [
      P('week', 'Plan the week ahead', 'Block your work hours and fixed commitments, then put in what matters: exercise, people, rest, deep work. If it’s scheduled, it’s more likely to happen.'),
      P('day', 'End the workday on time', 'Clear start and finish times, even at home, then ten minutes to decompress before the evening. The work will still be there tomorrow.'),
    ],
  },
];

/**
 * Up to three practices for a pillar page: first the ones that answer the
 * questions that came in lowest (No, Not really or skipped), then the extras,
 * then the remaining questions, so every page has three.
 */
export function pickPractices(i: number, answers: number[], rel: Relationship): Practice[] {
  const copy = PILLAR_COPY[i];
  const tips = rel === 'single' && copy.tipsSingle ? copy.tipsSingle : copy.tips;
  const level = (a: number) => (a < 0 ? 1 : a);
  const byAnswer = answers.map((a, k) => k).sort((x, y) => level(answers[x]) - level(answers[y]));
  const low = byAnswer.filter((k) => level(answers[k]) <= 1).map((k) => tips[k]);
  const rest = byAnswer.filter((k) => level(answers[k]) > 1).map((k) => tips[k]);
  return [...low, ...copy.extras, ...rest].slice(0, 3);
}

export const TOOLKIT = {
  eyebrow: 'Keep your cup filled',
  title: 'A strong habit in every pillar is your safety net.',
  lead: 'Life will throw a curveball: a loss, a restructure, a hard month. Habits are like safety nets. When one pillar gives way, the others keep filling the cup, as long as you keep them going. Everything in this report fits into a few kinds of work, and you can do all of it with a notebook and a calendar.',
  tools: [
    P('now', 'Reset when it all gets too much', 'When stress, anxiety or anger takes over, a few minutes of breathwork or meditation brings the body back down. Box breathing, two long sighs, a three-minute pause, a walk with the phone away.'),
    P('day', 'Talk it out', 'Write down or say out loud what’s going round your head, for five minutes. Once it’s outside you, you can see the pattern and your own part in it, and decide properly.'),
    P('day', 'Three good things', 'Each day, note three things you’re grateful for. It trains your attention towards what’s already working.'),
    P('week', 'One habit per pillar', 'A walk after lunch, ten pages, a date night, a weekly catch-up, a clear end to the working day. Start small, pair each with something you already do, and track it: the longer the streak, the harder it is to break.'),
    P('once', 'The one-off steps', 'Some things only need doing once: a values conversation with your partner, mapping who drains you and who lifts you, the appointment, the honest no. Keep a short list and tick them off.'),
    P('month', 'Check in every month', 'The same twenty questions, once a month, and compare. If you can see it, you can manage it.'),
  ],
};

/** The toolkit again, as it works in the app, in the toolkit's order. */
export const IN_NORMA: { kind: Kind; byHand: string; app: string; text: string }[] = [
  { kind: 'now', byHand: 'Remembering to breathe', app: 'Reset', text: 'Pick how you feel and get two or three practices of a few minutes.' },
  { kind: 'day', byHand: 'A notebook', app: 'Reflect', text: 'Write or talk it out. Spoken entries are written down for you.' },
  { kind: 'day', byHand: 'Three things before bed', app: 'Gratitude', text: 'An evening nudge: “Today I’m grateful for…”.' },
  { kind: 'week', byHand: 'A tick list on the fridge', app: 'Habits', text: 'One per pillar, with the streak in view.' },
  { kind: 'once', byHand: 'A list of one-off steps', app: 'Growth work', text: 'From the values conversation to the call you keep putting off.' },
  { kind: 'month', byHand: 'This check-in, again', app: 'Check-in', text: 'The same twenty questions every month, and what moved.' },
];

export const GLANCE = {
  quote: 'Think of it like taking your temperature: a quick snapshot of your current state that highlights the areas that might need some attention.',
  support: 'This report is a snapshot, not a diagnosis. If you’re finding things hard, please talk to someone you trust, your doctor or a local support line. You will be heard.',
};
