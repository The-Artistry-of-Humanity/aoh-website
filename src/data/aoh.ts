// Shared content for the AOH site. Keynotes, testimonials and the client list
// come from Ian's speaker profile and proposals (Claude Design, Oct 2026), with
// the headshots used there; the pillars and the Sherpany results from the
// previous site.

/** Ian's showreel on YouTube ("Watch Ian live"). */
export const VIDEO = 'iV0k9AT4i3U';

export const CLIENTS = ['Cisco', 'DHL', 'Qantas', 'Datasite', 'Boston Scientific', 'Northrop', 'USI Insurance Services', 'McPhee Distribution Services'];

export const KEYNOTES = [
  {
    title: 'The Art of Being Human', tag: 'Signature', sub: 'Resilience, inside out', img: '/assets/keynote.jpg',
    hook: 'Resilience isn’t the ability to endure more pressure. It’s understanding ourselves, managing our capacity and owning how we respond.',
    text: 'Resilience isn’t the ability to endure more pressure. It’s understanding ourselves, managing our capacity, recovering intentionally and owning how we respond. Audiences score themselves live against the Five Pillars of Fulfilment.',
    leave: ['A framework for navigating pressure', 'An honest picture of their life across the Five Pillars', 'A nervous-system reset they can use anytime'],
  },
  {
    title: 'The Energy Effect', tag: 'Keynote', sub: 'Own it. Protect it. Elevate it.', img: '/assets/keynote-energy.png',
    hook: 'Who, or what, is stealing your energy? How energy is gained, drained and transferred, and how it becomes culture.',
    text: 'Who, or what, is stealing your energy? Starting with Energy Vampires and Energy Boosters, this lively session shows how energy is gained, drained and transferred, and how individual energy becomes collective culture.',
    leave: ['A clear read on their energy drains and boosters', 'Practical ways to protect their capacity', 'What leaders do to lift a whole team'],
  },
  {
    title: 'The Gold in the Cracks', tag: 'Keynote', sub: 'Inspired by kintsugi', img: '/assets/keynote-kintsugi.png',
    hook: 'Our cracks can become a source of strength, and leaders decide whether people feel safe enough to show them.',
    text: 'Our cracks can become a source of strength. Contrasting kintsugi with karōshi, this session examines the role leaders play in creating environments where people feel seen, heard and safe to speak honestly.',
    leave: ['Why hiding the cracks costs more than showing them', 'How to use vulnerability appropriately at work', 'The warning signs a culture is missing'],
  },
];

export const BOOK_IAN = [
  { icon: 'open', title: 'A room that opens up', text: 'Ian goes first with his own story, hard parts included, and that gives people permission to be honest too. Polite rooms end up laughing, reflecting and saying things they didn’t expect to.' },
  { icon: 'pulse', title: 'Emotion and substance', text: 'Thirty years in operational leadership means Ian speaks the language of performance as fluently as the language of people. Audiences feel something; leaders get something they can defend in a boardroom.' },
  { icon: 'loop', title: 'Something that outlasts the day', text: 'Most keynotes are forgotten by Monday. Ian leaves people with a framework and one clear action, so the conversation carries on long after he’s left the stage.' },
  { icon: 'tune', title: 'Shaped around your room', text: 'No two sessions are the same. Ian tailors every keynote to your audience and context, then reads the room live and adapts.' },
] as const;

/** Testimonials as approved for the site (28 Oct 2026), with headshots.
 *  `hl` is the phrase the lime highlighter marks; `short` is a second, shorter
 *  line from the same person (from Ian's Kogan and Zimmer Biomet proposals). */
export const TESTIMONIALS = [
  { name: 'Andrea Formella', org: 'Strategy Manager, Qantas', img: '/assets/people/andrea-formella.webp', hl: 'absolutely contagious', quote: 'His energy is absolutely contagious.' },
  { name: 'Andreas Bicking', org: 'Head of eCommerce, DHL Supply Chain', img: '/assets/people/andreas-bicking.webp', hl: 'positive energy', quote: 'I have never met a person with Ian’s level of positive energy and the gift to engage others.' },
  { name: 'Dario Jozipovic', org: 'National General Manager, McPhee Distribution Services', img: '/assets/people/dario-jozipovic.webp', hl: 'better than yesterday', quote: 'Ian has the knack to inspire every individual to become better than yesterday. Not just professionally but also in life!' },
  { name: 'Cassie Fleming', org: 'APJC Talent Acquisition Director, Cisco', img: '/assets/people/cassie-fleming.webp', hl: 'cares deeply', quote: 'Ian is an incredibly experienced, genuine and skilled leader and facilitator who cares deeply about enabling individuals and teams to be their best… Big thank you to Ian for the great work he is doing and impact it had on our team.' },
  { name: 'Sorin Popa', org: 'VP of Engineering, Datasite', img: '/assets/people/sorin-popa.webp', hl: 'a genuine shift', quote: 'This wasn’t another wellbeing workshop. It was a genuine shift in how our leadership team thinks about culture, people, and performance.' },
  { name: 'Cassie Fleming', org: 'APJC Talent Acquisition Director, Cisco', img: '/assets/people/cassie-fleming.webp', hl: 'unlike anything', quote: 'A corporate workshop experience unlike anything I’ve experienced before.', short: true },
];

/** The five ways to work with us, for the menu, the home page and /what-we-do. */
export const SERVICES = [
  { href: '/what-we-do/keynotes-workshops', icon: 'mic', title: 'Keynotes & workshops', line: 'Ian on stage, or with one team for a half or full day.' },
  { href: '/what-we-do/masterclass', icon: 'board', title: 'Masterclass', line: '60–90 minutes with your leadership team.' },
  { href: '/what-we-do/wellness-accelerator', icon: 'climb', title: 'Wellness Accelerator', line: 'Six weeks, one pillar at a time.' },
  { href: '/what-we-do/leadership-coaching', icon: 'talk', title: 'Leadership coaching', line: '1:1, for leaders who want to model the change.' },
  { href: '/what-we-do/culture-consulting', icon: 'compass', title: 'Culture consulting', line: 'When the culture itself needs work.' },
] as const;

/** The five pillars, with the nørma app's own icons (24×24 line art, from
 *  apps/mobile PillarIcon.tsx) and tints (design-system pillarTints). */
export const PILLARS = [
  { key: 'health', name: 'Health & Fitness', tint: '#9FD6AB', short: 'Physical vitality as the foundation: energy, movement and the body–mind connection.',
    paths: ['M13 4.5a1.5 1.5 0 1 0 0-.01', 'M9 20l2-6 3 2v5', 'M7 11l3-3 3 1 2 3 3 1'] },
  { key: 'internal', name: 'Internal Work', tint: '#B9B2E8', short: 'Self-awareness, emotional regulation, purpose and identity. How we show up.',
    paths: ['M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z', 'M12 6v13.5'] },
  { key: 'love', name: 'Love & Relationships', tint: '#EBAFA6', short: 'The quality of our closest connections, and their effect on everything we do.',
    paths: ['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'] },
  { key: 'social', name: 'Social Connection', tint: '#EFD19A', short: 'Community, friendship and belonging beyond our innermost circle.',
    paths: ['M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M3.5 19c0-3 2.5-4.8 5.5-4.8s5.5 1.8 5.5 4.8', 'M16 11a2.5 2.5 0 1 0 0-5', 'M17 14.5c2 .4 3.5 1.9 3.5 4.5'] },
  { key: 'flow', name: 'Work & Life Flow', tint: '#9CCFDD', short: 'Not balance but integration: ambition and fulfilment reinforcing each other.',
    paths: ['M4 12c2-3 4-3 6 0s4 3 6 0 3-3 4-2', 'M4 17c2-3 4-3 6 0s4 3 6 0 3-3 4-2', 'M4 7c2-3 4-3 6 0s4 3 6 0 3-3 4-2'] },
];

/** Sherpany by Datasite, Wellness Accelerator: Fulfilment Scores at the start
 *  and after six weeks, read off the session screenshot (sherpany-scores.png).
 *  Only the leaders whose before and after scores are both visible; Ian's own
 *  tile is left out. */
export const SHERPANY_SCORES: [number, number][] = [[48, 62], [67, 86], [28, 59], [78, 80], [29, 68]];
